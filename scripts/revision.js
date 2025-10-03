// scripts/revision.js
const fs = require("fs");
const path = require("path");

// Use timestamp (or git hash if you prefer)
const revision = Date.now().toString();
const file = path.join(__dirname, "../revision.json");

fs.writeFileSync(file, JSON.stringify({ revision }, null, 2));

console.log("Revision updated:", revision);
