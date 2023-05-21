import { BigNumber, ethers } from 'ethers';

import { ERC20, SsovV3, SsovV3Viewer, SsovV3__factory } from '@dopex-io/sdk';
import { AddressesStruct } from '@dopex-io/sdk/dist/types/typechain/SsovV3';
import axios from 'axios';
import { TokenData } from 'types';
// import { getContract } from 'viem';
// import { readContracts as wagmiRead } from '@wagmi/core'
import { readContracts } from 'wagmi';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

// import { DOPEX_API_BASE_URL } from 'constants/env';
import { TOKEN_ADDRESS_TO_DATA } from 'constants/tokens';

const SSOV_VAULTS = {
  'ETH-WEEKLY-PUTS-SSOV-V3-3': '0x32449DF9c617C59f576dfC461D03f261F617aD5a',
  'ETH-MONTHLY-CALLS-SSOV-V3-3': '0xC59836FEC63Cfb2E48b0aa00515056436D74Dc03',
  'STETH-WEEKLY-CALLS-SSOV-V3': '0xFca61E79F38a7a82c62f469f55A9df54CB8dF678',
  'STETH-MONTHLY-CALLS-SSOV-V3': '0x475a5a712b741b9ab992e6af0b9e5adee3d1851b',
  'DPX-WEEKLY-CALLS-SSOV-V3': '0x10FD85ec522C245a63239b9FC64434F58520bd1f',
  'DPX-WEEKLY-PUTS-SSOV-V3-3': '0xf71b2B6fE3c1d94863e751d6B455f750E714163C',
  'DPX-MONTHLY-CALLS-SSOV-V3-3': '0x05E7ACeD3b7727f9129E6d302B488cd8a1e0C817',
  'RDPX-WEEKLY-CALLS-SSOV-V3': '0xCdaACF37726Bf1017821b5169e22EB34734B28A8',
  'RDPX-MONTHLY-CALLS-SSOV-V3': '0xd74c61ca8917Be73377D74A007E6f002c25Efb4e',
  'RDPX-WEEKLY-PUTS-SSOV-V3-3': '0xb4ec6B4eC9e42A42B0b8cdD3D6df8867546Cf11d',
  'gOHM-WEEKLY-CALLS-SSOV-V3': '0x546cd36F761f1D984eEE1Dbe67cC4F86E75cAF0C',
  'gOHM-WEEKLY-PUTS-SSOV-V3-3': '0x4269AF9076586230bF5fa3655144a5fe9CB877Fd',
  'BTC-WEEKLY-PUTS-SSOV-V3-3': '0xa7507c48d78345475b85bc27B9CE9B84b354CaF7',
  'GMX-WEEKLY-PUTS-SSOV-V3-3': '0xf071F0c56543A2671a2Dfc5FF51d5d858Be91514',
  'CRV-WEEKLY-PUTS-SSOV-V3-3': '0x7C5aC7E4E352B733CF65721d9Fe28A17Da890159',
  'ARB-MONTHLY-CALLS-SSOV-V3': '0xDF3d96299275E2Fb40124b8Ad9d270acFDcc6148',
  'CVX-WEEKLY-PUTS-SSOV-V3': '0x3e138322b86897eDf4Ffc6060Edc0C1220b4F8B0',
};

const DURATIONS = ['WEEKLY', 'MONTHLY'] as const;
export type DurationType = (typeof DURATIONS)[number];

export interface VaultEpochStrikeData {
  strike: BigNumber;
  isPut: boolean;
  strikeToken: string;
  totalCollateral: BigNumber;
  activeCollateral: BigNumber;
  totalPremiums: BigNumber;
  premiumPerOption: BigNumber;
  rewardStoredForPremiums: BigNumber[];
  rewardDistributionRatiosForPremiums: BigNumber[];
  expiry: BigNumber;
}

export interface VaultEpochData {
  epochTimes: [BigNumber, BigNumber];
  settlementPrice: BigNumber;
  strikeData: VaultEpochStrikeData[];
  rewardToken: TokenData[];
  expired: boolean;
  collateralExchangeRate: BigNumber;
  totalOptionsPurchased?: BigNumber;
  // rewards: any;
  // apy: any;
}

export interface VaultData<T, K> {
  contractWithSigner?: T;
  contractWithProvider?: T;
  isPut: boolean;
  durationType: DurationType;
  addresses: AddressesStruct | string[];
  currentEpoch: number;
  epochData?: VaultEpochData;
  userData?: VaultUserData;
  viewer?: K;
}

export interface VaultDeposit {
  strike: BigNumber;
  epoch: BigNumber;
  collateralAmount: BigNumber;
}

export interface VaultPurchase {
  strikeTokenWithSigner: ERC20;
  strike: BigNumber;
  breakeven: BigNumber;
  settlementPrice: BigNumber;
  premiumPaid?: BigNumber; // requires subgraph
}

