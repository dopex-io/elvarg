import { FC, useMemo } from 'react';

import format from 'date-fns/format';
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
  const {
    zdteData,
    staticZdteData,
    tokenPrices,
    selectedPoolName,
    subgraphVolume,
  } = useBoundStore();

  const priceChange = useMemo(() => {
    const item = tokenPrices.find(
      (token) => token.name.toLowerCase() === selectedPoolName.toLowerCase()
    );
    return Number(formatAmount(item?.change24h || 0, 2));
  }, [tokenPrices]);

  const tokenSymbol = staticZdteData?.baseTokenSymbol.toUpperCase();
  const quoteTokenSymbol = staticZdteData?.quoteTokenSymbol.toUpperCase();

  if (!zdteData || !tokenSymbol || !quoteTokenSymbol || !priceChange) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid grid-rows-2 grid-flow-col text-sm ml-5 flex-1 md:grid-rows-1">
        <StatsColumn title={`24h Volume`} value={`${subgraphVolume}`} />
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
        <StatsColumn
          title={`Expiry ${format(zdteData.expiry, 'z')}`}
          value={`${format(zdteData.expiry * 1000, 'd MMM yyyy HH:mm')}`}
        />
      </div>
    </>
  );
};

export default Stats;
