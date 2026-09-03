#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=')];
}));
const ticker = String(args.ticker || '').toUpperCase();
const date = String(args.date || '');
const locale = args.locale === 'en' ? 'en' : args.locale === 'zh-TW' ? 'zh-TW' : '';
if (!/^[A-Z0-9.-]+$/.test(ticker) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !locale) {
  console.error('Usage: npm run report:publish -- --ticker=JEPQ --date=YYYY-MM-DD --locale=en');
  process.exit(1);
}

const path = join('src', 'content', 'reports', ticker, date, `${ticker}.${locale}.mdx`);
const original = await readFile(path, 'utf8');
if (!/^status:\s*draft\s*$/m.test(original)) {
  console.error(`not a draft or missing status: ${path}`);
  process.exit(1);
}
const published = original.replace(/^status:\s*draft\s*$/m, 'status: published');
await writeFile(path, published);
const result = spawnSync('npm', ['run', 'content:check'], { stdio: 'inherit' });
if (result.status !== 0) {
  await writeFile(path, original);
  console.error(`publication rejected and reverted: ${path}`);
  process.exit(result.status ?? 1);
}
console.log(`published ${path}`);
