import React from 'react';
import Header from '@/components/component/header';
import GaugeChart from '@/components/component/gauge';
import KospiVsFearGreedIndex from '@/components/component/kospivsindex';
import PreviousIndexes from '@/components/component/prev';
import MarketDataComponent from '@/components/component/markettab';
import IndicatorCards from '@/components/component/indicator-cards';
import FaqSection from '@/components/component/faq-section';
import AdsenseSlot from '@/components/component/adsense-slot';

function App() {
  return (
    <>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-3 lg:px-8">
          <AdsenseSlot slot="1773657493" className="border border-neutral-200 bg-white px-3 py-3" minHeight={90} />
        </div>
      </section>
      <Header />
      <MarketDataComponent />

      <main className="bg-white">
        <section className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-10 lg:px-8 lg:py-8">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.05em] text-neutral-950 md:text-7xl">
              코스피 공포 & 탐욕 지수
            </h1>
            <p className="mt-4 text-base leading-7 text-neutral-700 md:text-lg">
              지금 코스피 시장을 움직이는 감정은 무엇인가요?
              <br className="hidden sm:block" />
              <a href="#fng-faq" className="font-bold text-neutral-950 underline decoration-neutral-400 underline-offset-4">
                지수 산정 방식 보기
              </a>
            </p>
          </div>
          <AdsenseSlot slot="1773657493" className="border border-neutral-200 bg-white px-3 py-3" minHeight={90} />
        </section>

        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 border-t border-neutral-200 px-4 py-8 lg:flex-row lg:gap-10 lg:px-8 xl:gap-[50px]">
          <section className="min-w-0 lg:w-[calc(100%-340px)] xl:w-[calc(100%-350px)]">
            <div className="mb-6 flex w-fit border border-neutral-300 bg-white text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
              <span className="border-r border-neutral-300 bg-neutral-950 px-4 py-2 text-white">Overview</span>
              <a href="#timeline" className="px-4 py-2 hover:bg-neutral-100">
                Timeline
              </a>
            </div>

            <div className="grid gap-6">
              <GaugeChart />

              <section>
                <div className="mb-4 border-t border-neutral-900 pt-5">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Previous readings</div>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">이전 지수와 심리 변화</h2>
                </div>
                <PreviousIndexes />
              </section>

              <section id="timeline" className="border-t border-neutral-900 pt-5">
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
            </div>
          </section>

          <aside className="hidden w-[300px] shrink-0 flex-col gap-10 lg:flex">
            <section className="border-t border-neutral-900 pt-4">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-neutral-950">Quote Lookup</h2>
              <label className="mt-4 flex border border-neutral-300 bg-white">
                <span className="sr-only">시장 검색</span>
                <input className="min-w-0 flex-1 px-3 py-3 text-sm outline-none" placeholder="종목 또는 지수 검색" />
                <span className="flex w-11 items-center justify-center border-l border-neutral-300 text-neutral-500">⌕</span>
              </label>
            </section>

            <AdsenseSlot slot="1773657493" className="border border-neutral-200 bg-white px-3 py-3" minHeight={250} />

            <section className="border-t border-neutral-900 pt-4">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-neutral-950">Latest Fear & Greed</h2>
              <div className="mt-4 grid gap-4">
                {railItems.map((item) => (
                  <article key={item.title} className="border-b border-neutral-200 pb-4 last:border-b-0">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-red-700">{item.eyebrow}</div>
                    <h3 className="mt-1 text-base font-black leading-6 tracking-tight text-neutral-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-neutral-900 pt-4">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-neutral-950">Scale</h2>
              <div className="mt-4 grid gap-2 text-sm text-neutral-700">
                {scaleRows.map((row) => (
                  <div key={row.label} className="flex justify-between border-b border-neutral-100 pb-2 last:border-b-0">
                    <span>{row.range}</span>
                    <strong>{row.label}</strong>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}

const scaleRows = [
  { range: '0 - 20', label: '극단적 공포' },
  { range: '20 - 40', label: '공포' },
  { range: '40 - 60', label: '중립' },
  { range: '60 - 80', label: '탐욕' },
  { range: '80 - 100', label: '극단적 탐욕' },
];

const railItems = [
  {
    eyebrow: 'Reading',
    title: '시장 심리는 가격보다 먼저 흔들립니다',
    description: '단기 지표는 방향성 예측보다 리스크 점검 신호로 읽는 것이 안전합니다.',
  },
  {
    eyebrow: 'Data',
    title: '네이버 증권 기준 지표를 30~60초 단위로 갱신',
    description: '코스피·코스닥·원/달러 흐름과 공포·탐욕 점수를 같은 화면에서 확인합니다.',
  },
  {
    eyebrow: 'Method',
    title: '여러 시장 신호를 0~100 구간으로 정규화',
    description: '극단 구간은 과열이나 위축 가능성을 함께 점검해야 하는 구간입니다.',
  },
];

export default App;
