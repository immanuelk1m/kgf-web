// src/components/component/stock-strength-section.tsx
import React from 'react';
import StockStrength from "@/components/component/linechart/stockstrength";

interface FactorStatus {
  stock_strength_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface StockStrengthSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; };
}

const StockStrengthSection: React.FC<StockStrengthSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">주식 강도 (Stock Strength)</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">시장 참여자들의 강세/약세 판단 지표</p>
          </div>
          {factorStatus && factorStatus.stock_strength_scaled !== undefined && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus(factorStatus.stock_strength_scaled).text === '매우 나쁨' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              getStatus(factorStatus.stock_strength_scaled).text === '나쁨' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              getStatus(factorStatus.stock_strength_scaled).text === '보통' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              getStatus(factorStatus.stock_strength_scaled).text === '좋음' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' // 매우 좋음
            }`}>
              {getStatus(factorStatus.stock_strength_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
            <StockStrength />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가 */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              주식 강도는 시장에서 개별 주식들의 건강성을 측정하는 지표입니다. <span title="주식 강도 지표의 중립 기준선입니다. 이 값보다 높으면 강세, 낮으면 약세로 해석됩니다.">50점을 기준으로</span> 그 이상이면 강세 신호, 미만이면 약세 신호로 해석됩니다. 이 지표는 시장 참여자들의 종목 선택 경향과 전반적인 투자 심리를 보여줍니다. 지표가 높을수록 시장 참여자들이 낙관적이고, 지표가 낮을수록 비관적인 심리가 지배적임을 의미합니다. 공포 & 탐욕 지수는 주식 강도가 감소할 때 &apos;공포&apos; 신호로, 증가할 때 &apos;탐욕&apos; 신호로 해석합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockStrengthSection;