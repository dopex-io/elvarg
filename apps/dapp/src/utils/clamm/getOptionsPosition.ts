import { OptionPools__factory } from '@dopex-io/sdk';
import { readContract } from 'wagmi/actions';

async function getOptionsPosition(id: bigint) {
  return readContract({
    abi: OptionPools__factory.abi,
    address: '0x090fdA0F2c26198058530A0A8cFE53362d54d9f1',
    functionName: 'optionInfos',
    args: [id],
  });
}

export default getOptionsPosition;
