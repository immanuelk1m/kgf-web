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
    case '1': return 'text-red-600';
    case '2': return 'text-orange-500';
    case '3': return 'text-gray-500';
    case '4': return 'text-green-500';
    case '5': return 'text-green-600';
    default: return 'text-gray-800';
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
          { time: 'Previous close', value: data.current, status: data.current_s },
          { time: '1 week ago', value: data.week, status: data.week_s },
          { time: '1 month ago', value: data.month, status: data.month_s },
          { time: '1 year ago', value: data.year, status: data.year_s }
        ];
       
        setIndexHistory(newIndexHistory);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-4 bg-white p-4 shadow-md rounded-lg">
      <ul>
        {indexHistory.map((data, index) => (
          <li key={index} className="py-2 border-b last:border-b-0">
            <div className="flex justify-between">
              <span>{data.time}</span>
              <span className={`font-bold ${getStatusColor(data.status)}`}>
                {data.value.toFixed(1)} - {getStatusText(data.status)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreviousIndexes;