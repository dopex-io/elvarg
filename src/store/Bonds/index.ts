import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import {
  BaseNFT,
  BaseNFT__factory,
  DpxBonds,
  DpxBonds__factory,
  ERC20,
  ERC20__factory,
} from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

interface BondState {
  epoch: number;
  issued: number;
  maturityTime: number;
  redeemed: boolean;
}

interface DpxBondsData {
  epoch: number;
  epochExpiry: number;
  dpxPrice: BigNumber;
  dpxBondsAddress: string;
  bridgoorNftBalance: BigNumber;
  usdcBalance: BigNumber;
  bridgoorNftIds: number[];
}

const initialDpxBondsData: DpxBondsData = {
  epoch: 0,
  epochExpiry: 0,
  dpxPrice: BigNumber.from(0),
  dpxBondsAddress: '',
  bridgoorNftBalance: BigNumber.from(0),
  usdcBalance: BigNumber.from(0),
  bridgoorNftIds: [],
};

interface DopexBondsUserEpochData {
  usableNfts: BigNumber[];
  userClaimableBonds: BigNumber[];
  userBondsBalance: BigNumber;
  userDpxBondsState: BondState[];
}

const initialDopexBondsUserEpochData = {
  usableNfts: [],
  userClaimableBonds: [],
  userBondsBalance: BigNumber.from(0),
  userDpxBondsState: [],
};

interface DopexBondsEpochData {
  epoch: number;
  epochExpiry: number;
  dpxBalance: BigNumber;
  maxEpochDeposits: BigNumber;
  totalEpochDeposits: BigNumber;
  bondPrice: BigNumber;
  bondsIssued: BigNumber;
  depositPerNft: BigNumber;
}

const initialBondsEpochData = {
  dpxBalance: BigNumber.from(0),
  totalEpochDeposits: BigNumber.from(0),
  maxEpochDeposits: BigNumber.from(0),
  epoch: 0,
  epochExpiry: 0,
  bondPrice: BigNumber.from(0),
  bondsIssued: BigNumber.from(0),
  depositPerNft: BigNumber.from(0),
};

export interface DpxBondsSlice {
  dpxBondsData: DpxBondsData;
  dpxBondsEpochData: DopexBondsEpochData;
  dpxBondsUserEpochData: DopexBondsUserEpochData;
  getDepositsPerNftId?: Function;
  updateBondsData: Function;
  updateBondsEpochData: Function;
  updateBondsUserEpochData: Function;
  getBondsById: Function;
  getUserBondsNftsState: Function;
  getBridgoorNftIds: Function;
  updateBondsContracts: Function;
  bondsContract?: DpxBonds;
  usdcContract?: ERC20;
  dpxContract?: ERC20;
  dopexBridgoorNFTContract?: BaseNFT;
}

export const createDpxBondsSlice: StateCreator<
  WalletSlice & AssetsSlice & DpxBondsSlice,
  [['zustand/devtools', never]],
  [],
  DpxBondsSlice
