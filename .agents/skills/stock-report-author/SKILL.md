---
name: stock-report-author
description: "Use when adding, updating, translating, publishing, or archiving a stock, ETF, leveraged ETF, crypto, or industry research report in this repository. Trigger for requests such as add a ticker, write a new post, create the English report, update today's report, publish a report, or create the next dated edition."
---

# Stock Report Author

Use this skill for every new or revised report in this repository. The project is an Astro static site backed by an MDX content collection. Write research in the content files and let the existing layouts, routes, styles, analytics, history navigation, and advertising components do the repeated work.

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

Use an uppercase ticker and an ISO date. The script creates both:

```text
src/content/reports/<TICKER>/<DATE>/<TICKER>.en.mdx
src/content/reports/<TICKER>/<DATE>/<TICKER>.zh-TW.mdx
```

The script marks the previous edition for that ticker as `isLatest: false`. Do not manually move old reports, delete snapshots, or edit the generated route HTML. Historical reports remain immutable and are rendered at dated URLs.

If the ticker is new or has unusual semantics, check and correct the generated metadata:

- `reportType: equity` for a company share.
- `reportType: income-etf` only for an income-oriented ETF.
- `reportType: crypto` for a crypto asset or crypto-focused report.
- `reportType: other` for benchmarks, leveraged products, industries, commodities, or other non-standard subjects.
- `translationKey` must match between the English and Traditional Chinese editions for the same date.
- `isLatest: true` belongs only to the newest edition of that ticker and locale.
- Keep both locales aligned on ticker, date, report type, and publication state.

## Write The MDX

Write the article body, not a standalone HTML page. Keep these frontmatter fields valid:

```yaml
---
ticker: AMD
publishedAt: 2026-09-03
dataAsOf: 2026-09-03
reportType: equity
translationKey: amd-2026-09-03
isLatest: true
status: draft
tags:
  - AMD
locale: en
title: "Clear, search-friendly report title"
description: "A dated summary of the subject, evidence, key trade-offs, and principal risks."
---
```

Every publishable English report needs these headings exactly:

```markdown
## Executive Summary
## Key Risks
## Analyst Conclusion
## Sources
```

Also include sections appropriate to the subject, such as `Business Model`, `Strategy and Structure`, `Evidence`, `Valuation Framework`, `Benchmark Construction`, or `Use Case`. Write at least 400 English words. The conclusion must state what evidence supports the thesis, what could invalidate it, and what should be monitored next.

Include at least two dated or clearly attributable source URLs. Separate observed facts from interpretation, estimates, and scenarios. Avoid personalized suitability claims, guaranteed returns, undisclosed forecasts, and statements that imply the report is financial advice.

### English Audience

The English edition is for an international audience. Do not address readers as Taiwanese investors and do not introduce ROC, Taiwan withholding tax, Taiwan filing rules, or Taiwan-specific suitability assumptions unless the report is explicitly about that subject. Use internationally understandable terms, identify U.S. market conventions when relevant, and explain specialist terms such as daily reset, NAV erosion, modified capitalization weighting, or free-cash-flow conversion.

### Traditional Chinese Edition

Write a real `zh-TW` translation or localized analysis, not a copy of the English template. Keep the same analytical conclusion and evidence boundaries, but use natural Traditional Chinese. Do not claim that ROC or Taiwan tax treatment applies to an international reader; include Taiwan-specific tax context only when the Chinese edition's scope requires it.

### MDX Components

Use MDX when the report benefits from an existing component:

- `Metrics` for a small set of clearly sourced headline figures.
- `Disclosure` for data limitations, methodology notes, and educational disclaimers.
- `AdSlot` only for a deliberate in-article mid placement. The shared layout already supplies top and bottom advertising.

Use the existing import paths generated by the scaffold. Do not paste page HTML, layout markup, CSS, analytics code, related-report links, history navigation, Adsterra scripts, social-bar scripts, popunder scripts, or smartlink URLs into a report. Those belong to shared components.

Do not add custom SVG charts or numeric metrics unless the data, date, units, source, and calculation are clear. For calculated values, describe the method and avoid presenting estimates as reported facts.

