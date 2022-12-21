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

        if (index === 0) cornerCurve = 'tl';
        else if (index === 1) cornerCurve = 'tr';
        else if (index === len - 1) cornerCurve = 'br';
        else if (index === len - 2) cornerCurve = 'bl';

        if (index % 2 === 0 && index !== len - 2) border = 'border-l';
        else if (index === len - 2) border = 'border-b border-l';
        else if (index === len - 1) border = 'border-b';

        return (
          <Box
            className={`flex justify-between border-t border-r ${border} border-umbra rounded-${cornerCurve}-xl px-3 py-4`}
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
