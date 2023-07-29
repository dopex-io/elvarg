import { Address } from 'viem';

import getSsovEpochData from 'utils/ssov/getSsovEpochData';

const getStrikeIndexFromEpochStrike = async ({
  ssov,
  strike,
  epoch,
}: {
  ssov: Address;
  strike: bigint;
  epoch: number;
}) => {
  const epochData = await getSsovEpochData({
    epoch,
    ssovAddress: ssov,
  });
  return epochData.strikes.indexOf(strike);
};

export default getStrikeIndexFromEpochStrike;
