// src/components/component/safe-haven-demand-section.tsx
import React from 'react';
import Safeb from "@/components/component/linechart/safebond";

interface FactorStatus {
  safe_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface SafeHavenDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const SafeHavenDemandSection: React.FC<SafeHavenDemandSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.safe_spread_scaled) : null;
  let safeHavenInterpretation = "";
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      safeHavenInterpretation = "투자자들이 위험 자산인 주식보다 안전 자산인 채권을 더 선호하고 있음을 나타내며, 시장의 불안 심리가 반영된 결과일 수 있습니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      safeHavenInterpretation = "투자자들이 안전 자산인 채권보다 위험 자산인 주식에 대한 선호도가 높음을 나타내며, 시장에 대한 낙관적인 전망이 우세할 수 있습니다.";
    } else {
      safeHavenInterpretation = "주식과 채권에 대한 투자자들의 선호도가 균형을 이루고 있거나, 뚜렷한 방향성이 없음을 시사합니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">안전 자산 선호도 (Safe Haven Demand)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">지난 20일간 주식 대비 채권의 상대적 수익률을 통해 시장의 위험 회피 수준을 측정합니다.</p>
            {safeHavenInterpretation && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 italic">
                {/* 아이콘 고려: 정보 아이콘 */}
                {safeHavenInterpretation}
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
            <Safeb />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
              안전 자산 선호도는 지난 20거래일 동안의 국채 수익률과 주식 수익률 간의 차이를 비교하여 측정합니다. 
              일반적으로 시장이 불안정하거나 경제 전망이 불투명할 때 투자자들은 위험 자산인 주식보다 안전 자산인 채권을 선호하는 경향이 있습니다. 
              따라서 채권 수익률이 주식 수익률을 상회하면(즉, 채권 가격 상승, 주식 가격 하락 또는 정체) 안전 자산 선호도가 높아졌다고 해석하며, 이는 시장의 공포 심리를 반영합니다.
              공포 & 탐욕 지수는 채권이 주식보다 높은 수익률을 보일 때 '공포'로, 주식이 채권보다 높은 수익률을 보일 때 '탐욕'으로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeHavenDemandSection;