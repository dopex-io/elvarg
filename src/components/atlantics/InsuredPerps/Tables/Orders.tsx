import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface Props {
  active: string;
}

const Orders = (props: Props) => {
  const { active } = props;

  console.log(active);

  return (
    <>
      {
        <Box className="w-full text-center bg-umbra rounded-xl py-8">
          <Typography variant="h6">You Have Pending Orders</Typography>
        </Box>
      }
    </>
  );
};

export default Orders;
