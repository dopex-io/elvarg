import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

interface Props {
  data: any;
  triggerMarker: string;
  colors: {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
  };
  containerSize: {
    width: number;
    height: number;
  };
}

const ChartComponent = (props: Props) => {
  const { data, triggerMarker, colors, containerSize } = props;
  const {
    backgroundColor,
    textColor,
    lineColor,
    areaBottomColor,
    areaTopColor,
  } = colors;

  const chartContainerRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!chartContainerRef.current || !data || !triggerMarker) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current?.clientWidth,
      height: 400,
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
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      upColor: '#6DFFB9',
      downColor: '#FF617D',
    });
    newSeries.setData(data);

    newSeries.createPriceLine({
      price: Number(triggerMarker),
      color: '#FF617D',
      title: `Liq. @$${triggerMarker}`,
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
    containerSize.height,
    data,
    lineColor,
    textColor,
    triggerMarker,
  ]);

  return <Box ref={chartContainerRef} className="m-3 rounded-xl bg-umbra" />;
};

export default ChartComponent;
