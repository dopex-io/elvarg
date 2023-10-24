import { /* useEffect, useState , */ useMemo } from 'react';

// import axios from 'axios';

// import { useBoundStore } from 'store';

import useStore from 'hooks/rdpx/useStore';

import BondPanel from 'components/rdpx-v2/AsidePanel/BondPanel';
import StrategyVaultPanel from 'components/rdpx-v2/AsidePanel/StrategyVaultPanel';
import QuickLink from 'components/rdpx-v2/QuickLink';

// import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
// import formatAmount from 'utils/general/formatAmount';

import { quickLinks } from 'constants/rdpx';

import BondsBody from './Body/BondsBody';
import StrategyVaultBody from './Body/StrategyVaultBody';

// const DEFAULT_STAT_VALS = ['-', '-', '-', '-', '-', '-'];

const RdpxV2Main = () => {
  const rdpxPageState = useStore((vault) => vault.state);

  // const { treasuryContractState, treasuryData } = useBoundStore();
  // const [ethPriceInUsd, setEthPriceInUsd] = useState<number>();

  // const statsVals = useMemo(() => {
  //   if (
  //     !treasuryData ||
  //     !treasuryContractState ||
  //     !treasuryData.reserveA ||
  //     !treasuryData.reserveB ||
  //     !ethPriceInUsd
  //   )
  //     return DEFAULT_STAT_VALS;

  //   return [
  //     formatAmount(getUserReadableAmount(treasuryData.dscPrice, 8), 3) +
  //       ' WETH',
  //     formatAmount(getUserReadableAmount(treasuryData.rdpxPriceInAlpha, 8), 3) +
  //       ' WETH' +
  //       ` ($${formatAmount(
  //         getUserReadableAmount(treasuryData.rdpxPriceInAlpha, 8) *
  //           ethPriceInUsd,
  //         3,
  //       )})`,
  //     formatAmount(getUserReadableAmount(treasuryData.dscSupply, 18), 3),
  //     formatAmount(getUserReadableAmount(treasuryData.rdpxSupply, 18), 3),
  //     `$${(
  //       getUserReadableAmount(
  //         treasuryData.dscPrice.mul(treasuryData.dscSupply),
  //         26,
  //       ) * ethPriceInUsd
  //     ).toLocaleString()}`,
  //     `$${(
  //       getUserReadableAmount(
  //         treasuryData.rdpxPriceInAlpha.mul(treasuryData.rdpxSupply),
  //         26,
  //       ) * ethPriceInUsd
  //     ).toLocaleString()}`,
  //   ];
  // }, [ethPriceInUsd, treasuryContractState, treasuryData]);

  const renderContent = useMemo(() => {
    switch (rdpxPageState) {
      case 'bond':
        return {
          asidePanel: <BondPanel />,
          body: <BondsBody />,
        };
      case 'lp':
        return {
          asidePanel: <StrategyVaultPanel />,
          body: <StrategyVaultBody />,
        };
      case 'stake':
        return { asidePanel: null, body: null };
    }
  }, [rdpxPageState]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
  //     )
  //     .then((payload) => {
  //       const _ethPriceInUsd = Number(payload.data.ethereum.usd);
  //       setEthPriceInUsd(_ethPriceInUsd);
  //     });
  // }, []);

  return (
    <div className="flex mt-8 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
      <div className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
        {renderContent.asidePanel}
        <div className="flex flex-col space-y-3 my-3">
          <QuickLink {...quickLinks.whitepaper} />
          <QuickLink {...quickLinks.etherscan} />
          <QuickLink {...quickLinks.dune} />
        </div>
      </div>
      {renderContent.body}
    </div>
  );
};

export default RdpxV2Main;
