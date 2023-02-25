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
export declare namespace RdpxV2Treasury {
  type AddressesStruct = {
    rdpx: PromiseOrValue<string>;
    rdpxBond: PromiseOrValue<string>;
    dsc: PromiseOrValue<string>;
    dopexAMMRouter: PromiseOrValue<string>;
    dopexAMMFactory: PromiseOrValue<string>;
    dopexAMMPair: PromiseOrValue<string>;
    dscCurvePool: PromiseOrValue<string>;
    putPool: PromiseOrValue<string>;
  };
  type AddressesStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ] & {
    rdpx: string;
    rdpxBond: string;
    dsc: string;
    dopexAMMRouter: string;
    dopexAMMFactory: string;
    dopexAMMPair: string;
    dscCurvePool: string;
    putPool: string;
  };
}
export interface RdpxV2TreasuryInterface extends utils.Interface {
  functions: {
    'ALPHA_TOKEN_RATIO_PERCENTAGE()': FunctionFragment;
    'DEFAULT_ADMIN_ROLE()': FunctionFragment;
    'DEFAULT_PRECISION()': FunctionFragment;
    'DSC_FIRST_LOWER_PEG()': FunctionFragment;
    'DSC_SECOND_LOWER_PEG()': FunctionFragment;
    'DSC_UPPER_PEG()': FunctionFragment;
    'RDPX_RATIO_PERCENTAGE()': FunctionFragment;
    'addToContractWhitelist(address)': FunctionFragment;
    'addresses()': FunctionFragment;
    'alphaToken()': FunctionFragment;
    'alphaTokenReserve()': FunctionFragment;
    'bond(uint256,address)': FunctionFragment;
    'bondMaturity()': FunctionFragment;
    'calculateBondCost(uint256)': FunctionFragment;
    'dscReserve()': FunctionFragment;
    'firstLowerDepeg(uint256)': FunctionFragment;
    'getDscPrice()': FunctionFragment;
    'getLpPrice()': FunctionFragment;
    'getRdpxPrice()': FunctionFragment;
    'getRoleAdmin(bytes32)': FunctionFragment;
    'grantRole(bytes32,address)': FunctionFragment;
    'hasRole(bytes32,address)': FunctionFragment;
    'isContract(address)': FunctionFragment;
    'lpReserve()': FunctionFragment;
    'rdpxReserve()': FunctionFragment;
    'redeem(uint256,address)': FunctionFragment;
    'removeFromContractWhitelist(address)': FunctionFragment;
    'renounceRole(bytes32,address)': FunctionFragment;
    'revokeRole(bytes32,address)': FunctionFragment;
    'secondLowerDepeg(uint256,address)': FunctionFragment;
    'setAddresses((address,address,address,address,address,address,address,address))': FunctionFragment;
    'setBondMaturity(uint256)': FunctionFragment;
    'supportsInterface(bytes4)': FunctionFragment;
    'upperDepeg(uint256,address)': FunctionFragment;
    'whitelistedContracts(address)': FunctionFragment;
  };
  getFunction(
    nameOrSignatureOrTopic:
      | 'ALPHA_TOKEN_RATIO_PERCENTAGE'
      | 'DEFAULT_ADMIN_ROLE'
      | 'DEFAULT_PRECISION'
      | 'DSC_FIRST_LOWER_PEG'
      | 'DSC_SECOND_LOWER_PEG'
      | 'DSC_UPPER_PEG'
      | 'RDPX_RATIO_PERCENTAGE'
      | 'addToContractWhitelist'
      | 'addresses'
      | 'alphaToken'
      | 'alphaTokenReserve'
      | 'bond'
      | 'bondMaturity'
      | 'calculateBondCost'
      | 'dscReserve'
      | 'firstLowerDepeg'
      | 'getDscPrice'
      | 'getLpPrice'
      | 'getRdpxPrice'
      | 'getRoleAdmin'
      | 'grantRole'
      | 'hasRole'
      | 'isContract'
      | 'lpReserve'
      | 'rdpxReserve'
      | 'redeem'
      | 'removeFromContractWhitelist'
      | 'renounceRole'
      | 'revokeRole'
      | 'secondLowerDepeg'
      | 'setAddresses'
      | 'setBondMaturity'
      | 'supportsInterface'
      | 'upperDepeg'
      | 'whitelistedContracts'
  ): FunctionFragment;
  encodeFunctionData(
    functionFragment: 'ALPHA_TOKEN_RATIO_PERCENTAGE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'DEFAULT_ADMIN_ROLE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'DEFAULT_PRECISION',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'DSC_FIRST_LOWER_PEG',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'DSC_SECOND_LOWER_PEG',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'DSC_UPPER_PEG',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'RDPX_RATIO_PERCENTAGE',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'addToContractWhitelist',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: 'addresses', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'alphaToken',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'alphaTokenReserve',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'bond',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'bondMaturity',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'calculateBondCost',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'dscReserve',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'firstLowerDepeg',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'getDscPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getLpPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getRdpxPrice',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'getRoleAdmin',
    values: [PromiseOrValue<BytesLike>]
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
    functionFragment: 'isContract',
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: 'lpReserve', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'rdpxReserve',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'redeem',
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
    functionFragment: 'secondLowerDepeg',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'setAddresses',
    values: [RdpxV2Treasury.AddressesStruct]
  ): string;
  encodeFunctionData(
    functionFragment: 'setBondMaturity',
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: 'supportsInterface',
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: 'upperDepeg',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: 'whitelistedContracts',
    values: [PromiseOrValue<string>]
  ): string;
  decodeFunctionResult(
    functionFragment: 'ALPHA_TOKEN_RATIO_PERCENTAGE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'DEFAULT_ADMIN_ROLE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'DEFAULT_PRECISION',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'DSC_FIRST_LOWER_PEG',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'DSC_SECOND_LOWER_PEG',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'DSC_UPPER_PEG',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'RDPX_RATIO_PERCENTAGE',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'addToContractWhitelist',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'addresses', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'alphaToken', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'alphaTokenReserve',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'bond', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'bondMaturity',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'calculateBondCost',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'dscReserve', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'firstLowerDepeg',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getDscPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'getLpPrice', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'getRdpxPrice',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getRoleAdmin',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'grantRole', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'hasRole', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isContract', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lpReserve', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'rdpxReserve',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'redeem', data: BytesLike): Result;
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
    functionFragment: 'secondLowerDepeg',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setAddresses',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'setBondMaturity',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'supportsInterface',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'upperDepeg', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'whitelistedContracts',
    data: BytesLike
  ): Result;
  events: {
    'AddToContractWhitelist(address)': EventFragment;
    'LogBond(uint256,uint256,uint256)': EventFragment;
    'LogRedeem(uint256,uint256)': EventFragment;
    'LogSetAddresses(tuple)': EventFragment;
    'LogSetBondMaturity(uint256)': EventFragment;
    'RemoveFromContractWhitelist(address)': EventFragment;
    'RoleAdminChanged(bytes32,bytes32,bytes32)': EventFragment;
    'RoleGranted(bytes32,address,address)': EventFragment;
    'RoleRevoked(bytes32,address,address)': EventFragment;
  };
  getEvent(nameOrSignatureOrTopic: 'AddToContractWhitelist'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogBond'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogRedeem'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogSetAddresses'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogSetBondMaturity'): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: 'RemoveFromContractWhitelist'
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleAdminChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleGranted'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RoleRevoked'): EventFragment;
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
export interface LogBondEventObject {
  rdpxPaid: BigNumber;
  alphaTokenPaidd: BigNumber;
  bondId: BigNumber;
}
export type LogBondEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  LogBondEventObject
>;
export type LogBondEventFilter = TypedEventFilter<LogBondEvent>;
export interface LogRedeemEventObject {
  bondId: BigNumber;
  dscMinted: BigNumber;
}
export type LogRedeemEvent = TypedEvent<
  [BigNumber, BigNumber],
  LogRedeemEventObject
>;
export type LogRedeemEventFilter = TypedEventFilter<LogRedeemEvent>;
export interface LogSetAddressesEventObject {
  addresses: RdpxV2Treasury.AddressesStructOutput;
}
export type LogSetAddressesEvent = TypedEvent<
  [RdpxV2Treasury.AddressesStructOutput],
  LogSetAddressesEventObject
>;
export type LogSetAddressesEventFilter = TypedEventFilter<LogSetAddressesEvent>;
export interface LogSetBondMaturityEventObject {
  bondMaturity: BigNumber;
}
export type LogSetBondMaturityEvent = TypedEvent<
  [BigNumber],
  LogSetBondMaturityEventObject
>;
export type LogSetBondMaturityEventFilter =
  TypedEventFilter<LogSetBondMaturityEvent>;
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
export interface RdpxV2Treasury extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;
  interface: RdpxV2TreasuryInterface;
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
    ALPHA_TOKEN_RATIO_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;
    DEFAULT_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;
    DSC_FIRST_LOWER_PEG(overrides?: CallOverrides): Promise<[BigNumber]>;
    DSC_SECOND_LOWER_PEG(overrides?: CallOverrides): Promise<[BigNumber]>;
    DSC_UPPER_PEG(overrides?: CallOverrides): Promise<[BigNumber]>;
    RDPX_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<[BigNumber]>;
    addToContractWhitelist(
      _addr: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    addresses(overrides?: CallOverrides): Promise<
      [string, string, string, string, string, string, string, string] & {
        rdpx: string;
        rdpxBond: string;
        dsc: string;
        dopexAMMRouter: string;
        dopexAMMFactory: string;
        dopexAMMPair: string;
        dscCurvePool: string;
        putPool: string;
      }
    >;
    alphaToken(overrides?: CallOverrides): Promise<[string]>;
    alphaTokenReserve(overrides?: CallOverrides): Promise<[BigNumber]>;
    bond(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    bondMaturity(overrides?: CallOverrides): Promise<[BigNumber]>;
    calculateBondCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        rdpxRequired: BigNumber;
        alphaTokenRequired: BigNumber;
      }
    >;
    dscReserve(overrides?: CallOverrides): Promise<[BigNumber]>;
    firstLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    getDscPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
    getLpPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
    getRdpxPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;
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
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    lpReserve(overrides?: CallOverrides): Promise<[BigNumber]>;
    rdpxReserve(overrides?: CallOverrides): Promise<[BigNumber]>;
    redeem(
      _id: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    removeFromContractWhitelist(
      _addr: PromiseOrValue<string>,
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
    secondLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    setAddresses(
      _addresses: RdpxV2Treasury.AddressesStruct,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    setBondMaturity(
      _bondMaturtity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
    upperDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<ContractTransaction>;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };
  ALPHA_TOKEN_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;
  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;
  DEFAULT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;
  DSC_FIRST_LOWER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
  DSC_SECOND_LOWER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
  DSC_UPPER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
  RDPX_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;
  addToContractWhitelist(
    _addr: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  addresses(overrides?: CallOverrides): Promise<
    [string, string, string, string, string, string, string, string] & {
      rdpx: string;
      rdpxBond: string;
      dsc: string;
      dopexAMMRouter: string;
      dopexAMMFactory: string;
      dopexAMMPair: string;
      dscCurvePool: string;
      putPool: string;
    }
  >;
  alphaToken(overrides?: CallOverrides): Promise<string>;
  alphaTokenReserve(overrides?: CallOverrides): Promise<BigNumber>;
  bond(
    _amount: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  bondMaturity(overrides?: CallOverrides): Promise<BigNumber>;
  calculateBondCost(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      rdpxRequired: BigNumber;
      alphaTokenRequired: BigNumber;
    }
  >;
  dscReserve(overrides?: CallOverrides): Promise<BigNumber>;
  firstLowerDepeg(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  getDscPrice(overrides?: CallOverrides): Promise<BigNumber>;
  getLpPrice(overrides?: CallOverrides): Promise<BigNumber>;
  getRdpxPrice(overrides?: CallOverrides): Promise<BigNumber>;
  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;
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
  isContract(
    addr: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  lpReserve(overrides?: CallOverrides): Promise<BigNumber>;
  rdpxReserve(overrides?: CallOverrides): Promise<BigNumber>;
  redeem(
    _id: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  removeFromContractWhitelist(
    _addr: PromiseOrValue<string>,
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
  secondLowerDepeg(
    _amount: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  setAddresses(
    _addresses: RdpxV2Treasury.AddressesStruct,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  setBondMaturity(
    _bondMaturtity: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  upperDepeg(
    _amount: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>;
    }
  ): Promise<ContractTransaction>;
  whitelistedContracts(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;
  callStatic: {
    ALPHA_TOKEN_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;
    DEFAULT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;
    DSC_FIRST_LOWER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
    DSC_SECOND_LOWER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
    DSC_UPPER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
    RDPX_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;
    addToContractWhitelist(
      _addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    addresses(overrides?: CallOverrides): Promise<
      [string, string, string, string, string, string, string, string] & {
        rdpx: string;
        rdpxBond: string;
        dsc: string;
        dopexAMMRouter: string;
        dopexAMMFactory: string;
        dopexAMMPair: string;
        dscCurvePool: string;
        putPool: string;
      }
    >;
    alphaToken(overrides?: CallOverrides): Promise<string>;
    alphaTokenReserve(overrides?: CallOverrides): Promise<BigNumber>;
    bond(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        bondId: BigNumber;
        vestedUsdToMint: BigNumber;
      }
    >;
    bondMaturity(overrides?: CallOverrides): Promise<BigNumber>;
    calculateBondCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        rdpxRequired: BigNumber;
        alphaTokenRequired: BigNumber;
      }
    >;
    dscReserve(overrides?: CallOverrides): Promise<BigNumber>;
    firstLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    getDscPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getLpPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRdpxPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;
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
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    lpReserve(overrides?: CallOverrides): Promise<BigNumber>;
    rdpxReserve(overrides?: CallOverrides): Promise<BigNumber>;
    redeem(
      _id: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    removeFromContractWhitelist(
      _addr: PromiseOrValue<string>,
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
    secondLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        lpRedeemed: BigNumber;
        alphaTokenRedeemed: BigNumber;
      }
    >;
    setAddresses(
      _addresses: RdpxV2Treasury.AddressesStruct,
      overrides?: CallOverrides
    ): Promise<void>;
    setBondMaturity(
      _bondMaturtity: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;
    upperDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };
  filters: {
    'AddToContractWhitelist(address)'(
      _contract?: PromiseOrValue<string> | null
    ): AddToContractWhitelistEventFilter;
    AddToContractWhitelist(
      _contract?: PromiseOrValue<string> | null
    ): AddToContractWhitelistEventFilter;
    'LogBond(uint256,uint256,uint256)'(
      rdpxPaid?: null,
      alphaTokenPaidd?: null,
      bondId?: null
    ): LogBondEventFilter;
    LogBond(
      rdpxPaid?: null,
      alphaTokenPaidd?: null,
      bondId?: null
    ): LogBondEventFilter;
    'LogRedeem(uint256,uint256)'(
      bondId?: null,
      dscMinted?: null
    ): LogRedeemEventFilter;
    LogRedeem(bondId?: null, dscMinted?: null): LogRedeemEventFilter;
    'LogSetAddresses(tuple)'(addresses?: null): LogSetAddressesEventFilter;
    LogSetAddresses(addresses?: null): LogSetAddressesEventFilter;
    'LogSetBondMaturity(uint256)'(
      bondMaturity?: null
    ): LogSetBondMaturityEventFilter;
    LogSetBondMaturity(bondMaturity?: null): LogSetBondMaturityEventFilter;
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
  };
  estimateGas: {
    ALPHA_TOKEN_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;
    DEFAULT_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;
    DSC_FIRST_LOWER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
    DSC_SECOND_LOWER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
    DSC_UPPER_PEG(overrides?: CallOverrides): Promise<BigNumber>;
    RDPX_RATIO_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;
    addToContractWhitelist(
      _addr: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    addresses(overrides?: CallOverrides): Promise<BigNumber>;
    alphaToken(overrides?: CallOverrides): Promise<BigNumber>;
    alphaTokenReserve(overrides?: CallOverrides): Promise<BigNumber>;
    bond(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    bondMaturity(overrides?: CallOverrides): Promise<BigNumber>;
    calculateBondCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    dscReserve(overrides?: CallOverrides): Promise<BigNumber>;
    firstLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    getDscPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getLpPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRdpxPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
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
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    lpReserve(overrides?: CallOverrides): Promise<BigNumber>;
    rdpxReserve(overrides?: CallOverrides): Promise<BigNumber>;
    redeem(
      _id: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    removeFromContractWhitelist(
      _addr: PromiseOrValue<string>,
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
    secondLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    setAddresses(
      _addresses: RdpxV2Treasury.AddressesStruct,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    setBondMaturity(
      _bondMaturtity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
    upperDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<BigNumber>;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    ALPHA_TOKEN_RATIO_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    DEFAULT_PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    DSC_FIRST_LOWER_PEG(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    DSC_SECOND_LOWER_PEG(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    DSC_UPPER_PEG(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    RDPX_RATIO_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    addToContractWhitelist(
      _addr: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    addresses(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    alphaToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    alphaTokenReserve(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    bond(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    bondMaturity(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    calculateBondCost(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    dscReserve(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    firstLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    getDscPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getLpPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getRdpxPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
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
    isContract(
      addr: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    lpReserve(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    rdpxReserve(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    redeem(
      _id: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    removeFromContractWhitelist(
      _addr: PromiseOrValue<string>,
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
    secondLowerDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    setAddresses(
      _addresses: RdpxV2Treasury.AddressesStruct,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    setBondMaturity(
      _bondMaturtity: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
    upperDepeg(
      _amount: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & {
        from?: PromiseOrValue<string>;
      }
    ): Promise<PopulatedTransaction>;
    whitelistedContracts(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
