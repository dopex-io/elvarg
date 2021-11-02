import { useMemo, useState, useCallback, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getValueSign from 'utils/general/getValueSign';

const CustomTooltip = () => {
  return null;
};

interface PnlChartProps {
  breakEven: number;
  optionPrice: number;
  amount: number;
  isPut: boolean;
  price: number;
  priceIncrement: number;
  symbol: string;
}

const PnlChart = (props: PnlChartProps) => {
  const {
    breakEven,
    isPut,
    optionPrice,
    amount,
    price,
    priceIncrement,
    symbol,
  } = props;

  const [state, setState] = useState({ price: 0, pnl: 0 });

  const pnl = useMemo(() => {
    let value;
    if (isPut) value = breakEven - price;
    else value = price - breakEven;
    return value * amount;
  }, [price, breakEven, isPut, amount]);

  useEffect(() => {
    setState({ price, pnl });
  }, [price, pnl]);

  const data = useMemo(
    () =>
      Array(40)
        .join()
        .split(',')
        .map((_item, index) => {
          let fPrice;
          if (index > 20) fPrice = price - (index - 20) * priceIncrement;
          else fPrice = price + index * priceIncrement;
          let pnl;

          if (isPut) pnl = breakEven - fPrice;
          else pnl = fPrice - breakEven;
          return {
            price: fPrice,
            value: Math.max(pnl, -optionPrice) * amount,
          };
        })
        .sort((a, b) => a.price - b.price),
    [breakEven, price, priceIncrement, isPut, optionPrice, amount]
  );

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
    <Box className="h-40">
      <Box className="flex justify-between mb-4">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz"
        >
          Est. Profit & Loss
        </Typography>
        <Typography
          variant="caption"
          component="div"
          className={getValueColorClass(state.pnl)}
        >
          {getValueSign(state.pnl)}${formatAmount(Math.abs(state.pnl), 3)}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="35%" className="mb-4">
        <LineChart
          width={300}
          height={100}
          data={data}
          onMouseMove={handleOnMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="white" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <Box className="flex justify-between mb-4">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz"
        >
          {symbol} Price
        </Typography>
        <Typography
          variant="caption"
          component="div"
          className="text-wave-blue"
        >
          ${formatAmount(state.price, 3)}
        </Typography>
      </Box>
      <Box className="flex justify-between mb-4">
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz"
        >
          Breakeven
        </Typography>
        <Typography
          variant="caption"
          component="div"
          className="text-stieglitz"
        >
          ${formatAmount(breakEven, 3)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PnlChart;
