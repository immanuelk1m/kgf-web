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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">안전 자산 선호도 (Safe Haven Demand)</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">채권 수익률과 주식 수익률의 차이</p>
          </div>
          {factorStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus(factorStatus.safe_spread_scaled).text === '매우 나쁨' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              getStatus(factorStatus.safe_spread_scaled).text === '나쁨' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              getStatus(factorStatus.safe_spread_scaled).text === '보통' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              getStatus(factorStatus.safe_spread_scaled).text === '좋음' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' // 매우 좋음
            }`}>
              {`${getStatus(factorStatus.safe_spread_scaled).text} (${getStatus(factorStatus.safe_spread_scaled).contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
            <Safeb />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가 */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              주식은 채권보다 위험하지만, 장기적으로 높은 수익을 기대할 수 있습니다. 하지만 단기적으로는 채권이 주식을 능가할 수도 있습니다. 안전 자산 선호도 지표는 최근 20거래일 동안의 <span title="안전 자산인 국채와 위험 자산인 주식 간의 수익률 차이를 통해 투자자들이 얼마나 안전한 자산을 선호하는지 나타내는 지표입니다.">국채와 주식의 수익률 차이</span>를 측정합니다. 투자자들이 불안할수록 채권 수익률이 상대적으로 높아지며, 공포 & 탐욕 지수는 이러한 현상을 '공포'  신호로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeHavenDemandSection;