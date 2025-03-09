'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  x: string;
  y: number;
}

interface FormattedDataItem {
  date: string;
  pcm: number;
  month: string;
  isMonthStart: boolean; // 월의 첫 데이터인지 표시
}

const Pcema: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/p_c_ema.json')
      .then(response => response.json())
      .then((jsonData) => {
        const dataArray = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (Array.isArray(dataArray)) {
          let currentMonth = '';
          
          const formattedData: FormattedDataItem[] = dataArray.map((item: DataItem) => {
            let monthStr = '';
            let isMonthStart = false;
            
            try {
              const parts = item.x.split('-');
              if (parts.length >= 2) {
                const yearMonth = `${parts[0]}-${parts[1]}`;
                monthStr = `${parts[1]}월`;
                if (yearMonth !== currentMonth) {
                  currentMonth = yearMonth;
                  isMonthStart = true;
                }
              }
            } catch (e) {
              console.error('날짜 파싱 오류:', item.x, e);
              monthStr = item.x;
            }

            return {
              date: item.x,
              pcm: item.y,
              month: monthStr,
              isMonthStart: isMonthStart
            };
          });

          // 최근 50개 데이터 포인트만 사용
          const recentData = formattedData.slice(-50);
          setData(recentData);
        } else {
          console.error('가져온 데이터가 배열이 아니거나 배열을 포함하지 않습니다:', jsonData);
        }
      })
      .catch(error => console.error('데이터 가져오기 오류:', error));
  }, []);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{payload[0]?.payload.date}</p>
          <p className="text-[#667BC6]">
            Put/Call 5EMA: {payload[0]?.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date"
          tickFormatter={(value) => {
            const dataPoint = data.find(item => item.date === value);
            return dataPoint?.isMonthStart ? dataPoint.month : '';
          }}
          interval={0}
        />
        <YAxis 
          yAxisId="left" 
          orientation="left"
          domain={[0, 1]}
          hide={true}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          domain={[0.5, 1.5]}
          tickFormatter={(value) => value.toFixed(2)}
        />
        <Tooltip content={customTooltip} />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="pcm" 
          name="Put/Call EMA" 
          stroke="#667BC6" 
          strokeWidth={3} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Pcema;
