// src/components/component/put-call-options-section.tsx
import React from 'react';
import Pcema from "@/components/component/linechart/pcema";

interface FactorStatus {
  p_c_ema_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface PutCallOptionsSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const PutCallOptionsSection: React.FC<PutCallOptionsSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.p_c_ema_scaled) : null;
  let optionsInterpretation = "";
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      optionsInterpretation = "풋옵션 거래량이 콜옵션에 비해 상대적으로 많음을 나타내며, 시장 하락에 대한 투자자들의 우려가 커지고 있음을 시사합니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      optionsInterpretation = "콜옵션 거래량이 풋옵션에 비해 상대적으로 많음을 나타내며, 시장 상승에 대한 투자자들의 기대감이 높음을 시사합니다.";
    } else {
      optionsInterpretation = "풋옵션과 콜옵션 거래량이 균형을 이루고 있거나, 시장 방향성에 대한 뚜렷한 예측이 어려움을 나타낼 수 있습니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">풋 & 콜 옵션 (Put & Call Options)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">풋/콜 비율의 5일 이동평균선을 통해 시장 참여자들의 위험 회피 심리를 분석합니다.</p>
            {optionsInterpretation && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">
                {/* 아이콘 고려: 정보 아이콘 */}
                {optionsInterpretation}
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
            <Pcema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              풋/콜 비율은 특정 기간 동안 거래된 풋옵션의 총량을 콜옵션의 총량으로 나눈 값입니다. 
              풋옵션은 주가 하락에, 콜옵션은 주가 상승에 베팅하는 계약이므로, 이 비율이 높을수록 시장 참여자들이 하락을 예상하고 위험 회피(헷지) 성향이 강해짐을 의미합니다. 
              일반적으로 풋/콜 비율이 1을 초과하면 약세 심리가 우세하다고 보며, 극단적으로 높은 값은 시장의 공포가 극에 달했음을 시사할 수 있습니다. (본 지표는 5일 이동평균선을 사용합니다.)
              공포 & 탐욕 지수는 풋/콜 비율이 상승(풋옵션 우위)할 때 '공포'로, 하락(콜옵션 우위)할 때 '탐욕'으로 해석하여 시장 심리를 반영합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutCallOptionsSection;