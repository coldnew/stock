#!/usr/bin/env node
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));

const ticker = String(args.ticker || '').toUpperCase();
const date = String(args.date || new Date().toISOString().slice(0, 10));
const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
  ? new Date(`${date}T00:00:00Z`)
  : new Date('invalid');
const validDate = !Number.isNaN(parsedDate.valueOf())
  && parsedDate.toISOString().slice(0, 10) === date;
if (!/^[A-Z0-9.-]+$/.test(ticker) || !validDate) {
  console.error('Usage: npm run report:new -- --ticker=JEPQ --date=YYYY-MM-DD');
  process.exit(1);
}

const root = join('src', 'content', 'reports', ticker, `${date}`);

const common = `ticker: ${ticker}\npublishedAt: ${date}\ndataAsOf: ${date}\nreportType: income-etf\ntranslationKey: ${ticker.toLowerCase()}-${date}\nisLatest: true\nstatus: draft\ntags:\n  - ${ticker}\n`;
const files = {
  [`${ticker}.en.mdx`]: `---\n${common}locale: en\ntitle: "${ticker} ETF Analysis"\ndescription: "An evidence-based analysis of ${ticker}'s strategy, income profile, and risks."\n---\n\nimport AdSlot from '../../../../components/report/AdSlot.astro';\nimport Disclosure from '../../../../components/report/Disclosure.astro';\n\n## Executive Summary\n\nWrite the English thesis here.\n\n<AdSlot placement="mid" />\n\n## Strategy Overview\n\nExplain the product, evidence, and limitations here.\n\n<Disclosure title="Data limitations">\nState which figures are observed, which are estimates, and which scenarios remain untested.\n</Disclosure>\n\n## Key Risks\n\nDescribe material risks and what data would invalidate the thesis.\n\n## Analyst Conclusion\n\nSummarize the evidence and the decision-relevant trade-off without making a personalized recommendation.\n\n## Sources\n\nAdd at least two dated primary sources before publication.\n`,
  [`${ticker}.zh-TW.mdx`]: `---\n${common}locale: zh-TW\ntitle: "${ticker} 分析報告"\ndescription: "以具日期的實證資料分析 ${ticker} 的策略、收益結構、下檔風險與資料限制。"\n---\n\nimport AdSlot from '../../../../components/report/AdSlot.astro';\nimport Disclosure from '../../../../components/report/Disclosure.astro';\n\n## 分析摘要\n\n在這裡撰寫中文核心結論。\n\n<AdSlot placement="mid" />\n\n## 策略結構\n\n說明產品、證據與資料限制。\n\n<Disclosure title="資料限制">\n說明哪些數字是觀察值、哪些是估計值，以及哪些情境尚未被資料驗證。\n</Disclosure>\n\n## 主要風險\n\n說明主要風險，以及哪些資料會推翻目前結論。\n\n## 分析結論\n\n根據證據說明結論與關鍵取捨，不做個人化推薦。\n\n## 資料來源\n\n發布前加入至少兩個具日期的第一手資料來源。\n`,
};

for (const file of Object.keys(files)) {
  try {
    await access(join(root, file));
    console.error(`already exists: ${join(root, file)}`);
    process.exit(1);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const tickerRoot = join('src', 'content', 'reports', ticker);
let existingFiles = [];
try {
  existingFiles = (await readdir(tickerRoot, { recursive: true }))
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

await mkdir(root, { recursive: true });

for (const file of existingFiles) {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
  const path = join(tickerRoot, file);
  const content = await readFile(path, 'utf8');
  if (content.includes('isLatest: true')) {
    await writeFile(path, content.replace('isLatest: true', 'isLatest: false'));
  }
}

for (const [file, content] of Object.entries(files)) {
  const path = join(root, file);
  await writeFile(path, content, { flag: 'wx' });
  console.log(`created ${path}`);
}
