// import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

import {
  AtlanticsContext,
  // AtlanticsProvider,
  IAtlanticPoolCheckpoint,
  // IAtlanticPoolType,
} from 'contexts/Atlantics';
import { useContext, useMemo } from 'react';
import { BigNumber } from 'ethers';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';
import { CircularProgress } from '@mui/material';

// import Typography from 'components/UI/Typography';

const ClientRenderedLineChart = dynamic(() => import('./LiquidityLineChart'), {
  ssr: false,
});

const ClientRenderedBarGraph = dynamic(() => import('./LiquidityBarGraph'), {
  ssr: false,
});

interface ChartsProps {
  line_data: any[];
  underlying: string;
  collateral: string;
  title: string;
  type: string;
}

interface IBarData {
  deposits: number;
  unlocked: number;
  activeCollateral: number;
  strike: string | number;
}

const Charts = (props: ChartsProps) => {
  const { line_data, underlying, collateral, title, type } = props;
  const { selectedPool } = useContext(AtlanticsContext);

  const barData: IBarData[] = useMemo((): IBarData[] => {
    if (!selectedPool)
      return [{ deposits: 0, unlocked: 0, activeCollateral: 0, strike: 0 }];
    if (selectedPool.isPut) {
      const strikes = selectedPool.strikes as BigNumber[];
      const data = selectedPool.data as IAtlanticPoolCheckpoint[];
      const decimals = getTokenDecimals(selectedPool?.tokens.deposit, 1337);
      const barData: IBarData[] = strikes?.map(
        (maxStrike: BigNumber, index: number) => {
          const deposits = Number(data[index]?.liquidity) / 10 ** decimals;
          const unlocked =
            Number(data[index]?.unlockCollateral) / 10 ** decimals;
          const activeCollateral =
            Number(data[index]?.activeCollateral) / 10 ** decimals;
          const strike = Number(maxStrike.div(1e8));
          return {
            deposits: parseInt(formatAmount(deposits, 3)),
            unlocked: parseInt(formatAmount(unlocked, 3)) ?? 0,
            activeCollateral: parseInt(formatAmount(activeCollateral, 3)),
            strike,
          };
        }
      );
      return barData;
    } else {
      return [{ deposits: 0, unlocked: 0, activeCollateral: 0, strike: 0 }];
    }
  }, [selectedPool]);

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-2/3 sm:w-full">
        {barData[0]?.deposits !== 0 ? (
          <ClientRenderedBarGraph
            data={barData}
            width={750}
            height={175}
            header={{ underlying, collateral, title, type }}
          />
        ) : (
          <Box className="p-3 flex h-full items-center justify-center">
            <CircularProgress size="30px" />
          </Box>
        )}
      </Box>
      <Box className="flex flex-col bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-full md:w-1/3 sm:w-full">
        <ClientRenderedLineChart data={line_data} width={340} height={150} />
      </Box>
    </Box>
  );
};

export default Charts;
