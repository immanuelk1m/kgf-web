// src/components/component/stock-price-breadth-section.tsx
import React from 'react';
import Mccl from "@/components/component/linechart/mcclenllan";

interface FactorStatus {
  mcclenllan_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface StockPriceBreadthSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const StockPriceBreadthSection: React.FC<StockPriceBreadthSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.mcclenllan_scaled) : null;
  let breadthInterpretation = "";
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      breadthInterpretation = "시장의 매도 압력이 우세하거나 거래량이 감소하고 있음을 나타내며, 시장 전반의 약세를 시사할 수 있습니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      breadthInterpretation = "시장의 매수 압력이 강하거나 거래량이 증가하고 있음을 나타내며, 시장 전반의 강세를 시사할 수 있습니다.";
    } else {
      breadthInterpretation = "시장의 매수/매도 압력이 균형을 이루고 있거나, 거래량 추세가 중립적임을 나타낼 수 있습니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">주가 폭 (Stock Price Breadth)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">맥클렐런 거래량 합산 지수(McClellan Volume Summation Index)를 통해 시장의 매수/매도 강도를 분석합니다.</p>
            {breadthInterpretation && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 italic">
                {/* 아이콘 고려: 정보 아이콘 */}
                {breadthInterpretation}
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
            <Mccl />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
              맥클렐런 거래량 합산 지수는 상승 종목의 거래량과 하락 종목의 거래량 차이를 누적하여 시장의 전반적인 매수 또는 매도 압력을 측정합니다. 
              이 지수가 상승하면 매수세가 강하고 시장이 강세임을, 하락하면 매도세가 강하고 시장이 약세임을 나타냅니다. 
              지수의 극단적인 값은 시장의 과매수 또는 과매도 상태를 나타낼 수 있으며, 추세 전환의 신호로 해석되기도 합니다.
              공포 & 탐욕 지수는 이 지표가 하락(거래량 감소 또는 매도 압력 증가)할 때 '공포'로, 상승(거래량 증가 또는 매수 압력 증가)할 때 '탐욕'으로 해석하여 시장 심리를 반영합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPriceBreadthSection;