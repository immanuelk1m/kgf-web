'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'; // Label 추가

interface DataItem {
  x: string;
  y: number;
}

interface FormattedDataItem {
  date: string;
  strength: number;
  month: string;
  isMonthStart: boolean; // 월의 첫 데이터인지 표시
}

const StockStrength: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState<[number, number]>([0, 100]); // Y축 도메인 동적 설정 예정
  const [lineColor, setLineColor] = useState('#32CD32'); // 기본값 설정 (LimeGreen)

  useEffect(() => {
    setLoading(true);
    // CSS 변수에서 차트 색상 가져오기
    if (typeof window !== 'undefined') {
      const chartColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim(); // kospiema와 일관성을 위해 --chart-1 사용
      if (chartColor) setLineColor(`hsl(${chartColor})`); // HSL 값 주위에 hsl() 래퍼 추가
    }

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/stock_strength.json')
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
              strength: item.y,
              month: monthStr,
              isMonthStart: isMonthStart
            };
          });

          // 최근 50개 데이터 포인트 가져오기
          const recentData = formattedData.slice(-50);
          
          // 데이터의 최소값과 최대값 계산
          if (recentData.length > 0) {
            const strengthValues = recentData.map(item => item.strength);
            
            const min = Math.max(0, Math.floor(Math.min(...strengthValues) * 0.99)); // 최소값보다 약간 낮게 설정
            const max = Math.min(100, Math.ceil(Math.max(...strengthValues) * 1.01)); // 최대값보다 약간 높게 설정
            
            setYDomain([min, max]);
          }
          
          setData(recentData);
          setLoading(false);
        } else {
          console.error('가져온 데이터가 배열이 아니거나 배열을 포함하지 않습니다:', jsonData);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('데이터 가져오기 오류:', error);
        setLoading(false);
      });
  }, []);

  // 호버 시 전체 날짜를 표시하는 사용자 정의 툴팁
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2.5 shadow-xl">
          <p className="mb-1.5 text-sm font-medium text-foreground">{payload[0]?.payload.date}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: pld.color }}
              />
              <div className="flex flex-1 justify-between leading-none">
                <span className="text-sm text-muted-foreground">{pld.name}:</span>
                <span className="ml-2 font-mono text-sm font-medium tabular-nums text-foreground">
                  {pld.value.toFixed(1)} {/* 값은 소수점 첫째 자리까지 */}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: 300,
          minWidth: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--skeleton-bg, #f0f0f0)',
          borderRadius: 'var(--radius, 0.5rem)'
        }}
        className="skeleton"
      >
        <p style={{ color: 'var(--muted-foreground, #71717a)' }}>데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickFormatter={(value, index) => {
            const dataPoint = data.find(item => item.date === value);
            if (dataPoint?.isMonthStart) {
              return dataPoint.month;
            }
            return '';
          }}
          interval={0}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          yAxisId="left" // yAxisId 추가
          orientation="left"
          domain={yDomain}
          hide={false} // Y축 표시 (kospiema.tsx와 일관성)
          tickCount={5}
          tickFormatter={(value) => value.toFixed(0)} // Y축 눈금 정수
          width={40}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        {/* <YAxis yAxisId="right" orientation="right" domain={yDomain} hide={true} /> */} {/* 단일 라인이므로 오른쪽 Y축은 숨김 또는 불필요 */}
        <Tooltip
          content={customTooltip}
          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ top: -10, right: 0, fontSize: '13px' }}
          iconSize={10}
          formatter={(value, entry) => (
            <span style={{ color: 'hsl(var(--foreground))', marginRight: '10px' }}>{value}</span>
          )}
        />
        <Line
          yAxisId="left" // yAxisId 추가
          type="monotone"
          dataKey="strength"
          name="주가 강도 지수"
          stroke={lineColor}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockStrength; 