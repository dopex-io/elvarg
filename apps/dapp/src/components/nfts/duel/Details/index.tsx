import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import MaxPayout from 'components/nfts/duel/MaxPayout';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import formatAmount from 'utils/general/formatAmount';

const Details = ({
  maxPayout,
  payoutTokenName,
  fees,
}: {
  maxPayout: number;
  payoutTokenName: string;
  fees: number;
}) => {
  const { chainId } = useBoundStore();

  return (
    <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-[#343C4D] w-full bg-[#343C4D]">
      <EstimatedGasCostButton gas={500000} chainId={chainId} />
      <MaxPayout value={maxPayout} tokenName={payoutTokenName} />
      <Box className={'flex mt-3'}>
        <Typography variant="h6" className="text-[#78859E] ml-0 mr-auto">
          Fees
        </Typography>
        <Box className={'text-right'}>
          <Typography variant="h6" className="text-white mr-auto ml-0">
            {formatAmount(fees, 4)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Details;
