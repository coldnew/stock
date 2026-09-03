import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reports = defineCollection({
  loader: glob({ base: './src/content/reports', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ticker: z.string().regex(/^[A-Z0-9.-]+$/),
    locale: z.enum(['zh-TW', 'en']),
    title: z.string(),
    description: z.string().min(40).max(180),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    dataAsOf: z.coerce.date(),
    reportType: z.enum(['income-etf', 'equity', 'crypto', 'other']),
    translationKey: z.string(),
    tags: z.array(z.string()).default([]),
    isLatest: z.boolean().default(true),
    status: z.enum(['draft', 'published']).default('published'),
  }),
});

export const collections = { reports };
