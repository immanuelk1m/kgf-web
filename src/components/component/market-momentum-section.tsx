// src/components/component/market-momentum-section.tsx
import React from 'react';
import Kospiema from "@/components/component/linechart/kospiema";

interface FactorStatus {
  ema_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface MarketMomentumSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string };
}

const MarketMomentumSection: React.FC<MarketMomentumSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">시장 모멘텀 (Market Momentum)</h2>
            <p className="text-gray-600 dark:text-gray-300">KOSPI와 125일 이동평균선</p>
          </div>
          {factorStatus && (
            <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.ema_spread_scaled).color }}>
              {getStatus(factorStatus.ema_spread_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <Kospiema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              코스피가 지난 125거래일의 이동 평균을 상회하면 긍정적인 모멘텀을 의미합니다. 반대로 이동 평균을 하회하면 투자자들이 불안해하고 있다는 신호입니다. 공포 & 탐욕 지수는 모멘텀이 둔화될 때 &apos;공포&apos; 신호로, 모멘텀이 증가할 때 &apos;탐욕&apos; 신호로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketMomentumSection;