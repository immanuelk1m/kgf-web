'use client';

import BuyCoffee from '@/components/component/buycoff';
import React, { useState, useEffect } from 'react';

interface MarketData {
    value: number;
    change: number;
}

const containerStyle = `
  @apply max-w-[1440px] mx-auto p-2 pt-8;
  @media (max-width: 1440px) {
    @apply px-0;
  }
`;

const MarketDataComponent = () => {
    const [marketData, setMarketData] = useState<{
        kospi: MarketData;
        kosdaq: MarketData;
        wond: MarketData;
    }>({
        kospi: { value: 0, change: 0 },
        kosdaq: { value: 0, change: 0 },
        wond: { value: 0, change: 0 },
    });

    const [fearGreedIndex, setFearGreedIndex] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const [kospiRes, kosdaqRes, wondRes] = await Promise.all([
                fetch('https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?range=2d&interval=1d'),
                fetch('https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/%5EKQ11?range=2d&interval=1d'),
                fetch('https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?range=2d&interval=1d')
            ]);
            
            const [kospiData, kosdaqData, wondData] = await Promise.all([
                kospiRes.json(),
                kosdaqRes.json(),
                wondRes.json()
            ]);

            const getLatestData = (data: any): MarketData => {
                const quote = data.chart.result[0].indicators.quote[0];
                const latestIndex = quote.close.length - 1;
                const previousClose = data.chart.result[0].meta.chartPreviousClose;
                const latestClose = quote.close[latestIndex];
                const change = ((latestClose - previousClose) / previousClose) * 100;

                return {
                    value: latestClose,
                    change: change
                };
            };

            setMarketData({
                kospi: getLatestData(kospiData),
                kosdaq: getLatestData(kosdaqData),
                wond: getLatestData(wondData)
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchFearGreedIndex = async () => {
        try {
            const response = await fetch('https://immanuelk1m.github.io/kospi-feargreedindex/assets/js/json/value.json');
            const data = await response.json();
            setFearGreedIndex(data.current);
        } catch (error) {
            console.error("Error fetching Fear & Greed Index:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchFearGreedIndex();
        const interval = setInterval(() => {
            fetchData();
            fetchFearGreedIndex();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const renderChange = (change: number) => {
        const isPositive = change > 0;
        return (
            <span className={`flex items-center p-2 ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                {change.toFixed(2)}%
                {isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 fill-current text-red-500" viewBox="0 0 24 24">
                        <polygon points="12 2 22 22 2 22 12 2" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 fill-current text-blue-500" viewBox="0 0 24 24">
                        <polygon points="12 22 22 2 2 2 12 22" />
                    </svg>
                )}
            </span>
        );
    };

    return (
        <div className={`${containerStyle}`}>
          <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap">
            
            <div className="markets mb-4 flex flex-col w-full md:w-1/3 p-2 md:border-r md:border-gray-300">
              <h3 className="text-xl font-semibold mb-2">Markets</h3>
              <table className="min-w-full bg-white rounded-md">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">코스피</td>
                    <td className="p-2">{marketData.kospi.value.toFixed(2)}</td>
                    <td className="p-2">{renderChange(marketData.kospi.change)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">코스닥</td>
                    <td className="p-2">{marketData.kosdaq.value.toFixed(2)}</td>
                    <td className="p-2">{renderChange(marketData.kosdaq.change)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">원/달러</td>
                    <td className="p-2">{marketData.wond.value.toFixed(2)}</td>
                    <td className="p-2">{renderChange(marketData.wond.change)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="fear-greed-index flex flex-col w-full md:w-1/3 p-2 hidden md:flex md:border-r md:border-gray-300">
              <h3 className="text-xl font-semibold mb-2">Fear & Greed Index</h3>
              <div className="index flex justify-center items-center h-full">
                <span className="text-6xl font-bold">{fearGreedIndex !== null ? fearGreedIndex : 'Loading...'}</span>
              </div>
              <div className="text-center mt-4">Neutral sentiment is driving the US market</div>
            </div>
        
            <div className="flex flex-col w-full md:w-1/3 p-2">
              <h3 className="text-xl font-semibold mb-2">커피 한 잔 후원하기!</h3>
              <div className="bg-[#FEE500] rounded-lg p-4 flex items-center justify-center min-h-[150px]">
                <BuyCoffee/>
              </div>
            </div>
          </div>
        </div>
    );
};

export default MarketDataComponent;