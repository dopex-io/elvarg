import { useEffect } from 'react';
import { formatUnits } from 'viem';

import { Skeleton } from '@dopex-io/ui';
import { useContractRead } from 'wagmi';

import { formatAmount } from 'utils/general';

import DopexV2OptionMarketV2 from '../../abi/DopexV2OptionMarketV2';

const MarkPrice = () => {
  const optionsMarketAddress = '0x764fA09d0B3de61EeD242099BD9352C1C61D3d27';
  const primePool = '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443';
  const putTokenDecimals = 6;
  const {
    data = 0n,
    isLoading,
    refetch,
  } = useContractRead({
    abi: DopexV2OptionMarketV2,
    address: optionsMarketAddress,
    functionName: 'getCurrentPricePerCallAsset',
    args: [primePool],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-[4px]">
        <div className="text-stieglitz">$</div>
        {isLoading ? (
          <Skeleton height={13} width={80} />
        ) : (
          <div className="text-[13px] md:text-[16px]">
            {formatAmount(formatUnits(data, putTokenDecimals), 3)}
          </div>
        )}
      </div>
      <div className="text-[16px] text-stieglitz font-semibold">Mark Price</div>
    </div>
  );
};

export default MarkPrice;
