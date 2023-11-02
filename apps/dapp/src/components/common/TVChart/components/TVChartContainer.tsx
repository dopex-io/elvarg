import { useEffect, useRef, useState } from 'react';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'public/charting_library';

import useTradingViewChartStore from 'hooks/tradingViewChart/useTradingViewChartStore';

import { TVDataProvider } from '../classes/TVDataProvider';
import useTVDataFeed from '../hooks/useTVDataFeed';

export const TV_CHART_RELOAD_TIMESTAMP_KEY = 'tv-chart-reload-timestamp';
export const TV_CHART_RELOAD_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const TVChartContainer = () => {
  const { selectedTicker } = useTradingViewChartStore();
  const [chartReady, setChartReady] = useState(false);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const tvDataFeedRef = useRef<TVDataProvider>(new TVDataProvider());

  useEffect(() => {
    tvDataFeedRef.current = new TVDataProvider();
  }, []);

  const { dataFeed: dataFeedV2, resetCache } = useTVDataFeed(
    tvDataFeedRef.current,
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem(
          TV_CHART_RELOAD_TIMESTAMP_KEY,
          Date.now().toString(),
        );
      } else {
        const tvReloadTimestamp = Number(
          localStorage.getItem(TV_CHART_RELOAD_TIMESTAMP_KEY),
        );
        if (
          tvReloadTimestamp &&
          Date.now() - tvReloadTimestamp > TV_CHART_RELOAD_INTERVAL
        ) {
          if (resetCache) {
            resetCache();
            tvWidgetRef.current?.activeChart().resetData();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetCache]);

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: selectedTicker, // Default symbol pair
      interval: '5' as ResolutionString,
      library_path: '/charting_library/',
      locale: 'en',
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      options: {},
      //   @ts-ignore
      datafeed: dataFeedV2,
      container: chartContainerRef.current,
      disabled_features: [
        'header_saveload',
        'header_settings',
        'show_right_widgets_panel_by_default',
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'create_volume_indicator_by_default',
        'header_compare',
        'display_market_status',
        'show_interval_dialog_on_key_press',
        'header_symbol_search',
        'popup_hints',
        'header_in_fullscreen_mode',
        'use_localstorage_for_settings',
        'right_bar_stays_on_scroll',
        'symbol_info',
      ],
      enabled_features: [
        'side_toolbar_in_fullscreen_mode',
        'header_in_fullscreen_mode',
        'hide_resolution_in_legend',
        'items_favoriting',
        'hide_left_toolbar_by_default',
      ],
      loading_screen: {
        backgroundColor: '#1E1E1E',
        foregroundColor: '#8E8E8E',
      },
      custom_css_url: '/tradingview-chart.css',
      overrides: {
        'crossHairProperties.color': '#8E8E8E',
        'mainSeriesProperties.candleStyle.downColor': '#FF617D',
        'mainSeriesProperties.candleStyle.wickDownColor': '#FF617D',
        'mainSeriesProperties.candleStyle.borderDownColor': '#FF617D', // Down bad
        'mainSeriesProperties.candleStyle.upColor': '#6DFFB9',
        'mainSeriesProperties.candleStyle.borderUpColor': '#6DFFB9',
        'mainSeriesProperties.candleStyle.wickUpColor': '#6DFFB9', // Up only
        'mainSeriesProperties.statusViewStyle.showExchange': false,
        'paneProperties.background': '#1E1E1E', // Carbon
        'paneProperties.horzGridProperties.color': '#3E3E3E', // Mineshaft
        'paneProperties.vertGridProperties.color': '#3E3E3E', // Mineshaft
        'paneProperties.legendProperties.showStudyArguments': false,
        'paneProperties.legendProperties.showStudyTitles': false,
        'paneProperties.legendProperties.showVolume': false,
        'paneProperties.separatorColor': '#3E3E3E',
        'scalesProperties.lineColor': '#3E3E3E',
        'scalesProperties.showBidAskLabels': false,
        'scalesProperties.showStudyLastValue': false,
        'scalesProperties.showStudyPlotLabels': false,
        'scalesProperties.showSymbolLabels': false,
        'scalesProperties.textColor': '#8E8E8E', // stieglitz
      },
    };
    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      setChartReady(true);
      tvWidgetRef.current = tvWidget;
    });
    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
        setChartReady(false);
        setChartDataLoading(true);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (chartReady) {
        if (tvWidgetRef.current) {
          resetCache();
          tvWidgetRef.current.activeChart?.().resetData();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [chartReady, resetCache]);

  return (
    <div
      className="xl:h-[630px] h-[400px] w-full rounded-lg theme-dark"
      ref={chartContainerRef}
    />
  );
};

export default TVChartContainer;
