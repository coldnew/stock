import { getCollection } from 'astro:content';

export async function getReports(locale: 'zh-TW' | 'en') {
  const entries = await getCollection('reports', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function reportKey(report: { data: { ticker: string; locale: string } }) {
  return `${report.data.locale}:${report.data.ticker}`;
}

export function latestByTicker<T extends { id: string; data: { ticker: string; locale: string; publishedAt: Date; status: string } }>(reports: T[]) {
  const latest = new Map<string, T>();
  for (const report of reports) {
    if (report.data.status !== 'published') continue;
    const key = reportKey(report);
    const current = latest.get(key);
    if (!current || report.data.publishedAt.valueOf() > current.data.publishedAt.valueOf()) latest.set(key, report);
  }
  return latest;
}

export async function getLatestReports(locale: 'zh-TW' | 'en') {
  const reports = await getReports(locale);
  return [...latestByTicker(reports).values()].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
