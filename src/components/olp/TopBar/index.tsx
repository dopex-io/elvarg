import LpTopBar from 'components/common/LpTopBar';
import { useBoundStore } from 'store';

const TopBar = () => {
  const { tokenPrices, selectedPoolName, olpEpochData } = useBoundStore();

  const tokenPrice =
    tokenPrices.find((token) => token.name === selectedPoolName)?.price || 0;

  return (
    <LpTopBar
      data={'OPTIONS LP'}
      isBeta={true}
      selectedPoolName={selectedPoolName}
      tokenPrice={tokenPrice}
      isEpochExpired={olpEpochData?.isEpochExpired!}
    />
  );
};

export default TopBar;
