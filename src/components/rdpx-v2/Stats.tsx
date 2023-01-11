import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface Props {
  statsObject: Record<string, string | number>;
}

const Stats = (props: Props) => {
  const { statsObject } = props;

  return (
    <Box className="grid grid-flow-row grid-cols-3">
      {Object.keys(statsObject).map((key: string, index) => {
        let cornerCurve;
        let border;

        const len = Object.keys(statsObject).length;

        if (index === 0) {
          cornerCurve = 'tl';
          border = 'border-y border-l border-r';
        } else if (index === 1) {
          border = 'border-t border-b';
        } else if (index === len - 1) {
          cornerCurve = 'bl';
          border = 'border-b border-r border-l';
        } else if (index === 2) {
          cornerCurve = 'tr';
          border = 'border';
        } else if (index % 3 === 0 && index === len - 3) {
          cornerCurve = 'bl';
          border = 'border-l border-b border-r';
        } else if ((index - 1) % 3 === 0) {
          border = 'border-b';
        }

        return (
          <Box
            className={`flex justify-between ${border} border-umbra rounded-${cornerCurve}-lg px-2 py-3`}
            key={index}
          >
            <Typography variant="h6" color="stieglitz">
              {key}
            </Typography>
            <Typography variant="h6">{statsObject[key]}</Typography>
          </Box>
        );
      })}
      {/*
        Two trailing empty boxes inside a 2x3 grid (as per design)
      */}
      <Box
        className={`flex justify-between border-r border-b border-umbra px-2 py-3`}
      >
        <></>
        <></>
      </Box>
      <Box
        className={`flex justify-between border-r border-b rounded-br-lg border-umbra px-3 py-4`}
      >
        <></>
        <></>
      </Box>
    </Box>
  );
};

export default Stats;
