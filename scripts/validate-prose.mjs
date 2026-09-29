#!/usr/bin/env node
// Prose gate for report MDX: catches drafting artifacts that self-review misses.
// - thinking-aloud scars (…不對, 重說, …正在)
// - wrong-script fragments (simplified 备兑/镜像/在线/指数, stray EN/ES/FR/RU words
//   observed in AI first drafts: segunda, ventuellement, favour , Mechanical , keynote)
// - replacement-character U+FFFD (�) from broken copy-paste
// - unbalanced { } braces (the 2026-09-29 Metrics }}]} incident: 21 files, caught by build)
// - simplified 指数 outside URLs (zh-TW normative form is 指數)
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SCARS = [
  '…不對', '重說', '…正在收', 'enthusi', '备兑', '镜像', 'segunda',
  'ventuellement', 'tem最', 'favour ', 'Mechanical ', '在线…', '�',
];
const failures = [];
const files = (await readdir('src/content/reports', { recursive: true })).filter(
  (file) => file.endsWith('.mdx') || file.endsWith('.md'),
);
for (const file of files) {
  const path = join('src/content/reports', file);
  const lines = (await readFile(path, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    const lineno = index + 1;
    for (const scar of SCARS) {
      if (line.includes(scar)) failures.push(`${path}:${lineno}: drafting scar ${JSON.stringify(scar)}`);
    }
    if (line.includes('指数') && !line.includes('http')) {
      failures.push(`${path}:${lineno}: simplified 指数 outside URL (use 指數)`);
    }
    if (line.includes('}}]}')) {
      failures.push(`${path}:${lineno}: doubled JSX close braces }}]}`);
    }
  });
  const src = lines.join('\n');
  const opens = (src.match(/\{/g) || []).length;
  const closes = (src.match(/\}/g) || []).length;
  if (opens !== closes) failures.push(`${path}: unbalanced braces (${opens} open vs ${closes} close)`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`prose gate passed on ${files.length} content files`);
