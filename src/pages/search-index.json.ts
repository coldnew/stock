import type { APIRoute } from 'astro';
import { getReports } from '../data/reports';
import { getReportTags } from '../data/tags';

const stripMarkup = (value: string) => value
  .replace(/^import .*$/gm, '')
  .replace(/^export .*$/gm, '')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[#>*_`|]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const GET: APIRoute = async () => {
  const reports = (await getReports('zh-TW')).filter((report) => report.data.status === 'published');
  const latest = new Map<string, string>();
  for (const report of reports) {
    const key = `${report.data.locale}:${report.data.ticker}`;
    if (!latest.has(key)) latest.set(key, report.id);
  }

  const items = reports.map((report) => {
    const date = report.data.publishedAt.toISOString().slice(0, 10);
    const base = `/stock/reports/${report.data.ticker.toLowerCase()}`;
    const url = latest.get(`${report.data.locale}:${report.data.ticker}`) === report.id ? `${base}/` : `${base}/${date}/`;
    return {
      title: report.data.title,
      description: report.data.description,
      ticker: report.data.ticker,
      tags: getReportTags(report),
      date,
      url,
      text: stripMarkup(report.body ?? '').slice(0, 12000),
    };
  });

  return new Response(JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), items }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
};
