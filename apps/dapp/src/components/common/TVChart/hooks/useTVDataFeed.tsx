import { useMemo, useRef } from 'react';

import {
  DatafeedConfiguration,
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  SubscribeBarsCallback,
} from 'public/charting_library/charting_library';

import { TVDataProvider } from '../classes/TVDataProvider';

const configuration: DatafeedConfiguration = {
  currency_codes: [],
  exchanges: [],
  supported_resolutions: ['5', '15', '60', '240'] as ResolutionString[],
  supports_marks: false,
  supports_time: true,
  supports_timescale_marks: false,
  symbols_grouping: {},
  symbols_types: [],
  units: undefined,
};

export const CHART_PERIODS: Record<string, number> = {
  '5': 60 * 5,
  '15': 60 * 15,
  '60': 60 * 60,
  '240': 60 * 60 * 4,
};

const SUPPORTED_RESOLUTIONS: Record<string, string> = {
  '5': '5m',
  '15': '15m',
  '60': '1h',
  '240': '4h',
};

export function formatTimeInBarToMs(bar: any) {
  return {
    ...bar,
    time: bar.time * 1000,
  };
}

const useTVDataFeed = (dataProvider: TVDataProvider) => {
  const resetCacheRef = useRef<() => void | undefined>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

  return useMemo(() => {
    return {
      resetCache: function () {
        resetCacheRef.current?.();
      },
      dataFeed: {
        onReady: (callback: OnReadyCallback) => {
          setTimeout(() => callback(configuration));
        },
        resolveSymbol: (
          symbolName: string,
          onSymbolResolvedCallback: Function,
          onResolveErrorCallback: Function,
        ) => {
          const supportedSymbols = ['ARB/USDC'];
          if (!supportedSymbols.includes(symbolName)) {
            onResolveErrorCallback('Cannot resolve symbol');
            return;
          }
          const resolvedSymbolInformation = {
            name: symbolName,
            type: 'crypto',
            description: symbolName,
            ticker: symbolName,
            session: '24x7',
            minmov: 1,
            pricescale: 1000000,
            timezone: 'Etc/UTC',
            has_intraday: true,
            has_daily: false,
            currency_code: 'USD',
            visible_plots_set: 'ohlc',
            data_status: 'streaming',
          };
          setTimeout(() => onSymbolResolvedCallback(resolvedSymbolInformation));
        },
        getBars: async (
          symbolInfo: LibrarySymbolInfo,
          resolution: ResolutionString,
          periodParams: PeriodParams,
          onResult: HistoryCallback,
          onError: ErrorCallback,
        ): Promise<void> => {
          const { from, to, firstDataRequest } = periodParams;
          const interval = SUPPORTED_RESOLUTIONS[resolution];
          const ticker = symbolInfo.name.toLowerCase().replaceAll('/', '-');

          try {
            let priceCandles = await dataProvider?.getCandleStickPrices(
              42161,
              ticker,
              interval,
              from,
              to,
            );

            let bars: any = [];
            if (priceCandles) {
              priceCandles.forEach((bar: any) => {
                if (bar.time >= from && bar.time < to) {
                  bars = [
                    ...bars,
                    {
                      time: bar.time * 1000,
                      low: bar.low,
                      high: bar.high,
                      open: bar.open,
                      close: bar.close,
                    },
                  ];
                }
              });
            }

            console.log('GETTING PRICE CANDLES', bars, firstDataRequest);
            if (firstDataRequest) {
              console.log(dataProvider);
              dataProvider?.saveBars(bars);
              dataProvider?.setLastBar(bars[bars.length - 1]);
            }

            onResult(bars, { noData: !bars || bars.length === 0 });
          } catch (error) {
            console.log('ERRPRR!!');
            console.log('[getBars]: Get error', error);
            onError(String(error));
          }
        },
        subscribeBars: async (
          symbolInfo: LibrarySymbolInfo,
          resolution: ResolutionString,
          onTick: SubscribeBarsCallback,
          listenerGuid: string,
          onResetCacheNeededCallback: () => void,
        ): Promise<void> => {
          resetCacheRef.current = onResetCacheNeededCallback;
          intervalRef.current = setInterval(async () => {
            let lastBar = dataProvider?.lastBar;
            if (!lastBar) return;
            const nextBarTime = lastBar.time + CHART_PERIODS[resolution] * 1000;
            const currentTime = new Date().getTime();
            const ticker = symbolInfo.name.toLowerCase().replaceAll('/', '-');
            const lastPrice = await dataProvider?.getLastPrice(42161, ticker);

            let bar;

            if (currentTime >= nextBarTime) {
              bar = {
                time: nextBarTime,
                open: lastPrice,
                high: lastPrice,
                low: lastPrice,
                close: lastPrice,
              };
              onTick(bar);
            } else {
              bar = {
                ...lastBar,
                high: Math.max(lastBar.high, lastPrice),
                low: Math.min(lastBar.low, lastPrice),
                close: lastPrice,
              };
              onTick(bar);
            }
            dataProvider?.setLastBar(bar);
          }, 3000);
        },
        unsubscribeBars: (listenerGuid: string) => {
          intervalRef.current && clearInterval(intervalRef.current);
        },
      },
    };
  }, []);
};

export default useTVDataFeed;
