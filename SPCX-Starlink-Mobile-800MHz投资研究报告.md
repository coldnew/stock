# SPCX (SpaceX) 投資研究報告：800MHz 最後一塊拼圖 — Starlink Mobile 能否成為第四大運營商？

- 數據截止：2026-10-09（美東收盤 SPCX $160.57，盤後 ~$164.6 +2.5%；T -6.5%、VZ -6.4%、TMUS -6.6%）
- 事件：10/8 SpaceX 宣布與 Grain Management 簽 definitive agreement，收購其 100% 全國 800MHz 低頻（up to 14MHz paired），待 FCC 批准；同週 FCC 批准 15,000 顆 D2D 專用星座（10/6 order，2032/2035 里程碑）
- 資訊豐富度評級：**B級（資訊適中偏充裕）** — 2026/6/12 IPO 上市僅 ~17 週，券商覆蓋多（29 Buy / 2 Sell，均值目標 $228.65），但歷史財報僅 2 季，大量預測依賴公司指引與第三方模型（Quilty / Besen / Farrar）。AI 輸出易與市場共識趨同，須做反面檢驗。
- AI 研究局限性聲明：本報告財務數據來自公司 Q2 10-Q / 8-K + 兩家以上第三方交叉（Investing/CNBC/SEC），頻譜交易條款（價格未披露）與 FCC order 為一手文件；涉及估值計算為手算（本 repo 無 `tools/financial_rigor.py`，未做程序化驗算，已在附錄標註口徑）；十年 IRR 未給，因 AI capex 與 Mobile 變現不確定性過高，給出即虛假精確。

## 0. 一句話生意本質（段永平式）

SpaceX = 用可回收火箭把「發射成本」打下來，再用 Starlink 連接 + AI 算力把「軌道-頻譜-用戶」變現的垂直整合壟斷機器；本次 800MHz 收購是把 Starlink Mobile 從「室外補盲」升級為「室內可用的第四家全國運營商」的門票。

> 段永平式追問：這門生意好在哪？— 發射壟斷 + 頻譜稀缺 + 訂閱復購，三者疊加才成立，缺一即不成立。

## 1. 數據收集（交叉驗證）

| 項目 | 數值 | 來源1 | 來源2 | 置信度 |
|---|---|---|---|---|
| IPO | 6/11 定價 $135，6/12 Nasdaq 上市，~$75B 募資，估值 ~$1.77T，555.6M 股發行 | QuantAbundance / SEC S-1 | TopSpaceETFs | 高 |
| 現價/市值 | $160.57（10/9 收），$2.12T mcap；52週 $104.83-225.64；Nasdaq-100 權重 1.28%→2.82% | tickerinside/Investing | Seeking Alpha (rebalance) | 高；總股本 ~12.6-13.1B（市值/股價反推，與 IPO 口徑略差，含增發/股權激勵，標記） |
| Q2'26 | 營收 $7.814B +92% YoY，淨虧 $541M（去年同期 -$1,008M），Adj. EBITDA $3.538B +191% | 公司 8-K/Q2 PDF | CNBC/StockTitan | 高 |
| 分部 Q2 | Space $962M（op -$542M）；Connectivity $4,291M（op +$1,656M，+79%）；AI $2,561M +247%（op -$1,257M，但 Adj. EBITDA +$1,146M 首次轉正） | 公司 Q2 PDF | 10-Q | 高 |
| Connectivity 明細 | Starlink 訂戶 12.0M（YoY 翻倍，+1.7M QoQ），ARPU $66（Q1 持平，低於去年 $85，國際低價擴張所致）；Consumer $2,485M +44%，Enterprise&Gov $1,806M +108% | 公司 Q2 PDF | CNBC | 高 |
| 現金/積壓 | 現金+證券 ~$100B（公司 10-Q 口徑；來源為 IPO 淨募 $85.7B + $25B 投資級債），backlog $47.5B，總資產 $192.8B | 10-Q/earnings call | AnalystLens | 高 |
| Capex | Q2 $18.37B（AI 占 $15.83B 86%），H1 $28.5B；算力 1.4GW（Q1 1.0GW），年底目標 >2GW，27年底 15-20GW | 公司 Q2 PDF | earnings call | 高 |
| AI 合同 | Q2 新簽 $14.1B 雲合同（Anthropic ~$1.25B/月至29/5 + Google ~$0.92B/月自26/10，合計年化 ~$26B），7月初再簽 $6.7B/6個月；收購 Cursor $60B（Q3 交割）；Grok 4.5 發布 | 公司 Q2 PDF/call | Seeking Alpha | 中高（Anthropic/Google 金額為媒體披露+公司確認，未見完整合同文本） |
| EchoStar 頻譜 | 25/9/8 $17B（$8.5B 現金 + $8.5B 股票@$212），另代付 ~$2B 利息，總成本 ~$19B；AWS-4+H-block ~50MHz（2GHz）；25/11 修訂 +AWS-3 15MHz，總價 $19.617B | EchoStar IR/SEC 8-K | Reuters/Ars | 高 |
| Grain 800MHz | Grain 25年初宣布自 T-Mobile 收購，26/7 FCC 批准、8月交割（$2.9B 現金+Grain 600MHz）；26/10/8 Grain→SpaceX（14MHz paired，全國，價格未披露，待 FCC） | Grain PR/Milbank | Via Satellite/MarketWatch | 高 |
| FCC 衛星 | 26/1/9 Gen2 寬頻批至 15,000 顆；26/10/6 D2D/Mobile 批 15,000 顆（326-335km，50%@32/10前，全部@35/10前，可用 EchoStar MSS + SCS，無需租用地面運營商頻譜 waiver） | FCC DA-26-36 / Aviation Week | LightReading/TechSpot | 高；Alan 推文把兩次 15k 混為 Gen2，已糾正 |
| Mobile 現狀 | D2D V1 650+星，16M unique、10M MAU（26/3，經 T-Mobile/Rogers/KDDI 等），目標 26年底 25M MAU（~52k/天）；V2 150Mbps（現 4Mbps），27年中部署 | Quilty/Tesorb | Besen | 中 |
| 市場反應 | 10/8 盤後 T -7.5%、TMUS -7.2%、VZ -6.8%、CMCSA -2%，SPCX +2.5% | CNBC/BI/Investing | Nasdaq 快照 | 高（各家快照差 ±0.5pp，以方向為準） |
| 第三方預測 | Besen: Mobile 美國收入 $1.14B(27)→$25.35B(31)，EBITDA $0.77B→$18.85B，企業占70%；Farrar: 連接總收入 30年 $48B/46M 戶（遠低於華爾街 $121B/116M）；Madden: 現有鏈路預算室內可用 TAM 僅 ~$6B/年，換大天線可 >$20B | Fierce/Besen PDF | Advanced-TV/SatToday | 低中（模型假設分歧極大，僅作情景） |
| 分析師 | 均值目標 $228.65（高 $450/低 $140），Barclays $254 Buy、GS $230 Buy、Susquehanna $173 Hold | Investing | — | 中 |

市值手算備註：$160.57 × ~13B ≈ $2.09T，與報道 $2.12T 誤差 <2%，屬股本時點差異，可接受。

> 偏見自查：資料多但歷史短，我的確定性來自「事件密度」而非「商業驗證」；若資料砍半（無 Q2 明細），結論應從「買入」降為「觀察」。

## 2. 生意本質（段永平）

- 收入結構：Connectivity 是唯一穩定利潤源（Q2 op margin 38.6%），Space 虧損換發射壟斷，AI 爆發但靠重 capex 堆（Q2 capex/revenue 2.35x（$18.37B/$7.814B））。
- 模式：發射（一次性+政府合同）→ Starlink 訂閱（復購，ARPU $66，12M 戶年化 ~$9.5B）→ Mobile/企業（復購+鎖定）→ AI 算力（大合同+高集中）。
- 鎖定：終端（>$300 成本需補貼）+ 頻譜（不可再生）+ 發射排期；轉換成本中高，企業/政府（Starshield $6B+合同）最高。
- 經營槓桿：Connectivity 已兌現（收入+66%，op +79%）；AI 剛兌現 EBITDA 轉正但折舊巨大（Q2 D&A $1.885B），槓桿脆弱。

## 3. 護城河（巴菲特）

| 類型 | 驗證 | 趨勢 |
|---|---|---|
| 規模/成本（發射） | Falcon/Starship 復用，發射成本數量級領先，RLab Neutron 仍小一級 | 變寬 |
| 頻譜（稀缺資產） | 2GHz 65MHz 獨占 + 800MHz 14MHz paired（待批）+ 全球 MSS；低頻 600-900MHz 全國牌照三大鎖死幾十年，Grain 是唯一二手窗口 | 本次變寬（若 FCC 批） |
| 網路效應 | 用戶越多→發射攤薄→更多星→更好覆蓋，弱直接網路效應，強規模經濟 | 變寬 |
| 轉換成本 | 寬頻 rural 低流失；手機若成主號則極高，目前仍是備份層 | 待驗證 |
| 品牌/定價權 | Musk 定價權強（提價/降價皆能帶動需求），但手機資費戰歷史上定價權在存量運營商 | 未證偽 |
| 技術壁壘 | V2/V3（V3 10x 容量/密度，1Tbps/星）、D2D 相控陣；鏈路預算室內短板是真缺口，800MHz 補 10dB 級 | 縮窄缺口中 |

