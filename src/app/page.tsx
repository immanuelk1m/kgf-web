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

import "@/styles/fonts.css";

const containerStyle = `
  max-w-[1280px] mx-auto p-4 
  @apply bg-white shadow-lg rounded-lg 
  transition-transform transform hover:scale-105;
  @media (max-width: 1280px) {
    px-2;
  }
`;

const cardStyle = `
  border-2 border-gray-300 rounded-lg shadow-sm 
  p-6 transition hover:shadow-md;
`;

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
    <>
      <div className="flex w-full min-h-screen">
        <div className="hidden xl:block flex-1">
          <div className="sticky top-8 pt-8 flex items-center justify-center">
            <div className="w-64">
              <AdsenseSide />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1280px] min-h-screen flex flex-col">
          <Header />
          <div className="h-8"></div>

          <div className={`${containerStyle} bg-gray-100`}>
            <MarketDataComponent />
          </div>

          <div className="flex flex-col w-full md:flex-row items-start justify-start ${containerStyle}">
            <div className="flex flex-col w-full ${cardStyle} p-4 relative">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-800">코스피 공포 & 탐욕 지수</h1>
              <p className="mt-4 text-gray-600 md:text-xl">
                CNN FEAR & GREED INDEX를 코스피 시장에 맞게 재구성하였습니다
              </p>

              <div className="absolute top-2 right-2 md:top-4 md:right-4">
                <div className="flex items-center justify-center bg-[#f0f0f0] rounded-full border border-[#d1d5db] shadow-[0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden">
                  <div
                    className={`px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-sans cursor-pointer transition-all duration-300 ${
                      activeComponent === 'gauge' ? 'bg-white text-[#374151] font-bold' : 'bg-[#e5e7eb] text-[#9ca3af]'
                    }`}
                    onClick={() => setActiveComponent('gauge')}
                  >
                    지수 게이지
                  </div>
                  <div
                    className={`px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-sans cursor-pointer transition-all duration-300 ${
                      activeComponent === 'timeline' ? 'bg-white text-[#374151] font-bold' : 'bg-[#e5e7eb] text-[#9ca3af]'
                    }`}
                    onClick={() => setActiveComponent('timeline')}
                  >
                    타임라인
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row mt-6">
                {activeComponent === 'gauge' && (
                  <>
                    <div className="w-full md:w-2/3 p-4">
                      <div className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-4 transition transform hover:scale-105">
                        <GaugeChart />
                        <p className="mt-4 text-lg font-semibold text-gray-700">{formattedDate} - 오늘의 코스피 공포탐욕 지수는?</p>
                      </div>
                    </div>
                    <div className="md:w-1/3 hidden md:block p-4">
                      <PreviousIndexes />
                    </div>
                  </>
                )}
                {activeComponent === 'timeline' && (
                  <div className="w-full p-4">
                    <div className="border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                      <KospiVsFearGreedIndex />
                    </div>
                  </div>
                )}
              </div>
              <hr className="my-8 border-t border-gray-300" />
            </div>
          </div>

          {/* Kospiema 차트 */}
          <div className="w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-800">시장 모멘텀 (Market Momentum)</h1>
                <h3 className="text-lg font-semibold text-gray-800">KOSPI와 125일 이동평균선</h3>
              </div>
              {factorStatus && (
                <div className="px-2 py-1 rounded" style={{ backgroundColor: getStatus(factorStatus.ema_spread_scaled).color }}>
                  <span className="text-white font-bold">{getStatus(factorStatus.ema_spread_scaled).text}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <Kospiema />
              </div>
              <div className="w-full md:w-2/5 p-4">
                <div className="border-2 border-gray-200 p-4 bg-white rounded-lg shadow text-sm">
                  <p className="mt-2 text-gray-600">
                    코스피가 지난 125거래일의 이동 평균을 상회하면 긍정적인 모멘텀을 의미합니다. 반대로 이동 평균을 하회하면 투자자들이 불안해하고 있다는 신호입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vixema 차트 */}
          <div className="w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-800">시장 변동성 (Market Volatility)</h1>
                <h3 className="text-lg font-semibold text-gray-800">VIX와 VIX 50일 이동평균선</h3>
              </div>
              {factorStatus && (
                <div className="px-2 py-1 rounded" style={{ backgroundColor: getStatus(factorStatus.vix_ema_spread_scaled).color }}>
                  <span className="text-white font-bold">{getStatus(factorStatus.vix_ema_spread_scaled).text}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <Vixema />
              </div>
              <div className="w-full md:w-2/5 p-4">
                <div className="border-2 border-gray-200 p-4 bg-white rounded-lg shadow text-sm">
                  <p className="mt-2 text-gray-600">
                    VIX는 코스피 옵션의 30일간 예상 변동성을 측정하며, 시장이 상승할 때 하락하고, 시장이 급락할 때 급등하는 경향이 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mccl 차트 */}
          <div className="w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-800">주가 폭 (Stock Price Breadth)</h1>
                <h3 className="text-lg font-semibold text-gray-800">McClellan Volume Summation Index</h3>
              </div>
              {factorStatus && (
                <div className="px-2 py-1 rounded" style={{ backgroundColor: getStatus(factorStatus.mcclenllan_scaled).color }}>
                  <span className="text-white font-bold">{getStatus(factorStatus.mcclenllan_scaled).text}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <Mccl />
              </div>
              <div className="w-full md:w-2/5 p-4">
                <div className="border-2 border-gray-200 p-4 bg-white rounded-lg shadow text-sm">
                  <p className="mt-2 text-gray-600">
                    맥클렐런 거래량 합산 지수는 상승하는 주식의 거래량과 하락하는 주식의 거래량을 비교하는 지표입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pcema 차트 */}
          <div className="w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-800">풋 & 콜 옵션 (Put & Call Options)</h1>
                <h3 className="text-lg font-semibold text-gray-800">5일 이동평균선</h3>
              </div>
              {factorStatus && (
                <div className="px-2 py-1 rounded" style={{ backgroundColor: getStatus(factorStatus.p_c_ema_scaled).color }}>
                  <span className="text-white font-bold">{getStatus(factorStatus.p_c_ema_scaled).text}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <Pcema />
              </div>
              <div className="w-full md:w-2/5 p-4">
                <div className="border-2 border-gray-200 p-4 bg-white rounded-lg shadow text-sm">
                  <p className="mt-2 text-gray-600">
                    풋옵션과 콜옵션의 비율이 상승하면, 투자자들이 점점 더 불안해하고 있음을 의미합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Safeb 차트 */}
          <div className="w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-800">안전 자산 선호도 (Safe Haven Demand)</h1>
                <h3 className="text-lg font-semibold text-gray-800">채권 수익률과 주식 수익률의 차이</h3>
              </div>
              {factorStatus && (
                <div className="px-2 py-1 rounded" style={{ backgroundColor: getStatus(factorStatus.safe_spread_scaled).color }}>
                  <span className="text-white font-bold">{getStatus(factorStatus.safe_spread_scaled).text}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <Safeb />
              </div>
              <div className="w-full md:w-2/5 p-4">
                <div className="border-2 border-gray-200 p-4 bg-white rounded-lg shadow text-sm">
                  <p className="mt-2 text-gray-600">
                    투자자들이 불안할수록 채권 수익률이 상대적으로 높아지며, 공포 & 탐욕 지수는 이를 '공포' 신호로 해석합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Junks 차트 */}
          <div className="w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-800">정크본드 수요 (Junk Bond Demand)</h1>
                <h3 className="text-lg font-semibold text-gray-800">정크본드와 투자등급 채권 간의 수익률 차이</h3>
              </div>
              {factorStatus && (
                <div className="px-2 py-1 rounded" style={{ backgroundColor: getStatus(factorStatus.junk_spread_scaled).color }}>
                  <span className="text-white font-bold">{getStatus(factorStatus.junk_spread_scaled).text}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <Junks />
              </div>
              <div className="w-full md:w-2/5 p-4">
                <div className="border-2 border-gray-200 p-4 bg-white rounded-lg shadow text-sm">
                  <p className="mt-2 text-gray-600">
                    정크본드와 투자등급 채권 간의 수익률 차이가 좁아질수록 투자자들이 더 많은 위험을 감수하고 있다는 의미입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto w-full bg-gray-100 rounded-lg p-0">
            <div className="w-full h-full min-h-[480px] p-0">
              <AdsenseOnfooter />
            </div>
          </div>
        </div>

        <div className="hidden xl:block flex-1">
          <div className="sticky top-8 pt-8 flex items-center justify-center">
            <div className="w-64">
              <AdsenseSide />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;