import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';

// import CallPoolStats from 'components/atlantics/Charts/CallPoolStats';

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
  const { atlanticPoolEpochData } = useBoundStore();

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

    if (!atlanticPoolEpochData) return defaultData;

    if (atlanticPoolEpochData.tickSize?.eq(0)) return defaultData;
    const data =
      atlanticPoolEpochData.epochStrikeData as IAtlanticPoolEpochStrikeData[];

    const barData: IPoolData[] = data?.map((data) => {
      const unlocked = data.unlocked ?? BigNumber.from(0);
      const activeCollateral = data.activeCollateral ?? BigNumber.from(0);
      const strike = data.strike ?? BigNumber.from(0);
      const availableCollateral =
        data.totalEpochMaxStrikeLiquidity ?? BigNumber.from(0);

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
  }, [atlanticPoolEpochData]);

  // const renderComponent: React.ReactNode = useMemo(() => {
  // const isPut = selectedPool.isPut;
  // const renderCondition = isPut && poolData.type === 'barData';

  // renderCondition ? (
  // return (
  //   <ClientRenderedBarGraph
  //     data={poolData.data as IPoolData[]}
  //     width={1000}
  //     height={240}
  //     header={{ underlying, collateral, title, type }}
  //   />
  // );
  // ) : (
  //   <CallPoolStats data={poolData} underlyingSymbol={underlying} />
  // );
  // }, [collateral, poolData, title, type, underlying]);

  // const lineData: ILineData = useMemo(() => {
  //   if (!selectedPool || selectedPool.checkpoints.length <= 1)
  //     return {
  //       totalEpochLiquidityByCheckpoint: [],
  //       totalEpochUnlockedCollateralByCheckpoint: [],
  //     };

  //   const _checkpoints = selectedPool.checkpoints;

  //   const _checkpointStrikeData = _checkpoints
  //     .map((strike: any) => {
  //       return strike.map((data: any) => ({
  //         unlocks: data.activeCollateral,
  //         liquidity: data.totalLiquidity,
  //         timestamp: Number(data.startTime),
  //       }));
  //     })
  //     .flat();

  //   const _aggregatedUnlocks = _checkpointStrikeData.reduce(
  //     (acc, curr) => ({
  //       unlocks: acc.unlocks.add(curr.unlocks),
  //       liquidity: acc.liquidity.add(curr.liquidity),
  //     }),
  //     {
  //       unlocks: BigNumber.from(0),
  //       liquidity: BigNumber.from(0),
  //     }
  //   );

  //   return {
  //     totalEpochLiquidityByCheckpoint: [],
  //     totalEpochUnlockedCollateralByCheckpoint: [],
  //   };
  // }, [selectedPool]);

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-2/3 sm:w-full">
        {poolData.type !== 'loading' ? (
          // renderComponent
          <ClientRenderedBarGraph
            data={poolData.data as IPoolData[]}
            width={1000}
            height={240}
            header={{ underlying, collateral, title, type }}
          />
        ) : (
          <Box className="p-3 items-center text-center h-[15.7rem] py-[8.65rem]">
            <CircularProgress size="30px" />
          </Box>
        )}
      </Box>
      <Box className="flex flex-col bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-full md:w-1/3 sm:w-full">
        <ClientRenderedLineChart data={line_data} width={340} height={220} />
      </Box>
    </Box>
  );
};

export default Charts;
