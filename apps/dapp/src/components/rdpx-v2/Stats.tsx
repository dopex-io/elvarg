import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface Props {
  statsObject: Record<string, string | number>;
}

const Stats = (props: Props) => {
  const { statsObject } = props;

  return (
    <Box className="grid grid-flow-row grid-cols-2">
      {Object.keys(statsObject).map((key: string, index) => {
        let rounding;
        let border;
        const len = Object.keys(statsObject).length;

        if (index === 0) {
          rounding = 'rounded-tl-lg';
          border = 'border-y border-l border-r';
        } else if (index === 1) {
          rounding = 'rounded-tr-lg';
          border = 'border-t border-b border-r';
        } else if (index === len - 2) {
          border = 'border-b border-r border-l';
          rounding = 'rounded-bl-lg';
        } else if (index === len - 1) {
          border = 'border-b border-r';
          rounding = 'rounded-br-lg';
        }

        return (
          <Box
            className={`flex justify-between ${border} ${rounding} border-umbra  px-3 py-4`}
            key={index}
          >
            <Typography variant="h6" color="stieglitz">
              {key}
            </Typography>
            <Typography variant="h6">{statsObject[key]}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Stats;
