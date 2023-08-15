import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';

import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';

import PnlInfoBox from 'components/common/PnlInfoBox';
import Skeleton from 'components/UI/Skeleton';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getValueSign from 'utils/general/getValueSign';

const CustomTooltip = () => {
  return null;
};

interface PnlChartProps {
  optionPrice: number;
  amount: number;
  price: any;
  symbol: string;
}

const PnlChart = (props: PnlChartProps) => {
  const { optionPrice, amount, price, symbol } = props;

  const [state, setState] = useState({ price: 0, pnl: 0 });

  const upperBreakeven = optionPrice ? optionPrice / amount + price : 0;
  const lowerBreakeven = optionPrice ? price - optionPrice / amount : 0;

  const pnl = useMemo(() => {
    let value;
    if (price > upperBreakeven) value = price - upperBreakeven;
    else value = lowerBreakeven - price;

    return value * amount;
  }, [price, upperBreakeven, lowerBreakeven, amount]);

  useEffect(() => {
    setState({ price, pnl });
  }, [price, pnl]);

  const data = useMemo(() => {
    const increment = (price - lowerBreakeven) / 8;

    const _data = Array(60)
      .join()
      .split(',')
      .map((_item, index) => {
        let fPrice: number;
        if (index > 30) fPrice = price - (index - 30) * increment;
        else fPrice = price + index * increment;
        if (fPrice > 0) {
          let pnl;
          if (fPrice < price) pnl = price - fPrice;
          else pnl = fPrice - price;
          return {
            price: fPrice,
            value: pnl * amount - optionPrice,
          };
        }
        return;
      })
      .filter((item) => item !== undefined);

    return _data.sort((a, b) => {
      return a!.price - b!.price;
    });
  }, [price, optionPrice, amount, lowerBreakeven]);

  const handleOnMouseMove: CategoricalChartFunc = useCallback(
    ({ activePayload }) => {
      if (!activePayload?.length) return;
      const { payload } = activePayload[0];
      setState({
        price: payload.price,
        pnl: payload.value,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(
    () => setState({ price, pnl }),
    [price, pnl],
  );

  return (
    <Box className="h-[24rem]">
      <Box className="flex">
        <Typography variant="h6" className="text-stieglitz font-small mb-2">
          Calculator
        </Typography>
      </Box>
      {lowerBreakeven ? (
        <ResponsiveContainer width="100%" height="60%" className="mb-4">
          <LineChart
            height={300}
            data={data}
            onMouseMove={handleOnMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="white"
              dot={false}
              strokeWidth={2}
            />
            <ReferenceLine y={0} stroke="#22E1FF" strokeWidth={2} />
            <XAxis type="number" dataKey={'price'} domain={['auto', 'auto']} />
            <YAxis
              interval="preserveStartEnd"
              padding={{ bottom: 5 }}
              width={53}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Skeleton
          variant="rectangular"
          width={334}
          height={220}
          className="mb-4"
        />
      )}
      <PnlInfoBox
        info={`${symbol} Price`}
        value={`$${formatAmount(state.price, 3)}`}
        className={'text-white text-xs'}
      />
      <PnlInfoBox
        info={'Estimated PnL'}
        value={
          <span className="text-xs">
            {getValueSign(state.pnl)}${formatAmount(Math.abs(state.pnl), 3)}
          </span>
        }
        className={getValueColorClass(state.pnl)}
      />
      <PnlInfoBox
        info={'Lower Breakeven'}
        value={`$${formatAmount(lowerBreakeven, 3)}`}
        color={'stieglitz'}
      />
      <PnlInfoBox
        info={'Upper Breakeven'}
        value={`$${formatAmount(upperBreakeven, 3)}`}
        color={'stieglitz'}
      />
    </Box>
  );
};

export default PnlChart;
