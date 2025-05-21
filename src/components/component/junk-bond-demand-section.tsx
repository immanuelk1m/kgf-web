// src/components/component/junk-bond-demand-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react'; // Flame 아이콘 추가
import Junks from "@/components/component/linechart/junk";

interface FactorStatus {
  junk_spread_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface JunkBondDemandSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const JunkBondDemandSection: React.FC<JunkBondDemandSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.junk_spread_scaled) : null;
  let junkBondInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;

  if (currentStatus) {
    // 정크본드 스프레드: 스프레드 확대 (junk_spread_scaled 낮음) -> 공포, 스프레드 축소 (junk_spread_scaled 높음) -> 탐욕
    // getStatus는 점수가 높을수록 긍정적(탐욕)으로 반환. 이 지표와 해석 방향이 일치.
    if (currentStatus.contribution.includes("극도의 공포") || currentStatus.contribution.includes("공포")) { // 스프레드 확대 (나쁨)
      junkBondInterpretation = "정크본드와 투자등급 채권 간 수익률 차이(스프레드)가 커져, 투자자들이 위험 회피 성향을 보이며 시장 불안감이 높습니다.";
      interpretationIcon = <TrendingDown className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (currentStatus.contribution.includes("극도의 탐욕") || currentStatus.contribution.includes("탐욕")) { // 스프레드 축소 (좋음)
      junkBondInterpretation = "정크본드와 투자등급 채권 간 수익률 차이(스프레드)가 줄어, 투자자들이 위험을 감수하며 고수익을 추구하는 낙관적인 상태입니다.";
      interpretationIcon = <Flame className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용
    } else { // 중립
      junkBondInterpretation = "정크본드 시장의 수요가 중립적이거나, 투자자들의 위험 선호도가 뚜렷한 방향성을 보이지 않는 상태입니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">정크본드 수요 (Junk Bond Demand)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">정크본드와 투자등급 채권 간의 수익률 스프레드를 통해 시장의 위험 선호도를 평가합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <Junks />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {currentStatus && ( // factorStatus null 체크 제거
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
                    currentStatus.className.replace('bg-', 'border-')
                  } ${currentStatus.className}`}> {/* dark:text-gray-100 조건부 스타일 제거, currentStatus.className 직접 사용 */}
                    {currentStatus.contribution.includes("공포") ? <TrendingDown className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                    {currentStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{junkBondInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                정크본드(고위험 채권)와 투자등급 채권의 수익률 차이(스프레드)로 위험 선호도를 측정합니다. 스프레드 확대는 '공포', 축소는 '탐욕'을 의미합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JunkBondDemandSection;