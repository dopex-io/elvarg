import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Tooltip } from '@mui/material';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const LessThanOneAmount = ({ value }: { value: string | BigNumber }) => {
  return (
    <Box className="flex content-center items-center ">
      <span>
        <Typography className="text-wave:blue" variant="h5">
          &#60; 1
        </Typography>
      </span>
      <Tooltip
        title={`Exact amount: ${getUserReadableAmount(value, 18)}`}
        placement="bottom"
      >
        <InfoOutlinedIcon className="h-3 w-3 ml-1 mt-1 " />
      </Tooltip>
    </Box>
  );
};

export default LessThanOneAmount;
