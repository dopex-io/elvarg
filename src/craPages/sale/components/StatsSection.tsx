import Box from '@mui/material/Box';

import StatBox from './StatBoxComponent';
import InfoPopover from 'components/UI/InfoPopover';

import formatAmount from 'utils/general/formatAmount';

const StatsSection = ({ data }) => {
  const { formik, deposits, depositShare, claimAmount } = data;

  return (
    <Box className="border-umbra rounded-xl border p-4 flex flex-col mb-4">
      <Box className="flex flex-row justify-between mb-4">
        <StatBox
          Top={
            formik.values.amount !== '0'
              ? deposits !== null
                ? formatAmount(deposits)
                : '-'
              : deposits !== null
              ? formatAmount(deposits) + ' ETH'
              : '-'
          }
          Bottom={'Your Deposit'}
          data={{ formik }}
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
          data={{ formik }}
        />
      </Box>
      <Box className="flex flex-row justify-between">
        <StatBox
          Top={
            formik.values.amount !== '0'
              ? claimAmount !== null
                ? `${formatAmount(claimAmount)} DPX`
                : '-'
              : claimAmount !== null
              ? `${formatAmount(claimAmount)} DPX`
              : '-'
          }
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
          data={{ formik }}
        />
      </Box>
    </Box>
  );
};
export default StatsSection;
