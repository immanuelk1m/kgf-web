// src/components/component/market-volatility-section.tsx
import React from 'react';
import Vixema from "@/components/component/linechart/vixema";

interface FactorStatus {
  vix_ema_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface MarketVolatilitySectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const MarketVolatilitySection: React.FC<MarketVolatilitySectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">시장 변동성 (Market Volatility)</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">VIX와 VIX 50일 이동평균선</p>
          </div>
          {factorStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus(factorStatus.vix_ema_spread_scaled).text === '매우 나쁨' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              getStatus(factorStatus.vix_ema_spread_scaled).text === '나쁨' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              getStatus(factorStatus.vix_ema_spread_scaled).text === '보통' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              getStatus(factorStatus.vix_ema_spread_scaled).text === '좋음' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' // 매우 좋음
            }`}>
              {`${getStatus(factorStatus.vix_ema_spread_scaled).text} (${getStatus(factorStatus.vix_ema_spread_scaled).contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
            <Vixema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가 */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              가장 잘 알려진 시장 심리 지표는 CBOE 변동성 지수(VIX)입니다. VIX는 코스피 옵션의 30일간 예상 변동성을 측정하며, 시장이 상승할 때 하락하고, 시장이 급락할 때 급등하는 경향이 있습니다. 장기적으로 보면 강세장에서는 낮고, 약세장에서는 높아지는 특징이 있습니다. 공포 & 탐욕 지수는 변동성이 증가할 때 '공포' 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketVolatilitySection;