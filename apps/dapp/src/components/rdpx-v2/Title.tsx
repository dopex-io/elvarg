import Box from '@mui/material/Box';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Typography from 'components/UI/Typography';
// import BetaIcon from 'svgs/icons/BetaIcon';

// interface Props {
//   title: string;
//   description: string;
//   price: string;
// }

const Title = (/*props: Props*/) => {
  // const { title, description, price } = props;

  return (
    <Box>
      <Box className="text-center mx-auto max-w-xl flex flex-col items-center space-y-2">
        <span className="z-1 uppercase font-bold text-3xl tracking-[.5em]">
          Mint DSC
        </span>
        <Typography variant="h5" className="text-stieglitz">
          Bond rDPX to mint Dopex Synthetic Coins
        </Typography>
        <Box className="flex w-48 justify-around">
          <a href={'Lorem'} target="_blank" rel="noopener noreferrer">
            <div className="flex">
              <Typography
                variant="h6"
                className="my-auto"
                color="wave-blue hover:underline"
              >
                Intro to DSC
              </Typography>
              <ArrowForwardIcon className="fill-current text-wave-blue m-0 h-4 my-auto" />
            </div>
          </a>
        </Box>
      </Box>
      {/* <Box className="flex bg-cod-gray divide-x divide-umbra rounded-xl py-2">
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
      </Box> */}
    </Box>
  );
};

export default Title;
