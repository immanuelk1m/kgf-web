'use client';

import React from 'react';
import {
  getFearGreedStatusText,
  getFearGreedStatusTone,
  useFearGreedData,
} from '@/components/component/useFearGreedData';

const GaugeChart: React.FC = () => {
  const fearGreed = useFearGreedData();
  const score = fearGreed.current;
  const safeScore = score ?? 50;
  const rotation = -90 + (Math.min(100, Math.max(0, safeScore)) / 100) * 180;

  return (
    <div className="rounded-sm border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Fear & Greed Now</div>
          <div className="mt-1 text-sm text-neutral-500">코스피 시장 심리</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black tracking-tight text-neutral-950">{score !== null ? score.toFixed(1) : '--'}</div>
          <div className={`text-sm font-bold ${getFearGreedStatusTone(fearGreed.currentStatus)}`}>
            {getFearGreedStatusText(fearGreed.currentStatus)}
          </div>
        </div>
      </div>

      <div className="relative mx-auto h-60 max-w-xl overflow-hidden pt-3">
        <div className="absolute inset-x-0 bottom-0 mx-auto h-56 w-56 rounded-full border-[26px] border-neutral-100 sm:h-72 sm:w-72" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-56 w-56 rounded-full border-[26px] border-transparent border-t-red-700 border-l-red-600 sm:h-72 sm:w-72" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-56 w-56 rounded-full border-[26px] border-transparent border-t-yellow-400 sm:h-72 sm:w-72" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-56 w-56 rounded-full border-[26px] border-transparent border-r-emerald-600 sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 left-1/2 h-1 w-28 origin-left rounded-full bg-neutral-950 transition-transform duration-700 sm:w-36" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="absolute bottom-[-7px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-neutral-950" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">0 - 100</div>
          <div className="mt-1 text-sm font-semibold text-neutral-700">{fearGreed.loading ? '업데이트 중' : '현재 지수'}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1 text-center text-[11px] font-bold text-neutral-500">
        <span>극단적 공포</span>
        <span>공포</span>
        <span>중립</span>
        <span>탐욕</span>
        <span>극단적 탐욕</span>
      </div>

      {fearGreed.error && (
        <p className="mt-5 border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-600">
          지표 데이터를 일시적으로 불러오지 못했습니다.
        </p>
      )}
    </div>
  );
};

export default GaugeChart;
