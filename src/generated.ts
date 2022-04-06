import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type DelegateClaim = {
  __typename?: 'DelegateClaim';
  id: Scalars['ID'];
  optionContractId: Scalars['String'];
  pnl: Scalars['BigInt'];
  sender: Scalars['String'];
  user: User;
};

export type DelegateClaim_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  optionContractId?: InputMaybe<Scalars['String']>;
  optionContractId_contains?: InputMaybe<Scalars['String']>;
  optionContractId_ends_with?: InputMaybe<Scalars['String']>;
  optionContractId_gt?: InputMaybe<Scalars['String']>;
  optionContractId_gte?: InputMaybe<Scalars['String']>;
  optionContractId_in?: InputMaybe<Array<Scalars['String']>>;
  optionContractId_lt?: InputMaybe<Scalars['String']>;
  optionContractId_lte?: InputMaybe<Scalars['String']>;
  optionContractId_not?: InputMaybe<Scalars['String']>;
  optionContractId_not_contains?: InputMaybe<Scalars['String']>;
  optionContractId_not_ends_with?: InputMaybe<Scalars['String']>;
  optionContractId_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionContractId_not_starts_with?: InputMaybe<Scalars['String']>;
  optionContractId_starts_with?: InputMaybe<Scalars['String']>;
  pnl?: InputMaybe<Scalars['BigInt']>;
  pnl_gt?: InputMaybe<Scalars['BigInt']>;
  pnl_gte?: InputMaybe<Scalars['BigInt']>;
  pnl_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pnl_lt?: InputMaybe<Scalars['BigInt']>;
  pnl_lte?: InputMaybe<Scalars['BigInt']>;
  pnl_not?: InputMaybe<Scalars['BigInt']>;
  pnl_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  sender?: InputMaybe<Scalars['String']>;
  sender_contains?: InputMaybe<Scalars['String']>;
  sender_ends_with?: InputMaybe<Scalars['String']>;
  sender_gt?: InputMaybe<Scalars['String']>;
  sender_gte?: InputMaybe<Scalars['String']>;
  sender_in?: InputMaybe<Array<Scalars['String']>>;
  sender_lt?: InputMaybe<Scalars['String']>;
  sender_lte?: InputMaybe<Scalars['String']>;
  sender_not?: InputMaybe<Scalars['String']>;
  sender_not_contains?: InputMaybe<Scalars['String']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']>;
  sender_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum DelegateClaim_OrderBy {
  Id = 'id',
  OptionContractId = 'optionContractId',
  Pnl = 'pnl',
  Sender = 'sender',
  User = 'user'
}

export type OptionContractMapping = {
  __typename?: 'OptionContractMapping';
  address: Scalars['String'];
  id: Scalars['ID'];
};

export type OptionContractMapping_Filter = {
  address?: InputMaybe<Scalars['String']>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_ends_with?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_ends_with?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']>;
  address_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum OptionContractMapping_OrderBy {
  Address = 'address',
  Id = 'id'
}

export type OptionExercise = {
  __typename?: 'OptionExercise';
  amount: Scalars['BigInt'];
  expiry: Scalars['BigInt'];
  fee: Scalars['BigInt'];
  id: Scalars['ID'];
  isPut: Scalars['Boolean'];
  optionPoolAddress: Scalars['String'];
  pnl: Scalars['BigInt'];
  strike: Scalars['BigInt'];
  transaction: Transaction;
  user: User;
};

export type OptionExercise_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiry?: InputMaybe<Scalars['BigInt']>;
  expiry_gt?: InputMaybe<Scalars['BigInt']>;
  expiry_gte?: InputMaybe<Scalars['BigInt']>;
  expiry_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiry_lt?: InputMaybe<Scalars['BigInt']>;
  expiry_lte?: InputMaybe<Scalars['BigInt']>;
  expiry_not?: InputMaybe<Scalars['BigInt']>;
  expiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPut?: InputMaybe<Scalars['Boolean']>;
  isPut_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPut_not?: InputMaybe<Scalars['Boolean']>;
  isPut_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  optionPoolAddress?: InputMaybe<Scalars['String']>;
  optionPoolAddress_contains?: InputMaybe<Scalars['String']>;
  optionPoolAddress_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_gt?: InputMaybe<Scalars['String']>;
  optionPoolAddress_gte?: InputMaybe<Scalars['String']>;
  optionPoolAddress_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolAddress_lt?: InputMaybe<Scalars['String']>;
  optionPoolAddress_lte?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_contains?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_starts_with?: InputMaybe<Scalars['String']>;
  pnl?: InputMaybe<Scalars['BigInt']>;
  pnl_gt?: InputMaybe<Scalars['BigInt']>;
  pnl_gte?: InputMaybe<Scalars['BigInt']>;
  pnl_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pnl_lt?: InputMaybe<Scalars['BigInt']>;
  pnl_lte?: InputMaybe<Scalars['BigInt']>;
  pnl_not?: InputMaybe<Scalars['BigInt']>;
  pnl_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  strike?: InputMaybe<Scalars['BigInt']>;
  strike_gt?: InputMaybe<Scalars['BigInt']>;
  strike_gte?: InputMaybe<Scalars['BigInt']>;
  strike_in?: InputMaybe<Array<Scalars['BigInt']>>;
  strike_lt?: InputMaybe<Scalars['BigInt']>;
  strike_lte?: InputMaybe<Scalars['BigInt']>;
  strike_not?: InputMaybe<Scalars['BigInt']>;
  strike_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum OptionExercise_OrderBy {
  Amount = 'amount',
  Expiry = 'expiry',
  Fee = 'fee',
  Id = 'id',
  IsPut = 'isPut',
  OptionPoolAddress = 'optionPoolAddress',
  Pnl = 'pnl',
  Strike = 'strike',
  Transaction = 'transaction',
  User = 'user'
}

export type OptionPool = {
  __typename?: 'OptionPool';
  baseAsset: Scalars['Bytes'];
  id: Scalars['ID'];
  optionPoolFactoryId: OptionPoolFactory;
  optionPoolId: Scalars['Bytes'];
  optionsContracts: Array<OptionsContract>;
  quoteAsset: Scalars['Bytes'];
};


export type OptionPoolOptionsContractsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionsContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionsContract_Filter>;
};

