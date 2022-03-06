import { Box } from '@mui/material';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import Caution from 'assets/icons/Caution';

const ClaimSection = ({ data }) => {
  const { saleClose, saleClosed } = data;
  return saleClosed ? (
    <Box className="lg:h-80 mb-5 lg:mb-6">
      <Box className="flex flex-row border-umbra rounded-xl border p-4 lg:h-72">
        <Typography variant="h5" className="text-stieglitz mr-4">
          🎉
        </Typography>
        <Typography variant="h5" className="text-stieglitz">
          The sale has concluded and DPX can now be claimed!
          <br />
          <br />
          Thank you for supporting decentralized options on Ethereum.
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box className="lg:h-80 mb-5 lg:mb-6">
      <Box className="flex flex-row border-umbra rounded-xl border lg:h-72 p-4">
        <Box className="mr-4">
          <Caution />
        </Box>
        <Typography variant="h5" className="text-stieglitz">
          Participants can claim tokens when the sale ends at{' '}
          {format(saleClose * 1000, 'haaa, do MMM yyyy')}.
          <br />
          <br />
          Please check back later!
        </Typography>
      </Box>
    </Box>
  );
};
export default ClaimSection;
