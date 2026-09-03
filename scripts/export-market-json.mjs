import { mkdir, writeFile } from 'node:fs/promises';
import { marketSnapshots } from '../src/data/market.ts';

await mkdir('public/data/market', { recursive: true });
await Promise.all(Object.entries(marketSnapshots).map(async ([ticker, snapshot]) => {
  await writeFile(`public/data/market/${ticker}.json`, `${JSON.stringify(snapshot)}\n`);
}));
