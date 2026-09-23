#!/usr/bin/env node
/**
 * FFI sitemap builder + site crawl audit.
 *
 *   node scripts/build-sitemap.mjs            # write sitemaps + docs/SITEMAP-REPORT.md
 *   node scripts/build-sitemap.mjs --check    # audit only, write nothing; exit 1 on broken links
 *
 * What it does
 *  1. Finds every .html page the site serves (Vercel outputDirectory: files/ffi-website).
 *  2. Leaves out pages that must not be in Google: noindex pages, pages whose canonical points
 *     elsewhere, cart/checkout/thank-you pages, and /admin/.
 *  3. Dates each page (<lastmod>) from the last git commit that changed it, so Google only sees a
 *     new date when the page really changed. Blog posts use their own dateModified when it's newer.
 *  4. Writes a sitemap index (sitemap.xml) pointing to section sitemaps:
 *       sitemap-pages.xml  (home, services, cities, industries, company pages)
 *       sitemap-atms.xml   (ATM store: buy page, model pages, buying guides)
 *       sitemap-blog.xml   (blog hub + every post)
 *     Local images on each page are listed with <image:image> so Google Images can find them.
 *  5. Crawls the site the way a visitor would (starting at the home page, following every link,
 *     including the nav/footer links that layout.js injects) and reports broken links and orphan
 *     pages (pages in the sitemap that no page links to).
 * No dependencies. Needs git history for accurate dates (use fetch-depth: 0 in CI).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, relative, dirname, posix } from "node:path";
import { execFileSync } from "node:child_process";

const SITE = "https://fordfrontierinvestments.com";
const REPO = process.cwd();
const OUT = join(REPO, "files", "ffi-website");
const CHECK_ONLY = process.argv.includes("--check");
const EXCLUDE = [/^admin\//, /(^|\/)cart\.html$/, /(^|\/)order-success\.html$/, /(^|\/)404\.html$/, /(^|\/)checkout/];

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) return f === "node_modules" || f.startsWith(".") ? [] : walk(p);
  return p.endsWith(".html") ? [p] : [];
});

const toUrl = (rel) => {
  const r = rel.split("\\").join("/");
  if (r === "index.html") return `${SITE}/`;
  if (r.endsWith("/index.html")) return `${SITE}/${r.slice(0, -10)}`;
  return `${SITE}/${r}`;
};
const norm = (u) => u.replace(/^https?:\/\/(www\.)?/, "https://").replace(/\/index\.html$/, "/").replace(/#.*$/, "").replace(/\?.*$/, "");

function gitDate(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd: REPO, encoding: "utf8" }).trim();
    return out || null;
  } catch { return null; }
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- 1. collect pages ----------
const files = walk(OUT);
const pages = [];
const skipped = [];
for (const abs of files) {
  const rel = relative(OUT, abs).split("\\").join("/");
  const html = readFileSync(abs, "utf8");
  const url = toUrl(rel);
  const robots = (html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i) || [])[1] || "";
  const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [])[1] || "";
  const title = ((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").trim();
  if (EXCLUDE.some((re) => re.test(rel))) { skipped.push({ rel, reason: "cart/checkout/admin page (not for search)" }); continue; }
  if (/noindex/i.test(robots)) { skipped.push({ rel, reason: `robots meta: ${robots}` }); continue; }
  if (canonical && norm(canonical) !== norm(url)) { skipped.push({ rel, reason: `canonical points to ${canonical}` }); continue; }
  if (!canonical) skipped.push({ rel, reason: "WARNING: no canonical tag (still included)", keep: true });

  let lastmod = gitDate(abs);
  const dm = (html.match(/"dateModified":\s*"([^"]+)"/) || [])[1];
  if (dm && (!lastmod || dm > lastmod.slice(0, 10))) lastmod = dm;
  if (!lastmod) lastmod = new Date().toISOString();

  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => m[1])
    .filter((src) => !/^https?:/i.test(src) || src.startsWith(SITE))
    .map((src) => (/^https?:/i.test(src) ? src : SITE + "/" + posix.normalize(posix.join(posix.dirname(rel), src))))
    .filter((v, i, a) => a.indexOf(v) === i);

  const section = rel.startsWith("pages/blog/") || rel === "pages/blog.html" ? "blog"
    : rel.startsWith("pages/atm/") || /^pages\/(buy-atm|atm-buying-faq|hyosung-vs-genmega|new-vs-used-atm|how-to-start-an-atm-business)\.html$/.test(rel) ? "atms"
    : "pages";
  pages.push({ rel, url: canonical ? norm(canonical) : url, lastmod, title, imgs, section, html });
}

// ---------- 2. crawl (internal links + layout.js nav/footer) ----------
const byRel = new Map(pages.map((p) => [p.rel, p]));
const allRel = new Set(files.map((f) => relative(OUT, f).split("\\").join("/")));
const layoutPath = join(OUT, "assets", "js", "layout.js");
const layoutLinks = existsSync(layoutPath)
  ? [...readFileSync(layoutPath, "utf8").matchAll(/\$\{root\}([^"'`#?]+\.html)/g)].map((m) => m[1]) : [];

function linksFrom(rel, html) {
  const out = new Set(layoutLinks);
  for (const m of html.matchAll(/href=["']([^"'#?]+)(?:[#?][^"']*)?["']/gi)) {
    let h = m[1];
    if (/^(mailto|tel|javascript|sms):/i.test(h)) continue;
    if (/^https?:/i.test(h)) {
      if (!/^https?:\/\/(www\.)?fordfrontierinvestments\.com/i.test(h)) continue;
      h = h.replace(/^https?:\/\/(www\.)?fordfrontierinvestments\.com\/?/i, "");
    } else if (h.startsWith("/")) h = h.slice(1);
    else h = posix.normalize(posix.join(posix.dirname(rel), h));
    if (h === "" || h.endsWith("/")) h += "index.html";
    if (!h.endsWith(".html")) continue;
    out.add(h);
  }
  return out;
}

const seen = new Set(["index.html"]), queue = ["index.html"], broken = [], inbound = new Map();
while (queue.length) {
  const rel = queue.shift();
  if (!allRel.has(rel)) continue;
  const html = readFileSync(join(OUT, rel), "utf8");
  for (const target of linksFrom(rel, html)) {
    if (!allRel.has(target)) { broken.push({ from: rel, to: target }); continue; }
    inbound.set(target, (inbound.get(target) || 0) + (target === rel ? 0 : 1));
    if (!seen.has(target)) { seen.add(target); queue.push(target); }
  }
}
const orphans = pages.filter((p) => p.rel !== "index.html" && !seen.has(p.rel));

// ---------- 3. write sitemaps ----------
const today = new Date().toISOString();
function urlset(list) {
  const body = list.sort((a, b) => (a.rel === "index.html" ? -1 : b.rel === "index.html" ? 1 : a.url.localeCompare(b.url)))
    .map((p) => `  <url>\n    <loc>${esc(p.url)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n` +
      p.imgs.map((i) => `    <image:image>\n      <image:loc>${esc(i)}</image:loc>\n    </image:image>\n`).join("") +
      `  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`;
}
const sections = [["pages", "sitemap-pages.xml"], ["atms", "sitemap-atms.xml"], ["blog", "sitemap-blog.xml"]];
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sections.filter(([s]) => pages.some((p) => p.section === s)).map(([s, f]) => {
    const newest = pages.filter((p) => p.section === s).map((p) => p.lastmod).sort().pop();
    return `  <sitemap>\n    <loc>${SITE}/${f}</loc>\n    <lastmod>${newest}</lastmod>\n  </sitemap>`;
  }).join("\n") + `\n</sitemapindex>\n`;

// ---------- 4. report ----------
const lines = [];
lines.push(`# Sitemap & crawl report`, ``, `Generated ${today}`, ``);
lines.push(`**In the sitemap:** ${pages.length} pages (${sections.map(([s]) => `${s}: ${pages.filter((p) => p.section === s).length}`).join(", ")})`);
lines.push(`**Left out on purpose:** ${skipped.filter((s) => !s.keep).length}  |  **Broken internal links:** ${broken.length}  |  **Orphan pages:** ${orphans.length}`, ``);
lines.push(`## Left out of the sitemap`, ...skipped.map((s) => `- \`${s.rel}\`: ${s.reason}`), ``);
lines.push(`## Broken internal links`, ...(broken.length ? [...new Map(broken.map((b) => [b.from + b.to, b])).values()].map((b) => `- \`${b.from}\` links to missing \`${b.to}\``) : ["- None"]), ``);
lines.push(`## Orphan pages (in the sitemap, but no page links to them)`, ...(orphans.length ? orphans.map((p) => `- \`${p.rel}\``) : ["- None"]), ``);
lines.push(`## Every URL in the sitemap`, `| Section | URL | Last changed | Inbound links | Title |`, `|---|---|---|---|---|`,
  ...pages.sort((a, b) => a.section.localeCompare(b.section) || a.url.localeCompare(b.url))
    .map((p) => `| ${p.section} | ${p.url.replace(SITE, "")} | ${p.lastmod.slice(0, 10)} | ${inbound.get(p.rel) || 0} | ${p.title.replace(/\|/g, "/").slice(0, 70)} |`));
const report = lines.join("\n") + "\n";

if (CHECK_ONLY) {
  console.log(report.split("## Every URL")[0]);
  process.exit(broken.length ? 1 : 0);
}
for (const [s, f] of sections) {
  const list = pages.filter((p) => p.section === s);
  if (list.length) writeFileSync(join(OUT, f), urlset(list));
}
writeFileSync(join(OUT, "sitemap.xml"), indexXml);
mkdirSync(join(REPO, "docs"), { recursive: true });
writeFileSync(join(REPO, "docs", "SITEMAP-REPORT.md"), report);

// robots.txt must point to the sitemap index
const robotsPath = join(OUT, "robots.txt");
let robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "User-agent: *\nAllow: /\n";
if (!/Sitemap:\s*https:\/\/fordfrontierinvestments\.com\/sitemap\.xml/i.test(robots)) {
  robots = robots.replace(/^Sitemap:.*$/gim, "").trim() + `\n\nSitemap: ${SITE}/sitemap.xml\n`;
  writeFileSync(robotsPath, robots);
}
console.log(report.split("## Every URL")[0]);
