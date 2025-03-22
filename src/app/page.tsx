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
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">시장 모멘텀 (Market Momentum)</h2>
                    <p className="text-gray-600 dark:text-gray-300">KOSPI와 125일 이동평균선</p>
                  </div>
                  
                  {factorStatus && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.ema_spread_scaled).color }}>
                      {getStatus(factorStatus.ema_spread_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <Kospiema />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      코스피가 지난 125거래일의 이동 평균을 상회하면 긍정적인 모멘텀을 의미합니다. 반대로 이동 평균을 하회하면 투자자들이 불안해하고 있다는 신호입니다. 공포 & 탐욕 지수는 모멘텀이 둔화될 때 &apos;공포&apos; 신호로, 모멘텀이 증가할 때 &apos;탐욕&apos; 신호로 해석합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 주식 강도 차트 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">주식 강도 (Stock Strength)</h2>
                    <p className="text-gray-600 dark:text-gray-300">시장 참여자들의 강세/약세 판단 지표</p>
                  </div>
                  
                  {factorStatus && factorStatus.stock_strength_scaled !== undefined && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.stock_strength_scaled).color }}>
                      {getStatus(factorStatus.stock_strength_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <StockStrength />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      주식 강도는 시장에서 개별 주식들의 건강성을 측정하는 지표입니다. 50점을 기준으로 그 이상이면 강세 신호, 미만이면 약세 신호로 해석됩니다. 이 지표는 시장 참여자들의 종목 선택 경향과 전반적인 투자 심리를 보여줍니다. 지표가 높을수록 시장 참여자들이 낙관적이고, 지표가 낮을수록 비관적인 심리가 지배적임을 의미합니다. 공포 & 탐욕 지수는 주식 강도가 감소할 때 '공포' 신호로, 증가할 때 '탐욕' 신호로 해석합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 시장 변동성 차트 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">시장 변동성 (Market Volatility)</h2>
                    <p className="text-gray-600 dark:text-gray-300">VIX와 VIX 50일 이동평균선</p>
                  </div>
                  
                  {factorStatus && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.vix_ema_spread_scaled).color }}>
                      {getStatus(factorStatus.vix_ema_spread_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <Vixema />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      가장 잘 알려진 시장 심리 지표는 CBOE 변동성 지수(VIX)입니다. VIX는 코스피 옵션의 30일간 예상 변동성을 측정하며, 시장이 상승할 때 하락하고, 시장이 급락할 때 급등하는 경향이 있습니다. 장기적으로 보면 강세장에서는 낮고, 약세장에서는 높아지는 특징이 있습니다. 공포 & 탐욕 지수는 변동성이 증가할 때 &apos;공포&apos; 신호로 봅니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 주가 폭 차트 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">주가 폭 (Stock Price Breadth)</h2>
                    <p className="text-gray-600 dark:text-gray-300">McClellan Volume Summation Index</p>
                  </div>
                  
                  {factorStatus && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.mcclenllan_scaled).color }}>
                      {getStatus(factorStatus.mcclenllan_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <Mccl />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      맥클렐런 거래량 합산 지수(McClellan Volume Summation Index)는 상승하는 주식의 거래량과 하락하는 주식의 거래량을 비교하는 지표입니다. 시장에서 거래되는 주식 수는 수천 개에 달하며, 매일매일 매수와 매도가 이루어집니다. 이 지표가 낮거나 음수이면 약세 신호로 해석됩니다. 공포 & 탐욕 지수는 거래량 감소를 &apos;공포&apos; 신호로 봅니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 풋 & 콜 옵션 차트 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">풋 & 콜 옵션 (Put & Call Options)</h2>
                    <p className="text-gray-600 dark:text-gray-300">5일 이동평균선</p>
                  </div>
                  
                  {factorStatus && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.p_c_ema_scaled).color }}>
                      {getStatus(factorStatus.p_c_ema_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <Pcema />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      옵션은 정해진 가격과 날짜에 주식, 지수 또는 기타 금융상품을 매수(콜 옵션)하거나 매도(풋 옵션)할 수 있는 계약입니다. 풋옵션과 콜옵션의 비율이 상승하면, 투자자들이 점점 더 불안해하고 있음을 의미합니다. 일반적으로 이 비율이 1 이상이면 약세 신호로 간주됩니다. 공포 & 탐욕 지수는 풋옵션 비율이 높은 경우 &apos;공포&apos; 신호로 봅니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 안전 자산 선호도 차트 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">안전 자산 선호도 (Safe Haven Demand)</h2>
                    <p className="text-gray-600 dark:text-gray-300">채권 수익률과 주식 수익률의 차이</p>
                  </div>
                  
                  {factorStatus && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.safe_spread_scaled).color }}>
                      {getStatus(factorStatus.safe_spread_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <Safeb />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      주식은 채권보다 위험하지만, 장기적으로 높은 수익을 기대할 수 있습니다. 하지만 단기적으로는 채권이 주식을 능가할 수도 있습니다. 안전 자산 선호도 지표는 최근 20거래일 동안의 국채와 주식의 수익률 차이를 측정합니다. 투자자들이 불안할수록 채권 수익률이 상대적으로 높아지며, 공포 & 탐욕 지수는 이러한 현상을 &apos;공포&apos;  신호로 해석합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 정크본드 수요 차트 */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">정크본드 수요 (Junk Bond Demand)</h2>
                    <p className="text-gray-600 dark:text-gray-300">정크본드와 투자등급 채권 간의 수익률 차이</p>
                  </div>
                  
                  {factorStatus && (
                    <div className="px-4 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getStatus(factorStatus.junk_spread_scaled).color }}>
                      {getStatus(factorStatus.junk_spread_scaled).text}
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <Junks />
                  </div>
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      정크본드는 신용도가 낮아 디폴트(부도) 위험이 높은 채권입니다. 일반적으로 정크본드 가격이 오르면 수익률(금리)이 하락하고, 가격이 하락하면 수익률이 상승합니다. 정크본드와 투자등급 채권 간의 수익률 차이가 좁아질수록 투자자들이 더 많은 위험을 감수하고 있다는 의미이며, 공포 & 탐욕 지수는 이를 &apos;탐욕&apos; 신호로 봅니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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