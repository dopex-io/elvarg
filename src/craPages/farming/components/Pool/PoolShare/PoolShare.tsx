import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Box, Tooltip } from '@material-ui/core';

import Typography from 'components/UI/Typography';

const PoolShare = ({ userDeposit, total }) => {
  const [share, setShare] = useState('0');
  const [exactShare, setExactShare] = useState('0');

  useEffect(() => {
    const currentShare: Number | BigNumber = userDeposit.eq(0)
      ? 0
      : userDeposit
          .mul(10 ** 6)
          .div(total)
          .toNumber() /
        10 ** 4;

    if (currentShare === 0) {
      setShare('0');
    } else if (currentShare < 1) {
      setShare('< 1');
      setExactShare(currentShare.toFixed(6));
    } else if (currentShare > 1) {
      setShare(currentShare.toFixed(2));
    }
  }, [userDeposit, total]);
  return (
    <Box>
      {share !== '< 1' ? (
        <Typography className="text-left" variant="h4">
          {share}%
        </Typography>
      ) : (
        <Box className="flex flex-row w-full justify-between items-center">
          <Typography className="text-left" variant="h4">
            {share}%
          </Typography>
          <Tooltip className="h-4 mt-1" title={`Exact share: ${exactShare}%`}>
            <InfoOutlinedIcon />
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default PoolShare;
