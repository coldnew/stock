#!/usr/bin/env node
import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

for (const file of ['about.html', 'privacy.html', 'disclaimer.html']) {
  await copyFile(file, join('dist', file));
}
console.log('copied legal HTML pages for URL compatibility');