export type OptionPoolFactory = {
  __typename?: 'OptionPoolFactory';
  id: Scalars['ID'];
  optionPools: Array<OptionPool>;
};


export type OptionPoolFactoryOptionPoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionPool_Filter>;
};

export type OptionPoolFactory_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum OptionPoolFactory_OrderBy {
  Id = 'id',
  OptionPools = 'optionPools'
}

export type OptionPool_Filter = {
  baseAsset?: InputMaybe<Scalars['Bytes']>;
  baseAsset_contains?: InputMaybe<Scalars['Bytes']>;
  baseAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
  baseAsset_not?: InputMaybe<Scalars['Bytes']>;
  baseAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
  baseAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  optionPoolFactoryId?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_contains?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_gt?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_gte?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolFactoryId_lt?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_lte?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_not?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_not_contains?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolFactoryId_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPoolFactoryId_starts_with?: InputMaybe<Scalars['String']>;
  optionPoolId?: InputMaybe<Scalars['Bytes']>;
  optionPoolId_contains?: InputMaybe<Scalars['Bytes']>;
  optionPoolId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  optionPoolId_not?: InputMaybe<Scalars['Bytes']>;
  optionPoolId_not_contains?: InputMaybe<Scalars['Bytes']>;
  optionPoolId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  quoteAsset?: InputMaybe<Scalars['Bytes']>;
  quoteAsset_contains?: InputMaybe<Scalars['Bytes']>;
  quoteAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
  quoteAsset_not?: InputMaybe<Scalars['Bytes']>;
  quoteAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
  quoteAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OptionPool_OrderBy {
  BaseAsset = 'baseAsset',
  Id = 'id',
  OptionPoolFactoryId = 'optionPoolFactoryId',
  OptionPoolId = 'optionPoolId',
  OptionsContracts = 'optionsContracts',
  QuoteAsset = 'quoteAsset'
}

export type OptionPurchase = {
  __typename?: 'OptionPurchase';
  amount: Scalars['BigInt'];
  expiry: Scalars['BigInt'];
  fee: Scalars['BigInt'];
  id: Scalars['ID'];
  isPut: Scalars['Boolean'];
  optionPoolAddress: Scalars['String'];
  premium: Scalars['BigInt'];
  strike: Scalars['BigInt'];
  transaction: Transaction;
  user: User;
};

export type OptionPurchase_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiry?: InputMaybe<Scalars['BigInt']>;
  expiry_gt?: InputMaybe<Scalars['BigInt']>;
  expiry_gte?: InputMaybe<Scalars['BigInt']>;
  expiry_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiry_lt?: InputMaybe<Scalars['BigInt']>;
  expiry_lte?: InputMaybe<Scalars['BigInt']>;
  expiry_not?: InputMaybe<Scalars['BigInt']>;
  expiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPut?: InputMaybe<Scalars['Boolean']>;
  isPut_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPut_not?: InputMaybe<Scalars['Boolean']>;
  isPut_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  optionPoolAddress?: InputMaybe<Scalars['String']>;
  optionPoolAddress_contains?: InputMaybe<Scalars['String']>;
  optionPoolAddress_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_gt?: InputMaybe<Scalars['String']>;
  optionPoolAddress_gte?: InputMaybe<Scalars['String']>;
  optionPoolAddress_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolAddress_lt?: InputMaybe<Scalars['String']>;
  optionPoolAddress_lte?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_contains?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_starts_with?: InputMaybe<Scalars['String']>;
  premium?: InputMaybe<Scalars['BigInt']>;
  premium_gt?: InputMaybe<Scalars['BigInt']>;
  premium_gte?: InputMaybe<Scalars['BigInt']>;
  premium_in?: InputMaybe<Array<Scalars['BigInt']>>;
  premium_lt?: InputMaybe<Scalars['BigInt']>;
  premium_lte?: InputMaybe<Scalars['BigInt']>;
  premium_not?: InputMaybe<Scalars['BigInt']>;
  premium_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  strike?: InputMaybe<Scalars['BigInt']>;
  strike_gt?: InputMaybe<Scalars['BigInt']>;
  strike_gte?: InputMaybe<Scalars['BigInt']>;
  strike_in?: InputMaybe<Array<Scalars['BigInt']>>;
  strike_lt?: InputMaybe<Scalars['BigInt']>;
  strike_lte?: InputMaybe<Scalars['BigInt']>;
  strike_not?: InputMaybe<Scalars['BigInt']>;
  strike_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum OptionPurchase_OrderBy {
  Amount = 'amount',
  Expiry = 'expiry',
  Fee = 'fee',
  Id = 'id',
  IsPut = 'isPut',
  OptionPoolAddress = 'optionPoolAddress',
  Premium = 'premium',
  Strike = 'strike',
  Transaction = 'transaction',
  User = 'user'
}

export type OptionSwap = {
  __typename?: 'OptionSwap';
  fee: Scalars['BigInt'];
  id: Scalars['ID'];
  isPut: Scalars['Boolean'];
  newAmount: Scalars['BigInt'];
  newExpiry: Scalars['BigInt'];
  newStrike: Scalars['BigInt'];
  oldAmount: Scalars['BigInt'];
  oldExpiry: Scalars['BigInt'];
  oldStrike: Scalars['BigInt'];
  optionPoolAddress: Scalars['String'];
  transaction: Transaction;
  user: User;
};

export type OptionSwap_Filter = {
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPut?: InputMaybe<Scalars['Boolean']>;
  isPut_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPut_not?: InputMaybe<Scalars['Boolean']>;
  isPut_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  newAmount?: InputMaybe<Scalars['BigInt']>;
  newAmount_gt?: InputMaybe<Scalars['BigInt']>;
  newAmount_gte?: InputMaybe<Scalars['BigInt']>;
  newAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newAmount_lt?: InputMaybe<Scalars['BigInt']>;
  newAmount_lte?: InputMaybe<Scalars['BigInt']>;
  newAmount_not?: InputMaybe<Scalars['BigInt']>;
  newAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newExpiry?: InputMaybe<Scalars['BigInt']>;
  newExpiry_gt?: InputMaybe<Scalars['BigInt']>;
  newExpiry_gte?: InputMaybe<Scalars['BigInt']>;
  newExpiry_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newExpiry_lt?: InputMaybe<Scalars['BigInt']>;
  newExpiry_lte?: InputMaybe<Scalars['BigInt']>;
  newExpiry_not?: InputMaybe<Scalars['BigInt']>;
  newExpiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newStrike?: InputMaybe<Scalars['BigInt']>;
  newStrike_gt?: InputMaybe<Scalars['BigInt']>;
  newStrike_gte?: InputMaybe<Scalars['BigInt']>;
  newStrike_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newStrike_lt?: InputMaybe<Scalars['BigInt']>;
  newStrike_lte?: InputMaybe<Scalars['BigInt']>;
  newStrike_not?: InputMaybe<Scalars['BigInt']>;
  newStrike_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldAmount?: InputMaybe<Scalars['BigInt']>;
  oldAmount_gt?: InputMaybe<Scalars['BigInt']>;
  oldAmount_gte?: InputMaybe<Scalars['BigInt']>;
  oldAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldAmount_lt?: InputMaybe<Scalars['BigInt']>;
  oldAmount_lte?: InputMaybe<Scalars['BigInt']>;
  oldAmount_not?: InputMaybe<Scalars['BigInt']>;
  oldAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldExpiry?: InputMaybe<Scalars['BigInt']>;
  oldExpiry_gt?: InputMaybe<Scalars['BigInt']>;
  oldExpiry_gte?: InputMaybe<Scalars['BigInt']>;
  oldExpiry_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldExpiry_lt?: InputMaybe<Scalars['BigInt']>;
  oldExpiry_lte?: InputMaybe<Scalars['BigInt']>;
  oldExpiry_not?: InputMaybe<Scalars['BigInt']>;
  oldExpiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldStrike?: InputMaybe<Scalars['BigInt']>;
  oldStrike_gt?: InputMaybe<Scalars['BigInt']>;
  oldStrike_gte?: InputMaybe<Scalars['BigInt']>;
  oldStrike_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oldStrike_lt?: InputMaybe<Scalars['BigInt']>;
  oldStrike_lte?: InputMaybe<Scalars['BigInt']>;
  oldStrike_not?: InputMaybe<Scalars['BigInt']>;
  oldStrike_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  optionPoolAddress?: InputMaybe<Scalars['String']>;
  optionPoolAddress_contains?: InputMaybe<Scalars['String']>;
  optionPoolAddress_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_gt?: InputMaybe<Scalars['String']>;
  optionPoolAddress_gte?: InputMaybe<Scalars['String']>;
  optionPoolAddress_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolAddress_lt?: InputMaybe<Scalars['String']>;
  optionPoolAddress_lte?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_contains?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPoolAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPoolAddress_starts_with?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum OptionSwap_OrderBy {
  Fee = 'fee',
  Id = 'id',
  IsPut = 'isPut',
  NewAmount = 'newAmount',
  NewExpiry = 'newExpiry',
  NewStrike = 'newStrike',
  OldAmount = 'oldAmount',
  OldExpiry = 'oldExpiry',
  OldStrike = 'oldStrike',
  OptionPoolAddress = 'optionPoolAddress',
  Transaction = 'transaction',
  User = 'user'
}

export type OptionsContract = {
  __typename?: 'OptionsContract';
  epoch: Scalars['BigInt'];
  expiry: Scalars['BigInt'];
  id: Scalars['ID'];
  isPut: Scalars['Boolean'];
  optionPool: OptionPool;
  optionsContractId: Scalars['Bytes'];
  strike: Scalars['BigInt'];
};

export type OptionsContract_Filter = {
  epoch?: InputMaybe<Scalars['BigInt']>;
  epoch_gt?: InputMaybe<Scalars['BigInt']>;
  epoch_gte?: InputMaybe<Scalars['BigInt']>;
  epoch_in?: InputMaybe<Array<Scalars['BigInt']>>;
  epoch_lt?: InputMaybe<Scalars['BigInt']>;
  epoch_lte?: InputMaybe<Scalars['BigInt']>;
  epoch_not?: InputMaybe<Scalars['BigInt']>;
  epoch_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiry?: InputMaybe<Scalars['BigInt']>;
  expiry_gt?: InputMaybe<Scalars['BigInt']>;
  expiry_gte?: InputMaybe<Scalars['BigInt']>;
  expiry_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expiry_lt?: InputMaybe<Scalars['BigInt']>;
  expiry_lte?: InputMaybe<Scalars['BigInt']>;
  expiry_not?: InputMaybe<Scalars['BigInt']>;
  expiry_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPut?: InputMaybe<Scalars['Boolean']>;
  isPut_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPut_not?: InputMaybe<Scalars['Boolean']>;
  isPut_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  optionPool?: InputMaybe<Scalars['String']>;
  optionPool_contains?: InputMaybe<Scalars['String']>;
  optionPool_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_gt?: InputMaybe<Scalars['String']>;
  optionPool_gte?: InputMaybe<Scalars['String']>;
  optionPool_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_lt?: InputMaybe<Scalars['String']>;
  optionPool_lte?: InputMaybe<Scalars['String']>;
  optionPool_not?: InputMaybe<Scalars['String']>;
  optionPool_not_contains?: InputMaybe<Scalars['String']>;
  optionPool_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPool_starts_with?: InputMaybe<Scalars['String']>;
  optionsContractId?: InputMaybe<Scalars['Bytes']>;
  optionsContractId_contains?: InputMaybe<Scalars['Bytes']>;
  optionsContractId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  optionsContractId_not?: InputMaybe<Scalars['Bytes']>;
  optionsContractId_not_contains?: InputMaybe<Scalars['Bytes']>;
  optionsContractId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  strike?: InputMaybe<Scalars['BigInt']>;
  strike_gt?: InputMaybe<Scalars['BigInt']>;
  strike_gte?: InputMaybe<Scalars['BigInt']>;
  strike_in?: InputMaybe<Array<Scalars['BigInt']>>;
  strike_lt?: InputMaybe<Scalars['BigInt']>;
  strike_lte?: InputMaybe<Scalars['BigInt']>;
  strike_not?: InputMaybe<Scalars['BigInt']>;
  strike_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum OptionsContract_OrderBy {
  Epoch = 'epoch',
  Expiry = 'expiry',
  Id = 'id',
  IsPut = 'isPut',
  OptionPool = 'optionPool',
  OptionsContractId = 'optionsContractId',
  Strike = 'strike'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegateClaim?: Maybe<DelegateClaim>;
  delegateClaims: Array<DelegateClaim>;
  optionContractMapping?: Maybe<OptionContractMapping>;
  optionContractMappings: Array<OptionContractMapping>;
  optionExercise?: Maybe<OptionExercise>;
  optionExercises: Array<OptionExercise>;
  optionPool?: Maybe<OptionPool>;
  optionPoolFactories: Array<OptionPoolFactory>;
  optionPoolFactory?: Maybe<OptionPoolFactory>;
  optionPools: Array<OptionPool>;
  optionPurchase?: Maybe<OptionPurchase>;
  optionPurchases: Array<OptionPurchase>;
  optionSwap?: Maybe<OptionSwap>;
  optionSwaps: Array<OptionSwap>;
  optionsContract?: Maybe<OptionsContract>;
  optionsContracts: Array<OptionsContract>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userBalance?: Maybe<UserBalance>;
  userBalances: Array<UserBalance>;
  userCallReward?: Maybe<UserCallReward>;
  userCallRewards: Array<UserCallReward>;
  userOptionPoolReward?: Maybe<UserOptionPoolReward>;
  userOptionPoolRewards: Array<UserOptionPoolReward>;
  userReward?: Maybe<UserReward>;
  userRewards: Array<UserReward>;
  userTradeStat?: Maybe<UserTradeStat>;
  userTradeStats: Array<UserTradeStat>;
  userVolPoolReward?: Maybe<UserVolPoolReward>;
  userVolPoolRewards: Array<UserVolPoolReward>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryDelegateClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegateClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateClaim_Filter>;
};


export type QueryOptionContractMappingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionContractMappingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionContractMapping_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionContractMapping_Filter>;
};


export type QueryOptionExerciseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionExercisesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionExercise_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionExercise_Filter>;
};


export type QueryOptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionPoolFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPoolFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionPoolFactory_Filter>;
};


