import type { APIRoute } from 'astro';
import { getReports, latestByTicker } from '../data/reports';

const origin = 'https://coldnew.github.io/stock';

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const reportUrl = (report: { id: string; data: { ticker: string; locale: string; publishedAt: Date } }, latest: Map<string, typeof report>) => {
  const isLatest = latest.get(`${report.data.locale}:${report.data.ticker}`)?.id === report.id;
  const date = report.data.publishedAt.toISOString().slice(0, 10);
  return isLatest
    ? `${origin}/reports/${report.data.ticker.toLowerCase()}/`
    : `${origin}/reports/${report.data.ticker.toLowerCase()}/${date}/`;
};

export const GET: APIRoute = async () => {
  const reports = (await getReports('zh-TW'))
    .filter((report) => report.data.status === 'published')
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const latest = latestByTicker(reports);
  const items = reports.map((report) => {
    const url = reportUrl(report, latest);
    const published = report.data.publishedAt.toUTCString();
    return [
      '    <item>',
      `      <title>${escapeXml(report.data.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${published}</pubDate>`,
      `      <description>${escapeXml(report.data.description)}</description>`,
      `      <category>${escapeXml(report.data.ticker)}</category>`,
      '    </item>',
    ].join('\n');
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>每日投資研究｜Stock Reports</title>
    <link>${origin}/</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <description>繁體中文股票、ETF 與市場事件研究。RSS 僅提供摘要，完整分析請回到本站閱讀。</description>
    <language>zh-TW</language>
    <copyright>Stock Reports</copyright>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  });
};
