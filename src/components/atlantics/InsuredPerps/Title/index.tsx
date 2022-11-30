import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

interface TitleProps {
  underlying: string | undefined;
  deposit: string | undefined;
  underlyingPrice?: BigNumber;
  stats?: { [key: string]: string | number };
}

const Title = (props: TitleProps) => {
  const {
    underlying,
    deposit,
    stats = {
      latest: 0,
      high_24h: 0,
      low_24h: 0,
      change_24h: 0,
    },
  } = props;

  const ticker = useMemo(() => {
    if (!underlying || !deposit) return '';
    return underlying.concat('/', deposit);
  }, [deposit, underlying]);

  return (
    <Box className="flex justify-between rounded-2xl bg-umbra px-4 py-3">
      <Typography variant="h5" className="my-auto content-center text-center">
        {ticker}
        <Typography variant="h5" color="stieglitz">
          ${formatAmount(stats?.['latest'], 2)}
        </Typography>
      </Typography>
      <img
        src="/assets/threedots-black.svg"
        className={'py-3'}
        alt={'Divisor'}
      />
      <Box className="flex flex-col text-center my-auto">
        <Typography variant="h6">{'24H High'}</Typography>
        <Typography variant="h6" color="up-only">
          ${formatAmount(stats?.['high_24h'], 2)}
        </Typography>
      </Box>
      <img
        src="/assets/threedots-black.svg"
        className={'py-3'}
        alt={'Divisor'}
      />
      <Box className="flex flex-col text-center my-auto">
        <Typography variant="h6">{'24H Low'}</Typography>
        <Typography variant="h6" color="down-bad">
          ${formatAmount(stats?.['low_24h'], 2)}
        </Typography>
      </Box>
      <img
        src="/assets/threedots-black.svg"
        className={'py-3'}
        alt={'Divisor'}
      />
      <Box className="flex flex-col text-center my-auto">
        <Typography variant="h6">{'24H Change'}</Typography>
        <Typography
          variant="h6"
          color={(stats?.['change_24h'] ?? 0) >= 0 ? `up-only` : 'down-bad'}
        >
          {(stats?.['change_24h'] ?? 0) >= 0 ? (
            <KeyboardArrowUpRoundedIcon className="fill-current text-up-only my-auto" />
          ) : (
            <KeyboardArrowDownRoundedIcon className="fill-current text-down-bad my-auto" />
          )}
          {formatAmount(stats?.['change_24h'], 2)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Title;