export type QueryOptionPoolFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionPool_Filter>;
};


export type QueryOptionPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionPurchase_Filter>;
};


export type QueryOptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionSwap_Filter>;
};


export type QueryOptionsContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOptionsContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionsContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionsContract_Filter>;
};


export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserBalance_Filter>;
};


export type QueryUserCallRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserCallRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserCallReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserCallReward_Filter>;
};


export type QueryUserOptionPoolRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserOptionPoolRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserOptionPoolReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserOptionPoolReward_Filter>;
};


export type QueryUserRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserReward_Filter>;
};


export type QueryUserTradeStatArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserTradeStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTradeStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserTradeStat_Filter>;
};


export type QueryUserVolPoolRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserVolPoolRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserVolPoolReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserVolPoolReward_Filter>;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  delegateClaim?: Maybe<DelegateClaim>;
  delegateClaims: Array<DelegateClaim>;
  optionContractMapping?: Maybe<OptionContractMapping>;
  optionContractMappings: Array<OptionContractMapping>;
  optionExercise?: Maybe<OptionExercise>;
  optionExercises: Array<OptionExercise>;
  optionPool?: Maybe<OptionPool>;
  optionPoolFactories: Array<OptionPoolFactory>;
  optionPoolFactory?: Maybe<OptionPoolFactory>;
  optionPools: Array<OptionPool>;
  optionPurchase?: Maybe<OptionPurchase>;
  optionPurchases: Array<OptionPurchase>;
  optionSwap?: Maybe<OptionSwap>;
  optionSwaps: Array<OptionSwap>;
  optionsContract?: Maybe<OptionsContract>;
  optionsContracts: Array<OptionsContract>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userBalance?: Maybe<UserBalance>;
  userBalances: Array<UserBalance>;
  userCallReward?: Maybe<UserCallReward>;
  userCallRewards: Array<UserCallReward>;
  userOptionPoolReward?: Maybe<UserOptionPoolReward>;
  userOptionPoolRewards: Array<UserOptionPoolReward>;
  userReward?: Maybe<UserReward>;
  userRewards: Array<UserReward>;
  userTradeStat?: Maybe<UserTradeStat>;
  userTradeStats: Array<UserTradeStat>;
  userVolPoolReward?: Maybe<UserVolPoolReward>;
  userVolPoolRewards: Array<UserVolPoolReward>;
  users: Array<User>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionDelegateClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegateClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateClaim_Filter>;
};


export type SubscriptionOptionContractMappingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionContractMappingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionContractMapping_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionContractMapping_Filter>;
};


export type SubscriptionOptionExerciseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionExercisesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionExercise_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionExercise_Filter>;
};


export type SubscriptionOptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionPoolFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPoolFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionPoolFactory_Filter>;
};


export type SubscriptionOptionPoolFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionPool_Filter>;
};


export type SubscriptionOptionPurchaseArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionPurchasesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionPurchase_Filter>;
};


export type SubscriptionOptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionSwap_Filter>;
};


export type SubscriptionOptionsContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOptionsContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionsContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OptionsContract_Filter>;
};


export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserBalance_Filter>;
};


export type SubscriptionUserCallRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserCallRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserCallReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserCallReward_Filter>;
};


export type SubscriptionUserOptionPoolRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserOptionPoolRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserOptionPoolReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserOptionPoolReward_Filter>;
};


export type SubscriptionUserRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserReward_Filter>;
};


export type SubscriptionUserTradeStatArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserTradeStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTradeStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserTradeStat_Filter>;
};


export type SubscriptionUserVolPoolRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserVolPoolRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserVolPoolReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserVolPoolReward_Filter>;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt'];
  exercises: Array<OptionExercise>;
  gasPrice: Scalars['BigInt'];
  id: Scalars['ID'];
  purchases: Array<OptionPurchase>;
  swaps: Array<OptionSwap>;
  timestamp: Scalars['BigInt'];
};


