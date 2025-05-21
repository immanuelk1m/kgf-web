'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  x: string;
  y: number;
}

interface FormattedDataItem {
  date: string;
  safe: number;
  month: string;
  isMonthStart: boolean; // 월의 첫 데이터인지 표시
}

const Safeb: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState<[number, number]>([0, 0]);
  const [lineColor, setLineColor] = useState('#20B2AA'); // 기본값 설정 (LightSeaGreen)

  useEffect(() => {
    setLoading(true);
    // CSS 변수에서 차트 색상 가져오기
    if (typeof window !== 'undefined') {
      const chartColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-4').trim(); // 다른 CSS 변수 사용 가능
      if (chartColor) setLineColor(chartColor);
    }

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/safe_spread.json')
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
              safe: item.y,
              month: monthStr,
              isMonthStart: isMonthStart
            };
          });

          const recentData = formattedData.slice(-50);

          if (recentData.length > 0) {
            const safeValues = recentData.map(item => item.safe);
            const min = Math.floor(Math.min(...safeValues) * 0.99);
            const max = Math.ceil(Math.max(...safeValues) * 1.01);
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

  const customTooltip = ({ active, payload }: any) => {
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
                  {pld.value.toFixed(2)} {/* 값은 소수점 둘째 자리까지 */}
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
    <ResponsiveContainer width="100%" height={300} minWidth={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const dataPoint = data.find(item => item.date === value);
            return dataPoint?.isMonthStart ? dataPoint.month : '';
          }}
          interval={0}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          orientation="left"
          domain={yDomain}
          tickCount={5}
          tickFormatter={(value) => value.toFixed(1)} // Y축 눈금 소수점 한 자리
          width={40}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
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
          type="monotone"
          dataKey="safe"
          name="국채/주식 상대수익률" // 이름 변경
          stroke={lineColor}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Safeb;
