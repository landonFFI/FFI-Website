# Weekly blog task (read and follow exactly)

You are writing ONE new blog post for fordfrontierinvestments.com and opening a pull request for Landon Ford to approve. You never merge, and you never change existing copy.

**The most important rule: the topic must be NEW and must be something real people search for or ask.** A well-written post on a topic we've already covered, or one nobody searches, is a failed run. When in doubt, pick a different topic.

## 1. Load what already exists

From `blog-src/`, run:

    git fetch origin
    pip install markdown pyyaml jinja2 textstat==0.7.3
    python3 tools/topic_check.py --index --repo .. > /tmp/coverage.md

Read `/tmp/coverage.md` completely. It lists every question already answered:
- every published post's title, keyword, section headings, and FAQs
- posts **waiting in unmerged PRs** (marked PENDING), which count as already written
- every site page's headings and FAQs

## 2. Build a candidate list (at least 10 questions)

Write candidates as the exact questions a person would type into Google, in plain words. Pull them from these lanes, in this order:

1. **Landon's inbox:** every line under "## Inbox" in `blog-src/TOPICS.md`. A real customer asked each one, so each already counts as demand evidence.
2. **Search research:** for FFI's services (free ATM placement, buying an ATM, ATM processing, cash loading, wireless ATMs, outdoor ATMs, event ATMs, selling ATMs and routes, merchant services), run searches and collect:
   - the questions shown in "People also ask" and related searches
   - the titles of pages that currently rank
   - questions people post on Reddit, Quora, forums, and Facebook groups
3. **Alabama and timely topics:** news from the last 60 days, new laws or rule changes (state or card-network), and seasonal needs coming up in the next 4–6 weeks (football season, holidays, festival season, tax season).
4. **`blog-src/ROADMAP.md`:** these are unvalidated ideas. They must pass the same gate as everything else.

Aim for the long-tail, specific questions a business owner, event organizer, or would-be ATM owner types when they're close to a decision. They should connect naturally to one of FFI's services.

## 3. The topic gate (every candidate)

A candidate passes only if **all four** are true.

**A. Real demand.** There are at least **two independent signals** that people search for or ask this, **with URLs**, and at least one is search-based:
- The question, or a close wording, appears in "People also ask," related searches, or as the title of multiple ranking pages.
- Real people ask it on Reddit, Quora, forums, Facebook groups, or in reviews.
- A recent law, rule, or news event is creating the question.
- *Exception:* a question from Landon's inbox needs no other signal.

**B. Not already answered.** Run:

    python3 tools/topic_check.py --repo .. --question "<the question>" --keywords "<3-6 keywords>" --outline "<planned H2 1>|<planned H2 2>|<...>"

- **REJECT:** drop the candidate.
- **WARN:** it may only continue if the overlap audit in C clearly passes.
- **PASS:** still do the overlap audit.

**C. Overlap audit (your judgment, not just the script).**
- Compare your planned outline against the coverage map and the 3 closest items the script listed.
- The candidate fails if:
  - its core question is already answered by any existing post's title, section heading, short answer, or FAQ, or by a site page, **even in different words**; or
  - fewer than **70%** of your planned sections are new.
- A different angle only counts if it serves a **different searcher need**. Example: "what an ATM costs to buy" and "what it costs to rent an ATM for one event" are different needs. "12 questions to ask an ATM company" and "how to check if an ATM company is local" are **not**, because the second is already one of the first post's questions.

**D. Useful to FFI's readers.** It serves one of FFI's audiences (business owners, event organizers, ATM buyers and operators, route sellers, merchant services customers) and can point naturally to an FFI service page.

**Special cases:**
- **An inbox question that's already answered:** don't write a duplicate. Move it to "## Done" in TOPICS.md with "→ already answered in <slug>", and mention it in the PR.
- **A roadmap item that fails:** check its box and add "→ skipped: covered by <slug>" or "→ skipped: no search demand found."

**Pick the winner:** of the candidates that pass, choose the one with the strongest demand evidence and closest tie to a service. Inbox questions win ties.

If **no candidate passes**, don't write a post. Open a PR that only updates TOPICS.md and ROADMAP.md, and explain why in the PR description.

## 4. Research the chosen topic

Follow the research standards in `blog-src/WRITING_GUIDE.md`: at least 8 searches, primary sources, a record of every source. Also study the top pages that currently rank for the question. Note what they answer poorly or leave out; that's what your post should do better.

## 5. Write
- Read `blog-src/WRITING_GUIDE.md`, `blog-src/FACTS.md`, and at least two existing posts.
- Create `blog-src/content/<slug>.md`:
  - Set `date_published` to today (YYYY-MM-DD).
  - Set `post_number` to the next unused number that is 100 or higher.
- **The H1, title tag, and primary keyword must match how people actually phrase the question in search.**
- Take company facts ONLY from FACTS.md. Take prices ONLY from `files/ffi-website/assets/data/catalog.json`. Leave out anything FACTS.md doesn't support, and list it in the PR.
- You MAY add the new slug to the `related:` list of up to 2 existing posts, replacing their last item. Change nothing else in existing posts.

## 6. Build and publish into the site folder

From `blog-src/`:

    python3 tools/build.py --repo ..
    python3 tools/publish.py --repo ..

The build also runs a near-duplicate check on new posts. It must end with "All checks passed."
- **Problems with YOUR post:** fix the post and rebuild.
- **A "too similar" problem:** go back to step 3 and choose a different topic.
- **Problems with any other file:** stop and report them in the PR without changing that file.

## 7. Update the topic lists
- If the topic came from TOPICS.md, move that line to "## Done" and add " → <slug>".
- If it came from ROADMAP.md, check its box and add the slug.
- Record any skipped inbox or roadmap items as described in step 3.

## 8. Open the pull request
- Commit all changes on a new branch and push. Open a PR into `main` titled `Blog: <h1>`.
- PR description, in this order:
  1. **Question answered:** the exact searcher question, plus the inbox wording if it came from TOPICS.md.
  2. **Search demand evidence:** each signal, with its URL.
  3. **Overlap audit:** the 3 closest existing posts or pages from topic_check.py, with scores. Explain why this post serves a different need, and give the percentage of new sections.
  4. **Candidates considered:** a table of every candidate with its demand signals, topic_check result, overlap verdict, and why it was or wasn't chosen.
  5. **Short answer** (copied from the post).
  6. **Target keyword** and secondary keywords.
  7. **Needs Landon's confirmation:** claims you left out, or "None."
  8. **Sources used.**
  9. **Build report:** this post's line plus "All checks passed."
- If you can't open the PR, push the branch anyway and say so in your final message.

Never merge. Never edit site files outside `files/ffi-website/pages/blog/`, `files/ffi-website/pages/blog.html`, and `files/ffi-website/sitemap.xml`.
