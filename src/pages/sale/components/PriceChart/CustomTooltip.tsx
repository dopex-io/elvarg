import Box from '@material-ui/core/Box';

import formatAmount from 'utils/general/formatAmount';

import ChartIndicator from './ChartIndicator';

const CustomTooltip = ({ price, progress }: any) => {
  return (
    <Box>
      <Box
        className="bg-umbra p-2 rounded-md shadow-2xl absolute"
        style={{ top: '30px', left: '-130px' }}
      >
        <Box className="flex flex-row space-x-4">
          <Box className="text-white mb-2">Progress:</Box>
          <Box className="text-wave-blue font-mono">
            {formatAmount(progress, 2)}%
          </Box>
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="text-white ">Price:</Box>
          <Box className="text-wave-blue font-mono">
            ${formatAmount(price, 2)}
          </Box>
        </Box>
      </Box>
      <ChartIndicator />
    </Box>
  );
};

export default CustomTooltip;
