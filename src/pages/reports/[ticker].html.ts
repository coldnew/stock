import type { APIRoute } from 'astro';
import { getLatestReports } from '../../data/reports';

export async function getStaticPaths() {
  const reports = await getLatestReports('zh-TW');
  return reports.flatMap((entry) => [
    { params: { ticker: entry.data.ticker }, props: { ticker: entry.data.ticker } },
    { params: { ticker: entry.data.ticker.toLowerCase() }, props: { ticker: entry.data.ticker } },
  ]);
}

export const GET: APIRoute = ({ props }) => {
  const ticker = String(props.ticker);
  const target = `/stock/reports/${ticker.toLowerCase()}/`;
  const html = `<!doctype html><html lang="zh-TW"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://coldnew.github.io${target}"><title>${ticker} report moved</title></head><body><p><a href="${target}">View the latest ${ticker} report</a></p></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
