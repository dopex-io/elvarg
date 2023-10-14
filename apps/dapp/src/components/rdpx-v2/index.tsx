import { useCallback, useEffect, useMemo, useState } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import axios from 'axios';

import { useBoundStore } from 'store';

import BondPanel from 'components/rdpx-v2/BondPanel';
import Charts from 'components/rdpx-v2/Charts';
import QuickLink from 'components/rdpx-v2/QuickLink';
import DelegatePositions from 'components/rdpx-v2/Tables/DelegatePositions';
import UserBonds from 'components/rdpx-v2/Tables/UserBonds';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const BUTTON_LABELS = ['Bonding Positions', 'Delegate Positions', 'History'];

const DEFAULT_STAT_VALS = ['-', '-', '-', '-', '-', '-'];

const quickLink3Props = {
  text: 'What is rDPX v2',
  iconSymbol: '/images/tokens/rdpx.svg',
  url: 'https://docs.google.com/document/d/1005YPC8-tUJhuhzTZK__3KZss0o_-ix4/edit',
  body: 'rDPX v2 is a system that allows you to mint DPXETH, a yield-bearing synthetic version of ETH.',
};
const quickLink2Props = {
  text: 'Etherscan',
  iconSymbol: '/assets/etherscan.svg',
  url: 'https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713',
};
const quickLink1Props = {
  text: 'Dune Analytics',
  iconSymbol: '/assets/dune-dashboard.svg',
  url: 'https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713',
};

const Stat = ({ name, value }: { name: ReactNode; value: ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-white text-[0.5rem] sm:text-[0.8rem]">
      <span className="text-stieglitz">$ </span>
      {value}
    </span>
    <span className="text-stieglitz text-[0.5rem] sm:text-[0.8rem]">
      {name}
    </span>
  </div>
);

const RdpxV2Main = () => {
  const [active, setActive] = useState<string>('Bonding Positions');
  const [section, setSection] = useState<string>('Bonding');
  const { treasuryContractState, treasuryData } = useBoundStore();

  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>();

  const handleClick = useCallback((e: any) => {
    setActive(e.target.textContent);
  }, []);

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
          3,
        )})`,
      formatAmount(getUserReadableAmount(treasuryData.dscSupply, 18), 3),
      formatAmount(getUserReadableAmount(treasuryData.rdpxSupply, 18), 3),
      `$${(
        getUserReadableAmount(
          treasuryData.dscPrice.mul(treasuryData.dscSupply),
          26,
        ) * ethPriceInUsd
      ).toLocaleString()}`,
      `$${(
        getUserReadableAmount(
          treasuryData.rdpxPriceInAlpha.mul(treasuryData.rdpxSupply),
          26,
        ) * ethPriceInUsd
      ).toLocaleString()}`,
    ];
  }, [treasuryContractState, treasuryData]);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      )
      .then((payload) => {
        const _ethPriceInUsd = Number(payload.data.ethereum.usd);
        setEthPriceInUsd(_ethPriceInUsd);
      });
  }, []);

  return (
    <div className="py-12 mt-12">
      <div className="flex mt-8 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
        <div className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
          <div className="flex justify-between mb-3">
            {['Bonding', 'Strategy Vault', 'Rewards'].map((label, index) => (
              <Button
                key={index}
                className={`w-full m-1 p-0 transition ease-in-out duration-500 ${
                  section === label
                    ? 'text-white bg-carbon hover:bg-carbon'
                    : 'text-stieglitz bg-transparent hover:bg-transparent border-gray-200 border-0.5 text-white'
                } hover:text-white`}
                onClick={() => setSection(label)}
              >
                <p className="text-xs py-2">{label}</p>
              </Button>
            ))}
          </div>

          <BondPanel />
          <div className="flex flex-col space-y-3 my-3">
            <QuickLink {...quickLink1Props} />
            <QuickLink {...quickLink2Props} />
            <QuickLink {...quickLink3Props} />
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full sm:w-full lg:w-3/4 h-full">
          <div className="flex space-x-10">
            <Stat name="Current Discount" value={'1813.76'} />
            <Stat name="APR" value={'13.1m'} />
            <Stat name="DPXETH Price" value={'1723.11'} />
            <Stat name="RDPX Price" value={'23.1'} />
          </div>

          <Charts />

          <ButtonGroup className="flex w-full">
            {BUTTON_LABELS.map((label, index) => (
              <button
                key={index}
                className={`border-0 m-1 mr-2 pb-0 transition ease-in-out duration-500 rounded-md bg-transparent hover:bg-transparent ${
                  active === label ? 'text-white' : 'text-stieglitz'
                } hover:text-white`}
                onClick={handleClick}
              >
                <span className="text-md">{label}</span>
              </button>
            ))}
          </ButtonGroup>

          {active === 'Bonding Positions' ? <UserBonds /> : null}
          {active === 'Delegate Positions' ? <DelegatePositions /> : null}
        </div>
      </div>
    </div>
  );
};

export default RdpxV2Main;
