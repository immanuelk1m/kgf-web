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

const Kospiema: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [yDomain, setYDomain] = useState<[number, number]>([0, 0]);
  const [kospiColor, setKospiColor] = useState('#1E90FF'); // 기본값 변경 (더 선명한 파란색)
  const [fgiColor, setFgiColor] = useState('#FF6347'); // 기본값 변경 (더 선명한 주황색/빨간색 계열)

  useEffect(() => {
    setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
    // CSS 변수에서 차트 색상 가져오기
    if (typeof window !== 'undefined') {
      const kospiStrokeColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim();
      const fgiStrokeColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim();
      if (kospiStrokeColor) setKospiColor(`hsl(${kospiStrokeColor})`);
      if (fgiStrokeColor) setFgiColor(`hsl(${fgiStrokeColor})`);
    }

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/kospi.json')
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
          setLoading(false); // 데이터 로드 완료
        } else {
          console.error('가져온 데이터가 배열이 아니거나 배열을 포함하지 않습니다:', jsonData);
          setLoading(false); // 오류 발생 시 로딩 완료
        }
      })
      .catch(error => {
        console.error('데이터 가져오기 오류:', error);
        setLoading(false); // 오류 발생 시 로딩 완료
      });
  }, []);

  // 호버 시 전체 날짜를 표시하는 사용자 정의 툴팁
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2.5 shadow-xl"> {/* ChartTooltipContent 스타일 적용 */}
          <p className="mb-1.5 text-sm font-medium text-foreground">{payload[0]?.payload.date}</p> {/* 날짜 스타일 개선 */}
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: pld.color }} // 시리즈 색상으로 인디케이터 표시
              />
              <div className="flex flex-1 justify-between leading-none">
                <span className="text-sm text-muted-foreground">{pld.name}:</span> {/* 레이블 스타일 */}
                <span className="ml-2 font-mono text-sm font-medium tabular-nums text-foreground"> {/* 값 스타일 */}
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
          backgroundColor: 'var(--skeleton-bg, #f0f0f0)', // globals.css의 .skeleton 배경색과 유사하게
          borderRadius: 'var(--radius, 0.5rem)' // globals.css의 .skeleton 테두리 반경과 유사하게
        }}
        className="skeleton" // globals.css의 .skeleton 클래스 활용 (선택 사항)
      >
        <p style={{ color: 'var(--muted-foreground, #71717a)' }}>데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300} minWidth={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // top 마진 늘려서 범례 공간 확보
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /> {/* 테마 색상 적용 */}
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
          hide={false} // 왼쪽 Y축 표시
          tickCount={5} // Y축 틱 개수 설정
          tickFormatter={(value) => value.toFixed(0)} // KOSPI 지수는 정수로 표시
          width={40} // 왼쪽 Y축 너비 확보
          stroke="hsl(var(--muted-foreground))" // 테마 색상 적용
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} // 틱 스타일
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={yDomain}
          tickFormatter={(value) => `${value.toFixed(0)} P`} // 단위 "P" 추가
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
          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }} // 커서 스타일
        />
        <Legend
          verticalAlign="top" // 상단 배치
          align="right" // 우측 정렬
          wrapperStyle={{ top: -10, right: 0, fontSize: '13px' }} // 위치 및 폰트 크기 미세 조정
          iconSize={10} // 아이콘 크기
          formatter={(value, entry) => (
            <span style={{ color: 'hsl(var(--foreground))', marginRight: '10px' }}>{value}</span> // 범례 텍스트 스타일
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
          name="KOSPI 125EMA"
          stroke={fgiColor}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Kospiema;