import React from 'react';
import Header from '@/components/component/header';
import MarketDataComponent from '@/components/component/markettab';
import IndicatorCards from '@/components/component/indicator-cards';
import FaqSection from '@/components/component/faq-section';
import AdsenseSlot from '@/components/component/adsense-slot';
import OverviewTimelineTabs from '@/components/component/overview-timeline-tabs';

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
            <div className="grid gap-6">
              <OverviewTimelineTabs />
              <IndicatorCards />
              <FaqSection />
            </div>
          </section>

          <aside className="hidden w-[300px] shrink-0 flex-col gap-10 lg:flex">
            <AdsenseSlot slot="1773657493" className="border border-neutral-200 bg-white px-3 py-3" minHeight={250} />

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

export default App;
