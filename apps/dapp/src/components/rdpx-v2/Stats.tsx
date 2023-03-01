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
        let cornerCurve;
        let border;

        const len = Object.keys(statsObject).length;

        if (index === 0) {
          cornerCurve = 'tl';
          border = 'border-y border-l border-r';
        } else if (index === 1) {
          cornerCurve = 'tr';
          border = 'border-t border-b border-r';
        } else if (index === len - 2) {
          border = 'border-b border-r border-l';
          cornerCurve = 'bl';
        } else if (index === len - 1) {
          cornerCurve = 'br';
          border = 'border-b border-r';
        }

        return (
          <Box
            className={`flex justify-between ${border} border-umbra rounded-${cornerCurve}-lg px-3 py-4`}
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
