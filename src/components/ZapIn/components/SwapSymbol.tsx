import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface Props {
  isInDialog: boolean;
  imgAlt: string;
  imgSrc: string;
  symbol: string;
}

const SwapSymbol = (props: Props) => {
  return (
    <Box className="rounded-md flex p-1 border border-neutral-800 bg-neutral-700">
      <Box className="rounded-md flex flex-col mb-0 p-1 bg-neutral-600">
        <img
          src={props.imgSrc}
          alt={props.imgAlt}
          className={
            props.isInDialog ? 'w-4 h-4 mt-0.5' : 'w-[1.2rem] mt-[0.05rem]'
          }
        />
      </Box>
      <Typography variant="h6" className="text-white  pl-2 pr-2 pt-0.5 text-sm">
        {props.symbol}
      </Typography>
    </Box>
  );
};

export default SwapSymbol;
