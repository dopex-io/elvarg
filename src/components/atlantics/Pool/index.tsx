import Link from 'next/link';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import IconButton from '@mui/material/IconButton';

import Typography from 'components/UI/Typography';
import PoolCardItem from 'components/atlantics/Pool/PoolCardItem';
import PutsIcon from 'svgs/icons/PutsIcon';
import CallsIcon from 'svgs/icons/CallsIcon';

import formatAmount from 'utils/general/formatAmount';
import { BigNumber } from 'ethers';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

// import { TOKEN_DECIMALS } from 'constants/index';

interface PoolCardProps {
  depositToken: string;
  underlying: string;
  duration: string | null;
  isPut: boolean;
  tvl: BigNumber;
  apy: BigNumber | BigNumber[] | string;
}

const PoolCard = (props: PoolCardProps) => {
  const { depositToken, underlying, duration, isPut, tvl, apy } = props;
  const type: string = isPut ? 'PUTS' : 'CALLS';
  const _apy = useMemo(() => {
    return isPut ? '-' : apy + '%';
  }, [isPut, apy]);

  return (
    <Link href={`/atlantics/manage/${underlying}-${type}-${duration}`} passHref>
      <Box
        className="bg-umbra rounded-lg p-3 border border-umbra hover:border-primary transition ease-in-out hover:duration-250"
        role="button"
        // onClick={handleMarketSelection}
      >
        <Box className="flex justify-between">
          <Box className="flex space-x-2">
            <img
              src={`/images/tokens/${depositToken.toLowerCase()}.svg`}
              alt={depositToken.toLowerCase()}
              className="h-[2rem] w-[2rem] border border-mineshaft rounded-full"
            />
            <Typography variant="h6" className=" ml=[3rem] my-auto">
              {`${underlying}-${type}-${duration}`}
            </Typography>
            {!isPut ? (
              // @TODO Fill is hard coded
              <CallsIcon fill="#8aff95" className="my-auto" />
            ) : (
              <PutsIcon className="my-auto" />
            )}
          </Box>
          <IconButton className="p-0">
            <ArrowForwardRoundedIcon className="fill-current text-white" />
          </IconButton>
        </Box>
        <Box className="space-y-2 m-2 py-1">
          <PoolCardItem
            description="Epoch Length"
            value={duration ? duration.toUpperCase() : '--'}
          />
          <PoolCardItem
            description="TVL"
            value={'$' + formatAmount(getUserReadableAmount(tvl, 6), 3, true)}
          />
          <PoolCardItem description="APY" value={_apy} />
        </Box>
      </Box>
    </Link>
  );
};

export default PoolCard;
