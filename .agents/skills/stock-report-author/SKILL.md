---
name: stock-report-author
description: "Use when adding, updating, translating, publishing, or archiving a stock, ETF, leveraged ETF, crypto, or industry research report in this repository. Trigger for requests such as add a ticker, write a new post, create the English report, update today's report, publish a report, or create the next dated edition."
---

# Stock Report Author

Use this skill for every new or revised report in this repository. The project is an Astro static site backed by an MDX content collection. Write research in the content files and let the existing layouts, routes, styles, analytics, history navigation, and advertising components do the repeated work.

## Authorship

Reports in this repository are drafted by the AI coding agent — model Muse Spark (`opencode/muse-spark-1.3-contributor-free`), running via OpenCode. The repository owner reviews, publishes, and is responsible for the final content.

Every new or updated report edition must disclose this in its `Disclosure` component, e.g. zh-TW: 「本報告初稿由 AI 助手（Muse Spark）撰寫，經站方審閱發布」；en: "Drafted by an AI assistant (Muse Spark) and reviewed before publication." Never sign a report with a human author name and never present the agent as a licensed analyst. Editions published before this rule are backfilled the next time they are touched, not mass-edited. Presence of the disclosure is enforced by `validate-content.mjs` as a publication failure, not a warning.

## Before Editing

1. Read the repository `README.md`, `src/content.config.ts`, `scripts/new-report.mjs`, `scripts/publish-report.mjs`, and `scripts/validate-content.mjs` when the workflow or schema is unclear.
2. Check `git status --short`. Preserve unrelated user changes and work with them.
3. Inspect the target ticker directory before creating a new date. A new edition must not overwrite an existing snapshot.
4. For investment claims, obtain current, dated sources before writing. Prefer company investor relations pages, SEC filings, official fund pages, prospectuses, index methodology documents, and other first-party disclosures. Do not invent current price, yield, assets, earnings, valuation, or performance figures.
5. Treat the requested date as the report's `publishedAt` and `dataAsOf` date only when the source evidence supports that date. State data limitations when a source is older or a scenario is untested.

## Create The Edition

Run the project scaffold from the repository root:

```bash
npm run report:new -- --ticker=AMD --date=YYYY-MM-DD
```

Use an uppercase ticker and an ISO date. The script creates:

```text
src/content/reports/<TICKER>/<DATE>/<TICKER>.zh-TW.mdx
```

Reports are currently published in Traditional Chinese only. The validator rejects English editions (`English reports are no longer supported`), so do not create `.en.mdx` files and do not reference EN routes as live surfaces. If English coverage is ever reintroduced, it needs its own specification; until then, every "both locales" rule in older revisions of this skill is superseded by this paragraph.

The latest edition is derived automatically: among published reports with the same ticker and locale, the greatest `publishedAt` is the current version. Do not manually mark older files, delete snapshots, or edit the generated route HTML. Historical reports remain immutable and are rendered at dated URLs.

If the ticker is new or has unusual semantics, check and correct the generated metadata:

- `reportType: equity` for a company share.
- `reportType: income-etf` only for an income-oriented ETF.
- `reportType: crypto` for a crypto asset or crypto-focused report.
- `reportType: other` for benchmarks, leveraged products, industries, commodities, or other non-standard subjects.
- `translationKey` uses the `<ticker>-<date>` convention (e.g. `tsla-2026-09-29`). Cross-locale matching is retired with the EN track.
- Do not add a latest-version flag; latest status is derived from `ticker`, `locale`, `status`, and `publishedAt`.

## Write The MDX

Write the article body, not a standalone HTML page. Keep these frontmatter fields valid:

```yaml
---
ticker: DRAM
publishedAt: 2026-09-29
dataAsOf: 2026-09-28
reportType: other
translationKey: dram-2026-09-29
status: draft
tags:
  - DRAM
locale: zh-TW
title: "Dated, search-friendly report title"
description: "A dated summary of the subject, evidence, key trade-offs, and principal risks."
---
```

Every publishable zh-TW report needs these sections (exact headings; this replaces the retired EN heading list):

```markdown
## 分析摘要
## 行情快照
## 進場點分析
## 主要風險與否定條件
## 分析結論
## 資料來源
```

