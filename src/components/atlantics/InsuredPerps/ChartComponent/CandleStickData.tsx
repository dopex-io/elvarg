import { useMemo } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

interface CandleStickDataProps {
  data: { [key: string]: number } | undefined;
}

const CandleStickData = (props: CandleStickDataProps) => {
  const {
    data = {
      high: 0,
      low: 0,
      open: 0,
      close: 0,
    },
  } = props;

  const textColor = useMemo(() => {
    if (!data['open'] || !data['close']) return 'white';
    return data['open'] < data['close'] ? 'up-only' : 'down-bad';
  }, [data]);

  return (
    <Box className="flex space-x-2 p-2 absolute z-10">
      {Object.keys(data).map((key: string) => (
        <>
          <Typography variant="h6">{key[0]?.toUpperCase()}: </Typography>
          <Typography variant="h6" color={textColor}>
            {data[key]}
          </Typography>
        </>
      ))}
    </Box>
  );
};

export default CandleStickData;
