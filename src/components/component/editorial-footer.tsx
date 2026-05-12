import React from 'react';
import BuyCoffee from '@/components/component/buycoff';

export default function EditorialFooter() {
  return (
    <section className="grid gap-6 border-t border-neutral-900 pt-5 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Market Notes</div>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">시장 해설과 참고하기</h2>
        <div className="mt-5 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 md:grid-cols-2">
          <article className="bg-white p-5">
            <h3 className="text-lg font-black text-neutral-950">지표는 방향보다 맥락입니다</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">공포와 탐욕의 변화는 가격 흐름, 환율, 변동성을 함께 보며 해석할 때 더 유용합니다.</p>
          </article>
          <article className="bg-white p-5">
            <h3 className="text-lg font-black text-neutral-950">데이터 지연 가능성</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">네이버 모바일 증권의 공개 페이지를 기준으로 하며, 표시 시점과 실제 시장 상황 사이에 지연이 있을 수 있습니다.</p>
          </article>
        </div>
        <p className="mt-5 text-xs leading-5 text-neutral-500">
          본 페이지는 투자 참고용 정보 제공을 목적으로 하며 특정 종목이나 금융상품의 매수·매도를 권유하지 않습니다. 투자 판단의 최종 책임은 투자자 본인에게 있습니다.
        </p>
      </div>
      <aside className="border border-neutral-200 bg-neutral-50 p-5">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">Support</div>
        <h3 className="mt-2 text-xl font-black text-neutral-950">프로젝트 후원하기</h3>
        <p className="mt-3 text-sm leading-6 text-neutral-600">코스피 시장 심리를 더 보기 쉽게 정리하는 작업을 응원해주세요.</p>
        <div className="mt-5">
          <BuyCoffee />
        </div>
      </aside>
    </section>
  );
}
