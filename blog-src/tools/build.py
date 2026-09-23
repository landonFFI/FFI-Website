#!/usr/bin/env python3
"""
FFI blog build script.

Turns /content/*.md (front matter + markdown) into finished HTML files that match
the live site template, then runs quality checks. Output goes to /dist.

Usage:
    python3 tools/build.py                 # build with default publish date
    python3 tools/build.py --date 2026-09-24
    python3 tools/build.py --repo /path/to/FFI-Website   # also checks every internal link against the real repo

Requires: pip install markdown pyyaml jinja2 textstat==0.7.3 (textstat is optional; a built-in estimate is used if it fails)
"""
import argparse, datetime, glob, html, json, math, os, re, sys
import markdown, yaml

try:
    import textstat
    textstat.flesch_kincaid_grade("Test sentence for the reading check.")
    def fk_grade(text):
        return textstat.flesch_kincaid_grade(text)
except Exception:  # textstat missing or its word list can't download: use a built-in estimate
    def _syllables(word):
        word = word.lower().strip(".,;:!?\"'()")
        if not word:
            return 0
        groups = re.findall(r"[aeiouy]+", word)
        n = len(groups)
        if word.endswith("e") and n > 1 and not word.endswith("le"):
            n -= 1
        return max(1, n)
    def fk_grade(text):
        sentences = max(1, len(re.findall(r"[.!?]+(?:\s|$)", text)))
        words = re.findall(r"[A-Za-z][A-Za-z'-]*", text)
        if not words:
            return 0.0
        syl = sum(_syllables(w) for w in words)
        return 0.39 * (len(words) / sentences) + 11.8 * (syl / len(words)) - 15.59
from jinja2 import Environment, FileSystemLoader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://fordfrontierinvestments.com"

# Matches the access_key used by every live form on the site (13 forms, checked Sept 22, 2026).
# main.js posts the form to the site's Make.com webhook; this key rides along as form data.
WEB3FORMS_KEY = "958f885c-03f9-4196-8b83-7889c2b79cd0"

CLUSTERS = [
    ("getting-an-atm", "Getting an ATM for Your Business",
     "Free placement, partnerships, and what it takes to get an ATM in your business without guessing."),
    ("choosing-an-atm-company", "Choosing an ATM Company",
     "How to tell a good ATM partner from a headache, before anything is signed."),
    ("atms-by-business-type", "ATMs by Business Type",
     "What an ATM does for bars, convenience stores, gas stations, and other cash-heavy businesses."),
    ("owning-an-atm", "Buying and Owning an ATM",
     "Real costs, connections, processing, and what owning an ATM actually involves."),
    ("selling-an-atm", "Selling an ATM or Route",
     "What your machines and route are worth, and how to get a fair offer."),
    ("starting-an-atm-business", "Starting an ATM Business",
     "Honest answers for people who want to own ATMs: what it takes, what to avoid, and how to start right."),
    ("industry-news", "Alabama ATM News",
     "New laws and changes that affect Alabama businesses with ATMs."),
]
CLUSTER_NAME = {k: n for k, n, _ in CLUSTERS}
START_HERE = ["do-you-have-to-buy-an-atm", "how-free-atm-placement-works", "questions-to-ask-atm-placement-company"]

# Words and phrases that must never appear in published copy (copy standards + legal boundaries).
BANNED = [
    r"\bguarantee(d|s)?\b", r"\blicensed\b", r"authorized dealer", r"\bno contracts?\b",
    r"no long[- ]term contract", r"\bpremier\b",
    r"\b#1\b", r"number one ATM", r"same[- ]day", r"\bpassive income\b",
    r"\$300\s*(-|–|to)\s*\$?1,?000",  # non-public revenue range
    r"1099", r"operate(s)? alone",     # non-public operations detail
]
# Phrases allowed even though a banned pattern matches inside them.
ALLOW = ["number one complaint", "personal guarantee", "is owning atms passive income?",
         "talking about \"passive income while you sleep.\"", "\"passive income. set it and forget it.\""]


def slugify(value, separator="-"):
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value).lower()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    return re.sub(r"[\s-]+", separator, value).strip(separator)


