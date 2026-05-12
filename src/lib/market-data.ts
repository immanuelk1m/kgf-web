export type MarketKey = "kospi" | "kosdaq" | "usdkrw";

export type MarketDirection = "up" | "down" | "flat" | "unknown";

export type MarketHistoryPoint = {
  date: string;
  close: number;
  closeText: string;
  change: number | null;
  changePercent: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
};

export type MarketItem = {
  key: MarketKey;
  label: string;
  value: number | null;
  valueText: string | null;
  change: number | null;
  changeText: string | null;
  changePercent: number | null;
  changePercentText: string | null;
  direction: MarketDirection;
  source: "naver-mobile-stock";
  sourceUrl: string;
  timestampText: string | null;
  history: MarketHistoryPoint[];
  error?: string;
};

export type MarketDataResponse = {
  generatedAt: string;
  items: Record<MarketKey, MarketItem>;
};

type ParseConfig = {
  key: MarketKey;
  label: string;
  sourceUrl: string;
  kind: "domestic-index" | "exchange";
  symbol?: string;
};

const NUMBER_PATTERN = "[+-]?(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?";

export function createUnavailableItem(config: Pick<ParseConfig, "key" | "label" | "sourceUrl">, error: string): MarketItem {
  return {
    key: config.key,
    label: config.label,
    value: null,
    valueText: null,
    change: null,
    changeText: null,
    changePercent: null,
    changePercentText: null,
    direction: "unknown",
    source: "naver-mobile-stock",
    sourceUrl: config.sourceUrl,
    timestampText: null,
    history: [],
    error,
  };
}

export function parseDomesticIndexPage(html: string, config: Omit<ParseConfig, "kind">): MarketItem {
  return parseMarketText(htmlToLines(html), { ...config, kind: "domestic-index" });
}

export function parseExchangePage(html: string, config: Omit<ParseConfig, "kind">): MarketItem {
  return parseMarketText(htmlToLines(html), { ...config, kind: "exchange" });
}

export function parseMarketText(lines: string[], config: ParseConfig): MarketItem {
  try {
    return config.kind === "exchange" ? parseExchangeLines(lines, config) : parseDomesticLines(lines, config);
  } catch (error) {
    return createUnavailableItem(config, error instanceof Error ? error.message : "parse failed");
  }
}

export function htmlToLines(html: string): string[] {
  return decodeHtmlEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .split(/\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
}

function parseDomesticLines(lines: string[], config: ParseConfig): MarketItem {
  const valueIndex = findValueIndexAfterLabel(lines, config.label, config.symbol);
  const valueText = valueIndex >= 0 ? extractFirstNumber(lines[valueIndex]) : null;
  const value = toNumber(valueText);
  const changeParts = findChangeParts(lines, valueIndex + 1);
  const signedChange = applyDirectionToChange(changeParts.change, changeParts.direction);
  const timestampText = findTimestampLine(lines, valueIndex + 1, /(장마감|실시간|\d{2}\.\d{2}\.)/);

  if (value === null) {
    throw new Error(`Unable to parse ${config.label} value`);
  }

  return {
    key: config.key,
    label: config.label,
    value,
    valueText,
    change: signedChange,
    changeText: formatSignedNumber(signedChange),
    changePercent: changeParts.changePercent,
    changePercentText: formatSignedPercent(changeParts.changePercent),
    direction: changeParts.direction,
    source: "naver-mobile-stock",
    sourceUrl: config.sourceUrl,
    timestampText,
    history: [],
  };
}

function parseExchangeLines(lines: string[], config: ParseConfig): MarketItem {
  const valueIndex = findExchangeValueIndex(lines);
  const valueText = valueIndex >= 0 ? extractFirstNumber(lines[valueIndex]) : null;
  const value = toNumber(valueText);
  const changeParts = findChangeParts(lines, valueIndex + 1);
  const signedChange = applyDirectionToChange(changeParts.change, changeParts.direction);
  const timestampText = findTimestampLine(lines, valueIndex + 1, /(실시간|고시|\d{2}\.\d{2}\.)/);

  if (value === null) {
    throw new Error(`Unable to parse ${config.label} value`);
  }

  return {
    key: config.key,
    label: config.label,
    value,
    valueText,
    change: signedChange,
    changeText: formatSignedNumber(signedChange),
    changePercent: changeParts.changePercent,
    changePercentText: formatSignedPercent(changeParts.changePercent),
    direction: changeParts.direction,
    source: "naver-mobile-stock",
    sourceUrl: config.sourceUrl,
    timestampText,
    history: [],
  };
}

export function parsePriceHistory(data: unknown): MarketHistoryPoint[] {
  if (!isRecord(data)) {
    return [];
  }

  const rawResult = data.result;
  const result = Array.isArray(rawResult) ? rawResult : [];

  return result
    .map((item) => parseHistoryPoint(item))
    .filter((point): point is MarketHistoryPoint => point !== null)
    .reverse();
}

function parseHistoryPoint(item: unknown): MarketHistoryPoint | null {
  if (!isRecord(item)) {
    return null;
  }

  const date = typeof item.localTradedAt === "string" ? item.localTradedAt : null;
  const closeText = typeof item.closePrice === "string" ? item.closePrice : null;
  const close = toNumber(closeText);

  if (!date || close === null || closeText === null) {
    return null;
  }

  const rawChange = typeof item.compareToPreviousClosePrice === "string" ? item.compareToPreviousClosePrice : typeof item.fluctuations === "string" ? item.fluctuations : null;
  const rawChangePercent = typeof item.fluctuationsRatio === "string" ? item.fluctuationsRatio : null;

  return {
    date,
    close,
    closeText,
    change: toNumber(rawChange),
    changePercent: toNumber(rawChangePercent),
    open: typeof item.openPrice === "string" ? toNumber(item.openPrice) : null,
    high: typeof item.highPrice === "string" ? toNumber(item.highPrice) : null,
    low: typeof item.lowPrice === "string" ? toNumber(item.lowPrice) : null,
  };
}

function findValueIndexAfterLabel(lines: string[], label: string, symbol?: string): number {
  const labelIndex = lines.findIndex((line) => line === label || line.includes(`## ${label}`));
  const start = labelIndex >= 0 ? labelIndex + 1 : 0;
  const numericLine = new RegExp(`^${NUMBER_PATTERN}$`);

  for (let index = start; index < Math.min(lines.length, start + 8); index += 1) {
    if (numericLine.test(lines[index])) {
      return index;
    }
  }

  if (symbol) {
    const symbolIndex = lines.findIndex((line) => line === symbol);
    for (let index = symbolIndex + 1; index < Math.min(lines.length, symbolIndex + 6); index += 1) {
      if (numericLine.test(lines[index])) {
        return index;
      }
    }
  }

  return -1;
}

function findExchangeValueIndex(lines: string[]): number {
  const numericLine = new RegExp(`^${NUMBER_PATTERN}$`);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/KRW\b/.test(line) && new RegExp(NUMBER_PATTERN).test(line)) {
      return index;
    }

    if (/미국\s*USD|USD/.test(line)) {
      for (let nextIndex = index + 1; nextIndex < Math.min(lines.length, index + 5); nextIndex += 1) {
        if (numericLine.test(lines[nextIndex]) && /KRW\b/.test(lines[nextIndex + 1] ?? "")) {
          return nextIndex;
        }
      }
    }
  }

  return -1;
}

