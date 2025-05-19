// src/components/component/junk-bond-demand-section.tsx
import React from 'react';
import Junks from "@/components/component/linechart/junk";

interface FactorStatus {
  junk_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface JunkBondDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const JunkBondDemandSection: React.FC<JunkBondDemandSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">정크본드 수요 (Junk Bond Demand)</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">정크본드와 투자등급 채권 간의 수익률 차이</p>
          </div>
          {factorStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus(factorStatus.junk_spread_scaled).text === '매우 나쁨' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              getStatus(factorStatus.junk_spread_scaled).text === '나쁨' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              getStatus(factorStatus.junk_spread_scaled).text === '보통' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              getStatus(factorStatus.junk_spread_scaled).text === '좋음' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' // 매우 좋음
            }`}>
              {`${getStatus(factorStatus.junk_spread_scaled).text} (${getStatus(factorStatus.junk_spread_scaled).contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
            <Junks />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가 */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              정크본드는 신용도가 낮아 디폴트(부도) 위험이 높은 채권입니다. 일반적으로 정크본드 가격이 오르면 수익률(금리)이 하락하고, 가격이 하락하면 수익률이 상승합니다. <span title="신용도가 낮은 정크본드와 상대적으로 안전한 투자등급 채권의 수익률 차이입니다. 이 차이가 좁을수록 투자자들이 위험을 더 감수하려는 경향을 보입니다.">정크본드와 투자등급 채권 간의 수익률 차이</span>가 좁아질수록 투자자들이 더 많은 위험을 감수하고 있다는 의미이며, 공포 & 탐욕 지수는 이를 '탐욕' 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JunkBondDemandSection;