#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const files = (await readdir('src/content/reports', { recursive: true })).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
const failures = [];
for (const file of files) {
  const path = join('src/content/reports', file);
  const content = await readFile(path, 'utf8');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';
  const locale = frontmatter.match(/^locale:\s*(.+)$/m)?.[1]?.trim();
  const status = frontmatter.match(/^status:\s*(.+)$/m)?.[1]?.trim() ?? 'published';
  if (locale === 'en') failures.push(`${path}: English reports are no longer supported`);
  if (status !== 'published' || locale !== 'zh-TW') continue;
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`validated ${files.length} content files; published Traditional-Chinese reports passed`);
