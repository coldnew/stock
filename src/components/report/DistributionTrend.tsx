import { useMemo, useState } from 'react';

type Point = [string, number];
type Props = { ticker: string; points: Point[]; source: string; dataAsOf: string; locale?: 'en' | 'zh-TW' };

export default function DistributionTrend({ ticker, points, source, dataAsOf, locale = 'zh-TW' }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const zh = locale === 'zh-TW';
  const chart = useMemo(() => {
    const width = 720;
    const height = 260;
    const padding = { top: 24, right: 18, bottom: 42, left: 46 };
    const max = Math.max(...points.map(([, value]) => value), 0.01) * 1.12;
    const slot = (width - padding.left - padding.right) / Math.max(points.length, 1);
    const x = (index: number) => padding.left + slot * index + slot / 2;
    const y = (value: number) => height - padding.bottom - (value / max) * (height - padding.top - padding.bottom);
    const barWidth = Math.min(slot * 0.56, 44);
    return { width, height, padding, max, x, y, barWidth };
  }, [points]);
  const selected = points[hover ?? points.length - 1];
  const previous = points[Math.max((hover ?? points.length - 1) - 1, 0)];
  const mom = previous[1] ? ((selected[1] / previous[1]) - 1) * 100 : 0;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return <section className="fleet-trend" aria-label={zh ? `${ticker} 每月配息趨勢` : `${ticker} monthly distribution trend`}>
    <div className="fleet-trend-heading">
      <div><span className="chart-kicker">{zh ? 'Distributions / 配息' : 'Distributions'}</span><h3>{ticker} {zh ? '每月配息趨勢' : 'monthly payouts'}</h3></div>
      <div className="fleet-trend-value"><strong>${selected[1].toFixed(4)}</strong><span>{selected[0]}</span></div>
    </div>
    <div className="fleet-trend-canvas">
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={zh ? `${ticker} 最近 ${points.length} 次月配，每單位美元` : `${ticker} last ${points.length} monthly payouts in dollars per share`} onMouseLeave={() => setHover(null)}>
        {ticks.map((ratio) => <g key={ratio}>
          <line x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={chart.y(chart.max * ratio)} y2={chart.y(chart.max * ratio)} className="fleet-grid" />
          <text x={chart.padding.left - 10} y={chart.y(chart.max * ratio) + 4} textAnchor="end" className="fleet-axis">${(chart.max * ratio).toFixed(2)}</text>
        </g>)}
        {points.map((point, index) => <g key={point[0]}>
          <rect x={chart.x(index) - chart.barWidth / 2} y={chart.y(point[1])} width={chart.barWidth} height={chart.height - chart.padding.bottom - chart.y(point[1])} className={hover === index ? 'dist-bar dist-bar-active' : 'dist-bar'} onMouseEnter={() => setHover(index)} onClick={() => setHover(index)} />
          <text x={chart.x(index)} y={chart.height - 14} textAnchor="middle" className="fleet-axis">{point[0]}</text>
        </g>)}
      </svg>
      <div className="fleet-tooltip"><span>{selected[0]}</span><strong>${selected[1].toFixed(4)} <em>{mom >= 0 ? '+' : ''}{mom.toFixed(1)}% {zh ? '對前月' : 'MoM'}</em></strong></div>
    </div>
    <p className="fleet-trend-caption">{zh ? `每月除息的每單位配息金額（美元），資料截止 ${dataAsOf}。單月金額隨選擇權權利金起伏，不宜年化推論。` : `Per-share monthly payout in USD, through ${dataAsOf}. Monthly amounts vary with option premiums; do not annualize a single month.`}<a href={source} target="_blank" rel="noreferrer">{zh ? '查看配息紀錄' : 'View distribution history'}</a></p>
  </section>;
}
