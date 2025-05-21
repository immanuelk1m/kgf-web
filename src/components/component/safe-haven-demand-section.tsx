// src/components/component/safe-haven-demand-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus, ShieldCheck } from 'lucide-react'; // ShieldCheck 아이콘 추가
import Safeb from "@/components/component/linechart/safebond";

interface FactorStatus {
  safe_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface SafeHavenDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const SafeHavenDemandSection: React.FC<SafeHavenDemandSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.safe_spread_scaled) : null;
  let safeHavenInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;

  if (currentStatus) {
    // 안전 자산 선호도: 채권 선호 (safe_spread_scaled 낮음) -> 공포, 주식 선호 (safe_spread_scaled 높음) -> 탐욕
    // getStatus는 점수가 높을수록 긍정적(탐욕)으로 반환. 이 지표와 해석 방향이 일치.
    if (currentStatus.contribution.includes("극도의 공포") || currentStatus.contribution.includes("공포")) { // 채권 선호 (나쁨)
      safeHavenInterpretation = "투자자들이 위험 자산보다 안전 자산(채권)을 크게 선호하며, 시장 불안감이 고조된 상태입니다.";
      interpretationIcon = <ShieldCheck className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (currentStatus.contribution.includes("극도의 탐욕") || currentStatus.contribution.includes("탐욕")) { // 주식 선호 (좋음)
      safeHavenInterpretation = "투자자들이 안전 자산보다 위험 자산(주식)을 크게 선호하며, 시장에 대한 낙관론이 우세한 상태입니다.";
      interpretationIcon = <TrendingUp className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용
    } else { // 중립
      safeHavenInterpretation = "주식과 채권에 대한 투자자들의 선호도가 균형을 이루고 있거나, 뚜렷한 방향성이 없는 상태입니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">안전 자산 선호도 (Safe Haven Demand)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">지난 20일간 주식 대비 채권의 상대적 수익률을 통해 시장의 위험 회피 수준을 측정합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <Safeb />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {currentStatus && ( // factorStatus null 체크 제거 (currentStatus가 이미 factorStatus를 사용)
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
                    currentStatus.className.replace('bg-', 'border-')
                  } ${currentStatus.className}`}> {/* dark:text-gray-100 조건부 스타일 제거, currentStatus.className 직접 사용 */}
                    {currentStatus.contribution.includes("공포") ? <ShieldCheck className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {currentStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{safeHavenInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                주식 대비 채권 수익률 차이로 안전 자산 선호도를 측정합니다. 채권 선호 시 &apos;공포&apos;, 주식 선호 시 &apos;탐욕&apos;으로 해석됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeHavenDemandSection;