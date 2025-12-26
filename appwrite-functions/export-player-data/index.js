import { Client, Databases, Users, Query } from "node-appwrite";

export default async ({ req, res }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const users = new Users(client);

    // 1️⃣ Ensure user is logged in
    const userId = req.headers["x-appwrite-user-id"];
    if (!userId) {
      return res.json({ error: "Unauthorized" }, 401);
    }

    // 2️⃣ Check admin team
    const caller = await users.get(userId);
    const isAdmin = caller.teams?.some(t => t.name === "admin");
    if (!isAdmin) {
      return res.json({ error: "Access denied" }, 403);
    }

    // 3️⃣ Build CSVs in memory
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
    const collections = await databases.listCollections(DATABASE_ID);

    const files = [];

    for (const col of collections.collections) {
      let all = [];
      let lastId = null;

      while (true) {
        const queries = [Query.limit(100)];
        if (lastId) queries.push(Query.cursorAfter(lastId));

        const docs = await databases.listDocuments(
          DATABASE_ID,
          col.$id,
          queries
        );

        if (!docs.documents.length) break;

        all.push(...docs.documents);
        lastId = docs.documents.at(-1).$id;
        if (docs.documents.length < 100) break;
      }

      if (all.length) {
        const headers = Object.keys(all[0]);
        const csv = [
          headers.join(","),
          ...all.map(r =>
            headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
          )
        ].join("\n");

        files.push({
          name: `${col.name}.csv`,
          content: csv
        });
      }
    }

    return res.json({ files });

  } catch (err) {
    return res.json({ error: err.message }, 500);
  }
};
