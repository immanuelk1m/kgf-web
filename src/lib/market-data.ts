export type MarketKey = "kospi" | "kosdaq" | "usdkrw";

export type MarketDirection = "up" | "down" | "flat" | "unknown";

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
  const changeLine = findChangeLine(lines, valueIndex + 1);
  const changeParts = parseChangeLine(changeLine);
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
  };
}

function parseExchangeLines(lines: string[], config: ParseConfig): MarketItem {
  const valueIndex = lines.findIndex((line) => /KRW\b/.test(line) && new RegExp(NUMBER_PATTERN).test(line));
  const valueText = valueIndex >= 0 ? extractFirstNumber(lines[valueIndex]) : null;
  const value = toNumber(valueText);
  const changeLine = findChangeLine(lines, valueIndex + 1);
  const changeParts = parseChangeLine(changeLine);
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

function findChangeLine(lines: string[], startIndex: number): string | null {
  const pattern = new RegExp(`(${NUMBER_PATTERN})\\s*([+-]\\d+(?:\\.\\d+)?)%`);
  for (let index = Math.max(0, startIndex); index < Math.min(lines.length, startIndex + 12); index += 1) {
    const line = lines[index];
    if (pattern.test(line)) {
      return line;
    }
  }
  return null;
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

function parseChangeLine(line: string | null): { change: number | null; changePercent: number | null; direction: MarketDirection } {
  if (!line) {
    return { change: null, changePercent: null, direction: "unknown" };
  }

  const match = line.match(new RegExp(`(${NUMBER_PATTERN})\\s*([+-]\\d+(?:\\.\\d+)?)%`));
  const rawChange = match?.[1] ?? null;
  const rawPercent = match?.[2] ?? null;
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
