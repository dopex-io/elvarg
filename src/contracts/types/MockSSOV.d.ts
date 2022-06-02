/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
import type { TypedEventFilter, TypedEvent, TypedListener } from './common';

interface MockSSOVInterface extends ethers.utils.Interface {
  functions: {
    'counter()': FunctionFragment;
    'currentEpoch()': FunctionFragment;
    'deposit(uint256,uint256,address)': FunctionFragment;
    'deposits(address,uint256)': FunctionFragment;
    'epochStrikes(uint256)': FunctionFragment;
    'getEpochStrikes(uint256)': FunctionFragment;
    'getRewardTokensToDistribute(uint256)': FunctionFragment;
    'lossPercentage()': FunctionFragment;
    'quote()': FunctionFragment;
    'testRewardTokens(uint256)': FunctionFragment;
    'withdraw(uint256)': FunctionFragment;
    'writePosition(uint256)': FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'counter', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'currentEpoch',
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: 'deposit',
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: 'deposits',
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'epochStrikes',
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'getEpochStrikes',
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'getRewardTokensToDistribute',
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'lossPercentage',
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: 'quote', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'testRewardTokens',
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'writePosition',
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: 'counter', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'currentEpoch',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposits', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'epochStrikes',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getEpochStrikes',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getRewardTokensToDistribute',
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: 'lossPercentage',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'quote', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'testRewardTokens',
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'writePosition',
    data: BytesLike
  ): Result;

  events: {};
}

export class MockSSOV extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MockSSOVInterface;

  functions: {
    counter(overrides?: CallOverrides): Promise<[BigNumber]>;

    currentEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      arg0: BigNumberish,
      amount: BigNumberish,
      arg2: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deposits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    epochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getEpochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getRewardTokensToDistribute(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    lossPercentage(overrides?: CallOverrides): Promise<[BigNumber]>;

    quote(overrides?: CallOverrides): Promise<[string]>;

    testRewardTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    withdraw(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    writePosition(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]>;
  };

  counter(overrides?: CallOverrides): Promise<BigNumber>;

  currentEpoch(overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    arg0: BigNumberish,
    amount: BigNumberish,
    arg2: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deposits(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  epochStrikes(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getEpochStrikes(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getRewardTokensToDistribute(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string[]>;

  lossPercentage(overrides?: CallOverrides): Promise<BigNumber>;

  quote(overrides?: CallOverrides): Promise<string>;

  testRewardTokens(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  withdraw(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  writePosition(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]>;

  callStatic: {
    counter(overrides?: CallOverrides): Promise<BigNumber>;

    currentEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      arg0: BigNumberish,
      amount: BigNumberish,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    epochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getEpochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getRewardTokensToDistribute(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string[]>;

    lossPercentage(overrides?: CallOverrides): Promise<BigNumber>;

    quote(overrides?: CallOverrides): Promise<string>;

    testRewardTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    withdraw(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber[]]>;

    writePosition(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    counter(overrides?: CallOverrides): Promise<BigNumber>;

    currentEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      arg0: BigNumberish,
      amount: BigNumberish,
      arg2: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deposits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    epochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getEpochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRewardTokensToDistribute(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lossPercentage(overrides?: CallOverrides): Promise<BigNumber>;

    quote(overrides?: CallOverrides): Promise<BigNumber>;

    testRewardTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    writePosition(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    counter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      arg0: BigNumberish,
      amount: BigNumberish,
      arg2: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deposits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    epochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getEpochStrikes(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRewardTokensToDistribute(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lossPercentage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    quote(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    testRewardTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    writePosition(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
