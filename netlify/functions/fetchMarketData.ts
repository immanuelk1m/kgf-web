import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface MarketData {
  value: number;
  change: number;
}

export const handler: Handler = async (event, context) => {
  try {
    const [kospiRes, kosdaqRes, wondRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?range=2d&interval=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EKQ11?range=2d&interval=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?range=2d&interval=1d')
    ]);

    const [kospiData, kosdaqData, wondData] = await Promise.all([
      kospiRes.json(),
      kosdaqRes.json(),
      wondRes.json()
    ]);

    const getLatestData = (data: any): MarketData => {
      const quote = data.chart.result[0].indicators.quote[0];
      const latestIndex = quote.close.length - 1;
      const previousClose = data.chart.result[0].meta.chartPreviousClose;
      const latestClose = quote.close[latestIndex];
      const change = ((latestClose - previousClose) / previousClose) * 100;

      return {
        value: latestClose,
        change: change
      };
    };

    const marketData = {
      kospi: getLatestData(kospiData),
      kosdaq: getLatestData(kosdaqData),
      wond: getLatestData(wondData)
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(marketData)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Failed to fetch data' }) 
    };
  }
};