import { StateCreator } from 'zustand';
import {
  SsovV3__factory,
  SsovV3,
  SSOVOptionPricing,
  SsovV3Viewer__factory,
  SSOVOptionPricing__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';
import axios from 'axios';

import { WalletSlice } from 'store/Wallet';
import { CommonSlice } from 'store/Vault/common';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { TOKEN_ADDRESS_TO_DATA } from 'constants/tokens';
import { DOPEX_API_BASE_URL } from 'constants/index';

import { TokenData } from 'types';

export interface SsovV3Signer {
  ssovContractWithSigner?: SsovV3;
}

export interface SsovV3Data {
  collateralSymbol?: string;
  underlyingSymbol?: string;
  collateralAddress?: string;
  ssovContract?: SsovV3;
  currentEpoch?: number;
  tokenPrice?: BigNumber;
  lpPrice?: BigNumber;
  ssovOptionPricingContract?: SSOVOptionPricing;
  isCurrentEpochExpired?: boolean;
  isPut?: boolean;
}

export interface SsovV3EpochData {
  epochTimes: BigNumber[];
  isEpochExpired: boolean;
  epochStrikes: BigNumber[];
  totalEpochStrikeDeposits: BigNumber[];
  totalEpochStrikeDepositsPending: BigNumber[];
  totalEpochStrikeDepositsUsable: BigNumber[];
  totalEpochOptionsPurchased: BigNumber[];
  totalEpochPremium: BigNumber[];
  availableCollateralForStrikes: BigNumber[];
  rewardTokens: TokenData[];
  settlementPrice: BigNumber;
  epochStrikeTokens: string[];
  APY: string;
  TVL: number;
  pendingDeposits: number;
}

export interface WritePositionInterface {
  collateralAmount: BigNumber;
  strike: BigNumber;
  accruedRewards: BigNumber[];
  accruedPremiums: BigNumber;
  estimatedPnl: BigNumber;
  epoch: number;
  tokenId: BigNumber;
}
export interface SsovV3UserData {
  writePositions: WritePositionInterface[];
}

export interface SsovV3Slice {
  ssovData?: SsovV3Data;
  ssovEpochData?: SsovV3EpochData;
  ssovV3UserData?: SsovV3UserData;
  ssovSigner: SsovV3Signer;
  updateSsovV3EpochData: Function;
  updateSsovV3UserData: Function;
  updateSsovV3Signer: Function;
  totalEpochStrikeDepositsPending?: BigNumber[];
  totalEpochStrikeDepositsUsable?: BigNumber[];
  updateSsovV3: Function;
}

export const createSsovV3Slice: StateCreator<
  CommonSlice & SsovV3Slice & WalletSlice,
  [['zustand/devtools', never]],
  [],
  SsovV3Slice
> = (set, get) => ({
  ssovData: {},
  ssovV3UserData: {
    writePositions: [],
  },
  ssovSigner: {},
  updateSsovV3Signer: async () => {
    const { contractAddresses, signer, selectedPoolName } = get();

    if (!contractAddresses || !signer || !selectedPoolName) return;

    let _ssovSigner: SsovV3Signer;

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    const _ssovContractWithSigner = SsovV3__factory.connect(
      ssovAddress,
      signer
    );

    _ssovSigner = {
      ssovContractWithSigner: _ssovContractWithSigner,
    };

    set((prevState) => ({ ...prevState, ssovSigner: _ssovSigner }));
  },
  updateSsovV3EpochData: async () => {
    const {
      contractAddresses,
      selectedEpoch,
      selectedPoolName,
      provider,
      totalEpochStrikeDepositsPending = [],
      totalEpochStrikeDepositsUsable = [],
    } = get();

    if (!contractAddresses || !selectedEpoch || !selectedPoolName || !provider)
      return;

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    const ssovContract = SsovV3__factory.connect(ssovAddress, provider);

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      contractAddresses['SSOV-V3'].VIEWER,
      provider
    );

    const [
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      epochData,
      epochStrikeTokens,
      apyPayload,
    ] = await Promise.all([
      ssovContract.getEpochTimes(selectedEpoch),
      ssovContract.getEpochStrikes(selectedEpoch),
      ssovViewerContract.getTotalEpochStrikeDeposits(
        selectedEpoch,
        ssovContract.address
      ),
      ssovViewerContract.getTotalEpochOptionsPurchased(
        selectedEpoch,
        ssovContract.address
      ),
      ssovViewerContract.getTotalEpochPremium(
        selectedEpoch,
        ssovContract.address
      ),
      ssovContract.getEpochData(selectedEpoch),
      ssovViewerContract.getEpochStrikeTokens(
        selectedEpoch,
        ssovContract.address
      ),
      axios.get(`${DOPEX_API_BASE_URL}/v2/ssov/apy?symbol=${selectedPoolName}`),
    ]);

    const epochStrikeDataArray = await Promise.all(
      epochStrikes.map((strike) =>
        ssovContract.getEpochStrikeData(selectedEpoch, strike)
      )
    );

    const epochStrikeDataCheckpoints = await Promise.all(
      epochStrikes.map((strike) =>
        ssovContract.getCheckpoints(selectedEpoch, strike)
      )
    );

    epochStrikeDataCheckpoints.map((checkpoints, index) => {
      const lastCheckpoint = checkpoints[checkpoints?.length - 1];

      const checkpointStart = lastCheckpoint?.startTime || BigNumber.from(0);
      const pendingCollateral =
        lastCheckpoint?.totalCollateral || BigNumber.from(0);

      const timeNow = BigNumber.from(Math.floor(Date.now() / 1000));

      if (lastCheckpoint && checkpointStart.add(2 * 3600).gt(timeNow)) {
        totalEpochStrikeDepositsPending[index] = pendingCollateral;
      } else if (lastCheckpoint && checkpointStart.add(2 * 3600).lte(timeNow)) {
        totalEpochStrikeDepositsUsable[index] = pendingCollateral;
      }
    });

    const availableCollateralForStrikes = epochStrikeDataArray.map((item) => {
      return item.totalCollateral.sub(item.activeCollateral);
    });

    const totalEpochDeposits = totalEpochStrikeDeposits.reduce(
      (acc, deposit) => {
        return acc.add(deposit);
      },
      BigNumber.from(0)
    );

    const underlyingPrice = await ssovContract.getUnderlyingPrice();
    const totalEpochDepositsInUSD = !(await ssovContract.isPut())
      ? getUserReadableAmount(totalEpochDeposits, 18) *
        getUserReadableAmount(underlyingPrice, 8)
      : getUserReadableAmount(totalEpochDeposits, 18);

    const totalEpochDepositsPending = totalEpochStrikeDepositsPending?.reduce(
      (acc, deposit) => {
        return acc.add(deposit);
      },
      BigNumber.from(0)
    );

    const totalEpochDepositsPendingInUSD = !(await ssovContract.isPut())
      ? getUserReadableAmount(totalEpochDepositsPending, 18) *
        getUserReadableAmount(underlyingPrice, 8)
      : getUserReadableAmount(totalEpochDepositsPending, 18);

    const _ssovEpochData = {
      isEpochExpired: epochData.expired,
      settlementPrice: epochData.settlementPrice,
      epochTimes,
      epochStrikes,
      totalEpochStrikeDeposits,
      totalEpochStrikeDepositsPending,
      totalEpochStrikeDepositsUsable,
      totalEpochOptionsPurchased,
      totalEpochPremium,
      availableCollateralForStrikes,
      rewardTokens: epochData.rewardTokensToDistribute.map((token) => {
        return (
          TOKEN_ADDRESS_TO_DATA[token.toLowerCase()] || {
            symbol: 'UNKNOWN',
            imgSrc: '',
          }
        );
      }),
      APY: apyPayload.data.apy,
      epochStrikeTokens,
      TVL: totalEpochDepositsInUSD,
      pendingDeposits: totalEpochDepositsPendingInUSD,
    };

    set((prevState) => ({ ...prevState, ssovEpochData: _ssovEpochData }));
  },
  updateSsovV3UserData: async () => {
    const {
      contractAddresses,
      accountAddress,
      provider,
      selectedEpoch,
      selectedPoolName,
    } = get();

    if (
      !contractAddresses ||
      !accountAddress ||
      !selectedEpoch ||
      !selectedPoolName
    )
      return;

    if (!contractAddresses['SSOV-V3']) return;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    const ssov = SsovV3__factory.connect(ssovAddress, provider);

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      contractAddresses['SSOV-V3'].VIEWER,
      provider
    );

    const writePositions = await ssovViewerContract.walletOfOwner(
      accountAddress,
      ssovAddress
    );

    const data = await Promise.all(
      writePositions.map((i) => {
        return ssov.writePosition(i);
      })
    );

    const moreData = await Promise.all(
      writePositions.map((i) => {
        return ssovViewerContract.getWritePositionValue(i, ssovAddress);
      })
    );

    set((prevState) => ({
      ...prevState,
      writePositions: data.map((o, i) => {
        return {
          tokenId: writePositions[i] as BigNumber,
          collateralAmount: o.collateralAmount,
          epoch: o.epoch.toNumber(),
          strike: o.strike,
          estimatedPnl: o.collateralAmount
            .sub(moreData[i]?.estimatedCollateralUsage || BigNumber.from(0))
            .add(moreData[i]?.premiumsAccrued || BigNumber.from(0)),
          accruedRewards: moreData[i]?.rewardTokenWithdrawAmounts || [],
          accruedPremiums: moreData[i]?.premiumsAccrued || BigNumber.from(0),
        };
      }),
    }));
  },
  updateSsovV3: async () => {
    const {
      chainId,
      contractAddresses,
      selectedPoolName = '',
      provider,
      setSelectedEpoch,
    } = get();

    let _ssovData: SsovV3Data;

    const ssovAddress = contractAddresses['SSOV-V3'].VAULTS[selectedPoolName];

    const _ssovContract = SsovV3__factory.connect(ssovAddress, provider);

    try {
      const [
        currentEpoch,
        tokenPrice,
        underlyingSymbol,
        collateralToken,
        isPut,
      ] = await Promise.all([
        _ssovContract.currentEpoch(),
        _ssovContract.getUnderlyingPrice(),
        _ssovContract.underlyingSymbol(),
        _ssovContract.collateralToken(),
        _ssovContract.isPut(),
      ]);

      const _currentEpoch =
        Number(currentEpoch) === 0 ? 1 : Number(currentEpoch);

      const [epochData, collateralSymbol] = await Promise.all([
        _ssovContract.getEpochData(_currentEpoch),
        ERC20__factory.connect(collateralToken, provider).symbol(),
      ]);

      setSelectedEpoch(_currentEpoch);

      _ssovData = {
        underlyingSymbol,
        collateralSymbol,
        collateralAddress: collateralToken,
        isPut,
        ssovContract: _ssovContract,
        currentEpoch: Number(currentEpoch),
        isCurrentEpochExpired: epochData.expired,
        tokenPrice,
        lpPrice: ethers.utils.parseEther('1'),
        ssovOptionPricingContract: SSOVOptionPricing__factory.connect(
          chainId === 1088
            ? '0xeec2be5c91ae7f8a338e1e5f3b5de49d07afdc81'
            : '0x2b99e3d67dad973c1b9747da742b7e26c8bdd67b',
          provider
        ),
      };

      set((prevState) => ({ ...prevState, ssovData: _ssovData }));
    } catch (err) {
      console.log(err);
    }
  },
  selectedEpoch: 1,
  setSelectedEpoch: (epoch: number) => {
    set((prevState) => ({ ...prevState, selectedEpoch: epoch }));
  },
  setSelectedSsovV3: (ssov: string) => {
    set((prevState) => ({ ...prevState, selectedSsovV3: ssov }));
  },
});