export type TransactionExercisesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionExercise_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionExercise_Filter>;
};


export type TransactionPurchasesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionPurchase_Filter>;
};


export type TransactionSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionSwap_Filter>;
};

export type Transaction_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  Exercises = 'exercises',
  GasPrice = 'gasPrice',
  Id = 'id',
  Purchases = 'purchases',
  Swaps = 'swaps',
  Timestamp = 'timestamp'
}

export type User = {
  __typename?: 'User';
  balance: Array<UserBalance>;
  callReward: Array<UserCallReward>;
  id: Scalars['ID'];
  optionPoolReward: Array<UserOptionPoolReward>;
  optionsExercised: Array<OptionExercise>;
  optionsPurchased: Array<OptionPurchase>;
  optionsSwaped: Array<OptionSwap>;
  rewards: UserReward;
  userTradeStats: Array<UserTradeStat>;
  volumePoolReward: Array<UserVolPoolReward>;
};


export type UserBalanceArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserBalance_Filter>;
};


export type UserCallRewardArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserCallReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserCallReward_Filter>;
};


export type UserOptionPoolRewardArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserOptionPoolReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserOptionPoolReward_Filter>;
};


export type UserOptionsExercisedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionExercise_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionExercise_Filter>;
};


export type UserOptionsPurchasedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionPurchase_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionPurchase_Filter>;
};


export type UserOptionsSwapedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OptionSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OptionSwap_Filter>;
};


export type UserUserTradeStatsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTradeStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserTradeStat_Filter>;
};


export type UserVolumePoolRewardArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserVolPoolReward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserVolPoolReward_Filter>;
};

export type UserBalance = {
  __typename?: 'UserBalance';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  optionsContract: OptionsContract;
  user: User;
};

export type UserBalance_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  optionsContract?: InputMaybe<Scalars['String']>;
  optionsContract_contains?: InputMaybe<Scalars['String']>;
  optionsContract_ends_with?: InputMaybe<Scalars['String']>;
  optionsContract_gt?: InputMaybe<Scalars['String']>;
  optionsContract_gte?: InputMaybe<Scalars['String']>;
  optionsContract_in?: InputMaybe<Array<Scalars['String']>>;
  optionsContract_lt?: InputMaybe<Scalars['String']>;
  optionsContract_lte?: InputMaybe<Scalars['String']>;
  optionsContract_not?: InputMaybe<Scalars['String']>;
  optionsContract_not_contains?: InputMaybe<Scalars['String']>;
  optionsContract_not_ends_with?: InputMaybe<Scalars['String']>;
  optionsContract_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionsContract_not_starts_with?: InputMaybe<Scalars['String']>;
  optionsContract_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserBalance_OrderBy {
  Amount = 'amount',
  Id = 'id',
  OptionsContract = 'optionsContract',
  User = 'user'
}

export type UserCallReward = {
  __typename?: 'UserCallReward';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  optionPool: OptionPool;
  poolEpoch: Scalars['BigInt'];
  rewardKey: Scalars['Bytes'];
  transaction: Transaction;
  user: User;
};

export type UserCallReward_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  optionPool?: InputMaybe<Scalars['String']>;
  optionPool_contains?: InputMaybe<Scalars['String']>;
  optionPool_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_gt?: InputMaybe<Scalars['String']>;
  optionPool_gte?: InputMaybe<Scalars['String']>;
  optionPool_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_lt?: InputMaybe<Scalars['String']>;
  optionPool_lte?: InputMaybe<Scalars['String']>;
  optionPool_not?: InputMaybe<Scalars['String']>;
  optionPool_not_contains?: InputMaybe<Scalars['String']>;
  optionPool_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPool_starts_with?: InputMaybe<Scalars['String']>;
  poolEpoch?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_gt?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_gte?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolEpoch_lt?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_lte?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_not?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardKey?: InputMaybe<Scalars['Bytes']>;
  rewardKey_contains?: InputMaybe<Scalars['Bytes']>;
  rewardKey_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rewardKey_not?: InputMaybe<Scalars['Bytes']>;
  rewardKey_not_contains?: InputMaybe<Scalars['Bytes']>;
  rewardKey_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserCallReward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  OptionPool = 'optionPool',
  PoolEpoch = 'poolEpoch',
  RewardKey = 'rewardKey',
  Transaction = 'transaction',
  User = 'user'
}

export type UserOptionPoolReward = {
  __typename?: 'UserOptionPoolReward';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  optionPool: OptionPool;
  poolEpoch: Scalars['BigInt'];
  transaction: Transaction;
  user: User;
};

export type UserOptionPoolReward_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  optionPool?: InputMaybe<Scalars['String']>;
  optionPool_contains?: InputMaybe<Scalars['String']>;
  optionPool_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_gt?: InputMaybe<Scalars['String']>;
  optionPool_gte?: InputMaybe<Scalars['String']>;
  optionPool_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_lt?: InputMaybe<Scalars['String']>;
  optionPool_lte?: InputMaybe<Scalars['String']>;
  optionPool_not?: InputMaybe<Scalars['String']>;
  optionPool_not_contains?: InputMaybe<Scalars['String']>;
  optionPool_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPool_starts_with?: InputMaybe<Scalars['String']>;
  poolEpoch?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_gt?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_gte?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolEpoch_lt?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_lte?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_not?: InputMaybe<Scalars['BigInt']>;
  poolEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserOptionPoolReward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  OptionPool = 'optionPool',
  PoolEpoch = 'poolEpoch',
  Transaction = 'transaction',
  User = 'user'
}

export type UserReward = {
  __typename?: 'UserReward';
  id: Scalars['ID'];
  totalCallRewards: Scalars['BigInt'];
  totalOptionPoolRewards: Scalars['BigInt'];
  totalVolumePoolRewards: Scalars['BigInt'];
  user: User;
};

export type UserReward_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalCallRewards?: InputMaybe<Scalars['BigInt']>;
  totalCallRewards_gt?: InputMaybe<Scalars['BigInt']>;
  totalCallRewards_gte?: InputMaybe<Scalars['BigInt']>;
  totalCallRewards_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalCallRewards_lt?: InputMaybe<Scalars['BigInt']>;
  totalCallRewards_lte?: InputMaybe<Scalars['BigInt']>;
  totalCallRewards_not?: InputMaybe<Scalars['BigInt']>;
  totalCallRewards_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalOptionPoolRewards?: InputMaybe<Scalars['BigInt']>;
  totalOptionPoolRewards_gt?: InputMaybe<Scalars['BigInt']>;
  totalOptionPoolRewards_gte?: InputMaybe<Scalars['BigInt']>;
  totalOptionPoolRewards_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalOptionPoolRewards_lt?: InputMaybe<Scalars['BigInt']>;
  totalOptionPoolRewards_lte?: InputMaybe<Scalars['BigInt']>;
  totalOptionPoolRewards_not?: InputMaybe<Scalars['BigInt']>;
  totalOptionPoolRewards_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVolumePoolRewards?: InputMaybe<Scalars['BigInt']>;
  totalVolumePoolRewards_gt?: InputMaybe<Scalars['BigInt']>;
  totalVolumePoolRewards_gte?: InputMaybe<Scalars['BigInt']>;
  totalVolumePoolRewards_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVolumePoolRewards_lt?: InputMaybe<Scalars['BigInt']>;
  totalVolumePoolRewards_lte?: InputMaybe<Scalars['BigInt']>;
  totalVolumePoolRewards_not?: InputMaybe<Scalars['BigInt']>;
  totalVolumePoolRewards_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserReward_OrderBy {
  Id = 'id',
  TotalCallRewards = 'totalCallRewards',
  TotalOptionPoolRewards = 'totalOptionPoolRewards',
  TotalVolumePoolRewards = 'totalVolumePoolRewards',
  User = 'user'
}

export type UserTradeStat = {
  __typename?: 'UserTradeStat';
  id: Scalars['ID'];
  optionPool: OptionPool;
  totalCallPnl: Scalars['BigInt'];
  totalFees: Scalars['BigInt'];
  totalPremium: Scalars['BigInt'];
  totalPutPnl: Scalars['BigInt'];
  user: User;
};

