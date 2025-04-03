// src/components/component/safe-haven-demand-section.tsx
import React from 'react';
import Safeb from "@/components/component/linechart/safebond";

interface FactorStatus {
  safe_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface SafeHavenDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string };
}

const SafeHavenDemandSection: React.FC<SafeHavenDemandSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">안전 자산 선호도 (Safe Haven Demand)</h2>
            <p className="text-gray-600 dark:text-gray-300">채권 수익률과 주식 수익률의 차이</p>
          </div>
          {factorStatus && (
            <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.safe_spread_scaled).color }}>
              {getStatus(factorStatus.safe_spread_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <Safeb />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              주식은 채권보다 위험하지만, 장기적으로 높은 수익을 기대할 수 있습니다. 하지만 단기적으로는 채권이 주식을 능가할 수도 있습니다. 안전 자산 선호도 지표는 최근 20거래일 동안의 국채와 주식의 수익률 차이를 측정합니다. 투자자들이 불안할수록 채권 수익률이 상대적으로 높아지며, 공포 & 탐욕 지수는 이러한 현상을 &apos;공포&apos;  신호로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeHavenDemandSection;