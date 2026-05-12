import { NextResponse } from "next/server";
import {
  createUnavailableItem,
  parseDomesticIndexPage,
  parseExchangePage,
  parsePriceHistory,
  type MarketDataResponse,
  type MarketItem,
  type MarketKey,
} from "@/lib/market-data";

export const runtime = "nodejs";
export const revalidate = 30;

const SOURCES = {
  kospi: {
    key: "kospi" as const,
    label: "코스피",
    symbol: "KOSPI",
    sourceUrl: "https://m.stock.naver.com/domestic/index/KOSPI/total",
    historyUrl: "https://m.stock.naver.com/front-api/stock/domestic/index/price/list?code=KOSPI&pageSize=20&page=1",
    parser: parseDomesticIndexPage,
  },
  kosdaq: {
    key: "kosdaq" as const,
    label: "코스닥",
    symbol: "KOSDAQ",
    sourceUrl: "https://m.stock.naver.com/domestic/index/KOSDAQ/total",
    historyUrl: "https://m.stock.naver.com/front-api/stock/domestic/index/price/list?code=KOSDAQ&pageSize=20&page=1",
    parser: parseDomesticIndexPage,
  },
  usdkrw: {
    key: "usdkrw" as const,
    label: "원/달러",
    sourceUrl: "https://m.stock.naver.com/marketindex/exchange/FX_USDKRW",
    historyUrl: "https://m.stock.naver.com/front-api/marketIndex/prices?category=exchange&reutersCode=FX_USDKRW&pageSize=20&page=1",
    parser: parseExchangePage,
  },
};

export async function GET() {
  const entries = await Promise.all(
    Object.values(SOURCES).map(async (source) => [source.key, await fetchMarketItem(source)] as const),
  );

  const items = Object.fromEntries(entries) as Record<MarketKey, MarketItem>;
  const response: MarketDataResponse = {
    generatedAt: new Date().toISOString(),
    items,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "s-maxage=30, stale-while-revalidate=30",
    },
  });
}

async function fetchMarketItem(source: (typeof SOURCES)[keyof typeof SOURCES]): Promise<MarketItem> {
  try {
    const [html, history] = await Promise.all([
      fetchTextWithTimeout(source.sourceUrl, 7000),
      fetchJsonWithTimeout(source.historyUrl, 7000)
        .then((data) => parsePriceHistory(data))
        .catch(() => []),
    ]);
    return { ...source.parser(html, source), history };
  } catch (error) {
    return createUnavailableItem(
      source,
      error instanceof Error ? error.message : "Unable to load market data",
    );
  }
}

async function fetchTextWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const response = await fetchWithTimeout(url, timeoutMs, "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
  return response.text();
}

async function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<unknown> {
  const response = await fetchWithTimeout(url, timeoutMs, "application/json,text/plain,*/*");
  return response.json();
}

async function fetchWithTimeout(url: string, timeoutMs: number, accept: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KFGDashboard/1.0)",
        Referer: "https://m.stock.naver.com/",
        Accept: accept,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver source returned ${response.status}`);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}
