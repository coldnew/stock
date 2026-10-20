#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const files = (await readdir('src/content/reports', { recursive: true })).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
const AI_AUTHORSHIP = /AI\s*(?:助手|助理|assistant|coding agent)/i;
const DRAFTED_BY = /(?:撰寫|草擬|起草|drafted)/;
const failures = [];
const warnings = [];
const publishedDates = new Map();
for (const file of files) {
  const path = join('src/content/reports', file);
  const content = await readFile(path, 'utf8');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';
  const locale = frontmatter.match(/^locale:\s*(.+)$/m)?.[1]?.trim();
  const ticker = frontmatter.match(/^ticker:\s*(.+)$/m)?.[1]?.trim();
  const publishedAt = frontmatter.match(/^publishedAt:\s*(.+)$/m)?.[1]?.trim();
  const status = frontmatter.match(/^status:\s*(.+)$/m)?.[1]?.trim() ?? 'published';
  if (locale === 'en') failures.push(`${path}: English reports are no longer supported`);
  if (status !== 'published' || locale !== 'zh-TW') continue;
  const key = `${locale}:${ticker}:${publishedAt}`;
  if (publishedDates.has(key)) failures.push(`${path}: duplicate published date for ${ticker} (${publishedDates.get(key)})`);
  else publishedDates.set(key, path);
  const body = content.split('## 資料來源')[0];
  if (!body.includes('](')) warnings.push(`${path}: published body has no inline links before Sources`);
  // AI-authorship disclosure: model-agnostic on purpose. Never require a specific
  // model or agent name here — the model running a session changes, and a hardcoded
  // name turns into a false attribution on every page it was copied into.
  const disclosure = content.match(/<Disclosure\b[\s\S]*?<\/Disclosure>/)?.[0] ?? '';
  const disclosesAiAuthorship = (text) => AI_AUTHORSHIP.test(text) && DRAFTED_BY.test(text);
  if (!disclosesAiAuthorship(disclosure) && !disclosesAiAuthorship(content)) failures.push(`${path}: missing AI-authorship disclosure (AI 助手 / AI assistant)`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
if (warnings.length) console.warn('warnings:\n' + warnings.join('\n'));
console.log(`validated ${files.length} content files; published Traditional-Chinese reports passed`);
