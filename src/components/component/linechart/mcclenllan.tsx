'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  x: string;
  y: number;
}

interface FormattedDataItem {
  date: string;
  mccl: number;
  month: string;
  isMonthStart: boolean; // 월의 첫 데이터인지 표시
}

const Mccl: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [yDomain, setYDomain] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/mcclenllan.json')
      .then(response => response.json())
      .then((jsonData) => {
        const dataArray = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (Array.isArray(dataArray)) {
          let currentMonth = '';
          
          const formattedData: FormattedDataItem[] = dataArray.map((item: DataItem, index: number) => {
            // 날짜 파싱
            let monthStr = '';
            let isMonthStart = false;
            
            try {
              // YYYY-MM-DD 형식 가정
              const parts = item.x.split('-');
              if (parts.length >= 2) {
                const yearMonth = `${parts[0]}-${parts[1]}`;
                monthStr = `${parts[1]}월`;
                
                // 월이 바뀌면 표시
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
              mccl: item.y,
              month: monthStr,
              isMonthStart: isMonthStart
            };
          });

          // 최근 50개 데이터 포인트 가져오기
          const recentData = formattedData.slice(-50);
          
          // 데이터의 최소값과 최대값 계산
          if (recentData.length > 0) {
            const mcclValues = recentData.map(item => item.mccl);
            
            const min = Math.floor(Math.min(...mcclValues) * 0.99); // 최소값보다 약간 낮게 설정
            const max = Math.ceil(Math.max(...mcclValues) * 1.01); // 최대값보다 약간 높게 설정
            
            setYDomain([min, max]);
          }
          
          setData(recentData);
        } else {
          console.error('가져온 데이터가 배열이 아니거나 배열을 포함하지 않습니다:', jsonData);
        }
      })
      .catch(error => console.error('데이터 가져오기 오류:', error));
  }, []);

  // 호버 시 전체 날짜를 표시하는 사용자 정의 툴팁
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{payload[0]?.payload.date}</p>
          <p className="text-[#667BC6]">
            McClellan 지수: {payload[0]?.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date"
          tickFormatter={(value, index) => {
            // 각 데이터 포인트의 인덱스에 해당하는 항목 찾기
            const dataPoint = data.find(item => item.date === value);
            
            // 월의 시작인 경우에만 레이블 표시
            if (dataPoint?.isMonthStart) {
              return dataPoint.month;
            }
            return '';
          }}
          interval={0}
        />
        <YAxis 
          yAxisId="left" 
          orientation="left"
          domain={yDomain}
          hide={true} // 왼쪽 Y축 숨기기
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          domain={yDomain}
          tickFormatter={(value) => value.toFixed(0)} 
        />
        <Tooltip content={customTooltip} />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="mccl" 
          name="McClellan 지수" 
          stroke="#667BC6" 
          strokeWidth={3} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Mccl;