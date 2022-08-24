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

  const upwardBreakeven = optionPrice / amount / 0.5 + price;
  const lowerBreakeven = price - optionPrice / amount / 0.5;

  const pnl = useMemo(() => {
    let value;
    if (price > upwardBreakeven) value = price - upwardBreakeven;
    else value = lowerBreakeven - price;
    return value * amount;
  }, [price, upwardBreakeven, lowerBreakeven, amount]);

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
  console.log(lowerBreakeven.toFixed(0));

  return (
    <Box className="h-[26rem]">
      <Box className="flex">
        <Typography variant="h6" className="text-stieglitz font-small mb-2">
          Calculator
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="70%" className="mb-4">
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
            tickSize={2}
          />
          <ReferenceLine y={lowerBreakeven} stroke="red" />
          <ReferenceLine y={upwardBreakeven} stroke="red" />
        </LineChart>
      </ResponsiveContainer>
      <Box className="flex justify-between mb-3.5">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-xs"
        >
          {symbol} Price
        </Typography>
        <Typography
          variant="caption"
          component="div"
          className="text-white text-xs"
        >
          ${formatAmount(state.price, 3)}
        </Typography>
      </Box>
      <Box className="flex justify-between mb-3.5">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz text-xs"
        >
          Estimated PnL
        </Typography>
        <Typography
          variant="caption"
          component="div"
          className={getValueColorClass(state.pnl)}
        >
          <span className="text-xs">
            {getValueSign(state.pnl)}${formatAmount(Math.abs(state.pnl), 3)}
          </span>
        </Typography>
      </Box>
      <Box>
        <Box className="flex justify-between mb-1">
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-xs"
          >
            Lower Breakeven
          </Typography>
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-xs"
          >
            ${formatAmount(lowerBreakeven, 3)}
          </Typography>
        </Box>
        <Box className="flex justify-between mb-0.5">
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-xs"
          >
            Upper Breakeven
          </Typography>
          <Typography
            variant="caption"
            component="div"
            className="text-stieglitz text-xs"
          >
            ${formatAmount(upwardBreakeven, 3)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PnlChart;
