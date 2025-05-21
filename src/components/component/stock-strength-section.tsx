// src/components/component/stock-strength-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus, BarChartBig } from 'lucide-react'; // BarChartBig 아이콘 추가
import StockStrength from "@/components/component/linechart/stockstrength";

interface FactorStatus {
  stock_strength_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface StockStrengthSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const StockStrengthSection: React.FC<StockStrengthSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus && factorStatus.stock_strength_scaled !== undefined ? getStatus(factorStatus.stock_strength_scaled) : null;
  let strengthInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;

  if (currentStatus) {
    // 주식 강도: 신고가 > 신저가 (강함) -> 탐욕, 신저가 > 신고가 (약함) -> 공포
    if (currentStatus.contribution.includes("극도의 공포") || currentStatus.contribution.includes("공포")) { // 주식 강도 약함 (나쁨)
      strengthInterpretation = "52주 신저가 종목 수가 신고가보다 많아 시장의 전반적인 힘이 약화된 상태입니다. 투자 심리가 위축될 수 있습니다.";
      interpretationIcon = <TrendingDown className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (currentStatus.contribution.includes("극도의 탐욕") || currentStatus.contribution.includes("탐욕")) { // 주식 강도 강함 (좋음)
      strengthInterpretation = "52주 신고가 종목 수가 신저가보다 많아 시장의 전반적인 힘이 강한 상태입니다. 긍정적인 투자 심리가 확산될 수 있습니다.";
      interpretationIcon = <BarChartBig className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용
    } else { // 중립
      strengthInterpretation = "시장의 힘이 중립적이거나, 특정 방향으로의 뚜렷한 움직임이 없는 상태입니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">주식 강도 (Stock Strength)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">52주 신고가와 신저가를 기록하는 주식 수를 비교하여 시장의 내재적인 힘을 측정합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <StockStrength />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {currentStatus && factorStatus && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
                    currentStatus.className.replace('bg-', 'border-')
                  } ${currentStatus.className}`}> {/* dark:text-gray-100 조건부 스타일 제거 */}
                    {currentStatus.contribution.includes("공포") ? <TrendingDown className="w-3.5 h-3.5" /> : currentStatus.contribution.includes("탐욕") ? <BarChartBig className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {currentStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{strengthInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                52주 신고가와 신저가 종목 수 차이로 시장의 내재적 힘을 측정합니다. 신고가 우세는 '탐욕', 신저가 우세는 '공포'를 의미합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockStrengthSection;