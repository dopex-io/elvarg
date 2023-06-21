import queryClient from 'queryClient';
import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  LibrarySymbolInfo,
  ResolutionString,
} from 'types/charting_library';

import { TOKEN_DATA } from 'constants/tokens';

const disabledFeatures: ChartingLibraryFeatureset[] = [
  'volume_force_overlay',
  'create_volume_indicator_by_default',
  // 'header_settings',
  'header_widget',
  'display_market_status',
  // 'header_symbol_search',
  'header_in_fullscreen_mode',
  'use_localstorage_for_settings',
  'right_bar_stays_on_scroll',
  'popup_hints',
  'left_toolbar',
];

const enabledFeatures: ChartingLibraryFeatureset[] = [
  'side_toolbar_in_fullscreen_mode',
  'header_in_fullscreen_mode',
  'hide_resolution_in_legend',
  // 'hide_left_toolbar_by_default',
];

export const DEFAULT_PERIOD = '4h';

export const defaultChartProps: Partial<ChartingLibraryWidgetOptions> = {
  interval: '1D' as ResolutionString,
  theme: 'Dark',
  locale: 'en',
  library_path: 'static/charting_library/',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
  overrides: {
    // 'paneProperties.backgroundType': 'solid',
    // 'paneProperties.backgroundGradientStartColor': '#efeffe',
    // 'paneProperties.backgroundGradientEndColor': '#ffeefe',
    'paneProperties.backgroundGradientStartColor': '#020024',
    'paneProperties.backgroundGradientEndColor': '#4f485e',
  },
  enabled_features: enabledFeatures,
  disabled_features: disabledFeatures,
  custom_css_url: '/static/tv-chart.css',
  // loading_screen: { backgroundColor: '#1D1D1D', foregroundColor: '#1D1D1D' },
};

export const AVAILABLE_CHARTS: Record<number, string[]> = {
  42161: ['BTC', 'ETH', 'ARB'],
  137: ['MATIC'],
};

export const isValidTicker = (symbol: string, chainId: number) => {
  return AVAILABLE_CHARTS[chainId].includes(symbol);
};

export const configurationData = {
  supported_resolutions: ['1D', '1W', '1M'],
  exchanges: [
    {
      value: 'Coingecko',
      name: 'Coingecko API',
      desc: 'Coingecko provides a fundamental analysis of the crypto market.',
    },
  ],
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

const durationToResolutionMapping = {
  1: '1D' as ResolutionString,
  7: '7D' as ResolutionString,
  30: '30D' as ResolutionString,
  180: '3M' as ResolutionString,
  365: '12M' as ResolutionString,
};

export const getPriceFeed = async (
  token: string,
  period: keyof typeof durationToResolutionMapping,
  cacheTime?: number
) => {
  try {
    const query = async () =>
      await fetch(
        `https://api.coingecko.com/api/v3/coins/${TOKEN_DATA[token].cgId}/ohlc?vs_currency=usd&days=${period}`
      ).then((data) => data.json());
    return await queryClient.fetchQuery([token], query, {
      cacheTime: cacheTime || 60,
    });
  } catch (e: any) {
    console.log('Something went wrong while fetching charting data', e);
  }
};

export const generateSymbol = (exchange: string, fromSymbol: string) => {
  const short = `${fromSymbol}/USD`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
};
