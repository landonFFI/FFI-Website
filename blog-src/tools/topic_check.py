#!/usr/bin/env python3
"""
Topic novelty check for the FFI blog.

  (Run `git fetch origin` first so posts waiting in unmerged branches are included.)

  python3 tools/topic_check.py --index
      Prints the coverage map: every question already answered on the blog
      (H1, primary keyword, every H2/H3, every FAQ) and every site page title/heading.

  python3 tools/topic_check.py --question "Can I put an ATM in my house?" \
        --keywords "personal ATM, ATM for home" \
        --outline "Is it legal to own a personal ATM?|What does a home ATM cost?"
      Scores a candidate topic against every existing post and site page.
      Exits 1 (REJECT) if it is too close to anything already published.

Used by build.py to block near-duplicate posts (post_number >= 100).
"""
import argparse, glob, html, math, os, re, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STOP = set("""a an the and or but if of to in on at by for with from as is are was were be been being do does did
doing have has had having i you your yours we our ours they their them it its this that these those what which who whom
whose when where why how can could should would will shall may might must not no yes so than then there here about into
over under after before again more most some any each every all both few other such only own same too very just also
get got really actually still ever need needs want wants make makes much many one two three s t don doesn isn aren
blog post guide explained explain what's heres here's vs versus""".split())
# Words on nearly every page: they count, but much less.
COMMON = {"atm", "atms", "alabama", "business", "businesses", "owner", "owners", "store", "machine", "machines", "ffi"}

# Hard stop: near-identical to something already published.
REJECT_DOC = 0.55       # candidate vs a whole existing post/page
REJECT_QUESTION = 0.90  # candidate question vs any single existing heading or FAQ question
# Warning band: the writer must explain in the PR's overlap audit why this is different.
WARN_DOC = 0.35
WARN_QUESTION = 0.55


def stem(w):
    for suf in ("ing", "ies", "es", "s", "ed"):
        if len(w) > 4 and w.endswith(suf):
            return w[: -len(suf)] + ("y" if suf == "ies" else "")
    return w


def tokens(text):
    words = re.findall(r"[a-z0-9]+", html.unescape(text).lower())
    return [stem(w) for w in words if w not in STOP and len(w) > 1]


def load_posts():
    import yaml
    posts = []
    for path in sorted(glob.glob(os.path.join(ROOT, "content", "*.md"))):
        raw = open(path, encoding="utf-8").read()
        m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
        if not m:
            continue
        meta = yaml.safe_load(m.group(1)) or {}
        body = m.group(2)
        heads = re.findall(r"^#{2,3}\s+(.+)$", body, re.M)
        faqs = [f.get("q", "") for f in meta.get("faq", []) or []]
        posts.append({
            "kind": "post", "id": meta.get("slug", os.path.basename(path)[:-3]),
            "post_number": meta.get("post_number", 0),
            "title": meta.get("h1", ""),
            "questions": [meta.get("h1", ""), meta.get("title_tag", ""), str(meta.get("primary_keyword", ""))] + heads + faqs,
            "text": " ".join([meta.get("h1", ""), meta.get("title_tag", ""), str(meta.get("primary_keyword", "")),
                              " ".join(map(str, meta.get("secondary_keywords", []) or [])), meta.get("short_answer", ""),
                              " ".join(heads), " ".join(faqs)]),
        })
    return posts


def load_pending():
    """Posts sitting in unmerged branches (waiting for Landon's approval) count as already written."""
    import subprocess, yaml
    pending = []
    try:
        refs = subprocess.run(["git", "for-each-ref", "--format=%(refname)", "refs/remotes/origin"],
                              capture_output=True, text=True, cwd=ROOT).stdout.split()
        for ref in refs:
            if ref.endswith("/HEAD") or ref.endswith("/main"):
                continue
            files = subprocess.run(["git", "diff", "--name-only", "--diff-filter=A", f"origin/main...{ref}", "--",
                                    "blog-src/content/"], capture_output=True, text=True, cwd=ROOT).stdout.split()
            for f in files:
                raw = subprocess.run(["git", "show", f"{ref}:{f}"], capture_output=True, text=True, cwd=ROOT).stdout
                m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
                if not m:
                    continue
                meta = yaml.safe_load(m.group(1)) or {}
                heads = re.findall(r"^#{2,3}\s+(.+)$", m.group(2), re.M)
                faqs = [x.get("q", "") for x in meta.get("faq", []) or []]
                pending.append({"kind": "pending", "id": f"PENDING {meta.get('slug', f)} ({ref.split('/', 3)[-1]})",
                                "post_number": 0, "title": meta.get("h1", ""),
                                "questions": [meta.get("h1", ""), str(meta.get("primary_keyword", ""))] + heads + faqs,
                                "text": " ".join([meta.get("h1", ""), str(meta.get("primary_keyword", "")),
                                                  " ".join(map(str, meta.get("secondary_keywords", []) or [])),
                                                  meta.get("short_answer", ""), " ".join(heads), " ".join(faqs)])})
    except Exception:
        pass
    return pending


