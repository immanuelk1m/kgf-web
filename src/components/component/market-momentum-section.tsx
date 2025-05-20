// src/components/component/market-momentum-section.tsx
import React from 'react';
import { Info } from 'lucide-react'; // Info 아이콘 import 추가
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
  if (currentStatus) {
    if (currentStatus.contribution.includes("공포")) {
      momentumInterpretation = "시장의 상승 동력이 약화되고 있음을 시사하며, 투자자들의 불안감이 커지고 있을 수 있습니다.";
    } else if (currentStatus.contribution.includes("탐욕")) {
      momentumInterpretation = "시장의 상승 동력이 강화되고 있음을 시사하며, 투자자들의 낙관적인 심리가 반영될 수 있습니다.";
    } else {
      momentumInterpretation = "시장의 방향성이 중립적이거나 뚜렷한 추세가 없음을 나타낼 수 있습니다.";
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4"> {/* mb-6에서 mb-4로 변경 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">시장 모멘텀 (Market Momentum)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">KOSPI 지수와 125일 이동평균선을 비교하여 시장의 추세 강도를 측정합니다.</p>
            {momentumInterpretation && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic flex items-center"> {/* flex와 items-center 추가 */}
                <Info className="w-4 h-4 mr-2 text-muted-foreground" /> {/* 아이콘 추가 및 스타일링 */}
                {momentumInterpretation}
              </p>
            )}
          </div>
          {currentStatus && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${currentStatus.className}`}>
              {`${currentStatus.text} (${currentStatus.contribution})`}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner"> {/* bg-gray-700에서 700/50으로 변경 */}
            <Kospiema />
          </div>
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 pr-6 shadow-inner"> {/* 오른쪽 패딩 추가, bg-gray-700에서 700/50으로 변경 */}
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">지표 해석</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              코스피가 지난 <span className="font-semibold" title="과거 125일 동안의 종가 평균입니다. 추세 파악에 사용됩니다.">125거래일 이동평균선</span>을 상회하면 긍정적인 모멘텀을, 하회하면 부정적인 모멘텀을 의미합니다. 
              이 지표는 시장의 추세 지속성 및 전환 가능성을 평가하는 데 도움을 줍니다. 
              공포 & 탐욕 지수는 모멘텀이 둔화될 때 '공포'로, 모멘텀이 증가할 때 '탐욕'으로 해석하여 시장 심리를 반영합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketMomentumSection;