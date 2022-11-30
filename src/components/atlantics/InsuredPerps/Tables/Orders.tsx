import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import Positions from './Positions';

interface Props {
  active: string;
}

const Orders = (props: Props) => {
  const { active } = props;

  return (
    <>
      {active === 'Orders' ? (
        <Box className="w-full text-center bg-umbra rounded-xl py-8">
          <Typography variant="h6">You Have Pending Orders</Typography>
        </Box>
      ) : (
        <Positions active={'Orders'} />
      )}
    </>
  );
};

export default Orders;
