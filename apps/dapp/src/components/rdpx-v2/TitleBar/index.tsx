import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { parseUnits } from 'viem';

import { useAccount } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';
import useStore, { rdpxV2Actions } from 'hooks/rdpx/useStore';

import TitleItem from 'components/rdpx-v2/TitleBar/TitleItem';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

export const rdpxStateToLabelMapping: {
  [key in (typeof rdpxV2Actions)[number]]: string;
} = {
  bond: 'Bonding',
  lp: 'Strategy Vault',
  stake: 'Staking',
};

const Stat = ({
  name,
  value,
  prefix,
}: {
  name: ReactNode;
  value: ReactNode;
  prefix?: ReactNode;
  reverse?: boolean;
}) => (
  <div className="flex flex-col text-center">
    <span className="text-white text-sm">
      <span className="text-stieglitz">{prefix} </span>
      {value}
    </span>
    <span className="text-stieglitz text-sm">{name}</span>
  </div>
);

const TitleBar = () => {
  const state = useStore((store) => store.state);
  const update = useStore((store) => store.update);
  const { address: _user } = useAccount();

  const { updateRdpxV2CoreState, rdpxV2CoreState } = useRdpxV2CoreData({
    user: _user || '0x',
  });
  const { updatePerpetualVaultState, perpetualVaultState } = usePerpPoolData({
    user: _user || '0x',
  });

  const onClick = useCallback(
    (index: number) => {
      update(rdpxV2Actions[index]);
    },
    [update],
  );

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  const memoizedLpTvl = useMemo(() => {
    return (
      (perpetualVaultState.totalLpShares * parseUnits('1', DECIMALS_TOKEN)) /
        (perpetualVaultState.oneLpShare[0] || 1n) /
        parseUnits('1', DECIMALS_TOKEN) +
      (perpetualVaultState.totalLpShares * rdpxV2CoreState.rdpxPriceInEth) /
        (perpetualVaultState.oneLpShare[1] || 1n) /
        parseUnits('1', DECIMALS_TOKEN * 2)
    );
  }, [
    perpetualVaultState.oneLpShare,
    perpetualVaultState.totalLpShares,
    rdpxV2CoreState.rdpxPriceInEth,
  ]);

  const titleBarContent = useMemo(() => {
    const defaultIndex = 0;
    switch (state) {
      case 'bond':
        return {
          index: 0,
          renderComponent: (
            <div className="flex space-x-6 mx-auto">
              <Stat
                name="Current Discount"
                value={`${formatBigint(
                  rdpxV2CoreState.discount,
                  DECIMALS_STRIKE,
                )}%`}
              />
              <Stat name="APR" value={'-'} />
              <Stat
                name="DPXETH Price"
                value={`${formatBigint(
                  rdpxV2CoreState.dpxethPriceInEth,
                  DECIMALS_STRIKE,
                )} WETH`}
              />
              <Stat
                name="RDPX Price"
                value={`${formatBigint(
                  rdpxV2CoreState.rdpxPriceInEth,
                  DECIMALS_STRIKE,
                )} WETH`}
              />
            </div>
          ),
        };
      case 'lp':
        return {
          index: 1,
          renderComponent: (
            <div className="flex space-x-6 mx-auto mt-3">
              <Stat
                name="Funding"
                value={`${formatBigint(
                  perpetualVaultState.totalFundingForCurrentEpoch,
                  DECIMALS_TOKEN,
                )} WETH`}
              />
              <Stat name="APR" value={'-'} />
              <Stat
                name="Utilization"
                value={`${formatBigint(
                  (perpetualVaultState.totalActiveOptions *
                    parseUnits('1', DECIMALS_TOKEN)) /
                    (perpetualVaultState.totalLpShares || 1n),
                  DECIMALS_TOKEN,
                )}%`}
              />
              <Stat
                name="TVL"
                value={`${formatBigint(memoizedLpTvl, 0)} WETH`}
              />
            </div>
          ),
        };
      case 'stake':
        return { index: 2, renderComponent: <></> };
      default:
        return { index: defaultIndex, renderComponent: <></> };
    }
  }, [perpetualVaultState, rdpxV2CoreState, state, memoizedLpTvl]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex space-x-2 bg-umbra rounded-lg p-1">
        {rdpxV2Actions.map((action, index) => (
          <TitleItem
            onClick={() => onClick(index)}
            key={action}
            disabled={rdpxStateToLabelMapping[action] === 'Staking'}
            active={index === titleBarContent.index}
            label={rdpxStateToLabelMapping[action]}
          />
        ))}
      </div>
      {titleBarContent.renderComponent}
    </div>
  );
};

export default TitleBar;