Plus a `Disclosure` component (data limits, AI authorship, no personalized advice) and, for daily/event editions, a `每日事件速覽` section immediately after the market snapshot. Also include sections appropriate to the subject, such as business-model, moat, valuation-band, or product-structure analysis. The conclusion must state what evidence supports the thesis, what could invalidate it (at least one explicit 作廢條件), and what should be monitored next.

Include at least two dated or clearly attributable source URLs. Separate observed facts from interpretation, estimates, and scenarios. Avoid personalized suitability claims, guaranteed returns, undisclosed forecasts, and statements that imply the report is financial advice.

### Reader-facing prose audit

The report is a research article, not a build log. Do not put implementation details in the body or ordinary source annotations: local asset paths, download or storage statements, MIME types, codec names such as H.264/AAC, responsive/mobile playback claims, component names, build/deployment status, or explanations of how an image/video is embedded. Describe what the media shows, why it matters, and its evidence limits. Keep only source attribution and legally necessary rights/context. Before publishing, scan the rendered prose for phrases such as “本站保存”、“本頁保存”、“方便手機播放”、“H.264”、“AAC”、“MP4” and remove them unless the user explicitly requested a technical artifact or the detail is material to the research claim.

When a short metadata label must be bold in MDX, use an explicit `<strong>…</strong>` element (especially at the start of a paragraph) and verify the generated HTML contains `<strong>`. Do not assume `**label**` will render correctly in every content path.

### English Edition (retired)

The EN track is retired: the validator fails any `.en.mdx` file, the scaffold no longer generates one, and `/stock/en/` routes are legacy. Do not write English editions, do not cite EN heading lists, and do not apply the audience rules below. This section is kept as a tombstone so future agents don't resurrect it from git history without a new specification.

~~The English edition is for an international audience. Do not address readers as Taiwanese investors and do not introduce ROC, Taiwan withholding tax, Taiwan filing rules, or Taiwan-specific suitability assumptions unless the report is explicitly about that subject. Use internationally understandable terms, identify U.S. market conventions when relevant, and explain specialist terms such as daily reset, NAV erosion, modified capitalization weighting, or free-cash-flow conversion.~~

### Traditional Chinese Edition (the live edition)

Write a real `zh-TW` translation or localized analysis, not a copy of the English template. Keep the same analytical conclusion and evidence boundaries, but use natural Traditional Chinese. Do not claim that ROC or Taiwan tax treatment applies to an international reader; include Taiwan-specific tax context only when the Chinese edition's scope requires it.

### MDX Components

Use MDX when the report benefits from an existing component:

- `Metrics` for a small set of clearly sourced headline figures.
- `Disclosure` for data limitations, methodology notes, and educational disclaimers.
- `AdSlot` only for a deliberate in-article mid placement. The shared layout already supplies top and bottom advertising.
- `XPostCard` for every cited X post (official widget + static fallback; renders the real embed with video/thread expansion, never a bare URL or paraphrase-only mention). Import path follows the scaffold; pass the original `sourceUrl`, and a `mediaUrl` only when the post carries a photo whose direct image URL is known from a fetch result — never fabricate one.
- `ThreadsEmbed` for every cited Threads post (`permalink` + `author` + `fallbackLabel`).
- `DistributionTrend` for monthly-payout history in income-ETF reports (`ticker` + inline `points` of `[month, $/share]` + `source` + `dataAsOf`; `client:load`). Embed only with verified per-month amounts from the issuer's distribution table or a dated announcement — never interpolate a missing month, omit it and state the gap. Pair with a one-sentence read (noise vs signal) so the chart is evidence, not decoration.

### Inline Citations (no URL graveyards)

Every factual claim that comes from a cited post, filing, article, or dataset MUST link inline at the point of use with a Markdown link (`[text](url)`), so the reader can verify without scrolling. The end-of-report Sources section remains as the bibliography, but a report whose published body (before Sources) contains zero inline links is a defect. Bare URLs pasted as prose are forbidden — always wrap them in a component (`XPostCard` / `ThreadsEmbed`) or an inline link.

### Prose Rhythm (not a bullet dump)

