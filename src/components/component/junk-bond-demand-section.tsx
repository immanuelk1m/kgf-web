// src/components/component/junk-bond-demand-section.tsx
import React from 'react';
import Junks from "@/components/component/linechart/junk";

interface FactorStatus {
  junk_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface JunkBondDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string };
}

const JunkBondDemandSection: React.FC<JunkBondDemandSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">정크본드 수요 (Junk Bond Demand)</h2>
            <p className="text-gray-600 dark:text-gray-300">정크본드와 투자등급 채권 간의 수익률 차이</p>
          </div>
          {factorStatus && (
            <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.junk_spread_scaled).color }}>
              {getStatus(factorStatus.junk_spread_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <Junks />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              정크본드는 신용도가 낮아 디폴트(부도) 위험이 높은 채권입니다. 일반적으로 정크본드 가격이 오르면 수익률(금리)이 하락하고, 가격이 하락하면 수익률이 상승합니다. 정크본드와 투자등급 채권 간의 수익률 차이가 좁아질수록 투자자들이 더 많은 위험을 감수하고 있다는 의미이며, 공포 & 탐욕 지수는 이를 &apos;탐욕&apos; 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JunkBondDemandSection;