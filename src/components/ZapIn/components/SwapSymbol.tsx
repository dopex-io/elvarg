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
    <Box className="rounded-md flex p-1 border border-neutral-800 bg-neutral-700 pr-3">
      <img
        src={props.imgSrc}
        alt={props.imgAlt}
        className={
          'rounded-md w-[16px] h-[18px] mt-auto p-0.5 bg-neutral-600 object-cover'
        }
      />
      <Box className={'ml-1.5'}>
        <Typography variant="h6" className="text-white text-sm">
          {props.symbol.length === 3 ? (
            <span className={'opacity-0'}>{'.'}</span>
          ) : null}
          {props.symbol}
          {props.symbol.length === 3 ? (
            <span className={'opacity-0'}>{'W'}</span>
          ) : null}
        </Typography>
      </Box>
    </Box>
  );
};

export default SwapSymbol;
