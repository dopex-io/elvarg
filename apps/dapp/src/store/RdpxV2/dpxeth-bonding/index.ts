import { StateCreator } from 'zustand';
import { BigNumber } from 'ethers';
import {
  CurveStableswapPair,
  RdpxV2Treasury,
  RdpxV2Bond,
  RdpxV2Treasury__factory,
  ERC20__factory,
  RdpxV2Bond__factory,
  DscToken__factory,
  DscToken,
  MockToken,
  MockToken__factory,
  PerpetualAtlanticVault,
  PerpetualAtlanticVault__factory,
  CurveStableswapPair__factory,
  // DPXVotingEscrow,
  // DPXVotingEscrow__factory,
  RdpxDecayingBonds,
  RdpxDecayingBonds__factory,
} from '@dopex-io/sdk';

import { WalletSlice } from 'store/Wallet';
import { AssetsSlice } from 'store/Assets';

import { getContractReadableAmount } from 'utils/contracts';

interface RdpxV2TreasuryContractState {
  contracts?: {
    bond: RdpxV2Bond;
    treasury: RdpxV2Treasury;
    curvePool?: CurveStableswapPair;
    dsc: DscToken;
    rdpx: MockToken;
    decayingBondableRdpx: RdpxDecayingBonds;
    vault: PerpetualAtlanticVault;
  };
  re_lp_factor: BigNumber;
  rdpx_reserve: BigNumber;
  lp_reserve: BigNumber;
  alphatoken_reserve: BigNumber;
  dsc_upper_peg: BigNumber;
  dsc_first_lower_depeg: BigNumber;
  dsc_second_lower_depeg: BigNumber;
  bond_maturity: BigNumber;
  discount_factor: BigNumber;
  alpha_token_ratio_percentage: BigNumber;
}

interface Token {
  address: string;
  symbol: string;
}

interface RdpxV2TreasuryData {
  reserveA: BigNumber;
  reserveB: BigNumber;
  tokenA: Token;
  tokenB: Token;
  premiumPerDsc: BigNumber;
  bondCostPerDsc: [BigNumber, BigNumber];
  lpPrice: BigNumber; // rdpxETH price
  dscPrice: BigNumber;
  dscSupply: BigNumber;
  rdpxSupply: BigNumber;
  rdpxPriceInAlpha: BigNumber;
  ammReserves: [BigNumber, BigNumber, string, string]; // [reserve A, reserve B, token A, token B]
  availableDelegates?: any;
}

export interface RdpxBond {
  tokenId: number;
  amount: BigNumber | number;
  maturity: BigNumber | number;
  timestamp: BigNumber | number;
}

interface RdpxV2TreasuryUserData {
  bonds: RdpxBond[];
  isEligibleForMint: boolean;
}

const initialTreasuryContractState: RdpxV2TreasuryContractState = {
  re_lp_factor: BigNumber.from(0),
  rdpx_reserve: BigNumber.from(0),
  lp_reserve: BigNumber.from(0),
  alphatoken_reserve: BigNumber.from(0),
  dsc_upper_peg: BigNumber.from(0),
  dsc_first_lower_depeg: BigNumber.from(0),
  dsc_second_lower_depeg: BigNumber.from(0),
  bond_maturity: BigNumber.from(0),
  discount_factor: BigNumber.from(0),
  alpha_token_ratio_percentage: BigNumber.from(0),
};

export interface DpxusdBondingSlice {
  treasuryContractState: RdpxV2TreasuryContractState;
  updateTreasuryContractState: Function;
  treasuryData: RdpxV2TreasuryData;
  updateTreasuryData: Function;
  userDscBondsData: RdpxV2TreasuryUserData;
  updateUserDscBondsData: Function;
  getAvailableDelegatesFromTreasury: Function;
  squeezeTreasuryDelegates: (
    delegates: DelegateType[],
    requiredCollateral: BigNumber,
    bonds: BigNumber
  ) =>
    | {
        ids: number[];
        amounts: BigNumber[];
      }
    | undefined;
}

export type DelegateType = [string, BigNumber, BigNumber, BigNumber, number] & {
  owner: string;
  amount: BigNumber;
  fee: BigNumber;
  activeCollateral: BigNumber;
  _id: number;
};

const initialUserDscBondData: RdpxV2TreasuryUserData = {
  bonds: [],
  isEligibleForMint: false,
};

export const createDpxusdBondingSlice: StateCreator<
  WalletSlice & AssetsSlice & DpxusdBondingSlice,
  [],
  [['zustand/devtools', never]],
  DpxusdBondingSlice
