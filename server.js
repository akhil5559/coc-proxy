import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const TOKEN = process.env.COC_TOKEN; // Clash API Token from Render Environment Variable

// Clash API Proxy route
app.get("/v1/*", async (req, res) => {
  try {
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

// Start server
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
