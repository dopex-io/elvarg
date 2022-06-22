import { Box } from '@mui/system';
import React, { useContext } from 'react';

import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

const PoolStrategies = () => {
  return (
    <Box className="flex">
      <StrategyInfo />
    </Box>
  );
};

const StrategyInfo = () => {
  const { chainId, contractAddresses } = useContext(WalletContext);
  return (
    <Box className="bg-arbitrum  rounded-lg text-center p-2 font-mono">
      <Typography variant="h6">
        <a
          href={`${CHAIN_ID_TO_EXPLORER[chainId]}/address/${contractAddresses['ATLANTIC-POOLS']['STRATEGIES']}`}
          rel="noopener noreferrer"
          target={'_blank'}
        >
          Insured Long Perpetuals
        </a>
      </Typography>
    </Box>
  );
};

export default PoolStrategies;
