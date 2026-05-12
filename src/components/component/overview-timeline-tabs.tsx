'use client';

import React, { useState } from 'react';
import GaugeChart from '@/components/component/gauge';
import KospiVsFearGreedIndex from '@/components/component/kospivsindex';
import PreviousIndexes from '@/components/component/prev';

type ActiveTab = 'overview' | 'timeline';

export default function OverviewTimelineTabs() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <section>
      <div className="mb-6 flex w-fit border border-neutral-300 bg-white text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
        <button
          type="button"
          aria-pressed={activeTab === 'overview'}
          className={`border-r border-neutral-300 px-4 py-2 ${activeTab === 'overview' ? 'bg-neutral-950 text-white' : 'hover:bg-neutral-100'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'timeline'}
          className={`px-4 py-2 ${activeTab === 'timeline' ? 'bg-neutral-950 text-white' : 'hover:bg-neutral-100'}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid gap-6">
          <GaugeChart />

          <section>
            <div className="mb-4 border-t border-neutral-900 pt-5">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Previous readings</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">이전 지수와 심리 변화</h2>
            </div>
            <PreviousIndexes />
          </section>
        </div>
      ) : (
        <section className="border-t border-neutral-900 pt-5">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Timeline</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">코스피와 공포·탐욕 추이</h2>
            </div>
            <div className="flex w-fit border border-neutral-300 bg-white text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
              <span className="border-r border-neutral-300 bg-neutral-950 px-3 py-2 text-white">Timeline</span>
              <span className="px-3 py-2">60 days</span>
            </div>
          </div>
          <div className="border border-neutral-200 bg-white p-3 md:p-5">
            <KospiVsFearGreedIndex />
          </div>
        </section>
      )}
    </section>
  );
}
