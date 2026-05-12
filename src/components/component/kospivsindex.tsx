'use client';

import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DataItem {
  x: string;
  y: number;
  z: number;
}

interface FormattedDataItem {
  date: string;
  kospi: number;
  fgi: number;
}

const KospiVsFearGreedIndex: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/index.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const dataArray = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (Array.isArray(dataArray)) {
          const formattedData: FormattedDataItem[] = dataArray.map((item: DataItem) => ({
            date: item.x,
            kospi: item.y,
            fgi: item.z,
          }));

          if (!cancelled) {
            setData(formattedData.slice(-60));
          }
        } else {
          throw new Error('Timeline source did not return an array');
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : '차트 데이터를 불러오지 못했습니다.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <div className="flex h-[360px] items-center justify-center bg-neutral-50 text-sm text-neutral-500">{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={420}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" domain={[2500, 3000]} tick={{ fontSize: 11 }} tickFormatter={formatChartNumber} />
        <YAxis yAxisId="right" orientation="right" domain={[30, 80]} tick={{ fontSize: 11 }} tickFormatter={formatChartNumber} />
        <Tooltip formatter={(value) => formatTooltipValue(value)} />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="kospi" name="KOSPI" stroke="#111827" strokeWidth={2.5} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="fgi" name="Fear & Greed Index" stroke="#b91c1c" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

function formatChartNumber(value: number) {
  return value.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatTooltipValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? formatChartNumber(value) : String(value);
}

export default KospiVsFearGreedIndex;
