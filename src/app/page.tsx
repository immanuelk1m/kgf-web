import React from 'react';
import Header from '@/components/component/header';
import GaugeChart from '@/components/component/gauge';
import KospiVsFearGreedIndex from '@/components/component/kospivsindex';
import PreviousIndexes from '@/components/component/prev';
import MarketDataComponent from '@/components/component/markettab';
import IndicatorCards from '@/components/component/indicator-cards';
import FaqSection from '@/components/component/faq-section';
import EditorialFooter from '@/components/component/editorial-footer';

function App() {
  return (
    <>
      <Header />
      <MarketDataComponent />

      <main className="bg-[#f7f7f7]">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-6 lg:py-12">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">Overview</div>
              <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] text-neutral-950 md:text-7xl">
                코스피 공포 & 탐욕 지수
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
                미국 시장의 공포·탐욕 지수 구조를 참고해 코스피 시장 흐름에 맞게 재해석한 투자심리 대시보드입니다.
              </p>
              <div className="mt-8">
                <GaugeChart />
              </div>
            </div>
            <aside className="border-l-0 border-neutral-200 lg:border-l lg:pl-8">
              <div className="border-t border-neutral-900 pt-4">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">How to read</div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-neutral-950">지수가 말하는 시장 온도</h2>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  0에 가까울수록 공포, 100에 가까울수록 탐욕을 뜻합니다. 극단 구간은 방향성 신호가 아니라 리스크를 다시 점검하라는 경고로 해석하는 것이 좋습니다.
                </p>
              </div>
              <div className="mt-8 border-t border-neutral-200 pt-5">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-neutral-500">Scale</h3>
                <div className="mt-4 grid gap-2 text-sm text-neutral-700">
                  <div className="flex justify-between border-b border-neutral-100 pb-2"><span>0 - 20</span><strong>극단적 공포</strong></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2"><span>20 - 40</span><strong>공포</strong></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2"><span>40 - 60</span><strong>중립</strong></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2"><span>60 - 80</span><strong>탐욕</strong></div>
                  <div className="flex justify-between"><span>80 - 100</span><strong>극단적 탐욕</strong></div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 lg:px-6 lg:py-12">
          <section>
            <div className="mb-4 flex items-end justify-between border-t border-neutral-900 pt-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Previous readings</div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">이전 지수와 심리 변화</h2>
              </div>
            </div>
            <PreviousIndexes />
          </section>

          <section className="border-t border-neutral-900 pt-5">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Timeline</div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">코스피와 공포·탐욕 추이</h2>
              </div>
              <div className="flex w-fit border border-neutral-300 bg-white text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
                <span className="border-r border-neutral-300 bg-neutral-950 px-3 py-2 text-white">Overview</span>
                <span className="px-3 py-2">60 days</span>
              </div>
            </div>
            <div className="border border-neutral-200 bg-white p-3 md:p-5">
              <KospiVsFearGreedIndex />
            </div>
          </section>

          <IndicatorCards />
          <FaqSection />
          <EditorialFooter />
        </div>
      </main>
    </>
  );
}

export default App;