> = (set, get) => ({
  dpxBondsData: initialDpxBondsData,
  dpxBondsEpochData: initialBondsEpochData,
  dpxBondsUserEpochData: initialDopexBondsUserEpochData,
  updateBondsData: async () => {
    const {
      contractAddresses,
      bondsContract,
      usdcContract,
      dopexBridgoorNFTContract,
      accountAddress,
      tokenPrices,
      getBridgoorNftIds,
    } = get();

    if (
      !contractAddresses ||
      !bondsContract ||
      !usdcContract ||
      !dopexBridgoorNFTContract ||
      !accountAddress ||
      !tokenPrices
    )
      return;

    const currentEpoch = await bondsContract.currentEpoch();
    const epochExpiry = await bondsContract.epochExpiry(currentEpoch);
    const bridgoorNftBalance = await dopexBridgoorNFTContract.balanceOf(
      accountAddress
    );
    const usdcBalance = await usdcContract.balanceOf(accountAddress);
    const dpxBondsAddress = bondsContract.address;
    const dpxCgPrice =
      tokenPrices.find((token) => token.name === 'DPX')?.price ?? 0;
    const dpxPrice = getContractReadableAmount(dpxCgPrice, 6);
    const bridgoorNftIds =
      (await getBridgoorNftIds(bridgoorNftBalance.toNumber())) ?? [];

    const _bondsData = {
      epoch: Number(currentEpoch),
      epochExpiry: Number(epochExpiry),
      dpxPrice,
      dpxBondsAddress,
      bridgoorNftBalance,
      usdcBalance,
      bridgoorNftIds,
    };
    set((prevState) => ({ ...prevState, dpxBondsData: _bondsData }));
  },
  updateBondsEpochData: async (selectedEpoch: number) => {
    const {
      bondsContract,
      dopexBridgoorNFTContract,
      usdcContract,
      dpxContract,
    } = get();

    if (!bondsContract || !dopexBridgoorNFTContract || !usdcContract) return;

    const totalUsdcLocked = await bondsContract.totalEpochDeposits(
      selectedEpoch
    );
    const contractDpxBalance = await dpxContract?.balanceOf(
      bondsContract.address
    );

    const bondPrice: BigNumber = await bondsContract.epochBondPrice(
      selectedEpoch
    ); // 1e6 precision

    const expiry = await bondsContract.epochExpiry(selectedEpoch);

    const depositPerNft = await bondsContract.epochDepositPerNft(selectedEpoch);

    const maxEpochDeposits = await bondsContract.maxDepositsPerEpoch(
      selectedEpoch
    );

    if (bondPrice.eq(0) || maxEpochDeposits.eq(0)) return;

    let bonds = BigNumber.from(0);

    bonds = totalUsdcLocked
      ?.mul(getContractReadableAmount(1, 18))
      .div(bondPrice);

    const _epochData: DopexBondsEpochData = {
      epoch: selectedEpoch,
      epochExpiry: Number(expiry),
      dpxBalance: contractDpxBalance ?? BigNumber.from(0),
      totalEpochDeposits: totalUsdcLocked,
      maxEpochDeposits,
      bondsIssued: bonds,
      bondPrice: bondPrice,
      depositPerNft: depositPerNft,
    };

    set((prevState) => ({ ...prevState, dpxBondsEpochData: _epochData }));
  },
  updateBondsUserEpochData: async () => {
    const {
      accountAddress,
      bondsContract,
      dopexBridgoorNFTContract,
      usdcContract,
      getBondsById,
      getUserBondsNftsState,
    } = get();

    if (
      !bondsContract ||
      !dopexBridgoorNFTContract ||
      !usdcContract ||
      !accountAddress
    )
      return;

    const currentEpoch = await bondsContract.currentEpoch();

    const usableNfts = await bondsContract.getUsableNfts(accountAddress);

    const userClaimableBonds = await bondsContract.getRedeemableBonds(
      accountAddress,
      currentEpoch
    );

    const userBondsBalance = await bondsContract.balanceOf(accountAddress);

    const dopexBondsIds =
      (userBondsBalance && (await getBondsById(userBondsBalance))) ?? [];

    let userEpochBondsState: BondState[] = [];

    if (dopexBondsIds.length > 0) {
      userEpochBondsState = (await getUserBondsNftsState(dopexBondsIds)) ?? [];
    }

    const _userEpochData = {
      usableNfts,
      userClaimableBonds,
      userBondsBalance,
      userDpxBondsState: userEpochBondsState,
    };

    set((prevState) => ({
      ...prevState,
      dpxBondsUserEpochData: _userEpochData,
    }));
  },
  getBondsById: async (dopexBondsNftBalance: BigNumber) => {
    const { bondsContract, accountAddress } = get();
    if (!bondsContract) return;

    let bondsIds = [];
    for (let i = 0; i < dopexBondsNftBalance.toNumber(); i++) {
      accountAddress &&
        bondsIds.push(
          Number(await bondsContract['tokenOfOwnerByIndex'](accountAddress, i))
        );
    }
    return bondsIds;
  },
  getUserBondsNftsState: async (bondsIds: Array<number>) => {
    const { bondsContract } = get();

    if (!bondsContract || !bondsIds) return;
    let userBondsState = [];
    for (let i = 0; i < bondsIds.length; i++) {
      let userBond = await bondsContract['nftsState'](bondsIds[i]!);
      userBondsState.push({
        epoch: Number(userBond.epoch),
        issued: Number(userBond.issued),
        maturityTime: Number(userBond.maturityTime),
        redeemed: userBond.redeemed,
      });
    }
    return userBondsState;
  },
  getBridgoorNftIds: async (dopexBridgoorNFTBalance: number) => {
    const { accountAddress, dopexBridgoorNFTContract } = get();

    if (!dopexBridgoorNFTContract) return;

    let bridgoorIds = [];
    for (let i = 0; i < dopexBridgoorNFTBalance; i++) {
      bridgoorIds.push(
        Number(
          await dopexBridgoorNFTContract['tokenOfOwnerByIndex'](
            accountAddress || '',
            i
          )
        )
      );
    }
    return bridgoorIds;
  },
  updateBondsContracts: () => {
    const { contractAddresses, provider, signer } = get();
    if (!provider || !contractAddresses || !signer) return;

    set((prevState) => ({
      ...prevState,
      usdcContract: ERC20__factory.connect(contractAddresses['USDC'], provider),
      dpxContract: ERC20__factory.connect(contractAddresses['DPX'], provider),
      bondsContract: DpxBonds__factory.connect(
        contractAddresses['DpxBonds'],
        signer
      ),
      dopexBridgoorNFTContract: BaseNFT__factory.connect(
        contractAddresses['NFTS']['DopexBridgoorNFT'],
        provider
      ),
    }));
  },
});
