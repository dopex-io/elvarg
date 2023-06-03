// import { useEffect, useRef } from 'react';

// import {
//   ChartingLibraryWidgetOptions,
//   LanguageCode,
//   ResolutionString,
//   widget,
// } from 'public/static/charting_library';

// interface Props extends Partial<ChartingLibraryWidgetOptions> {
//   className?: string;
// }

// const TVChartContainer = (props: Props) => {
//   const chartContainerRef =
//     useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

//   useEffect(() => {
//     if (typeof (window as any).Datafeeds == 'undefined') return;
//     const widgetOptions: ChartingLibraryWidgetOptions = {
//       symbol: props.symbol,
//       // BEWARE: no trailing slash is expected in feed URL
//       datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
//         'https://demo_feed.tradingview.com',
//         undefined,
//         {
//           maxResponseLength: 1000,
//           expectedOrder: 'latestFirst',
//         }
//       ),
//       interval: props.interval as ResolutionString,
//       container: chartContainerRef.current,
//       library_path: props.library_path,
//       locale: props.locale as LanguageCode,
//       disabled_features: ['use_localstorage_for_settings'],
//       enabled_features: ['study_templates'],
//       charts_storage_url: props.charts_storage_url,
//       charts_storage_api_version: props.charts_storage_api_version,
//       client_id: props.client_id,
//       user_id: props.user_id,
//       fullscreen: props.fullscreen,
//       autosize: props.autosize,
//     };

//     // @ts-ignore
//     const tvWidget = new widget(widgetOptions);

//     tvWidget.onChartReady(() => {
//       tvWidget.headerReady().then(() => {
//         const button = tvWidget.createButton();
//         button.setAttribute('title', 'Click to show a notification popup');
//         button.classList.add('apply-common-tooltip');
//         button.addEventListener('click', () =>
//           tvWidget.showNoticeDialog({
//             title: 'Notification',
//             body: 'TradingView Charting Library API works correctly',
//             callback: () => {
//               console.log('Noticed!');
//             },
//           })
//         );

//         button.innerHTML = 'Check API';
//       });
//     });

//     return () => {
//       tvWidget.remove();
//     };
//   }, [props]);

//   return (
//     <div
//       className={`TVChartContainer ${props.className}`}
//       ref={chartContainerRef}
//     />
//   );
// };

// export default TVChartContainer;

export {};
