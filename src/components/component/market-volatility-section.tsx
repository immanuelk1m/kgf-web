// src/components/component/market-volatility-section.tsx
import React from 'react';
import Vixema from "@/components/component/linechart/vixema";

interface FactorStatus {
  vix_ema_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface MarketVolatilitySectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string };
}

const MarketVolatilitySection: React.FC<MarketVolatilitySectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">시장 변동성 (Market Volatility)</h2>
            <p className="text-gray-600 dark:text-gray-300">VIX와 VIX 50일 이동평균선</p>
          </div>
          {factorStatus && (
            <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.vix_ema_spread_scaled).color }}>
              {getStatus(factorStatus.vix_ema_spread_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <Vixema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              가장 잘 알려진 시장 심리 지표는 CBOE 변동성 지수(VIX)입니다. VIX는 코스피 옵션의 30일간 예상 변동성을 측정하며, 시장이 상승할 때 하락하고, 시장이 급락할 때 급등하는 경향이 있습니다. 장기적으로 보면 강세장에서는 낮고, 약세장에서는 높아지는 특징이 있습니다. 공포 & 탐욕 지수는 변동성이 증가할 때 &apos;공포&apos; 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketVolatilitySection;