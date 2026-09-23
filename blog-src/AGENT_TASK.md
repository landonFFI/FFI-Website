# Weekly blog task (read and follow exactly)

You are writing ONE new blog post for fordfrontierinvestments.com and opening a pull request for Landon Ford to approve. You never merge, and you never change existing copy.

## 1. Pick the topic (first match wins)
1. The oldest line under "## Inbox" in `blog-src/TOPICS.md`.
2. The first unchecked item in `blog-src/ROADMAP.md`.
3. If both are empty: research what Alabama business owners are asking about ATMs, placement, buying or owning ATMs, cash, or card processing, and pick the strongest question that isn't already covered.

Check for duplicates first (see WRITING_GUIDE.md). If the topic is already covered, choose a new angle and explain why in the PR.

## 2. Research
Follow the research standards in `blog-src/WRITING_GUIDE.md`: at least 8 searches, primary sources, and a record of every source.

## 3. Write
- Read `blog-src/WRITING_GUIDE.md`, `blog-src/FACTS.md`, and at least two existing posts in `blog-src/content/`.
- Create `blog-src/content/<slug>.md`. Set `date_published` to today (YYYY-MM-DD).
- Take company facts ONLY from FACTS.md. Take prices ONLY from `files/ffi-website/assets/data/catalog.json`.
- If you want to say something FACTS.md doesn't support, leave it out and list it in the PR.
- You MAY add the new slug to the `related:` list of up to 2 existing posts, replacing their last related item, if it's a closer match. Change nothing else in existing posts.

## 4. Build and publish into the site folder
From `blog-src/`:

    pip install markdown pyyaml jinja2 textstat==0.7.3
    python3 tools/build.py --repo ..
    python3 tools/publish.py --repo ..

The build must end with "All checks passed."
- If it reports problems with YOUR post, fix your post and rebuild.
- If it reports problems with any other file, stop and report them in the PR without changing that file.

## 5. Update the topic lists
- If the topic came from TOPICS.md, move that line from Inbox to Done and add " → <slug>".
- If it came from ROADMAP.md, check its box and add the slug.

## 6. Open the pull request
- Branch: `claude/blog-<today>-<slug>`. Commit all changes and push.
- Open a pull request into `main` titled `Blog: <h1>`.
- PR description, in this order:
  1. **Question answered** and why this topic (include the original wording if it came from TOPICS.md)
  2. **Short answer** (copied from the post)
  3. **Target keyword** and secondary keywords
  4. **Needs Landon's confirmation** (claims you left out, or "None")
  5. **Sources used**
  6. **Build report** (this post's line from the table, plus "All checks passed")
- If you can't open the PR, push the branch anyway and say so in your final message. Landon can open it from GitHub.

Never merge. Never edit site files outside `files/ffi-website/pages/blog/`, `files/ffi-website/pages/blog.html`, and `files/ffi-website/sitemap.xml`.
