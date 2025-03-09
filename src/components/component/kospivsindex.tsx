'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  x: string;
  y: number;
  z: number;
}

interface FormattedDataItem {
  date: string;
  kospi: number;
  fgi: number;
  month: string; // 월 표시용 필드
}

const KospiVsFearGreedIndex: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/index.json')
      .then(response => response.json())
      .then((jsonData) => {
        const dataArray = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (Array.isArray(dataArray)) {
          const formattedData: FormattedDataItem[] = dataArray.map((item: DataItem) => {
            // 날짜에서 월 추출
            let monthStr = '';
            try {
              // YYYY-MM-DD 형식 가정
              const parts = item.x.split('-');
              if (parts.length >= 2) {
                // 월 이름 (한국어)
                monthStr = `${parts[1]}월`;
              }
            } catch (e) {
              console.error('날짜 파싱 오류:', item.x, e);
              monthStr = item.x; // 원래 문자열로 폴백
            }

            return {
              date: item.x,
              kospi: item.y,
              fgi: item.z,
              month: monthStr
            };
          });

          // 최근 50개 데이터 포인트 가져오기
          const recentData = formattedData.slice(-50);
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
            코스피: {payload[0]?.value.toFixed(2)}
          </p>
          <p className="text-[#F4A261]">
            공포&탐욕지수: {payload[1]?.value.toFixed(0)}
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
          dataKey="month" // date 대신 month를 사용
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis 
          yAxisId="left" 
          domain={[2300, 2800]} 
          tickFormatter={(value) => value.toFixed(0)} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[30, 90]} 
          tickFormatter={(value) => value.toFixed(0)} 
        />
        <Tooltip content={customTooltip} />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="kospi" 
          name="KOSPI" 
          stroke="#667BC6" 
          strokeWidth={3} 
          dot={false} 
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="fgi" 
          name="Fear & Greed Index" 
          stroke="#F4A261" 
          strokeWidth={3} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default KospiVsFearGreedIndex;