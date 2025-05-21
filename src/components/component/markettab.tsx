'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'; // 아이콘 추가

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
        if (value < 25) return 'text-negative'; // 극도의 공포
        if (value < 45) return 'text-negative/80'; // 공포 (negative보다 약간 연하게)
        if (value < 55) return 'text-neutral-foreground'; // 중립
        if (value < 75) return 'text-positive/80'; // 탐욕 (positive보다 약간 연하게)
        return 'text-positive'; // 극도의 탐욕
    };

    const renderChange = (change: number) => {
        const isPositive = change > 0;
        // 지침에 따라 상승은 positive(녹색 계열), 하락은 negative(적색 계열) 사용
        return (
            <span className={`flex items-center text-sm ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? <ArrowUpRight className="mr-0.5 h-4 w-4" /> : <ArrowDownRight className="mr-0.5 h-4 w-4" />}
                {Math.abs(change).toFixed(2)}%
            </span>
        );
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 gap-6">
                {/* 마켓 데이터 카드 */}
                <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden border border-border"> {/* bg-card, border-border 적용 */}
                    <div className="bg-accent dark:bg-accent p-4 border-b border-border"> {/* bg-accent, border-border 적용 */}
                        <h3 className="text-lg font-semibold text-accent-foreground">마켓 데이터</h3> {/* text-accent-foreground 적용 */}
                    </div>
                    <div className="p-4">
                        <div className="divide-y divide-border"> {/* divide-border 적용 */}
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-muted-foreground font-medium">코스피</span> {/* text-muted-foreground 적용 */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground font-bold">{marketData.kospi.value.toFixed(2)}</span> {/* text-foreground 적용 */}
                                    {renderChange(marketData.kospi.change)}
                                </div>
                            </div>
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-muted-foreground font-medium">코스닥</span> {/* text-muted-foreground 적용 */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground font-bold">{marketData.kosdaq.value.toFixed(2)}</span> {/* text-foreground 적용 */}
                                    {renderChange(marketData.kosdaq.change)}
                                </div>
                            </div>
                            <div className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-muted-foreground font-medium">원/달러</span> {/* text-muted-foreground 적용 */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground font-bold">{marketData.wond.value.toFixed(2)}</span> {/* text-foreground 적용 */}
                                    {renderChange(marketData.wond.change)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 공포 탐욕 지수 카드 */}
                <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden border border-border"> {/* bg-card, border-border 적용 */}
                    <div className="bg-accent dark:bg-accent p-4 border-b border-border"> {/* bg-accent, border-border 적용 */}
                        <h3 className="text-lg font-semibold text-accent-foreground">공포 & 탐욕 지수</h3> {/* text-accent-foreground 적용 */}
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center">
                        {fearGreedIndex !== null ? (
                            <>
                                <div className="text-5xl font-bold mb-2 transition-all duration-300 ease-in-out transform hover:scale-105 select-none">
                                    <span className="text-gray-900">{fearGreedIndex.toFixed(1)}</span>
                                </div>
                                <div className={`text-center mt-2 text-lg font-medium ${getStatusColor(fearGreedIndex)}`}>
                                    {getStatusText(fearGreedIndex)}
                                </div>
                                <p className="text-center mt-4 text-sm text-muted-foreground">현재 코스피 시장 심리 지수</p> {/* text-muted-foreground 적용 */}
                            </>
                        ) : (
                            <div className="text-muted-foreground animate-pulse">로딩 중...</div> /* text-muted-foreground 적용 */
                        )
                        }
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default MarketDataComponent;