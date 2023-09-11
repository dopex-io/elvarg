import { Address } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { multicall } from 'wagmi/actions';

async function getPrices(
  optionsPoolAddress: Address,
  uniswapPoolAddress: Address,
  tickLower: number,
  tickUpper: number,
  ttl: bigint,
  isPut: boolean,
) {
  let contracts: any = [];

  const optionsPoolContract = {
    address: optionsPoolAddress,
    abi: OptionPools__factory.abi,
  };

  if (isPut) {
    contracts = [
      {
        ...optionsPoolContract,
        functionName: 'getPricePerCallAssetViaTick',
        args: [uniswapPoolAddress, tickLower],
      },
      {
        ...optionsPoolContract,
        functionName: 'getCurrentPricePerCallAsset',
        args: [uniswapPoolAddress],
      },
      {
        ...optionsPoolContract,
        functionName: 'ttlToVEID',
        args: [ttl],
      },
    ];
  } else {
    contracts = [
      {
        ...optionsPoolContract,
        functionName: 'getPricePerCallAssetViaTick',
        args: [uniswapPoolAddress, tickUpper],
      },
      {
        ...optionsPoolContract,
        functionName: 'getCurrentPricePerCallAsset',
        args: [uniswapPoolAddress],
      },
      {
        ...optionsPoolContract,
        functionName: 'ttlToVEID',
        args: [ttl],
      },
    ];
  }

  const data = await multicall({
    contracts,
  });

  return {
    strike: data[0].result,
    currentPrice: data[1].result,
    iv: data[2].result,
  };
}

export default getPrices;
