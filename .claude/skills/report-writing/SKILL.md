---
name: report-writing
description: Write or update investment research reports in the Astro MDX content collection. Use when authoring a new report, translating a report, or updating dated market evidence.
---

# Report writing workflow

The agent's job is research, reasoning, prose, citations, and translation quality. The framework owns HTML, CSS, JavaScript, SEO metadata, routing, related links, sitemap, responsive behavior, and advertising slots.

## Allowed changes

- Add or edit `src/content/reports/<TICKER>/<YYYY-MM-DD>/<TICKER>.<locale>.mdx`.
- Add dated primary-source links and data caveats inside the report.
- Use existing report components such as `Metrics` and `Disclosure`.
- Run `npm run check` and `npm run build` after writing.

## Do not edit for ordinary writing tasks

- `src/components/report/`
- `src/styles/`
- `src/pages/`
- `sitemap.xml`, `robots.txt`, or root HTML pages
- inline `<style>` or `<script>` blocks in MDX

## Required evidence discipline

- Every market number has a `dataAsOf` date and a source.
- Separate observed performance from scenario analysis.
- State what is unknown or not disclosed instead of inventing a value.
- Do not imply future returns, guaranteed income, or personalized suitability.
- Income-fund reports may discuss ROC only when the security actually distributes income.
- Published English reports should be at least 400 words and include `Key Risks`, `Analyst Conclusion`, and at least two source URLs.

## New report command

Start with:

```bash
npm run report:new -- --ticker=JEPQ --date=YYYY-MM-DD
```

The command creates Chinese and English MDX files and marks earlier versions of the same ticker as historical. Fill in both files before publication. Do not move or delete old dated reports.
