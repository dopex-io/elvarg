import { Address, decodeFunctionData } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';

function parseLiquidityFromMintPositionTxData(txInput: Address) {
  const parsedData = decodeFunctionData({
    abi: OptionPools__factory.abi,
    data: txInput,
  });
  const { args } = parsedData;
  if (!args) return 0n;
  if (!args[0]) return 0n;
  const { liquidityToUse } = args[0] as { liquidityToUse: bigint };
  return liquidityToUse;
}

export default parseLiquidityFromMintPositionTxData;
