import { OptionPools__factory, PositionsManager__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

async function getWritePosition(id: bigint) {
  return readContract({
    abi: PositionsManager__factory.abi,
    address: '0x2a9a9f63F13dD70816C456B2f2553bb648EE0F8F',
    functionName: 'tokenIds',
    args: [id],
  });
}

export default getWritePosition;