### Monetization Check

Every publishable report must include one deliberate mid-article `<AdSlot placement="mid" />` in each locale when the article is long enough to have a natural reading break. This is the standard monetization placement for the daily report; do not paste ad scripts, smartlinks, popunders, or multiple ad blocks into the article. The shared layout supplies top and bottom advertising, so verify the rendered page has a readable ad separation rather than adding ad density for its own sake.

### Market Timing And Entry Points

Every actively traded asset report must include a dated current-market visualization. For stocks and ETFs this means a candlestick chart covering the latest completed session and enough recent sessions to make the trend readable; include the data cutoff, OHLC values, and source. Do not use a decorative or single-candle chart.

Every investment report must also include an explicit `Entry Point Analysis` section (or a clearly translated equivalent) with both technical timing and fundamental valuation. Cover trend, moving averages or momentum, support/resistance, breakout or breakdown conditions, valuation-based price bands, margin-of-safety logic, staged-entry rules, and the operating evidence required before adding.

Separate technical timing from business value. Price bands are scenarios or decision thresholds, not guaranteed intrinsic value or personalized advice. Include distinct guidance for an empty-handed investor and an existing holder, plus add, trim, and thesis-invalidation triggers.

For a daily report, place a `Daily Event Brief` (or translated equivalent) immediately after the market visualization and before the deep research. It must state the publication-time status, distinguish confirmed facts from rumors or missing disclosures, explain the likely financial read-through, and list the next observable checks. Treat an event, launch, demo, or announcement as a catalyst—not revenue, margin, or valuation proof—until operating evidence supports that interpretation.

## Review Before Publishing

Run the checks from the repository root:

```bash
npm run check
npm run content:check
npm run build
npm run build:check
git diff --check
```

Before changing `status`, inspect the rendered scope mentally or with the generated files:

- The English and Chinese latest pages use the same ticker and date.
- The newest edition is the only `isLatest: true` published edition for that ticker and locale.
- The report is not still a scaffold: remove phrases such as `Write the`, `Explain the`, `State the`, `Add official`, and `before publication`.
- Sources support the claims and are not merely generic homepages when a specific filing or prospectus exists.
- No source, metric, title, or description contains accidental placeholder text.
- Risks cover product structure, valuation or market risk, liquidity, execution, and the failure mode specific to the subject.
- The current candlestick is dated to the latest completed session, readable over a meaningful recent window, and backed by OHLC source data.
- Entry-point analysis covers both technical timing and fundamental valuation, with staged actions and explicit invalidation triggers.
- A daily report leads with a dated event brief that separates confirmed facts, unknowns, market read-through, and next checks.
- Each publishable locale includes the deliberate mid `AdSlot`; monetization scripts remain centralized in shared components.
- The page does not make a personalized recommendation or promise a return.

## Publish

Keep both locale files as `status: draft` while writing. Publish only after the article and sources are complete:

```bash
npm run report:publish -- --ticker=AMD --date=YYYY-MM-DD --locale=en
npm run report:publish -- --ticker=AMD --date=YYYY-MM-DD --locale=zh-TW
```

The publish command validates the English content and reverts the file if validation fails. Run `npm run content:check` again after publishing both locales, then run a full build. Do not publish a placeholder merely to make a ticker appear on the index. If one locale is not ready, leave that locale as `draft` and explain the incomplete coverage in the handoff.

## History And URLs

The latest report is available at:

```text
/stock/reports/<ticker>/
/stock/en/reports/<ticker>/
```

The immutable dated edition is available at:

```text
/stock/reports/<ticker>/<date>/
/stock/en/reports/<ticker>/<date>/
```

The index and report layout discover historical published editions from the content collection. Do not create `report/*.html` files for new content. Legacy `.html` URLs are handled by the shared redirect generator.

## Completion Handoff

Report what was added, the locales and publication state, the source coverage, and the checks run. If the user explicitly asks for a commit or push, use a focused commit message and verify `git status --short` afterward. Do not push merely because a report was written unless the user authorized pushing in the current request or the established task explicitly includes publishing.
