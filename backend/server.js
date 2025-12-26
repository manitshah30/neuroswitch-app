import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5050;

// ---------- Fix __dirname ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Project paths ----------
const PROJECT_ROOT = path.join(__dirname, ".."); // D:\neuroswitch-app
const EXPORT_SCRIPT = path.join(PROJECT_ROOT, "scripts", "export.cjs");
const EXPORT_DIR = path.join(PROJECT_ROOT, "exports");

// Debug logs
console.log("📁 PROJECT_ROOT =", PROJECT_ROOT);
console.log("📁 EXPORT_SCRIPT =", EXPORT_SCRIPT);
console.log("📁 EXPORT_DIR =", EXPORT_DIR);

// ---------- Middleware ----------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ------------------------------------------------
// EXPORT ENDPOINT
// ------------------------------------------------
app.get("/export", (req, res) => {
  console.log("➡️ Export request received");

  exec(
    `node "${EXPORT_SCRIPT}"`,
    { cwd: PROJECT_ROOT }, // 🔑 THIS IS THE FIX
    (error) => {
      if (error) {
        console.error("❌ Export script failed:", error);
        return res.status(500).json({ error: "Export failed" });
      }

      console.log("✅ Export script executed");

      if (!fs.existsSync(EXPORT_DIR)) {
        console.error("❌ Export directory not found");
        return res.json({ files: [] });
      }

      const files = fs
        .readdirSync(EXPORT_DIR)
        .filter((file) => file.endsWith(".csv"))
        .map((file) => ({
          name: file,
          url: `/download/${file}`,
        }));

      console.log("📄 CSV FILES FOUND:", files);

      return res.json({ files });
    }
  );
});

// ------------------------------------------------
// FILE DOWNLOAD ROUTE
// ------------------------------------------------
app.get("/download/:file", (req, res) => {
  const filePath = path.join(EXPORT_DIR, req.params.file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
