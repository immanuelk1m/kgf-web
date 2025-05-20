// src/components/component/junk-bond-demand-section.tsx
import React from 'react';
import Junks from "@/components/component/linechart/junk";

interface FactorStatus {
  junk_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface JunkBondDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const JunkBondDemandSection: React.FC<JunkBondDemandSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.junk_spread_scaled) : null;
  let junkBondInterpretation = "";
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      junkBondInterpretation = "투자자들이 위험도가 높은 정크본드에 대한 수요를 줄이고 있음을 나타내며, 시장의 위험 회피 심리가 강해지고 있음을 시사합니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      junkBondInterpretation = "투자자들이 고수익을 추구하며 위험도가 높은 정크본드에 대한 수요를 늘리고 있음을 나타내며, 시장에 대한 낙관론이 우세할 수 있습니다.";
    } else {
      junkBondInterpretation = "정크본드 시장의 수요가 중립적인 상태이거나, 투자자들의 위험 선호도가 뚜렷한 방향성을 보이지 않음을 나타낼 수 있습니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">정크본드 수요 (Junk Bond Demand)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">정크본드와 투자등급 채권 간의 수익률 스프레드를 통해 시장의 위험 선호도를 평가합니다.</p>
            {junkBondInterpretation && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">
                {/* 아이콘 고려: 정보 아이콘 */}
                {junkBondInterpretation}
              </p>
            )}
          </div>
          {currentStatus && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${currentStatus.className}`}>
              {`${currentStatus.text} (${currentStatus.contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner">
            <Junks />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              정크본드는 투자 부적격 등급 채권으로, 신용도가 낮아 부도 위험이 높은 대신 높은 수익률을 제공합니다. 
              정크본드와 투자등급 채권 간의 수익률 차이(스프레드)는 시장의 위험 선호도를 나타내는 중요한 지표입니다. 
              스프레드가 확대되면 투자자들이 위험을 회피하려는 성향이 강해졌음을 의미하며(정크본드 가격 하락, 수익률 상승), 이는 시장의 공포 심리를 반영합니다. 
              반대로 스프레드가 축소되면 투자자들이 위험을 감수하려는 성향이 강해졌음을 의미하며(정크본드 가격 상승, 수익률 하락), 이는 시장의 탐욕 심리를 나타냅니다.
              공포 & 탐욕 지수는 이 스프레드가 확대될 때 '공포'로, 축소될 때 '탐욕'으로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JunkBondDemandSection;