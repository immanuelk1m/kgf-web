'use client';

import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

const GaugeChart: React.FC = () => {
  const chartRef = useRef<am4charts.GaugeChart | null>(null);

  useEffect(() => {
    let chart = am4core.create('chartdiv', am4charts.GaugeChart);
    chartRef.current = chart;

    if (chart.logo) {
      chart.logo.disabled = true;
    }

    // 차트 반응형 설정
    chart.responsive.enabled = true;
    chart.responsive.rules.push({
      relevant: function(target) {
        if (target.pixelWidth <= 400) {
          return true;
        }
        return false;
      },
      state: function(target: am4core.Sprite, stateId: string): am4core.Optional<am4core.SpriteState<am4core.ISpriteProperties, am4core.ISpriteAdapters>> {
        if (target instanceof am4charts.GaugeChart) {
          const state = target.states.create(stateId);
          state.properties.fontSize = 7;
          return state;
        }
        return undefined;
      }
    });

    am4core.addLicense('ch-custom-attribution');

    const chartMin = 0;
    const chartMax = 100;

    const data = {
      score: 50,
      gradingData: [
        { title: '😱', color: '#ee1f25', lowScore: 0, highScore: 20 },
        { title: '😨', color: '#fdae19', lowScore: 20, highScore: 40 },
        { title: '😐', color: '#f3eb0c', lowScore: 40, highScore: 60 },
        { title: '😀', color: '#b0d136', lowScore: 60, highScore: 80 },
        { title: '🤑', color: '#0f9747', lowScore: 80, highScore: 100 }
      ]
    };

    function lookUpGrade(lookupScore: number, grades: Array<{
      title: string;
      color: string;
      lowScore: number;
      highScore: number;
    }>) {
      for (let i = 0; i < grades.length; i++) {
        if (grades[i].lowScore < lookupScore && grades[i].highScore >= lookupScore) {
          return grades[i];
        }
      }
      return null;
    }

    chart.hiddenState.properties.opacity = 0;
    chart.fontSize = 7;
    chart.innerRadius = am4core.percent(80);
    
    // 반응형 설정
    const isSmallScreen = window.innerWidth <= 768;
    const labelFontSize = isSmallScreen ? '2.5em' : '4em';
    const emojiSize = isSmallScreen ? '2em' : '3.6em';
    const labelOffset = isSmallScreen ? 15 : 25;

    const axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = chartMin;
    axis.max = chartMax;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(68);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 0.2;
    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.strokeWidth = 0.5;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = am4core.percent(35);
    axis.renderer.labels.template.fontSize = isSmallScreen ? '1em' : '1.5em';

    const axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = chartMin;
    axis2.max = chartMax;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = false;
    axis2.renderer.grid.template.opacity = 0.5;

    for (let grading of data.gradingData) {
      const range = axis2.axisRanges.create();
      range.axisFill.fill = am4core.color(grading.color);
      range.axisFill.fillOpacity = 0.8;
      range.axisFill.zIndex = -1;
      range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
      range.endValue = grading.highScore < chartMax ? grading.highScore : chartMax;
      range.grid.strokeOpacity = 0;
      range.label.inside = true;
      range.label.text = grading.title;
      range.label.location = 0.5;
      range.label.verticalCenter = "middle";
      range.label.fontSize = emojiSize;
      range.label.paddingBottom = isSmallScreen ? -5 : -30;
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
    label.text = data.score.toFixed(1);
    label.fill = am4core.color('#000000');

    // 이모티콘 레이블
    const label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = emojiSize;
    label2.horizontalCenter = 'middle';
    label2.verticalCenter = 'bottom';
    label2.text = matchingGrade.title;
    label2.fill = am4core.color('#000000');
    label2.dy = isSmallScreen ? 20 : 40;

    const hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(70);
    hand.startWidth = 5;
    hand.pin.disabled = true;
    hand.value = data.score;
    hand.fill = am4core.color('#444');
    hand.stroke = am4core.color('#000');

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

    fetch('https://raw.githubusercontent.com/immanuelk1m/kospi-feargreedindex/refs/heads/main/assets/js/json/value.json')
      .then(response => response.json())
      .then(json => {
        current_value = json.current;
      });

    setInterval(function () {
      const value = 0 + (current_value / 10) * (10 - 0);
      hand.showValue(value, 1000, am4core.ease.cubicOut);
    }, 2000);

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div 
      id="chartdiv" 
      style={{ 
        width: '100%', 
        height: '40vh',
        minHeight: '300px',
        maxHeight: '500px'
      }} 
    />
  );
};

export default GaugeChart;