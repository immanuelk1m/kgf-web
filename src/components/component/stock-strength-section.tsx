// src/components/component/stock-strength-section.tsx
import React from 'react';
import StockStrength from "@/components/component/linechart/stockstrength";

interface FactorStatus {
  stock_strength_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface StockStrengthSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const StockStrengthSection: React.FC<StockStrengthSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus && factorStatus.stock_strength_scaled !== undefined ? getStatus(factorStatus.stock_strength_scaled) : null;
  let strengthInterpretation = "";
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      strengthInterpretation = "시장의 전반적인 힘이 약해지고 있음을 나타내며, 개별 주식에 대한 투자 심리가 위축될 수 있습니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      strengthInterpretation = "시장의 전반적인 힘이 강해지고 있음을 나타내며, 개별 주식에 대한 긍정적인 투자 심리가 확산될 수 있습니다.";
    } else {
      strengthInterpretation = "시장의 힘이 중립적인 상태이거나, 특정 방향으로의 뚜렷한 움직임이 없음을 시사합니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">주식 강도 (Stock Strength)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">52주 신고가와 신저가를 기록하는 주식 수를 비교하여 시장의 내재적인 힘을 측정합니다.</p>
            {strengthInterpretation && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">
                {/* 아이콘 고려: 정보 아이콘 */}
                {strengthInterpretation}
              </p>
            )}
          </div>
          {currentStatus && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${currentStatus.className}`}>
              {`${currentStatus.text} (${currentStatus.contribution})`} {/* 기여도 텍스트 추가 */}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner">
            <StockStrength />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              주식 강도는 시장에서 52주 신고가를 기록하는 주식 수와 52주 신저가를 기록하는 주식 수의 차이를 통해 시장의 내재적인 힘을 측정합니다. 
              신고가 종목이 많을수록 시장 에너지가 강하고 투자자들의 심리가 긍정적임을, 신저가 종목이 많을수록 그 반대를 의미합니다. 
              이 지표는 시장의 전반적인 건강 상태와 추세 전환 가능성을 파악하는 데 사용됩니다.
              공포 & 탐욕 지수는 주식 강도가 약화될 때 '공포'로, 강화될 때 '탐욕'으로 해석하여 시장 심리를 반영합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockStrengthSection;