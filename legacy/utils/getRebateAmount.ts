import { ethers, BigNumber } from 'ethers';
import {
  OptionPool,
  OptionPoolRebates__factory,
  DopexOracle__factory,
} from '@dopex-io/sdk';

import getUniquePoolIdentifier from 'utils/contracts/getUniquePoolIdentifier';
import oneEBigNumber from 'utils/math/oneEBigNumber';

async function getRebateAmount(
  provider: ethers.providers.Provider,
  contractAddresses: { [key: string]: string },
  optionPoolSdk: OptionPool,
  selectedEpoch: number,
  accountAddress: string
): Promise<BigNumber> {
  const optionPoolAddress = optionPoolSdk.contract.address;

  const optionPoolRebates = OptionPoolRebates__factory.connect(
    // @ts-ignore TODO: FIX
    contractAddresses['OptionPoolRebates'],
    provider
  );

  const uniqueRebateIdentifier = getUniquePoolIdentifier(
    optionPoolAddress,
    selectedEpoch
  );

  const hasClaimedRebate = await optionPoolRebates.hasClaimedRebate(
    accountAddress,
    uniqueRebateIdentifier
  );
  if (!hasClaimedRebate) {
    const userAssetPercentages =
      await optionPoolRebates.getUserAssetPercentagesForPool(
        optionPoolAddress,
        selectedEpoch
      );
    const userBaseAssetPercent = userAssetPercentages[0];
    const userQuoteAssetPercent = userAssetPercentages[1];

    const totalBaseRebate = await optionPoolRebates.calculateTotalRebate(
      optionPoolAddress,
      selectedEpoch,
      false
    );
    const totalQuoteRebate = await optionPoolRebates.calculateTotalRebate(
      optionPoolAddress,
      selectedEpoch,
      true
    );

    const totalRebate = userQuoteAssetPercent
      .mul(totalQuoteRebate.mul(oneEBigNumber(8)))
      .div(oneEBigNumber(10))
      .add(
        userBaseAssetPercent
          .mul(totalBaseRebate.mul(oneEBigNumber(8)))
          .div(oneEBigNumber(10))
      );

    const epochTimes = await optionPoolSdk.contract.getEpochTimes(
      selectedEpoch
    );
    const epochExpiry = epochTimes[1];

    const dopexOracle = DopexOracle__factory.connect(
      // @ts-ignore TODO: FIX
      contractAddresses['DopexOracle'],
      provider
    );

    const rdpxPrice = await dopexOracle.getRdpxPrice(Number(epochExpiry));

    if (rdpxPrice.gt(BigNumber.from(0))) {
      const finalTotalRebate = totalRebate
        .mul(ethers.utils.parseEther('1'))
        .div(rdpxPrice);
      const rdpxAmount = finalTotalRebate
        .mul(ethers.utils.parseEther('1'))
        .div(oneEBigNumber(6));
      return rdpxAmount;
    }
  }
  return BigNumber.from(0);
}

export default getRebateAmount;
