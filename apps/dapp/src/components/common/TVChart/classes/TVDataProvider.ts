const PRICES_URLS: Record<number, Record<string, string>> = {
  42161: {
    'ARB/USDC': 'http://localhost:8080/uniswap-prices',
    'WETH/USDC': 'http://localhost:8080/uniswap-prices',
  },
};

function getCurrentBarTimestamp(periodSeconds: number) {
  return (
    Math.floor(Date.now() / (periodSeconds * 1000)) * (periodSeconds * 1000)
  );
}

function getNextDailyBarTime(barTime: number) {
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}

function fillBarGaps(prices: any, periodSeconds: number) {
  if (prices.length < 2) return prices;

  const currentBarTimestamp = getCurrentBarTimestamp(periodSeconds) / 1000;
  let lastBar = prices[prices.length - 1];

  if (lastBar.time !== currentBarTimestamp) {
    prices.push({
      ...lastBar,
      time: currentBarTimestamp,
    });
  }

  const newPrices = [prices[0]];
  let prevTime = prices[0].time;

  for (let i = 1; i < prices.length; i++) {
    const { time, open } = prices[i];
    if (prevTime) {
      const numBarsToFill = Math.floor((time - prevTime) / periodSeconds) - 1;
      for (let j = numBarsToFill; j > 0; j--) {
        const newBar = {
          time: time - j * periodSeconds,
          open,
          close: open,
          high: open * 1.0003,
          low: open * 0.9996,
        };
        newPrices.push(newBar);
      }
    }
    prevTime = time;
    newPrices.push(prices[i]);
  }

  return newPrices;
}

const SUPPORTED_RESOLUTIONS: Record<string, string> = {
  '5': '5m',
  '15': '15m',
  '60': '1h',
  '240': '4h',
  '1D': '1d',
};

export const CHART_PERIODS: Record<string, number> = {
  '5m': 60 * 5,
  '15m': 60 * 15,
  '1h': 60 * 60,
  '4h': 60 * 60 * 4,
  '1d': 60 * 60 * 24,
};

export class TVDataProvider {
  lastBar: any;
  bars: any[] = [];

  async getCandleStickPrices(
    chainId: number,
    ticker: string,
    interval: string,
    from: number,
    to: number,
  ) {
    if (!PRICES_URLS[chainId][ticker])
      throw Error('Unsupported token for TV Chart.');
    this.bars = [];

    try {
      let queryUrl = `${PRICES_URLS[chainId][ticker]}?interval=${interval}&ticker=${ticker}&from=${from}&to=${to}`;
      const prices = await fetch(queryUrl).then((response) => response.json());
      return prices;
    } catch (error) {
      console.error('Failed to fetch prices for ', ticker);
      return [];
    }
  }

  async getLastPrice(chainId: number, ticker: string) {
    if (!PRICES_URLS[chainId][ticker])
      throw Error('Unsupported token for TV Chart.');
    try {
      let queryUrl = `${PRICES_URLS[chainId][ticker]}/last-price?ticker=${ticker}`;
      const { lastPrice } = await fetch(queryUrl).then((response) =>
        response.json(),
      );
      return lastPrice;
    } catch {
      console.error('Failed to latest price for ', ticker);
      return 0;
    }
  }

  setLastBar(bar: any) {
    this.lastBar = bar;
  }

  saveBars(bars: any[]) {
    this.bars = bars;
  }
}
