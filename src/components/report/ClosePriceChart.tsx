import { LineChart } from '@mui/x-charts/LineChart';

type Props = {
  ticker: string;
  dates: string[];
  values: number[];
  locale?: 'en' | 'zh-TW';
};

export default function ClosePriceChart({ ticker, dates, values, locale = 'en' }: Props) {
  const title = locale === 'zh-TW' ? `${ticker} 近期收盤價趨勢圖` : `${ticker} recent closing-price trend chart`;
  const labels = dates.map((date) => date.slice(5));

  return (
    <div className="mui-price-chart" role="img" aria-label={title}>
      <LineChart
        height={300}
        margin={{ top: 16, right: 18, bottom: 42, left: 58 }}
        xAxis={[{ scaleType: 'point', data: labels }]}
        yAxis={[{ valueFormatter: (value: number) => `$${value.toFixed(0)}` }]}
        series={[{
          id: ticker,
          label: ticker,
          data: values,
          color: '#1B365D',
          showMark: true,
          valueFormatter: (value) => value == null ? '' : `$${value.toFixed(2)}`,
        }]}
        grid={{ horizontal: true }}
        hideLegend
      />
      <p className="lightweight-candlestick-caption">{locale === 'zh-TW' ? '以 MUI X Charts 繪製；游標移至資料點可查看當日收盤價。' : 'Drawn with MUI X Charts; hover a point to inspect each closing price.'}</p>
      <small className="chart-attribution">Charts by MUI X Charts · MIT</small>
    </div>
  );
}
