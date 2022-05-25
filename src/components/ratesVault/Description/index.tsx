import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Description = () => {
  return (
    <Box className={'lg:w-3/4'}>
      <Box className={'flex'}>
        <Box className={'rounded-full mt-auto mb-auto'}>
          <img src="/assets/ir.svg" className="w-[6rem]" alt="ir" />
        </Box>
        <Typography
          variant="h3"
          className="ml-5 flex items-center space-x-3 lg:text-4xl"
        >
          MIM3CRV Interest Rate Vaults
        </Typography>
      </Box>
      <Typography variant="h4" className="text-stieglitz mt-6 mb-6">
        This vault accepts MIM3CRV LP deposits and lets users write Interest
        Rate options that allows for bet/hedge on the underlying interest rate.
      </Typography>
    </Box>
  );
};

export default Description;
