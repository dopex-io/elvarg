import React, { useMemo, useRef } from 'react';
import { formatUnits } from 'viem';

import { Brush, Brush as VxBrush } from '@visx/brush';
import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import { Bounds } from '@visx/brush/lib/types';
import { curveBasis } from '@visx/curve';
import { scaleLinear } from '@visx/scale';
import { AreaClosed } from '@visx/shape';
import { extent, max } from '@visx/vendor/d3-array';

import { DECIMALS_TOKEN } from 'constants/index';

import { getAvailableLiquidity, getPrice } from './accessors';
import BrushHandle from './BrushHandle';
import { PriceInterval } from './types';

const PATTERN_ID = 'brush_pattern';

interface Props {
  data: PriceInterval[];
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  setFilteredData: (d: PriceInterval[]) => void;
}

const CustomBrush = (props: Props) => {
  const { data, width, height, setFilteredData } = props;

  // const [xDomain, setXDomain] = useState<[number, number]>([
  //   0,
  //   data.length - 1,
  // ]);

  const brushRef = useRef<VxBrush>(null);

  const { xMax, yMax, xScale, yScale } = useMemo(() => {
    const xMax = Math.max(width, 0);
    const yMax = Math.max(height, 0);
    const xScale = scaleLinear({
      domain: extent(data, getPrice) as [number, number],
      range: [0, xMax],
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, max(data, getAvailableLiquidity) || 0],
      nice: true,
    });

    return { xScale, yScale, yMax, xMax };
  }, [data, height, width]);

  // const handleBrushEnd = useCallback(
  //   (e: Bounds | null) => {
  //     if (e) {
  //       setXDomain([Math.max(0, e.x1), Math.min(data.length - 1, e.x0)]);
  //     }
  //   },
  //   [data],
  // );

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const _filtered = data.filter((d) => {
      const x = getPrice(d);
      const y = getAvailableLiquidity(d);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredData(_filtered);
  };

  return (
    <>
      <AreaClosed
        data={data}
        x={(d) => xScale(d.priceRange[0]) ?? 0}
        y={(d) =>
          yScale(Number(formatUnits(d.availableAssets, DECIMALS_TOKEN))) ?? 0
        }
        yScale={yScale}
        strokeWidth={1}
        stroke="#C3F8FF80"
        fill="#C3F8FF80"
        curve={curveBasis}
      />
      <Brush
        xScale={xScale}
        yScale={yScale}
        width={xMax}
        height={yMax}
        brushDirection="horizontal"
        handleSize={8}
        renderBrushHandle={(props: BrushHandleRenderProps) => (
          <BrushHandle {...props} />
        )}
        // onBrushEnd={handleBrushEnd as any}
        onChange={onBrushChange}
        onClick={() => setFilteredData(data)}
        selectedBoxStyle={{
          fill: `url(#${PATTERN_ID})`,
          stroke: '#22E1FFFF',
          strokeWidth: 3,
          cursor: 'move',
          pointerEvents: 'none',
        }}
        resizeTriggerAreas={['left', 'right']}
        useWindowMoveEvents
        ref={brushRef}
      />
    </>
  );
};

export default CustomBrush;
