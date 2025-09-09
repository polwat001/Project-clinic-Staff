// scrapeDrugInfo.cjs

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ------------------ CONFIG ------------------
const BASE = "https://drug.fda.moph.go.th";
const DEFAULT_URL = `${BASE}/drug-information`;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36 DrugScraper/1.0";

// ------------------ UTILS -------------------
function absolutize(href, base = BASE) {
  if (!href) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url, { timeout = 20000, retries = 2, delayMs = 800 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await axios.get(url, {
        timeout,
        headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
        // ถ้าเว็บต้องการ language/cookie header ค่อยเพิ่มทีหลัง
      });
      return res.data;
    } catch (e) {
      lastErr = e;
      if (i < retries) await sleep(delayMs);
    }
  }
  throw lastErr;
}


function parseDrugTable(html, pageUrl = DEFAULT_URL) {
  const $ = cheerio.load(html);

  // เลือกตารางหลัก - ส่วนใหญ่จะเป็นตัวแรกในหน้า
  const $table = $("table").first();
  if ($table.length === 0) return [];

  const rows = [];
  $table.find("tr").each((_, tr) => {
    const $tds = $(tr).find("td");
    // ข้ามหัวตารางหรือแถวที่ไม่มีข้อมูล
    if ($tds.length < 4) return;

    const cellText = (i) => ($tds.eq(i).text() || "").replace(/\s+/g, " ").trim() || null;
    const cellLink = (i) => {
      // ส่วนใหญ่ PIL/SmPC จะเป็น <a href="...">ไอคอน/ข้อความ</a>
      const a = $tds.eq(i).find("a[href]");
      if (a.length) return absolutize(a.attr("href"), pageUrl);
      // เผื่อกรณีเป็นรูปหรือ onclick: ดึง href จาก HTML ดิบ
      const raw = $tds.eq(i).html() || "";
      const m = raw.match(/href\s*=\s*["']([^"']+)["']/i);
      return m ? absolutize(m[1], pageUrl) : null;
    };

    // map คอลัมน์แบบ defensive
    const noRaw = cellText(0);
    const no = noRaw ? parseInt(noRaw.replace(/[^\d]/g, ""), 10) : null;
    const name = cellText(1);
    const dosageForm = cellText(2);
    const strength = cellText(3);

    const pilUrl = $tds.length > 4 ? cellLink(4) : null;
    const pilUpdated = $tds.length > 5 ? cellText(5) : null;
    const smpcUrl = $tds.length > 6 ? cellLink(6) : null;
    const smpcUpdated = $tds.length > 7 ? cellText(7) : null;

    // กรองแถวว่างจริง ๆ
    if (name || pilUrl || smpcUrl) {
      rows.push({
        no,
        name,
        dosageForm,
        strength,
        pilUrl,
        pilUpdated,
        smpcUrl,
        smpcUpdated,
      });
    }
  });

  return rows;
}

// ------------------ PAGINATION (ออปชัน) -------------------

async function scrapeAllPages(startUrl = DEFAULT_URL, { maxPages = 20 } = {}) {
  const seen = new Set();
  const all = [];
  let url = startUrl;

  for (let page = 1; url && page <= maxPages; page++) {
    if (seen.has(url)) break;
    seen.add(url);

    const html = await fetchHtml(url);
    const items = parseDrugTable(html, url);
    all.push(...items);

    // หา next link (เดาถ้อยคำได้ทั้ง 'ถัดไป' หรือ 'Next')
    const $ = cheerio.load(html);
    let nextHref =
      $("a:contains('ถัดไป')").attr("href") ||
      $("a:contains('Next')").attr("href") ||
      $("li.active + li a").attr("href") ||
      null;

    url = nextHref ? absolutize(nextHref, url) : null;

    // สุภาพต่อเซิร์ฟเวอร์หน่อย
    if (url) await sleep(800);
  }

  return all;
}

// ------------------ CLI -------------------
function parseArgs(argv) {
  const args = { url: DEFAULT_URL, out: null, all: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url" && argv[i + 1]) {
      args.url = argv[++i];
    } else if (a === "--out" && argv[i + 1]) {
      args.out = argv[++i];
    } else if (a === "--all") {
      args.all = true;
    }
  }
  return args;
}

async function main() {
  const { url, out, all } = parseArgs(process.argv);

  let data;
  if (all) {
    data = await scrapeAllPages(url);
  } else {
    const html = await fetchHtml(url);
    data = parseDrugTable(html, url);
  }

  const json = JSON.stringify({ source: url, count: data.length, data }, null, 2);

  if (out) {
    const outPath = path.resolve(process.cwd(), out);
    fs.writeFileSync(outPath, json, "utf8");
    console.log(`✅ Saved ${data.length} rows to ${outPath}`);
  } else {
    console.log(json);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("❌ Error:", err?.message || err);
    process.exit(1);
  });
}

// ------------------ EXPORTS (ถ้าจะ import ใช้ที่อื่น) -------------------
module.exports = {
  fetchHtml,
  parseDrugTable,
  scrapeAllPages,
};
