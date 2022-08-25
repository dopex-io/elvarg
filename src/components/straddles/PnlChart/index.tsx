import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  YAxis,
} from 'recharts';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

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

  // @ts-ignore TODO: FIX
  const handleOnMouseMove = useCallback(({ activePayload }) => {
    if (!activePayload?.length) return;
    const { payload } = activePayload[0];
    setState({ price: payload.price, pnl: payload.value });
  }, []);

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
      <ResponsiveContainer width="100%" height="60%" className="mb-4">
        <LineChart
          width={300}
          height={300}
          data={data}
          // @ts-ignore TODO: FIX
          onMouseMove={handleOnMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="price" stroke="white" dot={false} />
          <YAxis
            dataKey={'price'}
            domain={['auto', 'auto']}
            width={39}
            tickSize={3}
            tickCount={7}
            padding={{ top: 10 }}
          />
          <ReferenceLine y={lowerBreakeven} stroke="green" />
          <ReferenceLine y={upperBreakeven} stroke="green" />
        </LineChart>
      </ResponsiveContainer>
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
