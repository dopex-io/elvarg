import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Description = () => {
  return (
    <Box className={'lg:w-3/4'}>
      <Box className={'flex'}>
        <Box className={'rounded-full mt-auto mb-auto'}>
          {/* <img src="/images/tokens/mim.svg" className="w-[6rem]" alt="ir" /> */}
        </Box>
        <Typography
          variant="h3"
          className="ml-5 flex items-center space-x-3 lg:text-4xl"
        >
          PUSD Interest Rate Vaults
        </Typography>
        <Typography
          variant="h3"
          className="mt-8 ml-6 mb-6 h-10 flex text-lg items-center space-x-3 border border-primary py-1 px-2 rounded-md"
        >
          BETA
        </Typography>
      </Box>
      <Typography variant="h4" className="text-stieglitz mt-6 mb-6">
        This vault accepts 2CRV LP deposits and lets users write Interest Rate
        options that allows for bet/hedge on the underlying interest rate.
      </Typography>
    </Box>
  );
};

export default Description;
