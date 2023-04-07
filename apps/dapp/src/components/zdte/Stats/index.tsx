import { FC, useEffect, useMemo, useState } from 'react';

import { BigNumber, utils } from 'ethers';

import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';
import { useBoundStore } from 'store';

import Loading from 'components/zdte/Loading';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

interface StatsProps {}

const StatsColumn: FC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div className="p-3">
      <div className="text-sm text-white">{value}</div>
      <div className="text-sm text-stieglitz">{title}</div>
    </div>
  );
};

const Stats: FC<StatsProps> = ({}) => {
  const { zdteData, staticZdteData, tokenPrices, selectedPoolName } =
    useBoundStore();

  const [twentyFourHourVolume, setTwentyFourHourVolume] = useState('0');

  const priceChange = useMemo(() => {
    const item = tokenPrices.find(
      (token) => token.name.toLowerCase() === selectedPoolName.toLowerCase()
    );
    return Number(formatAmount(item?.change24h || 0, 2));
  }, [tokenPrices]);

  const tokenSymbol = staticZdteData?.baseTokenSymbol.toUpperCase();
  const quoteTokenSymbol = staticZdteData?.quoteTokenSymbol.toUpperCase();

  useEffect(() => {
    async function getVolume() {
      const payload = await queryClient.fetchQuery({
        queryKey: ['getZdteSpreadTradesFromTimestamp'],
        queryFn: () =>
          graphSdk.getZdteSpreadTradesFromTimestamp({
            fromTimestamp: (new Date().getTime() / 1000 - 86400).toFixed(0),
          }),
      });

      const _twentyFourHourVolume = payload.trades.reduce(
        (acc, trade, _index) => {
          return acc.add(BigNumber.from(trade.amount));
        },
        BigNumber.from(0)
      );

      setTwentyFourHourVolume(utils.formatEther(_twentyFourHourVolume));
    }

    getVolume();
  }, []);

  if (!zdteData || !tokenSymbol || !quoteTokenSymbol || !priceChange) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid grid-rows-2 grid-flow-col text-sm ml-5 flex-1 md:grid-rows-1">
        <StatsColumn title={`24h Volume`} value={`${twentyFourHourVolume}`} />
        <StatsColumn
          title={`Open Interest`}
          value={`$${formatAmount(
            getUserReadableAmount(zdteData?.openInterest, DECIMALS_USD),
            2
          )}`}
        />
        <StatsColumn
          title={`Total Liq (Calls)`}
          value={`${formatAmount(
            getUserReadableAmount(zdteData?.baseLpAssetBalance, DECIMALS_TOKEN),
            2
          )}
        ${tokenSymbol}`}
        />
        <StatsColumn
          title={`Total Liq (Puts)`}
          value={`$${formatAmount(
            getUserReadableAmount(zdteData?.quoteLpAssetBalance, DECIMALS_USD),
            2
          )}`}
        />
      </div>
    </>
  );
};

export default Stats;
