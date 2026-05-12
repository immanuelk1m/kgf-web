'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { MarketDataResponse, MarketHistoryPoint, MarketItem, MarketKey } from '@/lib/market-data';

const fearGreedStages = ['극단적 공포', '공포', '중립', '탐욕', '극단적 탐욕'] as const;

type FearGreedStage = (typeof fearGreedStages)[number];
type MetricKind = 'close' | 'changePercent' | 'rangePercent' | 'inverseChangePercent';

type IndicatorConfig = {
  title: string;
  body: string;
  sourceKey: MarketKey;
  metric: MetricKind;
  metricLabel: string;
};

type IndicatorMarketState = {
  items: MarketDataResponse['items'] | null;
  loading: boolean;
  error: string | null;
};

const indicators: IndicatorConfig[] = [
  {
    title: '시장 모멘텀',
    body: '네이버 코스피 최근 가격 흐름으로 지수의 방향성을 확인합니다.',
    sourceKey: 'kospi',
    metric: 'close',
    metricLabel: 'KOSPI 종가',
  },
  {
    title: '주가 강도',
    body: '네이버 코스피 일별 등락률로 매수·매도 압력의 강도를 봅니다.',
    sourceKey: 'kospi',
    metric: 'changePercent',
    metricLabel: 'KOSPI 등락률',
  },
  {
    title: '시장 폭',
    body: '네이버 코스닥 최근 가격 흐름으로 중소형주 영역의 확산 여부를 봅니다.',
    sourceKey: 'kosdaq',
    metric: 'close',
    metricLabel: 'KOSDAQ 종가',
  },
  {
    title: '투기 심리',
    body: '네이버 코스닥 일별 등락률로 위험 선호가 강해지는지 확인합니다.',
    sourceKey: 'kosdaq',
    metric: 'changePercent',
    metricLabel: 'KOSDAQ 등락률',
  },
  {
    title: '변동성',
    body: '네이버 코스피 고가·저가 범위로 시장 흔들림의 크기를 추적합니다.',
    sourceKey: 'kospi',
    metric: 'rangePercent',
    metricLabel: 'KOSPI 일중 변동폭',
  },
  {
    title: '안전자산 선호',
    body: '네이버 원/달러 환율 흐름으로 위험 회피 심리를 보조 확인합니다.',
    sourceKey: 'usdkrw',
    metric: 'close',
    metricLabel: 'USD/KRW 종가',
  },
  {
    title: '위험자산 선호',
    body: '원/달러 등락률을 반대로 읽어 위험자산 선호 회복 여부를 점검합니다.',
    sourceKey: 'usdkrw',
    metric: 'inverseChangePercent',
    metricLabel: 'USD/KRW 역방향 등락률',
  },
];

