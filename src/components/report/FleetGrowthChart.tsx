import { useMemo, useState } from 'react';

type Point = [string, number];
type Props = { points: Point[]; source: string };

export default function FleetGrowthChart({ points, source }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const chart = useMemo(() => {
    const width = 720;
    const height = 260;
    const padding = { top: 24, right: 18, bottom: 42, left: 46 };
    const max = Math.max(...points.map(([, value]) => value), 1);
    const x = (index: number) => padding.left + (index / Math.max(points.length - 1, 1)) * (width - padding.left - padding.right);
    const y = (value: number) => height - padding.bottom - (value / max) * (height - padding.top - padding.bottom);
    const line = points.map(([, value], index) => `${index ? 'L' : 'M'} ${x(index).toFixed(2)} ${y(value).toFixed(2)}`).join(' ');
    return { width, height, padding, max, x, y, line };
  }, [points]);
  const selected = points[hover ?? points.length - 1];
  const previous = points[Math.max((hover ?? points.length - 1) - 1, 0)];
  const change = previous[1] ? ((selected[1] / previous[1]) - 1) * 100 : 0;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return <section className="fleet-trend" aria-label="Texas AV Tracker 車隊登記增長趨勢">
    <div className="fleet-trend-heading">
      <div><span className="chart-kicker">Texas DMV 登記</span><h3>Robotaxi 車隊增長趨勢</h3></div>
      <div className="fleet-trend-value"><strong>{selected[1].toLocaleString()} 台</strong><span>{selected[0]}</span></div>
    </div>
    <div className="fleet-trend-canvas">
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={`Texas Robotaxi 登記車隊由 ${points[0][1]} 台增至 ${points.at(-1)?.[1]} 台`} onMouseLeave={() => setHover(null)}>
        {ticks.map((ratio) => <g key={ratio}>
          <line x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={chart.y(chart.max * ratio)} y2={chart.y(chart.max * ratio)} className="fleet-grid" />
          <text x={chart.padding.left - 10} y={chart.y(chart.max * ratio) + 4} textAnchor="end" className="fleet-axis">{Math.round(chart.max * ratio)}</text>
        </g>)}
        <path d={`${chart.line} L ${chart.x(points.length - 1)} ${chart.height - chart.padding.bottom} L ${chart.x(0)} ${chart.height - chart.padding.bottom} Z`} className="fleet-area" />
        <path d={chart.line} className="fleet-line" />
        {points.map((point, index) => <g key={point[0]}>
          <circle cx={chart.x(index)} cy={chart.y(point[1])} r={hover === index ? 6 : 4} className="fleet-point" onMouseEnter={() => setHover(index)} onClick={() => setHover(index)} />
          {(index === 0 || index === points.length - 1 || hover === index) && <text x={chart.x(index)} y={chart.height - 14} textAnchor="middle" className="fleet-axis">{point[0]}</text>}
        </g>)}
      </svg>
      <div className="fleet-tooltip"><span>{selected[0]}</span><strong>{selected[1].toLocaleString()} 台 <em>{change >= 0 ? '+' : ''}{change.toFixed(1)}% 對前一點</em></strong></div>
    </div>
    <p className="fleet-trend-caption">資料為 Texas DMV AV registry 的登記車隊快照；登記數不等於實際上線車、付費里程、利用率或營收。<a href={source} target="_blank" rel="noreferrer">查看追蹤資料</a></p>
  </section>;
}
