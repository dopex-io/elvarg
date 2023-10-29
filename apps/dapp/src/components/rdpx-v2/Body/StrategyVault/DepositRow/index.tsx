import { useEffect } from 'react';
import { formatUnits } from 'viem';

import { useAccount } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Cell from 'components/rdpx-v2/Body/StrategyVault/DepositRow/CustomCell';

import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';

const DepositRow = () => {
  const { address: account } = useAccount();
  const {
    userPerpetualVaultData,
    updateUserPerpetualVaultData,
    perpetualVaultState,
    updatePerpetualVaultState,
  } = usePerpPoolData({
    user: account || '0x',
  });

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  return (
    <>
      <span className="text-sm mt-4 mb-3 flex">Your deposits</span>
      <div className="bg-umbra flex max-w-full divide-x divide-cod-gray rounded-lg">
        <Cell
          label="Amount"
          data={[
            [
              formatAmount(
                formatUnits(
                  userPerpetualVaultData.totalUserShares,
                  DECIMALS_TOKEN
                ),
                3
              ),
              ' LP',
            ],
          ]}
        />
        <Cell
          label="Composition"
          data={[
            [
              formatAmount(
                formatUnits(
                  perpetualVaultState.oneLpShare[0] *
                    userPerpetualVaultData.totalUserShares,
                  DECIMALS_TOKEN * 2
                ),
                3
              ),
              'ETH',
            ],
            [
              formatAmount(
                formatUnits(
                  perpetualVaultState.oneLpShare[1] *
                    userPerpetualVaultData.totalUserShares,
                  DECIMALS_TOKEN
                ),
                3
              ),
              'rDPX',
            ],
          ]}
        />
        <Cell
          label="Earnings"
          data={[
            [
              formatAmount(
                formatUnits(
                  userPerpetualVaultData.userShareOfFunding,
                  DECIMALS_TOKEN
                ),
                3
              ),
              'ETH',
            ],
          ]}
        />
        <Cell
          label="To be unlocked"
          data={[
            [
              formatAmount(
                formatUnits(
                  userPerpetualVaultData.totalUserShares,
                  DECIMALS_TOKEN
                ),
                3
              ),
              'LP',
            ],
          ]}
        />
        <Cell label="Withdrawable" data={[['-', '']]} />
      </div>
    </>
  );
};

export default DepositRow;
