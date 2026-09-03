import { CandlestickChart as MUIXCandlestickChart } from '@mui/x-charts-premium/CandlestickChart';

type Props = {
  dates: string[];
  data: [number, number, number, number][];
  locale?: 'en' | 'zh-TW';
};

export default function CandlestickChart({ dates, data, locale = 'en' }: Props) {
  const formatter = new Intl.NumberFormat(locale === 'zh-TW' ? 'en-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

  return (
    <div className="mui-candlestick-chart" role="img" aria-label={locale === 'zh-TW' ? '近期交易日 K 棒圖' : 'Recent trading-session candlestick chart'}>
      <MUIXCandlestickChart
        xAxis={[{ data: dates, scaleType: 'band', tickLabelStyle: { fontSize: 11 }, valueFormatter: (value) => value.slice(5) }]}
        yAxis={[{ valueFormatter: (value: number) => formatter.format(value) }]}
        series={[{
          data,
          valueFormatter: (value, { field }) => value === null ? '' : `${field.toUpperCase()}: ${formatter.format(value)}`,
          upColor: '#C23B32',
          downColor: '#3A7A4E',
        }]}
        height={360}
        margin={{ left: 64, right: 18, top: 18, bottom: 42 }}
        grid={{ horizontal: true }}
        hideLegend
      />
      <p className="mui-candlestick-caption">{locale === 'zh-TW' ? '紅色為收盤不低於開盤，綠色為收盤低於開盤；滑鼠移至 K 棒可查看 OHLC。' : 'Red means close at or above open; green means close below open. Hover a candle to inspect OHLC.'}</p>
    </div>
  );
}
