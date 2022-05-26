import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

const WithdrawalInfo = () => {
  return (
    <Box className={'w-full'}>
      <Typography variant="h4" className="text-white">
        Withdrawals
      </Typography>
      <Typography variant="h4" className="text-stieglitz mt-3">
        At the end of every epoch, users can withdraw their deposits with the
        premiums they have accrued, yield rewards from the Curve USDT/USDC 2Pool
        and any loss of collateral if the options expire ITM.
      </Typography>
    </Box>
  );
};

export default WithdrawalInfo;
