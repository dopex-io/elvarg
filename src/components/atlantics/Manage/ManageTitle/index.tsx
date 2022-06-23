import { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { AtlanticsContext } from 'contexts/Atlantics';

interface ManageCardTitleProps {
  depositToken: string;
  underlying: string;
  poolType: string;
  strategy: string;
  epochLength: string;
}

const ManageTitle = (props: ManageCardTitleProps) => {
  const { depositToken, underlying, poolType, strategy, epochLength } = props;

  const { selectedPool } = useContext(AtlanticsContext);

  const poolId = useMemo(() => {
    const { underlying, deposit } = selectedPool.tokens;
    if (!underlying || !deposit) return;

    return `${underlying}-${deposit}-${
      selectedPool?.isPut ? 'PUTS' : 'CALLS'
    }-${selectedPool?.duration.substring(0, 1)}`;
  }, [selectedPool]);

  return (
    <Box className="flex space-x-3 w-3/4">
      <Box className="relative w-[4.6rem]">
        {poolType === 'PUTS' && (
          <img
            src={`/images/tokens/${depositToken.toLowerCase()}.svg`}
            alt={depositToken}
            className="w-[2.625rem] border rounded-full border-umbra absolute left-[1.6rem]"
          />
        )}
        <img
          src={`/images/tokens/${underlying.toLowerCase()}.svg`}
          alt={underlying}
          className="w-[2.625rem] border rounded-full border-umbra"
        />
      </Box>
      <Box className="my-auto">
        <Typography variant="h5">{strategy.toUpperCase()}</Typography>
        <Typography variant="h6" color="stieglitz">
          {poolId}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        className="my-auto bg-umbra rounded-[0.4em] px-2 py-1"
      >
        {epochLength.toUpperCase()}
      </Typography>
      <Typography
        variant="h6"
        className="my-auto bg-umbra rounded-[0.4em] px-2 py-1"
      >
        {poolType.toUpperCase()}
      </Typography>
    </Box>
  );
};

export default ManageTitle;
