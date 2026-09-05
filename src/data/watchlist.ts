/** 明確列入首頁「個股追蹤」的標的。 */
export const individualWatchlist = [
  'AAPL', 'AMD', 'ARCC', 'GOOG', 'MSFT', 'NVDA', 'SPCX', 'TSLA',
];

/** 明確列入首頁「ETF 追蹤」的標的與主題代理。DRAM 目前按使用者指定歸入此清單。 */
export const etfWatchlist = [
  'BTCI', 'CHPY', 'DGRO', 'DRAM', 'GPIQ', 'GPIX', 'IQQ', 'IWMI',
  'MAGS', 'OVL', 'QDVO', 'QQQ', 'QQQH', 'QQQI', 'SGOV', 'SPYI', 'TQQQ',
];

/** 所有明確追蹤標的，供行情資料與其他批次工作使用。 */
export const watchlist = [...individualWatchlist, ...etfWatchlist];

/** 有報告但未列入上述清單的標的，只會出現在每日報導，不會被當成追蹤標的。 */
export const reportOnlyTickers = [
  '2330.TW',
];