export interface VaultUserData {
  deposits: VaultDeposit[];
  purchases: VaultPurchase[];
}

type VaultFilter = {
  isPut: boolean;
  durationType: DurationType;
  base?: string;
  // symbol: string;
};

export interface VaultsSlice {
  selectedVaultData?: VaultData<SsovV3, SsovV3Viewer>;
  filter: VaultFilter;
  updateFromBatch: (_filter: VaultFilter) => void;
  updateSelectedVaultData: (
    vault: string,
    isPut?: boolean,
    durationType?: DurationType
  ) => Promise<void> | undefined;
  getVaultData: (
    vault: string
  ) => Promise<VaultData<SsovV3, SsovV3Viewer> | undefined>;
  vaultsBatch: VaultData<SsovV3, SsovV3Viewer>[];
  updateVaultsBatch: (_base: string) => void;
  updateBase: (_base: string) => void;
  selectedEpochData: VaultEpochData;
  updateSelectedEpochData: (epoch: number) => void;
  getSelectedEpochStrikeData: (strikeIndex: number) => void;
  updateUserPositions: () => void;
  getVaultAddress: (params: {
    base: string;
    durationType: DurationType;
    isPut: boolean;
  }) => string | undefined;
  getVaultAddresses: (base: string) => { [key: string]: string }[] | undefined;
}

export const createVaultsSlice: StateCreator<
  WalletSlice & CommonSlice & VaultsSlice,
  [['zustand/devtools', never]],
  [],
  VaultsSlice
