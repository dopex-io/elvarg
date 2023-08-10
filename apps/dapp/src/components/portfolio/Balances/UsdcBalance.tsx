import { formatUnits } from 'viem';

import { formatAmount } from 'utils/general';

function UsdcBalance({
  asset,
  userBalance,
}: {
  asset: string;
  userBalance: string;
}) {
  const chain = asset.split('-')[1];
  return (
    <div className={`flex my-5`}>
      <img className="w-7 h-7 z-0" src="/images/tokens/usdc.svg" alt="USDC" />
      <img
        className="w-4 h-4 -mt-1 -ml-3 z-10 border border-gray-500 rounded-full"
        src={`/images/tokens/${chain}.svg`}
        alt={chain}
      />
      <h5 className="ml-3 mt-0.5">
        <span className="text-white">
          {formatAmount(formatUnits(BigInt(userBalance), 6), 3, true)}
        </span>
      </h5>
      <div className="bg-umbra p-1 px-3.5 ml-auto mr-2 rounded-md text-center">
        <h5>
          <span className="text-stieglitz">USDC.e</span>
        </h5>
      </div>
    </div>
  );
}

export default UsdcBalance;
