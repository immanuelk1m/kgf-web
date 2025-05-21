// src/components/component/put-call-options-section.tsx
import React from 'react';
import { Info, TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react'; // ShieldAlert 아이콘 추가
import Pcema from "@/components/component/linechart/pcema";

interface FactorStatus {
  p_c_ema_scaled: number;
  // 다른 필요한 상태들도 여기에 추가될 수 있습니다.
}

interface PutCallOptionsSectionProps {
  factorStatus: FactorStatus | null;
  getStatus: (value: number) => { text: string; color: string; contribution: string; className: string; };
}

const PutCallOptionsSection: React.FC<PutCallOptionsSectionProps> = ({ factorStatus, getStatus }) => {
  const currentStatus = factorStatus ? getStatus(factorStatus.p_c_ema_scaled) : null;
  let optionsInterpretation = "";
  let interpretationIcon = <Info className="w-4 h-4 mr-2 text-muted-foreground" />;
  let displayStatus = null;

  if (currentStatus && factorStatus) {
    // 풋/콜 비율: 비율 상승 (풋 우위, p_c_ema_scaled 높음) -> 공포
    // 비율 하락 (콜 우위, p_c_ema_scaled 낮음) -> 탐욕
    // getStatus는 점수가 높을수록 긍정적(탐욕)으로 반환.
    // 따라서, p_c_ema_scaled가 낮을수록 (탐욕) -> getStatus(1 - factorStatus.p_c_ema_scaled)는 높은 점수(탐욕 스타일) 반환
    displayStatus = getStatus(1 - factorStatus.p_c_ema_scaled);

    if (displayStatus.contribution.includes("극도의 공포") || displayStatus.contribution.includes("공포")) { // 실제로는 풋/콜 비율이 높은 상태 (나쁨)
      optionsInterpretation = "풋옵션 거래량이 콜옵션 대비 매우 높아 시장 하락 우려가 극심한 상태입니다. 투자자들의 위험 회피 심리가 강하게 나타납니다.";
      interpretationIcon = <ShieldAlert className="w-4 h-4 mr-2 text-negative" />; // text-negative 적용
    } else if (displayStatus.contribution.includes("극도의 탐욕") || displayStatus.contribution.includes("탐욕")) { // 실제로는 풋/콜 비율이 낮은 상태 (좋음)
      optionsInterpretation = "콜옵션 거래량이 풋옵션 대비 매우 높아 시장 상승 기대감이 큰 상태입니다. 투자자들이 낙관적인 전망을 가지고 있습니다.";
      interpretationIcon = <TrendingUp className="w-4 h-4 mr-2 text-positive" />; // text-positive 적용
    } else { // 중립
      optionsInterpretation = "풋옵션과 콜옵션 거래량이 균형을 이루고 있거나, 시장 방향성에 대한 뚜렷한 예측이 어려운 상태입니다.";
      interpretationIcon = <Minus className="w-4 h-4 mr-2 text-neutral-foreground" />; // text-neutral-foreground 적용
    }
  }

  return (
    <div className="bg-background dark:bg-background rounded-xl shadow-lg overflow-hidden border border-border"> {/* dark:bg-background, dark:border-border 일관성 */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">풋 & 콜 옵션 (Put & Call Options)</h2> {/* dark:text-foreground 일관성 */}
          <p className="text-sm text-muted-foreground mt-1">풋/콜 비율의 5일 이동평균선을 통해 시장 참여자들의 위험 회피 심리를 분석합니다.</p> {/* dark:text-muted-foreground 일관성 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-start">
          <div className="md:col-span-4 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
            <Pcema />
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="bg-muted/30 dark:bg-muted/50 rounded-lg p-4 shadow-inner"> {/* dark:bg-muted/50 적용 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">지표 해석</h3> {/* text-base, dark:text-foreground 일관성 */}
                {displayStatus && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${displayStatus.className.replace('bg-', 'border-')} ${displayStatus.className}`}>
                    {displayStatus.contribution.includes("공포") ? <ShieldAlert className="w-3.5 h-3.5" /> : displayStatus.contribution.includes("탐욕") ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    {displayStatus.text}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex items-start"> {/* dark:text-muted-foreground 일관성 */}
                {interpretationIcon}
                <span>{optionsInterpretation}</span>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed"> {/* dark:text-muted-foreground/80 일관성 */}
                풋/콜 비율은 풋옵션(하락 베팅)과 콜옵션(상승 베팅)의 거래량 비율입니다. 비율 상승은 하락 우려(공포 기여), 하락은 상승 기대(탐욕 기여)를 나타냅니다. (5일 이동평균선 사용)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutCallOptionsSection;