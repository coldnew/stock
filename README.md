## 股票研究報告（繁中）

本站以 Astro＋MDX 發布每日投資研究頁面，報告由日期化內容集合產生；舊版報告 URL 自動重定向至最新頁面。報告僅發行繁體中文（zh-TW），英文軌已退役：驗證器會拒絕任何英文版本，腳手架亦不再產生英文檔。

### 研究模組與技能

`modules/ai-berkshire/` 是每日報告 vendored 進來的研究模組，內含 `skills/` 正式投資技能、`tools/` 財務與行情工具、`tests/` 稽核測試，以及研究資料與報告。保留這些來源，避免報告產出依賴外部 checkout 或全機技能安裝。

本站報告流程記錄於 `.agents/skills/stock-report-author/SKILL.md`。新增或修訂報告時，依該技能使用模組來源技能與工具，附上日期明確的當期 K 線，並在發布前給出技術面與基本面並重的進場點分析。

### 新增報告

```bash
npm install
npm run report:new -- --ticker=JEPQ --date=YYYY-MM-DD
npm run check
npm run content:check
npm run prose:check
npm run build
```

報告正文寫在 `src/content/reports/<TICKER>/<DATE>/`。需要共用元件（如 `Metrics`、`Disclosure`、`DistributionTrend`）時使用 `.mdx`。不要在文章內複製頁面 HTML、CSS、JavaScript、詮釋資料、相關連結或廣告碼，那些屬於共用元件。

每檔標的各有一個最新 URL 與日期化封存 URL。歷史檔案是不可變快照；最新 URL 由該 ticker 最新發布 `publishedAt` 推導，新增日期永遠不需要動到舊檔。

報告初稿一律 `draft`。備齊來源與審查後，以 `npm run report:publish -- --ticker=JEPQ --date=YYYY-MM-DD --locale=zh-TW` 發布。發布指令會跑內容驗證（含 AI 作者揭露、至少兩個來源網址）與散文門禁，未通過即還原。已發布勘誤依 SKILL「已發布勘誤」政策：錯字與圖表接線可原地修正並在 commit 說明，證據與結論變更一律開新日期版本。

### 廣告

共用 `AdSlot` 元件集中管理核准的 Adsterra 原生、橫幅與 smartlink 版位。`MonetizationScripts` 每頁只載入一次 social-bar 與 popunder 腳本。廣告置於文章區段之外，贊助連結標示清楚，並為每個目標市場驗證 Adsterra 政策與用戶同意要求。

### 框架結構

- `src/content/reports/`：日期化繁中 MDX 內容（含歷史快照）
- `src/components/report/`：共用報告 UI 與變現元件（含 K 線、NAV 趨勢、配息趨勢圖）
- `src/pages/`：靜態路由、sitemap 與 robots.txt
- `scripts/new-report.mjs`：可重複的報告鷹架
- `scripts/validate-content.mjs`、`validate-prose.mjs`：內容與散文驗證（含發布門禁）
- `scripts/update-market-data.mjs`、`update-nav-data.mjs`：行情與 NAV 快照（僅附加、不刪歷史）
- `modules/ai-berkshire/skills/`：正式投資研究技能來源
- `modules/ai-berkshire/tools/`：財務驗證、行情資料、估值與稽核工具
- `modules/ai-berkshire/tests/`：研究工具迴歸測試

### 部署

GitHub Actions 工作流程驗證 MDX 集合、建置 `dist`、複製法務 HTML 頁、為舊版報告 URL 產生重定向，並部署至 GitHub Pages。部署前請先在儲存庫設定啟用以 `GitHub Actions` 為來源的 Pages。Adsterra 收益取決於核准的發布商帳號、網域、流量品質與各訪客市場需求。
