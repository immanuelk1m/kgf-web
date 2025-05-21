'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  x: string;
  y: number; // KOSPI
  z: number; // Fear & Greed Index
}

interface FormattedDataItem {
  date: string;
  kospi: number;
  fgi: number;
  month: string;
  isMonthStart: boolean;
}

const KospiVsFearGreedIndex: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState<[number, number]>([0, 0]); // Y축 도메인 (KOSPI)
  const [yDomainFgi, setYDomainFgi] = useState<[number, number]>([0, 100]); // Y축 도메인 (FGI)
  const [kospiColor, setKospiColor] = useState('hsl(var(--chart-1))');
  const [fgiColor, setFgiColor] = useState('hsl(var(--chart-2))');

  useEffect(() => {
    setLoading(true);
    if (typeof window !== 'undefined') {
      const kospiStrokeColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim();
      const fgiStrokeColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim();
      if (kospiStrokeColor) setKospiColor(`hsl(${kospiStrokeColor})`);
      if (fgiStrokeColor) setFgiColor(`hsl(${fgiStrokeColor})`);
    }

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/index.json')
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
              kospi: item.y,
              fgi: item.z,
              month: monthStr,
              isMonthStart: isMonthStart,
            };
          });

          const recentData = formattedData.slice(-50);

          if (recentData.length > 0) {
            const kospiValues = recentData.map(item => item.kospi);
            const fgiValues = recentData.map(item => item.fgi);

            const minKospi = Math.floor(Math.min(...kospiValues) * 0.99);
            const maxKospi = Math.ceil(Math.max(...kospiValues) * 1.01);
            setYDomain([minKospi, maxKospi]);

            // FGI는 일반적으로 0-100 범위이지만, 데이터에 따라 유동적으로 조정 가능
            // 여기서는 다른 차트와의 일관성을 위해 데이터 기반으로 설정하되, 최소/최대 범위를 고려
            const minFgi = Math.floor(Math.min(...fgiValues) * 0.9);
            const maxFgi = Math.ceil(Math.max(...fgiValues) * 1.1);
            // FGI의 일반적인 범위(0-100)를 벗어나지 않도록 조정
            setYDomainFgi([Math.max(0, minFgi), Math.min(100, maxFgi)]);
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
                  {pld.name === "KOSPI" ? pld.value.toFixed(2) : pld.value.toFixed(0)}
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
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
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
          yAxisId="left"
          orientation="left"
          domain={yDomain}
          tickCount={5}
          tickFormatter={(value) => value.toFixed(0)}
          width={40}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={yDomainFgi} // FGI Y축 도메인 사용
          tickFormatter={(value) => `${value.toFixed(0)}`} // FGI는 단위 없이 표시
          tickCount={5}
          width={50}
          tickMargin={5}
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
          formatter={(value) => (
            <span style={{ color: 'hsl(var(--foreground))', marginRight: '10px' }}>{value}</span>
          )}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="kospi"
          name="KOSPI"
          stroke={kospiColor}
          strokeWidth={3}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="fgi"
          name="Fear & Greed Index"
          stroke={fgiColor}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default KospiVsFearGreedIndex;