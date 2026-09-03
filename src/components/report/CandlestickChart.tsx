import { useEffect, useRef } from 'react';
import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';

type Props = {
  dates: string[];
  data: [number, number, number, number][];
  locale?: 'en' | 'zh-TW';
};

export default function CandlestickChart({ dates, data, locale = 'en' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      height: 360,
      layout: { background: { type: ColorType.Solid, color: '#f5f4ed' }, textColor: '#6b6a64' },
      grid: { vertLines: { color: '#e8e7e1' }, horzLines: { color: '#e8e7e1' } },
      rightPriceScale: { borderColor: '#dedcd2' },
      timeScale: { borderColor: '#dedcd2', timeVisible: false, rightOffset: 2 },
      localization: { priceFormatter: (price: number) => `$${price.toFixed(2)}` },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#C23B32', downColor: '#3A7A4E', borderUpColor: '#C23B32', borderDownColor: '#3A7A4E',
      wickUpColor: '#C23B32', wickDownColor: '#3A7A4E',
    });
    series.setData(data.map(([open, high, low, close], index) => ({ time: dates[index], open, high, low, close })) as Parameters<typeof series.setData>[0]);
    chart.timeScale().fitContent();

    const resize = new ResizeObserver(() => chart.applyOptions({ width: container.clientWidth }));
    resize.observe(container);
    return () => { resize.disconnect(); chart.remove(); };
  }, [dates, data]);

  return (
    <div className="lightweight-candlestick-chart" role="img" aria-label={locale === 'zh-TW' ? '近期交易日 K 棒圖' : 'Recent trading-session candlestick chart'}>
      <div ref={containerRef} />
      <p className="lightweight-candlestick-caption">{locale === 'zh-TW' ? '紅色為收盤不低於開盤，綠色為收盤低於開盤；滑鼠移至 K 棒可查看 OHLC。' : 'Red means close at or above open; green means close below open. Hover a candle to inspect OHLC.'}</p>
      <small className="chart-attribution">Charts by Lightweight Charts™ · Apache 2.0</small>
    </div>
  );
}