> 巴菲特式追問：10年後護城河還在嗎？— 發射+頻譜在，手機 ARPU 在否取決於 V2 是否真達 150Mbps 與室內可用；摧毀它的是：FCC 不批 + V2 跳票 + 三大聯手壓價。

## 4. 逆向思考（芒格）

| 失敗路徑 | 概率 | 影響 |
|---|---|---|
| FCC 否決/附加嚴苛條件（800MHz 轉讓、SCS 干擾） | 低中 | 致命延遲 12-24個月 |
| 室內鏈路預算仍不達標（Madden 論點成立，800MHz 也不夠） | 中 | TAM 從 $25B 縮至 $6B，$20B 頻譜回不了本（Farrar 警告） |
| Capex 黑洞：AI $15.8B/季 + Starship + V2/V3 + Cursor $60B，現金 $100B 燒 6-8 季 | 中 | 攤薄/發債，S&P 500 納入（需連續 GAAP 盈利）推至 28年後 |
| AI 客戶集中（Anthropic/Google 占大頭，可終止條款） | 中 | $26B 年化意向≠利潤，Q2 AI 仍 op 虧 $1.26B |
| 三大 JV 反擊（T+ VZ +TMUS D2D JV，9天前成立，排斥 Starlink）+ 價格戰 | 高 | 企業 wholesale 價壓至 <$2/GB，Besen $18.8B EBITDA 幻滅 |
| 執行：15k D2D 需 9年、Starship V3 仍試飛、手機渠道/計費/客服從零建 | 中 | 上線即跳票，盤後 +2.5% 回吐 |

空方最強論點（Farrar/Madden/Moffett）：批發 ARPU 僅幾毛錢、<10% 活躍，$20B 頻譜 + 星座 capex 永遠賺不回；Seeking Alpha Hold 論：AI 重資產+虧損+短退出權，不值 2T。

> 芒格式追問：我最可能錯在哪？— 把「頻譜買到」當成「用戶買到」；聰明人不買是因為 2T 已 price-in 了 Mobile 成功。

## 5. 管理層（段永平+巴菲特）

| 時間 | 決策 | 結果/評分 |
|---|---|---|
| 24-25 | 650星 V1 D2D 快速組網，綁 T-Mobile 等 30+運營商 | A-（驗證需求，16M人觸達） |
| 25/9-11 | EchoStar $17→$19.6B 買 65MHz（趁 FCC 調查施壓，Ars 稱投訴換折扣） | A（抄底稀缺資產，附 Boost 合作） |
| 26/2 | 合併 xAI/X，6月 IPO $75B + $25B 債，賬上 $100B | A-（膽大但攤薄/槓桿並存） |
| 26/6 | $60B 收 Cursor，加碼 AI enterprise | B（待驗證，偏貴） |
| 26/8 | Shotwell：「會搶走他們不少客戶」直接宣戰三大 | B+（提振 SPCX，激怒監管/對手組 JV） |
| 26/10 | Grain 800MHz 接盤 + Musk「最後拼圖」 | A-（若 FCC 批；價格未披露是扣分項） |

資本配置：敢下重注、R&D 回報（復用/Starlink）歷史極強，但 AI capex payback 1年之說（CFO）需驗證；持股/薪酬未見大減持（需跟 10-Q proxy）。若 Musk 退休，發射+頻譜資產仍在，但政府關係與融資能力打折。

## 6. 行業與文明趨勢（李錄）

- 範式：地面蜂窩（188M 美國後付戶，飽和）→ 天地一體（SCS 法規 26/7 確立競爭性遴選 + D2D 通道）。FCC 兩次 15k 授權 + 豁免租用條款 = 監管范式轉移，Starlink 是首個吃到者。
- TAM：美國無線 ~$200B+/年；Besen Mobile $25B/31年 ≈ 12% 份額，樂觀但非離譜；悲觀 $6B ≈ 3%。企業 70%（70%×$25B）是關鍵，與 Starshield/航空（AA/Southwest）路徑一致。
- 價值鏈：SpaceX 從批發（T-Satellite 備份，幾毛錢 ARPU）走向零售（自有低頻+漫遊 MVNO），Besen 漫遊-MVNO 四模型中 roaming 最順。
- 類比：不是 3Com（曇花），像「標準石油時刻」— 掌握傳輸（發射≈管道）+ 資源（頻譜≈油田）；風險是重演銥星（技術超前、資費太貴）。

