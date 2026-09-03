import { useEffect, useRef } from 'react';
import { ColorType, LineSeries, createChart } from 'lightweight-charts';

type Props = {
  ticker: string;
  dates: string[];
  values: number[];
  locale?: 'en' | 'zh-TW';
};

export default function ClosePriceChart({ ticker, dates, values, locale = 'en' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || dates.length < 2 || values.length < 2) return;

    const chart = createChart(container, {
      height: 300,
      layout: { background: { type: ColorType.Solid, color: '#f5f4ed' }, textColor: '#6b6a64' },
      grid: { vertLines: { color: '#e8e7e1' }, horzLines: { color: '#e8e7e1' } },
      rightPriceScale: { borderColor: '#dedcd2' },
      timeScale: { borderColor: '#dedcd2', timeVisible: false, rightOffset: 2 },
      localization: { priceFormatter: (price: number) => `$${price.toFixed(2)}` },
    });
    const series = chart.addSeries(LineSeries, {
      color: '#1B365D',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });
    series.setData(dates.map((time, index) => ({ time, value: values[index] })) as Parameters<typeof series.setData>[0]);
    chart.timeScale().fitContent();

    const resize = new ResizeObserver(() => chart.applyOptions({ width: container.clientWidth }));
    resize.observe(container);
    return () => { resize.disconnect(); chart.remove(); };
  }, [dates, values]);

  return (
    <div className="lightweight-price-chart" role="img" aria-label={locale === 'zh-TW' ? `${ticker} 近期收盤價趨勢圖` : `${ticker} recent closing-price trend chart`}>
      <div ref={containerRef} />
      <p className="lightweight-candlestick-caption">{locale === 'zh-TW' ? '以 Lightweight Charts 繪製；游標移至線上可查看當日收盤價。' : 'Drawn with Lightweight Charts; hover the line to inspect each closing price.'}</p>
      <small className="chart-attribution">Charts by Lightweight Charts™ · Apache 2.0</small>
    </div>
  );
}
