import { useCallback, useEffect, useRef, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import { ColorType, createChart, IChartApi } from 'lightweight-charts';

import CandleStickData from './CandleStickData';

const periods = ['1D', '4H', '1H', '15M', '5M'] as const;

export type Period = (typeof periods)[number];

interface Props {
  data: any;
  period: Period;
  setPeriod: Function;
  triggerMarker: string;
  colors: {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
  };
  containerSize?: {
    width: number;
    height: number;
  };
}

const TVChart = (props: Props) => {
  const { data, triggerMarker, colors, period, setPeriod } = props;
  const {
    backgroundColor,
    textColor,
    lineColor,
    areaBottomColor,
    areaTopColor,
  } = colors;

  const [candleStickData, setCandleStickData] = useState<{
    high: number;
    low: number;
    open: number;
    close: number;
    timestamp: number;
  }>();

  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || !triggerMarker) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current?.clientWidth,
      grid: {
        vertLines: {
          color: '#2D2D2D',
          style: 1,
        },
        horzLines: {
          color: '#2D2D2D',
          style: 1,
        },
      },
    });
    chart.timeScale().setVisibleLogicalRange({
      from: data.length - 100,
      to: data.length,
    });

    const lineData = data.map(
      (datapoint: { time: number; close: number; open: number }) => ({
        time: datapoint.time,
        value: (datapoint.close + datapoint.open) / 2,
      })
    );

    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false, // hide the last value marker for this series
      crosshairMarkerVisible: false, // hide the crosshair marker for this series
      lineColor: 'transparent', // hide the line
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    // Set the data for the Area Series
    areaSeries.setData(lineData);

    const newSeries = chart.addCandlestickSeries({
      upColor: '#6DFFB9',
      downColor: '#FF617D',
    });
    newSeries.setData(data);

    chart.subscribeCrosshairMove((e) => {
      const iter = e.seriesData.values();
      let barData;
      iter.next().value;
      barData = iter.next().value;
      if (!barData) return;

      setCandleStickData(barData);
    });

    newSeries.createPriceLine({
      price: Number(triggerMarker),
      color: '#FF617D',
      title: `Put Strike $${triggerMarker}`,
      lineStyle: 2,
      axisLabelVisible: true,
      lineWidth: 1,
      lineVisible: true,
    });

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth as number,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [
    areaBottomColor,
    areaTopColor,
    backgroundColor,
    data,
    lineColor,
    textColor,
    triggerMarker,
  ]);

  const handleChangePeriod = useCallback(
    (e: any) => {
      setPeriod(e.target.innerText);
    },
    [setPeriod]
  );

  return (
    <div className="relative flex flex-col h-full">
      {data.length === 0 ? (
        <div className="my-auto content-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <CandleStickData data={candleStickData} />
          <div className="absolute right-[5rem] z-10 border border-mineshaft m-3 grid grid-cols-5">
            {periods.map((_period, index) => {
              return (
                <div
                  key={index}
                  role="button"
                  onClick={handleChangePeriod}
                  className={`py-2 px-3 text-sm my-auto border-0 text-stieglitz hover:text-stieglitz hover:border-none ${
                    period === _period ? 'bg-carbon' : 'bg-none'
                  }`}
                >
                  {_period}
                </div>
              );
            })}
          </div>
          <div ref={chartContainerRef} className="m-3 rounded-xl h-full" />
        </>
      )}
    </div>
  );
};

export default TVChart;
