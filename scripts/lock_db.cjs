/* eslint-disable */
// lock_db.cjs
require('dotenv').config({ path: '../.env' });
const { Client, Databases, Permission, Role } = require('node-appwrite');

// 1. Setup (Uses your existing .env variables)
const client = new Client()
  .setEndpoint(`https://${process.env.APPWRITE_HOSTNAME}/v1`)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// 🛑 PASTE YOUR TEAM ID HERE (From Appwrite Console > Auth > Teams)
const TEAM_ID = '6949a667003e0c821f57'; 

async function lockAllCollections() {
  console.log('🔒 Locking all collections in Database:', DATABASE_ID);

  try {
    // Fetch all collections automatically
    const cols = await databases.listCollections(DATABASE_ID);

    for (const c of cols.collections) {
      console.log(`Processing: ${c.name} (${c.$id})...`);

      // Update permissions:
      // - Removes "Any" or "Users" (Public access)
      // - Adds "Team" (Only the team you created can read)
      await databases.updateCollection(
        DATABASE_ID,
        c.$id,
        c.name,
        [
            Permission.read(Role.team(TEAM_ID)), // Only Admins can read
            // We don't add Write permissions here to keep it safe, 
            // but your API Key will still have full access.
        ]
      );
      console.log(`   ✅ LOCKED`);
    }
    console.log('\n🎉 All tables secured! Regular users can no longer access this data directly.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('HINT: Did you verify the TEAM_ID variable?');
  }
}

lockAllCollections();