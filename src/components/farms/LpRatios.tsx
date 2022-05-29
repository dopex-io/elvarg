import Box from '@mui/material/Box';
import { BigNumber, utils } from 'ethers';
import { useContext } from 'react';

import { FarmingContext } from 'contexts/Farming';

import Chip from './Chip';

import formatAmount from 'utils/general/formatAmount';

const LpRatios = ({
  stakingTokenSymbol,
  userStakingRewardsBalance,
}: {
  stakingTokenSymbol: string;
  userStakingRewardsBalance: BigNumber;
}) => {
  const { lpData } = useContext(FarmingContext);

  if (!lpData) return <></>;

  const token0Symbol = stakingTokenSymbol === 'DPX-WETH' ? 'DPX' : 'RDPX';

  const amountToken0 =
    token0Symbol === 'RDPX'
      ? lpData.rdpxWethLpTokenRatios.rdpx *
        Number(utils.formatEther(userStakingRewardsBalance))
      : lpData.dpxWethLpTokenRatios.dpx *
        Number(utils.formatEther(userStakingRewardsBalance));

  const amountEth =
    token0Symbol === 'RDPX'
      ? lpData.rdpxWethLpTokenRatios.weth *
        Number(utils.formatEther(userStakingRewardsBalance))
      : lpData.dpxWethLpTokenRatios.weth *
        Number(utils.formatEther(userStakingRewardsBalance));

  return (
    <Box className="flex space-x-2">
      <Chip text={`${formatAmount(amountToken0, 1)} ${token0Symbol}`} />
      <Chip text={`${formatAmount(amountEth, 1)} ETH`} />
    </Box>
  );
};

export default LpRatios;
