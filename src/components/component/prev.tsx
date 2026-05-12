'use client';

import React from 'react';
import {
  getFearGreedStatusText,
  getFearGreedStatusTone,
  useFearGreedData,
} from '@/components/component/useFearGreedData';

const PreviousIndexes: React.FC = () => {
  const data = useFearGreedData();
  const history = [
    { label: 'Previous close', korean: '전일 종가', value: data.current, status: data.currentStatus },
    { label: '1 week ago', korean: '1주 전', value: data.week, status: data.weekStatus },
    { label: '1 month ago', korean: '1개월 전', value: data.month, status: data.monthStatus },
    { label: '1 year ago', korean: '1년 전', value: data.year, status: data.yearStatus },
  ];

  return (
    <section className="grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 md:grid-cols-4">
      {history.map((item) => (
        <article key={item.label} className="bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">{item.label}</div>
          <div className="mt-1 text-sm font-semibold text-neutral-950">{item.korean}</div>
          <div className="mt-4 flex items-end justify-between gap-2">
            <span className="text-3xl font-black text-neutral-950">{item.value !== null ? item.value.toFixed(1) : '--'}</span>
            <span className={`pb-1 text-sm font-bold ${getFearGreedStatusTone(item.status)}`}>{getFearGreedStatusText(item.status)}</span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default PreviousIndexes;
