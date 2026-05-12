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
          각 카드는 코스피 시장 심리를 해석할 때 참고할 수 있는 영역입니다. 실시간 산출값이 아닌 방법론 설명 카드로 제공됩니다.
        </p>
      </div>
      <div className="grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 md:grid-cols-2 xl:grid-cols-4">
        {indicators.map((indicator) => (
          <article key={indicator.title} className="bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-neutral-950">{indicator.title}</h3>
              <span className="border border-neutral-300 px-2 py-1 text-[11px] font-bold text-neutral-600">{indicator.status}</span>
            </div>
            <p className="mt-5 text-sm leading-6 text-neutral-600">{indicator.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
