import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  configurationData,
  // generateSymbol,
  getPriceFeed,
  // isValidTicker,
} from 'config/tradingview';
import graphSdk from 'graphql/graphSdk';
import {
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  SubscribeBarsCallback,
  SymbolType,
} from 'types/charting_library';

interface Props {
  symbol: string;
}

const useDatafeed = (props: Props) => {
  const { symbol } = props;
  const [pricefeed, setPricefeed] = useState<any>();

  const updatePrices = useCallback(async () => {
    const data: any[] = await getPriceFeed(symbol, 1);
    if (!data || !data.length) return;
    setPricefeed(
      data.map((ohlc) => ({
        time: ohlc[0],
        open: ohlc[1],
        high: ohlc[2],
        low: ohlc[3],
        close: ohlc[4],
      }))
    );
  }, [symbol]);

  const datafeed = useMemo(() => {
    return {
      cacheTime: 3600,
      onReady: (callback: Function) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
      },
      searchSymbols: (
        userInput: string,
        exchange: string,
        symbolType: SymbolType,
        onResultReadyCallback: any
      ) => {
        console.log(userInput, exchange, symbolType);
      },
      resolveSymbol: (
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: any) => void,
        onResolveErrorCallback: ErrorCallback,
        extension: any
      ) => {
        const symbolInfo = {
          name: symbolName,
          type: 'crypto',
          description: symbolName + ' / USD',
          ticker: symbolName,
          session: '24x7',
          minmov: 1,
          pricescale: 100,
          timezone: 'Etc/UTC',
          has_intraday: true,
          has_daily: true,
          currency_code: 'USD',
          visible_plots_set: 'ohlc',
          data_status: 'streaming',
          isStable: false,
        };
        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        console.log('[resolveSymbol]: Method call', symbolName);
      },
      getBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        periodParams: PeriodParams,
        onHistoryCallback: HistoryCallback,
        onErrorCallback: (error: string) => void
      ) => {
        try {
          if (!pricefeed) return;
          let bars = pricefeed;

          onHistoryCallback(bars, { noData: false });
        } catch (e: any) {
          onErrorCallback(e.toString());
        }
      },
      subscribeBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        onRealtimeCallback: SubscribeBarsCallback,
        subscriberUID: string,
        onResetCacheNeededCallback: () => void
      ) => {
        const { ticker } = symbolInfo;
        if (!ticker) return;

        console.log(
          '[subscribeBars]: Method call with subscriberUID:',
          subscriberUID
        );
      },
      unsubscribeBars: () => {
        console.log('[unsubscribeBars]: Method call');
      },
    };
  }, [pricefeed]);

  console.log(pricefeed);

  useEffect(() => {
    updatePrices();
  }, [updatePrices]);

  return {
    datafeed,
  };
};

export default useDatafeed;
