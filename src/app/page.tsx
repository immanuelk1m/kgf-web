"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/component/header';
import GaugeChart from '@/components/component/gauge';
import KospiVsFearGreedIndex from "@/components/component/kospivsindex";
import PreviousIndexes from "@/components/component/prev";
import MarketDataComponent from "@/components/component/markettab";
import AdsenseSide from '@/components/component/adsenseside';
import AdsenseOnfooter from '@/components/component/adsenseft';
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

  useEffect(() => {
    const today = new Date();
    setFormattedDate(`${today.getMonth() + 1}월 ${today.getDate()}일`);
  }, []);

  return (
    <>
      <div className="flex w-full">
        {/* 좌측 광고: xl 이상에서 표시, 세로 가운데 정렬, sticky */}
        <div className="hidden xl:flex xl:items-center xl:justify-end flex-1 sticky top-0 h-screen">
          <div className="w-64">
            <AdsenseSide />
          </div>
        </div>

        {/* 메인 콘텐츠: 최대 너비 1280px로 중앙 정렬 */}
        <div className="w-full max-w-[1280px]">
          <Header />
          <div className="h-8"></div>

          <div className={`${containerStyle} bg-gray-100`}>
            <MarketDataComponent />
          </div>

          <div className="flex flex-col w-full md:flex-row items-start justify-start ${containerStyle}">
            <div className="flex flex-col w-full ${cardStyle} p-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-800">코스피 공포 & 탐욕 지수</h1>
              <p className="mt-4 text-gray-600 md:text-xl">
                CNN FEAR & GREED INDEX를 코스피 시장에 맞게 재구성하였습니다
              </p>

              <div className="flex flex-col md:flex-row mt-6">
                <div className="w-full md:w-2/3 p-4">
                  <div className="flex flex-col items-center bg-gray-50 rounded-lg shadow p-4 transition transform hover:scale-105">
                    <GaugeChart />
                    <p className="mt-4 text-lg font-semibold text-gray-700">{formattedDate} - 오늘의 코스피 공포탐욕 지수는?</p>
                  </div>
                </div>
                <div className="md:w-1/3 hidden md:block p-4">
                  <PreviousIndexes />
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-300" />

              <div className="border-2 border-gray-200 p-6 bg-gray-50 rounded-lg shadow transition hover:shadow-lg">
                <KospiVsFearGreedIndex />
              </div>

              <hr className="my-8 border-t border-gray-300" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center p-4 bg-gray-100 min-h-[300px] rounded-lg">
            <AdsenseOnfooter />
          </div>
        </div>

        {/* 우측 광고: xl 이상에서 표시, 세로 가운데 정렬, sticky */}
        <div className="hidden xl:flex xl:items-center xl:justify-start flex-1 sticky top-0 h-screen">
          <div className="w-64">
            <AdsenseSide />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;