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
  if (status !== 'published' || locale !== 'en') continue;
  const lower = content.toLowerCase();
  for (const phrase of ['write the ', 'explain the ', 'state the ', 'add official', 'before publication']) {
    if (lower.includes(phrase)) failures.push(`${path}: contains placeholder phrase "${phrase.trim()}"`);
  }
  if (!/^## Sources\s*$/m.test(content)) failures.push(`${path}: missing a Sources section`);
  if (!/^## Key Risks\s*$/m.test(content)) failures.push(`${path}: missing a Key Risks section`);
  if (!/^## Analyst Conclusion\s*$/m.test(content)) failures.push(`${path}: missing an Analyst Conclusion section`);
  if ((content.match(/https?:\/\/[^\s)]+/g) ?? []).length < 2) failures.push(`${path}: needs at least two source URLs`);
  const article = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const words = article.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)?/g) ?? [];
  if (words.length < 400) failures.push(`${path}: published English content has only ${words.length} words; minimum is 400`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`validated ${files.length} content files; published English reports passed`);
