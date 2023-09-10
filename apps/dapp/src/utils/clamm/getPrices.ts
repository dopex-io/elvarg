import { Address } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { multicall } from 'wagmi/actions';

async function getPrices(
  optionsPoolAddress: Address,
  uniswapPoolAddress: Address,
  tickLower: number,
  tickUpper: number,
  isPut: boolean,
) {
  let contracts: any = [];

  const optionsPoolContract = {
    address: optionsPoolAddress,
    abi: OptionPools__factory.abi,
  };

  console.log(
    optionsPoolAddress,
    uniswapPoolAddress,
    tickLower,
    tickUpper,
    isPut,
  );
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
    ];
  }

  const data = await multicall({
    contracts,
  });

  return {
    strike: data[0].result,
    currentPrice: data[1].result,
  };
}

export default getPrices;
