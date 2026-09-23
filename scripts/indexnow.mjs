#!/usr/bin/env node
/**
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver, and others) which pages just changed.
 * Google does not use IndexNow; Google reads the sitemap instead.
 *
 *   BEFORE=<old sha> AFTER=<new sha> node scripts/indexnow.mjs
 *
 * Free, no account. The key file must be live at https://fordfrontierinvestments.com/<KEY>.txt
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const SITE_HOST = "fordfrontierinvestments.com";
const OUT = "files/ffi-website";
const keyFile = readdirSync(OUT).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) { console.log("No IndexNow key file found; skipping."); process.exit(0); }
const KEY = readFileSync(`${OUT}/${keyFile}`, "utf8").trim();

// URLs that are in the sitemap right now
const inSitemap = new Set();
for (const f of readdirSync(OUT).filter((f) => /^sitemap-.*\.xml$/.test(f))) {
  for (const m of readFileSync(`${OUT}/${f}`, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) inSitemap.add(m[1]);
}

// Pages changed by this push
let changed = [];
const { BEFORE, AFTER } = process.env;
try {
  const range = BEFORE && !/^0+$/.test(BEFORE) ? [`${BEFORE}`, `${AFTER || "HEAD"}`] : ["HEAD~1", "HEAD"];
  changed = execFileSync("git", ["diff", "--name-only", ...range, "--", OUT], { encoding: "utf8" })
    .split("\n").filter((f) => f.endsWith(".html"));
} catch { /* fall through */ }
const urls = changed.map((f) => {
  const rel = f.slice(OUT.length + 1);
  return `https://${SITE_HOST}/` + (rel === "index.html" ? "" : rel.replace(/\/index\.html$/, "/"));
}).filter((u) => inSitemap.has(u));

if (!urls.length) { console.log("No sitemap pages changed; nothing to send."); process.exit(0); }
const body = { host: SITE_HOST, key: KEY, keyLocation: `https://${SITE_HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) };
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body),
});
console.log(`IndexNow: sent ${urls.length} URL(s), HTTP ${res.status}`);
urls.forEach((u) => console.log("  " + u));
// 200/202 = accepted. Anything else is logged but never fails the workflow.