export default function IndicatorCards() {
  const [marketState, setMarketState] = useState<IndicatorMarketState>({
    items: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setMarketState((previous) => ({ ...previous, loading: previous.items === null, error: null }));
      try {
        const response = await fetch('/api/market-data', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`market API returned ${response.status}`);
        }
        const data = (await response.json()) as MarketDataResponse;
        if (!cancelled) {
          setMarketState({ items: data.items, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setMarketState((previous) => ({
            ...previous,
            loading: false,
            error: error instanceof Error ? error.message : '시장 차트 데이터를 불러오지 못했습니다.',
          }));
        }
      }
    };

    void fetchData();
    const interval = setInterval(fetchData, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="border-t border-neutral-900 pt-5">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Seven Indicators</div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">7가지 공포 & 탐욕 지표</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">
          네이버 모바일 증권에서 가져온 코스피·코스닥·원/달러 최근 값으로 각 지표의 라인차트를 구성합니다.
        </p>
      </div>

      <div className="border-y border-neutral-900 bg-white">
        {indicators.map((indicator, index) => {
          const item = marketState.items?.[indicator.sourceKey] ?? null;
          const series = buildIndicatorSeries(item?.history ?? [], indicator.metric);
          const latest = series[series.length - 1] ?? null;
          const currentStage = getStageFromSeries(latest?.value ?? null, indicator.metric);

          return (
            <article
              key={indicator.title}
              className="grid gap-4 border-b border-neutral-200 px-0 py-5 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)] md:items-start lg:grid-cols-[88px_minmax(0,1fr)_380px_126px]"
            >
              <div className="flex items-center gap-3 px-4 md:block md:border-r md:border-neutral-200 md:px-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-700">{String(index + 1).padStart(2, '0')}</span>
                <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 md:mt-2 md:block">Indicator</span>
              </div>

              <div className="px-4 md:px-5">
                <h3 className="text-xl font-black tracking-tight text-neutral-950 md:text-2xl">{indicator.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{indicator.body}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Source · Naver {item?.label ?? getSourceLabel(indicator.sourceKey)}
                </p>
              </div>

              <div className="px-4 md:col-start-2 md:px-5 lg:col-start-auto">
                <IndicatorLineChart
                  title={indicator.title}
                  metricLabel={indicator.metricLabel}
                  item={item}
                  series={series}
                  loading={marketState.loading}
                  error={marketState.error ?? item?.error ?? null}
                />
              </div>

              <div className="px-4 md:col-start-2 md:px-5 md:text-right lg:col-start-auto">
                <span className="inline-flex min-w-24 justify-center border border-neutral-900 px-3 py-2 text-xs font-black text-neutral-950">
                  {currentStage}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function IndicatorLineChart({
  title,
  metricLabel,
  item,
  series,
  loading,
  error,
}: {
  title: string;
  metricLabel: string;
  item: MarketItem | null;
  series: Array<{ date: string; value: number; valueText: string }>;
  loading: boolean;
  error: string | null;
}) {
  const chart = useMemo(() => createLineChart(series), [series]);
  const latest = series[series.length - 1] ?? null;
  const firstDate = series[0]?.date ? formatShortDate(series[0].date) : '--';
  const lastDate = latest?.date ? formatShortDate(latest.date) : '--';

  if (loading && series.length === 0) {
    return <div className="flex h-[174px] items-center justify-center border border-neutral-200 bg-neutral-50 text-sm font-bold text-neutral-400">차트 로딩 중</div>;
  }

  if (series.length < 2) {
    return (
      <div className="flex h-[174px] items-center justify-center border border-neutral-200 bg-neutral-50 px-4 text-center text-sm font-bold text-neutral-400">
        {error ?? '네이버 차트 데이터를 확인할 수 없습니다.'}
      </div>
    );
  }

  return (
    <div className="border border-neutral-300 bg-white p-4" aria-label={`${title} 지표 그래프`}>
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">Naver Line Chart</div>
          <div className="mt-1 text-xs font-bold text-neutral-500">{metricLabel}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black leading-none text-neutral-950">{latest.valueText}</div>
          <div className="mt-1 text-[10px] font-black text-neutral-500">{item?.timestampText ?? lastDate}</div>
        </div>
      </div>

      <svg viewBox="0 0 320 116" className="mt-3 h-32 w-full overflow-visible" role="img">
        <line x1="0" y1="16" x2="320" y2="16" stroke="#e5e5e5" strokeDasharray="3 3" />
        <line x1="0" y1="58" x2="320" y2="58" stroke="#e5e5e5" strokeDasharray="3 3" />
        <line x1="0" y1="100" x2="320" y2="100" stroke="#e5e5e5" strokeDasharray="3 3" />
        <polyline points={chart.points} fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={chart.latestX} cy={chart.latestY} r="4" fill="#b91c1c" />
      </svg>

      <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-neutral-400">
        <span>{firstDate}</span>
        <span>최근 {series.length}개 거래일</span>
        <span>{lastDate}</span>
      </div>
    </div>
  );
}

function buildIndicatorSeries(history: MarketHistoryPoint[], metric: MetricKind) {
  return history
    .map((point) => {
      const value = getMetricValue(point, metric);
      if (value === null) {
        return null;
      }

      return {
        date: point.date,
        value,
        valueText: formatMetricValue(value, metric, point.closeText),
      };
    })
    .filter((point): point is { date: string; value: number; valueText: string } => point !== null);
}

function getMetricValue(point: MarketHistoryPoint, metric: MetricKind) {
  if (metric === 'close') {
    return point.close;
  }
  if (metric === 'changePercent') {
    return point.changePercent;
  }
  if (metric === 'inverseChangePercent') {
    return point.changePercent === null ? null : -point.changePercent;
  }
  if (metric === 'rangePercent') {
    if (point.high === null || point.low === null || point.close === 0) {
      return null;
    }
    return ((point.high - point.low) / point.close) * 100;
  }
  return null;
}

function createLineChart(series: Array<{ value: number }>) {
  if (series.length === 0) {
    return { points: '', latestX: 0, latestY: 0 };
  }

  const values = series.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = range * 0.12;
  const domainMin = min - pad;
  const domainMax = max + pad;
  const domain = domainMax - domainMin || 1;

  const coordinates = series.map((point, index) => {
    const x = (index / Math.max(series.length - 1, 1)) * 308 + 6;
    const y = 104 - ((point.value - domainMin) / domain) * 96;
    return { x, y };
  });

  const latest = coordinates[coordinates.length - 1];

  return {
    points: coordinates.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' '),
    latestX: latest.x,
    latestY: latest.y,
  };
}

function getStageFromSeries(value: number | null, metric: MetricKind): FearGreedStage {
  if (value === null) {
    return '중립';
  }

  if (metric === 'rangePercent') {
    if (value >= 4) return '극단적 공포';
    if (value >= 2.5) return '공포';
    if (value >= 1.2) return '중립';
    if (value >= 0.6) return '탐욕';
    return '극단적 탐욕';
  }

  if (metric === 'close') {
    return '중립';
  }

  if (value <= -1.5) return '극단적 공포';
  if (value < -0.3) return '공포';
  if (value <= 0.3) return '중립';
  if (value < 1.5) return '탐욕';
  return '극단적 탐욕';
}

function formatMetricValue(value: number, metric: MetricKind, closeText: string) {
  if (metric === 'close') {
    return closeText;
  }
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatShortDate(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[2]}.${match[3]}` : date;
}

function getSourceLabel(key: MarketKey) {
  switch (key) {
    case 'kospi':
      return '코스피';
    case 'kosdaq':
      return '코스닥';
    case 'usdkrw':
      return '원/달러';
    default:
      return '시장 데이터';
  }
}
