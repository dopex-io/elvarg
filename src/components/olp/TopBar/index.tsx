import { useBoundStore } from 'store';

import LpTopBar from 'components/common/LpTopBar';

const TopBar = () => {
  const { tokenPrices, olpData, olpEpochData } = useBoundStore();

  const underlyingSymbol = olpData?.underlyingSymbol;

  const tokenPrice =
    tokenPrices.find((token) => token.name === underlyingSymbol)?.price || 0;

  return (
    <LpTopBar
      data={'OPTIONS LP'}
      isBeta={true}
      underlyingSymbol={underlyingSymbol ?? '...'}
      tokenPrice={tokenPrice}
      isEpochExpired={olpEpochData?.isEpochExpired!}
    />
  );
};

export default TopBar;
