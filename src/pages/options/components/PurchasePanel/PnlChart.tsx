import { useMemo, useState, useCallback, useContext, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getValueSign from 'utils/general/getValueSign';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { AssetsContext } from 'contexts/Assets';

import { PRICE_INCREMENTS } from 'constants/index';

const CustomTooltip = () => {
  return null;
};

interface PnlChartProps {
  breakEven: number;
  optionPrice: number;
  amount: number;
  isPut: boolean;
  selectedBaseAsset: string;
}

const PnlChart = (props: PnlChartProps) => {
  const { breakEven, isPut, optionPrice, amount, selectedBaseAsset } = props;

  const [state, setState] = useState({ price: 0, pnl: 0 });

  const { baseAssetsWithPrices } = useContext(AssetsContext);

  const { currentPrice, increment, asset } = useMemo(() => {
    return {
      currentPrice: getUserReadableAmount(
        baseAssetsWithPrices[selectedBaseAsset].price,
        8
      ),
      increment: PRICE_INCREMENTS[selectedBaseAsset].increment,
      asset: baseAssetsWithPrices[selectedBaseAsset].symbol,
    };
  }, [baseAssetsWithPrices, selectedBaseAsset]);

  const pnl = useMemo(() => {
    let value;
    if (isPut) value = breakEven - currentPrice;
    else value = currentPrice - breakEven;
    return value * amount;
  }, [currentPrice, breakEven, isPut, amount]);

  useEffect(() => {
    setState({ price: currentPrice, pnl });
  }, [pnl, currentPrice]);

  const data = useMemo(
    () =>
      Array(40)
        .join()
        .split(',')
        .map((_item, index) => {
          let price;
          if (index > 20) price = currentPrice - (index - 20) * increment;
          else price = currentPrice + index * increment;
          let pnl;

          if (isPut) pnl = breakEven - price;
          else pnl = price - breakEven;
          return {
            price,
            value: Math.max(pnl, -optionPrice) * amount,
          };
        })
        .sort((a, b) => a.price - b.price),
    [breakEven, currentPrice, increment, isPut, optionPrice, amount]
  );

  const handleOnMouseMove = useCallback(({ activePayload }) => {
    if (!activePayload?.length) return;
    const { payload } = activePayload[0];
    setState({ price: payload.price, pnl: payload.value });
  }, []);

  const handleMouseLeave = useCallback(
    () => setState({ price: currentPrice, pnl }),
    [currentPrice, pnl]
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
          {asset} Price
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
