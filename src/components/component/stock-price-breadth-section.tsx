// src/components/component/stock-price-breadth-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus, AreaChart } from 'lucide-react'; // AreaChart 아이콘 추가
import Mccl from "@/components/component/linechart/mcclenllan";

interface FactorStatus {
  mcclenllan_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface StockPriceBreadthSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const StockPriceBreadthSection: React.FC<StockPriceBreadthSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.mcclenllan_scaled) : null;
  let breadthInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;

  if (currentStatus) {
    // 맥클렐런 지수: 상승 (매수세↑) -> 탐욕, 하락 (매도세↑) -> 공포
    if (currentStatus.contribution.includes("극도의 공포") || currentStatus.contribution.includes("공포")) { // 지수 하락 (나쁨)
      breadthInterpretation = "맥클렐런 거래량 합산 지수가 하락하여 시장의 매도 압력이 우세하거나 거래량이 감소하고 있어 시장 약세를 시사합니다.";
      interpretationIcon = <TrendingDown className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (currentStatus.contribution.includes("극도의 탐욕") || currentStatus.contribution.includes("탐욕")) { // 지수 상승 (좋음)
      breadthInterpretation = "맥클렐런 거래량 합산 지수가 상승하여 시장의 매수 압력이 강하거나 거래량이 증가하고 있어 시장 강세를 시사합니다.";
      interpretationIcon = <AreaChart className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용
    } else { // 중립
      breadthInterpretation = "시장의 매수/매도 압력이 균형을 이루고 있거나, 거래량 추세가 중립적인 상태입니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">주가 확산도 (Stock Price Breadth)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">맥클렐런 거래량 합산 지수(McClellan Volume Summation Index)를 통해 시장의 매수/매도 강도를 분석합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <Mccl />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {currentStatus && factorStatus && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
                    currentStatus.className.replace('bg-', 'border-')
                  } ${currentStatus.className}`}> {/* dark:text-gray-100 조건부 스타일 제거 */}
                    {currentStatus.contribution.includes("공포") ? <TrendingDown className="w-3.5 h-3.5" /> : currentStatus.contribution.includes("탐욕") ? <AreaChart className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {currentStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{breadthInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                맥클렐런 거래량 합산 지수는 상승/하락 종목 거래량 차이를 누적하여 매수/매도 압력을 측정합니다. 지수 상승은 &apos;탐욕&apos;, 하락은 &apos;공포&apos;를 의미합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPriceBreadthSection;