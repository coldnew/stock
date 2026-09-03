import { useMemo } from 'react';
import { ChartView, DrawingToolbar, IndicatorController, IndicatorPicker } from '@getcandlekit/charts/react';
import { createBuiltinRegistry } from '@getcandlekit/charts';
import '@getcandlekit/charts/styles.css';

type Props = {
  dates: string[];
  data: [number, number, number, number][];
  locale?: 'en' | 'zh-TW';
};

export default function CandlestickChart({ dates, data, locale = 'en' }: Props) {
  const indicators = useMemo(() => new IndicatorController(createBuiltinRegistry()), []);
  const bars = data.map(([open, high, low, close], index) => ({
    ts: Date.parse(dates[index]), open, high, low, close,
  }));

  return (
    <div className="candlekit-chart" role="img" aria-label={locale === 'zh-TW' ? '近期交易日 K 棒圖' : 'Recent trading-session candlestick chart'}>
      <div className="candlekit-chart-canvas">
        <ChartView data={bars} seriesType="candlestick" theme={{ mode: 'light', background: '#f5f4ed', text: '#6b6a64', grid: '#e8e7e1', axis: '#dedcd2', crosshair: '#1B365D', crosshairLabelBg: '#1B365D', up: '#C23B32', down: '#3A7A4E', line: '#1B365D', volumeUp: '#C23B3266', volumeDown: '#3A7A4E66', fontFamily: 'inherit', fontSize: 12 }} showVolume drawing={{ storageKey: `report-drawings:${dates[0]}` }} measurement indicators={indicators}>
          <DrawingToolbar />
          <IndicatorPicker label="Indicators" />
        </ChartView>
      </div>
      <p className="lightweight-candlestick-caption">{locale === 'zh-TW' ? '紅色為收盤不低於開盤，綠色為收盤低於開盤；滑鼠移至 K 棒可查看 OHLC。' : 'Red means close at or above open; green means close below open. Hover a candle to inspect OHLC.'}</p>
      <small className="chart-attribution">Charts by CandleKit · MIT</small>
    </div>
  );
}
