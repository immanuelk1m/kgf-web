import React from 'react';

const fearGreedStages = ['극단적 공포', '공포', '중립', '탐욕', '극단적 탐욕'] as const;

type FearGreedStage = (typeof fearGreedStages)[number];

const indicators = [
  {
    title: '시장 모멘텀',
    body: '코스피가 최근 추세 대비 어느 위치에 있는지 살펴 시장의 방향성을 점검합니다.',
    values: [44, 48, 51, 49, 53, 56, 52, 55],
    color: '#111827',
  },
  {
    title: '주가 강도',
    body: '상승 종목과 신고가 흐름을 통해 매수세의 폭과 강도를 해석합니다.',
    values: [38, 41, 45, 47, 46, 51, 54, 57],
    color: '#b91c1c',
  },
  {
    title: '시장 폭',
    body: '일부 대형주가 아닌 시장 전반으로 온기가 퍼지는지 확인합니다.',
    values: [52, 50, 49, 53, 55, 54, 51, 52],
    color: '#525252',
  },
  {
    title: '옵션 심리',
    body: '방어적 포지션과 공격적 포지션의 균형을 심리 보조지표로 참고합니다.',
    values: [63, 60, 58, 55, 52, 49, 45, 43],
    color: '#f59e0b',
  },
  {
    title: '변동성',
    body: '변동성이 확대될수록 투자심리는 방어적으로 기울 가능성이 큽니다.',
    values: [59, 55, 49, 42, 36, 34, 38, 33],
    color: '#dc2626',
  },
  {
    title: '안전자산 선호',
    body: '환율과 안전자산 선호 흐름을 함께 보며 위험 회피 심리를 추적합니다.',
    values: [47, 45, 48, 52, 50, 46, 44, 41],
    color: '#2563eb',
  },
  {
    title: '신용/위험자산 선호',
    body: '위험자산 선호가 과열인지 위축인지 판단하기 위한 참고 영역입니다.',
    values: [45, 47, 50, 52, 51, 54, 53, 52],
    color: '#047857',
  },
];

export default function IndicatorCards() {
  return (
    <section className="border-t border-neutral-900 pt-5">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Seven Indicators</div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">7가지 공포 & 탐욕 지표</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">
          벤치마크 사이트처럼 각 지표를 카드 덩어리보다 선명한 아웃라인 행으로 분리해 읽는 순서와 비교가 바로 보이도록 정리했습니다.
        </p>
      </div>

      <div className="border-y border-neutral-900 bg-white">
        {indicators.map((indicator, index) => {
          const currentStage = getFearGreedStage(indicator.values[indicator.values.length - 1]);

          return (
            <article
              key={indicator.title}
              className="grid gap-4 border-b border-neutral-200 px-0 py-5 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)_260px_120px] md:items-start"
            >
              <div className="flex items-center gap-3 px-4 md:block md:border-r md:border-neutral-200 md:px-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-700">{String(index + 1).padStart(2, '0')}</span>
                <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 md:mt-2 md:block">Indicator</span>
              </div>

              <div className="px-4 md:px-5">
                <h3 className="text-xl font-black tracking-tight text-neutral-950 md:text-2xl">{indicator.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{indicator.body}</p>
              </div>

              <div className="px-4 md:px-5">
                <IndicatorSparkline title={indicator.title} values={indicator.values} color={indicator.color} currentStage={currentStage} />
              </div>

              <div className="px-4 md:px-5 md:text-right">
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

function IndicatorSparkline({
  title,
  values,
  color,
  currentStage,
}: {
  title: string;
  values: number[];
  color: string;
  currentStage: FearGreedStage;
}) {
  const points = toSparklinePoints(values);
  const lastValue = values[values.length - 1];

  return (
    <div className="border border-neutral-200 bg-neutral-50 p-3" aria-label={`${title} 지표 그래프`}>
      <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">
        <span>KOSPI 지수 분석</span>
        <span>{lastValue}</span>
      </div>
      <svg viewBox="0 0 220 88" className="h-24 w-full" role="img">
        <line x1="0" y1="18" x2="220" y2="18" stroke="#e5e5e5" strokeDasharray="3 3" />
        <line x1="0" y1="44" x2="220" y2="44" stroke="#e5e5e5" strokeDasharray="3 3" />
        <line x1="0" y1="70" x2="220" y2="70" stroke="#e5e5e5" strokeDasharray="3 3" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="214" cy={valueToSparklineY(lastValue)} r="4" fill={color} />
      </svg>
      <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-bold leading-3 text-neutral-400">
        {fearGreedStages.map((stage) => (
          <span
            key={stage}
            className={`break-keep px-0.5 py-1 ${
              stage === currentStage ? 'bg-white text-neutral-950 ring-1 ring-neutral-200' : ''
            }`}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}

function getFearGreedStage(value: number): FearGreedStage {
  if (value < 20) return '극단적 공포';
  if (value < 40) return '공포';
  if (value < 60) return '중립';
  if (value < 80) return '탐욕';
  return '극단적 탐욕';
}

function toSparklinePoints(values: number[]) {
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 208 + 6;
      return `${x.toFixed(1)},${valueToSparklineY(value).toFixed(1)}`;
    })
    .join(' ');
}

function valueToSparklineY(value: number) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return 80 - (clampedValue / 100) * 72;
}
