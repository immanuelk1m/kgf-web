// src/components/component/market-momentum-section.tsx
import React from 'react';
import Kospiema from "@/components/component/linechart/kospiema";

interface FactorStatus {
  ema_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface MarketMomentumSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const MarketMomentumSection: React.FC<MarketMomentumSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">시장 모멘텀 (Market Momentum)</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">KOSPI와 125일 이동평균선</p>
          </div>
          {factorStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus(factorStatus.ema_spread_scaled).text === '매우 나쁨' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              getStatus(factorStatus.ema_spread_scaled).text === '나쁨' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              getStatus(factorStatus.ema_spread_scaled).text === '보통' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              getStatus(factorStatus.ema_spread_scaled).text === '좋음' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' // 매우 좋음
            }`}>
              {`${getStatus(factorStatus.ema_spread_scaled).text} (${getStatus(factorStatus.ema_spread_scaled).contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
            <Kospiema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가 */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              코스피가 지난 <span title="과거 125일 동안의 종가 평균입니다. 추세 파악에 사용됩니다.">125거래일의 이동 평균</span>을 상회하면 긍정적인 모멘텀을 의미합니다. 반대로 이동 평균을 하회하면 투자자들이 불안해하고 있다는 신호입니다. 공포 & 탐욕 지수는 모멘텀이 둔화될 때 &apos;공포&apos; 신호로, 모멘텀이 증가할 때 &apos;탐욕&apos; 신호로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketMomentumSection;