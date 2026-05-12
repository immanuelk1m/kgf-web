import React from 'react';

const fearGreedStages = [
  { label: '극단적 공포', color: 'bg-red-600', softColor: 'bg-red-50', textColor: 'text-red-700' },
  { label: '공포', color: 'bg-red-300', softColor: 'bg-red-50', textColor: 'text-red-700' },
  { label: '중립', color: 'bg-amber-300', softColor: 'bg-amber-50', textColor: 'text-amber-700' },
  { label: '탐욕', color: 'bg-emerald-300', softColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { label: '극단적 탐욕', color: 'bg-emerald-700', softColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
] as const;

type FearGreedStage = (typeof fearGreedStages)[number]['label'];

const indicators = [
  {
    title: '시장 모멘텀',
    body: '코스피가 최근 추세 대비 어느 위치에 있는지 살펴 시장의 방향성을 점검합니다.',
    values: [44, 48, 51, 49, 53, 56, 52, 55],
  },
  {
    title: '주가 강도',
    body: '상승 종목과 신고가 흐름을 통해 매수세의 폭과 강도를 해석합니다.',
    values: [38, 41, 45, 47, 46, 51, 54, 57],
  },
  {
    title: '시장 폭',
    body: '일부 대형주가 아닌 시장 전반으로 온기가 퍼지는지 확인합니다.',
    values: [52, 50, 49, 53, 55, 54, 51, 52],
  },
  {
    title: '옵션 심리',
    body: '방어적 포지션과 공격적 포지션의 균형을 심리 보조지표로 참고합니다.',
    values: [63, 60, 58, 55, 52, 49, 45, 43],
  },
  {
    title: '변동성',
    body: '변동성이 확대될수록 투자심리는 방어적으로 기울 가능성이 큽니다.',
    values: [59, 55, 49, 42, 36, 34, 38, 33],
  },
  {
    title: '안전자산 선호',
    body: '환율과 안전자산 선호 흐름을 함께 보며 위험 회피 심리를 추적합니다.',
    values: [47, 45, 48, 52, 50, 46, 44, 41],
  },
  {
    title: '신용/위험자산 선호',
    body: '위험자산 선호가 과열인지 위축인지 판단하기 위한 참고 영역입니다.',
    values: [45, 47, 50, 52, 51, 54, 53, 52],
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
              className="grid gap-4 border-b border-neutral-200 px-0 py-5 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)] md:items-start lg:grid-cols-[88px_minmax(0,1fr)_360px_126px]"
            >
              <div className="flex items-center gap-3 px-4 md:block md:border-r md:border-neutral-200 md:px-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-700">{String(index + 1).padStart(2, '0')}</span>
                <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 md:mt-2 md:block">Indicator</span>
              </div>

              <div className="px-4 md:px-5">
                <h3 className="text-xl font-black tracking-tight text-neutral-950 md:text-2xl">{indicator.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{indicator.body}</p>
              </div>

              <div className="px-4 md:col-start-2 md:px-5 lg:col-start-auto">
                <IndicatorBenchmarkChart title={indicator.title} values={indicator.values} currentStage={currentStage} />
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

function IndicatorBenchmarkChart({
  title,
  values,
  currentStage,
}: {
  title: string;
  values: number[];
  currentStage: FearGreedStage;
}) {
  const lastValue = values[values.length - 1];
  const markerPosition = `clamp(8px, ${clampScore(lastValue)}%, calc(100% - 8px))`;

  return (
    <div className="border border-neutral-300 bg-white p-4" aria-label={`${title} 지표 그래프`}>
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">KOSPI 지수 분석</div>
          <div className="mt-1 text-xs font-bold text-neutral-500">Fear &amp; Greed Scale</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black leading-none text-neutral-950">{lastValue}</div>
          <div className="mt-1 text-[10px] font-black text-neutral-500">현재값</div>
        </div>
      </div>

      <div className="pt-5">
        <div className="relative pb-7">
          <div className="grid h-8 grid-cols-5 overflow-hidden border border-neutral-900 bg-neutral-100">
            {fearGreedStages.map((stage) => (
              <div key={stage.label} className={`border-r border-white last:border-r-0 ${stage.color}`} aria-hidden="true" />
            ))}
          </div>

          <div className="absolute top-[-8px] flex -translate-x-1/2 flex-col items-center" style={{ left: markerPosition }}>
            <span className="h-12 border-l-2 border-neutral-950" />
            <span className="mt-1 h-2 w-2 rotate-45 bg-neutral-950" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-black leading-3 text-neutral-500">
          {fearGreedStages.map((stage) => {
            const isActive = stage.label === currentStage;

            return (
              <span
                key={stage.label}
                className={`break-keep border px-1.5 py-1.5 ${
                  isActive
                    ? `border-neutral-900 ${stage.softColor} ${stage.textColor}`
                    : 'border-transparent text-neutral-400'
                }`}
              >
                {stage.label}
              </span>
            );
          })}
        </div>
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

function clampScore(value: number) {
  return Math.min(100, Math.max(0, value));
}