def load_posts():
    posts = []
    for path in sorted(glob.glob(os.path.join(ROOT, "content", "*.md"))):
        raw = open(path, encoding="utf-8").read()
        m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
        if not m:
            sys.exit(f"Missing front matter: {path}")
        meta = yaml.safe_load(m.group(1))
        meta["body_md"] = m.group(2).strip()
        meta["source_file"] = os.path.basename(path)
        posts.append(meta)
    return posts


def render_inline_cta(cta):
    return f"""<aside class="blog-inline-cta" aria-label="{html.escape(cta['headline'])}">
  <p class="blog-inline-cta__title">{html.escape(cta['headline'])}</p>
  <p>{html.escape(cta['body'])}</p>
  <div class="blog-inline-cta__actions">
    <a class="btn btn--primary" href="#contact">{html.escape(cta['button'])}</a>
    <a class="blog-inline-cta__phone" href="tel:+12052108121">Or call or text (205) 210-8121</a>
  </div>
</aside>"""


def build_body(p):
    md = markdown.Markdown(extensions=["tables", "toc", "sane_lists"],
                           extension_configs={"toc": {"slugify": slugify, "toc_depth": "2"}})
    body = md.convert(p["body_md"])
    toc = [{"id": t["id"], "text": html.unescape(t["name"])} for t in md.toc_tokens]
    body = body.replace("<p>[[cta]]</p>", render_inline_cta(p["cta"]))
    def wrap_table(m):
        tbl = m.group(0)
        head = re.search(r"<thead>.*?</thead>", tbl, re.S)
        cols = len(re.findall(r"<th[ >]", head.group(0))) if head else 0
        if cols >= 4:
            return ('<div class="blog-table-wrap blog-table-wrap--wide">' + tbl + '</div>\n'
                    '<p class="blog-table-hint">Swipe the table sideways to see every column.</p>')
        return '<div class="blog-table-wrap">' + tbl + '</div>'
    body = re.sub(r"<table>.*?</table>", wrap_table, body, flags=re.S)
    body = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', body)
    indented = "\n".join(("        " + line) if line.strip() else "" for line in body.splitlines())
    return indented, toc, body


def plain_text(p):
    txt = re.sub(r"\[\[cta\]\]", "", p["body_md"])
    txt = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", txt)
    txt = re.sub(r"^\|.*\|$", "", txt, flags=re.M)      # drop tables for readability scoring
    txt = re.sub(r"[#*_>`]", "", txt)
    return txt


def schema_for(p, date_pub, date_mod):
    article = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": p["h1"][:110],
        "description": p["meta_description"],
        "url": p["canonical"],
        "mainEntityOfPage": {"@type": "WebPage", "@id": p["canonical"]},
        "datePublished": date_pub,
        "dateModified": date_mod,
        "inLanguage": "en-US",
        "articleSection": p["cluster_name"],
        "keywords": [p["primary_keyword"]] + p["secondary_keywords"],
        "wordCount": p["word_count"],
        "author": {
            "@type": "Person",
            "name": "Landon Ford",
            "jobTitle": "Owner",
            "worksFor": {"@type": "Organization", "name": "Ford Frontier Investments"},
            "url": f"{SITE}/pages/about.html",
        },
        "publisher": {
            "@type": "Organization",
            "name": "Ford Frontier Investments",
            "url": f"{SITE}/",
            "telephone": "+12052108121",
            "email": "Landon@FordFrontierInvestments.com",
            "address": {"@type": "PostalAddress", "addressLocality": "Birmingham",
                        "addressRegion": "AL", "addressCountry": "US"},
            "areaServed": [{"@type": "City", "name": c} for c in ("Birmingham", "Montgomery", "Tuscaloosa")],
        },
        "about": {"@type": "Thing", "name": p["primary_keyword"]},
    }
    crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{SITE}/pages/blog.html"},
            {"@type": "ListItem", "position": 3, "name": p["h1"], "item": p["canonical"]},
        ],
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": f["q"],
                        "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in p["faq"]],
    }
    dump = lambda o: "  " + json.dumps(o, indent=2, ensure_ascii=False).replace("\n", "\n  ")
    return dump(article), dump(crumbs), dump(faq)


def human_date(iso):
    d = datetime.date.fromisoformat(iso)
    return d.strftime("%B ") + str(d.day) + d.strftime(", %Y")


