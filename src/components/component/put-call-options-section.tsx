// src/components/component/put-call-options-section.tsx
import React from 'react';
import Pcema from "@/components/component/linechart/pcema";

interface FactorStatus {
  p_c_ema_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface PutCallOptionsSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string };
}

const PutCallOptionsSection: React.FC<PutCallOptionsSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">풋 & 콜 옵션 (Put & Call Options)</h2>
            <p className="text-gray-600 dark:text-gray-300">5일 이동평균선</p>
          </div>
          {factorStatus && (
            <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.p_c_ema_scaled).color }}>
              {getStatus(factorStatus.p_c_ema_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <Pcema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              옵션은 정해진 가격과 날짜에 주식, 지수 또는 기타 금융상품을 매수(콜 옵션)하거나 매도(풋 옵션)할 수 있는 계약입니다. 풋옵션과 콜옵션의 비율이 상승하면, 투자자들이 점점 더 불안해하고 있음을 의미합니다. 일반적으로 이 비율이 1 이상이면 약세 신호로 간주됩니다. 공포 & 탐욕 지수는 풋옵션 비율이 높은 경우 &apos;공포&apos; 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutCallOptionsSection;