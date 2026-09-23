#!/usr/bin/env python3
"""
Copy built blog pages into the live site folder.
(The sitemap is rebuilt automatically by scripts/build-sitemap.mjs after merge; don't edit it here.)

Usage (from blog-src/):  python3 tools/publish.py --repo ..
Run after tools/build.py has passed. Safe to run more than once.
"""
import argparse, glob, os, shutil

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

print(f"Copied {copied} posts + hub. The sitemap updates itself after merge (GitHub Action: Update sitemap).")
