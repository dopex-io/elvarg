import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

interface PoolStrategyProps {
  strategyLabel: string;
}

const PoolStrategy = (props: PoolStrategyProps) => {
  const { strategyLabel } = props;

  const { chainId, contractAddresses } = useBoundStore();

  return (
    <Box className="flex">
      <a
        href={`${CHAIN_ID_TO_EXPLORER[chainId]}address/${
          contractAddresses['STRATEGIES']?.['INSURED-PERPS']?.['STRATEGY'] ?? ''
        }`}
        rel="noopener noreferrer"
        target={'_blank'}
        className="bg-mineshaft rounded-lg text-center p-2 font-mono"
      >
        <Typography variant="h6">{strategyLabel}</Typography>
      </a>
    </Box>
  );
};

export default PoolStrategy;
