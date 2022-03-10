import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import getDEXFrom1InchName from 'utils/general/getDEXFrom1inchName';

interface Props {
  pair: string;
  dexes?: { name: string; percentage: string }[];
}

const SwapStep = (props: Props) => {
  return (
    <Box>
      <Typography variant="h6" className="text-white mb-2 mt-3">
        {props.pair}
      </Typography>
      <Box className="rounded-md flex flex-col p-3 border border-neutral-800 bg-neutral-800">
        {props.dexes.map((dex) => (
          <Box className="flex" key={dex['name']}>
            <img
              alt={dex['name']}
              src={'/assets/' + getDEXFrom1InchName(dex['name'])?.picture}
              className="w-4 h-4 mt-1 mr-3 rounded-sm"
            />

            <Typography variant="h6" className="text-white opacity-60 mb-1">
              {getDEXFrom1InchName(dex['name'])?.name}
            </Typography>
            <Typography variant="h6" className="text-white ml-auto mr-0">
              {' '}
              {dex['percentage']}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SwapStep;
