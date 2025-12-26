import React, { useEffect, useState } from "react";
import { account } from "../appwrite/config";

// 🔐 Admin emails (same as Step 1)
const ADMIN_EMAILS = [
  "shahmanit30@gmail.com",     // developer
  "kezazfamitha19psy007@gmail.com"   // client
];

export default function AdminExport() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  // ------------------------------------------------
  // STEP 1: Verify admin on frontend
  // ------------------------------------------------
  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await account.get();
        console.log("Logged in user:", user.email);

        if (ADMIN_EMAILS.includes(user.email)) {
          setAuthorized(true);
        } else {
          setError("You are not authorized.");
        }
      } catch (err) {
        console.error(err);
        setError("Not logged in.");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  // ------------------------------------------------
  // STEP 2: Download all CSV files
  // ------------------------------------------------
  const downloadAll = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5050/export");
      const data = await res.json();

      if (!data.files || data.files.length === 0) {
        throw new Error("No files returned");
      }

      // Trigger download for each CSV
      data.files.forEach((file) => {
        const a = document.createElement("a");
        a.href = `http://localhost:5050${file.url}`;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    } catch (err) {
      console.error(err);
      setError("Export failed");
    }
  };

  // ------------------------------------------------
  // UI STATES
  // ------------------------------------------------
  if (loading) {
    return <p style={{ color: "white" }}>Checking access…</p>;
  }

  if (!authorized) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Admin Data Export</h1>
      <p>✅ Admin verified</p>

      <button
        onClick={downloadAll}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Download All CSV Files
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
