import { useCallback, useContext } from 'react';
import Link from 'next/link';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import IconButton from '@mui/material/IconButton';

import Typography from 'components/UI/Typography';
import PoolCardItem from 'components/atlantics/Pool/PoolCardItem';
import PutsIcon from 'svgs/icons/PutsIcon';
import CallsIcon from 'svgs/icons/CallsIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

interface PoolCardProps {
  tokenId: string;
  strategy: string;
  underlying: string;
  isPut: boolean;
  epochLength: 'daily' | 'weekly' | 'monthly';
  deposits: BigNumber;
}

const PoolCard = (props: PoolCardProps) => {
  const { tokenId, strategy, underlying, isPut, epochLength, deposits } = props;

  const { setSelectedMarket } = useContext(AtlanticsContext);

  const type = useMemo(() => (isPut ? 'PUT' : 'CALL'), [isPut]);

  const handleMarketSelection = useCallback(() => {
    setSelectedMarket(tokenId);
  }, [setSelectedMarket, tokenId]);

  return (
    <Link
      href={`/atlantics/manage/${strategy.toLowerCase()}/${tokenId}-${
        isPut ? `${underlying}-` : '-'
      }${type}S-${epochLength}`}
    >
      <Box
        className="bg-umbra rounded-lg p-3 border border-umbra hover:border-primary transition ease-in-out hover:duration-250"
        role="button"
        onClick={handleMarketSelection}
      >
        <Box className="flex justify-between">
          <Box className="flex space-x-2">
            <img
              src={`/images/tokens/${underlying.toLowerCase()}.svg`}
              alt={underlying.toLowerCase()}
              className="h-[2rem] w-[2rem] border border-mineshaft rounded-full"
            />
            <Typography variant="h6" className="my-auto">
              {strategy}
            </Typography>
            {type.toLowerCase() === 'put' ? (
              <PutsIcon fill="#8E8E8E" className="my-auto" />
            ) : (
              <CallsIcon fill="#8E8E8E" className="my-auto" />
            )}
          </Box>
          <IconButton className="p-0">
            <ArrowForwardRoundedIcon className="fill-current text-white" />
          </IconButton>
        </Box>
        <Box className="space-y-2 mt-2">
          <PoolCardItem description="Epoch Length" value={epochLength} />
          <PoolCardItem
            description="Deposits"
            value={formatAmount(
              getUserReadableAmount(deposits, 18),
              3,
              true,
              true
            )}
          />
        </Box>
      </Box>
    </Link>
  );
};

export default PoolCard;
