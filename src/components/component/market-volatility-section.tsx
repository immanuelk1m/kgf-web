// src/components/component/market-volatility-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'; // 아이콘 추가
import Vixema from "@/components/component/linechart/vixema";

interface FactorStatus {
  vix_ema_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface MarketVolatilitySectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const MarketVolatilitySection: React.FC<MarketVolatilitySectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.vix_ema_spread_scaled) : null;
  let volatilityInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;
  let displayStatus = null;

  if (currentStatus && factorStatus) {
    // VIX는 반대로 해석: VIX 상승 (나쁨) -> 공포, VIX 하락 (좋음) -> 탐욕
    // currentStatus는 factorStatus.vix_ema_spread_scaled를 기반으로 함.
    // vix_ema_spread_scaled가 낮을수록 VIX가 낮고, 시장은 긍정적(탐욕)
    // vix_ema_spread_scaled가 높을수록 VIX가 높고, 시장은 부정적(공포)
    // getStatus는 점수가 높을수록 긍정적으로 반환함.
    // 따라서, VIX의 경우, vix_ema_spread_scaled가 낮을수록 (예: 0.1 -> getStatus는 부정적 반환) 실제로는 긍정적.
    // vix_ema_spread_scaled가 높을수록 (예: 0.9 -> getStatus는 긍정적 반환) 실제로는 부정적.
    // displayStatus는 실제 시장 상황(탐욕/공포)에 맞는 스타일과 텍스트를 가져야 함.
    // 즉, vix_ema_spread_scaled가 낮으면 (VIX 낮음, 탐욕) -> displayStatus는 긍정적 스타일
    // vix_ema_spread_scaled가 높으면 (VIX 높음, 공포) -> displayStatus는 부정적 스타일
    // 이는 getStatus(1 - factorStatus.vix_ema_spread_scaled)를 사용하면 됨.
    displayStatus = getStatus(1 - factorStatus.vix_ema_spread_scaled);

    if (displayStatus.contribution.includes("극도의 공포") || displayStatus.contribution.includes("공포")) { // VIX 높음
      volatilityInterpretation = "시장의 불확실성이 매우 높아 투자자들의 불안감이 극대화된 상태입니다. 변동성 확대에 각별한 주의가 필요합니다.";
      interpretationIcon = <AlertTriangle className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (displayStatus.contribution.includes("극도의 탐욕") || displayStatus.contribution.includes("탐욕")) { // VIX 낮음
      volatilityInterpretation = "시장이 안정적이며 변동성이 낮은 수준을 유지하고 있어 투자자들이 안도감을 느끼는 상태입니다.";
      interpretationIcon = <TrendingDown className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용 (VIX 하락이 긍정적)
    } else { // 중립
      volatilityInterpretation = "시장의 변동성이 보통 수준이거나, 뚜렷한 방향성을 예측하기 어려운 상태입니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">시장 변동성 (Market Volatility)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">VIX 지수와 50일 이동평균선을 통해 시장의 위험 수준과 투자자 심리를 파악합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <Vixema />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {displayStatus && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${displayStatus.className.replace('bg-', 'border-')} ${displayStatus.className}`}>
                    {displayStatus.contribution.includes("공포") ? <AlertTriangle className="w-3.5 h-3.5" /> : displayStatus.contribution.includes("탐욕") ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {displayStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{volatilityInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                VIX(변동성 지수)는 시장의 &apos;공포 지수&apos;로, 상승 시 불확실성 증가(공포 기여), 하락 시 안정(탐욕 기여)을 의미합니다. (코스피 조정 VIX 사용)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketVolatilitySection;