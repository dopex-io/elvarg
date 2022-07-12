import { useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';

import { AtlanticsContext, IEpochStrikeData } from 'contexts/Atlantics';

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
  availableCollateral: BigNumber;
  unlocked: BigNumber;
  activeCollateral: BigNumber;
  strike: BigNumber;
}

const Charts = (props: ChartsProps) => {
  const { /* line_data, */ underlying, collateral, title, type } = props;
  const { selectedPool } = useContext(AtlanticsContext);
  // const { chainId } = useContext(WalletContext);

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

  return (
    <Box className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <Box className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-full sm:w-full">
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
    </Box>
  );
};

export default Charts;
