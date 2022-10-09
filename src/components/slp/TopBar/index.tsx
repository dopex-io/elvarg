import LpTopBar from 'components/common/LpTopBar';
import { useBoundStore } from 'store';

const TopBar = () => {
  const { tokenPrices, selectedPoolName, slpEpochData } = useBoundStore();

  const tokenPrice =
    tokenPrices.find((token) => token.name === selectedPoolName)?.price || 0;

  return (
    <LpTopBar
      data={'STRADDLES LP'}
      isBeta={true}
      selectedPoolName={selectedPoolName}
      tokenPrice={tokenPrice}
      isEpochExpired={slpEpochData?.isEpochExpired!}
    />
  );
};

export default TopBar;
