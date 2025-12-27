/* eslint-disable */
import { Client, Databases, Users, Query } from 'node-appwrite';
import AdmZip from 'adm-zip';

// Initialize Appwrite
// Note: Vercel serverless functions use process.env
const client = new Client()
    .setEndpoint(`https://${process.env.APPWRITE_HOSTNAME}/v1`)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const usersApi = new Users(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// Helper: Convert Array to CSV String
function toCsv(rows) {
    if (!rows || !rows.length) return '';
    const headers = Object.keys(rows[0]);
    const csvRows = rows.map(row =>
        headers.map(fieldName => {
            const val = row[fieldName];
            const stringVal = (val === null || val === undefined) ? '' : String(val);
            return `"${stringVal.replace(/"/g, '""')}"`; 
        }).join(',')
    );
    return [headers.join(','), ...csvRows].join('\n');
}

// Helper: Fetch all docs
async function fetchAllDocuments(collectionId) {
    let allDocs = [];
    let lastId = null;
    
    while (true) {
        const queries = [Query.limit(100)];
        if (lastId) queries.push(Query.cursorAfter(lastId));

        const response = await databases.listDocuments(DATABASE_ID, collectionId, queries);
        if (response.documents.length === 0) break;

        allDocs.push(...response.documents);
        lastId = response.documents[response.documents.length - 1].$id;
        
        if (response.documents.length < 100) break;
    }
    return allDocs;
}

// The Main Handler
export default async function handler(req, res) {
    console.log("🔥 Export started...");

    try {
        const zip = new AdmZip();

        // 1. Fetch Collections
        const colList = await databases.listCollections(DATABASE_ID);
        
        for (const col of colList.collections) {
            console.log(`Fetching ${col.name}...`);
            const docs = await fetchAllDocuments(col.$id);
            const csv = toCsv(docs);
            // Add CSV to Zip (using Buffer)
            zip.addFile(`${col.name}.csv`, Buffer.from(csv, "utf8"));
        }

        // 2. Fetch Users
        console.log(`Fetching Users...`);
        const userList = await usersApi.list();
        const usersCsv = toCsv(userList.users);
        zip.addFile("AuthUsers.csv", Buffer.from(usersCsv, "utf8"));

        // 3. Send Zip
        const zipBuffer = zip.toBuffer();
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=Client_Data_Export.zip');
        res.status(200).send(zipBuffer);

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ error: error.message });
    }
}