import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface FinanceData {
  kospi: any;
  kosdaq: any;
  wond: any;
}

const handler: Handler = async (event, context) => {
  try {
    const [kospiRes, kosdaqRes, wondRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?range=2d&interval=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EKQ11?range=2d&interval=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?range=2d&interval=1d')
    ]);

    const kospiData = await kospiRes.json();
    const kosdaqData = await kosdaqRes.json();
    const wondData = await wondRes.json();

    const financeData: FinanceData = {
      kospi: kospiData,
      kosdaq: kosdaqData,
      wond: wondData
    };

    return {
      statusCode: 200,
      body: JSON.stringify(financeData)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to fetch data' }) 
    };
  }
};

export { handler };