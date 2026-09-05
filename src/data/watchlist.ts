export type TrackedAsset = {
  ticker: string;
  market: 'US' | 'TW';
  assetType: 'equity' | 'etf' | 'bdc';
  displayTicker: string;
};

/** 首頁追蹤清單的單一來源：市場與資產類型分開記錄，方便日後加入台股 ETF。 */
export const trackedAssets: TrackedAsset[] = [
  ...['AAPL', 'AMD', 'GOOG', 'MSFT', 'NVDA', 'SPCX', 'TSLA'].map((ticker) => ({ ticker, market: 'US' as const, assetType: 'equity' as const, displayTicker: ticker })),
  { ticker: 'ARCC', market: 'US', assetType: 'bdc', displayTicker: 'ARCC' },
  ...['BTCI', 'CHPY', 'DGRO', 'DRAM', 'GPIQ', 'GPIX', 'IQQ', 'IWMI', 'MAGS', 'OVL', 'QDVO', 'QQQ', 'QQQH', 'QQQI', 'SGOV', 'SPYI', 'TQQQ', 'VOO', 'VTI'].map((ticker) => ({ ticker, market: 'US' as const, assetType: 'etf' as const, displayTicker: ticker })),
];

/** 相容既有批次行情與排序邏輯的清單。 */
export const individualWatchlist = trackedAssets.filter(({ assetType }) => assetType !== 'etf').map(({ ticker }) => ticker);
export const etfWatchlist = trackedAssets.filter(({ assetType }) => assetType === 'etf').map(({ ticker }) => ticker);

/** 所有明確追蹤標的，供行情資料與其他批次工作使用。 */
export const watchlist = [...individualWatchlist, ...etfWatchlist];

export const trackedAssetByTicker = new Map(trackedAssets.map((asset) => [asset.ticker, asset]));

/** 有報告但未列入上述清單的標的，只會出現在每日報導，不會被當成追蹤標的。 */
export const reportOnlyTickers = [
  'AVGO',
  '2330.TW',
];
