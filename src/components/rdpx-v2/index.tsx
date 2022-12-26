import Box from '@mui/material/Box';

import Title from 'components/rdpx-v2/Title';
import Stats from 'components/rdpx-v2/Stats';
import BondPanel from 'components/rdpx-v2/BondPanel';

const statsKeys = [
  'Supply',
  'Market Cap',
  'Collateral Ratio',
  'Bonded',
  '  ',
  ' ',
];

const statsValues = ['-', '-', '-', '-', '', ''];

const RdpxV2Main = () => {
  return (
    <Box className="py-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
      <Box className="flex mt-20 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
        <Box className="flex flex-col space-y-8 w-full sm:w-full lg:w-3/4 h-full">
          <Title
            title={'Mint'}
            description="Mint and Redeem DSC."
            price={'-'}
          />
          <Stats
            statsObject={Object.fromEntries(
              statsKeys.map((_, i) => [statsKeys[i], statsValues[i]])
            )}
          />
          <Box>Graphs</Box>
          <Box>Redirect URLs</Box>
          {/* <DepositTable /> */}
        </Box>
        <Box className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
          <BondPanel />
        </Box>
      </Box>
    </Box>
  );
};

export default RdpxV2Main;
