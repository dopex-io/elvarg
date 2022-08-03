import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

interface CallPoolStatItem {
  description: string;
  value: string | number;
  symbol?: string;
}

const CallPoolStatItem = (props: CallPoolStatItem) => {
  const { description, value, symbol = '' } = props;
  return (
    <Box className="border rounded-tl-lg border-umbra p-3 my-auto flex flex-col h-full justify-center space-y-2">
      <Typography variant="h5" color="stieglitz">
        {description}
      </Typography>
      <Typography variant="h6">
        {value} {symbol}
      </Typography>
    </Box>
  );
};

export default CallPoolStatItem;
