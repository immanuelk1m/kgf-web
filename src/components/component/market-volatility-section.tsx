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
  const currentStatus = factorStatus ? getStatus(factorStatus.vix_ema_spread_scaled) : null;
  let volatilityInterpretation = "";
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      volatilityInterpretation = "시장의 불확실성이 높아지고 투자자들의 불안감이 커지고 있음을 의미하며, 변동성 확대에 주의해야 합니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      volatilityInterpretation = "시장이 안정적인 상태를 보이거나 변동성이 낮은 수준을 유지하고 있음을 시사하며, 투자자들이 비교적 안도감을 느끼고 있을 수 있습니다.";
    } else {
      volatilityInterpretation = "시장의 변동성이 보통 수준이거나, 뚜렷한 방향성을 예측하기 어려움을 나타낼 수 있습니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">시장 변동성 (Market Volatility)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">VIX 지수와 50일 이동평균선을 통해 시장의 위험 수준과 투자자 심리를 파악합니다.</p>
            {volatilityInterpretation && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 italic">
                {/* 아이콘 고려: 정보 아이콘 */}
                {volatilityInterpretation}
              </p>
            )}
          </div>
          {currentStatus && (
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              currentStatus.text === '매우 나쁨' ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300' :
              currentStatus.text === '나쁨' ? 'bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300' :
              currentStatus.text === '보통' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300' :
              currentStatus.text === '좋음' ? 'bg-lime-100 text-lime-700 dark:bg-lime-700/30 dark:text-lime-300' :
              'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'
            }`}>
              {`${currentStatus.text} (${currentStatus.contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner">
            <Vixema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
              CBOE 변동성 지수(VIX)는 시장의 '공포 지수'로도 불리며, 향후 30일간 S&P 500 지수 옵션의 예상 변동성을 나타냅니다. (본 지표는 코스피 시장에 맞게 조정된 VIX를 사용합니다.)
              일반적으로 VIX 지수가 상승하면 시장의 불확실성과 위험이 커지고 투자자들의 공포 심리가 확산됨을 의미하며, 하락하면 시장이 안정되고 투자 심리가 낙관적임을 나타냅니다.
              공포 & 탐욕 지수는 VIX 지수가 상승(변동성 증가)할 때 '공포'로, 하락(변동성 감소)할 때 '탐욕'으로 해석하여 시장 심리를 반영합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketVolatilitySection;