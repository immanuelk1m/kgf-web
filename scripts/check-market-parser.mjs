import assert from "node:assert/strict";
import { parseDomesticIndexPage, parseExchangePage } from "../src/lib/market-data.ts";

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

const missingFixture = `<h2>코스피</h2><span>로딩중</span>`;

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

const missing = parseDomesticIndexPage(missingFixture, {
  key: "kospi",
  label: "코스피",
  symbol: "KOSPI",
  sourceUrl: "https://m.stock.naver.com/domestic/index/KOSPI/total",
});
assert.equal(missing.value, null);
assert.equal(missing.direction, "unknown");
assert.ok(missing.error);

console.log("market parser fixtures passed");
