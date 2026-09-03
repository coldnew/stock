import { useEffect, useMemo, useState } from 'react';
import { ChartView, DrawingToolbar, IndicatorController, IndicatorPicker } from '@getcandlekit/charts/react';
import { createBuiltinRegistry } from '@getcandlekit/charts';
import '@getcandlekit/charts/styles.css';

type Props = {
  dates?: string[];
  data?: [number, number, number, number][];
  dataUrl?: string;
  levels?: { price: number; label: string; color?: string }[];
  locale?: 'en' | 'zh-TW';
};

export default function CandlestickChart({ dates = [], data = [], dataUrl, levels = [], locale = 'en' }: Props) {
  const [remoteData, setRemoteData] = useState<{ dates: string[]; data: [number, number, number, number][] } | null>(null);
  const [loadError, setLoadError] = useState(false);
  const indicators = useMemo(() => new IndicatorController(createBuiltinRegistry()), []);
  useEffect(() => {
    if (!dataUrl) return;
    let active = true;
    fetch(dataUrl).then((response) => {
      if (!response.ok) throw new Error(`market data: ${response.status}`);
      return response.json();
    }).then((snapshot: { rows: [string, number, number, number, number][] }) => {
      if (!active) return;
      setRemoteData({
        dates: snapshot.rows.map(([date]) => date),
        data: snapshot.rows.map(([, open, high, low, close]) => [open, high, low, close]),
      });
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [dataUrl]);
  const chartDates = remoteData?.dates ?? dates;
  const chartData = remoteData?.data ?? data;
  const bars = chartData.map(([open, high, low, close], index) => ({
    ts: Date.parse(chartDates[index]), open, high, low, close,
  }));

  if (dataUrl && !remoteData && !loadError) {
    return <div className="candlekit-chart candlekit-chart-loading" role="status">{locale === 'zh-TW' ? '載入行情圖表…' : 'Loading market chart…'}</div>;
  }
  if (loadError || bars.length < 2) {
    return <div className="candlekit-chart candlekit-chart-loading" role="status">{locale === 'zh-TW' ? '行情圖表暫時無法載入。' : 'Market chart is temporarily unavailable.'}</div>;
  }

  return (
    <div className="candlekit-chart" role="img" aria-label={locale === 'zh-TW' ? '近期交易日 K 棒圖' : 'Recent trading-session candlestick chart'}>
      <div className="candlekit-chart-canvas">
          <ChartView data={bars} seriesType="candlestick" theme={{ mode: 'light', background: '#f5f4ed', text: '#6b6a64', grid: '#e8e7e1', axis: '#dedcd2', crosshair: '#1B365D', crosshairLabelBg: '#1B365D', up: '#C23B32', down: '#3A7A4E', line: '#1B365D', volumeUp: '#C23B3266', volumeDown: '#3A7A4E66', fontFamily: 'inherit', fontSize: 12 }} showVolume={false} drawing={{ storageKey: `report-drawings:${chartDates[0]}` }} measurement indicators={indicators} onReady={({ controller }) => {
            levels.forEach(({ price, label, color = '#9B5C2E' }) => controller.getSeries().createPriceLine({ price, color, lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: label }));
          }}>
          <DrawingToolbar />
          <IndicatorPicker label="Indicators" />
        </ChartView>
      </div>
      <p className="lightweight-candlestick-caption">{locale === 'zh-TW' ? '紅色為收盤不低於開盤，綠色為收盤低於開盤；滑鼠移至 K 棒可查看 OHLC。' : 'Red means close at or above open; green means close below open. Hover a candle to inspect OHLC.'}{levels.length > 0 && ` 技術位階：${levels.map(({ label, price }) => `${label} ${price}`).join(' · ')}`}</p>
      <small className="chart-attribution">Charts by CandleKit · MIT</small>
    </div>
  );
}
