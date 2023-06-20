import { useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';

import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useBoundStore } from 'store';
import CallsIcon from 'svgs/icons/CallsIcon';
import PutsIcon from 'svgs/icons/PutsIcon';

import CustomTooltipContent from 'components/atlantics/Charts/LiquidityBarGraph/CustomTooltipContent';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface IBarData {
  availableCollateral: BigNumber;
  unlocked: BigNumber;
  activeCollateral: BigNumber;
  strike: BigNumber;
}

interface LiquidityBarGraphProps {
  data: IBarData[];
  currentPrice?: BigNumber;
  width: number;
  height: number;
  header: { [key: string]: string | number };
}

const LiquidityBarGraph = (props: LiquidityBarGraphProps) => {
  const { data, currentPrice, height, header } = props;

  const { atlanticPoolEpochData } = useBoundStore();

  const [focusBar, setFocusBar] = useState<any>(null);

  const formattedBarData = useMemo(() => {
    if (!currentPrice) return;

    const [barDataLTEMarkPrice, barDataGTMarkPrice] = data.reduce(
      ([prevLeft, prevRight], curr) =>
        curr.strike.lte(currentPrice)
          ? [[...prevLeft, curr], prevRight]
          : [prevLeft, [...prevRight, curr]],
      [[] as IBarData[], [] as IBarData[]]
    );

    const maxStrikeBelowMarkPrice = barDataLTEMarkPrice[0];

    const cumulativeMaxStrikesDataAboveMarkPrice = barDataGTMarkPrice.reduce(
      (prev, curr) => ({
        availableCollateral:
          prev.availableCollateral +
          getUserReadableAmount(curr.availableCollateral, 6),
        unlocked: prev.unlocked + getUserReadableAmount(curr.unlocked, 6),
        activeCollateral:
          prev.activeCollateral +
          getUserReadableAmount(curr.activeCollateral, 6),
      }),
      {
        availableCollateral: 0,
        unlocked: 0,
        activeCollateral: 0,
      }
    );

    return barDataLTEMarkPrice.map((bar: IBarData) => {
      if (maxStrikeBelowMarkPrice?.strike.eq(bar.strike))
        return {
          availableCollateral:
            getUserReadableAmount(bar.availableCollateral, 6) +
            cumulativeMaxStrikesDataAboveMarkPrice.availableCollateral,
          unlocked:
            getUserReadableAmount(bar.unlocked, 6) +
            cumulativeMaxStrikesDataAboveMarkPrice.unlocked,
          activeCollateral:
            getUserReadableAmount(bar.activeCollateral, 6) +
            cumulativeMaxStrikesDataAboveMarkPrice.activeCollateral,
          strike: getUserReadableAmount(bar.strike, 8),
        };
      else
        return {
          availableCollateral: getUserReadableAmount(
            bar.availableCollateral,
            6
          ),
          unlocked: getUserReadableAmount(bar.unlocked, 6),
          activeCollateral: getUserReadableAmount(bar.activeCollateral, 6),
          strike: getUserReadableAmount(bar.strike, 8),
        };
    });
  }, [data, currentPrice]);

  return (
    <Box className="flex flex-col bg-cod-gray rounded-lg">
      <Box className="flex justify-between p-3">
        <Box className="flex space-x-2 justify-start">
          {header['type'] === 'CALLS' ? (
            <CallsIcon fill="#8aff95" className="my-auto" />
          ) : (
            <PutsIcon className="my-auto" />
          )}
          <Typography variant="h6" className="align-center" color="stieglitz">
            Collateral Distribution (
            {header['collateral'] === 'USDC' ? 'USDC.e' : header['collateral']})
          </Typography>
        </Box>
        <Box className="flex my-auto">
          <ArrowDownwardRoundedIcon className="fill-current text-stieglitz h-5 p-0" />
          <Typography variant="h6" color="stieglitz">
            Max Strike
          </Typography>
        </Box>
      </Box>
      <hr className="mx-3 border-umbra" />
      <Box className="flex justify-around">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={formattedBarData}
            barCategoryGap="5%"
            layout="vertical"
            margin={{
              top: 5,
              right: 0,
              left: 7,
              bottom: 5,
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex);
              } else {
                setFocusBar(null);
              }
            }}
          >
            <Tooltip
              wrapperClassName="rounded-xl flex text-right h-auto"
              cursor={{
                fill: '#151515',
              }}
              formatter={(value: number) => value}
              contentStyle={{
                borderColor: '#2D2D2D',
                backgroundColor: '#2D2D2D',
                color: '#2D2D2D',
              }}
              content={<CustomTooltipContent />}
            />
            <XAxis type="number" dataKey="availableCollateral" hide />
            <XAxis type="number" dataKey="unlocked" hide />
            <XAxis type="number" dataKey="activeCollateral" hide />
            <YAxis
              type="category"
              dataKey="strike"
              orientation="right"
              tickSize={[atlanticPoolEpochData?.maxStrikes].length}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              name="Available Collateral"
              dataKey="availableCollateral"
              stackId="a"
              fill="#FFF"
              label="availableCollateral"
              radius={[5, 0, 0, 5]}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={focusBar === index ? '#3E3E3E' : '#3E3E3E'}
                />
              ))}
            </Bar>
            <Bar
              name="Active Collateral"
              dataKey="activeCollateral"
              stackId="a"
              fill="#FFF"
              label="activeCollateral"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={focusBar === index ? '#8E8E8E' : '#2D2D2D'}
                />
              ))}
            </Bar>
            <Bar
              name="Unlocked Collateral"
              dataKey="unlocked"
              stackId="a"
              fill="#FFF"
              label="unlocked"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={focusBar === index ? '#C4C4C4' : '#1E1E1E'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LiquidityBarGraph;
