import Box from '@mui/material/Box';

import CallPoolStatItem from 'components/atlantics/Charts/CallPoolStats/CallPoolStatItem';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

interface CallPoolStatsInterface {
  data: any;
  underlyingSymbol: string;
}

const CallPoolStats = (props: CallPoolStatsInterface) => {
  const { data, underlyingSymbol } = props;

  return (
    <Box className="grid grid-cols-2 h-full">
      <CallPoolStatItem
        description="Available Collateral"
        value={formatAmount(
          getUserReadableAmount(data.data.availableCollateral),
          3
        )}
        symbol={underlyingSymbol}
      />
      <CallPoolStatItem
        description="Unlocked Collateral"
        value={formatAmount(getUserReadableAmount(data.data.unlocked), 3)}
        symbol={underlyingSymbol}
      />
      <CallPoolStatItem
        description="Active Collateral"
        value={formatAmount(
          getUserReadableAmount(data.data.activeCollateral),
          3
        )}
        symbol={underlyingSymbol}
      />
      <CallPoolStatItem
        description="Strike"
        value={'$' + getUserReadableAmount(data.data.strike, 8)}
      />
    </Box>
  );
};

export default CallPoolStats;
