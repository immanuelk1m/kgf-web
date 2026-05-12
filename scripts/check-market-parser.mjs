import assert from "node:assert/strict";
import { parseDomesticIndexPage, parseExchangePage, parsePriceHistory } from "../src/lib/market-data.ts";

const kospiFixture = `
  <h2>코스피</h2>
  <strong>7,643.15</strong>
  <span>KOSPI</span>
  <span>코스피</span>
  <strong>7,643.15</strong>
  <span>179.09 -2.29%</span>
  <time>05.12.장마감</time>
`;

const kosdaqFixture = `
  <h2>코스닥</h2>
  <strong>1,179.29</strong>
  <span>KOSDAQ</span>
  <span>28.05 -2.32%</span>
  <time>05.12.장마감</time>
`;

const usdFixture = `
  <span>미국 USD</span>
  <strong>1,490.20 KRW</strong>
  <span>15.20 +1.03%</span>
  <time>05.12. 19:44 실시간 하나은행 고시회차 614 회</time>
`;

const usdSplitFixture = `
  <span>미국 USD</span>
  <strong>1,487.50</strong>
  <span>KRW</span>
  <span>12.50</span>
  <span>+0.85</span>
  <span>%</span>
  <time>05.12.</time>
  <span>하나은행</span>
  <span>고시회차</span>
`;

const missingFixture = `<h2>코스피</h2><span>로딩중</span>`;

const priceHistoryFixture = {
  isSuccess: true,
  result: [
    {
      localTradedAt: "2026-05-12",
      closePrice: "7,643.15",
      compareToPreviousClosePrice: "-179.09",
      fluctuationsRatio: "-2.29",
      openPrice: "7,953.41",
      highPrice: "7,999.67",
      lowPrice: "7,421.71",
    },
    {
      localTradedAt: "2026-05-11",
      closePrice: "7,822.24",
      compareToPreviousClosePrice: "324.24",
      fluctuationsRatio: "4.32",
      openPrice: "7,775.31",
      highPrice: "7,899.32",
      lowPrice: "7,713.49",
    },
  ],
};

const kospi = parseDomesticIndexPage(kospiFixture, {
  key: "kospi",
  label: "코스피",
  symbol: "KOSPI",
  sourceUrl: "https://m.stock.naver.com/domestic/index/KOSPI/total",
});
assert.equal(kospi.value, 7643.15);
assert.equal(kospi.change, -179.09);
assert.equal(kospi.changePercent, -2.29);
assert.equal(kospi.direction, "down");
assert.equal(kospi.timestampText, "05.12.장마감");

const kosdaq = parseDomesticIndexPage(kosdaqFixture, {
  key: "kosdaq",
  label: "코스닥",
  symbol: "KOSDAQ",
  sourceUrl: "https://m.stock.naver.com/domestic/index/KOSDAQ/total",
});
assert.equal(kosdaq.value, 1179.29);
assert.equal(kosdaq.change, -28.05);
assert.equal(kosdaq.direction, "down");

const usdkrw = parseExchangePage(usdFixture, {
  key: "usdkrw",
  label: "원/달러",
  sourceUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDKRW",
});
assert.equal(usdkrw.value, 1490.2);
assert.equal(usdkrw.change, 15.2);
assert.equal(usdkrw.changePercent, 1.03);
assert.equal(usdkrw.direction, "up");

const usdkrwSplit = parseExchangePage(usdSplitFixture, {
  key: "usdkrw",
  label: "원/달러",
  sourceUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDKRW",
});
assert.equal(usdkrwSplit.value, 1487.5);
assert.equal(usdkrwSplit.change, 12.5);
assert.equal(usdkrwSplit.changePercent, 0.85);
assert.equal(usdkrwSplit.direction, "up");

const missing = parseDomesticIndexPage(missingFixture, {
  key: "kospi",
  label: "코스피",
  symbol: "KOSPI",
  sourceUrl: "https://m.stock.naver.com/domestic/index/KOSPI/total",
});
assert.equal(missing.value, null);
assert.equal(missing.direction, "unknown");
assert.ok(missing.error);

const priceHistory = parsePriceHistory(priceHistoryFixture);
assert.equal(priceHistory.length, 2);
assert.equal(priceHistory[0].date, "2026-05-11");
assert.equal(priceHistory[0].close, 7822.24);
assert.equal(priceHistory[1].changePercent, -2.29);
assert.equal(priceHistory[1].high, 7999.67);

console.log("market parser fixtures passed");
