#!/usr/bin/env node
// Prose gate for report MDX: catches drafting artifacts that self-review misses.
// - thinking-aloud scars (…不對, 重說, …正在)
// - wrong-script fragments (simplified 备兑/镜像/在线/指数, stray EN/ES/FR/RU words
//   observed in AI first drafts: segunda, ventuellement, favour , Mechanical , keynote)
// - replacement-character U+FFFD (�) from broken copy-paste
// - unbalanced { } braces (the 2026-09-29 Metrics }}]} incident: 21 files, caught by build)
// - simplified 指数 outside URLs (zh-TW normative form is 指數)
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// - AI-taste gate (humanizer-zh-next integration):
//   hard failures block publish; advisories print to stdout without failing.
//   Verbatim quotes inside <XPostCard>/<ThreadsEmbed> and fenced code blocks are
//   someone else's voice and are exempt from both tiers.
//   NOTE: 閉環 is legitimate domain vocabulary in this repo (SpaceX 閉環兌現,
//   closed-loop execution) and is deliberately NOT gated.
const AI_TASTE_HARD = [
  // 導覽式開場 / 過程宣告 (humanizer #28)
  '讓我們深入探討', '让我们深入探讨', '下面我們來拆解', '本文將帶你了解',
  '廢話不多說', '這是你需要知道的',
  // 協作交流痕跡 (humanizer #20)
  '當然可以', '下面是一份', '希望這對你有幫助', '希望这对你有帮助',
  '需要我展開嗎', '要不要我繼續',
  // 知識截止 / 猜測式補洞 (humanizer #21)
  '截至我所知', '最後一次訓練', '截至我最后一次',
  // 通用積極結論 (humanizer #25) — verified zero hits in corpus
  '未來可期', '未来可期', '廣闊前景', '广阔前景', '將創造更大價值',
  '前景值得期待', '機遇與挑戰並存', '机遇与挑战并存', '一片光明',
  '邁向卓越', '迈向卓越',
  // 簡繁 AI 高頻詞 that have no legitimate zh-TW use here (humanizer #7)
  '賦能', '赋能', '抓手', '底層邏輯', '底层逻辑', '顆粒度',
  // Emoji decorations in the report's own voice (humanizer #18)
  '✨', '🚀', '📌', '✅',
];
const SCARS = [
  '…不對', '重說', '…正在收', 'enthusi', '备兑', '镜像', 'segunda',
  'ventuellement', 'tem最', 'favour ', 'Mechanical ', '在线…', '�',
];
// 可疑但可能合法的表达 — 只提醒、不挡发布 (humanizer #27/#29/#14/#23/#9)
const AI_TASTE_ADVISORY = [
  '歸根結底', '归根结底', '真正的問題是', '真正的问题是',
  '核心在於', '核心在于', '值得注意的是', '不可否認的是',
  '總體而言', '总体而言',
];
const failures = [];
const advisories = [];
const files = (await readdir('src/content/reports', { recursive: true })).filter(
  (file) => file.endsWith('.mdx') || file.endsWith('.md'),
);
for (const file of files) {
  const path = join('src/content/reports', file);
  const lines = (await readFile(path, 'utf8')).split('\n');
  let inQuote = false;
  let inFence = false;
  lines.forEach((line, index) => {
    const lineno = index + 1;
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (/<XPostCard[\s>]|<ThreadsEmbed[\s>]/.test(line)) inQuote = true;
    for (const scar of SCARS) {
      if (line.includes(scar)) failures.push(`${path}:${lineno}: drafting scar ${JSON.stringify(scar)}`);
    }
    if (!inQuote && !inFence) {
      for (const taste of AI_TASTE_HARD) {
        if (line.includes(taste)) failures.push(`${path}:${lineno}: AI-taste ${JSON.stringify(taste)}`);
      }
      for (const taste of AI_TASTE_ADVISORY) {
        if (line.includes(taste)) advisories.push(`${path}:${lineno}: advisory ${JSON.stringify(taste)}`);
      }
      const dashes = (line.match(/——/g) || []).length;
      if (dashes >= 3) advisories.push(`${path}:${lineno}: advisory clustered em-dashes (——×${dashes})`);
    }
    if (/<\/XPostCard>|<\/ThreadsEmbed>/.test(line)) inQuote = false;
    if (line.includes('指数') && !line.includes('http')) {
      failures.push(`${path}:${lineno}: simplified 指数 outside URL (use 指數)`);
    }
    if (line.includes('}}]}')) {
      failures.push(`${path}:${lineno}: doubled JSX close braces }}]}`);
    }
  });
  const src = lines.join('\n');
  const opens = (src.match(/\{/g) || []).length;
  const closes = (src.match(/\}/g) || []).length;
  if (opens !== closes) failures.push(`${path}: unbalanced braces (${opens} open vs ${closes} close)`);
}
if (advisories.length) {
  console.log(`AI-taste advisories (${advisories.length}, non-blocking):\n${advisories.join('\n')}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`prose gate passed on ${files.length} content files`);
