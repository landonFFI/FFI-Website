#!/usr/bin/env python3
"""
Copy built blog pages into the live site folder and merge sitemap entries.

Usage (from blog-src/):  python3 tools/publish.py --repo ..
Run after tools/build.py has passed. Safe to run more than once.
"""
import argparse, glob, os, re, shutil, datetime

ap = argparse.ArgumentParser()
ap.add_argument("--repo", default="..")
args = ap.parse_args()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = os.path.join(args.repo, "files", "ffi-website")
dist = os.path.join(ROOT, "dist")

os.makedirs(os.path.join(site, "pages", "blog"), exist_ok=True)
copied = 0
for f in glob.glob(os.path.join(dist, "pages", "blog", "*.html")):
    shutil.copy2(f, os.path.join(site, "pages", "blog", os.path.basename(f))); copied += 1
shutil.copy2(os.path.join(dist, "pages", "blog.html"), os.path.join(site, "pages", "blog.html"))

sm_path = os.path.join(site, "sitemap.xml")
sm = open(sm_path, encoding="utf-8").read()
entries = open(os.path.join(dist, "sitemap-blog-entries.xml"), encoding="utf-8").read()
added = updated = 0
for block in re.findall(r"  <url>.*?</url>", entries, re.S):
    loc = re.search(r"<loc>(.*?)</loc>", block).group(1)
    lastmod = re.search(r"<lastmod>(.*?)</lastmod>", block).group(1)
    existing = re.search(r"<url>\s*<loc>" + re.escape(loc) + r"</loc>.*?</url>", sm, re.S)
    if existing:
        new = re.sub(r"<lastmod>.*?</lastmod>", f"<lastmod>{lastmod}</lastmod>", existing.group(0))
        if new != existing.group(0):
            sm = sm.replace(existing.group(0), new); updated += 1
    else:
        sm = sm.replace("</urlset>", block + "\n\n</urlset>"); added += 1
# blog hub lastmod = today
today = datetime.date.today().isoformat()
sm = re.sub(r"(<loc>https://fordfrontierinvestments\.com/pages/blog\.html</loc>.*?<lastmod>)(.*?)(</lastmod>)",
            lambda m: m.group(1) + today + m.group(3), sm, count=1, flags=re.S)
open(sm_path, "w", encoding="utf-8").write(sm)
print(f"Copied {copied} posts + hub. Sitemap: {added} added, {updated} updated.")