export type UserTradeStat_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  optionPool?: InputMaybe<Scalars['String']>;
  optionPool_contains?: InputMaybe<Scalars['String']>;
  optionPool_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_gt?: InputMaybe<Scalars['String']>;
  optionPool_gte?: InputMaybe<Scalars['String']>;
  optionPool_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_lt?: InputMaybe<Scalars['String']>;
  optionPool_lte?: InputMaybe<Scalars['String']>;
  optionPool_not?: InputMaybe<Scalars['String']>;
  optionPool_not_contains?: InputMaybe<Scalars['String']>;
  optionPool_not_ends_with?: InputMaybe<Scalars['String']>;
  optionPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: InputMaybe<Scalars['String']>;
  optionPool_starts_with?: InputMaybe<Scalars['String']>;
  totalCallPnl?: InputMaybe<Scalars['BigInt']>;
  totalCallPnl_gt?: InputMaybe<Scalars['BigInt']>;
  totalCallPnl_gte?: InputMaybe<Scalars['BigInt']>;
  totalCallPnl_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalCallPnl_lt?: InputMaybe<Scalars['BigInt']>;
  totalCallPnl_lte?: InputMaybe<Scalars['BigInt']>;
  totalCallPnl_not?: InputMaybe<Scalars['BigInt']>;
  totalCallPnl_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalFees?: InputMaybe<Scalars['BigInt']>;
  totalFees_gt?: InputMaybe<Scalars['BigInt']>;
  totalFees_gte?: InputMaybe<Scalars['BigInt']>;
  totalFees_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalFees_lt?: InputMaybe<Scalars['BigInt']>;
  totalFees_lte?: InputMaybe<Scalars['BigInt']>;
  totalFees_not?: InputMaybe<Scalars['BigInt']>;
  totalFees_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPremium?: InputMaybe<Scalars['BigInt']>;
  totalPremium_gt?: InputMaybe<Scalars['BigInt']>;
  totalPremium_gte?: InputMaybe<Scalars['BigInt']>;
  totalPremium_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPremium_lt?: InputMaybe<Scalars['BigInt']>;
  totalPremium_lte?: InputMaybe<Scalars['BigInt']>;
  totalPremium_not?: InputMaybe<Scalars['BigInt']>;
  totalPremium_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPutPnl?: InputMaybe<Scalars['BigInt']>;
  totalPutPnl_gt?: InputMaybe<Scalars['BigInt']>;
  totalPutPnl_gte?: InputMaybe<Scalars['BigInt']>;
  totalPutPnl_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPutPnl_lt?: InputMaybe<Scalars['BigInt']>;
  totalPutPnl_lte?: InputMaybe<Scalars['BigInt']>;
  totalPutPnl_not?: InputMaybe<Scalars['BigInt']>;
  totalPutPnl_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserTradeStat_OrderBy {
  Id = 'id',
  OptionPool = 'optionPool',
  TotalCallPnl = 'totalCallPnl',
  TotalFees = 'totalFees',
  TotalPremium = 'totalPremium',
  TotalPutPnl = 'totalPutPnl',
  User = 'user'
}

export type UserVolPoolReward = {
  __typename?: 'UserVolPoolReward';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  transaction: Transaction;
  user: User;
  volumePool: Scalars['String'];
  weeklyEpoch: Scalars['BigInt'];
};

export type UserVolPoolReward_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  volumePool?: InputMaybe<Scalars['String']>;
  volumePool_contains?: InputMaybe<Scalars['String']>;
  volumePool_ends_with?: InputMaybe<Scalars['String']>;
  volumePool_gt?: InputMaybe<Scalars['String']>;
  volumePool_gte?: InputMaybe<Scalars['String']>;
  volumePool_in?: InputMaybe<Array<Scalars['String']>>;
  volumePool_lt?: InputMaybe<Scalars['String']>;
  volumePool_lte?: InputMaybe<Scalars['String']>;
  volumePool_not?: InputMaybe<Scalars['String']>;
  volumePool_not_contains?: InputMaybe<Scalars['String']>;
  volumePool_not_ends_with?: InputMaybe<Scalars['String']>;
  volumePool_not_in?: InputMaybe<Array<Scalars['String']>>;
  volumePool_not_starts_with?: InputMaybe<Scalars['String']>;
  volumePool_starts_with?: InputMaybe<Scalars['String']>;
  weeklyEpoch?: InputMaybe<Scalars['BigInt']>;
  weeklyEpoch_gt?: InputMaybe<Scalars['BigInt']>;
  weeklyEpoch_gte?: InputMaybe<Scalars['BigInt']>;
  weeklyEpoch_in?: InputMaybe<Array<Scalars['BigInt']>>;
  weeklyEpoch_lt?: InputMaybe<Scalars['BigInt']>;
  weeklyEpoch_lte?: InputMaybe<Scalars['BigInt']>;
  weeklyEpoch_not?: InputMaybe<Scalars['BigInt']>;
  weeklyEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum UserVolPoolReward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Transaction = 'transaction',
  User = 'user',
  VolumePool = 'volumePool',
  WeeklyEpoch = 'weeklyEpoch'
}

export type User_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
  Balance = 'balance',
  CallReward = 'callReward',
  Id = 'id',
  OptionPoolReward = 'optionPoolReward',
  OptionsExercised = 'optionsExercised',
  OptionsPurchased = 'optionsPurchased',
  OptionsSwaped = 'optionsSwaped',
  Rewards = 'rewards',
  UserTradeStats = 'userTradeStats',
  VolumePoolReward = 'volumePoolReward'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetLeaderboardDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLeaderboardDataQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, userTradeStats: Array<{ __typename?: 'UserTradeStat', totalPremium: string, totalPutPnl: string, totalCallPnl: string, totalFees: string, optionPool: { __typename?: 'OptionPool', id: string } }> }> };

export type GetOptionsContractsQueryVariables = Exact<{
  expiry?: InputMaybe<Scalars['BigInt']>;
}>;


export type GetOptionsContractsQuery = { __typename?: 'Query', optionPools: Array<{ __typename?: 'OptionPool', baseAsset: string, address: string, optionsContracts: Array<{ __typename?: 'OptionsContract', expiry: string, strike: string, isPut: boolean, address: string }> }> };

