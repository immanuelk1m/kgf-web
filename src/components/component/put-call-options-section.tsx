// src/components/component/put-call-options-section.tsx
import React from 'react';
import Pcema from "@/components/component/linechart/pcema";

interface FactorStatus {
  p_c_ema_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface PutCallOptionsSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const PutCallOptionsSection: React.FC<PutCallOptionsSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">풋 & 콜 옵션 (Put & Call Options)</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">5일 이동평균선</p>
          </div>
          {factorStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus(factorStatus.p_c_ema_scaled).text === '매우 나쁨' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              getStatus(factorStatus.p_c_ema_scaled).text === '나쁨' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              getStatus(factorStatus.p_c_ema_scaled).text === '보통' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              getStatus(factorStatus.p_c_ema_scaled).text === '좋음' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' // 매우 좋음
            }`}>
              {`${getStatus(factorStatus.p_c_ema_scaled).text} (${getStatus(factorStatus.p_c_ema_scaled).contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
            <Pcema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가 */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              옵션은 정해진 가격과 날짜에 주식, 지수 또는 기타 금융상품을 매수(콜 옵션)하거나 매도(풋 옵션)할 수 있는 계약입니다. <span title="투자자들이 매수하려는 풋옵션 수량 대비 매수하려는 콜옵션 수량의 비율입니다. 이 비율이 높을수록 시장 참여자들이 하락에 베팅하고 있음을 나타냅니다.">풋옵션과 콜옵션의 비율</span>이 상승하면, 투자자들이 점점 더 불안해하고 있음을 의미합니다. 일반적으로 이 비율이 1 이상이면 약세 신호로 간주됩니다. 공포 & 탐욕 지수는 풋옵션 비율이 높은 경우 &apos;공포&apos; 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutCallOptionsSection;