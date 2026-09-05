import type { CollectionEntry } from 'astro:content';

export type ReportEntry = CollectionEntry<'reports'>;

/** 每篇文章的股票代號自動成為標籤，frontmatter tags 則提供額外主題標籤。 */
export function getReportTags(report: ReportEntry) {
  return [...new Set([report.data.ticker, ...report.data.tags])];
}

export function tagSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '');
}

export function tagHref(tag: string) {
  return `/stock/tags/${encodeURIComponent(tagSlug(tag))}/`;
}

export function groupReportsByTag(reports: ReportEntry[]) {
  const groups = new Map<string, { label: string; slug: string; reports: ReportEntry[] }>();
  for (const report of reports) {
    for (const label of getReportTags(report)) {
      const slug = tagSlug(label);
      if (!slug) continue;
      const group = groups.get(slug) ?? { label, slug, reports: [] };
      group.reports.push(report);
      groups.set(slug, group);
    }
  }
  return [...groups.values()].sort((a, b) => b.reports.length - a.reports.length || a.label.localeCompare(b.label));
}
