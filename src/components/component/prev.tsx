'use client';
import React, { useState, useEffect } from 'react';

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

const getStatusText = (status: string) => {
  switch (status) {
    case '1': return '매우 공포';
    case '2': return '공포';
    case '3': return '중립';
    case '4': return '탐욕';
    case '5': return '매우 탐욕';
    default: return '알 수 없음';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case '1': return 'bg-red-600 text-white';
    case '2': return 'bg-orange-500 text-white';
    case '3': return 'bg-yellow-400 text-gray-800';
    case '4': return 'bg-green-500 text-white';
    case '5': return 'bg-green-600 text-white';
    default: return 'bg-gray-400 text-white';
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
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md h-full overflow-hidden">
      <div className="p-4 bg-blue-500 dark:bg-blue-600">
        <h3 className="text-lg font-bold text-white">이전 지수 기록</h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-600">
        {indexHistory.map((data, index) => (
          <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-200">{data.time}</span>
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-gray-800 dark:text-gray-100">{data.value.toFixed(1)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(data.status)}`}>
                  {getStatusText(data.status)}
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