import LpTopBar from 'components/common/LpTopBar';

import { useBoundStore } from 'store';

const TopBar = () => {
  const { tokenPrices, olpData, olpEpochData } = useBoundStore();

  const underlyingSymbol = olpData?.underlyingSymbol;

  const tokenPrice =
    tokenPrices.find((token) => token.name === underlyingSymbol)?.price || 0;

  return (
    <LpTopBar
      data={'Options LP'}
      isBeta={true}
      underlyingSymbol={underlyingSymbol ?? '...'}
      tokenPrice={tokenPrice}
      isEpochExpired={olpEpochData?.isEpochExpired!}
    />
  );
};

export default TopBar;
