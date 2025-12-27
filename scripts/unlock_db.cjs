/* eslint-disable */
// unlock_db.cjs
require('dotenv').config({ path: '../.env' }); // Look for .env in the parent folder
const { Client, Databases, Permission, Role } = require('node-appwrite');

const client = new Client()
  .setEndpoint(`https://${process.env.APPWRITE_HOSTNAME}/v1`)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

async function unlockCollections() {
  console.log('🔓 RESTORING ACCESS to Database:', DATABASE_ID);

  try {
    const cols = await databases.listCollections(DATABASE_ID);

    for (const c of cols.collections) {
      console.log(`Fixing: ${c.name}...`);

      // LOGIC: 
      // 1. "Lessons" should be READ-ONLY for users (so they can't delete lessons).
      // 2. "UserProgress" & "Performance" need READ + WRITE (so they can save scores).
      
      let permissions = [];

      if (c.name.toLowerCase().includes('lesson')) {
          // LESSONS: Admins can do everything. Users can only READ.
          permissions = [
              Permission.read(Role.users()),      // RESTORED: Regular users can see lessons
              Permission.read(Role.team('admins')), // Admins
              Permission.write(Role.team('admins')),
              Permission.create(Role.team('admins')),
              Permission.update(Role.team('admins')),
              Permission.delete(Role.team('admins')),
          ];
      } else {
          // USER DATA: Users need to Read/Write their own progress
          permissions = [
              Permission.read(Role.users()),    // RESTORED
              Permission.create(Role.users()),  // RESTORED
              Permission.update(Role.users()),  // RESTORED
              Permission.delete(Role.users()),  // RESTORED
          ];
      }

      await databases.updateCollection(
        DATABASE_ID,
        c.$id,
        c.name,
        permissions
      );
      console.log(`   ✅ RESTORED`);
    }
    console.log('\n🎉 App permissions fixed! Regular users can play again.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

unlockCollections();