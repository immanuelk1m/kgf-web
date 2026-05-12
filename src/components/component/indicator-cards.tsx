import React from 'react';

const indicators = [
  { title: '시장 모멘텀', status: '중립', body: '코스피가 최근 추세 대비 어느 위치에 있는지 살펴 시장의 방향성을 점검합니다.' },
  { title: '주가 강도', status: '관찰', body: '상승 종목과 신고가 흐름을 통해 매수세의 폭과 강도를 해석합니다.' },
  { title: '시장 폭', status: '중립', body: '일부 대형주가 아닌 시장 전반으로 온기가 퍼지는지 확인합니다.' },
  { title: '옵션 심리', status: '주의', body: '방어적 포지션과 공격적 포지션의 균형을 심리 보조지표로 참고합니다.' },
  { title: '변동성', status: '공포', body: '변동성이 확대될수록 투자심리는 방어적으로 기울 가능성이 큽니다.' },
  { title: '안전자산 선호', status: '관찰', body: '환율과 안전자산 선호 흐름을 함께 보며 위험 회피 심리를 추적합니다.' },
  { title: '신용/위험자산 선호', status: '중립', body: '위험자산 선호가 과열인지 위축인지 판단하기 위한 참고 영역입니다.' },
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
        {indicators.map((indicator, index) => (
          <article
            key={indicator.title}
            className="grid gap-4 border-b border-neutral-200 px-0 py-5 last:border-b-0 md:grid-cols-[88px_minmax(0,1fr)_160px] md:items-start"
          >
            <div className="flex items-center gap-3 px-4 md:block md:border-r md:border-neutral-200 md:px-5">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-red-700">{String(index + 1).padStart(2, '0')}</span>
              <span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 md:mt-2 md:block">Indicator</span>
            </div>

            <div className="px-4 md:px-5">
              <h3 className="text-xl font-black tracking-tight text-neutral-950 md:text-2xl">{indicator.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{indicator.body}</p>
            </div>

            <div className="px-4 md:px-5 md:text-right">
              <span className="inline-flex min-w-20 justify-center border border-neutral-900 px-3 py-2 text-xs font-black text-neutral-950">
                {indicator.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
