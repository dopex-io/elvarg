import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { parseUnits } from 'viem';

import { useAccount } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';
import useStore, { rdpxV2Actions } from 'hooks/rdpx/useStore';

import TitleItem from 'components/rdpx-v2/TitleBar/TitleItem';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import addresses from 'constants/rdpx/addresses';

export const rdpxStateToLabelMapping: {
  [key in (typeof rdpxV2Actions)[number]]: string;
} = {
  bond: 'Bonding',
  lp: 'Perpetual Vault',
  stake: 'Staking',
  farm: 'Farm',
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
  <div className="flex flex-col text-center space-y-1">
    <Typography2 variant="body2">
      <span className="text-stieglitz">{prefix} </span>
      {value}
    </Typography2>
    <Typography2 variant="caption" color="stieglitz">
      {name}
    </Typography2>
  </div>
);

const TitleBar = () => {
  const state = useStore((store) => store.state);
  const update = useStore((store) => store.update);

  const router = useRouter();
  const { address: _user } = useAccount();
  const { balance: lpWethBalance, updateBalance: updateLpWethBalance } =
    useTokenData({
      owner: addresses.perpPoolLp,
      token: addresses.weth,
      amount: 0n,
    });
  const { updateRdpxV2CoreState, rdpxV2CoreState } = useRdpxV2CoreData({
    user: _user || '0x',
  });
  const { updatePerpetualVaultState, perpetualVaultState } = usePerpPoolData({
    user: _user || '0x',
  });

  const onClick = useCallback(
    (index: number) => {
      router.push(`/rdpx-v2/${rdpxV2Actions[index]}`);
      update(rdpxV2Actions[index]);
    },
    [router, update],
  );

  useEffect(() => {
    updateRdpxV2CoreState();
  }, [updateRdpxV2CoreState]);

  useEffect(() => {
    updateLpWethBalance();
  }, [updateLpWethBalance]);

  useEffect(() => {
    if (rdpxV2CoreState.discount > 0n) updatePerpetualVaultState();
  }, [rdpxV2CoreState.discount, updatePerpetualVaultState]);

  const titleBarContent = useMemo(() => {
    const defaultIndex = 0;
    switch (state) {
      case 'bond':
        return {
          index: 0,
          renderComponent: (
            <div className="flex space-x-6 mx-auto">
              <Stat
                name="Bonding Discount"
                value={`${formatBigint(
                  rdpxV2CoreState.discount,
                  DECIMALS_STRIKE,
                )}%`}
              />
              <Stat name="APR" value={'-'} />
              <Stat
                name="rtETH Price"
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
              {/* <Stat
                name="Funding"
                value={`${formatBigint(
                  perpetualVaultState.totalFundingForCurrentEpoch,
                  DECIMALS_TOKEN,
                )} WETH`}
              /> */}
              <Stat name="APR" value={'-'} />
              <Stat
                name="Utilization"
                value={`${formatBigint(
                  (perpetualVaultState.totalActiveOptions *
                    parseUnits('1', DECIMALS_TOKEN)) /
                    (perpetualVaultState.oneLpShare[0] +
                      (perpetualVaultState.oneLpShare[1] *
                        parseUnits('1', DECIMALS_TOKEN)) /
                        (perpetualVaultState.underlyingPrice + 1n) || 1n),
                  // total active options / rdpx + weth in perpetual vault
                  DECIMALS_TOKEN,
                )}%`}
              />
              <Stat
                name="TVL"
                value={`${formatBigint(lpWethBalance, DECIMALS_TOKEN)} WETH`}
              />
            </div>
          ),
        };
      case 'stake':
        return { index: 2, renderComponent: <></> };
      case 'farm':
        return { index: 3, renderComponent: <></> };
      default:
        return { index: defaultIndex, renderComponent: <></> };
    }
  }, [perpetualVaultState, rdpxV2CoreState, state, lpWethBalance]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex space-x-2 bg-umbra rounded-lg p-1">
        {rdpxV2Actions.map((action, index) => (
          <TitleItem
            onClick={() => onClick(index)}
            key={action}
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
