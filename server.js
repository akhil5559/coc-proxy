import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const TOKEN = process.env.COC_TOKEN; // set in Render dashboard

// Clash API proxy route
app.get("/v1/*", async (req, res) => {
  try {
    const url = `https://api.clashofclans.com/${req.url}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Check current IP
app.get("/checkip", async (req, res) => {
  const ipRes = await fetch("https://api.ipify.org?format=json");
  const data = await ipRes.json();
  res.json({ current_ip: data.ip });
});

app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));