import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { formatDistance } from 'date-fns';

import Title from 'components/rdpx-v2/Title';
import Stats from 'components/rdpx-v2/Stats';
import BondPanel from 'components/rdpx-v2/BondPanel';
import Charts from 'components/rdpx-v2/Charts';
import QuickLink from 'components/rdpx-v2/QuickLink';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const statsKeys = ['Total Supply', 'Market Cap', 'Price', 'rDPX Supply'];

const statsValues = ['-', '-', '-', '-'];

const quickLink1Props = {
  text: 'Dune Analytics',
  iconSymbol: '/assets/dune-dashboard.svg',
  url: 'https://app.dopex.io/ssov',
};
const quickLink2Props = {
  text: 'RDPX Whitepaper',
  iconSymbol: '/images/tokens/rdpx.svg',
  url: 'https://app.dopex.io/ssov',
};
const quickLink3Props = {
  text: 'What is DSC?',
  iconSymbol: '/images/tokens/dsc.svg',
  url: 'https://app.dopex.io/ssov',
};

const RdpxV2Main = () => {
  const { treasuryContractState, treasuryData } = useBoundStore();

  const statsVals = useMemo(() => {
    if (
      !treasuryData ||
      !treasuryContractState ||
      !treasuryData.reserveA ||
      !treasuryData.reserveB
    )
      return statsValues;

    return [
      getUserReadableAmount(treasuryData.dscSupply, 18),
      getUserReadableAmount(
        treasuryData.dscPrice.mul(treasuryData.dscSupply),
        26
      ) + ' WETH',
      getUserReadableAmount(treasuryData.dscPrice, 8) + ' WETH',
      formatAmount(getUserReadableAmount(treasuryData.rdpxSupply, 18), 3),
    ];
  }, [treasuryContractState, treasuryData]);

  return (
    <Box className="py-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
      <Box className="flex mt-20 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
        <Box className="flex flex-col space-y-4 w-full sm:w-full lg:w-3/4 h-full">
          <Title
            title="Mint"
            description="Mint and Redeem $DSC."
            price={
              String(getUserReadableAmount(treasuryData.dscPrice, 8) || 0) +
              ' WETH'
            }
          />
          <Stats
            statsObject={Object.fromEntries(
              statsKeys.map((_, i) => [statsKeys[i], statsVals[i]])
            )}
          />
          <Charts />
          <Box className="flex space-x-2 w-full">
            <QuickLink {...quickLink1Props} />
            <QuickLink {...quickLink2Props} />
            <QuickLink {...quickLink3Props} />
          </Box>
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
