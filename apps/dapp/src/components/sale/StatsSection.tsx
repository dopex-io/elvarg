import Box from '@mui/material/Box';

import InfoPopover from 'components/UI/InfoPopover';

import formatAmount from 'utils/general/formatAmount';

import StatBox from './StatBoxComponent';

const StatsSection = ({ data }: any) => {
  const { deposits, depositShare, claimAmount } = data;

  return (
    <Box className="border-umbra rounded-xl border p-4 flex flex-col mb-4">
      <Box className="flex flex-row justify-between mb-4">
        <StatBox
          Top={deposits !== null ? formatAmount(deposits) : '-'}
          Bottom={'Your Deposit'}
        />
        <StatBox
          Top={
            Number(depositShare) > 0 ? formatAmount(depositShare) + '%' : '-'
          }
          Bottom={
            <Box className="flex flex-row items-center">
              Your Share
              <InfoPopover
                id="dpx-share-info"
                infoText="Your share represents the amount of ETH deposited by you with respect
                to the total ETH deposited."
                className="text-stieglitz ml-1"
              />
            </Box>
          }
        />
      </Box>
      <Box className="flex flex-row justify-between">
        <StatBox
          Top={claimAmount !== null ? `${formatAmount(claimAmount)} DPX` : '-'}
          Bottom={
            <Box className="flex flex-row items-center">
              Estimated DPX claim
              <InfoPopover
                id="dpx-claim-info"
                infoText="Your DPX claim is based on your share of ETH deposited when the token sale finishes."
                className="text-stieglitz ml-1"
              />
            </Box>
          }
        />
      </Box>
    </Box>
  );
};
export default StatsSection;