> = (set, get) => ({
  treasuryContractState: initialTreasuryContractState,
  updateTreasuryContractState: async () => {
    const { contractAddresses, provider } = get();

    if (!contractAddresses || !contractAddresses['RDPX-V2'] || !provider)
      return;

    const treasuryAddress = contractAddresses['RDPX-V2']['Treasury'];
    const bondAddress = contractAddresses['RDPX-V2']['Bond'];
    const dscAddress = contractAddresses['RDPX-V2']['DSC'];
    const curvePoolAddress = contractAddresses['RDPX-V2']['Curve2Pool'];
    const rdpxAddress = contractAddresses['RDPX'];
    const dbrAddress = contractAddresses['RDPX-V2']['RdpxDecayingBonds'];

    const treasury: RdpxV2Treasury = RdpxV2Treasury__factory.connect(
      treasuryAddress,
      provider
    );
    const curvePool: CurveStableswapPair = CurveStableswapPair__factory.connect(
      curvePoolAddress,
      provider
    );
    const perpetualAtlanticVaultAddress =
      contractAddresses['RDPX-V2']['PerpetualVault'];

    const bond: RdpxV2Bond = RdpxV2Bond__factory.connect(bondAddress, provider);
    const dsc: DscToken = DscToken__factory.connect(dscAddress, provider);
    const vault: PerpetualAtlanticVault =
      PerpetualAtlanticVault__factory.connect(
        perpetualAtlanticVaultAddress,
        provider
      );
    const rdpx: MockToken = MockToken__factory.connect(rdpxAddress, provider);
    const decayingBondableRdpx = RdpxDecayingBonds__factory.connect(
      dbrAddress,
      provider
    );

    const [
      re_lp_factor,
      rdpx_reserve,
      lp_reserve,
      alphatoken_reserve,
      dsc_upper_peg,
      dsc_first_lower_depeg,
      dsc_second_lower_depeg,
      bond_maturity,
      discount_factor,
      alpha_token_ratio_percentage,
    ] = await Promise.all([
      treasury.reLpFactor(),
      treasury.rdpxReserve(),
      treasury.lpReserve(),
      BigNumber.from(0),
      treasury.DSC_UPPER_PEG(),
      treasury.DSC_FIRST_LOWER_PEG(),
      treasury.DSC_SECOND_LOWER_PEG(),
      treasury.bondMaturity(),
      treasury.bondDiscountFactor(),
      treasury.ALPHA_TOKEN_RATIO_PERCENTAGE(),
    ]);

    set((prevState) => ({
      ...prevState,
      treasuryContractState: {
        contracts: {
          treasury,
          bond,
          dsc,
          rdpx,
          decayingBondableRdpx,
          vault,
          curvePool,
        },
        rdpx_reserve,
        lp_reserve,
        dsc_upper_peg,
        dsc_first_lower_depeg,
        dsc_second_lower_depeg,
        alphatoken_reserve,
        re_lp_factor,
        bond_maturity,
        discount_factor,
        alpha_token_ratio_percentage,
      },
    }));
  },
  treasuryData: {
    reserveA: BigNumber.from(0),
    reserveB: BigNumber.from(0),
    tokenA: {
      symbol: '',
      address: '',
    },
    tokenB: {
      symbol: '',
      address: '',
    },
    premiumPerDsc: BigNumber.from(0),
    bondCostPerDsc: [BigNumber.from(0), BigNumber.from(0)],
    lpPrice: BigNumber.from(0), // rdpxETH price
    dscPrice: BigNumber.from(0),
    dscSupply: BigNumber.from(0),
    rdpxSupply: BigNumber.from(0),
    rdpxPriceInAlpha: BigNumber.from(0),
    ammReserves: [BigNumber.from(0), BigNumber.from(0), '', ''], // [reserve A, reserve B, token A, token B]
  },
  updateTreasuryData: async () => {
    const {
      provider,
      contractAddresses,
      treasuryContractState,
      getAvailableDelegatesFromTreasury,
    } = get();

    if (!contractAddresses || !treasuryContractState.contracts) return;

    const treasury = treasuryContractState.contracts.treasury;

    if (!treasury) return;

    const [reserveA, reserveB, tokenAAddress, tokenBAddress] =
      await treasury.getRdpxAlphaLpReserves();

    const [tokenASymbol, tokenBSymbol] = await Promise.all([
      ERC20__factory.connect(tokenAAddress, provider).symbol(),
      ERC20__factory.connect(tokenBAddress, provider).symbol(),
    ]);

    const [bondCostPerDsc, lpPrice, dscPrice, rdpxPriceInAlpha] =
      await Promise.all([
        treasury.calculateBondCost(getContractReadableAmount(1, 18)),
        treasury.getLpPrice(),
        treasury.getDscPrice(),
        treasury.getRdpxPrice(),
      ]);

    const nextFundingTimestamp =
      await treasuryContractState.contracts.vault.nextFundingPaymentTimestamp();

    const timeTillExpiry = nextFundingTimestamp.sub(
      Math.ceil(Number(new Date()) / 1000)
    );

    const [premiumPerDsc, dscSupply, rdpxSupply] = await Promise.all([
      treasuryContractState.contracts.vault.calculatePremium(
        rdpxPriceInAlpha.sub(rdpxPriceInAlpha.div(4)),
        bondCostPerDsc.rdpxRequired, // rdpx options
        timeTillExpiry
      ),
      treasuryContractState.contracts.dsc.totalSupply(),
      treasuryContractState.contracts.rdpx.totalSupply(),
    ]);

    const availableDelegates = await getAvailableDelegatesFromTreasury();

    set((prevState) => ({
      ...prevState,
      treasuryData: {
        reserveA,
        reserveB,
        tokenA: {
          address: tokenAAddress,
          symbol: tokenASymbol,
        },
        tokenB: {
          address: tokenBAddress,
          symbol: tokenBSymbol,
        },
        bondCostPerDsc,
        premiumPerDsc,
        lpPrice,
        dscPrice,
        dscSupply,
        rdpxSupply,
        rdpxPriceInAlpha,
        ammReserves: [reserveA, reserveB, tokenAAddress, tokenBAddress],
        availableDelegates,
      },
    }));
  },
  userDscBondsData: initialUserDscBondData,
  updateUserDscBondsData: async () => {
    const {
      accountAddress,
      provider,
      contractAddresses,
      treasuryContractState,
    } = get();

    if (
      !provider ||
      !treasuryContractState.contracts ||
      !contractAddresses ||
      !accountAddress
    )
      return;

    const { bond } = treasuryContractState.contracts;

    if (!bond) return;

    const userBalance = (await bond.balanceOf(accountAddress)).toNumber();

    const bondCalls: Promise<any>[] = [];
    const bondIds: number[] = [];

    for (let i = 0; i < userBalance; i++) {
      const tokenID = await bond.tokenOfOwnerByIndex(accountAddress, i);
      bondIds.push(tokenID.toNumber());
      bondCalls.push(treasuryContractState.contracts.treasury.bonds(tokenID));
    }

    let bonds: RdpxBond[] = await Promise.all(bondCalls);

    bonds = bonds.map((bond, i) => ({ ...bond, tokenId: bondIds[i] || 0 }));

    // const veDPX: DPXVotingEscrow = DPXVotingEscrow__factory.connect(
    //   contractAddresses['WETH'], // todo change to veDPX
    //   provider
    // );

    // const isEligibleForMint = (await veDPX.balanceOf(accountAddress)).gte(
    //   getContractReadableAmount(1000, 18)
    // );

    set((prevState) => ({
      ...prevState,
      userDscBondsData: {
        bonds, // bonds,
        isEligibleForMint: true,
      },
    }));
  },
  getAvailableDelegatesFromTreasury: async () => {
    const { treasuryContractState } = get();

    if (!treasuryContractState.contracts) return;

    const _treasury = treasuryContractState.contracts.treasury;
    const delegatesLength = (await _treasury.getDelegatesLength()).toNumber();

    let _promises = [];
    for (let i = 0; i < delegatesLength; i++) {
      const delegateCall = _treasury.delegates(i);
      _promises.push(delegateCall);
    }

    // sort by fee %
    let delegatesResult = await Promise.all(_promises);
    delegatesResult = delegatesResult
      .map((val, i: number) => ({ ...val, _id: i }))
      .sort((a, b) => a.fee.toNumber() - b.fee.toNumber());

    const availableDelegates = delegatesResult.filter((val) =>
      val.amount.sub(val.activeCollateral).gt(0)
    );

    return availableDelegates;
  },
  squeezeTreasuryDelegates: (
    delegates: DelegateType[],
    requiredCollateral: BigNumber,
    bonds: BigNumber
  ) => {
    const { treasuryContractState, treasuryData } = get();

    if (
      !treasuryContractState.contracts ||
      !treasuryData ||
      !delegates ||
      !requiredCollateral
    )
      return;

    let requiredBalance = requiredCollateral;
    let accumulator = {
      amounts: [] as BigNumber[],
      ids: [] as number[],
    };

    for (let i = 0; i < delegates.length; i++) {
      if (delegates[i]?.amount.eq('0')) continue;
      const delegateBalance =
        delegates[i]?.amount.sub(delegates[i]?.activeCollateral || '0') ||
        BigNumber.from(0);
      const delegateId = delegates[i]?._id || 0;
      if (requiredBalance.gte(delegateBalance)) {
        requiredBalance = requiredBalance.sub(delegateBalance);
        accumulator.amounts.push(delegateBalance);
        accumulator.ids.push(delegateId);
      } else {
        accumulator.amounts.push(requiredBalance);
        accumulator.ids.push(delegateId);
        break;
      }
    }

    accumulator = {
      ...accumulator,
      amounts: accumulator.amounts.map(
        (amount) => amount.mul(bonds).div(requiredCollateral).sub(1e2) // todo: some precision is lost; calculateBondCost(A) + cbc(B) + cbc(C) !== cbc(A + B + C)
      ),
    };

    console.log(
      'Hello world: ',
      accumulator.amounts.map((amount) => amount.toString()),
      bonds
    );

    return {
      ids: accumulator.ids,
      amounts: accumulator.amounts,
    };
  },
});
