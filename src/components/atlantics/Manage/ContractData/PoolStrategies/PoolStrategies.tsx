import { useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

const PoolStrategies = () => {
  return (
    <Box className="flex">
      <StrategyInfo />
    </Box>
  );
};

const StrategyInfo = () => {
  const { contractAddresses } = useContext(WalletContext);

  return (
    <Box className="bg-arbitrum  rounded-lg text-center p-2 font-mono">
      <Typography variant="h6">
        <a
          href={`https://testnet.arbiscan.io/address/${
            contractAddresses['STRATEGIES']?.['INSURED-PERPS'] ?? ''
          }`}
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
