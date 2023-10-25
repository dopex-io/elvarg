import { useCallback, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import initialContractStates from 'constants/rdpx/initialStates';

interface VaultState {
  currentEpoch: bigint;
  expiry: bigint;
  fundingRate: bigint;
  totalActiveOptions: bigint;
  lastFundingUpdateTime: bigint;
  fundingDuration: bigint;
}

interface EpochData {
  epoch: bigint;
  expiry: bigint;
  totalFundingForEpoch: bigint;
  fundingAccountedFor: bigint;
}

interface UserData {
  depositEpoch: bigint;
  totalDeposit: bigint;
  withdrawable: bigint;
  fundingAccrued: bigint;
}

interface Props {
  user: Address;
}

const usePerpPoolData = ({ user = '0x' }: Props) => {
  const [vaultState, setVaultState] = useState<VaultState>(
    initialContractStates.perpPool.state
  );
  const [userData, setUserData] = useState<UserData>(
    initialContractStates.perpPool.userData
  );

  const updateVaultState = useCallback(async () => {
    /// initialize vault

    setVaultState(initialContractStates.perpPool.state);
  }, []);

  const updateUserData = useCallback(async () => {
    if (user === '0x' || user === zeroAddress) return;
    // mount user data

    setUserData(initialContractStates.perpPool.userData);
  }, [user]);

  const fetchEpochData = useCallback(
    async (epoch: bigint): Promise<EpochData> => {
      const result = new Promise<EpochData>((resolve, _) => {
        resolve({
          epoch: epoch,
          expiry: 0n,
          totalFundingForEpoch: 0n,
          fundingAccountedFor: 0n,
        });
      });
      return result;
    },
    []
  );

  return {
    perpetualVaultState: vaultState,
    userPerpetualVaultData: userData,
    fetchPerpetualVaultEpochData: fetchEpochData,
    updatePerpetualVaultState: updateVaultState,
    updateUserPerpetualVaultData: updateUserData,
  };
};

export default usePerpPoolData;
