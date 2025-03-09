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
}

const KospiVsFearGreedIndex: React.FC = () => {
  const [data, setData] = useState<FormattedDataItem[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/main/assets/js/json/index.json')
      .then(response => response.json())
      .then((jsonData) => {
        const dataArray = Array.isArray(jsonData) ? jsonData : jsonData.data;

        if (Array.isArray(dataArray)) {
          const formattedData: FormattedDataItem[] = dataArray.map((item: DataItem) => ({
            date: item.x,
            kospi: item.y,
            fgi: item.z
          }));

          const recentData = formattedData.slice(-60);
          setData(recentData);
        } else {
          console.error('Fetched data is not an array or does not contain an array:', jsonData);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis 
          yAxisId="left" 
          domain={[2300, 2800]} 
          tickFormatter={(value) => value.toFixed(0)} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[25, 80]} 
          tickFormatter={(value) => value.toFixed(0)} 
        />
        <Tooltip />
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