import { useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { AxisBottom } from '@visx/axis';
import { curveStepAfter } from '@visx/curve';
import { Group } from '@visx/group';
import { PatternLines } from '@visx/pattern';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, Bar } from '@visx/shape';
import { extent, max } from '@visx/vendor/d3-array';

import { DECIMALS_TOKEN } from 'constants/index';

import { getAvailableLiquidity, getPrice } from './accessors';
import CustomBrush from './CustomBrush';
import { PriceInterval } from './types';

const PATTERN_ID = 'brush_pattern';

interface Props {
  data: PriceInterval[];
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const axisTickProps = {
  textAnchor: 'middle' as const,
  fontFamily: 'Jetbrains Mono',
  fontSize: 10,
  fill: '#FFF',
};

const Chart: React.FC<Props> = ({
  data,
  width,
  height,
  margin = {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },
}) => {
  const [filteredData, setFilteredData] = useState<PriceInterval[]>(data);

  const scale = useMemo(() => {
    const xMax = width - (margin.left + margin.right);
    const yMax = height - (margin.bottom + margin.top);

    const xScale = scaleLinear({
      domain: extent(filteredData || [], getPrice) as [number, number],
      range: [0, xMax],
    });

    const yScale = scaleLinear({
      domain: [0, max(filteredData || [], getAvailableLiquidity) || 0],
      range: [yMax, 0],
    });
    return {
      xMax,
      yMax,
      xScale,
      yScale,
    };
  }, [filteredData, height, margin, width]);

  return (
    <svg width={width} height={height + 80}>
      <Group width={width} height={height}>
        <AreaClosed
          data={filteredData}
          x={(d) => scale.xScale(d.priceRange[0]) ?? 0}
          y={(d) =>
            scale.yScale(
              Number(formatUnits(d.availableAssets, DECIMALS_TOKEN)),
            ) ?? 0
          }
          yScale={scale.yScale}
          strokeWidth={1}
          stroke="#C3F8FF80"
          fill="#C3F8FF80"
          curve={curveStepAfter}
        />
        <AxisBottom
          scale={scale.xScale}
          numTicks={5}
          top={scale.yMax}
          stroke="#1E1E1E"
          tickStroke="#1E1E1E"
          tickLabelProps={axisTickProps}
        />
        {filteredData.map((d, i) => {
          return (
            <Bar
              key={`bar-${getPrice(d)}`}
              x={scale.xScale(getPrice(d)) - 5}
              y={scale.yScale(getAvailableLiquidity(d))}
              width={5}
              height={scale.yMax - scale.yScale(getAvailableLiquidity(d))}
              fill="#C3F8FF80"
            />
          );
        })}
        <PatternLines
          id={PATTERN_ID}
          height={8}
          width={8}
          stroke="#C3F8FF80"
          strokeWidth={1}
          orientation={['diagonal']}
        />
      </Group>
      <Group top={height + 5} height={height}>
        <CustomBrush
          data={data}
          width={width}
          height={height / 3}
          margins={{
            top: 10,
            right: 0,
            bottom: 10,
            left: 0,
          }}
          setFilteredData={setFilteredData}
        />
      </Group>
    </svg>
  );
};

export default Chart;