- No section may be bullets-only scaffolding: every bulleted list needs a prose lead-in that states the judgment, with bullets carrying only the supporting facts.
- Never more than 6 consecutive bullets; longer enumerations must be split with a prose bridge or converted to a table.
- Key comparisons (before/after, bull/bear, claim-vs-verification) belong in a Markdown table or `Metrics`, not in bullets.
- Each major section opens with 1–2 prose sentences framing what follows; single-sentence sections followed only by a card are forbidden.

### De-AI Pass (humanizer-zh-next)

After the draft is fact-complete and before publishing, run one de-AI pass with the
`humanizer-zh-next` agent skill (`.agents/skills/humanizer-zh-next/SKILL.md`).
Reports are `zh-TW` investment research, so apply the skill with these repo guardrails
— the skill's fidelity rules win over its style rules wherever they conflict:

- **Genre is 技術/財經分析, not 個人敘事/營銷.** Never invent facts, numbers, dates,
  quotes, cases, or causal claims to "add humanity". Every figure keeps its `dataAsOf`
  and source; `Disclosure`, `Metrics`, levels, and 作廢條件 stay byte-identical in meaning.
- **Keep zh-TW, never drift to simplified.** The skill's examples are simplified-Chinese;
  apply the pattern, not the script. `指數`, `賦能`→具體動作, 標點全形化仍按本站規範.
- **Domain terms are not AI taste.** `閉環` (SpaceX 閉環兌現 / closed-loop execution),
  `護城河`, `安全邊際`, `作廢條件` are legitimate investment vocabulary — do not rewrite them.
  Fix only decorative stacking (三連排比湊數, 空泛三段式) and template scaffolding.
- **Quoted evidence is untouchable.** Verbatim content inside `XPostCard` / `ThreadsEmbed`
  (including emoji in the original post) is someone else's voice — never polish it.
- **Priority hits for this repo:** 導覽式開場 (讓我們深入探討/下面我們來拆解),
  協作痕跡 (當然可以/下面是一份/希望這對你有幫助), 知識截止聲明,
  通用積極結尾 (未來可期/廣闊前景/將創造更大價值), 權威姿態
  (歸根結底/真正的問題是/核心在於) 後面只跟空話的, 成串破折號製造揭示感,
  結尾突然的人造金句. `npm run prose:check` blocks the hard failures and prints
  advisories for the rest — clear failures, read advisories, then do the human pass.

### Chart Deduplication (one price chart per page)

`ReportLayout` auto-renders `MarketTrend` (a `CandlestickChart` fed by `/stock/data/market/<TICKER>.json`) above every non-archive report. The MDX body MUST NOT embed a second chart from the same source: do not import or embed `CandlestickChart` / `ClosePriceChart` in an ordinary report. State OHLC, data cutoff, and support/resistance levels in prose and the Entry Point section instead.

Exception (technical-analysis-dedicated): only when annotated levels are the core evidence — support/resistance, trendline, or Fibonacci levels computed from the dated OHLC with an explicit `levels=` prop — the body may keep exactly ONE annotated `<CandlestickChart levels={...}>` in the market-visualization section, and the layout default must be suppressed for that page so the rendered total stays at one. Suppress it with `hideMarketTrend: true` in frontmatter. Never ship the plain layout chart plus an annotated body chart together. Archive snapshots render no layout chart, so a single body chart there is allowed.

### Market Snapshot Must Include Year-To-Date

The shared `MarketDecisionPanel` renders YTD rows automatically from `src/data/market.ts`, but it can only do so when the snapshot actually covers the year. Before publishing a report whose `dataAsOf` falls later in the year than the snapshot's first row, backfill history to at least the first trading week of January (pinned `period2`, never include sessions newer than `dataAsOf`; keep overlapping rows untouched so cited numbers stay stable). Verify the panel's 年初至今報酬 matches an independent calculation.

### Market Snapshot and Entry Must Include Size

