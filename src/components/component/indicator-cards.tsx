'use client';

import React, { useEffect, useMemo, useState } from 'react';

const GITHUB_JSON_BASE = 'https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json';
const fearGreedStages = ['극단적 공포', '공포', '중립', '탐욕', '극단적 탐욕'] as const;

type FearGreedStage = (typeof fearGreedStages)[number];
type FactorFile = 'kospi' | 'stock_strength' | 'mcclenllan' | 'p_c_ema' | 'vix_close' | 'safe_spread' | 'junk_spread';
type FactorStatusKey =
  | 'ema_spread_scaled'
  | 'stock_strength_scaled'
  | 'mcclenllan_scaled'
  | 'p_c_ema_scaled'
  | 'vix_ema_spread_scaled'
  | 'safe_spread_scaled'
  | 'junk_spread_scaled';
type FactorImputedKey =
  | 'ema_spread_imputed'
  | 'stock_strength_imputed'
  | 'mcclenllan_imputed'
  | 'p_c_ema_imputed'
  | 'vix_ema_spread_imputed'
  | 'safe_spread_imputed'
  | 'junk_spread_imputed';

type FactorPoint = {
  date: string;
  value: number;
  comparison?: number;
};

type FactorDataset = Record<FactorFile, FactorPoint[]>;
type FactorStatus = Partial<Record<FactorStatusKey, number> & Record<FactorImputedKey, number>>;

type IndicatorConfig = {
  title: string;
  eyebrow: string;
  body: string;
  file: FactorFile;
  statusKey: FactorStatusKey;
  imputedKey: FactorImputedKey;
  valueLabel: string;
  comparisonLabel?: string;
  valueFormat: 'number' | 'percent' | 'ratio' | 'index';
  interpretation: (stage: FearGreedStage) => string;
};

type FactorState = {
  datasets: Partial<FactorDataset>;
  status: FactorStatus | null;
  loading: boolean;
  error: string | null;
};

const indicators: IndicatorConfig[] = [
  {
    title: '시장 모멘텀',
    eyebrow: 'Market Momentum',
    body: '코스피가 장기 추세선 대비 어느 위치에 있는지 보고 시장의 기본 방향성을 판단합니다.',
    file: 'kospi',
    statusKey: 'ema_spread_scaled',
    imputedKey: 'ema_spread_imputed',
    valueLabel: 'KOSPI',
    comparisonLabel: '추세선',
    valueFormat: 'index',
    interpretation: (stage) => `코스피 추세 기반 심리는 현재 ${stage} 구간입니다.`,
  },
  {
    title: '주가 강도',
    eyebrow: 'Stock Price Strength',
    body: '상승 종목의 강도가 충분한지 확인해 시장 내부의 매수세가 넓게 퍼지는지 봅니다.',
    file: 'stock_strength',
    statusKey: 'stock_strength_scaled',
    imputedKey: 'stock_strength_imputed',
    valueLabel: '강도 지표',
    valueFormat: 'number',
    interpretation: (stage) => `상승 종목 강도는 ${stage} 쪽으로 기울어 있습니다.`,
  },
  {
    title: '시장 폭',
    eyebrow: 'Stock Price Breadth',
    body: '맥클레런 계열 시장 폭 지표로 일부 대형주가 아닌 전체 시장의 참여도를 확인합니다.',
    file: 'mcclenllan',
    statusKey: 'mcclenllan_scaled',
    imputedKey: 'mcclenllan_imputed',
    valueLabel: '시장 폭',
    valueFormat: 'number',
    interpretation: (stage) => `시장 참여 폭은 ${stage} 상태로 해석됩니다.`,
  },
  {
    title: '옵션 심리',
    eyebrow: 'Put and Call Options',
    body: '풋/콜 흐름을 평활화해 방어적 포지션과 공격적 포지션의 균형을 점검합니다.',
    file: 'p_c_ema',
    statusKey: 'p_c_ema_scaled',
    imputedKey: 'p_c_ema_imputed',
    valueLabel: '풋/콜 EMA',
    valueFormat: 'ratio',
    interpretation: (stage) => `옵션 시장의 심리는 ${stage} 신호를 보입니다.`,
  },
  {
    title: '변동성',
    eyebrow: 'Market Volatility',
    body: '변동성 지표와 추세를 함께 보며 시장이 얼마나 불안정하게 움직이는지 확인합니다.',
    file: 'vix_close',
    statusKey: 'vix_ema_spread_scaled',
    imputedKey: 'vix_ema_spread_imputed',
    valueLabel: '변동성',
    comparisonLabel: '변동성 추세',
    valueFormat: 'number',
    interpretation: (stage) => `변동성 기반 위험 신호는 ${stage} 구간입니다.`,
  },
  {
    title: '안전자산 선호',
    eyebrow: 'Safe Haven Demand',
    body: '안전자산 선호가 강해지는지 추적해 위험 회피 심리가 확대되는지 살핍니다.',
    file: 'safe_spread',
    statusKey: 'safe_spread_scaled',
    imputedKey: 'safe_spread_imputed',
    valueLabel: '안전자산 스프레드',
    valueFormat: 'number',
    interpretation: (stage) => `안전자산 선호는 ${stage} 수준으로 반영됩니다.`,
  },
  {
    title: '신용/위험자산 선호',
    eyebrow: 'Junk Bond Demand',
    body: '위험자산과 신용 스프레드 성격의 데이터를 통해 과도한 회피 또는 선호를 확인합니다.',
    file: 'junk_spread',
    statusKey: 'junk_spread_scaled',
    imputedKey: 'junk_spread_imputed',
    valueLabel: '위험 스프레드',
    valueFormat: 'number',
    interpretation: (stage) => `신용·위험자산 선호는 ${stage} 구간에 있습니다.`,
  },
];