function findChangeParts(lines: string[], startIndex: number): { change: number | null; changePercent: number | null; direction: MarketDirection } {
  const combinedPattern = new RegExp(`(${NUMBER_PATTERN})\\s*([+-]?\\d+(?:\\.\\d+)?)\\s*%`);
  const numericLine = new RegExp(`^${NUMBER_PATTERN}$`);
  const percentLine = /^[+-]?\d+(?:\.\d+)?$/;

  for (let index = Math.max(0, startIndex); index < Math.min(lines.length, startIndex + 12); index += 1) {
    const line = lines[index];
    const combinedMatch = line.match(combinedPattern);
    if (combinedMatch) {
      return parseChangeValues(combinedMatch[1], combinedMatch[2]);
    }

    if (numericLine.test(line) && percentLine.test(lines[index + 1] ?? "") && (lines[index + 2] === "%" || /%/.test(lines[index + 2] ?? ""))) {
      return parseChangeValues(line, lines[index + 1]);
    }
  }

  return { change: null, changePercent: null, direction: "unknown" };
}

function findTimestampLine(lines: string[], startIndex: number, pattern: RegExp): string | null {
  for (let index = Math.max(0, startIndex); index < Math.min(lines.length, startIndex + 12); index += 1) {
    const line = lines[index];
    if (pattern.test(line)) {
      return line;
    }
  }
  return null;
}

function parseChangeValues(rawChange: string | null, rawPercent: string | null): { change: number | null; changePercent: number | null; direction: MarketDirection } {
  const change = toNumber(rawChange);
  const changePercent = toNumber(rawPercent);
  const direction = directionFromPercent(changePercent);

  return { change, changePercent, direction };
}

function applyDirectionToChange(change: number | null, direction: MarketDirection): number | null {
  if (change === null) {
    return null;
  }
  if (direction === "down") {
    return -Math.abs(change);
  }
  if (direction === "up") {
    return Math.abs(change);
  }
  if (direction === "flat") {
    return 0;
  }
  return change;
}

function directionFromPercent(percent: number | null): MarketDirection {
  if (percent === null) {
    return "unknown";
  }
  if (percent > 0) {
    return "up";
  }
  if (percent < 0) {
    return "down";
  }
  return "flat";
}

function extractFirstNumber(value: string | null): string | null {
  return value?.match(new RegExp(NUMBER_PATTERN))?.[0] ?? null;
}

function toNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatSignedNumber(value: number | null): string | null {
  if (value === null) {
    return null;
  }
  const abs = Math.abs(value).toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (value > 0) {
    return `+${abs}`;
  }
  if (value < 0) {
    return `-${abs}`;
  }
  return "0.00";
}

function formatSignedPercent(value: number | null): string | null {
  if (value === null) {
    return null;
  }
  const abs = Math.abs(value).toFixed(2);
  if (value > 0) {
    return `+${abs}%`;
  }
  if (value < 0) {
    return `-${abs}%`;
  }
  return "0.00%";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