Every report's 市場快照 `Metrics` MUST include the current size as of `dataAsOf`: for equities, market cap labeled `市值（YYYY-MM-DD）`; for ETFs/commodity trusts, fund size labeled `規模（YYYY-MM-DD）`. Compute it as verified close × verified share count and show the method in prose or `Disclosure` — never copy a live quote-page number whose date differs from `dataAsOf` without restating. Practical sources: CNBC quote API `sharesout` (bulk-fetchable, includes ETFs it covers), the issuer's fund page (shares outstanding + NAV date), or the latest 10-Q share count. When the share count itself is stale or unavailable (e.g., SPYI), print the most recent dated AUM with an explicit 待更新 flag instead of fabricating precision.

The 進場點分析 MUST contain one 規模視角 line before the action table: the cap/size figure, the dataAsOf session's implied dollar swing (range × cap), and a one-line liquidity read (mega-cap index-like liquidity vs smaller-cap wider swings and batch-size caution). A timing setup without a size context is incomplete: the same 5% move is a different trade at $2T vs $40B.

Use the existing import paths generated by the scaffold. Do not paste page HTML, layout markup, CSS, analytics code, related-report links, history navigation, Adsterra scripts, social-bar scripts, popunder scripts, or smartlink URLs into a report. Those belong to shared components.

Do not add custom SVG charts or numeric metrics unless the data, date, units, source, and calculation are clear. For calculated values, describe the method and avoid presenting estimates as reported facts.

### Monetization Check

Every publishable report must include one deliberate mid-article `<AdSlot placement="mid" />` when the article is long enough to have a natural reading break. This is the standard monetization placement for the daily report; do not paste ad scripts, smartlinks, popunders, or multiple ad blocks into the article. The shared layout supplies top and bottom advertising, so verify the rendered page has a readable ad separation rather than adding ad density for its own sake.

### Market Timing And Entry Points

Every actively traded asset report must include a dated current-market visualization. For stocks and ETFs this means a candlestick chart covering the latest completed session and enough recent sessions to make the trend readable; include the data cutoff, OHLC values, and source. Do not use a decorative or single-candle chart.

Technical analysis must be reproducible from the report's dated OHLC data and must be treated as timing evidence, not a forecast. Apply the following review before writing technical conclusions:

- Identify the analysis window and the actual swing high／low used for any trendline or Fibonacci calculation; show the resulting price levels and calculation basis.
- Discuss trend direction, moving averages or momentum, support, resistance, volume, and breakout／breakdown conditions. If a level is subjective, label it as an observation threshold rather than a fact.
- When a chart-reading post, AI chart interpretation, Elliott Wave count, or social-media price map is used, link the original source and separate its observations from the report's independently calculated levels. AI or social chart reading may pre-screen a setup, but cannot by itself create a buy, sell, or valuation conclusion.
- Add the relevant calculated levels to the existing interactive candlestick chart when the component supports annotations. Use the repository's existing React chart implementation and market JSON; never substitute TradingView embeds, screenshots, MUI X Charts, or another unassigned chart library.
- Cross-check the technical setup against fundamentals, valuation, event risk, and relative market performance. A technical breakout without operating evidence is only a timing event; a cheap valuation without price stabilization is not a timing signal.

Every investment report must also include an explicit `Entry Point Analysis` section (or a clearly translated equivalent) with both technical timing and fundamental valuation. Cover trend, moving averages or momentum, support/resistance, breakout or breakdown conditions, valuation-based price bands, margin-of-safety logic, staged-entry rules, and the operating evidence required before adding.

Separate technical timing from business value. Price bands are scenarios or decision thresholds, not guaranteed intrinsic value or personalized advice. Include distinct guidance for an empty-handed investor and an existing holder, plus add, trim, and thesis-invalidation triggers.

For a daily report, place a `Daily Event Brief` (or translated equivalent) immediately after the market visualization and before the deep research. It must state the publication-time status, distinguish confirmed facts from rumors or missing disclosures, explain the likely financial read-through, and list the next observable checks. Treat an event, launch, demo, or announcement as a catalyst—not revenue, margin, or valuation proof—until operating evidence supports that interpretation.

## Review Before Publishing

Run the checks from the repository root:

```bash
npm run check
npm run content:check
npm run prose:check
npm run build
npm run build:check
git diff --check
```

Before changing `status`, inspect the rendered scope mentally or with the generated files:

- The latest page uses the report's ticker and date; latest status is derived, never hand-flagged.
- The newest published edition is automatically selected by `ticker + locale + publishedAt`; duplicate dates for the same ticker and locale must fail validation.
- The report is not still a scaffold: remove phrases such as `Write the`, `Explain the`, `State the`, `Add official`, and `before publication`.
- Sources support the claims and are not merely generic homepages when a specific filing or prospectus exists.
- No source, metric, title, or description contains accidental placeholder text.
- Risks cover product structure, valuation or market risk, liquidity, execution, and the failure mode specific to the subject.
- The current candlestick is dated to the latest completed session, readable over a meaningful recent window, and backed by OHLC source data.
- Entry-point analysis covers both technical timing and fundamental valuation, with staged actions and explicit invalidation triggers.
- A daily report leads with a dated event brief that separates confirmed facts, unknowns, market read-through, and next checks.
- Each publishable report includes the deliberate mid `AdSlot`; monetization scripts remain centralized in shared components.
- The page does not make a personalized recommendation or promise a return.
- The de-AI pass (humanizer-zh-next, see above) is done: `prose:check` passes and no
  template scaffolding, tour-guide openings, collaboration scars, or generic-optimism
  closings remain in the report's own voice (quoted posts excluded).

## Publish, Commit, And Push

Keep the file as `status: draft` while writing. Publish only after the article and sources are complete:

```bash
npm run report:publish -- --ticker=AMD --date=YYYY-MM-DD --locale=zh-TW
```

The publish command flips the status and runs `content:check`, reverting the file if validation fails. Run `npm run content:check` again after publishing, then run a full build. Do not publish a placeholder merely to make a ticker appear on the index.

For this repository, a completed report task defaults to the full release flow: after publication and all required checks pass, automatically create a focused commit and push it to the current branch's configured remote. The normal sequence is:

```bash
npm run report:publish -- --ticker=AMD --date=YYYY-MM-DD --locale=zh-TW
npm run check
npm run content:check
npm run prose:check
npm run build
npm run build:check
git diff --check
git add <report-files>
git commit -m "新增或更新 <TICKER> 投資研究報告"
git push
```

Before committing, inspect `git status --short` and `git diff --stat`. Stage only the report files and the intended supporting changes; never include unrelated user changes. After pushing, verify the commit hash, remote push result, and that `git status --short` is clean.

Stop before publishing, committing, or pushing when a required data source is missing for a formal conclusion, any validation or build check fails, the report is still a scaffold, the configured remote or branch is unavailable, or the worktree contains unrelated changes that cannot be safely separated. In those cases, explain the exact blocker and leave the report as a draft when possible.

If the user explicitly says `draft only`, `do not publish`, `do not commit`, or `do not push`, follow that narrower instruction for the current task.

## Corrections To Published Editions

Dated URLs mean early readers may see different bytes than later readers, so amendments are a controlled exception, not a workflow:

- Allowed in place (same `publishedAt`, commit message must state the fix): typos, JSX/brace errors, chart-wiring fixes, verified-number corrections against the same `dataAsOf`, and the authorship-disclosure backfill.
- Never amended in place: anything that changes `dataAsOf`, adds evidence, revises the conclusion, or adds/removes sections — that is a new dated edition.
- `publishedAt` is never backdated. An amended file keeps its original date; the fix rides in git history, not in a new timestamp.

Market history is append-only: `update-market-data.mjs` union-merges fetched rows with stored rows (fetched wins on overlap) and refuses to shrink history on narrow `--range` runs, warning loudly instead. Never hand-edit `src/data/market.ts` rows to "fix" a report number — fix the report.

## History And URLs

The latest report is available at:

```text
/stock/reports/<ticker>/
```

The immutable dated edition is available at:

```text
/stock/reports/<ticker>/<date>/
```

(`/stock/en/…` routes are legacy tombstones, not live surfaces.)

The index and report layout discover historical published editions from the content collection. Do not create `report/*.html` files for new content. Legacy `.html` URLs are handled by the shared redirect generator.

## Completion Handoff

Report what was added, the locales and publication state, the source coverage, the checks run, the commit hash, and the push result. A completed report task includes the automatic commit-and-push flow above unless the user narrowed the request to drafting, checking, or local-only work.
