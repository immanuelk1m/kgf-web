// src/components/component/stock-price-breadth-section.tsx
import React from 'react';
import Mccl from "@/components/component/linechart/mcclenllan";

interface FactorStatus {
  mcclenllan_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface StockPriceBreadthSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string };
}

const StockPriceBreadthSection: React.FC<StockPriceBreadthSectionProps> = ({ factorStatus, getStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">주가 폭 (Stock Price Breadth)</h2>
            <p className="text-gray-600 dark:text-gray-300">McClellan Volume Summation Index</p>
          </div>
          {factorStatus && (
            <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.mcclenllan_scaled).color }}>
              {getStatus(factorStatus.mcclenllan_scaled).text}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <Mccl />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              맥클렐런 거래량 합산 지수(McClellan Volume Summation Index)는 상승하는 주식의 거래량과 하락하는 주식의 거래량을 비교하는 지표입니다. 시장에서 거래되는 주식 수는 수천 개에 달하며, 매일매일 매수와 매도가 이루어집니다. 이 지표가 낮거나 음수이면 약세 신호로 해석됩니다. 공포 & 탐욕 지수는 거래량 감소를 &apos;공포&apos; 신호로 봅니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPriceBreadthSection;