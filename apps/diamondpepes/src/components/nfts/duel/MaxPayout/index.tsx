import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

const MaxPayout = ({
  value,
  tokenName,
}: {
  value: number;
  tokenName: string;
}) => {
  return (
    <Box className={'flex mt-3'}>
      <Typography variant="h6" className="text-[#78859E] ml-0 mr-auto">
        Max Payout
      </Typography>
      <Box className={'text-right'}>
        <Typography variant="h6" className="text-white mr-auto ml-0">
          {formatAmount(value, 4)} {tokenName}
        </Typography>
      </Box>
    </Box>
  );
};

export default MaxPayout;
