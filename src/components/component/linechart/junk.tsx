'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  x: string;
  y: number;
}

interface FormattedDataItem {
  date: string;
  junk: number;
  month: string;
  isMonthStart: boolean; // 월의 첫 데이터인지 표시
}

const Junks: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [yDomain, setYDomain] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/junk_spread.json')
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
              junk: item.y,
              month: monthStr,
              isMonthStart: isMonthStart
            };
          });

          const recentData = formattedData.slice(-50);

          if (recentData.length > 0) {
            const junkValues = recentData.map(item => item.junk);
            const min = Math.floor(Math.min(...junkValues) * 0.99);
            const max = Math.ceil(Math.max(...junkValues) * 1.01);
            setYDomain([min, max]);
          }

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
            정크 스프레드: {payload[0]?.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300} minWidth={400}>
      <LineChart data={data} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
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
          domain={[0.5, 1.5]}
          hide={true}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          domain={[0.6, 1.1]}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <Tooltip content={customTooltip} />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="junk" 
          name="정크 스프레드" 
          stroke="#667BC6" 
          strokeWidth={3} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Junks;
