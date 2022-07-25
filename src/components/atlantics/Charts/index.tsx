import { useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';

import { AtlanticsContext, IEpochStrikeData } from 'contexts/Atlantics';

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
  const { selectedPool } = useContext(AtlanticsContext);

  const barData: IBarData[] = useMemo((): IBarData[] => {
    if (!selectedPool)
      return [
        {
          availableCollateral: BigNumber.from(0),
          unlocked: BigNumber.from(0),
          activeCollateral: BigNumber.from(0),
          strike: BigNumber.from(0),
        },
      ];
    if (selectedPool.isPut) {
      const data = selectedPool.epochStrikeData as IEpochStrikeData[];

      const { deposit } = selectedPool.tokens;
      if (!deposit)
        return [
          {
            availableCollateral: BigNumber.from(0),
            unlocked: BigNumber.from(0),
            activeCollateral: BigNumber.from(0),
            strike: BigNumber.from(0),
          },
        ];

      const barData: IBarData[] = data?.map((data) => {
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
      return barData;
    } else {
      return [
        {
          availableCollateral: BigNumber.from(0),
          unlocked: BigNumber.from(0),
          activeCollateral: BigNumber.from(0),
          strike: BigNumber.from(0),
        },
      ];
    }
  }, [selectedPool]);

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

  // console.log(lineData);

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-2/3 sm:w-full">
        {barData[0]?.strike.gt(0) ? (
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
      <Box className="flex flex-col bg-cod-gray p-3 rounded-lg divide-y divide-umbra w-full md:w-1/3 sm:w-full">
        <ClientRenderedLineChart data={line_data} width={340} height={230} />
      </Box>
    </Box>
  );
};

export default Charts;