export default function IndicatorCards() {
  const [factorState, setFactorState] = useState<FactorState>({
    datasets: {},
    status: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setFactorState((previous) => ({ ...previous, loading: Object.keys(previous.datasets).length === 0, error: null }));
      try {
        const [status, ...datasetEntries] = await Promise.all([
          fetchFactorStatus(),
          ...indicators.map(async (indicator) => [indicator.file, await fetchFactorSeries(indicator.file)] as const),
        ]);

        if (!cancelled) {
          setFactorState({
            datasets: Object.fromEntries(datasetEntries) as FactorDataset,
            status,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setFactorState((previous) => ({
            ...previous,
            loading: false,
            error: error instanceof Error ? error.message : '공포·탐욕 지표 데이터를 불러오지 못했습니다.',
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
          공포·탐욕 지수를 구성하는 원천 팩터 데이터를 라인차트와 현재 상태로 나눠 확인합니다.
        </p>
      </div>

      <div className="border-y border-neutral-900 bg-white">
        {indicators.map((indicator, index) => {
          const series = factorState.datasets[indicator.file] ?? [];
          const score = normalizeStatusScore(factorState.status?.[indicator.statusKey]);
          const currentStage = getFearGreedStage(score);
          const latest = series[series.length - 1] ?? null;
          const isImputed = factorState.status?.[indicator.imputedKey] === 1;

          return (
            <article
              key={indicator.title}
              className="grid gap-4 border-b border-neutral-200 px-0 py-5 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)] md:items-start xl:grid-cols-[88px_minmax(0,1fr)_430px_140px]"
            >
              <div className="flex items-center gap-3 px-4 md:block md:border-r md:border-neutral-200 md:px-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-700">{String(index + 1).padStart(2, '0')}</span>
                <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 md:mt-2 md:block">Indicator</span>
              </div>

              <div className="px-4 md:px-5">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-red-700">{indicator.eyebrow}</div>
                <h3 className="mt-1 text-xl font-black tracking-tight text-neutral-950 md:text-2xl">{indicator.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{indicator.body}</p>
                <p className="mt-3 text-sm font-bold leading-6 text-neutral-800">{indicator.interpretation(currentStage)}</p>
                {isImputed ? <p className="mt-2 text-[11px] font-bold text-neutral-400">일부 결측 보정 데이터가 포함된 지표입니다.</p> : null}
              </div>

              <div className="px-4 md:col-start-2 md:px-5 xl:col-start-auto">
                <FactorLineChart
                  title={indicator.title}
                  valueLabel={indicator.valueLabel}
                  comparisonLabel={indicator.comparisonLabel}
                  valueFormat={indicator.valueFormat}
                  series={series}
                  loading={factorState.loading}
                  error={factorState.error}
                />
              </div>

              <div className="px-4 md:col-start-2 md:px-5 md:text-right xl:col-start-auto">
                <div className="inline-flex min-w-28 flex-col items-center border border-neutral-900 px-3 py-2 text-neutral-950 md:items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">현재 상태</span>
                  <span className="mt-1 text-sm font-black">{currentStage}</span>
                  <span className="mt-1 text-2xl font-black leading-none">{score !== null ? score.toFixed(1) : '--'}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FactorLineChart({
  title,
  valueLabel,
  comparisonLabel,
  valueFormat,
  series,
  loading,
  error,
}: {
  title: string;
  valueLabel: string;
  comparisonLabel?: string;
  valueFormat: IndicatorConfig['valueFormat'];
  series: FactorPoint[];
  loading: boolean;
  error: string | null;
}) {
  const chart = useMemo(() => createLineChart(series), [series]);
  const latest = series[series.length - 1] ?? null;
  const firstDate = series[0]?.date ? formatShortDate(series[0].date) : '--';
  const lastDate = latest?.date ? formatShortDate(latest.date) : '--';

  if (loading && series.length === 0) {
    return <div className="flex h-[220px] items-center justify-center border border-neutral-200 bg-neutral-50 text-sm font-bold text-neutral-400">지표 차트 로딩 중</div>;
  }

  if (series.length < 2) {
    return (
      <div className="flex h-[220px] items-center justify-center border border-neutral-200 bg-neutral-50 px-4 text-center text-sm font-bold text-neutral-400">
        {error ?? 'GitHub 지표 데이터를 확인할 수 없습니다.'}
      </div>
    );
  }

  return (
    <div className="border border-neutral-300 bg-white p-4" aria-label={`${title} 지표 그래프`}>
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">Fear &amp; Greed Factor</div>
          <div className="mt-1 text-xs font-bold text-neutral-500">{valueLabel}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black leading-none text-neutral-950">{formatFactorValue(latest.value, valueFormat)}</div>
          <div className="mt-1 text-[10px] font-black text-neutral-500">{lastDate}</div>
        </div>
      </div>

      <svg viewBox="0 0 360 142" className="mt-3 h-36 w-full overflow-visible" role="img">
        <line x1="0" y1="18" x2="360" y2="18" stroke="#e5e5e5" strokeDasharray="3 3" />
        <line x1="0" y1="68" x2="360" y2="68" stroke="#e5e5e5" strokeDasharray="3 3" />
        <line x1="0" y1="118" x2="360" y2="118" stroke="#e5e5e5" strokeDasharray="3 3" />
        {chart.comparisonPoints ? (
          <polyline points={chart.comparisonPoints} fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
        ) : null}
        <polyline points={chart.points} fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={chart.latestX} cy={chart.latestY} r="4" fill="#111827" />
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-neutral-400">
        <span>{firstDate}</span>
        <span>최근 {series.length} 거래일</span>
        <span>{lastDate}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">
        <span className="inline-flex items-center gap-1"><span className="h-0.5 w-5 bg-neutral-950" />{valueLabel}</span>
        {comparisonLabel && chart.comparisonPoints ? <span className="inline-flex items-center gap-1"><span className="h-0.5 w-5 bg-red-700" />{comparisonLabel}</span> : null}
      </div>
    </div>
  );
}

async function fetchFactorStatus(): Promise<FactorStatus> {
  const response = await fetch(`${GITHUB_JSON_BASE}/factor_status.json`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`factor_status.json returned ${response.status}`);
  }
  return response.json() as Promise<FactorStatus>;
}

async function fetchFactorSeries(file: FactorFile): Promise<FactorPoint[]> {
  const response = await fetch(`${GITHUB_JSON_BASE}/${file}.json`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`${file}.json returned ${response.status}`);
  }

  const json = (await response.json()) as { data?: Array<{ x?: unknown; y?: unknown; z?: unknown }> };
  return (json.data ?? [])
    .map((point) => {
      if (typeof point.x !== 'string' || typeof point.y !== 'number' || !Number.isFinite(point.y)) {
        return null;
      }
      const parsedPoint: FactorPoint = {
        date: point.x,
        value: point.y,
      };
      if (typeof point.z === 'number' && Number.isFinite(point.z)) {
        parsedPoint.comparison = point.z;
      }
      return parsedPoint;
    })
    .filter((point): point is FactorPoint => point !== null);
}

function createLineChart(series: FactorPoint[]) {
  if (series.length === 0) {
    return { points: '', comparisonPoints: '', latestX: 0, latestY: 0 };
  }

  const values = series.flatMap((point) => (point.comparison === undefined ? [point.value] : [point.value, point.comparison]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = range * 0.12;
  const domainMin = min - pad;
  const domainMax = max + pad;
  const domain = domainMax - domainMin || 1;

  const toCoordinate = (value: number, index: number) => {
    const x = (index / Math.max(series.length - 1, 1)) * 348 + 6;
    const y = 126 - ((value - domainMin) / domain) * 116;
    return { x, y };
  };

  const coordinates = series.map((point, index) => toCoordinate(point.value, index));
  const comparisonCoordinates = series
    .map((point, index) => (point.comparison === undefined ? null : toCoordinate(point.comparison, index)))
    .filter((point): point is { x: number; y: number } => point !== null);
  const latest = coordinates[coordinates.length - 1];

  return {
    points: coordinates.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' '),
    comparisonPoints: comparisonCoordinates.length > 1 ? comparisonCoordinates.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ') : '',
    latestX: latest.x,
    latestY: latest.y,
  };
}

function normalizeStatusScore(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(100, value * 100));
}

function getFearGreedStage(score: number | null): FearGreedStage {
  if (score === null) return '중립';
  if (score < 20) return '극단적 공포';
  if (score < 40) return '공포';
  if (score < 60) return '중립';
  if (score < 80) return '탐욕';
  return '극단적 탐욕';
}

function formatFactorValue(value: number, format: IndicatorConfig['valueFormat']) {
  if (format === 'percent') {
    return `${value.toFixed(2)}%`;
  }
  if (format === 'ratio') {
    return value.toFixed(2);
  }
  if (format === 'index') {
    return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
  }
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function formatShortDate(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[2]}.${match[3]}` : date;
}
