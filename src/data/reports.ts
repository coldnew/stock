import { getCollection } from 'astro:content';

export async function getReports(locale: 'zh-TW' | 'en') {
  const entries = await getCollection('reports', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getLatestReports(locale: 'zh-TW' | 'en') {
  const reports = await getReports(locale);
  return reports.filter((report) => report.data.isLatest && report.data.status === 'published');
}
