# FFI Blog Writing Guide

Every post must follow this guide, `FACTS.md`, and the checks in `tools/build.py`. The existing posts in `content/` are the quality bar. Read two of them before writing.

## Who we write for
Alabama business owners aged 30–55: bar and nightclub owners, gas station and convenience store owners (often independent owner-operators), barbershops and laundromats, event organizers, gentlemen's club owners, and multi-location operators. Also people who want to buy their own ATM or start an ATM business. Many have been burned by an ATM company before. They're skeptical, busy, and reading on a phone.

## Goal of every post
Answer ONE real question completely and honestly, earn trust, and send the reader to ONE next step: contacting Landon (the form or a call).

## Voice and reading level
- 6th-grade reading level (the build fails above grade 8). Short sentences. Common words.
- Confident, direct, warm. Honest even when the honest answer is "this might not be for you."
- Use "we" for FFI and "you" for the reader. Landon is the byline.
- No hype, no exclamation points, no "in today's fast-paced world." No emojis.

## Persuasion checklist (run on every draft)
1. Open with the reader's real situation or problem (why it matters), not with FFI.
2. One core message.
3. Name their likely fear or objection before the ask (accusation audit).
4. Use loss framing where it's true (what a broken or missing ATM costs them).
5. Concrete numbers and examples, not vague claims.
6. Exactly one call to action (the `[[cta]]` box plus the form). No competing asks.

## Structure (required)
- Front matter: copy the format of an existing post exactly. Fields:
  `slug, post_number, date_published, wave, cluster, title_tag, meta_description, primary_keyword, secondary_keywords (5-6), h1, dek, short_answer, diagnosis {audience, outcome, barrier}, cta {service_url, service_label, headline, body, button, form_subject}, related (3 existing slugs), faq (5-6 q/a), sources (2+ {title, publisher, url, date})`.
- `cluster` must be one of: getting-an-atm, choosing-an-atm-company, atms-by-business-type, owning-an-atm, selling-an-atm, starting-an-atm-business, industry-news.
- `post_number`: use 100+ for new posts (next unused number).
- `title_tag` ≤ 60 characters. `meta_description` 110–160 characters. `short_answer` 35–70 words that directly answer the question (this is what Google and AI tools quote).
- Body: 800–1,300 words. Hook (3–6 short paragraphs), then H2s written as the questions people actually search, H3s only for lists of steps or items.
- Place `[[cta]]` on its own line once, about 55–65% of the way through.
- Link to the main service page (`cta.service_url`) in the body at least once, using descriptive anchor text. Link to at least 2 existing posts (`slug.html`). Site pages are `../page.html`.
- Tables are welcome for comparisons and math.
- End with a short "bottom line" section.
- Add "*This is general information, not legal advice.*" on any post touching law, contracts, or taxes.

## Research standards
- Research first: at least 8 web searches. Find what people actually ask (search results, "People also ask," forums, Reddit), what currently ranks, and what it misses.
- Prefer primary sources: Federal Reserve, FTC, FDIC, CFPB, state agencies (Alabama Securities Commission, Alabama Legislature, Alabama Banking Department), Bankrate, card networks, manufacturers (Hyosung, Genmega), trade press (ATM Marketplace, NACS). Local news is fine for local events.
- Every statistic must come from a source in `sources`. Say who found it and when ("The Federal Reserve's 2026 study found...").
- Paraphrase. No quote longer than 15 words, and at most one quote per source.
- Don't use unsourced industry claims (e.g., "ATMs raise sales 20%," "900 transactions a day," "75% of event cash is spent on site").
- If a statistic describes fee-free ATMs (like NCR Atleos surveys), say so.
- Never link to competing ATM companies.

## Duplicates and topics
- Topic selection follows the topic gate in `AGENT_TASK.md`. A post must answer a question real people search for or ask, and one no existing post, pending post, or site page already answers.
- Run `python3 tools/topic_check.py --index --repo ..` to see every question already covered, and `--question` to score a candidate.
- A new angle only counts if it serves a different searcher need, not just different wording.
- Prefer the long-tail, specific questions a business owner types when they're close to a decision, especially Alabama-specific ones.
