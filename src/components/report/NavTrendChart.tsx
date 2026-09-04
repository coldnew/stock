import { useEffect, useMemo, useState } from 'react';

type Point = [string, number];
type Props = { ticker: string; dataUrl: string; source: string; dataAsOf: string };

export default function NavTrendChart({ ticker, dataUrl, source, dataAsOf }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    fetch(dataUrl).then((response) => {
      if (!response.ok) throw new Error(`NAV data: ${response.status}`);
      return response.json();
    }).then((snapshot: { points: Point[] }) => {
      if (active) setPoints(snapshot.points);
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [dataUrl]);
  const chart = useMemo(() => {
    const recent = points.slice(-260);
    const values = recent.map(([, value]) => value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);
    const width = 720;
    const height = 240;
    const x = (index: number) => (index / Math.max(recent.length - 1, 1)) * width;
    const y = (value: number) => height - ((value - min) / range) * (height - 24) - 12;
    return { recent, min, max, width, height, path: recent.map((point, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(2)} ${y(point[1]).toFixed(2)}`).join(' '), x, y };
  }, [points]);
  if (loadError) return <section className="nav-trend nav-trend-loading" aria-label={`${ticker} NAV 淨值趨勢`}>NAV 趨勢資料暫時無法載入。</section>;
  if (points.length < 2) return <section className="nav-trend nav-trend-loading" aria-label={`${ticker} NAV 淨值趨勢`}>載入 NAV 趨勢資料…</section>;
  const selected = chart.recent[hover ?? chart.recent.length - 1];
  const change = chart.recent.length > 1 ? (selected[1] / chart.recent[0][1] - 1) * 100 : 0;

  return <section className="nav-trend" aria-label={`${ticker} NAV 淨值總報酬趨勢`}>
    <div className="nav-trend-heading"><div><span className="chart-kicker">NAV / 淨值</span><h2>{ticker} NAV 變化趨勢</h2></div><div className="nav-trend-value"><strong>{selected[1].toLocaleString()}</strong><span>{selected[0]}</span></div></div>
    <div className="nav-trend-canvas">
      <svg viewBox={`0 0 ${chart.width} ${chart.height + 8}`} role="img" aria-label={`${ticker} 最近 ${chart.recent.length} 筆 NAV 總報酬指數`} onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((ratio) => <line key={ratio} x1="0" x2={chart.width} y1={chart.y(chart.min + (chart.max - chart.min) * ratio)} y2={chart.y(chart.min + (chart.max - chart.min) * ratio)} className="nav-grid" />)}
        <path d={chart.path} className="nav-line" />
        {chart.recent.map((point, index) => <circle key={point[0]} cx={chart.x(index)} cy={chart.y(point[1])} r={hover === index ? 5 : 3} className="nav-point" onMouseEnter={() => setHover(index)} onClick={() => setHover(index)} />)}
      </svg>
      <div className="nav-tooltip"><span>{selected[0]}</span><strong>{selected[1].toLocaleString()} <em>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</em></strong></div>
    </div>
    <p className="nav-trend-caption">以發行商公布的「NAV 再投資／總報酬」$10,000 成長序列繪製；不是每日 NAV 價格，也不代表市場成交價。圖表資料截止 {dataAsOf}。<a href={source} target="_blank" rel="noreferrer">查看原始資料</a></p>
    <small className="chart-attribution">資料來源：基金發行商官方 NAV Performance · <a href={dataUrl}>JSON</a></small>
  </section>;
}
