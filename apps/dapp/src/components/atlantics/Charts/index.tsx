import { useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import CustomButton from 'components/UI/Button';

import { IAtlanticPoolEpochStrikeData } from 'store/Vault/atlantics';
import { useBoundStore } from 'store';

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

interface IPoolData {
  availableCollateral: BigNumber;
  unlocked: BigNumber;
  activeCollateral: BigNumber;
  strike: BigNumber;
}

// interface ILineData {
//   totalEpochLiquidityByCheckpoint: BigNumber[];
//   totalEpochUnlockedCollateralByCheckpoint: BigNumber[];
// }

const Charts = (props: ChartsProps) => {
  const { line_data, underlying, collateral, title, type } = props;
  const { accountAddress, atlanticPool, atlanticPoolEpochData, connect } =
    useBoundStore();

  const handleWalletConnect = useCallback(() => {
    connect && connect();
  }, [connect]);

  const poolData:
    | {
        type: string;
        data: IPoolData[] | IPoolData;
      }
    | undefined = useMemo(() => {
    const defaultData = {
      type: 'loading',
      data: [
        {
          availableCollateral: BigNumber.from(0),
          unlocked: BigNumber.from(0),
          activeCollateral: BigNumber.from(0),
          strike: BigNumber.from(0),
        },
      ],
    };

    if (!accountAddress) return { ...defaultData, type: 'connect' };

    if (!atlanticPoolEpochData) return defaultData;

    if (atlanticPoolEpochData.tickSize?.eq(0)) return defaultData;
    const data =
      atlanticPoolEpochData.epochStrikeData as IAtlanticPoolEpochStrikeData[];

    const barData: IPoolData[] = data?.map((data) => {
      const unlocked = data.unlocked ?? BigNumber.from(0);
      const activeCollateral = data.activeCollateral ?? BigNumber.from(0);
      const strike = data.strike ?? BigNumber.from(0);
      const availableCollateral =
        data.totalEpochMaxStrikeLiquidity.sub(data.activeCollateral) ??
        BigNumber.from(0);

      return {
        availableCollateral,
        unlocked,
        activeCollateral,
        strike,
      };
    });

    return {
      type: 'barData',
      data: barData,
    };
  }, [accountAddress, atlanticPoolEpochData]);

  const renderComponent = useMemo(() => {
    if (!poolData || !atlanticPool || !atlanticPool.underlyingPrice) return;
    if (poolData.type === 'connect')
      return (
        <Box className="p-3 items-center text-center my-auto">
          <CustomButton size="medium" onClick={handleWalletConnect}>
            Connect Wallet
          </CustomButton>
        </Box>
      );
    else if (poolData.type === 'loading')
      return (
        <Box className="p-3 items-center text-center my-auto">
          <CircularProgress size="30px" />
        </Box>
      );
    else
      return (
        <ClientRenderedBarGraph
          data={poolData.data as IPoolData[]}
          currentPrice={atlanticPool?.underlyingPrice}
          width={900}
          height={180}
          header={{ underlying, collateral, title, type }}
        />
      );
  }, [
    atlanticPool,
    collateral,
    handleWalletConnect,
    poolData,
    title,
    type,
    underlying,
  ]);

  // const lineData = useMemo(() => {}, []);

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-2/3 sm:w-full">
        {renderComponent}
      </Box>
      <Box className="flex flex-col h-fit bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-full md:w-1/3 sm:w-full">
        <ClientRenderedLineChart data={line_data} width={255} height={167.5} />
      </Box>
    </Box>
  );
};

export default Charts;
