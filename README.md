## Stock research reports

This repository publishes static investment research pages with Astro and MDX. Report pages are generated from the dated content collection; legacy report URLs redirect to the generated latest pages.

### Authoring a report

```bash
npm install
npm run report:new -- --ticker=JEPQ --date=YYYY-MM-DD
npm run check
npm run content:check
npm run build
```

Write report prose in `src/content/reports/<TICKER>/<DATE>/`. Use `.mdx` when the article needs a shared component such as `Metrics` or `Disclosure`. Do not duplicate page HTML, CSS, JavaScript, metadata, related links, or advertising code in an article.

Each report has a latest URL and a dated archive URL. Historical files are immutable snapshots; adding a new report date marks the previous version as historical instead of moving or overwriting it.

English reports start as `draft`. After completing the sources and review, publish one locale with `npm run report:publish -- --ticker=JEPQ --date=YYYY-MM-DD --locale=en`. The command validates published English content, including a 400-word minimum, risk and conclusion sections, and at least two source URLs, then reverts the change when validation fails.

### Advertising

The shared `AdSlot` component centralizes the approved Adsterra native, banner, and smartlink placements. `MonetizationScripts` loads the social-bar and popunder scripts once per page. Keep ads outside article sections, label sponsored links, and verify Adsterra policy and user-consent requirements for every target market.

### Framework layout

- `src/content/reports/`: dated Chinese and English MDX content, including historical snapshots
- `src/components/report/`: shared report UI and monetization components
- `src/pages/`: static routes, language routes, sitemap, and robots.txt
- `scripts/new-report.mjs`: repeatable report scaffolding

### Deployment

The GitHub Actions workflow validates the MDX collection, builds `dist`, copies the legal HTML pages, generates redirects for legacy report URLs, and deploys the result to GitHub Pages. Enable GitHub Pages with `GitHub Actions` as the source in the repository settings before expecting a new deployment. Adsterra revenue depends on the approved publisher account, domain, traffic quality, and available demand in each visitor market.
