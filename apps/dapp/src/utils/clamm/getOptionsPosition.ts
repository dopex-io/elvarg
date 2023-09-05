import { OptionPools__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

import { ARB_USDC_UNISWAP_POOL_ADDRESS } from 'constants/clamm/markets';

async function getOptionsPosition(id: bigint) {
  return readContract({
    abi: OptionPools__factory.abi,
    address: ARB_USDC_UNISWAP_POOL_ADDRESS,
    functionName: 'optionInfos',
    args: [id],
  });
}

export default getOptionsPosition;
