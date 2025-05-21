'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'; // Label 추가

interface DataItem {
  x: string;
  y: number;
  z: number;
}

interface FormattedDataItem {
  date: string;
  kospi: number;
  fgi: number;
  month: string;
  isMonthStart: boolean; // 월의 첫 데이터인지 표시
}

const Vixema: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState<[number, number]>([0, 0]);
  const [vixColor, setVixColor] = useState('#FF6347'); // 기본값 설정 (VIX는 보통 위험을 나타내므로 붉은 계열)
  const [emaColor, setEmaColor] = useState('#4682B4'); // 기본값 설정 (EMA는 보조선이므로 다른 색)

  useEffect(() => {
    setLoading(true);
    // CSS 변수에서 차트 색상 가져오기
    if (typeof window !== 'undefined') {
      const chart1Color = getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim();
      const chart2Color = getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim();
      // VIX 차트에서는 색상 순서를 반대로 적용하거나, 별도의 CSS 변수를 사용할 수 있습니다.
      // 여기서는 chart-1을 VIX, chart-2를 EMA로 가정합니다.
      if (chart1Color) setVixColor(`hsl(${chart1Color})`); // HSL 값 주위에 hsl() 래퍼 추가
      if (chart2Color) setEmaColor(`hsl(${chart2Color})`); // HSL 값 주위에 hsl() 래퍼 추가
    }

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/vix_close.json')
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
              kospi: item.y,
              fgi: item.z,
              month: monthStr,
              isMonthStart: isMonthStart
            };
          });

          // 최근 50개 데이터 포인트 가져오기
          const recentData = formattedData.slice(-50);
          
          // 데이터의 최소값과 최대값 계산
          if (recentData.length > 0) {
            const kospiValues = recentData.map(item => item.kospi);
            const fgiValues = recentData.map(item => item.fgi);
            const allValues = [...kospiValues, ...fgiValues];
            
            const min = Math.floor(Math.min(...allValues) * 0.99); // 최소값보다 약간 낮게 설정
            const max = Math.ceil(Math.max(...allValues) * 1.01); // 최대값보다 약간 높게 설정
            
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
                  {pld.value.toFixed(2)} {/* VIX 값은 소수점 둘째 자리까지 표시 */}
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
          yAxisId="left"
          orientation="left"
          domain={yDomain}
          hide={false} // 왼쪽 Y축 표시
          tickCount={5} // Y축 틱 개수 설정
          tickFormatter={(value) => value.toFixed(1)} // VIX는 소수점 한 자리까지 표시
          width={40} // 왼쪽 Y축 너비 확보
          stroke="hsl(var(--muted-foreground))" // 테마 색상 적용
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} // 틱 스타일
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={yDomain}
          tickFormatter={(value) => value.toFixed(1)} // VIX는 소수점 한 자리까지 표시
          tickCount={5} // Y축 틱 개수 설정
          width={50} // 오른쪽 Y축 너비 확보
          tickMargin={5} // 틱과 레이블 사이 간격
          stroke="hsl(var(--muted-foreground))" // 테마 색상 적용
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} // 틱 스타일
        >
          {/* <Label value="Point" angle={-90} position="insideRight" offset={15} style={{ textAnchor: 'middle' }} /> */}
        </YAxis>
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
          yAxisId="left"
          type="monotone"
          dataKey="kospi" // 데이터 키는 유지 (실제로는 VIX 값)
          name="VIX" // 이름 변경
          stroke={vixColor}
          strokeWidth={3}
          dot={false}
        />
        <Line
          yAxisId="right" // 오른쪽 Y축 사용 명시
          type="monotone"
          dataKey="fgi" // 데이터 키는 유지 (실제로는 VIX EMA 값)
          name="VIX 50EMA" // 이름 변경
          stroke={emaColor}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Vixema;