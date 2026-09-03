#!/usr/bin/env node
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

await mkdir('dist/reports', { recursive: true });
for (const file of ['about.html', 'privacy.html', 'disclaimer.html']) {
  await copyFile(file, join('dist', file));
}
for (const file of (await readdir('reports')).filter((name) => name.endsWith('.html'))) {
  await copyFile(join('reports', file), join('dist', 'reports', file));
}
console.log('copied legacy HTML pages for URL compatibility');