def load_pages(repo):
    pages = []
    if not repo:
        return pages
    for path in sorted(glob.glob(os.path.join(repo, "files", "ffi-website", "pages", "*.html"))):
        s = open(path, encoding="utf-8", errors="ignore").read()
        title = re.search(r"<title>(.*?)</title>", s, re.S)
        heads = [re.sub(r"<[^>]+>", "", h) for h in re.findall(r"<h[1-3][^>]*>(.*?)</h[1-3]>", s, re.S)]
        faqs = re.findall(r'"name":\s*"([^"]+\?)"', s)
        t = title.group(1) if title else os.path.basename(path)
        pages.append({"kind": "page", "id": "pages/" + os.path.basename(path), "post_number": 0, "title": t,
                      "questions": [t] + heads + faqs, "text": " ".join([t] + heads + faqs)})
    return pages


class Scorer:
    def __init__(self, docs):
        self.N = max(1, len(docs))
        df = Counter()
        for d in docs:
            df.update(set(tokens(d["text"])))
        self.idf = {w: math.log((1 + self.N) / (1 + c)) + 1 for w, c in df.items()}

    def vec(self, text):
        tf = Counter(tokens(text))
        v = {}
        for w, c in tf.items():
            weight = self.idf.get(w, math.log(1 + self.N) + 1)
            if w in COMMON:
                weight *= 0.25
            v[w] = (1 + math.log(c)) * weight
        return v

    @staticmethod
    def cos(a, b):
        if not a or not b:
            return 0.0
        dot = sum(a[k] * b.get(k, 0) for k in a)
        na = math.sqrt(sum(x * x for x in a.values()))
        nb = math.sqrt(sum(x * x for x in b.values()))
        return dot / (na * nb) if na and nb else 0.0


def check(candidate_q, keywords, outline, docs, exclude_id=None):
    scorer = Scorer(docs)
    cand_text = " ".join([candidate_q, keywords, " ".join(outline)])
    cv, qv = scorer.vec(cand_text), scorer.vec(candidate_q)
    results = []
    for d in docs:
        if d["id"] == exclude_id:
            continue
        doc_sim = scorer.cos(cv, scorer.vec(d["text"]))
        best_q, best_qs = "", 0.0
        for q in d["questions"]:
            s = scorer.cos(qv, scorer.vec(q))
            if s > best_qs:
                best_q, best_qs = q, s
        results.append((max(doc_sim, best_qs), doc_sim, best_qs, best_q, d))
    results.sort(key=lambda r: r[0], reverse=True)
    reject = [r for r in results if r[1] >= REJECT_DOC or r[2] >= REJECT_QUESTION]
    warn = [r for r in results if r not in reject and (r[1] >= WARN_DOC or r[2] >= WARN_QUESTION)]
    return results, reject, warn


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", action="store_true")
    ap.add_argument("--question", default="")
    ap.add_argument("--keywords", default="")
    ap.add_argument("--outline", default="", help="Planned H2 questions separated by |")
    ap.add_argument("--repo", default=os.path.dirname(ROOT))
    args = ap.parse_args()
    docs = load_posts() + load_pending() + load_pages(args.repo)

    if args.index:
        print("# Coverage map: questions already answered\n")
        for d in docs:
            print(f"## {d['id']} :: {d['title']}")
            for q in dict.fromkeys(q for q in d["questions"] if q.strip()):
                print(f"- {q.strip()}")
            print()
        return

    if not args.question:
        sys.exit("Give --question (and ideally --keywords and --outline), or use --index.")
    outline = [o.strip() for o in args.outline.split("|") if o.strip()]
    results, reject, warn = check(args.question, args.keywords, outline, docs)
    print(f"Candidate: {args.question}\n")
    print("Closest existing content (overall / whole-page / closest single question):")
    for overall, ds, qs, q, d in results[:8]:
        print(f"  {overall:.2f}  ({ds:.2f} / {qs:.2f})  {d['id']}  ->  closest question: {q.strip()[:90]}")
    if reject:
        print(f"\nREJECT: too close to {reject[0][4]['id']}. Pick a different question or a clearly different searcher need.")
        sys.exit(1)
    if warn:
        print("\nWARN: close to " + ", ".join(r[4]["id"] for r in warn[:5]) +
              ". Only proceed if the overlap audit shows a clearly different searcher need and at least 70% new sections.")
        return
    print("\nPASS: nothing published answers this closely. Still do the overlap audit in AGENT_TASK.md.")


if __name__ == "__main__":
    main()
