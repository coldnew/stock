#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const reportDir = 'reports';
const typeByTicker = {
  AAPL: 'equity', ARCC: 'equity', BTCI: 'crypto', CHPY: 'income-etf', DGRO: 'income-etf',
  GOOG: 'equity', GPIX: 'income-etf', IQQ: 'income-etf', IWMI: 'income-etf', MAGS: 'income-etf',
  MSFT: 'equity', NVDA: 'equity', QQQH: 'income-etf', SGOV: 'income-etf', SPCX: 'equity', TSLA: 'equity',
};
const cleanMetricText = (value) => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
let files = [];
try {
  files = (await readdir(reportDir)).filter((file) => file.endsWith('.html')).sort();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

for (const file of files) {
  const ticker = file.replace(/\.html$/, '').toUpperCase();
  const html = await readFile(join(reportDir, file), 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim();
  const date = html.match(/"datePublished":\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  const firstHeading = html.indexOf('<h2');
  const related = html.indexOf('<div class="related-report"');
  if (!title || !description || !date || firstHeading < 0 || related < 0) {
    throw new Error(`Cannot parse legacy report: ${file}`);
  }

  let body = html.slice(firstHeading, related);
  body = body.replace(/<div class="ad-slot"[\s\S]*?<\/div>\s*/g, '');
  body = body.replace(/<script[\s\S]*?<\/script>\s*/gi, '');
  body = body.replace(/<!--[^]*?-->\s*/g, '');
  let divDepth = 0;
  body = body.replace(/<\/?div\b[^>]*>/gi, (tag) => {
    if (/^<div\b/i.test(tag)) {
      divDepth += 1;
      return tag;
    }
    if (divDepth === 0) return '';
    divDepth -= 1;
    return tag;
  });
  const headings = [...body.matchAll(/<h2\b/gi)];
  const midpoint = headings[Math.floor(headings.length / 2)];
  if (midpoint) {
    const ad = '\n<AdSlot placement="mid" />\n';
    body = body.slice(0, midpoint.index) + ad + body.slice(midpoint.index);
  }

  const metricsBlock = html.match(/<!-- ========== METRICS[\s\S]*?<\/div>\s*<!-- ========== AD SLOT/i)?.[0] ?? '';
  const metrics = [...metricsBlock.matchAll(/metric-value[^>]*>([\s\S]*?)<\/div>[\s\S]*?metric-label[^>]*>([\s\S]*?)<\/div>/gi)]
    .map((match) => ({ value: cleanMetricText(match[1]), label: cleanMetricText(match[2]) }))
    .filter((item) => item.value && item.label);
  const metricsImport = "import Metrics from '../../../../components/report/Metrics.astro';";
  const addMetrics = (content) => {
    if (!metrics.length || content.includes(metricsImport)) return content;
    const items = metrics.map((item) => `{ label: ${JSON.stringify(item.label)}, value: ${JSON.stringify(item.value)} }`).join(', ');
    return content.replace("import AdSlot from '../../../../components/report/AdSlot.astro';\n\n", `import AdSlot from '../../../../components/report/AdSlot.astro';\n${metricsImport}\n\n<Metrics items={[${items}]} />\n\n`);
  };

  const target = join('src', 'content', 'reports', ticker, date, `${ticker}.zh-TW.mdx`);
  try {
    const existing = await readFile(target, 'utf8');
    const enriched = addMetrics(existing);
    if (enriched !== existing) {
      await writeFile(target, enriched);
      console.log(`enriched ${target} with legacy metrics`);
    } else {
      console.log(`skipped existing ${target}`);
    }
    continue;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(join('src', 'content', 'reports', ticker, date), { recursive: true });
  const frontmatter = `---\nticker: ${ticker}\nlocale: zh-TW\ntitle: "${title.replaceAll('"', '\\"')}"\ndescription: "${description.replaceAll('"', '\\"')}"\npublishedAt: ${date}\ndataAsOf: ${date}\nreportType: ${typeByTicker[ticker] ?? 'income-etf'}\ntranslationKey: ${ticker.toLowerCase()}-${date}\ntags:\n  - ${ticker}\nisLatest: true\nstatus: published\n---\n\n`;
  const imports = "import AdSlot from '../../../../components/report/AdSlot.astro';\n";
  const items = metrics.map((item) => `{ label: ${JSON.stringify(item.label)}, value: ${JSON.stringify(item.value)} }`).join(', ');
  const metricsMarkup = metrics.length ? `${metricsImport}\n\n<Metrics items={[${items}]} />\n\n` : '';
  await writeFile(target, frontmatter + imports + metricsMarkup + body.trim() + '\n');
  console.log(`migrated ${file} -> ${target}`);
}
