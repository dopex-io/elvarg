import { Curve2PoolSsovPut } from '@dopex-io/sdk';

const getTotalEpochPremium = async (
  ssovContract: Curve2PoolSsovPut,
  epoch: number
) => {
  const strikes = await ssovContract.getEpochStrikes(epoch);

  return Promise.all(
    strikes.map((s) => ssovContract.totalEpochStrikePremium(epoch, s))
  );
};

export default getTotalEpochPremium;
