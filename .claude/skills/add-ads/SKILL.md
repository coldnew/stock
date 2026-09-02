---
name: add-ads
description: Insert Adsterra ad placements into the standalone HTML investment reports under reports/, matching the existing parchment/dark-mode theme and the shared interactive layer (collapsible sections, TOC). Use when adding monetization to a new or existing report in this repo, or when the user asks to "add ads" / "monetize" a report.
---

# Adding Adsterra ads to a report

These reports are self-contained Kami-style HTML files (parchment design system,
dark-mode support, collapsible sections, chart tooltips — see the shared
interactive layer already inlined in each report). This skill adds ad slots to
that same layout without breaking the interactive layer.

## Non-negotiable: never touch the Adsterra account

Never attempt to log into https://beta.publishers.adsterra.com/links, enter a
password into any form, or otherwise authenticate on the user's behalf — this
holds even if the user pastes credentials directly into chat. Ad unit codes
must be obtained by the user, in their own browser, and pasted to Claude as
plain HTML/JS snippets (not credentials).

## Before doing anything: check the domain requirement

Adsterra ad units are approved per registered domain. A `file://` HTML report
opened locally will generally show blank ad slots and earn nothing — the
report must actually be hosted at the domain Adsterra approved (e.g. the
user's blog) before ads will serve or pay out. If it's unclear whether these
reports are deployed anywhere yet, ask the user where they'll be hosted before
assuming the ad codes will work as-is.

## Getting the ad code (user does this manually)

1. User logs into Adsterra Publishers themselves and adds the site/domain if
   not already added, then waits for approval.
2. Under "My Placements", the user creates an ad unit. For a text-heavy
   financial report, recommend formats that don't disrupt reading:
   - **Native Banner** — blends into content, best fit for these reports.
   - **Banner (300x250 or 728x90)** — fine for the top/bottom slots.
   - Avoid **Popunder** / **Social Bar** for this content — they're intrusive
     and will hurt trust in an analysis report; only use them if the user
     explicitly asks.
3. User copies the generated `<script>`/`<ins>` snippet and pastes it to
   Claude (or edits the file directly).

## Where ad slots live in each report

Each report already has three `.ad-slot` placeholders, inserted as **top-level
children of `<body>`** (not nested inside any section):

1. Top — right after the `.metrics` bar, before the first `<h2>`.
2. Mid-content — before the `<h2>` roughly halfway through the report.
3. Bottom — right before `.report-footer`.

Placement as top-level `<body>` children (not inside a `.section-body`) is
required: the shared interactive script groups everything between one `<h2>`
and the next into a collapsible `.section-body`. If an ad slot were swept into
that group, collapsing the section would hide the ad. The script explicitly
excludes elements with the `ad-slot` class from this grouping (same treatment
as `.report-footer`) — this exclusion must be preserved if the shared script
block is ever regenerated.

## Ad slot markup + CSS (already present in each report)

```html
<div class="ad-slot" aria-label="Advertisement">
  <div class="ad-slot-label">Advertisement</div>
  <!-- Adsterra ad unit code goes here -->
</div>
```

```css
.ad-slot {
  margin: 16pt 0;
  padding: 10pt;
  border: 0.5pt dashed var(--border);
  border-radius: 6pt;
  text-align: center;
  background: var(--ivory);
  min-height: 40pt;
}
.ad-slot-label {
  font-size: 7.5pt;
  letter-spacing: 1pt;
  text-transform: uppercase;
  color: var(--stone);
  margin-bottom: 6pt;
}
```

This already themes correctly in dark mode since it uses the existing
`--border`/`--ivory`/`--stone` custom properties.

## Filling in a real ad code

Find each `<!-- TODO: paste Adsterra ad unit code here (... placement) -->`
comment inside a `.ad-slot` div and replace it with the snippet the user
provides. Insert the snippet as-is (don't reformat/minify third-party ad
script).

Adsterra gives out several different code shapes — they don't all fit the
same slot the same way. Established precedent (see `reports/ovl-analysis.html`
and `reports/qqqi-bear-case.html`, both live):

- **Banner** (`invoke.js` + a `<div id="container-...">`) is tied to one
  specific container id. Only place it in **one** slot (top, for visibility)
  — duplicating the same id across multiple `.ad-slot`s is invalid HTML and
  the script will only render into the first match.
- **Smart link** is a plain URL, safe to reuse verbatim in multiple slots
  (no shared DOM id to collide). Render it as a small styled `<a>` — see
  `.ad-smartlink` CSS below — rather than dropping a bare script; it's just
  a link. Vary the visible label slightly per placement if it reads oddly
  repeated verbatim.
- **Popunder** and **social bar** scripts are page-wide and self-inject (no
  container div, no slot needed) — include **one copy of each**, anywhere
  in `<body>` that isn't inside a `.section-body` (e.g. right after the last
  `.ad-slot`, before `.report-footer`). Do not put these inside a `.ad-slot`
  div or repeat them per slot.
- **Native banner** (if used later) generally works like Banner — one
  container id, one placement.

```css
.ad-smartlink {
  display: inline-block;
  padding: 6pt 14pt;
  border: 0.5pt solid var(--brand);
  border-radius: 3pt;
  color: var(--brand);
  text-decoration: none;
  font-size: 9.5pt;
  font-weight: 500;
  transition: background-color .15s ease, color .15s ease;
}
.ad-smartlink:hover { background: var(--brand); color: var(--parchment); }
```

```html
<a class="ad-smartlink" href="SMART_LINK_URL" target="_blank" rel="noopener sponsored nofollow">贊助連結 · 延伸閱讀 →</a>
```

Always add `rel="noopener sponsored nofollow"` on outbound ad links —
`noopener` for security (the target page can't reach back via
`window.opener`), `sponsored` per Google's ad-link guidance, `nofollow` as a
sane default for a paid/affiliate-style link.

## Adding ad slots to a brand-new report

If a new report is generated later and doesn't have ad slots yet:

1. Add the `.ad-slot` / `.ad-slot-label` CSS above into the report's existing
   `<style>` block.
2. Insert three `.ad-slot` placeholders at the positions described above
   (top-level `<body>` children, at section boundaries).
3. If the report has the shared interactive script (`buildSections`
   function), confirm its footer-exclusion check also excludes `ad-slot`:
   ```js
   } else if (el.classList && (el.classList.contains('report-footer') || el.classList.contains('ad-slot'))) {
   ```
   If the report has no interactive script at all, the exclusion isn't
   needed — plain static HTML has no collapse behavior to worry about.
4. Verify with a quick jsdom smoke test (or open in a browser) that no
   `.ad-slot` ends up nested inside a `.section-body`.
