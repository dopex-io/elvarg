import { useBoundStore } from 'store';

const TopBar = () => {
  const { tokenPrices, selectedPoolName } = useBoundStore();

  const tokenPrice =
    tokenPrices.find((token) => token.name === selectedPoolName)?.price || 0;

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="flex -space-x-4">
          <img
            className="w-9 h-9 z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${selectedPoolName.toLowerCase()}.svg`}
            alt={selectedPoolName}
          />
          <img
            className="w-9 h-9 z-0"
            src="/images/tokens/usdc.svg"
            alt="USDC"
          />
        </div>
        <div className="ml-4">
          <div>LONG STRADDLE</div>
          <div className="text-gray-500 text-sm">{selectedPoolName}</div>
        </div>
        <div className="ml-4 self-start text-xl">${tokenPrice}</div>
      </div>
    </div>
  );
};

export default TopBar;
