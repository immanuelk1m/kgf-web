'use client';

import React, { useEffect, useState } from 'react';
import { getFearGreedStatusText, useFearGreedData } from '@/components/component/useFearGreedData';
import type { MarketDataResponse, MarketItem } from '@/lib/market-data';

type MarketState = {
  items: MarketDataResponse['items'] | null;
  loading: boolean;
  error: string | null;
  generatedAt: string | null;
};

const labels: Array<keyof NonNullable<MarketState['items']>> = ['kospi', 'kosdaq', 'usdkrw'];

const MarketDataComponent = () => {
  const [marketState, setMarketState] = useState<MarketState>({
    items: null,
    loading: true,
    error: null,
    generatedAt: null,
  });
  const fearGreed = useFearGreedData();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setMarketState((previous) => ({ ...previous, loading: previous.items === null, error: null }));
      try {
        const response = await fetch('/api/market-data', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`market API returned ${response.status}`);
        }
        const data = (await response.json()) as MarketDataResponse;
        if (!cancelled) {
          setMarketState({ items: data.items, loading: false, error: null, generatedAt: data.generatedAt });
        }
      } catch (error) {
        if (!cancelled) {
          setMarketState((previous) => ({
            ...previous,
            loading: false,
            error: error instanceof Error ? error.message : '시장 데이터를 불러오지 못했습니다.',
          }));
        }
      }
    };

    void fetchData();
    const interval = setInterval(fetchData, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-px bg-neutral-200 px-4 py-px sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {labels.map((key) => (
          <MarketTile key={key} item={marketState.items?.[key] ?? null} loading={marketState.loading} />
        ))}
        <article className="bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">Fear & Greed</div>
              <div className="mt-1 text-sm font-bold text-neutral-950">코스피 공포탐욕지수</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-neutral-950">{fearGreed.current !== null ? fearGreed.current.toFixed(1) : '--'}</div>
              <div className="text-xs font-semibold text-neutral-500">{getFearGreedStatusText(fearGreed.currentStatus)}</div>
            </div>
          </div>
        </article>
      </div>
      <div className="mx-auto flex max-w-[1440px] justify-end px-4 py-2 text-[11px] text-neutral-500 lg:px-8">
        <span>{marketState.error ? '일부 데이터 확인 불가' : formatUpdatedAt(marketState.generatedAt)}</span>
      </div>
    </section>
  );
};

function MarketTile({ item, loading }: { item: MarketItem | null; loading: boolean }) {
  const directionClass = item?.direction === 'up' ? 'text-red-600' : item?.direction === 'down' ? 'text-blue-600' : 'text-neutral-500';
  const arrow = item?.direction === 'up' ? '▲' : item?.direction === 'down' ? '▼' : '—';

  return (
    <article className="bg-white p-4">
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">Markets</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-neutral-950">{item?.label ?? '시장 지표'}</h3>
        <span className="text-[11px] text-neutral-400">{item?.timestampText ?? (loading ? '로딩 중' : '확인 불가')}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-2xl font-black tracking-tight text-neutral-950">{item?.valueText ?? '--'}</span>
        <span className={`text-sm font-bold ${directionClass}`}>{item?.error ? '확인 불가' : `${arrow} ${item?.changePercentText ?? '--'}`}</span>
      </div>
    </article>
  );
}

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return '업데이트 확인 중';
  }
  return `업데이트 ${new Date(value).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default MarketDataComponent;
