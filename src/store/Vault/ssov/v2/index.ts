// todo: incomplete
import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import axios from 'axios';
import {
  NativeSSOV__factory,
  ERC20SSOV__factory,
  ERC20__factory,
  ERC20,
  VolatilityOracle,
  SSOVOptionPricing,
  BnbSSOVRouter,
  Curve2PoolSsovPut__factory,
  Curve2PoolSsovPut,
  ERC20SSOV,
} from '@dopex-io/sdk';

import { AssetsSlice } from 'store/Assets';
import { WalletSlice } from 'store/Wallet';

import isZeroAddress from 'utils/contracts/isZeroAddress';
import isNativeSsov from 'utils/contracts/isNativeSsov';
import formatAmount from 'utils/general/formatAmount';
import getTotalEpochPremium from 'utils/contracts/ssov-p/getTotalEpochPremium';

import { DOPEX_API_BASE_URL } from 'constants/index';

export interface Ssov {
  token?: string;
  type?: 'CALL' | 'PUT';
}
export interface SsovSigner {
  token?: ERC20[];
  ssovContractWithSigner?: any;
  ssovRouter?: BnbSSOVRouter;
}

export interface SsovData {
  tokenName?: string;
  ssovContract?: any;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  lpPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
  isCurrentEpochExpired?: boolean;
}

export interface SsovEpochData {
  epochTimes: { [key: number]: BigNumber } | [BigNumber, BigNumber];
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  totalEpochDeposits: BigNumber;
  settlementPrice: BigNumber;
  APY: string;
}

export interface SsovUserData {
  userEpochDeposits: string;
  epochStrikeTokens: ERC20[];
  userEpochStrikeDeposits: BigNumber[];
  userEpochOptionsPurchased: BigNumber[];
}

export interface SsovSlice {
  ssovData?: SsovData;
  ssovEpochData?: SsovEpochData;
  ssovUserData?: SsovUserData;
  ssovSigner: SsovSigner;
  selectedEpoch?: number;
  selectedSsov: Ssov;
  updateSsovEpochData?: Function;
  updateSsovUserData?: Function;
  setSelectedSsov: Function;
  setSelectedEpoch?: Function;
  isPut?: boolean;
}

export const createSsovSlice: StateCreator<
  SsovSlice & AssetsSlice & WalletSlice,
  [['zustand/devtools', never]],
  [],
  SsovSlice
> = (set, get) => ({
  ssovUserData: {
    userEpochStrikeDeposits: [],
    userEpochDeposits: '0',
    userEpochOptionsPurchased: [],
    epochStrikeTokens: [],
  },
  ssovSigner: {
    token: [],
    ssovContractWithSigner: null,
  },
  selectedSsov: {},
  selectedEpoch: 0,
  updateSsovEpochData: async () => {
    const { contractAddresses, selectedSsov, selectedEpoch, provider } = get();

    if (!contractAddresses || !selectedEpoch || !selectedSsov) return;

    const ssovAddresses =
      contractAddresses[selectedSsov.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
        selectedSsov.token ?? ''
      ];

    if (!ssovAddresses) return;

    const ssovContract =
      selectedSsov.type === 'PUT'
        ? Curve2PoolSsovPut__factory.connect(ssovAddresses.Vault, provider)
        : isNativeSsov(selectedSsov.token ?? '')
        ? NativeSSOV__factory.connect(ssovAddresses.Vault, provider)
        : ERC20SSOV__factory.connect(ssovAddresses.Vault, provider);

    const [
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochDeposits,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      settlementPrice,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovContract.isEpochExpired(selectedEpoch),
      ssovContract.isVaultReady(selectedEpoch),
      ssovContract.getEpochStrikes(selectedEpoch),
      ssovContract.totalEpochDeposits(selectedEpoch),
      ssovContract.getTotalEpochStrikeDeposits(selectedEpoch),
      selectedSsov.type === 'PUT'
        ? (ssovContract as Curve2PoolSsovPut).getTotalEpochPutsPurchased(
            selectedEpoch
          )
        : (ssovContract as ERC20SSOV).getTotalEpochCallsPurchased(
            selectedEpoch
          ),
      selectedSsov.type === 'PUT'
        ? getTotalEpochPremium(ssovContract as Curve2PoolSsovPut, selectedEpoch)
        : (ssovContract as ERC20SSOV).getTotalEpochPremium(selectedEpoch),
      ssovContract.settlementPrices(selectedEpoch),
    ]);

    const APY = await axios
      .get(
        `${DOPEX_API_BASE_URL}/v1/ssov/apy?asset=${
          selectedSsov.token
        }&type=${selectedSsov.type?.toLowerCase()}`
      )
      // @ts-ignore todo
      .then((res) => formatAmount(res.data.apy, 2))
      .catch(() => '0');

    const _ssovEpochData = {
      epochTimes,
      isEpochExpired,
      isVaultReady,
      epochStrikes,
      totalEpochDeposits,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      settlementPrice,
      APY,
    };

    set((prevState) => ({ ...prevState, ssovEpochData: _ssovEpochData }));
  },
  updateSsovUserData: async () => {
    const {
      provider,
      contractAddresses,
      accountAddress,
      selectedSsov,
      selectedEpoch,
    } = get();
    if (
      !contractAddresses ||
      !accountAddress ||
      !selectedEpoch ||
      !selectedSsov
    )
      return;

    const ssovAddresses =
      contractAddresses[selectedSsov.type === 'PUT' ? '2CRV-SSOV-P' : 'SSOV'][
        selectedSsov.token ?? ''
      ];

    if (!ssovAddresses) return;

    let _ssovUserData: SsovUserData;

    const ssovContract =
      selectedSsov.type === 'PUT'
        ? Curve2PoolSsovPut__factory.connect(ssovAddresses.Vault, provider)
        : isNativeSsov(selectedSsov.token ?? '')
        ? NativeSSOV__factory.connect(ssovAddresses.Vault, provider)
        : ERC20SSOV__factory.connect(ssovAddresses.Vault, provider);

    const [
      userEpochStrikeDeposits,
      userEpochOptionsPurchased,
      epochStrikeTokens,
    ] = await Promise.all([
      ssovContract.getUserEpochDeposits(selectedEpoch, accountAddress),
      selectedSsov.type === 'PUT'
        ? (ssovContract as Curve2PoolSsovPut).getUserEpochPutsPurchased(
            selectedEpoch,
            accountAddress
          )
        : (ssovContract as ERC20SSOV).getUserEpochCallsPurchased(
            selectedEpoch,
            accountAddress
          ),
      ssovContract.getEpochStrikeTokens(selectedEpoch),
    ]);

    const userEpochDeposits = userEpochStrikeDeposits
      .reduce(
        (accumulator, currentValue) => accumulator.add(currentValue),
        BigNumber.from(0)
      )
      .toString();

    _ssovUserData = {
      userEpochStrikeDeposits,
      userEpochOptionsPurchased,
      epochStrikeTokens: epochStrikeTokens
        .filter((token) => !isZeroAddress(token))
        .map((token) => ERC20__factory.connect(token, provider)),
      userEpochDeposits: userEpochDeposits,
    };

    set((prevState) => ({ ...prevState, ssovUserData: _ssovUserData }));
  },
  setSelectedSsov: (selectedSsov: Ssov) => {
    set((prevState) => ({ ...prevState, selectedSsov: selectedSsov }));
  },
  setSelectedEpoch: (epoch: number) => {
    set((prevState) => ({ ...prevState, selectedEpoch: epoch }));
  },
});
