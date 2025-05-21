// src/components/component/market-momentum-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'; // 아이콘 추가
import Kospiema from "@/components/component/linechart/kospiema";

interface FactorStatus {
  ema_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface MarketMomentumSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const MarketMomentumSection: React.FC<MarketMomentumSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.ema_spread_scaled) : null;
  let momentumInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;

  if (currentStatus) {
    if (currentStatus.contribution.includes("극도의 공포") || currentStatus.contribution.includes("공포")) {
      momentumInterpretation = "시장의 상승 동력이 약화되고 있음을 시사하며, 투자자들의 불안감이 커지고 있을 수 있습니다.";
      interpretationIcon = <TrendingDown className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (currentStatus.contribution.includes("극도의 탐욕") || currentStatus.contribution.includes("탐욕")) {
      momentumInterpretation = "시장의 상승 동력이 강화되고 있음을 시사하며, 투자자들의 낙관적인 심리가 반영될 수 있습니다.";
      interpretationIcon = <TrendingUp className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용
    } else {
      momentumInterpretation = "시장의 방향성이 중립적이거나 뚜렷한 추세가 없음을 나타낼 수 있습니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용 (또는 warning)
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">시장 모멘텀 (Market Momentum)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">KOSPI 지수와 125일 이동평균선을 비교하여 시장의 추세 강도를 측정합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <Kospiema />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {currentStatus && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${currentStatus.className.replace('bg-', 'border-')} ${currentStatus.className}`}>
                    {/* getStatus의 className이 foreground 색상을 포함하므로 dark:text-gray-100 제거 */}
                    {currentStatus.contribution.includes("공포") ? <TrendingDown className="w-3.5 h-3.5" /> : currentStatus.contribution.includes("탐욕") ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {currentStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{momentumInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                KOSPI가 <span className="font-semibold text-foreground/90" title="과거 125일 동안의 종가 평균입니다. 추세 파악에 사용됩니다.">125일 이동평균선</span>을 상회하면 긍정적, 하회하면 부정적 모멘텀을 의미합니다. 이는 추세 지속성 및 전환 가능성을 평가합니다. {/* dark:text-foreground/90 일관성 */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketMomentumSection;