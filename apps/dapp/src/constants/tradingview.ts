import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
} from 'types/charting_library';

const RED = '#fa3c58';
const GREEN = '#0ecc83';
export const DEFAULT_PERIOD = '4h';

// const chartStyleOverrides = [
//   'candleStyle',
//   'hollowCandleStyle',
//   'haStyle',
// ].reduce((acc: any, cv) => {
//   acc[`mainSeriesProperties.${cv}.drawWick`] = true;
//   acc[`mainSeriesProperties.${cv}.drawBorder`] = false;
//   acc[`mainSeriesProperties.${cv}.upColor`] = GREEN;
//   acc[`mainSeriesProperties.${cv}.downColor`] = RED;
//   acc[`mainSeriesProperties.${cv}.wickUpColor`] = GREEN;
//   acc[`mainSeriesProperties.${cv}.wickDownColor`] = RED;
//   acc[`mainSeriesProperties.${cv}.borderUpColor`] = GREEN;
//   acc[`mainSeriesProperties.${cv}.borderDownColor`] = RED;
//   return acc;
// }, {});

const chartOverrides = {
  'paneProperties.background': '#2d2d2d',
  'paneProperties.backgroundGradientStartColor': '#2d2d2d',
  'paneProperties.backgroundGradientEndColor': '#2d2d2d',
  'paneProperties.backgroundType': 'gradient',
  'paneProperties.vertGridProperties.color': 'black',
  'paneProperties.vertGridProperties.style': 1,
  'paneProperties.horzGridProperties.color': 'black',
  'paneProperties.horzGridProperties.style': 1,
  'mainSeriesProperties.priceLineColor': '#3a3e5e',
  'scalesProperties.textColor': '#fff',
  'scalesProperties.lineColor': '#16182e',
  // ...chartStyleOverrides,
};

export const disabledFeatures: ChartingLibraryFeatureset[] = [
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

export const enabledFeatures: ChartingLibraryFeatureset[] = [
  'side_toolbar_in_fullscreen_mode',
  'header_in_fullscreen_mode',
  'hide_resolution_in_legend',
  // 'hide_left_toolbar_by_default',
];

export const defaultChartProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: 'AAPL',
  theme: 'Dark',
  locale: 'en',
  library_path: 'static/charting_library/',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
  overrides: {
    'paneProperties.backgroundType': 'solid',
    'paneProperties.backgroundGradientStartColor': '#efeffe',
    'paneProperties.backgroundGradientEndColor': '#ffeefe',
  },
  enabled_features: enabledFeatures,
  disabled_features: disabledFeatures,
  custom_css_url: '/static/tv-chart.css',
  // loading_screen: { backgroundColor: '#1D1D1D', foregroundColor: '#1D1D1D' },
};
