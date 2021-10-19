import { ethers, BigNumber } from 'ethers';
import { OptionPool, DopexRewards__factory } from '@dopex-io/sdk';

import getUniquePoolIdentifier from 'utils/contracts/getUniquePoolIdentifier';

async function getRewardAmount(
  provider: ethers.providers.Provider,
  contractAddresses: { [key: string]: string },
  optionPoolSdk: OptionPool,
  selectedEpoch: number,
  accountAddress: string
): Promise<BigNumber> {
  const optionPoolAddress = optionPoolSdk.contract.address;

  const dopexRewards = DopexRewards__factory.connect(
    contractAddresses.DopexRewards,
    provider
  );

  const uniqueRewardIdentifier = getUniquePoolIdentifier(
    optionPoolAddress,
    selectedEpoch
  );

  const hasClaimedReward =
    await dopexRewards.hasCollectedOptionPoolLiquidityRewards(
      accountAddress,
      uniqueRewardIdentifier
    );

  if (!hasClaimedReward) {
    return await dopexRewards.callStatic.claimRewardForOptionPoolLiquidity(
      selectedEpoch,
      optionPoolAddress,
      { from: accountAddress }
    );
  }
  return BigNumber.from(0);
}

export default getRewardAmount;
