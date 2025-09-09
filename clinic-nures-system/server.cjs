// server.cjs
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const BASE = "https://drug.fda.moph.go.th";
const PAGE_URL = `${BASE}/drug-information`;

function absolutize(href) {
  if (!href) return null;
  try { return new URL(href, BASE).href; } catch { return null; }
}

async function fetchDrugInfoPage(url = PAGE_URL) {
  const { data: html } = await axios.get(url, {
    timeout: 20000,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; DrugScraper/1.0)",
      "Accept": "text/html,application/xhtml+xml",
    },
  });
  const $ = cheerio.load(html);
  const $table = $("table").first();
  if ($table.length === 0) return [];
  const rows = [];

  $table.find("tr").each((_, tr) => {
    const $tds = $(tr).find("td");
    if ($tds.length < 4) return;

    const getText = (i) => ($tds.eq(i).text() || "").trim() || null;
    const getLink = (i) => {
      const a = $tds.eq(i).find("a[href]");
      if (a.length) return absolutize(a.attr("href"));
      const html = $tds.eq(i).html() || "";
      const m = html.match(/href\s*=\s*["']([^"']+)["']/i);
      return m ? absolutize(m[1]) : null;
    };

    const noRaw = getText(0);
    const no = noRaw ? parseInt(noRaw.replace(/[^\d]/g, ""), 10) : null;
    const name = getText(1);
    const dosageForm = getText(2);
    const strength = getText(3);
    const pilUrl = $tds.length > 4 ? getLink(4) : null;
    const pilUpdated = $tds.length > 5 ? getText(5) : null;
    const smpcUrl = $tds.length > 6 ? getLink(6) : null;
    const smpcUpdated = $tds.length > 7 ? getText(7) : null;

    if (name || pilUrl || smpcUrl) {
      rows.push({ no, name, dosageForm, strength, pilUrl, pilUpdated, smpcUrl, smpcUpdated });
    }
  });

  return rows;
}

const app = express();
app.use(cors());

app.get("/api/drugs", async (req, res) => {
  try {
    const data = await fetchDrugInfoPage();
    res.json({ count: data.length, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true, message: e?.message || "failed" });
  }
});

app.post("/api/appts", express.json(), async (req, res) => {
  // ตัวอย่าง mock response
  const { patient_id, reason, start_at, end_at } = req.body;
  if (!patient_id || !reason || !start_at || !end_at) {
    return res.status(400).json({ error: true, message: "Missing fields" });
  }
  // สร้าง mock id
  const id = Math.random().toString(36).slice(2, 10);
  res.json({
    id,
    patient_id,
    reason,
    start_at,
    end_at,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Drug scraper API running at http://localhost:" + PORT);
});
