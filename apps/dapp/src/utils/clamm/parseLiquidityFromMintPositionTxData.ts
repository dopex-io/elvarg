import {
  Address,
  decodeFunctionData,
} from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';

function parseLiquidityFromMintPositionTxData(txInput: Address) {

  return decodeFunctionData<typeof OptionPools__factory.abi>({
    abi: OptionPools__factory.abi,
    data: txInput,
  });
}

export default parseLiquidityFromMintPositionTxData;
