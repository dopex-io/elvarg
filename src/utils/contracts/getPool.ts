import { OptionPool, OptionPoolFactory__factory } from '@dopex-io/sdk';
import { ethers } from 'ethers';

import getOptionPoolId from 'utils/contracts/getOptionPoolId';
import getAssetMapWithAddress from 'utils/general/getAssetMapWithAddress';

export async function getMonthlyPool(
  provider: ethers.providers.Provider,
  selectedBaseAsset: string,
  contractAddresses: { [key: string]: string }
): Promise<OptionPool> {
  const optionPoolFactory = OptionPoolFactory__factory.connect(
    contractAddresses.OptionPoolFactory,
    provider
  );

  const assetMap = getAssetMapWithAddress(contractAddresses);
  const baseAssetAddress = assetMap[selectedBaseAsset].address;
  const quoteAssetAddress = assetMap['USDT'].address;

  const optionPoolId = getOptionPoolId(
    baseAssetAddress,
    quoteAssetAddress,
    'monthly'
  );
  const optionPoolAddress = await optionPoolFactory.optionPools(optionPoolId);
  const optionPoolSdk = new OptionPool(
    provider as ethers.providers.Web3Provider,
    optionPoolAddress
  );

  return optionPoolSdk;
}

export async function getWeeklyPool(
  provider: ethers.providers.Provider,
  selectedBaseAsset: string,
  contractAddresses: { [key: string]: string }
): Promise<OptionPool> {
  const optionPoolFactory = OptionPoolFactory__factory.connect(
    contractAddresses.OptionPoolFactory,
    provider
  );

  const assetMap = getAssetMapWithAddress(contractAddresses);
  const baseAssetAddress = assetMap[selectedBaseAsset].address;
  const quoteAssetAddress = assetMap['USDT'].address;

  const optionPoolId = getOptionPoolId(
    baseAssetAddress,
    quoteAssetAddress,
    'weekly'
  );
  const optionPoolAddress = await optionPoolFactory.optionPools(optionPoolId);
  const optionPoolSdk = new OptionPool(
    provider as ethers.providers.Web3Provider,
    optionPoolAddress
  );

  return optionPoolSdk;
}
