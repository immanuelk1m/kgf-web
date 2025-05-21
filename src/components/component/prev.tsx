'use client';
import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Angry, Laugh, HelpCircle } from 'lucide-react'; // 아이콘 추가

interface IndexData {
  time: string;
  value: number;
  status: string;
}

interface JsonData {
  current: number;
  current_s: string;
  week: number;
  week_s: string;
  month: number;
  month_s: string;
  year: number;
  year_s: string;
}

const getStatusInfo = (status: string) => {
  // globals.css 및 tailwind.config.ts의 시맨틱 색상 사용
  switch (status) {
    case '1': // 매우 공포
      return { text: '극도의 공포', color: 'bg-negative text-negative-foreground border-negative', icon: <Angry className="w-3.5 h-3.5" /> };
    case '2': // 공포
      // 주황색 계열을 원하면 tailwind.config.ts에 'warning' 등으로 정의하고 사용
      // 여기서는 negative의 alpha값을 조절하여 표현
      return { text: '공포', color: 'bg-negative/70 text-negative-foreground border-negative/70', icon: <Frown className="w-3.5 h-3.5" /> };
    case '3': // 중립
      // 노란색 계열을 원하면 tailwind.config.ts에 'warning-yellow' 등으로 정의하고 사용
      // 여기서는 neutral 사용
      return { text: '중립', color: 'bg-neutral text-neutral-foreground border-neutral', icon: <Meh className="w-3.5 h-3.5" /> };
    case '4': // 탐욕
      return { text: '탐욕', color: 'bg-positive/70 text-positive-foreground border-positive/70', icon: <Smile className="w-3.5 h-3.5" /> };
    case '5': // 매우 탐욕
      return { text: '극도의 탐욕', color: 'bg-positive text-positive-foreground border-positive', icon: <Laugh className="w-3.5 h-3.5" /> };
    default:
      return { text: '알 수 없음', color: 'bg-muted text-muted-foreground border-border', icon: <HelpCircle className="w-3.5 h-3.5" /> };
  }
};

const PreviousIndexes: React.FC = () => {
  const [indexHistory, setIndexHistory] = useState<IndexData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/value.json');
        const data: JsonData = await response.json();
       
        const newIndexHistory: IndexData[] = [
          { time: '지난 거래일', value: data.current, status: data.current_s },
          { time: '일주일 전', value: data.week, status: data.week_s },
          { time: '한 달 전', value: data.month, status: data.month_s },
          { time: '1년 전', value: data.year, status: data.year_s }
        ];
        
       
        setIndexHistory(newIndexHistory);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-card dark:bg-card rounded-xl shadow-md h-full overflow-hidden border border-border"> {/* bg-card, border-border 적용 */}
      <div className="p-4 bg-primary dark:bg-primary"> {/* bg-primary 적용 */}
        <h3 className="text-lg font-bold text-primary-foreground">이전 지수 기록</h3> {/* text-primary-foreground 적용 */}
      </div>
      <ul className="divide-y divide-border"> {/* divide-border 적용 */}
        {indexHistory.map((data, index) => (
          <li key={index} className="p-4 hover:bg-accent dark:hover:bg-accent transition duration-150"> {/* hover:bg-accent 적용 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="font-medium text-muted-foreground">{data.time}</span> {/* text-muted-foreground 적용 */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-foreground text-lg">{data.value.toFixed(1)}</span> {/* text-foreground 적용 */}
                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusInfo(data.status).color}`}>
                  {getStatusInfo(data.status).icon}
                  {getStatusInfo(data.status).text}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreviousIndexes;