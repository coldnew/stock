import { ChartView } from '@getcandlekit/charts/react';
import '@getcandlekit/charts/styles.css';

type Props = {
  ticker: string;
  dates: string[];
  values: number[];
  locale?: 'en' | 'zh-TW';
};

export default function ClosePriceChart({ ticker, dates, values, locale = 'en' }: Props) {
  const title = locale === 'zh-TW' ? `${ticker} 近期收盤價趨勢圖` : `${ticker} recent closing-price trend chart`;
  const bars = dates.map((date, index) => {
    const value = values[index];
    return { ts: Date.parse(date), open: value, high: value, low: value, close: value };
  });

  return (
    <div className="candlekit-chart" role="img" aria-label={title}>
      <ChartView data={bars} seriesType="line" theme="light" showVolume={false} />
      <p className="lightweight-candlestick-caption">{locale === 'zh-TW' ? '以 CandleKit 繪製；游標移至走勢可查看當日收盤價。' : 'Drawn with CandleKit; hover the trend to inspect each closing price.'}</p>
      <small className="chart-attribution">Charts by CandleKit · MIT</small>
    </div>
  );
}
