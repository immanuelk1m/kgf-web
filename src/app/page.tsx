"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/component/header';
import GaugeChart from '@/components/component/gauge';
import PreviousIndexes from "@/components/component/prev";
import MarketDataComponent from "@/components/component/markettab";
import AdsenseSide from '@/components/component/adsenseside';
import AdsenseOnfooter from '@/components/component/adsenseft';

import KospiVsFearGreedIndex from "@/components/component/linechart/kospivsindex";
import Kospiema from "@/components/component/linechart/kospiema";
import Vixema from "@/components/component/linechart/vixema";
import Mccl from "@/components/component/linechart/mcclenllan";
import Pcema from "@/components/component/linechart/pcema";
import Safeb from "@/components/component/linechart/safebond";
import Junks from "@/components/component/linechart/junk";
import StockStrength from "@/components/component/linechart/stockstrength";

import "@/styles/fonts.css";
import MarketMomentumSection from '@/components/component/market-momentum-section';
import StockStrengthSection from '@/components/component/stock-strength-section';
import MarketVolatilitySection from '@/components/component/market-volatility-section';
import StockPriceBreadthSection from '@/components/component/stock-price-breadth-section';
import PutCallOptionsSection from '@/components/component/put-call-options-section';
import SafeHavenDemandSection from '@/components/component/safe-haven-demand-section';
import JunkBondDemandSection from '@/components/component/junk-bond-demand-section';

function App() {
  const [formattedDate, setFormattedDate] = useState("");
  const [activeComponent, setActiveComponent] = useState('gauge');
  interface FactorStatus {
    ema_spread_scaled: number;
    vix_ema_spread_scaled: number;
    mcclenllan_scaled: number;
    p_c_ema_scaled: number;
    safe_spread_scaled: number;
    junk_spread_scaled: number;
    stock_strength_scaled: number;
  }

  const [factorStatus, setFactorStatus] = useState<FactorStatus | null>(null);

  // 날짜 설정
  useEffect(() => {
    const today = new Date();
    setFormattedDate(`${today.getMonth() + 1}월 ${today.getDate()}일`);
  }, []);

  // JSON 데이터 가져오기
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/factor_status.json')
      .then(response => response.json())
      .then(data => setFactorStatus(data))
      .catch(error => console.error('Error fetching factor status:', error));
  }, []);

  // 상태와 색상 결정 함수
  const getStatus = (value: number) => {
    if (value < 0.2) {
      return { text: '매우 나쁨', color: '#ee1f25' };
    } else if (value < 0.4) {
      return { text: '나쁨', color: '#fdae19' };
    } else if (value < 0.6) {
      return { text: '보통', color: '#f3eb0c' };
    } else if (value < 0.8) {
      return { text: '좋음', color: '#b0d136' };
    } else {
      return { text: '매우 좋음', color: '#0f9747' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex w-full max-w-[1600px] mx-auto">
        {/* 왼쪽 사이드바 광고 */}
        <div className="hidden xl:block w-64 lg:w-72 sticky top-0 h-screen pt-8">
          <div className="h-full flex flex-col items-center">
            <div className="w-full p-4">
              <AdsenseSide />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 py-6">
          <Header />
          
          {/* 마켓 데이터 */}
          <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
            <MarketDataComponent />
          </div>
          
          {/* 메인 섹션 - 공포 탐욕 지수 */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">코스피 공포 & 탐욕 지수</h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 md:text-lg">
                    CNN FEAR & GREED INDEX를 코스피 시장에 맞게 재구성하였습니다
                  </p>
                </div>
                
                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-sm">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeComponent === 'gauge' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveComponent('gauge')}
                  >
                    지수 게이지
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeComponent === 'timeline' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveComponent('timeline')}
                  >
                    타임라인
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {activeComponent === 'gauge' && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                      <GaugeChart />
                      <p className="mt-4 text-center text-lg font-medium text-gray-700 dark:text-gray-200">{formattedDate} - 오늘의 코스피 공포탐욕 지수는?</p>
                    </div>
                    <div className="hidden md:block">
                      <PreviousIndexes />
                    </div>
                  </div>
                )}
                
                {activeComponent === 'timeline' && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                    <KospiVsFearGreedIndex />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 모바일 전용 광고 */}
          <div className="md:hidden my-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <AdsenseSide />
          </div>
          
          {/* 차트 섹션들 */}
          <div className="mt-8 space-y-8">
            {/* 시장 모멘텀 차트 */}
            <MarketMomentumSection factorStatus={factorStatus} getStatus={getStatus} />

            {/* 주식 강도 차트 */}
            <StockStrengthSection factorStatus={factorStatus} getStatus={getStatus} />

            {/* 시장 변동성 차트 */}
            <MarketVolatilitySection factorStatus={factorStatus} getStatus={getStatus} />

            {/* 주가 폭 차트 */}
            <StockPriceBreadthSection factorStatus={factorStatus} getStatus={getStatus} />

            {/* 풋 & 콜 옵션 차트 */}
            <PutCallOptionsSection factorStatus={factorStatus} getStatus={getStatus} />

            {/* 안전 자산 선호도 차트 */}
            <SafeHavenDemandSection factorStatus={factorStatus} getStatus={getStatus} />

            {/* 정크본드 수요 차트 */}
            <JunkBondDemandSection factorStatus={factorStatus} getStatus={getStatus} />
          </div>
          
          {/* 하단 광고 배너 */}
          <div className="mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 min-h-[250px]">
              <AdsenseOnfooter />
            </div>
          </div>
        </div>
        
        {/* 오른쪽 사이드바 광고 */}
        <div className="hidden xl:block w-64 lg:w-72 sticky top-0 h-screen pt-8">
          <div className="h-full flex flex-col items-center">
            <div className="w-full p-4">
              <AdsenseSide />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;