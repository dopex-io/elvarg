import { useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';

import getTokenDecimals from 'utils/general/getTokenDecimals';

import { AtlanticsContext, IAtlanticPoolCheckpoint } from 'contexts/Atlantics';
import { WalletContext } from 'contexts/Wallet';

// const ClientRenderedLineChart = dynamic(() => import('./LiquidityLineChart'), {
//   ssr: false,
// });

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
  availableCollateral: number | string;
  unlocked: number | string;
  activeCollateral: number | string;
  strike: number | string;
}

const Charts = (props: ChartsProps) => {
  const { /* line_data, */ underlying, collateral, title, type } = props;
  const { selectedPool } = useContext(AtlanticsContext);
  const { chainId } = useContext(WalletContext);

  const barData: IBarData[] = useMemo((): IBarData[] => {
    if (!selectedPool)
      return [
        { availableCollateral: 0, unlocked: 0, activeCollateral: 0, strike: 0 },
      ];
    if (selectedPool.isPut) {
      const strikes = selectedPool.strikes as BigNumber[];
      const data = selectedPool.data as IAtlanticPoolCheckpoint[];
      const { deposit } = selectedPool.tokens;
      if (!deposit)
        return [
          {
            availableCollateral: 0,
            unlocked: 0,
            activeCollateral: 0,
            strike: 0,
          },
        ];
      const decimals = getTokenDecimals(deposit, chainId);

      const barData: IBarData[] = strikes?.map(
        (maxStrike: BigNumber, index: number) => {
          const unlocked =
            Number(data[index]?.unlockCollateral) / 10 ** decimals;
          const activeCollateral =
            Number(data[index]?.activeCollateral) / 10 ** decimals;
          const strike = Number(maxStrike.div(1e8));
          const availableCollateral =
            Number(data[index]?.liquidity) / 10 ** decimals - activeCollateral;

          console.log(unlocked, activeCollateral, availableCollateral);
          return {
            availableCollateral,
            unlocked,
            activeCollateral,
            strike,
          };
        }
      );
      return barData;
    } else {
      return [
        { availableCollateral: 0, unlocked: 0, activeCollateral: 0, strike: 0 },
      ];
    }
  }, [selectedPool, chainId]);

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-full sm:w-full">
        {barData[0]?.availableCollateral !== 0 ? (
          <ClientRenderedBarGraph
            data={barData}
            width={1000}
            height={230}
            header={{ underlying, collateral, title, type }}
          />
        ) : (
          <Box className="p-3 items-center text-center h-[15.7rem] py-[8.65rem]">
            <CircularProgress size="30px" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Charts;
