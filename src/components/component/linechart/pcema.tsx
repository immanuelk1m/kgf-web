'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'; // Label 추가

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
console.log('[Pcema] Component rendering - TOP LEVEL');
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState<[number, number]>([0.5, 1.5]); // 초기 Y축 도메인
  const [lineColor, setLineColor] = useState('#FF8C00'); // 기본값 설정 (주황색 계열)

  useEffect(() => {
    setLoading(true);
    // CSS 변수에서 차트 색상 가져오기
    // CSS 변수에서 차트 색상 가져오기
    let cssChartColor = '';
    if (typeof window !== 'undefined') {
      try {
        cssChartColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim(); // kospiema와 일관성을 위해 --chart-1 사용
        console.log('[Pcema] Attempted to get --chart-1 from CSS, value:', `'${cssChartColor}'`);
      } catch (e) {
        console.error('[Pcema] Error getting CSS variable --chart-1:', e);
      }
    } else {
      console.log('[Pcema] window object is not available yet for CSS variable.');
    }

    if (cssChartColor && cssChartColor !== "undefined" && cssChartColor.length > 0) {
      console.log('[Pcema] Using chartColor from CSS:', cssChartColor);
      setLineColor(`hsl(${cssChartColor})`); // HSL 값 주위에 hsl() 래퍼 추가
    } else {
      const defaultColor = '#FF8C00'; // 기본값은 이미 완전한 색상 문자열이므로 그대로 사용
      console.log(`[Pcema] CSS chartColor ('${cssChartColor}') is invalid or empty. Using default color:`, defaultColor);
      setLineColor(defaultColor);
    }
    // lineColor 상태 업데이트는 비동기적이므로, 여기서 lineColor를 바로 로깅하면 이전 값이 나올 수 있습니다.
    // 대신, 아래 return 문 이전의 로그나, 별도의 useEffect로 lineColor 변경을 감지하여 로깅할 수 있습니다.

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/p_c_ema.json')
      .then(response => response.json())
      .then((jsonData) => {
        console.log('[Pcema] Fetched jsonData:', JSON.stringify(jsonData, null, 2)); // 원본 데이터 로그 추가
        const dataArray = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (Array.isArray(dataArray)) {
          console.log('[Pcema] dataArray (first 5 items):', JSON.stringify(dataArray.slice(0, 5), null, 2)); // 배열 데이터 일부 로그 추가
          let currentMonth = '';
          
          const formattedData: FormattedDataItem[] = dataArray.map((item: DataItem, index: number) => {
            // 로그 추가: 각 item의 구조 확인 (최초 5개 항목에 대해서만)
            if (index < 5) {
              console.log(`[Pcema] Original item ${index}:`, JSON.stringify(item, null, 2));
            }
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

            const mappedItem = {
              date: item.x,
              pcm: item.y, // 이 부분이 실제 데이터 구조와 맞는지 확인 필요
              month: monthStr,
              isMonthStart: isMonthStart
            };
            // 로그 추가: 매핑된 item의 구조 확인 (최초 5개 항목에 대해서만)
            if (index < 5) {
              console.log(`[Pcema] Mapped item ${index}:`, JSON.stringify(mappedItem, null, 2));
            }
            return mappedItem;
          });

          // 최근 50개 데이터 포인트만 사용
          const recentData = formattedData.slice(-50);
          console.log('[Pcema] recentData (first 5 items):', JSON.stringify(recentData.slice(0, 5), null, 2)); // 최종 데이터 일부 로그 추가
          setData(recentData);

          // Y축 도메인 동적 설정
          if (recentData.length > 0) {
            const values = recentData.map(item => item.pcm).filter(val => typeof val === 'number' && !isNaN(val)); // 유효한 숫자만 필터링
            if (values.length > 0) { // 유효한 값이 있을 때만 도메인 설정
              const minVal = Math.min(...values);
              const maxVal = Math.max(...values);
              const padding = (maxVal - minVal) * 0.1 || 0.1; // padding이 0이 되는 것 방지
              setYDomain([Math.max(0, minVal - padding), maxVal + padding]);
              console.log('[Pcema] Calculated yDomain:', [Math.max(0, minVal - padding), maxVal + padding]);
            } else {
              console.warn('[Pcema] No valid data for Y-axis domain calculation. Using default or previous domain.');
            }
          } else {
            console.warn('[Pcema] recentData is empty. Skipping Y-axis domain calculation.');
          }
          setLoading(false);
        } else {
          console.error('[Pcema] Fetched data is not an array or does not contain a data array:', jsonData);
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
                  {pld.value.toFixed(3)} {/* 풋/콜 비율은 소수점 셋째 자리까지 표시 */}
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

  console.log('[Pcema] lineColor before render:', lineColor); // 렌더링 직전 lineColor 로깅
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
          yAxisId="left" // yAxisId 추가
          orientation="left"
          domain={yDomain}
          hide={false} // Y축 표시 (kospiema.tsx와 일관성)
          tickCount={5}
          tickFormatter={(value) => value.toFixed(2)} // Y축 눈금은 소수점 둘째 자리까지
          width={45} // 너비 조정
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
          dataKey="pcm"
          name="풋/콜 비율 (5일 EMA)"
          stroke={lineColor}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Pcema;
