'use client';

import { useEffect, useSyncExternalStore } from 'react';

export type FearGreedStatus = '1' | '2' | '3' | '4' | '5' | string;

export type FearGreedSnapshot = {
  current: number | null;
  currentStatus: FearGreedStatus | null;
  week: number | null;
  weekStatus: FearGreedStatus | null;
  month: number | null;
  monthStatus: FearGreedStatus | null;
  year: number | null;
  yearStatus: FearGreedStatus | null;
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
};

type RawFearGreedData = {
  current?: number;
  current_s?: string;
  week?: number;
  week_s?: string;
  month?: number;
  month_s?: string;
  year?: number;
  year_s?: string;
};

const FEAR_GREED_URL = 'https://immanuelk1m.github.io/kospi-feargreedindex/assets/js/json/value.json';
const REFRESH_MS = 60_000;

let snapshot: FearGreedSnapshot = {
  current: null,
  currentStatus: null,
  week: null,
  weekStatus: null,
  month: null,
  monthStatus: null,
  year: null,
  yearStatus: null,
  loading: true,
  error: null,
  updatedAt: null,
};

let subscribers = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let inFlight: Promise<void> | null = null;

export function useFearGreedData() {
  useEffect(() => {
    ensureFearGreedPolling();
    return () => {
      if (subscribers.size === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getFearGreedStatusText(status: FearGreedStatus | null) {
  switch (status) {
    case '1': return '매우 공포';
    case '2': return '공포';
    case '3': return '중립';
    case '4': return '탐욕';
    case '5': return '매우 탐욕';
    default: return '확인 중';
  }
}

export function getFearGreedStatusTone(status: FearGreedStatus | null) {
  switch (status) {
    case '1': return 'text-red-700';
    case '2': return 'text-orange-600';
    case '3': return 'text-neutral-600';
    case '4': return 'text-emerald-600';
    case '5': return 'text-green-700';
    default: return 'text-neutral-500';
  }
}

export function getFearGreedStatusDescription(status: FearGreedStatus | null) {
  switch (status) {
    case '1': return '투자심리가 급격히 위축된 구간입니다.';
    case '2': return '방어적인 심리가 우세한 공포 구간입니다.';
    case '3': return '공포와 탐욕이 균형을 이루는 중립 구간입니다.';
    case '4': return '위험자산 선호가 강해지는 탐욕 구간입니다.';
    case '5': return '과열 가능성을 함께 점검해야 하는 매우 탐욕 구간입니다.';
    default: return '최신 지표를 불러오는 중입니다.';
  }
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  ensureFearGreedPolling();
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function ensureFearGreedPolling() {
  void fetchFearGreedData();
  if (!intervalId) {
    intervalId = setInterval(() => {
      void fetchFearGreedData();
    }, REFRESH_MS);
  }
}

async function fetchFearGreedData() {
  if (inFlight) {
    return inFlight;
  }

  snapshot = { ...snapshot, loading: snapshot.current === null, error: null };
  emit();

  inFlight = fetch(FEAR_GREED_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Fear & Greed source returned ${response.status}`);
      }
      return response.json() as Promise<RawFearGreedData>;
    })
    .then((data) => {
      snapshot = {
        current: toNullableNumber(data.current),
        currentStatus: data.current_s ?? null,
        week: toNullableNumber(data.week),
        weekStatus: data.week_s ?? null,
        month: toNullableNumber(data.month),
        monthStatus: data.month_s ?? null,
        year: toNullableNumber(data.year),
        yearStatus: data.year_s ?? null,
        loading: false,
        error: null,
        updatedAt: new Date().toISOString(),
      };
    })
    .catch((error) => {
      snapshot = {
        ...snapshot,
        loading: false,
        error: error instanceof Error ? error.message : 'Fear & Greed 데이터를 불러오지 못했습니다.',
      };
    })
    .finally(() => {
      inFlight = null;
      emit();
    });

  return inFlight;
}

function emit() {
  subscribers.forEach((callback) => callback());
}

function toNullableNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
