# FFI blog source

Posts live in `content/*.md` (front matter + approved copy). `tools/build.py` turns them into finished pages.

    pip install markdown pyyaml jinja2 textstat==0.7.3
    python3 tools/build.py --date YYYY-MM-DD --repo ..
    python3 tools/publish.py --repo ..

Output goes to `dist/`. Copy `dist/pages/blog/*.html` to `files/ffi-website/pages/blog/` and `dist/pages/blog.html` to `files/ffi-website/pages/blog.html`.
The sitemap rebuilds automatically after merge; never edit it by hand.

The build refuses to finish if any check fails: banned words, broken internal links, title or description length, missing FAQ, or missing call to action. Never hand-edit generated HTML; change the .md and rebuild.