export type GetUserDataQueryVariables = Exact<{
  user: Scalars['ID'];
}>;


export type GetUserDataQuery = { __typename?: 'Query', user?: { __typename?: 'User', optionsSwaped: Array<{ __typename?: 'OptionSwap', oldAmount: string, newAmount: string, oldExpiry: string, newExpiry: string, oldStrike: string, newStrike: string, isPut: boolean, fee: string, transaction: { __typename?: 'Transaction', id: string, blockNumber: string, timestamp: string } }>, optionsPurchased: Array<{ __typename?: 'OptionPurchase', amount: string, fee: string, isPut: boolean, expiry: string, strike: string, premium: string, transaction: { __typename?: 'Transaction', id: string, blockNumber: string, timestamp: string } }>, optionsExercised: Array<{ __typename?: 'OptionExercise', amount: string, fee: string, isPut: boolean, pnl: string, expiry: string, strike: string, transaction: { __typename?: 'Transaction', id: string, blockNumber: string, timestamp: string } }>, rewards: { __typename?: 'UserReward', totalCallRewards: string, totalOptionPoolRewards: string, totalVolumePoolRewards: string }, optionPoolReward: Array<{ __typename?: 'UserOptionPoolReward', amount: string, poolEpoch: string }>, callReward: Array<{ __typename?: 'UserCallReward', rewardKey: string, amount: string, poolEpoch: string }> } | null };


export const GetLeaderboardDataDocument = gql`
    query getLeaderboardData {
  users(first: 1000) {
    id
    userTradeStats {
      optionPool {
        id
      }
      totalPremium
      totalPutPnl
      totalCallPnl
      totalFees
    }
  }
}
    `;

/**
 * __useGetLeaderboardDataQuery__
 *
 * To run a query within a React component, call `useGetLeaderboardDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaderboardDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaderboardDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLeaderboardDataQuery(baseOptions?: Apollo.QueryHookOptions<GetLeaderboardDataQuery, GetLeaderboardDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLeaderboardDataQuery, GetLeaderboardDataQueryVariables>(GetLeaderboardDataDocument, options);
      }
export function useGetLeaderboardDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLeaderboardDataQuery, GetLeaderboardDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLeaderboardDataQuery, GetLeaderboardDataQueryVariables>(GetLeaderboardDataDocument, options);
        }
export type GetLeaderboardDataQueryHookResult = ReturnType<typeof useGetLeaderboardDataQuery>;
export type GetLeaderboardDataLazyQueryHookResult = ReturnType<typeof useGetLeaderboardDataLazyQuery>;
export type GetLeaderboardDataQueryResult = Apollo.QueryResult<GetLeaderboardDataQuery, GetLeaderboardDataQueryVariables>;
export const GetOptionsContractsDocument = gql`
    query getOptionsContracts($expiry: BigInt) {
  optionPools {
    address: id
    baseAsset
    optionsContracts(where: {expiry_gte: $expiry}, first: 1000) {
      address: id
      expiry
      strike
      isPut
    }
  }
}
    `;

/**
 * __useGetOptionsContractsQuery__
 *
 * To run a query within a React component, call `useGetOptionsContractsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOptionsContractsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOptionsContractsQuery({
 *   variables: {
 *      expiry: // value for 'expiry'
 *   },
 * });
 */
export function useGetOptionsContractsQuery(baseOptions?: Apollo.QueryHookOptions<GetOptionsContractsQuery, GetOptionsContractsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOptionsContractsQuery, GetOptionsContractsQueryVariables>(GetOptionsContractsDocument, options);
      }
export function useGetOptionsContractsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOptionsContractsQuery, GetOptionsContractsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOptionsContractsQuery, GetOptionsContractsQueryVariables>(GetOptionsContractsDocument, options);
        }
export type GetOptionsContractsQueryHookResult = ReturnType<typeof useGetOptionsContractsQuery>;
export type GetOptionsContractsLazyQueryHookResult = ReturnType<typeof useGetOptionsContractsLazyQuery>;
export type GetOptionsContractsQueryResult = Apollo.QueryResult<GetOptionsContractsQuery, GetOptionsContractsQueryVariables>;
export const GetUserDataDocument = gql`
    query getUserData($user: ID!) {
  user(id: $user) {
    optionsSwaped {
      oldAmount
      newAmount
      oldExpiry
      newExpiry
      oldStrike
      newStrike
      isPut
      fee
      transaction {
        id
        blockNumber
        timestamp
      }
    }
    optionsPurchased {
      amount
      fee
      isPut
      expiry
      strike
      premium
      transaction {
        id
        blockNumber
        timestamp
      }
    }
    optionsExercised {
      amount
      fee
      isPut
      pnl
      expiry
      strike
      transaction {
        id
        blockNumber
        timestamp
      }
    }
    rewards {
      totalCallRewards
      totalOptionPoolRewards
      totalVolumePoolRewards
    }
    optionPoolReward {
      amount
      poolEpoch
    }
    callReward {
      rewardKey
      amount
      poolEpoch
    }
  }
}
    `;

/**
 * __useGetUserDataQuery__
 *
 * To run a query within a React component, call `useGetUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetUserDataQuery(baseOptions: Apollo.QueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
      }
export function useGetUserDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
        }
export type GetUserDataQueryHookResult = ReturnType<typeof useGetUserDataQuery>;
export type GetUserDataLazyQueryHookResult = ReturnType<typeof useGetUserDataLazyQuery>;
export type GetUserDataQueryResult = Apollo.QueryResult<GetUserDataQuery, GetUserDataQueryVariables>;