'use client';

import BuyCoffee from '@/components/component/buycoff';
import React, { useState, useEffect } from 'react';

interface MarketData {
    value: number;
    change: number;
}

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
            const response = await fetch('/.netlify/functions/fetchMarketData');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMarketData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchFearGreedIndex = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/value.json');
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

    const getStatusText = (value: number) => {
        if (value < 25) return '극도의 공포';
        if (value < 45) return '공포';
        if (value < 55) return '중립';
        if (value < 75) return '탐욕';
        return '극도의 탐욕';
    };

    const getStatusColor = (value: number) => {
        if (value < 25) return 'text-red-600 dark:text-red-400';
        if (value < 45) return 'text-orange-500 dark:text-orange-400';
        if (value < 55) return 'text-yellow-500 dark:text-yellow-400';
        if (value < 75) return 'text-green-500 dark:text-green-400';
        return 'text-emerald-600 dark:text-emerald-400';
    };

    const renderChange = (change: number) => {
        const isPositive = change > 0;
        return (
            <span className={`flex items-center ${isPositive ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {change.toFixed(2)}%
                {isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <polygon points="12 2 22 22 2 22 12 2" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <polygon points="12 22 22 2 2 2 12 22" />
                    </svg>
                )}
            </span>
        );
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 마켓 데이터 카드 */}
                <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                        <h3 className="text-xl font-bold text-white">마켓 데이터</h3>
                    </div>
                    <div className="p-4">
                        <div className="divide-y divide-gray-200 dark:divide-gray-600">
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">코스피</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-800 dark:text-gray-200 font-bold">{marketData.kospi.value.toFixed(2)}</span>
                                    {renderChange(marketData.kospi.change)}
                                </div>
                            </div>
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">코스닥</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-800 dark:text-gray-200 font-bold">{marketData.kosdaq.value.toFixed(2)}</span>
                                    {renderChange(marketData.kosdaq.change)}
                                </div>
                            </div>
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">원/달러</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-800 dark:text-gray-200 font-bold">{marketData.wond.value.toFixed(2)}</span>
                                    {renderChange(marketData.wond.change)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 공포 탐욕 지수 카드 */}
                <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                        <h3 className="text-xl font-bold text-white">공포 & 탐욕 지수</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center">
                        {fearGreedIndex !== null ? (
                            <>
                                <div className="text-6xl font-bold mb-2 mt-2 transition-all duration-300 ease-in-out transform hover:scale-110 select-none">
                                    <span className={getStatusColor(fearGreedIndex)}>{fearGreedIndex.toFixed(1)}</span>
                                </div>
                                <div className={`text-center mt-2 font-medium ${getStatusColor(fearGreedIndex)}`}>
                                    {getStatusText(fearGreedIndex)}
                                </div>
                                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">현재 코스피 시장 심리 지수</p>
                            </>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 animate-pulse">로딩 중...</div>
                        )}
                    </div>
                </div>
                
                {/* 커피 카드 */}
                <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-4">
                        <h3 className="text-xl font-bold text-white">커피 한 잔 사주기</h3>
                    </div>
                    <div className="p-4 flex items-center justify-center">
                        <BuyCoffee />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketDataComponent;