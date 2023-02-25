import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from './common';
export declare namespace IPerpetualAtlanticState {
  type AddressesStruct = {
    stakingStrategy: PromiseOrValue<string>;
    optionPricing: PromiseOrValue<string>;
    collateralPriceOracle: PromiseOrValue<string>;
    assetPriceOracle: PromiseOrValue<string>;
    volatilityOracle: PromiseOrValue<string>;
    feeDistributor: PromiseOrValue<string>;
    optionsTokenImplementation: PromiseOrValue<string>;
  };
  type AddressesStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ] & {
    stakingStrategy: string;
    optionPricing: string;
    collateralPriceOracle: string;
    assetPriceOracle: string;
    volatilityOracle: string;
    feeDistributor: string;
    optionsTokenImplementation: string;
  };
}
export interface PerpetualAtlanticVaultInterface extends utils.Interface {
  functions: {
    'DEFAULT_ADMIN_ROLE()': FunctionFragment;
    'MANAGER_ROLE()': FunctionFragment;
    'TREASURY_ROLE()': FunctionFragment;
    'addToContractWhitelist(address)': FunctionFragment;
    'addresses()': FunctionFragment;
    'approve(address,uint256)': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'burn(uint256)': FunctionFragment;
    'calculatePnl(uint256,uint256,uint256)': FunctionFragment;
    'calculatePremium(uint256,uint256,uint256)': FunctionFragment;
    'changeAllowanceForStakingStrategy(bool,uint256)': FunctionFragment;
    'collateralPrecision()': FunctionFragment;
    'collateralToken()': FunctionFragment;
    'deposit(uint256,address)': FunctionFragment;
    'emergencyWithdraw(address[],bool)': FunctionFragment;
    'getActiveCollateral()': FunctionFragment;
    'getApproved(uint256)': FunctionFragment;
    'getCollateralPrice()': FunctionFragment;
    'getRoleAdmin(bytes32)': FunctionFragment;
    'getTotalCollateral()': FunctionFragment;
    'getUnderlyingPrice()': FunctionFragment;
    'getVolatility(uint256)': FunctionFragment;
    'getWritePosition(uint256)': FunctionFragment;
    'grantRole(bytes32,address)': FunctionFragment;
    'hasRole(bytes32,address)': FunctionFragment;
    'isApprovedForAll(address,address)': FunctionFragment;
    'isContract(address)': FunctionFragment;
    'latestFundingPaymentPointer()': FunctionFragment;
    'name()': FunctionFragment;
    'nextFundingPaymentTimestamps(uint256)': FunctionFragment;
    'ownerOf(uint256)': FunctionFragment;
    'pause()': FunctionFragment;
    'paused()': FunctionFragment;
    'purchase(uint256,address)': FunctionFragment;
    'removeFromContractWhitelist(address)': FunctionFragment;
    'renounceRole(bytes32,address)': FunctionFragment;
    'revokeRole(bytes32,address)': FunctionFragment;
    'safeTransferFrom(address,address,uint256)': FunctionFragment;
    'safeTransferFrom(address,address,uint256,bytes)': FunctionFragment;
    'setAddresses((address,address,address,address,address,address,address))': FunctionFragment;
    'setApprovalForAll(address,bool)': FunctionFragment;
    'settle(address,uint256)': FunctionFragment;
    'supportsInterface(bytes4)': FunctionFragment;
    'symbol()': FunctionFragment;
    'tokenByIndex(uint256)': FunctionFragment;
    'tokenOfOwnerByIndex(address,uint256)': FunctionFragment;
    'tokenURI(uint256)': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'transferFrom(address,address,uint256)': FunctionFragment;
    'underlyingSymbol()': FunctionFragment;
    'unpause()': FunctionFragment;
    'updateFunding(uint256)': FunctionFragment;
    'updateFundingPayment(uint256)': FunctionFragment;
    'updateFundingPaymentEmergency(uint256[],uint256)': FunctionFragment;
    'vaultData()': FunctionFragment;
    'whitelistedContracts(address)': FunctionFragment;
    'withdraw(uint256,address)': FunctionFragment;
    'withdrawUnusedCollateral(uint256,address)': FunctionFragment;
  };
  getFunction(
    nameOrSignatureOrTopic:
      | 'DEFAULT_ADMIN_ROLE'
      | 'MANAGER_ROLE'
      | 'TREASURY_ROLE'
      | 'addToContractWhitelist'
      | 'addresses'
      | 'approve'
      | 'balanceOf'
      | 'burn'
      | 'calculatePnl'
      | 'calculatePremium'
      | 'changeAllowanceForStakingStrategy'
      | 'collateralPrecision'
      | 'collateralToken'
      | 'deposit'
      | 'emergencyWithdraw'
      | 'getActiveCollateral'
      | 'getApproved'
      | 'getCollateralPrice'
      | 'getRoleAdmin'
      | 'getTotalCollateral'
      | 'getUnderlyingPrice'
      | 'getVolatility'
      | 'getWritePosition'
      | 'grantRole'
      | 'hasRole'
      | 'isApprovedForAll'
      | 'isContract'
      | 'latestFundingPaymentPointer'
      | 'name'
      | 'nextFundingPaymentTimestamps'
      | 'ownerOf'
      | 'pause'
      | 'paused'
      | 'purchase'
      | 'removeFromContractWhitelist'
      | 'renounceRole'
      | 'revokeRole'
      | 'safeTransferFrom(address,address,uint256)'
      | 'safeTransferFrom(address,address,uint256,bytes)'
      | 'setAddresses'
      | 'setApprovalForAll'
      | 'settle'
      | 'supportsInterface'
      | 'symbol'
      | 'tokenByIndex'
      | 'tokenOfOwnerByIndex'
      | 'tokenURI'
      | 'totalSupply'
      | 'transferFrom'
      | 'underlyingSymbol'
      | 'unpause'
      | 'updateFunding'
      | 'updateFundingPayment'
      | 'updateFundingPaymentEmergency'
      | 'vaultData'
      | 'whitelistedContracts'
      | 'withdraw'
      | 'withdrawUnusedCollateral'
  ): FunctionFragment;
  encodeFunctionData(
    functionFragment: 'DEFAULT_ADMIN_ROLE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'MANAGER_ROLE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'TREASURY_ROLE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'addToContractWhitelist',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: 'addresses', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'approve',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'balanceOf',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'burn',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'calculatePnl',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: 'calculatePremium',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: 'changeAllowanceForStakingStrategy',
    values: [PromiseOrValue<boolean>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'collateralPrecision',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'collateralToken',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'deposit',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'emergencyWithdraw',
    values: [PromiseOrValue<string>[], PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: 'getActiveCollateral',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getApproved',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'getCollateralPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getRoleAdmin',
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: 'getTotalCollateral',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getUnderlyingPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getVolatility',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'getWritePosition',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'grantRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'hasRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'isApprovedForAll',
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'isContract',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'latestFundingPaymentPointer',
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'nextFundingPaymentTimestamps',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'ownerOf',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'purchase',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'removeFromContractWhitelist',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'renounceRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'revokeRole',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'safeTransferFrom(address,address,uint256)',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: 'safeTransferFrom(address,address,uint256,bytes)',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: 'setAddresses',
    values: [IPerpetualAtlanticState.AddressesStruct]
  ): string;
  encodeFunctionData(
    functionFragment: 'setApprovalForAll',
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: 'settle',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'supportsInterface',
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'tokenByIndex',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'tokenOfOwnerByIndex',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'tokenURI',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'totalSupply',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'transferFrom',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: 'underlyingSymbol',
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'updateFunding',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'updateFundingPayment',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'updateFundingPaymentEmergency',
    values: [PromiseOrValue<BigNumberish>[], PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: 'vaultData', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'whitelistedContracts',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'withdrawUnusedCollateral',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  decodeFunctionResult(
    functionFragment: 'DEFAULT_ADMIN_ROLE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'MANAGER_ROLE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'TREASURY_ROLE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'addToContractWhitelist',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'addresses', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'calculatePnl',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'calculatePremium',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'changeAllowanceForStakingStrategy',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'collateralPrecision',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'collateralToken',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'emergencyWithdraw',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getActiveCollateral',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getApproved',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getCollateralPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getRoleAdmin',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getTotalCollateral',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getUnderlyingPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getVolatility',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getWritePosition',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'grantRole', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'hasRole', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'isApprovedForAll',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'isContract', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'latestFundingPaymentPointer',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'nextFundingPaymentTimestamps',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'ownerOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'purchase', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'removeFromContractWhitelist',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'renounceRole',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'revokeRole', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'safeTransferFrom(address,address,uint256)',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'safeTransferFrom(address,address,uint256,bytes)',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setAddresses',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setApprovalForAll',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'settle', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'supportsInterface',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'tokenByIndex',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'tokenOfOwnerByIndex',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'tokenURI', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'totalSupply',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'transferFrom',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'underlyingSymbol',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'updateFunding',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'updateFundingPayment',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'updateFundingPaymentEmergency',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'vaultData', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'whitelistedContracts',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'withdrawUnusedCollateral',
    data: BytesLike
  ): Result;
  events: {
    'AddToContractWhitelist(address)': EventFragment;
    'AddressesSet(tuple)': EventFragment;
    'Approval(address,address,uint256)': EventFragment;
    'ApprovalForAll(address,address,bool)': EventFragment;
    'Bootstrap(uint256,uint256[])': EventFragment;
    'Deposit(uint256,address,address)': EventFragment;
    'EmergencyWithdraw(address)': EventFragment;
    'Paused(address)': EventFragment;
    'Purchase(uint256,uint256,uint256,address,address)': EventFragment;
    'RemoveFromContractWhitelist(address)': EventFragment;
    'RoleAdminChanged(bytes32,bytes32,bytes32)': EventFragment;
    'RoleGranted(bytes32,address,address)': EventFragment;
    'RoleRevoked(bytes32,address,address)': EventFragment;
    'Settle(uint256,uint256,uint256,address,address)': EventFragment;
    'Transfer(address,address,uint256)': EventFragment;
    'Unpaused(address)': EventFragment;
    'Withdraw(uint256,uint256,address,address)': EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: 'AddToContractWhitelist'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'AddressesSet'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ApprovalForAll'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Bootstrap'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Purchase'): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: 'RemoveFromContractWhitelist'
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleAdminChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleGranted'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleRevoked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Settle'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}
export interface AddToContractWhitelistEventObject {
  _contract: string;
}
export type AddToContractWhitelistEvent = TypedEvent<
  [string],
  AddToContractWhitelistEventObject
>;
export type AddToContractWhitelistEventFilter =
  TypedEventFilter<AddToContractWhitelistEvent>;
export interface AddressesSetEventObject {
  addresses: IPerpetualAtlanticState.AddressesStructOutput;
}
export type AddressesSetEvent = TypedEvent<
  [IPerpetualAtlanticState.AddressesStructOutput],
  AddressesSetEventObject
>;
export type AddressesSetEventFilter = TypedEventFilter<AddressesSetEvent>;
export interface ApprovalEventObject {
  owner: string;
  approved: string;
  tokenId: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;
export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export interface ApprovalForAllEventObject {
  owner: string;
  operator: string;
  approved: boolean;
}
export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  ApprovalForAllEventObject
>;
export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
export interface BootstrapEventObject {
  epoch: BigNumber;
  strikes: BigNumber[];
}
export type BootstrapEvent = TypedEvent<
  [BigNumber, BigNumber[]],
  BootstrapEventObject
>;
export type BootstrapEventFilter = TypedEventFilter<BootstrapEvent>;
export interface DepositEventObject {
  tokenId: BigNumber;
  to: string;
  sender: string;
}
export type DepositEvent = TypedEvent<
  [BigNumber, string, string],
  DepositEventObject
>;
export type DepositEventFilter = TypedEventFilter<DepositEvent>;
export interface EmergencyWithdrawEventObject {
  sender: string;
}
export type EmergencyWithdrawEvent = TypedEvent<
  [string],
  EmergencyWithdrawEventObject
>;
export type EmergencyWithdrawEventFilter =
  TypedEventFilter<EmergencyWithdrawEvent>;
export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;
export type PausedEventFilter = TypedEventFilter<PausedEvent>;
export interface PurchaseEventObject {
  strike: BigNumber;
  amount: BigNumber;
  premium: BigNumber;
  to: string;
  sender: string;
}
export type PurchaseEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string, string],
  PurchaseEventObject
>;
export type PurchaseEventFilter = TypedEventFilter<PurchaseEvent>;
export interface RemoveFromContractWhitelistEventObject {
  _contract: string;
}
export type RemoveFromContractWhitelistEvent = TypedEvent<
  [string],
  RemoveFromContractWhitelistEventObject
>;
export type RemoveFromContractWhitelistEventFilter =
  TypedEventFilter<RemoveFromContractWhitelistEvent>;
export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;
export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;
export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;
export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;
export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;
export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;
export interface SettleEventObject {
  strike: BigNumber;
  amount: BigNumber;
  pnl: BigNumber;
  to: string;
  sender: string;
}
export type SettleEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string, string],
  SettleEventObject
>;
export type SettleEventFilter = TypedEventFilter<SettleEvent>;
export interface TransferEventObject {
  from: string;
  to: string;
  tokenId: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;
export type TransferEventFilter = TypedEventFilter<TransferEvent>;
export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;
export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;
export interface WithdrawEventObject {
  tokenId: BigNumber;
  collateralTokenWithdrawn: BigNumber;
  to: string;
  sender: string;
}
export type WithdrawEvent = TypedEvent<
  [BigNumber, BigNumber, string, string],
  WithdrawEventObject
>;
export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;
export interface PerpetualAtlanticVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: PerpetualAtlanticVaultInterface;
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;
  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;
  functions: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;
    MANAGER_ROLE(overrides?: CallOverrides): Promise<[string]>;
    TREASURY_ROLE(overrides?: CallOverrides): Promise<[string]>;
    addToContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    addresses(overrides?: CallOverrides): Promise<
      [string, string, string, string, string, string, string] & {
        stakingStrategy: string;
        optionPricing: string;
        collateralPriceOracle: string;
        assetPriceOracle: string;
        volatilityOracle: string;
        feeDistributor: string;
        optionsTokenImplementation: string;
      }
    >;
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    calculatePnl(
      price: PromiseOrValue<BigNumberish>,
      strike: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    calculatePremium(
      _strike: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber] & {
        premium: BigNumber;
      }
    >;
    changeAllowanceForStakingStrategy(
      _increase: PromiseOrValue<boolean>,
      _allowance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    collateralPrecision(overrides?: CallOverrides): Promise<[BigNumber]>;
    collateralToken(overrides?: CallOverrides): Promise<[string]>;
    deposit(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    emergencyWithdraw(
      tokens: PromiseOrValue<string>[],
      transferNative: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    getActiveCollateral(overrides?: CallOverrides): Promise<
      [BigNumber] & {
        activeCollateral: BigNumber;
      }
    >;
    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;
    getCollateralPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;
    getTotalCollateral(overrides?: CallOverrides): Promise<
      [BigNumber] & {
        totalCollateral: BigNumber;
      }
    >;
    getUnderlyingPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
    getVolatility(
      _strike: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    getWritePosition(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber[]] & {
        totalCollateral: BigNumber;
        activeCollateral: BigNumber;
        accuredPremium: BigNumber;
        withdrawableCollateral: BigNumber;
        rewardDistributionRatios: BigNumber[];
      }
    >;
    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    latestFundingPaymentPointer(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    name(overrides?: CallOverrides): Promise<[string]>;
    nextFundingPaymentTimestamps(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;
    pause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    paused(overrides?: CallOverrides): Promise<[boolean]>;
    purchase(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    removeFromContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    setAddresses(
      _addresses: IPerpetualAtlanticState.AddressesStruct,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    settle(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    symbol(overrides?: CallOverrides): Promise<[string]>;
    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;
    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    underlyingSymbol(overrides?: CallOverrides): Promise<[string]>;
    unpause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    updateFunding(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    updateFundingPayment(
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    updateFundingPaymentEmergency(
      _timestamps: PromiseOrValue<BigNumberish>[],
      _pointer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    vaultData(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        totalCollateral: BigNumber;
        activeCollateral: BigNumber;
        totalPremium: BigNumber;
        positionPointer: BigNumber;
      }
    >;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    withdraw(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    withdrawUnusedCollateral(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
  };
  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;
  MANAGER_ROLE(overrides?: CallOverrides): Promise<string>;
  TREASURY_ROLE(overrides?: CallOverrides): Promise<string>;
  addToContractWhitelist(
    _contract: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  addresses(overrides?: CallOverrides): Promise<
    [string, string, string, string, string, string, string] & {
      stakingStrategy: string;
      optionPricing: string;
      collateralPriceOracle: string;
      assetPriceOracle: string;
      volatilityOracle: string;
      feeDistributor: string;
      optionsTokenImplementation: string;
    }
  >;
  approve(
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  balanceOf(
    owner: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  burn(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  calculatePnl(
    price: PromiseOrValue<BigNumberish>,
    strike: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  calculatePremium(
    _strike: PromiseOrValue<BigNumberish>,
    _amount: PromiseOrValue<BigNumberish>,
    timeToExpiry: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  changeAllowanceForStakingStrategy(
    _increase: PromiseOrValue<boolean>,
    _allowance: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  collateralPrecision(overrides?: CallOverrides): Promise<BigNumber>;
  collateralToken(overrides?: CallOverrides): Promise<string>;
  deposit(
    amount: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  emergencyWithdraw(
    tokens: PromiseOrValue<string>[],
    transferNative: PromiseOrValue<boolean>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  getActiveCollateral(overrides?: CallOverrides): Promise<BigNumber>;
  getApproved(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;
  getCollateralPrice(overrides?: CallOverrides): Promise<BigNumber>;
  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;
  getTotalCollateral(overrides?: CallOverrides): Promise<BigNumber>;
  getUnderlyingPrice(overrides?: CallOverrides): Promise<BigNumber>;
  getVolatility(
    _strike: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  getWritePosition(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber[]] & {
      totalCollateral: BigNumber;
      activeCollateral: BigNumber;
      accuredPremium: BigNumber;
      withdrawableCollateral: BigNumber;
      rewardDistributionRatios: BigNumber[];
    }
  >;
  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  isApprovedForAll(
    owner: PromiseOrValue<string>,
    operator: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  isContract(
    addr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  latestFundingPaymentPointer(overrides?: CallOverrides): Promise<BigNumber>;
  name(overrides?: CallOverrides): Promise<string>;
  nextFundingPaymentTimestamps(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  ownerOf(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;
  pause(
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  paused(overrides?: CallOverrides): Promise<boolean>;
  purchase(
    amount: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  removeFromContractWhitelist(
    _contract: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  'safeTransferFrom(address,address,uint256)'(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  'safeTransferFrom(address,address,uint256,bytes)'(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  setAddresses(
    _addresses: IPerpetualAtlanticState.AddressesStruct,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  setApprovalForAll(
    operator: PromiseOrValue<string>,
    approved: PromiseOrValue<boolean>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  settle(
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  symbol(overrides?: CallOverrides): Promise<string>;
  tokenByIndex(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  tokenOfOwnerByIndex(
    owner: PromiseOrValue<string>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;
  tokenURI(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;
  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
  transferFrom(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  underlyingSymbol(overrides?: CallOverrides): Promise<string>;
  unpause(
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  updateFunding(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  updateFundingPayment(
    _timestamp: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  updateFundingPaymentEmergency(
    _timestamps: PromiseOrValue<BigNumberish>[],
    _pointer: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  vaultData(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      totalCollateral: BigNumber;
      activeCollateral: BigNumber;
      totalPremium: BigNumber;
      positionPointer: BigNumber;
    }
  >;
  whitelistedContracts(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  withdraw(
    tokenId: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  withdrawUnusedCollateral(
    tokenId: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  callStatic: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;
    MANAGER_ROLE(overrides?: CallOverrides): Promise<string>;
    TREASURY_ROLE(overrides?: CallOverrides): Promise<string>;
    addToContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    addresses(overrides?: CallOverrides): Promise<
      [string, string, string, string, string, string, string] & {
        stakingStrategy: string;
        optionPricing: string;
        collateralPriceOracle: string;
        assetPriceOracle: string;
        volatilityOracle: string;
        feeDistributor: string;
        optionsTokenImplementation: string;
      }
    >;
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    calculatePnl(
      price: PromiseOrValue<BigNumberish>,
      strike: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    calculatePremium(
      _strike: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    changeAllowanceForStakingStrategy(
      _increase: PromiseOrValue<boolean>,
      _allowance: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    collateralPrecision(overrides?: CallOverrides): Promise<BigNumber>;
    collateralToken(overrides?: CallOverrides): Promise<string>;
    deposit(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    emergencyWithdraw(
      tokens: PromiseOrValue<string>[],
      transferNative: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
    getActiveCollateral(overrides?: CallOverrides): Promise<BigNumber>;
    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
    getCollateralPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;
    getTotalCollateral(overrides?: CallOverrides): Promise<BigNumber>;
    getUnderlyingPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getVolatility(
      _strike: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getWritePosition(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber[]] & {
        totalCollateral: BigNumber;
        activeCollateral: BigNumber;
        accuredPremium: BigNumber;
        withdrawableCollateral: BigNumber;
        rewardDistributionRatios: BigNumber[];
      }
    >;
    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    latestFundingPaymentPointer(overrides?: CallOverrides): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<string>;
    nextFundingPaymentTimestamps(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
    pause(overrides?: CallOverrides): Promise<void>;
    paused(overrides?: CallOverrides): Promise<boolean>;
    purchase(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    removeFromContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
    setAddresses(
      _addresses: IPerpetualAtlanticState.AddressesStruct,
      overrides?: CallOverrides
    ): Promise<void>;
    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
    settle(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    symbol(overrides?: CallOverrides): Promise<string>;
    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    underlyingSymbol(overrides?: CallOverrides): Promise<string>;
    unpause(overrides?: CallOverrides): Promise<void>;
    updateFunding(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    updateFundingPayment(
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    updateFundingPaymentEmergency(
      _timestamps: PromiseOrValue<BigNumberish>[],
      _pointer: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    vaultData(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        totalCollateral: BigNumber;
        activeCollateral: BigNumber;
        totalPremium: BigNumber;
        positionPointer: BigNumber;
      }
    >;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    withdraw(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    withdrawUnusedCollateral(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };
  filters: {
    'AddToContractWhitelist(address)'(
      _contract?: PromiseOrValue<string> | null
    ): AddToContractWhitelistEventFilter;
    AddToContractWhitelist(
      _contract?: PromiseOrValue<string> | null
    ): AddToContractWhitelistEventFilter;
    'AddressesSet(tuple)'(addresses?: null): AddressesSetEventFilter;
    AddressesSet(addresses?: null): AddressesSetEventFilter;
    'Approval(address,address,uint256)'(
      owner?: PromiseOrValue<string> | null,
      approved?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): ApprovalEventFilter;
    Approval(
      owner?: PromiseOrValue<string> | null,
      approved?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): ApprovalEventFilter;
    'ApprovalForAll(address,address,bool)'(
      owner?: PromiseOrValue<string> | null,
      operator?: PromiseOrValue<string> | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      owner?: PromiseOrValue<string> | null,
      operator?: PromiseOrValue<string> | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    'Bootstrap(uint256,uint256[])'(
      epoch?: null,
      strikes?: null
    ): BootstrapEventFilter;
    Bootstrap(epoch?: null, strikes?: null): BootstrapEventFilter;
    'Deposit(uint256,address,address)'(
      tokenId?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): DepositEventFilter;
    Deposit(
      tokenId?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): DepositEventFilter;
    'EmergencyWithdraw(address)'(sender?: null): EmergencyWithdrawEventFilter;
    EmergencyWithdraw(sender?: null): EmergencyWithdrawEventFilter;
    'Paused(address)'(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;
    'Purchase(uint256,uint256,uint256,address,address)'(
      strike?: null,
      amount?: null,
      premium?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): PurchaseEventFilter;
    Purchase(
      strike?: null,
      amount?: null,
      premium?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): PurchaseEventFilter;
    'RemoveFromContractWhitelist(address)'(
      _contract?: PromiseOrValue<string> | null
    ): RemoveFromContractWhitelistEventFilter;
    RemoveFromContractWhitelist(
      _contract?: PromiseOrValue<string> | null
    ): RemoveFromContractWhitelistEventFilter;
    'RoleAdminChanged(bytes32,bytes32,bytes32)'(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    'RoleGranted(bytes32,address,address)'(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    'RoleRevoked(bytes32,address,address)'(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    'Settle(uint256,uint256,uint256,address,address)'(
      strike?: null,
      amount?: null,
      pnl?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): SettleEventFilter;
    Settle(
      strike?: null,
      amount?: null,
      pnl?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): SettleEventFilter;
    'Transfer(address,address,uint256)'(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): TransferEventFilter;
    Transfer(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): TransferEventFilter;
    'Unpaused(address)'(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
    'Withdraw(uint256,uint256,address,address)'(
      tokenId?: null,
      collateralTokenWithdrawn?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): WithdrawEventFilter;
    Withdraw(
      tokenId?: null,
      collateralTokenWithdrawn?: null,
      to?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): WithdrawEventFilter;
  };
  estimateGas: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;
    MANAGER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;
    TREASURY_ROLE(overrides?: CallOverrides): Promise<BigNumber>;
    addToContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    addresses(overrides?: CallOverrides): Promise<BigNumber>;
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    calculatePnl(
      price: PromiseOrValue<BigNumberish>,
      strike: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    calculatePremium(
      _strike: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    changeAllowanceForStakingStrategy(
      _increase: PromiseOrValue<boolean>,
      _allowance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    collateralPrecision(overrides?: CallOverrides): Promise<BigNumber>;
    collateralToken(overrides?: CallOverrides): Promise<BigNumber>;
    deposit(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    emergencyWithdraw(
      tokens: PromiseOrValue<string>[],
      transferNative: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    getActiveCollateral(overrides?: CallOverrides): Promise<BigNumber>;
    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getCollateralPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getTotalCollateral(overrides?: CallOverrides): Promise<BigNumber>;
    getUnderlyingPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getVolatility(
      _strike: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    getWritePosition(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    latestFundingPaymentPointer(overrides?: CallOverrides): Promise<BigNumber>;
    name(overrides?: CallOverrides): Promise<BigNumber>;
    nextFundingPaymentTimestamps(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    pause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    paused(overrides?: CallOverrides): Promise<BigNumber>;
    purchase(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    removeFromContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    setAddresses(
      _addresses: IPerpetualAtlanticState.AddressesStruct,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    settle(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    symbol(overrides?: CallOverrides): Promise<BigNumber>;
    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    underlyingSymbol(overrides?: CallOverrides): Promise<BigNumber>;
    unpause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    updateFunding(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    updateFundingPayment(
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    updateFundingPaymentEmergency(
      _timestamps: PromiseOrValue<BigNumberish>[],
      _pointer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    vaultData(overrides?: CallOverrides): Promise<BigNumber>;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    withdraw(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    withdrawUnusedCollateral(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    MANAGER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    TREASURY_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    addToContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    addresses(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    burn(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    calculatePnl(
      price: PromiseOrValue<BigNumberish>,
      strike: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    calculatePremium(
      _strike: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    changeAllowanceForStakingStrategy(
      _increase: PromiseOrValue<boolean>,
      _allowance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    collateralPrecision(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    collateralToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    deposit(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    emergencyWithdraw(
      tokens: PromiseOrValue<string>[],
      transferNative: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    getActiveCollateral(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getCollateralPrice(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getTotalCollateral(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getUnderlyingPrice(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getVolatility(
      _strike: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    getWritePosition(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    latestFundingPaymentPointer(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    nextFundingPaymentTimestamps(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    pause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    purchase(
      amount: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    removeFromContractWhitelist(
      _contract: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    setAddresses(
      _addresses: IPerpetualAtlanticState.AddressesStruct,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    settle(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    underlyingSymbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    unpause(
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    updateFunding(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    updateFundingPayment(
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    updateFundingPaymentEmergency(
      _timestamps: PromiseOrValue<BigNumberish>[],
      _pointer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    vaultData(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    withdraw(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    withdrawUnusedCollateral(
      tokenId: PromiseOrValue<BigNumberish>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
  };
}
