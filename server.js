import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const TOKEN = process.env.COC_TOKEN;

// Debug log for token
console.log("COC_TOKEN:", TOKEN ? "✅ Loaded" : "❌ MISSING!");

// Welcome page for "/"
app.get("/", (req, res) => {
  res.send("✅ COC Proxy is running! Use /v1/... for Clash API or /checkip to get IP.");
});

// Clash API Proxy route
app.get("/v1/*", async (req, res) => {
  try {
    // Check if token is missing
    if (!TOKEN) {
      return res.status(401).json({
        error: "Missing COC_TOKEN",
        details: "Please set COC_TOKEN environment variable in Render"
      });
    }

    const url = `https://api.clashofclans.com/${req.url}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    // If Clash API returns error (e.g., 403 or 404)
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: `Clash API Error: ${response.status}`,
        details: text || "No response body"
      });
    }

    // Parse and send JSON
    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: "Proxy Server Error",
      details: err.message
    });
  }
});

// Check current IP
app.get("/checkip", async (req, res) => {
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const data = await ipRes.json();
    res.json({ current_ip: data.ip });
  } catch (err) {
    res.status(500).json({ error: "Failed to get IP", details: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Proxy running on ${PORT}`));