> 李錄式追問：20年後回看？— 若 V2 150Mbps 成真，是移動版 Starlink；若卡在 4Mbps 短信級，是高級版 Globalstar。

## 7. 估值與安全邊際

- 現價隱含：$2.1T ≈ 26/6 IPO $1.77T +20%；分析師均值 $228 (+42%)，隱含 27-28年 Mobile+AI 兌現。反向看：需 Connectivity 30年 $48B（Farrar 中性）+ Mobile $25B + AI 雲 $26B 年化全部兌現才撐得住。
- 三情景（3年，禁止精確 DCF，以市銷/EBITDA 啟發）：
  * 樂觀（FCC 批+V2達標+企業拿下）：Mobile 31年 $25B×8x EV/EBITDA ≈ $150B 增量 + 連接 $48B×10x ≈ $480B，合計 ≈ $630B 增量，對應市值 ~$2.75T（≈$210-220/股，+31~+37%）。
  * 中性（批但室內一般、批發為主）：Mobile $8-10B，增量 $50B，合理 $180-220（現價附近）。
  * 悲觀（不批/跳票/價格戰）：Mobile ~$2B，$20B 頻譜減值，合理 $110-140（IPO 價附近，-30%）。
- 安全邊際：現價無。$160 是事件定價（+2.5%盤後 vs 三大 -7%），不是價值定價。歷史波動 30% 回撤（9月）會重演。

> 巴菲特式追問：r 錯 2pp 結論翻轉嗎？— 會。本報告不給 10年 IRR，給了就是買折現率。段永平式：股市關 5年願持有嗎？— 僅當你信 V2+低頻，其餘不信則不願。

## 8. 綜合決策

| 維度 | 結論 | 信心度 |
|---|---|---|
| 生意質量 | Connectivity 極好，整體被 AI capex 拖累 | 高 |
| 護城河 | 發射+頻譜變寬中，手機端待驗證 | 中高 |
| 管理層 | 頂級下注+兌現史，樹敵亦多 | 高 |
| 最大風險 | FCC/鏈路預算/現金燃燒三選一即重傷 | 高 |
| 文明趨勢 | 天地一體順風，監管首度開門 | 中高 |
| 估值 | 現價計入成功，無安全邊際 | 中 |

| 策略 | 建議 |
|---|---|
| 空倉者 | **觀望，不追**。等 FCC 批文 + V2 試射 + Q3 Cursor 交割後再建首倉；若回 $130-140（IPO 附近）分批 |
| 持倉者 | **持有，勿加槓桿**（2x SPCU/SPCF 日重置，持有超 1天即耗損）。跌破 $145 減 1/3 |
| 加倉信號 | FCC 正式批准 + 公布零售資費/終端補貼 + V2 150Mbps 實測 |
| 賣出信號 | FCC 否決/重附加條件，或 Q3 capex 再超 $20B 且 AI op 虧擴大，或三大 JV 拿下蘋果/三星獨家直連 |

四大師模擬點評：

> 巴菲特：「我看不懂 150Mbps 天上來，但我看得懂 $2.9B 買斷全國低頻是十年難遇的特許權。貴，但特許權從不便宜。」
> 芒格：「反過來想：若 80% 流量在室內而你進不去，你買的是什麼？先證偽鏈路預算，再談 $25B。」
> 段永平：「對的生意（連接）+對的人（Musk/Shotwell），但不對的價（2T）。好公司等對的價。」
> 李錄：「這是文明級的覆蓋權轉移。短期是股票，長期是標準。倉位配得上你的歷史觀即可。」

## 附錄：需一手驗證清單（B級必備）

1. Grain→SpaceX 實際對價（現金/股票/分期？Milbank 文件未披露）。
2. FCC SCS waiver 全文與干擾協調條件（10/6 order 附件）。
3. V2 衛星天線增益實測（是否真 +10dB，支撐室內）。
4. T-Mobile 與 Grain 600MHz 互換細節（是否留後門限制 D2D）。
5. Q3 Cursor 交割價與 AI 雲合同終止條款（10-Q risk factors）。
6. 三大 JV 資費（是否聯手壓 wholesale 至 <$2/GB）。

---
*來源：Grain PR 26-10-08、FCC DA-26-36 & 10/6 D2D order、SpaceX Q2 10-Q/8-K、EchoStar 8-K、CNBC/BI/Investing 盤後快照、Besen/Farrar/Madden 第三方模型、SEC N-PORT/10-Q。本報告非投資建議。*
