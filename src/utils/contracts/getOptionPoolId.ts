import { utils as ethersUtils } from 'ethers';

import getTimePeriod from 'utils/contracts/getTimePeriod';

function getOptionPoolId(
  baseAssetAddress: string,
  quoteAssetAddress: string,
  timePeriod: 'weekly' | 'monthly'
): string {
  return ethersUtils.solidityKeccak256(
    ['address', 'address', 'bytes32'],
    [baseAssetAddress, quoteAssetAddress, getTimePeriod(timePeriod)]
  );
}

export default getOptionPoolId;
