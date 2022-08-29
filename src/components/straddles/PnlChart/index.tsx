import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Skeleton from 'components/UI/Skeleton';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getValueSign from 'utils/general/getValueSign';
import PnlInfoBox from 'components/common/PnlInfoBox';

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

  const upperBreakeven = optionPrice ? optionPrice / amount / 0.5 + price : 0;
  const lowerBreakeven = optionPrice ? price - optionPrice / amount / 0.5 : 0;

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
    const increment = (price - lowerBreakeven) / 4;

    return Array(60)
      .join()
      .split(',')
      .map((_item, index) => {
        let fPrice;
        if (index > 30) fPrice = price - (index - 30) * increment;
        else fPrice = price + index * increment;
        let pnl;
        if (fPrice < price) pnl = 0.5 * (price - fPrice);
        else pnl = 0.5 * (fPrice - price);
        return {
          price: fPrice,
          value: pnl * amount - optionPrice,
        };
      })
      .sort((a, b) => a.price - b.price);
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
    []
  );

  const handleMouseLeave = useCallback(
    () => setState({ price, pnl }),
    [price, pnl]
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
            width={300}
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
            <YAxis interval="preserveStartEnd" padding={{ bottom: 5 }} />
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
