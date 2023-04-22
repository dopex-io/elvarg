import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';

import BondPanel from 'components/rdpx-v2/BondPanel';
import Charts from 'components/rdpx-v2/Charts';
import QuickLink from 'components/rdpx-v2/QuickLink';
import Stats from 'components/rdpx-v2/Stats';
import Title from 'components/rdpx-v2/Title';
import UserBonds from 'components/rdpx-v2/Tables/UserBonds';
import DelegatePositions from 'components/rdpx-v2/Tables/DelegatePositions';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const STAT_KEYS = [
  'dpxETH Price',
  'RDPX Price',
  'dpxETH Supply',
  'RDPX Supply',
  'dpxETH Market Cap',
  'RDPX Market Cap',
];

const DEFAULT_STAT_VALS = ['-', '-', '-', '-', '-', '-'];

const quickLink1Props = {
  text: 'RDPX Whitepaper',
  iconSymbol: '/images/tokens/rdpx.svg',
  url: 'https://docs.google.com/document/d/1005YPC8-tUJhuhzTZK__3KZss0o_-ix4/edit',
};
const quickLink2Props = {
  text: 'Dune Analytics',
  iconSymbol: '/assets/dune-dashboard.svg',
  url: 'https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713',
};
// const quickLink3Props = {
//   text: 'What is DSC?',
//   iconSymbol: '/images/tokens/dsc.svg',
//   url: 'https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713',
// };

const RdpxV2Main = () => {
  const { treasuryContractState, treasuryData } = useBoundStore();

  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>();

  const statsVals = useMemo(() => {
    if (
      !treasuryData ||
      !treasuryContractState ||
      !treasuryData.reserveA ||
      !treasuryData.reserveB ||
      !ethPriceInUsd
    )
      return DEFAULT_STAT_VALS;

    return [
      formatAmount(getUserReadableAmount(treasuryData.dscPrice, 8), 3) +
        ' WETH',
      formatAmount(getUserReadableAmount(treasuryData.rdpxPriceInAlpha, 8), 3) +
        ' WETH' +
        ` ($${formatAmount(
          getUserReadableAmount(treasuryData.rdpxPriceInAlpha, 8) *
            ethPriceInUsd,
          3
        )})`,
      formatAmount(getUserReadableAmount(treasuryData.dscSupply, 18), 3),
      formatAmount(getUserReadableAmount(treasuryData.rdpxSupply, 18), 3),
      `$${(
        getUserReadableAmount(
          treasuryData.dscPrice.mul(treasuryData.dscSupply),
          26
        ) * ethPriceInUsd
      ).toLocaleString()}`,
      `$${(
        getUserReadableAmount(
          treasuryData.rdpxPriceInAlpha.mul(treasuryData.rdpxSupply),
          26
        ) * ethPriceInUsd
      ).toLocaleString()}`,
    ];
  }, [treasuryContractState, treasuryData]);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
      .then((payload) => {
        const _ethPriceInUsd = Number(payload.data.ethereum.usd);
        setEthPriceInUsd(_ethPriceInUsd);
      });
  }, []);

  return (
    <div className="py-12 mt-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
      <Title />
      <div className="flex mt-8 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
        <div className="flex flex-col space-y-4 w-full sm:w-full lg:w-3/4 h-full">
          <Stats
            statsObject={Object.fromEntries(
              STAT_KEYS.map((_, i) => [STAT_KEYS[i], statsVals[i]])
            )}
          />
          <Charts />
          <UserBonds />
          <DelegatePositions />
        </div>
        <div className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
          <BondPanel />
          <div className="flex flex-col space-y-3 my-3">
            <QuickLink {...quickLink1Props} />
            <QuickLink {...quickLink2Props} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RdpxV2Main;
