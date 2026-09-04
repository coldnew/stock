#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const files = (await readdir('src/content/reports', { recursive: true })).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
const reports = [];
for (const file of files) {
  const content = await readFile(join('src/content/reports', file), 'utf8');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';
  const get = (key) => frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  if (get('status') !== 'published') continue;
  reports.push({ ticker: get('ticker'), locale: get('locale'), id: file, publishedAt: get('publishedAt') });
}

const latestByTicker = new Map();
for (const report of reports) {
  const key = `${report.locale}:${report.ticker}`;
  const current = latestByTicker.get(key);
  if (!current || report.publishedAt > current.publishedAt) latestByTicker.set(key, report);
}
const latestReports = [...latestByTicker.values()];

const failures = [];
for (const path of ['dist/index.html']) {
  let html;
  try { html = await readFile(path, 'utf8'); } catch { failures.push(`${path}: homepage missing`); continue; }
  const adSlots = (html.match(/class="ad-slot"/g) ?? []).length;
  if (adSlots !== 3) failures.push(`${path}: expected 3 homepage ad slots, found ${adSlots}`);
  if (!html.includes('G-2SXWWHGFPN')) failures.push(`${path}: missing GA4 measurement ID`);
}
for (const report of latestReports) {
  const path = join('dist', 'reports', report.ticker.toLowerCase(), 'index.html');
  let html;
  try { html = await readFile(path, 'utf8'); } catch { failures.push(`${path}: missing generated page`); continue; }
  const adSlots = (html.match(/class="ad-slot"/g) ?? []).length;
  if (adSlots !== 3) failures.push(`${path}: expected 3 ad slots, found ${adSlots}`);
  if (!html.includes('G-2SXWWHGFPN')) failures.push(`${path}: missing GA4 measurement ID`);
  if (!html.includes('rel="canonical"') && !html.includes('rel="alternate"')) failures.push(`${path}: missing SEO links`);
  if (report.locale !== 'zh-TW') failures.push(`${path}: non-Traditional-Chinese report found`);
}
for (const path of ['dist/reports/JEPQ.html', 'dist/reports/jepq.html', 'dist/about.html', 'dist/privacy.html', 'dist/disclaimer.html']) {
  try { await readFile(path); } catch { failures.push(`${path}: legacy compatibility file missing`); }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`validated ${reports.length} published report builds and legacy URL compatibility`);
