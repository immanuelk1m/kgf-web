'use client';

import React from 'react';
import {
  getFearGreedStatusText,
  getFearGreedStatusTone,
  useFearGreedData,
} from '@/components/component/useFearGreedData';

const GAUGE_CENTER = { x: 160, y: 148 };
const GAUGE_RADIUS = 112;
const NEEDLE_RADIUS = 86;

const segments = [
  { label: '극단적 공포', from: 0, to: 20, color: '#b91c1c' },
  { label: '공포', from: 20, to: 40, color: '#ef4444' },
  { label: '중립', from: 40, to: 60, color: '#fbbf24' },
  { label: '탐욕', from: 60, to: 80, color: '#22c55e' },
  { label: '극단적 탐욕', from: 80, to: 100, color: '#047857' },
];

const GaugeChart: React.FC = () => {
  const fearGreed = useFearGreedData();
  const score = fearGreed.current;
  const safeScore = clamp(score ?? 50, 0, 100);
  const needlePoint = pointOnArc(valueToAngle(safeScore), NEEDLE_RADIUS);

  return (
    <div className="rounded-sm border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Fear & Greed Now</div>
          <div className="mt-1 text-sm text-neutral-500">코스피 시장 심리</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-4xl font-black tabular-nums tracking-tight text-neutral-950">
            {score !== null ? score.toFixed(1) : '--'}
          </div>
          <div className={`text-sm font-bold ${getFearGreedStatusTone(fearGreed.currentStatus)}`}>
            {getFearGreedStatusText(fearGreed.currentStatus)}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl" role="img" aria-label={`코스피 공포 탐욕 지수 ${score !== null ? score.toFixed(1) : '확인 중'}`}>
        <svg className="h-auto w-full" viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d={describeArc(0, 100)}
            stroke="#f1f1f1"
            strokeWidth="28"
            strokeLinecap="round"
          />

          {segments.map((segment) => (
            <path
              key={segment.label}
              d={describeArc(segment.from + 0.8, segment.to - 0.8)}
              stroke={segment.color}
              strokeWidth="28"
              strokeLinecap="butt"
            />
          ))}

          <line
            x1={GAUGE_CENTER.x}
            y1={GAUGE_CENTER.y}
            x2={needlePoint.x}
            y2={needlePoint.y}
            stroke="#111111"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx={GAUGE_CENTER.x} cy={GAUGE_CENTER.y} r="10" fill="#111111" />
          <circle cx={GAUGE_CENTER.x} cy={GAUGE_CENTER.y} r="4" fill="#ffffff" opacity="0.9" />

          <text x="42" y="176" textAnchor="middle" className="fill-neutral-500 text-[10px] font-bold">
            0
          </text>
          <text x="160" y="60" textAnchor="middle" className="fill-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            0 - 100
          </text>
          <text x="278" y="176" textAnchor="middle" className="fill-neutral-500 text-[10px] font-bold">
            100
          </text>
          <text x="160" y="178" textAnchor="middle" className="fill-neutral-950 text-[13px] font-black">
            {fearGreed.loading ? '업데이트 중' : '현재 지수'}
          </text>
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-px border-y border-neutral-200 bg-neutral-200 text-center text-[11px] font-bold text-neutral-600">
        {segments.map((segment) => (
          <span key={segment.label} className="bg-white px-1 py-3">
            {segment.label}
          </span>
        ))}
      </div>

      {fearGreed.error && (
        <p className="mt-5 border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-600">
          지표 데이터를 일시적으로 불러오지 못했습니다.
        </p>
      )}
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function valueToAngle(value: number) {
  return 180 - value * 1.8;
}

function pointOnArc(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: GAUGE_CENTER.x + radius * Math.cos(radians),
    y: GAUGE_CENTER.y - radius * Math.sin(radians),
  };
}

function describeArc(fromValue: number, toValue: number) {
  const start = pointOnArc(valueToAngle(fromValue), GAUGE_RADIUS);
  const end = pointOnArc(valueToAngle(toValue), GAUGE_RADIUS);
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

export default GaugeChart;
