import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const LegacyFarmBanner = ({ amount }: { amount: string | BigNumber }) => {
  return (
    <Box className="xl:max-w-4xl lg:max-w-3xl md:max-w-2xl sm:max-w-xl max-w-md mx-auto mt-32 mb-10 lg:mb-4">
      <Box className="flex flex-col bg-primary rounded-lg mx-6 py-4 px-6 lg:h-20 lg:flex-row sm:items-center h-full">
        <Box className="md:w-full self-start">
          <Typography variant="h4" className="text-white">
            Unstaked RDPX Tokens.
          </Typography>
          <span className="font-thin text-white">
            You have {getUserReadableAmount(amount).toString()} unstaked RDPX
            tokens in the{' '}
            <a
              className="underline"
              href={'https://legacy-rdpx-ss-farm.dopex.io/farms'}
            >
              Legacy farm
            </a>
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default LegacyFarmBanner;
