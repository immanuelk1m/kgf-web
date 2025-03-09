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
  month: string; // New field for month display
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
            // Parse the date to extract month
            let monthStr = '';
            try {
              // Assuming format is YYYY-MM-DD
              const parts = item.x.split('-');
              if (parts.length >= 2) {
                // Get month name (Korean)
                const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
                const monthIndex = parseInt(parts[1], 10) - 1;
                monthStr = monthNames[monthIndex];
              }
            } catch (e) {
              console.error('Error parsing date:', item.x, e);
              monthStr = item.x; // Fallback to original string
            }

            return {
              date: item.x,
              kospi: item.y,
              fgi: item.z,
              month: monthStr
            };
          });

          // Get the last 50 data points
          const recentData = formattedData.slice(-50);
          
          // Filter data to show only one entry per month
          // This prevents duplicate month labels on the x-axis
          const monthsShown = new Set();
          const filteredData = recentData.filter((item, index) => {
            // Always keep the first and last data point
            if (index === 0 || index === recentData.length - 1) return true;
            
            // For others, only keep if we haven't seen this month yet
            if (!monthsShown.has(item.month)) {
              monthsShown.add(item.month);
              return true;
            }
            
            return false;
          });
          
          setData(recentData);
        } else {
          console.error('Fetched data is not an array or does not contain an array:', jsonData);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Custom tooltip formatter to show the full date when hovering
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
          dataKey="date" 
          tickFormatter={(value) => {
            // Extract month from date string (format: YYYY-MM-DD)
            try {
              const parts = value.split('-');
              if (parts.length >= 2) {
                return `${parts[1]}월`;
              }
              return value;
            } catch (e) {
              return value;
            }
          }}
          // Show fewer ticks to avoid overcrowding
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