import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

const WithdrawalInfo = () => {
  return (
    <Box className={'w-full'}>
      <Typography variant="h4" className="text-white">
        Withdrawals
      </Typography>
      <Typography variant="h4" className="text-stieglitz mt-3">
        At the end of every epoch, users can withdraw any excess funds from the
        volume pool - however they would have to pay a 1% penalty at withdrawal
        for non-usage of funds. All penalties are withdraw-able by DPX
        governance token holders in the form of protocol fees.
      </Typography>
    </Box>
  );
};

export default WithdrawalInfo;