> = (set, get) => ({
  selectedVaultData: undefined,
  filter: {
    isPut: false,
    durationType: 'MONTHLY',
    base: 'ETH',
  },
  updateBase: (base: string) => {
    const { updateVaultsBatch } = get();
    updateVaultsBatch(base);
    set((prevState) => ({
      ...prevState,
      filter: { ...prevState.filter, base },
    }));
  },
  updateFromBatch: (_filter: VaultFilter) => {
    const { vaultsBatch } = get();
    if (!vaultsBatch || vaultsBatch.length === 0) return;

    const _fromBatch = vaultsBatch.find(
      (vault) =>
        vault.isPut === _filter.isPut &&
        vault.durationType === _filter.durationType
    );
    console.log('filter: ', _filter);
    set((prevState) => ({
      ...prevState,
      selectedVaultData: _fromBatch,
      filter: { ...prevState.filter, _filter },
    }));
  },
  updateSelectedVaultData: async (vault: string) => {
    const { getVaultData } = get();

    if (!vault) {
      set((prevState) => ({ ...prevState, selectedVaultData: undefined }));
      return;
    }

    const vaultData = await getVaultData(vault);
    if (!vaultData) return;
    set((prevState) => ({
      ...prevState,
      selectedVaultData: vaultData,
    }));
  },
  getVaultData: async (vault: string) => {
    const { signer, provider, filter } = get();

    if (!signer || !provider || !filter.base) return;

    const contractWithSigner = SsovV3__factory.connect(vault, signer);
    const contractWithProvider = SsovV3__factory.connect(vault, provider);
    const [
      isPut,
      addresses,
      _currentEpoch,
      // apyPayload, rewardsPayload
    ] = await Promise.all([
      contractWithProvider.isPut(),
      contractWithProvider.addresses(),
      contractWithProvider.currentEpoch(),
      // axios.get(`${DOPEX_API_BASE_URL}/v2/ssov/apy?symbol=${base}`),
      // axios.get(`${DOPEX_API_BASE_URL}/v2/ssov/rewards?symbol=${base}`),
    ]);

    const currentEpoch = _currentEpoch.toNumber();
    const epochData = await contractWithProvider.getEpochData(currentEpoch);
    const {
      collateralExchangeRate,
      expired,
      startTime,
      expiry,
      settlementPrice,
      strikes,
    } = epochData;

    try {
      const epochTimes = [startTime, expiry] as [BigNumber, BigNumber];
      const duration = Math.ceil(
        epochTimes[1].sub(epochTimes[0]).div(86400).toNumber()
      );
      let durationType: DurationType = 'WEEKLY';
      if (duration > 7) {
        durationType = 'WEEKLY';
      }
      if (duration > 21) {
        durationType = 'MONTHLY';
      }

      const strikeDataPromises = [];
      let premiumPromises: Promise<BigNumber>[] = [];
      let ivPromises: Promise<BigNumber>[] = [];
      for (let i = 0; i < strikes.length; i++) {
        strikeDataPromises.push(
          contractWithProvider.getEpochStrikeData(currentEpoch, strikes[i])
        );
        premiumPromises.push(
          contractWithProvider.calculatePremium(
            strikes[i],
            ethers.utils.parseEther('1'),
            epochData.expiry
          )
        );
        ivPromises.push(contractWithProvider.getVolatility(strikes[i]));
      }
      const premiums = await Promise.all(premiumPromises);
      const ivs = await Promise.all(ivPromises);

      let epochStrikeData = (await Promise.all(strikeDataPromises)).map(
        (strikeData, i) => ({
          ...strikeData,
          totalCollateral: strikeData.totalCollateral,
          activeCollateral: strikeData.activeCollateral,
          totalPremiums: strikeData.totalPremiums,
          strike: strikes[i],
          premiumPerOption: premiums[i],
          iv: ivs[i],
          isPut,
          expiry,
        })
      );

      const vaultData: VaultData<SsovV3, SsovV3Viewer> = {
        isPut,
        addresses,
        currentEpoch,
        contractWithSigner,
        contractWithProvider,
        durationType,
        epochData: {
          collateralExchangeRate,
          expired,
          epochTimes,
          settlementPrice,
          strikeData: epochStrikeData,
          // apy: apyPayload.data.apy,
          // rewards: rewardsPayload.data.rewards,
          rewardToken: epochData.rewardTokensToDistribute.map((token) => {
            return (
              TOKEN_ADDRESS_TO_DATA[token.toLowerCase()] || {
                token: 'UNKNOWN',
                amount: BigNumber.from(0),
              }
            );
          }),
        },
      };
      return vaultData;
    } catch (e) {
      console.log('Something went wrong in getVaultData()', e);
    }
  },
  vaultsBatch: [],
  updateVaultsBatch: async (_base: string) => {
    // update batch only if new base is selected
    /**
     * Example: Current selected ETH-SSOV-CALLS-WEEKLY
     * Update selected base
     * set selected SSOV as [<SELECTED-BASE>]-CALLS-WEEKLY; call updateSelectedSsovData()
     * Perform batched update to all [<SELECTED-BASE>]-<SIDE>-<DURATION> except the selected SSOV
     * store into batch
     */
    const {
      filter,
      getVaultData,
      getVaultAddresses,
      updateSelectedVaultData,
      setIsLoading,
    } = get();
    setIsLoading(true);
    const vaultAddresses = getVaultAddresses(_base);
    if (!vaultAddresses || !vaultAddresses[0]) {
      updateSelectedVaultData('');
      set((prevState) => ({
        ...prevState,
        vaultsBatch: [],
        isLoading: false,
      }));
      return;
    }

    const _contractAddress = Object.values(
      vaultAddresses[0] || Object.values(vaultAddresses)[0]
    )[0];

    await updateSelectedVaultData(_contractAddress);
    // update only if current base in store is not the same as passed based
    if (_base === filter.base) {
      const _promises: Promise<VaultData<SsovV3, SsovV3Viewer> | undefined>[] =
        [];
      try {
        for (let i = 0; i < vaultAddresses.length; i++) {
          const vaultAddress = Object.values(vaultAddresses[i])[0]; // extract address from { <VAULT-SYMBOL>: <ADDRESS> }
          const vaultDataPromise = getVaultData(vaultAddress);
          _promises.push(vaultDataPromise);
        }
      } catch (e) {
        console.error('Something went wrong during batched update', e);
      }
      const vaultsBatch = (await Promise.all(_promises)).filter(
        (vault) => typeof vault !== 'undefined'
      ) as VaultData<SsovV3, SsovV3Viewer>[];
      set((prevState) => ({
        ...prevState,
        vaultsBatch,
        base: _base,
        isLoading: false,
      }));
    }
  },
  selectedEpochData: {
    expired: true,
    epochTimes: [BigNumber.from(0), BigNumber.from(0)],
    settlementPrice: BigNumber.from(0),
    strikeData: [],
    rewards: 0,
    apy: 0,
    rewardToken: [],
    collateralExchangeRate: BigNumber.from(0),
  },
  updateSelectedEpochData: (epoch: number) => {
    console.log(epoch);
  },
  getSelectedEpochStrikeData: (strikeIndex: number) => {
    console.log(strikeIndex);
  },
  updateUserPositions: () => {},
  getVaultAddress: ({ base, durationType, isPut }) => {
    const { contractAddresses } = get();
    const result = Object.keys(contractAddresses['SSOV-V3']['VAULTS']).find(
      (ssovSymbol) =>
        `${base}-${durationType}-${isPut ? 'PUTS' : 'CALLS'}` === ssovSymbol
    );
    return result;
  },
  getVaultAddresses: (base: string) => {
    return Object.entries(SSOV_VAULTS as { [key: string]: string })
      .filter((ssovSymbol) =>
        String(ssovSymbol[0]).match(new RegExp(`^${base}`))
      )
      .map((entry) => {
        return { [entry[0]]: entry[1] };
      });
  },
});
