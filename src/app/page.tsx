"use client";

import React, { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react'; // HelpCircle 아이콘 import 추가
import Header from '@/components/component/header';
import GaugeChart from '@/components/component/gauge';
import PreviousIndexes from "@/components/component/prev";
import MarketDataComponent from "@/components/component/markettab";
import { Button } from "@/components/ui/button"; // Button 컴포넌트 import 추가
// import AdsenseSide from '@/components/component/adsenseside';

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
  const [activeChartTab, setActiveChartTab] = useState('sentiment'); // P1 작업: 차트 탭 상태 추가
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
  const [isLoadingData, setIsLoadingData] = useState(true); // 로딩 상태 추가
  const [fetchError, setFetchError] = useState<string | null>(null); // 오류 메시지 상태 추가

  // 날짜 설정
  useEffect(() => {
    const today = new Date();
    setFormattedDate(`${today.getMonth() + 1}월 ${today.getDate()}일`);
  }, []);

  // JSON 데이터 가져오기
  useEffect(() => {
    setIsLoadingData(true); // 데이터 가져오기 시작
    setFetchError(null); // 이전 오류 메시지 초기화
    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/factor_status.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setFactorStatus(data);
        setIsLoadingData(false); // 데이터 가져오기 완료
      })
      .catch(error => {
        console.error('Error fetching factor status:', error);
        setFetchError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'); // 오류 메시지 설정
        setIsLoadingData(false); // 데이터 가져오기 완료 (오류 발생)
      });
  }, []);

  // 상태와 색상 결정 함수
  const getStatus = (value: number) => {
    if (value < 0.2) {
      return { text: '매우 나쁨', color: 'text-negative-foreground bg-negative', className: 'bg-negative text-negative-foreground', contribution: '극도의 공포 기여' };
    } else if (value < 0.4) {
      return { text: '나쁨', color: 'text-negative-foreground bg-negative/70', className: 'bg-negative/70 text-negative-foreground', contribution: '공포 기여' };
    } else if (value < 0.6) {
      return { text: '보통', color: 'text-neutral-foreground bg-neutral', className: 'bg-neutral text-neutral-foreground', contribution: '중립 기여' };
    } else if (value < 0.8) {
      return { text: '좋음', color: 'text-positive-foreground bg-positive/70', className: 'bg-positive/70 text-positive-foreground', contribution: '탐욕 기여' };
    } else {
      return { text: '매우 좋음', color: 'text-positive-foreground bg-positive', className: 'bg-positive text-positive-foreground', contribution: '극도의 탐욕 기여' };
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground"> {/* globals.css 스타일 따르도록 변경 */}
      <Header />
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 gap-8 max-w-[1600px]">
        {/* 메인 콘텐츠 */}
        <div className="space-y-8 fade-in-up">
          {/* 마켓 데이터 */}
          <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden border border-border p-6 mb-8"> {/* card, border 스타일 적용 */}
            <MarketDataComponent />
          </div>
          
          {/* 메인 섹션 - 공포 탐욕 지수 */}
          <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden border border-border p-6 mb-8"> {/* card, border 스타일 적용 */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold md:text-4xl text-foreground">코스피 공포 & 탐욕 지수</h1> {/* h1 스타일 적용 */}
                  <p className="mt-2 text-primary dark:text-primary-foreground font-semibold text-xs bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-md inline-block">
                    CNN FEAR & GREED INDEX를 코스피 시장에 맞게 재구성하였습니다
                  </p>
                </div>
                
                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-inner">
                  <Button
                    variant={activeComponent === 'gauge' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveComponent('gauge')}
                  >
                    지수 게이지
                  </Button>
                  <Button
                    variant={activeComponent === 'timeline' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveComponent('timeline')}
                  >
                    타임라인
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                {activeComponent === 'gauge' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-inner flex flex-col items-center">
                      <div className="text-center mb-4">
                        <p className="text-lg font-semibold text-foreground">{formattedDate}</p> {/* text-foreground 적용 */}
                        <h2 className="text-2xl font-semibold md:text-3xl text-foreground">오늘의 코스피 공포 & 탐욕 지수</h2> {/* h2 스타일 적용 */}
                      </div>
                      <GaugeChart />
                      {/* 지수 설명 섹션 시작 */}
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h3 className="text-lg font-medium md:text-xl text-foreground mb-2 flex items-center"> {/* h3 스타일 적용, text-foreground */}
                          <HelpCircle className="w-5 h-5 mr-2 text-muted-foreground" /> {/* 아이콘 추가 및 스타일링 */}
                          코스피 공포 & 탐욕 지수란?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3"> {/* text-muted-foreground 적용 */}
                          시장의 심리를 나타내는 지표로, 투자자들이 현재 시장에 대해 얼마나 공포를 느끼는지 또는 얼마나 탐욕적인지를 보여줍니다.
                          CNN의 Fear & Greed Index를 기반으로 코스피 시장의 특성을 반영하여 재구성되었습니다.
                        </p>
                        <div className="space-y-2.5 mt-3"> {/* space-y 증가 및 mt 추가 */}
                          <div className="flex items-start">
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-3 h-3 rounded-full bg-negative"></span>
                            <p className="text-xs text-muted-foreground leading-relaxed tracking-wide"> {/* text-muted-foreground 적용 */}
                              <span className="font-bold text-negative-foreground">0-20 (극도의 공포):</span> 주가가 과도하게 하락하여 매수 기회일 수 있습니다.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-3 h-3 rounded-full bg-negative/70"></span>
                            <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">
                              <span className="font-bold text-negative-foreground/80">20-40 (공포):</span> 투자 심리가 위축된 상태입니다.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-3 h-3 rounded-full bg-neutral"></span>
                            <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">
                              <span className="font-bold text-neutral-foreground">40-60 (중립):</span> 시장이 균형을 이루고 있는 상태입니다.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-3 h-3 rounded-full bg-positive/70"></span>
                            <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">
                              <span className="font-bold text-positive-foreground/80">60-80 (탐욕):</span> 투자 열기가 높은 상태입니다.
                            </p>
                          </div>
                          <div className="flex items-start">
                            <span className="mr-2 mt-0.5 flex-shrink-0 w-3 h-3 rounded-full bg-positive"></span>
                            <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">
                              <span className="font-bold text-positive-foreground">80-100 (극도의 탐욕):</span> 주가가 과열되어 조정 가능성이 있습니다.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* 지수 설명 섹션 끝 */}
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-inner md:col-span-1">
                      <PreviousIndexes />
                    </div>
                  </div>
                )}
                
                {activeComponent === 'timeline' && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-inner">
                    <KospiVsFearGreedIndex />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 모바일 전용 광고 */}
          <div className="lg:hidden my-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-6 mb-8">
            {/* <AdsenseSide /> */}
            {/* P1 작업: 모바일 광고 슬롯. 실제 광고 삽입 시, 이 영역이 콘텐츠를 가리지 않도록 내부 광고 컴포넌트의 크기와 반응성을 고려해야 합니다. */}
            <div className="p-4 min-h-[100px] flex items-center justify-center text-sm text-gray-400">
              {/* 모바일 광고 영역 (예시) */}
            </div>
          </div>
          
          {/* 차트 섹션들 - 탭 인터페이스 적용 */}
          <div className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden border border-border p-6 mb-8"> {/* card, border 스타일 적용 */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold md:text-3xl text-foreground mb-6">세부 지표 분석</h2> {/* h2 스타일 적용 */}
              <div className="mb-8"> {/* mb 증가 */}
                <nav className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1 shadow-sm" aria-label="Tabs">
                  {['sentiment', 'behavior', 'internals'].map((tab) => (
                    <Button
                      key={tab}
                      variant="ghost" // 기본 variant를 ghost로 변경
                      onClick={() => setActiveChartTab(tab)}
                      className={`flex-1 justify-center whitespace-nowrap py-2.5 px-3 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        ${activeChartTab === tab
                          ? 'bg-background text-foreground shadow-md dark:bg-gray-800 dark:text-gray-100' // 선택된 탭 스타일 강화
                          : 'text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-foreground dark:hover:text-gray-100'
                        }`}
                    >
                      {tab === 'sentiment' ? '시장 심리' : tab === 'behavior' ? '투자자 행동' : '시장 내부 지표'}
                    </Button>
                  ))}
                </nav>
              </div>

              <div className="space-y-8">
                {isLoadingData ? (
                  // 스켈레톤 UI 시작
                  <div> {/* animate-pulse 제거, globals.css의 skeleton 애니메이션 사용 */}
                    {/* 제목 스켈레톤 */}
                    <div className="h-7 w-1/3 mb-4 skeleton"></div>
                    {/* 탭 스켈레톤 */}
                    <div className="flex space-x-4 mb-6">
                      <div className="h-8 w-24 skeleton"></div>
                      <div className="h-8 w-24 skeleton"></div>
                      <div className="h-8 w-24 skeleton"></div>
                    </div>
                    {/* 차트 영역 스켈레톤 (2개 예시) */}
                    <div className="space-y-8">
                      <div className="h-60 w-full skeleton"></div>
                      <div className="h-60 w-full skeleton"></div>
                    </div>
                  </div>
                  // 스켈레톤 UI 끝
                ) : fetchError ? (
                  <div className="text-center py-10">
                    <p className="text-red-500 dark:text-red-400 text-lg">{fetchError}</p>
                    {/* 추가적으로 재시도 버튼 등을 넣을 수 있습니다. */}
                  </div>
                ) : (
                  <>
                    {activeChartTab === 'sentiment' && (
                      <div className="grid grid-cols-1 gap-8">
                        <MarketMomentumSection factorStatus={factorStatus} getStatus={getStatus} />
                        <MarketVolatilitySection factorStatus={factorStatus} getStatus={getStatus} />
                      </div>
                    )}
                    {activeChartTab === 'behavior' && (
                      <div className="grid grid-cols-1 gap-8">
                        <PutCallOptionsSection factorStatus={factorStatus} getStatus={getStatus} />
                        <SafeHavenDemandSection factorStatus={factorStatus} getStatus={getStatus} />
                        <JunkBondDemandSection factorStatus={factorStatus} getStatus={getStatus} />
                      </div>
                    )}
                    {activeChartTab === 'internals' && (
                      <div className="grid grid-cols-1 gap-8">
                        <StockStrengthSection factorStatus={factorStatus} getStatus={getStatus} />
                        <StockPriceBreadthSection factorStatus={factorStatus} getStatus={getStatus} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          
        </div>
        
      </div>
    </div>
  );
}

export default App;