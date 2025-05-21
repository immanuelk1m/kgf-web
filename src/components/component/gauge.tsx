'use client';

import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

const GaugeChart: React.FC = () => {
  const chartRef = useRef<am4charts.GaugeChart | null>(null);

  useEffect(() => {
    let chart = am4core.create('chartdiv', am4charts.GaugeChart);
    chartRef.current = chart;

    // 다크 모드 감지
    const isDarkMode = document.documentElement.classList.contains('dark');

    // 색상 변수 (globals.css 참조)
    const colors = {
      negative: isDarkMode ? "hsl(0, 70%, 80%)" : "hsl(0, 74.2%, 42.2%)", // #B91C1C (light), lighter red (dark)
      negative_light: isDarkMode ? "hsl(0, 60%, 70%)" : "hsl(0, 80%, 70%)", // 주황색 계열 or 밝은 빨강
      neutral: isDarkMode ? "hsl(220, 10%, 75%)" : "hsl(48, 85%, 55%)", // 노란색 계열 (light), 밝은 회색 (dark)
      positive_light: isDarkMode ? "hsl(150, 60%, 65%)" : "hsl(130, 60%, 55%)", // 연두색 계열
      positive: isDarkMode ? "hsl(150, 70%, 75%)" : "hsl(160, 93%, 24.1%)", // #047857 (light), lighter green (dark)
      foreground: isDarkMode ? "hsl(210, 40%, 98%)" : "hsl(222.2, 84%, 4.9%)",
      mutedForeground: isDarkMode ? "hsl(215, 20.2%, 65.1%)" : "hsl(215.4, 16.3%, 46.9%)",
      axisStroke: isDarkMode ? "hsl(217.2, 32.6%, 37.5%)" : "hsl(214.3, 31.8%, 81.4%)", // 어두운 테마의 border 또는 밝은 테마의 연한 border
      handFill: isDarkMode ? "hsl(210, 40%, 88%)" : "hsl(222.2, 47.4%, 21.2%)", // primary-foreground (light), primary (dark) 유사
      pinFill: isDarkMode ? "hsl(210, 40%, 98%)" : "hsl(222.2, 84%, 4.9%)",
    };

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    // 차트 반응형 설정 개선
    chart.responsive.enabled = true;
    // ... (responsive rules 생략, 기존 코드 유지)

    am4core.addLicense('ch-custom-attribution');

    const chartMin = 0;
    const chartMax = 100;

    const data = {
      score: 50, // 이 값은 API에서 가져온 값으로 업데이트 됩니다.
      gradingData: [
        { title: '😱', color: colors.negative, lowScore: 0, highScore: 20 },
        { title: '😨', color: colors.negative_light, lowScore: 20, highScore: 40 },
        { title: '😐', color: colors.neutral, lowScore: 40, highScore: 60 },
        { title: '😀', color: colors.positive_light, lowScore: 60, highScore: 80 },
        { title: '🤑', color: colors.positive, lowScore: 80, highScore: 100 },
      ],
    };

    function lookUpGrade(
      lookupScore: number,
      grades: Array<{
        title: string;
        color: string;
        lowScore: number;
        highScore: number;
      }>
    ) {
      for (let i = 0; i < grades.length; i++) {
        if (grades[i].lowScore < lookupScore && grades[i].highScore >= lookupScore) {
          return grades[i];
        }
      }
      return null;
    }

    chart.hiddenState.properties.opacity = 0;
    chart.fontSize = 12;
    chart.innerRadius = am4core.percent(80);

    // 반응형 설정 개선
    const isSmallScreen = window.innerWidth <= 768;
    const isMobileScreen = window.innerWidth <= 480;

    // 화면 크기에 따른 폰트 크기 조정
    const labelFontSize = isMobileScreen ? '2em' : isSmallScreen ? '3em' : '4em';
    const emojiSize = isMobileScreen ? '1.8em' : isSmallScreen ? '2.5em' : '3.6em';
    const labelOffset = isMobileScreen ? 10 : isSmallScreen ? 15 : 25;

    const axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = chartMin;
    axis.max = chartMax;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(70);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 0.4; // 축선 가시성 증가
    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 0.7; // 주요 눈금 스타일 조정
    axis.renderer.ticks.template.strokeWidth = 1;
    axis.renderer.ticks.template.length = 15;
    axis.renderer.ticks.template.stroke = am4core.color(colors.axisStroke); // 축 눈금 색상
    // axis.renderer.minGridDistance = 30; // 눈금 간 최소 픽셀 거리 (밀도 조절)

    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.fill = am4core.color(colors.mutedForeground); // 축 라벨 색상
    axis.renderer.labels.template.radius = am4core.percent(35);
    axis.renderer.labels.template.fontSize = isMobileScreen
      ? '0.9em'
      : isSmallScreen
      ? '1.2em'
      : '1.5em';

    const axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = chartMin;
    axis2.max = chartMax;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = false;
    axis2.renderer.grid.template.opacity = 0.5;
    axis2.renderer.grid.template.stroke = am4core.color(colors.axisStroke); // 내부 그리드 색상

    // 이모티콘 배치 설정 (회전 및 반경 어댑터 제거)
    for (let grading of data.gradingData) {
      const range = axis2.axisRanges.create();

      // 그라데이션 적용 안함 (단색 사용)
      range.axisFill.fill = am4core.color(grading.color);
      range.axisFill.fillOpacity = 0.8; // Opacity 조정

      range.axisFill.zIndex = -1;
      range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
      range.endValue = grading.highScore < chartMax ? grading.highScore : chartMax;
      range.grid.strokeOpacity = 0;
      range.label.inside = true;
      range.label.text = grading.title;
      range.label.location = 0.5;
      range.label.verticalCenter = 'middle';
      range.label.fontSize = emojiSize;
      // 이모티콘이 너무 위로 올라가 잘리는 현상을 수정하기 위해 paddingBottom 값을 조정합니다.
      // 기존 값보다 음수의 절대값을 줄여서 덜 올라가도록 합니다.
      range.label.paddingBottom = isSmallScreen ? -2 : -12; // 예: 작은 화면에서는 -2, 큰 화면에서는 -12
    }

    const matchingGrade = lookUpGrade(data.score, data.gradingData);
    if (!matchingGrade) return;

    // 수치 레이블
    const label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = labelFontSize;
    label.x = am4core.percent(50);
    label.paddingBottom = labelOffset;
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'bottom';
    label.text = data.score.toFixed(1); // API 값으로 업데이트됨
    label.fill = am4core.color(colors.foreground); // 텍스트 색상

    // 이모티콘 레이블
    const label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = emojiSize;
    label2.horizontalCenter = 'middle';
    label2.verticalCenter = 'bottom';
    label2.text = matchingGrade.title;
    label2.fill = am4core.color(colors.foreground); // 텍스트 색상 (초기값, 이후 matchingGrade.color로 변경될 수 있음)
    label2.dy = isMobileScreen ? 15 : isSmallScreen ? 25 : 40;

    const hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(70);
    hand.startWidth = 10; // 바늘 두께 증가
    hand.pin.disabled = false; // 핀 활성화
    hand.pin.radius = 10; // 핀 크기
    hand.pin.fill = am4core.color(colors.pinFill); // 핀 색상
    hand.pin.stroke = am4core.color(colors.axisStroke); // 핀 테두리 색상
    hand.pin.strokeWidth = 1;

    hand.value = data.score; // API 값으로 업데이트됨
    hand.fill = am4core.color(colors.handFill); // 바늘 색상
    hand.stroke = am4core.color(colors.axisStroke); // 바늘 테두리 색상

    // 그림자 효과 추가
    const shadow = new am4core.DropShadowFilter();
    shadow.dx = 1;
    shadow.dy = 1;
    shadow.opacity = 0.3;
    hand.filters.push(shadow);
    if (hand.pin) { // hand.pin이 Sprite 타입일 경우에만 filters 추가
      const pinShadow = new am4core.DropShadowFilter();
      pinShadow.dx = 1;
      pinShadow.dy = 1;
      pinShadow.opacity = 0.3;
      hand.pin.filters.push(pinShadow);
    }

    hand.events.on('positionchanged', function () {
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      const value2 = axis.positionToValue(hand.currentPosition);
      const matchingGrade = lookUpGrade(value2, data.gradingData);
      if (matchingGrade) {
        label2.text = matchingGrade.title;
        label2.fill = am4core.color(matchingGrade.color);
      }
    });

    let current_value: number = 50; // Default value

    fetch(
      'https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/value.json'
    )
      .then((response) => response.json())
      .then((json) => {
        current_value = json.current;
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
      });

    setInterval(function () {
      const value = 0 + (current_value / 10) * 10;
      hand.showValue(value, 1000, am4core.ease.cubicOut);
    }, 2000);

    // 윈도우 리사이즈 이벤트에 반응하도록 추가
    const resizeHandler = () => {
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileScreen = window.innerWidth <= 480;

      // 라벨 크기 조정
      label.fontSize = isMobileScreen ? '2em' : isSmallScreen ? '3em' : '4em';
      label2.fontSize = isMobileScreen ? '1.8em' : isSmallScreen ? '2.5em' : '3.6em';

      // 라벨 위치 조정
      label.paddingBottom = isMobileScreen ? 10 : isSmallScreen ? 15 : 25;
      label2.dy = isMobileScreen ? 15 : isSmallScreen ? 25 : 40;

      // 차트 크기 재조정 트리거
      (chart as am4core.Container).invalidateLayout();
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    };
  }, []);

  return (
    <div
      id="chartdiv"
      style={{
        width: '100%',
        height: '40vh',
        minHeight: '280px',
        maxHeight: '450px',
      }}
      className="w-full h-[40vh] min-h-[280px] max-h-[450px]"
    />
  );
};

export default GaugeChart;
