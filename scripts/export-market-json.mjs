import { mkdir, writeFile } from 'node:fs/promises';
import { marketSnapshots } from '../src/data/market.ts';

await mkdir('public/data/market', { recursive: true });
await Promise.all(Object.entries(marketSnapshots).map(async ([ticker, snapshot]) => {
  const payload = `${JSON.stringify(snapshot)}\n`;
  await writeFile(`public/data/market/${ticker}.json`, payload);
  if (ticker.includes('.')) await writeFile(`public/data/market/${ticker.replaceAll('.', '-')}.json`, payload);
}));