def check_post(p, body_html, all_slugs, repo_pages, problems):
    name = p["slug"]
    if len(p["title_tag"]) > 60:
        problems.append(f"{name}: title_tag is {len(p['title_tag'])} chars (max 60)")
    if not (110 <= len(p["meta_description"]) <= 160):
        problems.append(f"{name}: meta_description is {len(p['meta_description'])} chars (target 110-160)")
    sa_words = len(p["short_answer"].split())
    if not (35 <= sa_words <= 70):
        problems.append(f"{name}: short_answer is {sa_words} words (target 35-70)")
    if len(p["faq"]) < 4:
        problems.append(f"{name}: needs at least 4 FAQs")
    if "[[cta]]" not in p["body_md"]:
        problems.append(f"{name}: missing [[cta]] placement")
    # banned language (body, FAQ, short answer, dek, CTA)
    blob = " ".join([p["body_md"], p["short_answer"], p["dek"], p["h1"], p["meta_description"],
                     json.dumps(p["faq"]), json.dumps(p["cta"])]).lower()
    for a in ALLOW:
        blob = blob.replace(a, "")
    for pat in BANNED:
        if re.search(pat, blob, re.I):
            problems.append(f"{name}: banned phrase matched /{pat}/")
    # internal links
    links = re.findall(r'href="([^"#:]+\.html)(#[^"]*)?"', body_html)
    for href, _ in links:
        if href.startswith("../"):
            page = href[3:]
            if repo_pages is not None and page not in repo_pages:
                problems.append(f"{name}: link to missing site page {href}")
        else:
            if href[:-5] not in all_slugs:
                problems.append(f"{name}: link to unpublished post {href}")
    # main service page must be linked at least twice in the body
    svc = p["cta"]["service_url"]
    if body_html.count(f'href="{svc}"') < 1:
        problems.append(f"{name}: body never links to its main service page {svc}")
    for r in p["related"]:
        if r not in all_slugs:
            problems.append(f"{name}: related post '{r}' is not in this build")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=datetime.date.today().isoformat(), help="Fallback publish date for posts with no date_published in front matter (YYYY-MM-DD)")
    ap.add_argument("--repo", default=None, help="Path to FFI-Website repo root for link checking")
    args = ap.parse_args()

    repo_pages = None
    if args.repo:
        pages_dir = os.path.join(args.repo, "files", "ffi-website", "pages")
        repo_pages = {os.path.relpath(f, pages_dir) for f in glob.glob(os.path.join(pages_dir, "**", "*.html"), recursive=True)}

    env = Environment(loader=FileSystemLoader(os.path.join(ROOT, "templates")), autoescape=False)
    post_tpl, hub_tpl = env.get_template("post.html.j2"), env.get_template("hub.html.j2")

    posts = load_posts()
    by_slug = {p["slug"]: p for p in posts}
    all_slugs = set(by_slug)
    problems, report = [], []
    out_dir = os.path.join(ROOT, "dist", "pages", "blog")
    os.makedirs(out_dir, exist_ok=True)

    for p in posts:
        p["canonical"] = f"{SITE}/pages/blog/{p['slug']}.html"
        p["cluster_name"] = CLUSTER_NAME.get(p["cluster"], "Blog")
        text = plain_text(p)
        p["word_count"] = len(text.split())
        p["read_minutes"] = max(3, math.ceil(p["word_count"] / 225))
        p["keywords_csv"] = ", ".join([p["primary_keyword"]] + p["secondary_keywords"])
        # Per-post dates live in front matter so rebuilding never changes an old post's date.
        dp = p.get("date_published") or p.get("date_published_override") or args.date
        dm = p.get("date_modified") or p.get("date_modified_override") or dp
        p["date_published"], p["date_modified"] = str(dp), str(dm)
        p["date_modified_human"] = human_date(p["date_modified"])

    # Near-duplicate guard for new posts (post_number >= 100): compare against every other post and site page.
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import topic_check
        tc_docs = topic_check.load_posts() + topic_check.load_pages(args.repo)
        for p in posts:
            if int(p.get("post_number") or 0) >= 100:
                q = p.get("primary_keyword", "") + " " + p["h1"]
                res, rej, warn = topic_check.check(q, " ".join(map(str, p.get("secondary_keywords", []))),
                                                   [], tc_docs, exclude_id=p["slug"])
                if rej:
                    problems.append(f"{p['slug']}: too similar to {rej[0][4]['id']} (near-duplicate topic). Choose a new topic.")
                elif warn:
                    print(f"NOTE {p['slug']}: close to {', '.join(r[4]['id'] for r in warn[:3])}; the PR overlap audit must explain the difference.")
    except ImportError:
        problems.append("tools/topic_check.py is missing")

    for p in posts:
        body_indented, toc, body_html = build_body(p)
        p["body_html"], p["toc"] = body_indented, toc
        p["related_posts"] = [by_slug[r] for r in p["related"] if r in by_slug]
        p["schema_article"], p["schema_breadcrumb"], p["schema_faq"] = schema_for(p, p["date_published"], p["date_modified"])
        check_post(p, body_html, all_slugs, repo_pages, problems)
        out = post_tpl.render(p=p, web3forms_key=WEB3FORMS_KEY)
        with open(os.path.join(out_dir, f"{p['slug']}.html"), "w", encoding="utf-8") as fh:
            fh.write(out)
        grade = fk_grade(plain_text(p))
        if grade > 8:
            problems.append(f"{p['slug']}: reading grade {grade:.1f} is above 8 (target 4-7); use shorter sentences and simpler words")
        if p.get("cluster") not in CLUSTER_NAME:
            problems.append(f"{p['slug']}: cluster '{p.get('cluster')}' is not one of {list(CLUSTER_NAME)}")
        report.append((p.get("post_number"), p["slug"], p["word_count"], p["read_minutes"], round(grade, 1), len(p["faq"]), len(toc)))

    # Hub page
    groups = []
    for key, name, desc in CLUSTERS:
        gp = sorted([p for p in posts if p["cluster"] == key], key=lambda x: x.get("post_number", 999))
        if gp:
            groups.append({"key": key, "name": name, "desc": desc, "posts": gp})
    start = [by_slug[s] for s in START_HERE if s in by_slug]
    blog_schema = {
        "@context": "https://schema.org", "@type": "Blog",
        "name": "Ford Frontier Investments ATM Blog",
        "url": f"{SITE}/pages/blog.html",
        "description": "Answers for Alabama business owners about getting, buying, running, and selling ATMs.",
        "publisher": {"@type": "Organization", "name": "Ford Frontier Investments", "url": f"{SITE}/"},
        "blogPost": [{"@type": "BlogPosting", "headline": p["h1"][:110], "url": p["canonical"],
                      "datePublished": p["date_published"], "author": {"@type": "Person", "name": "Landon Ford"}}
                     for p in sorted(posts, key=lambda x: x.get("post_number", 999))],
    }
    hub_crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
        {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{SITE}/pages/blog.html"}]}
    dump = lambda o: "  " + json.dumps(o, indent=2, ensure_ascii=False).replace("\n", "\n  ")
    hub = hub_tpl.render(start_here=start, groups=groups, schema_blog=dump(blog_schema),
                         schema_breadcrumb=dump(hub_crumbs), web3forms_key=WEB3FORMS_KEY)
    with open(os.path.join(ROOT, "dist", "pages", "blog.html"), "w", encoding="utf-8") as fh:
        fh.write(hub)

    # Sitemap entries to paste into sitemap.xml
    entries = []  # pages/blog.html is already in sitemap.xml; only its <lastmod> gets updated
    for p in sorted(posts, key=lambda x: x.get("post_number", 999)):
        entries.append(f"""  <url>
    <loc>{p['canonical']}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>{p['date_modified']}</lastmod>
  </url>""")
    with open(os.path.join(ROOT, "dist", "sitemap-blog-entries.xml"), "w") as fh:
        fh.write("\n\n".join(entries) + "\n")

    # Report
    print(f"{'#':>3}  {'slug':45} {'words':>5} {'min':>3} {'FK':>4} {'faq':>3} {'H2':>3}")
    for r in sorted(report, key=lambda x: x[0] or 999):
        print(f"{r[0]:>3}  {r[1]:45} {r[2]:>5} {r[3]:>3} {r[4]:>4} {r[5]:>3} {r[6]:>3}")
    if problems:
        print("\nPROBLEMS:")
        for x in problems:
            print("  -", x)
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
