import { zeroAddress } from 'viem';

import { Skeleton } from '@dopex-io/ui';
import { OptionPricingLinearV2 } from 'abis/clamm/OptionPricingLinearV2';
import { useContractRead } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

const ImpliedVolatility = () => {
  const { selectedOptionsMarket, selectedTTL } = useClammStore();
  const { data, isLoading } = useContractRead({
    abi: OptionPricingLinearV2,
    address: selectedOptionsMarket?.optionsPricing ?? zeroAddress,
    functionName: 'ttlToVol',
    args: [BigInt(selectedTTL)],
  });

  if (isLoading) return <Skeleton height={18} width={18} />;
  return <span className="text-[13px]">{(data ?? 0).toString()}</span>;
};

export default ImpliedVolatility;
