import React from 'react';
import Header from '@/components/component/header';
import GaugeChart from '@/components/component/gauge';
import KospiVsFearGreedIndex from "@/components/component/kospivsindex";
import PreviousIndexes from "@/components/component/prev";
import MarketDataComponent from "@/components/component/markettab";
import AdsenseSide from '@/components/component/adsenseside';
import AdsenseOnfooter from '@/components/component/adsenseft';
import "@/styles/fonts.css";

const containerStyle = `
  @apply max-w-[1280px] mx-auto p-2;
  @media (max-width: 1280px) {
    @apply px-0;
  }
`;

function App() {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  return (
    <>
      <Header />
      
      <div className="h-10"></div>

      <div className={`border-2 border-gray-300 ${containerStyle}`}>
        <MarketDataComponent />
      </div>
      
      <div className={`flex flex-col md:flex-row items-start justify-start min-h-screen ${containerStyle}`}>
        <div className="flex flex-col w-full md:w-4/5 p-8 border-2 border-gray-300">
          
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">코스피 공포 & 탐욕 지수</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
          CNN FEAR & GREED INDEX를 코스피 시장에 맞게 재구성하였습니다
          </p>

          <div className="flex flex-col md:flex-row mt-4">
            <div className="md:w-2/3 p-4">
              <div className="flex flex-col items-center">
                <GaugeChart />
                <p className="mt-2 text-lg font-semibold text-center">{formattedDate} 오늘의 코스피 공포탐욕 지수는??</p>
              </div> 
            </div>
            <div className="md:w-1/3 hidden md:block pt-32 md:ml-4 p-4">
              <PreviousIndexes />
            </div>
          </div>
          
          <hr className="my-4 border-t-2 border-gray-300" />

          <div className="mt-4 border-2 border-gray-300 p-4">
            <KospiVsFearGreedIndex />
          </div>

          <hr className="my-8 border-t border-gray-300" />
          
         

        </div>
        


        <div className="hidden md:block md:w-1/5 bg-white border-2 border-gray-300 p-4 md:ml-4">
          <AdsenseSide/>
        </div>
      </div>
       
       
      <div style={{ height: 'auto', minHeight: '300px' }}>
            <div className="h-full justify-center">
              <AdsenseOnfooter/>
            </div>
          </div>
    </>
  );
}

export default App;



