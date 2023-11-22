import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { parseUnits } from 'viem';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';

import useTokenData from 'hooks/helpers/useTokenData';
import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';
import useRdpxV2CoreData from 'hooks/rdpx/useRdpxV2CoreData';
import useRewardAPR from 'hooks/rdpx/useRewardAPR';
import useStore, { rdpxV2Actions } from 'hooks/rdpx/useStore';

import TitleItem from 'components/rdpx-v2/TitleBar/TitleItem';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DOPEX_API_BASE_URL } from 'constants/env';
import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';
import addresses from 'constants/rdpx/addresses';

export const rdpxStateToLabelMapping: {
  [key in (typeof rdpxV2Actions)[number]]: string;
} = {
  bond: 'Bonding',
  lp: 'Perp Put Vault',
  stake: 'Staking',
  // farm: 'Farm',
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
  const { data } = useQuery({
    queryKey: ['eth_price'],
    queryFn: async () => {
      return await axios
        .get(`${DOPEX_API_BASE_URL}/v2/price/eth`)
        .then((data) => {
          return data.data;
        });
    },
    staleTime: 300000,
  });

  const { rtRewardAPR, ppvRewardAPR } = useRewardAPR();

  const { address: user = '0x' } = useAccount();
  const { balance: lpWethBalance, updateBalance: updateLpWethBalance } =
    useTokenData({
      owner: addresses.perpPoolLp,
      token: addresses.weth,
      amount: 0n,
    });
  const { updateRdpxV2CoreState, rdpxV2CoreState } = useRdpxV2CoreData({
    user,
  });
  const { updatePerpetualVaultState, perpetualVaultState } = usePerpPoolData({
    user,
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
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

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
              <Stat name="Reward APR" value={`${rtRewardAPR}%`} />
              <Stat
                name="dpxETH Price"
                value={`$${(
                  Number(
                    formatBigint(
                      rdpxV2CoreState.dpxethPriceInEth,
                      DECIMALS_TOKEN,
                      3,
                    ),
                  ) * (data?.cgPrice || 0)
                ).toFixed(3)}`}
              />
              <Stat
                name="RDPX Price"
                value={`$${Number(
                  Number(
                    formatBigint(
                      rdpxV2CoreState.rdpxPriceInEth,
                      DECIMALS_TOKEN,
                    ),
                  ) * (data?.cgPrice || 0),
                ).toFixed(3)}`}
              />
            </div>
          ),
        };
      case 'lp':
        return {
          index: 1,
          renderComponent: (
            <div className="flex space-x-6 mx-auto mt-3">
              <Stat name="Reward APR" value={`${ppvRewardAPR}%`} />
              <Stat
                name="Utilization"
                value={`${formatBigint(
                  (perpetualVaultState.activeCollateral *
                    parseUnits('1', DECIMALS_TOKEN) *
                    100n) /
                    (perpetualVaultState.totalCollateral + 1n),
                  DECIMALS_TOKEN,
                )}%`}
              />
              <Stat
                name="TVL"
                value={`$${Number(
                  Number(formatBigint(lpWethBalance, DECIMALS_TOKEN)) *
                    (data?.cgPrice || 0),
                ).toFixed(3)}`}
              />
            </div>
          ),
        };
      case 'stake':
        return { index: 2, renderComponent: <></> };
      // case 'farm':
      //   return { index: 3, renderComponent: <></> };
      default:
        return { index: defaultIndex, renderComponent: <></> };
    }
  }, [
    state,
    rdpxV2CoreState.discount,
    rdpxV2CoreState.dpxethPriceInEth,
    rdpxV2CoreState.rdpxPriceInEth,
    rtRewardAPR,
    data?.cgPrice,
    ppvRewardAPR,
    perpetualVaultState.activeCollateral,
    perpetualVaultState.totalCollateral,
    lpWethBalance,
  ]);

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
