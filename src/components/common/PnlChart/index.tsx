import { useMemo, useState, useCallback, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';
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
  breakEven: number;
  optionPrice: number;
  amount: number;
  isPut: boolean;
  price: number;
  symbol: string;
}

const PnlChart = (props: PnlChartProps) => {
  const { breakEven, isPut, optionPrice, amount, price, symbol } = props;

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

  const data = useMemo(() => {
    const increment = breakEven / 20;

    return Array(40)
      .join()
      .split(',')
      .map((_item, index) => {
        let fPrice;
        if (index > 20) fPrice = price - (index - 20) * increment;
        else fPrice = price + index * increment;
        let pnl;

        if (isPut) pnl = breakEven - fPrice;
        else pnl = fPrice - breakEven;
        return {
          price: fPrice,
          value: Math.max(pnl, -optionPrice) * amount,
        };
      })
      .sort((a, b) => a.price - b.price);
  }, [breakEven, price, isPut, optionPrice, amount]);

  const handleOnMouseMove: CategoricalChartFunc = useCallback(
    ({ activePayload }) => {
      if (!activePayload?.length) return;
      const { payload } = activePayload[0];
      setState({ price: payload.price, pnl: payload.value });
    },
    []
  );

  const handleMouseLeave = useCallback(
    () => setState({ price, pnl }),
    [price, pnl]
  );

  return (
    <Box className="h-[11.25rem]">
      <Box className="flex justify-between">
        <Typography variant="h6" className="text-stieglitz font-small">
          Calculator
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
        info={'Breakeven'}
        value={`$${formatAmount(breakEven, 3)}`}
        color={'stieglitz'}
      />
    </Box>
  );
};

export default PnlChart;
