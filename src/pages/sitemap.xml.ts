import type { APIRoute } from 'astro';
import { getReports } from '../data/reports';

const origin = 'https://coldnew.github.io/stock';
const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const reports = [...await getReports('zh-TW'), ...await getReports('en')].filter((report) => report.data.status === 'published');
  const urls = [
    { path: '/', date: new Date() },
    { path: '/en/', date: new Date() },
    ...reports.map((report) => ({
      path: report.data.isLatest
        ? `${report.data.locale === 'en' ? '/en' : ''}/reports/${report.data.ticker.toLowerCase()}/`
        : `${report.data.locale === 'en' ? '/en' : ''}/reports/${report.data.ticker.toLowerCase()}/${report.data.publishedAt.toISOString().slice(0, 10)}/`,
      date: report.data.updatedAt ?? report.data.publishedAt,
    })),
  ];
  const body = urls.map(({ path, date }) => `  <url><loc>${escapeXml(origin + path)}</loc><lastmod>${date.toISOString().slice(0, 10)}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
