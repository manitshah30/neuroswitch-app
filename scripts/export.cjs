/* eslint-disable */
// scripts/export.cjs
// FINAL EXPORTER — WITH PATH DEBUG LOGS (STEP 1)

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Databases, Users, Query } = require('node-appwrite');

console.log('🔥 SDK EXPORT SCRIPT RUNNING 🔥');

// ---------- DEBUG: PATH INFO ----------
console.log("📁 EXPORT SCRIPT __dirname =", __dirname);
console.log("📁 EXPORT SCRIPT cwd =", process.cwd());

// ---------- Appwrite Client ----------
const client = new Client()
  .setEndpoint(`https://${process.env.APPWRITE_HOSTNAME}/v1`)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const usersApi = new Users(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// ---------- EXPORT DIRECTORY ----------
const EXPORT_DIR = path.join(process.cwd(), 'exports');
console.log("📁 EXPORT DIR USED =", EXPORT_DIR);

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  console.log("📁 EXPORT DIR CREATED");
}

// ---------- CSV helpers ----------
function csvEscape(val) {
  if (val === null || val === undefined) return '""';
  if (typeof val === 'object') val = JSON.stringify(val);
  return `"${String(val).replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [];
  lines.push(headers.map(csvEscape).join(','));
  for (const r of rows) {
    lines.push(headers.map(h => csvEscape(r[h])).join(','));
  }
  return lines.join('\n');
}

// ---------- Export one collection ----------
async function exportCollection(collectionId, name) {
  let all = [];
  let lastId = null;

  while (true) {
    const queries = [Query.limit(100)];

    if (lastId) {
      queries.push(Query.cursorAfter(lastId));
    }

    const res = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      queries
    );

    if (!res.documents.length) break;

    all.push(...res.documents);
    lastId = res.documents[res.documents.length - 1].$id;

    if (res.documents.length < 100) break;
  }

  console.log(`   ✅ ${all.length} records fetched`);

  const filePath = path.join(EXPORT_DIR, `${name}.csv`);
  fs.writeFileSync(filePath, toCsv(all));
  console.log("📝 WROTE FILE:", filePath);
}

// ---------- MAIN ----------
async function run() {
  console.log('📋 Fetching collections...\n');

  const cols = await databases.listCollections(DATABASE_ID);

  for (const c of cols.collections) {
    console.log(`📥 ${c.name}`);
    await exportCollection(c.$id, c.name);
  }

  console.log('\n📥 Exporting users...');
  const users = await usersApi.list();
  const usersPath = path.join(EXPORT_DIR, 'AuthUsers.csv');
  fs.writeFileSync(usersPath, toCsv(users.users));
  console.log("📝 WROTE FILE:", usersPath);

  console.log('\n✅ EXPORT COMPLETE — ALL ROWS INCLUDED');
}

run().catch(err => {
  console.error('❌ Export failed:', err.message || err);
});
