import React from 'react';

const faqs = [
  {
    question: '코스피 공포 & 탐욕 지수는 무엇인가요?',
    answer: '코스피 시장의 가격 흐름과 심리 지표를 0부터 100 사이의 값으로 재해석해 투자심리의 온도를 보여주는 참고 지표입니다.',
  },
  {
    question: '점수는 어떻게 해석하나요?',
    answer: '낮은 점수는 공포, 높은 점수는 탐욕에 가까운 심리를 뜻합니다. 극단 구간에서는 반대 방향의 리스크도 함께 점검해야 합니다.',
  },
  {
    question: '시장 데이터는 어디에서 오나요?',
    answer: '상단 시장 요약의 코스피, 코스닥, 원/달러 값은 네이버 모바일 증권 페이지를 서버에서 짧게 캐시해 표시합니다.',
  },
  {
    question: '투자 판단에 바로 사용해도 되나요?',
    answer: '이 페이지는 시장 분위기를 빠르게 파악하기 위한 참고용입니다. 투자 판단의 최종 책임은 투자자 본인에게 있습니다.',
  },
];

export default function FaqSection() {
  return (
    <section className="border-t border-neutral-900 pt-5">
      <div className="mb-5">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">FAQ</div>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">자주 묻는 질문</h2>
      </div>
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {faqs.map((faq) => (
          <article key={faq.question} className="grid gap-3 py-5 md:grid-cols-[280px_1fr] md:gap-8">
            <h3 className="text-base font-black text-neutral-950">{faq.question}</h3>
            <p className="text-sm leading-6 text-neutral-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
