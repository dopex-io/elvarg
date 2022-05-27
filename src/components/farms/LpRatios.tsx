import Box from '@mui/material/Box';
import { BigNumber, utils } from 'ethers';
import { useContext } from 'react';

import { FarmingContext } from 'contexts/Farming';

import Chip from './Chip';
import formatAmount from 'utils/general/formatAmount';

const LpRatios = ({
  stakingTokenSymbol,
  userDeposit,
}: {
  stakingTokenSymbol: string;
  userDeposit: BigNumber;
}) => {
  const { lpData } = useContext(FarmingContext);

  if (!lpData) return <></>;

  const token0Symbol = stakingTokenSymbol === 'DPX-WETH' ? 'DPX' : 'RDPX';

  const amountToken0 =
    token0Symbol === 'RDPX'
      ? lpData.rdpxWethLpTokenRatios.rdpx *
        Number(utils.formatEther(userDeposit))
      : lpData.dpxWethLpTokenRatios.dpx *
        Number(utils.formatEther(userDeposit));

  const amountEth =
    token0Symbol === 'RDPX'
      ? lpData.rdpxWethLpTokenRatios.weth *
        Number(utils.formatEther(userDeposit))
      : lpData.dpxWethLpTokenRatios.weth *
        Number(utils.formatEther(userDeposit));

  return (
    <Box className="flex space-x-2">
      <Chip text={`${formatAmount(amountToken0, 2)} ${token0Symbol}`} />
      <Chip text={`${formatAmount(amountEth, 2)} ETH`} />
    </Box>
  );
};

export default LpRatios;
