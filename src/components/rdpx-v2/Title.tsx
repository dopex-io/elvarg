import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import BetaIcon from 'svgs/icons/BetaIcon';

interface Props {
  title: string;
  description: string;
  price: string;
}

const Title = (props: Props) => {
  const { title, description, price } = props;

  return (
    <Box className="flex bg-cod-gray divide-x divide-umbra rounded-xl py-2">
      <Box className="flex justify-between w-1/2 px-3">
        <Box className="flex space-x-2 w-full">
          <img
            src="/images/tokens/dsc.svg"
            className={'mx-2'}
            alt={'Divisor'}
          />
          <Box className="my-auto">
            <Typography variant="h6">{title}</Typography>
            <Typography variant="caption" color="stieglitz">
              {description}
            </Typography>
          </Box>
        </Box>
        <BetaIcon className="my-auto" />
      </Box>
      <Box className="w-1/2 px-3 my-auto">
        <Typography variant="h6">{price}</Typography>
        <Typography variant="caption" color="stieglitz">
          Current Price
        </Typography>
      </Box>
    </Box>
  );
};

export default Title;
