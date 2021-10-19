import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {};
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

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
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
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  optionContractId?: Maybe<Scalars['String']>;
  optionContractId_contains?: Maybe<Scalars['String']>;
  optionContractId_ends_with?: Maybe<Scalars['String']>;
  optionContractId_gt?: Maybe<Scalars['String']>;
  optionContractId_gte?: Maybe<Scalars['String']>;
  optionContractId_in?: Maybe<Array<Scalars['String']>>;
  optionContractId_lt?: Maybe<Scalars['String']>;
  optionContractId_lte?: Maybe<Scalars['String']>;
  optionContractId_not?: Maybe<Scalars['String']>;
  optionContractId_not_contains?: Maybe<Scalars['String']>;
  optionContractId_not_ends_with?: Maybe<Scalars['String']>;
  optionContractId_not_in?: Maybe<Array<Scalars['String']>>;
  optionContractId_not_starts_with?: Maybe<Scalars['String']>;
  optionContractId_starts_with?: Maybe<Scalars['String']>;
  pnl?: Maybe<Scalars['BigInt']>;
  pnl_gt?: Maybe<Scalars['BigInt']>;
  pnl_gte?: Maybe<Scalars['BigInt']>;
  pnl_in?: Maybe<Array<Scalars['BigInt']>>;
  pnl_lt?: Maybe<Scalars['BigInt']>;
  pnl_lte?: Maybe<Scalars['BigInt']>;
  pnl_not?: Maybe<Scalars['BigInt']>;
  pnl_not_in?: Maybe<Array<Scalars['BigInt']>>;
  sender?: Maybe<Scalars['String']>;
  sender_contains?: Maybe<Scalars['String']>;
  sender_ends_with?: Maybe<Scalars['String']>;
  sender_gt?: Maybe<Scalars['String']>;
  sender_gte?: Maybe<Scalars['String']>;
  sender_in?: Maybe<Array<Scalars['String']>>;
  sender_lt?: Maybe<Scalars['String']>;
  sender_lte?: Maybe<Scalars['String']>;
  sender_not?: Maybe<Scalars['String']>;
  sender_not_contains?: Maybe<Scalars['String']>;
  sender_not_ends_with?: Maybe<Scalars['String']>;
  sender_not_in?: Maybe<Array<Scalars['String']>>;
  sender_not_starts_with?: Maybe<Scalars['String']>;
  sender_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
};

export enum DelegateClaim_OrderBy {
  Id = 'id',
  OptionContractId = 'optionContractId',
  Pnl = 'pnl',
  Sender = 'sender',
  User = 'user',
}

export type OptionContractMapping = {
  __typename?: 'OptionContractMapping';
  address: Scalars['String'];
  id: Scalars['ID'];
};

export type OptionContractMapping_Filter = {
  address?: Maybe<Scalars['String']>;
  address_contains?: Maybe<Scalars['String']>;
  address_ends_with?: Maybe<Scalars['String']>;
  address_gt?: Maybe<Scalars['String']>;
  address_gte?: Maybe<Scalars['String']>;
  address_in?: Maybe<Array<Scalars['String']>>;
  address_lt?: Maybe<Scalars['String']>;
  address_lte?: Maybe<Scalars['String']>;
  address_not?: Maybe<Scalars['String']>;
  address_not_contains?: Maybe<Scalars['String']>;
  address_not_ends_with?: Maybe<Scalars['String']>;
  address_not_in?: Maybe<Array<Scalars['String']>>;
  address_not_starts_with?: Maybe<Scalars['String']>;
  address_starts_with?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
};

export enum OptionContractMapping_OrderBy {
  Address = 'address',
  Id = 'id',
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  expiry?: Maybe<Scalars['BigInt']>;
  expiry_gt?: Maybe<Scalars['BigInt']>;
  expiry_gte?: Maybe<Scalars['BigInt']>;
  expiry_in?: Maybe<Array<Scalars['BigInt']>>;
  expiry_lt?: Maybe<Scalars['BigInt']>;
  expiry_lte?: Maybe<Scalars['BigInt']>;
  expiry_not?: Maybe<Scalars['BigInt']>;
  expiry_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fee?: Maybe<Scalars['BigInt']>;
  fee_gt?: Maybe<Scalars['BigInt']>;
  fee_gte?: Maybe<Scalars['BigInt']>;
  fee_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_lt?: Maybe<Scalars['BigInt']>;
  fee_lte?: Maybe<Scalars['BigInt']>;
  fee_not?: Maybe<Scalars['BigInt']>;
  fee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isPut?: Maybe<Scalars['Boolean']>;
  isPut_in?: Maybe<Array<Scalars['Boolean']>>;
  isPut_not?: Maybe<Scalars['Boolean']>;
  isPut_not_in?: Maybe<Array<Scalars['Boolean']>>;
  optionPoolAddress?: Maybe<Scalars['String']>;
  optionPoolAddress_contains?: Maybe<Scalars['String']>;
  optionPoolAddress_ends_with?: Maybe<Scalars['String']>;
  optionPoolAddress_gt?: Maybe<Scalars['String']>;
  optionPoolAddress_gte?: Maybe<Scalars['String']>;
  optionPoolAddress_in?: Maybe<Array<Scalars['String']>>;
  optionPoolAddress_lt?: Maybe<Scalars['String']>;
  optionPoolAddress_lte?: Maybe<Scalars['String']>;
  optionPoolAddress_not?: Maybe<Scalars['String']>;
  optionPoolAddress_not_contains?: Maybe<Scalars['String']>;
  optionPoolAddress_not_ends_with?: Maybe<Scalars['String']>;
  optionPoolAddress_not_in?: Maybe<Array<Scalars['String']>>;
  optionPoolAddress_not_starts_with?: Maybe<Scalars['String']>;
  optionPoolAddress_starts_with?: Maybe<Scalars['String']>;
  pnl?: Maybe<Scalars['BigInt']>;
  pnl_gt?: Maybe<Scalars['BigInt']>;
  pnl_gte?: Maybe<Scalars['BigInt']>;
  pnl_in?: Maybe<Array<Scalars['BigInt']>>;
  pnl_lt?: Maybe<Scalars['BigInt']>;
  pnl_lte?: Maybe<Scalars['BigInt']>;
  pnl_not?: Maybe<Scalars['BigInt']>;
  pnl_not_in?: Maybe<Array<Scalars['BigInt']>>;
  strike?: Maybe<Scalars['BigInt']>;
  strike_gt?: Maybe<Scalars['BigInt']>;
  strike_gte?: Maybe<Scalars['BigInt']>;
  strike_in?: Maybe<Array<Scalars['BigInt']>>;
  strike_lt?: Maybe<Scalars['BigInt']>;
  strike_lte?: Maybe<Scalars['BigInt']>;
  strike_not?: Maybe<Scalars['BigInt']>;
  strike_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
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
  User = 'user',
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
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionsContract_Filter>;
};

export type OptionPoolFactory = {
  __typename?: 'OptionPoolFactory';
  id: Scalars['ID'];
  optionPools: Array<OptionPool>;
};

export type OptionPoolFactoryOptionPoolsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPool_Filter>;
};

export type OptionPoolFactory_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
};

export enum OptionPoolFactory_OrderBy {
  Id = 'id',
  OptionPools = 'optionPools',
}

export type OptionPool_Filter = {
  baseAsset?: Maybe<Scalars['Bytes']>;
  baseAsset_contains?: Maybe<Scalars['Bytes']>;
  baseAsset_in?: Maybe<Array<Scalars['Bytes']>>;
  baseAsset_not?: Maybe<Scalars['Bytes']>;
  baseAsset_not_contains?: Maybe<Scalars['Bytes']>;
  baseAsset_not_in?: Maybe<Array<Scalars['Bytes']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  optionPoolFactoryId?: Maybe<Scalars['String']>;
  optionPoolFactoryId_contains?: Maybe<Scalars['String']>;
  optionPoolFactoryId_ends_with?: Maybe<Scalars['String']>;
  optionPoolFactoryId_gt?: Maybe<Scalars['String']>;
  optionPoolFactoryId_gte?: Maybe<Scalars['String']>;
  optionPoolFactoryId_in?: Maybe<Array<Scalars['String']>>;
  optionPoolFactoryId_lt?: Maybe<Scalars['String']>;
  optionPoolFactoryId_lte?: Maybe<Scalars['String']>;
  optionPoolFactoryId_not?: Maybe<Scalars['String']>;
  optionPoolFactoryId_not_contains?: Maybe<Scalars['String']>;
  optionPoolFactoryId_not_ends_with?: Maybe<Scalars['String']>;
  optionPoolFactoryId_not_in?: Maybe<Array<Scalars['String']>>;
  optionPoolFactoryId_not_starts_with?: Maybe<Scalars['String']>;
  optionPoolFactoryId_starts_with?: Maybe<Scalars['String']>;
  optionPoolId?: Maybe<Scalars['Bytes']>;
  optionPoolId_contains?: Maybe<Scalars['Bytes']>;
  optionPoolId_in?: Maybe<Array<Scalars['Bytes']>>;
  optionPoolId_not?: Maybe<Scalars['Bytes']>;
  optionPoolId_not_contains?: Maybe<Scalars['Bytes']>;
  optionPoolId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  quoteAsset?: Maybe<Scalars['Bytes']>;
  quoteAsset_contains?: Maybe<Scalars['Bytes']>;
  quoteAsset_in?: Maybe<Array<Scalars['Bytes']>>;
  quoteAsset_not?: Maybe<Scalars['Bytes']>;
  quoteAsset_not_contains?: Maybe<Scalars['Bytes']>;
  quoteAsset_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum OptionPool_OrderBy {
  BaseAsset = 'baseAsset',
  Id = 'id',
  OptionPoolFactoryId = 'optionPoolFactoryId',
  OptionPoolId = 'optionPoolId',
  OptionsContracts = 'optionsContracts',
  QuoteAsset = 'quoteAsset',
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  expiry?: Maybe<Scalars['BigInt']>;
  expiry_gt?: Maybe<Scalars['BigInt']>;
  expiry_gte?: Maybe<Scalars['BigInt']>;
  expiry_in?: Maybe<Array<Scalars['BigInt']>>;
  expiry_lt?: Maybe<Scalars['BigInt']>;
  expiry_lte?: Maybe<Scalars['BigInt']>;
  expiry_not?: Maybe<Scalars['BigInt']>;
  expiry_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fee?: Maybe<Scalars['BigInt']>;
  fee_gt?: Maybe<Scalars['BigInt']>;
  fee_gte?: Maybe<Scalars['BigInt']>;
  fee_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_lt?: Maybe<Scalars['BigInt']>;
  fee_lte?: Maybe<Scalars['BigInt']>;
  fee_not?: Maybe<Scalars['BigInt']>;
  fee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isPut?: Maybe<Scalars['Boolean']>;
  isPut_in?: Maybe<Array<Scalars['Boolean']>>;
  isPut_not?: Maybe<Scalars['Boolean']>;
  isPut_not_in?: Maybe<Array<Scalars['Boolean']>>;
  optionPoolAddress?: Maybe<Scalars['String']>;
  optionPoolAddress_contains?: Maybe<Scalars['String']>;
  optionPoolAddress_ends_with?: Maybe<Scalars['String']>;
  optionPoolAddress_gt?: Maybe<Scalars['String']>;
  optionPoolAddress_gte?: Maybe<Scalars['String']>;
  optionPoolAddress_in?: Maybe<Array<Scalars['String']>>;
  optionPoolAddress_lt?: Maybe<Scalars['String']>;
  optionPoolAddress_lte?: Maybe<Scalars['String']>;
  optionPoolAddress_not?: Maybe<Scalars['String']>;
  optionPoolAddress_not_contains?: Maybe<Scalars['String']>;
  optionPoolAddress_not_ends_with?: Maybe<Scalars['String']>;
  optionPoolAddress_not_in?: Maybe<Array<Scalars['String']>>;
  optionPoolAddress_not_starts_with?: Maybe<Scalars['String']>;
  optionPoolAddress_starts_with?: Maybe<Scalars['String']>;
  premium?: Maybe<Scalars['BigInt']>;
  premium_gt?: Maybe<Scalars['BigInt']>;
  premium_gte?: Maybe<Scalars['BigInt']>;
  premium_in?: Maybe<Array<Scalars['BigInt']>>;
  premium_lt?: Maybe<Scalars['BigInt']>;
  premium_lte?: Maybe<Scalars['BigInt']>;
  premium_not?: Maybe<Scalars['BigInt']>;
  premium_not_in?: Maybe<Array<Scalars['BigInt']>>;
  strike?: Maybe<Scalars['BigInt']>;
  strike_gt?: Maybe<Scalars['BigInt']>;
  strike_gte?: Maybe<Scalars['BigInt']>;
  strike_in?: Maybe<Array<Scalars['BigInt']>>;
  strike_lt?: Maybe<Scalars['BigInt']>;
  strike_lte?: Maybe<Scalars['BigInt']>;
  strike_not?: Maybe<Scalars['BigInt']>;
  strike_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
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
  User = 'user',
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
  fee?: Maybe<Scalars['BigInt']>;
  fee_gt?: Maybe<Scalars['BigInt']>;
  fee_gte?: Maybe<Scalars['BigInt']>;
  fee_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_lt?: Maybe<Scalars['BigInt']>;
  fee_lte?: Maybe<Scalars['BigInt']>;
  fee_not?: Maybe<Scalars['BigInt']>;
  fee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isPut?: Maybe<Scalars['Boolean']>;
  isPut_in?: Maybe<Array<Scalars['Boolean']>>;
  isPut_not?: Maybe<Scalars['Boolean']>;
  isPut_not_in?: Maybe<Array<Scalars['Boolean']>>;
  newAmount?: Maybe<Scalars['BigInt']>;
  newAmount_gt?: Maybe<Scalars['BigInt']>;
  newAmount_gte?: Maybe<Scalars['BigInt']>;
  newAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  newAmount_lt?: Maybe<Scalars['BigInt']>;
  newAmount_lte?: Maybe<Scalars['BigInt']>;
  newAmount_not?: Maybe<Scalars['BigInt']>;
  newAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  newExpiry?: Maybe<Scalars['BigInt']>;
  newExpiry_gt?: Maybe<Scalars['BigInt']>;
  newExpiry_gte?: Maybe<Scalars['BigInt']>;
  newExpiry_in?: Maybe<Array<Scalars['BigInt']>>;
  newExpiry_lt?: Maybe<Scalars['BigInt']>;
  newExpiry_lte?: Maybe<Scalars['BigInt']>;
  newExpiry_not?: Maybe<Scalars['BigInt']>;
  newExpiry_not_in?: Maybe<Array<Scalars['BigInt']>>;
  newStrike?: Maybe<Scalars['BigInt']>;
  newStrike_gt?: Maybe<Scalars['BigInt']>;
  newStrike_gte?: Maybe<Scalars['BigInt']>;
  newStrike_in?: Maybe<Array<Scalars['BigInt']>>;
  newStrike_lt?: Maybe<Scalars['BigInt']>;
  newStrike_lte?: Maybe<Scalars['BigInt']>;
  newStrike_not?: Maybe<Scalars['BigInt']>;
  newStrike_not_in?: Maybe<Array<Scalars['BigInt']>>;
  oldAmount?: Maybe<Scalars['BigInt']>;
  oldAmount_gt?: Maybe<Scalars['BigInt']>;
  oldAmount_gte?: Maybe<Scalars['BigInt']>;
  oldAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  oldAmount_lt?: Maybe<Scalars['BigInt']>;
  oldAmount_lte?: Maybe<Scalars['BigInt']>;
  oldAmount_not?: Maybe<Scalars['BigInt']>;
  oldAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  oldExpiry?: Maybe<Scalars['BigInt']>;
  oldExpiry_gt?: Maybe<Scalars['BigInt']>;
  oldExpiry_gte?: Maybe<Scalars['BigInt']>;
  oldExpiry_in?: Maybe<Array<Scalars['BigInt']>>;
  oldExpiry_lt?: Maybe<Scalars['BigInt']>;
  oldExpiry_lte?: Maybe<Scalars['BigInt']>;
  oldExpiry_not?: Maybe<Scalars['BigInt']>;
  oldExpiry_not_in?: Maybe<Array<Scalars['BigInt']>>;
  oldStrike?: Maybe<Scalars['BigInt']>;
  oldStrike_gt?: Maybe<Scalars['BigInt']>;
  oldStrike_gte?: Maybe<Scalars['BigInt']>;
  oldStrike_in?: Maybe<Array<Scalars['BigInt']>>;
  oldStrike_lt?: Maybe<Scalars['BigInt']>;
  oldStrike_lte?: Maybe<Scalars['BigInt']>;
  oldStrike_not?: Maybe<Scalars['BigInt']>;
  oldStrike_not_in?: Maybe<Array<Scalars['BigInt']>>;
  optionPoolAddress?: Maybe<Scalars['String']>;
  optionPoolAddress_contains?: Maybe<Scalars['String']>;
  optionPoolAddress_ends_with?: Maybe<Scalars['String']>;
  optionPoolAddress_gt?: Maybe<Scalars['String']>;
  optionPoolAddress_gte?: Maybe<Scalars['String']>;
  optionPoolAddress_in?: Maybe<Array<Scalars['String']>>;
  optionPoolAddress_lt?: Maybe<Scalars['String']>;
  optionPoolAddress_lte?: Maybe<Scalars['String']>;
  optionPoolAddress_not?: Maybe<Scalars['String']>;
  optionPoolAddress_not_contains?: Maybe<Scalars['String']>;
  optionPoolAddress_not_ends_with?: Maybe<Scalars['String']>;
  optionPoolAddress_not_in?: Maybe<Array<Scalars['String']>>;
  optionPoolAddress_not_starts_with?: Maybe<Scalars['String']>;
  optionPoolAddress_starts_with?: Maybe<Scalars['String']>;
  transaction?: Maybe<Scalars['String']>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
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
  User = 'user',
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
  epoch?: Maybe<Scalars['BigInt']>;
  epoch_gt?: Maybe<Scalars['BigInt']>;
  epoch_gte?: Maybe<Scalars['BigInt']>;
  epoch_in?: Maybe<Array<Scalars['BigInt']>>;
  epoch_lt?: Maybe<Scalars['BigInt']>;
  epoch_lte?: Maybe<Scalars['BigInt']>;
  epoch_not?: Maybe<Scalars['BigInt']>;
  epoch_not_in?: Maybe<Array<Scalars['BigInt']>>;
  expiry?: Maybe<Scalars['BigInt']>;
  expiry_gt?: Maybe<Scalars['BigInt']>;
  expiry_gte?: Maybe<Scalars['BigInt']>;
  expiry_in?: Maybe<Array<Scalars['BigInt']>>;
  expiry_lt?: Maybe<Scalars['BigInt']>;
  expiry_lte?: Maybe<Scalars['BigInt']>;
  expiry_not?: Maybe<Scalars['BigInt']>;
  expiry_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isPut?: Maybe<Scalars['Boolean']>;
  isPut_in?: Maybe<Array<Scalars['Boolean']>>;
  isPut_not?: Maybe<Scalars['Boolean']>;
  isPut_not_in?: Maybe<Array<Scalars['Boolean']>>;
  optionPool?: Maybe<Scalars['String']>;
  optionPool_contains?: Maybe<Scalars['String']>;
  optionPool_ends_with?: Maybe<Scalars['String']>;
  optionPool_gt?: Maybe<Scalars['String']>;
  optionPool_gte?: Maybe<Scalars['String']>;
  optionPool_in?: Maybe<Array<Scalars['String']>>;
  optionPool_lt?: Maybe<Scalars['String']>;
  optionPool_lte?: Maybe<Scalars['String']>;
  optionPool_not?: Maybe<Scalars['String']>;
  optionPool_not_contains?: Maybe<Scalars['String']>;
  optionPool_not_ends_with?: Maybe<Scalars['String']>;
  optionPool_not_in?: Maybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: Maybe<Scalars['String']>;
  optionPool_starts_with?: Maybe<Scalars['String']>;
  optionsContractId?: Maybe<Scalars['Bytes']>;
  optionsContractId_contains?: Maybe<Scalars['Bytes']>;
  optionsContractId_in?: Maybe<Array<Scalars['Bytes']>>;
  optionsContractId_not?: Maybe<Scalars['Bytes']>;
  optionsContractId_not_contains?: Maybe<Scalars['Bytes']>;
  optionsContractId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  strike?: Maybe<Scalars['BigInt']>;
  strike_gt?: Maybe<Scalars['BigInt']>;
  strike_gte?: Maybe<Scalars['BigInt']>;
  strike_in?: Maybe<Array<Scalars['BigInt']>>;
  strike_lt?: Maybe<Scalars['BigInt']>;
  strike_lte?: Maybe<Scalars['BigInt']>;
  strike_not?: Maybe<Scalars['BigInt']>;
  strike_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum OptionsContract_OrderBy {
  Epoch = 'epoch',
  Expiry = 'expiry',
  Id = 'id',
  IsPut = 'isPut',
  OptionPool = 'optionPool',
  OptionsContractId = 'optionsContractId',
  Strike = 'strike',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
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
  block?: Maybe<Block_Height>;
};

export type QueryDelegateClaimArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryDelegateClaimsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DelegateClaim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<DelegateClaim_Filter>;
};

export type QueryOptionContractMappingArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionContractMappingsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionContractMapping_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionContractMapping_Filter>;
};

export type QueryOptionExerciseArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionExercisesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionExercise_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionExercise_Filter>;
};

export type QueryOptionPoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionPoolFactoriesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPoolFactory_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPoolFactory_Filter>;
};

export type QueryOptionPoolFactoryArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionPoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPool_Filter>;
};

export type QueryOptionPurchaseArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionPurchasesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPurchase_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPurchase_Filter>;
};

export type QueryOptionSwapArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionSwapsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionSwap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionSwap_Filter>;
};

export type QueryOptionsContractArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryOptionsContractsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionsContract_Filter>;
};

export type QueryTransactionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryTransactionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Transaction_Filter>;
};

export type QueryUserArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserBalanceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserBalancesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserBalance_Filter>;
};

export type QueryUserCallRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserCallRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserCallReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserCallReward_Filter>;
};

export type QueryUserOptionPoolRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserOptionPoolRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOptionPoolReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserOptionPoolReward_Filter>;
};

export type QueryUserRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserReward_Filter>;
};

export type QueryUserTradeStatArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserTradeStatsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserTradeStat_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserTradeStat_Filter>;
};

export type QueryUserVolPoolRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type QueryUserVolPoolRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserVolPoolReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserVolPoolReward_Filter>;
};

export type QueryUsersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<User_Filter>;
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
  block?: Maybe<Block_Height>;
};

export type SubscriptionDelegateClaimArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionDelegateClaimsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DelegateClaim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<DelegateClaim_Filter>;
};

export type SubscriptionOptionContractMappingArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionContractMappingsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionContractMapping_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionContractMapping_Filter>;
};

export type SubscriptionOptionExerciseArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionExercisesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionExercise_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionExercise_Filter>;
};

export type SubscriptionOptionPoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionPoolFactoriesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPoolFactory_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPoolFactory_Filter>;
};

export type SubscriptionOptionPoolFactoryArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionPoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPool_Filter>;
};

export type SubscriptionOptionPurchaseArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionPurchasesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPurchase_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPurchase_Filter>;
};

export type SubscriptionOptionSwapArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionSwapsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionSwap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionSwap_Filter>;
};

export type SubscriptionOptionsContractArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionOptionsContractsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionsContract_Filter>;
};

export type SubscriptionTransactionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionTransactionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Transaction_Filter>;
};

export type SubscriptionUserArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserBalanceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserBalancesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserBalance_Filter>;
};

export type SubscriptionUserCallRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserCallRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserCallReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserCallReward_Filter>;
};

export type SubscriptionUserOptionPoolRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserOptionPoolRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOptionPoolReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserOptionPoolReward_Filter>;
};

export type SubscriptionUserRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserReward_Filter>;
};

export type SubscriptionUserTradeStatArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserTradeStatsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserTradeStat_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserTradeStat_Filter>;
};

export type SubscriptionUserVolPoolRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
};

export type SubscriptionUserVolPoolRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserVolPoolReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserVolPoolReward_Filter>;
};

export type SubscriptionUsersArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<User_Filter>;
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
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionExercise_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionExercise_Filter>;
};

export type TransactionPurchasesArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPurchase_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPurchase_Filter>;
};

export type TransactionSwapsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionSwap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionSwap_Filter>;
};

export type Transaction_Filter = {
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasPrice_gt?: Maybe<Scalars['BigInt']>;
  gasPrice_gte?: Maybe<Scalars['BigInt']>;
  gasPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice_lt?: Maybe<Scalars['BigInt']>;
  gasPrice_lte?: Maybe<Scalars['BigInt']>;
  gasPrice_not?: Maybe<Scalars['BigInt']>;
  gasPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  Exercises = 'exercises',
  GasPrice = 'gasPrice',
  Id = 'id',
  Purchases = 'purchases',
  Swaps = 'swaps',
  Timestamp = 'timestamp',
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
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserBalance_Filter>;
};

export type UserCallRewardArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserCallReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserCallReward_Filter>;
};

export type UserOptionPoolRewardArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOptionPoolReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserOptionPoolReward_Filter>;
};

export type UserOptionsExercisedArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionExercise_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionExercise_Filter>;
};

export type UserOptionsPurchasedArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionPurchase_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionPurchase_Filter>;
};

export type UserOptionsSwapedArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<OptionSwap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<OptionSwap_Filter>;
};

export type UserUserTradeStatsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserTradeStat_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserTradeStat_Filter>;
};

export type UserVolumePoolRewardArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserVolPoolReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<UserVolPoolReward_Filter>;
};

export type UserBalance = {
  __typename?: 'UserBalance';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  optionsContract: OptionsContract;
  user: User;
};

export type UserBalance_Filter = {
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  optionsContract?: Maybe<Scalars['String']>;
  optionsContract_contains?: Maybe<Scalars['String']>;
  optionsContract_ends_with?: Maybe<Scalars['String']>;
  optionsContract_gt?: Maybe<Scalars['String']>;
  optionsContract_gte?: Maybe<Scalars['String']>;
  optionsContract_in?: Maybe<Array<Scalars['String']>>;
  optionsContract_lt?: Maybe<Scalars['String']>;
  optionsContract_lte?: Maybe<Scalars['String']>;
  optionsContract_not?: Maybe<Scalars['String']>;
  optionsContract_not_contains?: Maybe<Scalars['String']>;
  optionsContract_not_ends_with?: Maybe<Scalars['String']>;
  optionsContract_not_in?: Maybe<Array<Scalars['String']>>;
  optionsContract_not_starts_with?: Maybe<Scalars['String']>;
  optionsContract_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
};

export enum UserBalance_OrderBy {
  Amount = 'amount',
  Id = 'id',
  OptionsContract = 'optionsContract',
  User = 'user',
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  optionPool?: Maybe<Scalars['String']>;
  optionPool_contains?: Maybe<Scalars['String']>;
  optionPool_ends_with?: Maybe<Scalars['String']>;
  optionPool_gt?: Maybe<Scalars['String']>;
  optionPool_gte?: Maybe<Scalars['String']>;
  optionPool_in?: Maybe<Array<Scalars['String']>>;
  optionPool_lt?: Maybe<Scalars['String']>;
  optionPool_lte?: Maybe<Scalars['String']>;
  optionPool_not?: Maybe<Scalars['String']>;
  optionPool_not_contains?: Maybe<Scalars['String']>;
  optionPool_not_ends_with?: Maybe<Scalars['String']>;
  optionPool_not_in?: Maybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: Maybe<Scalars['String']>;
  optionPool_starts_with?: Maybe<Scalars['String']>;
  poolEpoch?: Maybe<Scalars['BigInt']>;
  poolEpoch_gt?: Maybe<Scalars['BigInt']>;
  poolEpoch_gte?: Maybe<Scalars['BigInt']>;
  poolEpoch_in?: Maybe<Array<Scalars['BigInt']>>;
  poolEpoch_lt?: Maybe<Scalars['BigInt']>;
  poolEpoch_lte?: Maybe<Scalars['BigInt']>;
  poolEpoch_not?: Maybe<Scalars['BigInt']>;
  poolEpoch_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardKey?: Maybe<Scalars['Bytes']>;
  rewardKey_contains?: Maybe<Scalars['Bytes']>;
  rewardKey_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardKey_not?: Maybe<Scalars['Bytes']>;
  rewardKey_not_contains?: Maybe<Scalars['Bytes']>;
  rewardKey_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
};

export enum UserCallReward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  OptionPool = 'optionPool',
  PoolEpoch = 'poolEpoch',
  RewardKey = 'rewardKey',
  Transaction = 'transaction',
  User = 'user',
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  optionPool?: Maybe<Scalars['String']>;
  optionPool_contains?: Maybe<Scalars['String']>;
  optionPool_ends_with?: Maybe<Scalars['String']>;
  optionPool_gt?: Maybe<Scalars['String']>;
  optionPool_gte?: Maybe<Scalars['String']>;
  optionPool_in?: Maybe<Array<Scalars['String']>>;
  optionPool_lt?: Maybe<Scalars['String']>;
  optionPool_lte?: Maybe<Scalars['String']>;
  optionPool_not?: Maybe<Scalars['String']>;
  optionPool_not_contains?: Maybe<Scalars['String']>;
  optionPool_not_ends_with?: Maybe<Scalars['String']>;
  optionPool_not_in?: Maybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: Maybe<Scalars['String']>;
  optionPool_starts_with?: Maybe<Scalars['String']>;
  poolEpoch?: Maybe<Scalars['BigInt']>;
  poolEpoch_gt?: Maybe<Scalars['BigInt']>;
  poolEpoch_gte?: Maybe<Scalars['BigInt']>;
  poolEpoch_in?: Maybe<Array<Scalars['BigInt']>>;
  poolEpoch_lt?: Maybe<Scalars['BigInt']>;
  poolEpoch_lte?: Maybe<Scalars['BigInt']>;
  poolEpoch_not?: Maybe<Scalars['BigInt']>;
  poolEpoch_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
};

export enum UserOptionPoolReward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  OptionPool = 'optionPool',
  PoolEpoch = 'poolEpoch',
  Transaction = 'transaction',
  User = 'user',
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
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  totalCallRewards?: Maybe<Scalars['BigInt']>;
  totalCallRewards_gt?: Maybe<Scalars['BigInt']>;
  totalCallRewards_gte?: Maybe<Scalars['BigInt']>;
  totalCallRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  totalCallRewards_lt?: Maybe<Scalars['BigInt']>;
  totalCallRewards_lte?: Maybe<Scalars['BigInt']>;
  totalCallRewards_not?: Maybe<Scalars['BigInt']>;
  totalCallRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalOptionPoolRewards?: Maybe<Scalars['BigInt']>;
  totalOptionPoolRewards_gt?: Maybe<Scalars['BigInt']>;
  totalOptionPoolRewards_gte?: Maybe<Scalars['BigInt']>;
  totalOptionPoolRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  totalOptionPoolRewards_lt?: Maybe<Scalars['BigInt']>;
  totalOptionPoolRewards_lte?: Maybe<Scalars['BigInt']>;
  totalOptionPoolRewards_not?: Maybe<Scalars['BigInt']>;
  totalOptionPoolRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVolumePoolRewards?: Maybe<Scalars['BigInt']>;
  totalVolumePoolRewards_gt?: Maybe<Scalars['BigInt']>;
  totalVolumePoolRewards_gte?: Maybe<Scalars['BigInt']>;
  totalVolumePoolRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVolumePoolRewards_lt?: Maybe<Scalars['BigInt']>;
  totalVolumePoolRewards_lte?: Maybe<Scalars['BigInt']>;
  totalVolumePoolRewards_not?: Maybe<Scalars['BigInt']>;
  totalVolumePoolRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
};

export enum UserReward_OrderBy {
  Id = 'id',
  TotalCallRewards = 'totalCallRewards',
  TotalOptionPoolRewards = 'totalOptionPoolRewards',
  TotalVolumePoolRewards = 'totalVolumePoolRewards',
  User = 'user',
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
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  optionPool?: Maybe<Scalars['String']>;
  optionPool_contains?: Maybe<Scalars['String']>;
  optionPool_ends_with?: Maybe<Scalars['String']>;
  optionPool_gt?: Maybe<Scalars['String']>;
  optionPool_gte?: Maybe<Scalars['String']>;
  optionPool_in?: Maybe<Array<Scalars['String']>>;
  optionPool_lt?: Maybe<Scalars['String']>;
  optionPool_lte?: Maybe<Scalars['String']>;
  optionPool_not?: Maybe<Scalars['String']>;
  optionPool_not_contains?: Maybe<Scalars['String']>;
  optionPool_not_ends_with?: Maybe<Scalars['String']>;
  optionPool_not_in?: Maybe<Array<Scalars['String']>>;
  optionPool_not_starts_with?: Maybe<Scalars['String']>;
  optionPool_starts_with?: Maybe<Scalars['String']>;
  totalCallPnl?: Maybe<Scalars['BigInt']>;
  totalCallPnl_gt?: Maybe<Scalars['BigInt']>;
  totalCallPnl_gte?: Maybe<Scalars['BigInt']>;
  totalCallPnl_in?: Maybe<Array<Scalars['BigInt']>>;
  totalCallPnl_lt?: Maybe<Scalars['BigInt']>;
  totalCallPnl_lte?: Maybe<Scalars['BigInt']>;
  totalCallPnl_not?: Maybe<Scalars['BigInt']>;
  totalCallPnl_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalFees?: Maybe<Scalars['BigInt']>;
  totalFees_gt?: Maybe<Scalars['BigInt']>;
  totalFees_gte?: Maybe<Scalars['BigInt']>;
  totalFees_in?: Maybe<Array<Scalars['BigInt']>>;
  totalFees_lt?: Maybe<Scalars['BigInt']>;
  totalFees_lte?: Maybe<Scalars['BigInt']>;
  totalFees_not?: Maybe<Scalars['BigInt']>;
  totalFees_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalPremium?: Maybe<Scalars['BigInt']>;
  totalPremium_gt?: Maybe<Scalars['BigInt']>;
  totalPremium_gte?: Maybe<Scalars['BigInt']>;
  totalPremium_in?: Maybe<Array<Scalars['BigInt']>>;
  totalPremium_lt?: Maybe<Scalars['BigInt']>;
  totalPremium_lte?: Maybe<Scalars['BigInt']>;
  totalPremium_not?: Maybe<Scalars['BigInt']>;
  totalPremium_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalPutPnl?: Maybe<Scalars['BigInt']>;
  totalPutPnl_gt?: Maybe<Scalars['BigInt']>;
  totalPutPnl_gte?: Maybe<Scalars['BigInt']>;
  totalPutPnl_in?: Maybe<Array<Scalars['BigInt']>>;
  totalPutPnl_lt?: Maybe<Scalars['BigInt']>;
  totalPutPnl_lte?: Maybe<Scalars['BigInt']>;
  totalPutPnl_not?: Maybe<Scalars['BigInt']>;
  totalPutPnl_not_in?: Maybe<Array<Scalars['BigInt']>>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
};

export enum UserTradeStat_OrderBy {
  Id = 'id',
  OptionPool = 'optionPool',
  TotalCallPnl = 'totalCallPnl',
  TotalFees = 'totalFees',
  TotalPremium = 'totalPremium',
  TotalPutPnl = 'totalPutPnl',
  User = 'user',
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  user_contains?: Maybe<Scalars['String']>;
  user_ends_with?: Maybe<Scalars['String']>;
  user_gt?: Maybe<Scalars['String']>;
  user_gte?: Maybe<Scalars['String']>;
  user_in?: Maybe<Array<Scalars['String']>>;
  user_lt?: Maybe<Scalars['String']>;
  user_lte?: Maybe<Scalars['String']>;
  user_not?: Maybe<Scalars['String']>;
  user_not_contains?: Maybe<Scalars['String']>;
  user_not_ends_with?: Maybe<Scalars['String']>;
  user_not_in?: Maybe<Array<Scalars['String']>>;
  user_not_starts_with?: Maybe<Scalars['String']>;
  user_starts_with?: Maybe<Scalars['String']>;
  volumePool?: Maybe<Scalars['String']>;
  volumePool_contains?: Maybe<Scalars['String']>;
  volumePool_ends_with?: Maybe<Scalars['String']>;
  volumePool_gt?: Maybe<Scalars['String']>;
  volumePool_gte?: Maybe<Scalars['String']>;
  volumePool_in?: Maybe<Array<Scalars['String']>>;
  volumePool_lt?: Maybe<Scalars['String']>;
  volumePool_lte?: Maybe<Scalars['String']>;
  volumePool_not?: Maybe<Scalars['String']>;
  volumePool_not_contains?: Maybe<Scalars['String']>;
  volumePool_not_ends_with?: Maybe<Scalars['String']>;
  volumePool_not_in?: Maybe<Array<Scalars['String']>>;
  volumePool_not_starts_with?: Maybe<Scalars['String']>;
  volumePool_starts_with?: Maybe<Scalars['String']>;
  weeklyEpoch?: Maybe<Scalars['BigInt']>;
  weeklyEpoch_gt?: Maybe<Scalars['BigInt']>;
  weeklyEpoch_gte?: Maybe<Scalars['BigInt']>;
  weeklyEpoch_in?: Maybe<Array<Scalars['BigInt']>>;
  weeklyEpoch_lt?: Maybe<Scalars['BigInt']>;
  weeklyEpoch_lte?: Maybe<Scalars['BigInt']>;
  weeklyEpoch_not?: Maybe<Scalars['BigInt']>;
  weeklyEpoch_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum UserVolPoolReward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Transaction = 'transaction',
  User = 'user',
  VolumePool = 'volumePool',
  WeeklyEpoch = 'weeklyEpoch',
}

export type User_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
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
  VolumePoolReward = 'volumePoolReward',
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
  Deny = 'deny',
}

export type GetLeaderboardDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetLeaderboardDataQuery = {
  __typename?: 'Query';
  users: Array<{
    __typename?: 'User';
    id: string;
    userTradeStats: Array<{
      __typename?: 'UserTradeStat';
      totalPremium: string;
      totalPutPnl: string;
      totalCallPnl: string;
      totalFees: string;
      optionPool: { __typename?: 'OptionPool'; id: string };
    }>;
  }>;
};

export type GetOptionsContractsQueryVariables = Exact<{
  expiry?: Maybe<Scalars['BigInt']>;
}>;

export type GetOptionsContractsQuery = {
  __typename?: 'Query';
  optionPools: Array<{
    __typename?: 'OptionPool';
    baseAsset: string;
    address: string;
    optionsContracts: Array<{
      __typename?: 'OptionsContract';
      expiry: string;
      strike: string;
      isPut: boolean;
      address: string;
    }>;
  }>;
};

export type GetUserDataQueryVariables = Exact<{
  user: Scalars['ID'];
}>;

export type GetUserDataQuery = {
  __typename?: 'Query';
  user?: Maybe<{
    __typename?: 'User';
    optionsSwaped: Array<{
      __typename?: 'OptionSwap';
      oldAmount: string;
      newAmount: string;
      oldExpiry: string;
      newExpiry: string;
      oldStrike: string;
      newStrike: string;
      isPut: boolean;
      fee: string;
      transaction: {
        __typename?: 'Transaction';
        id: string;
        blockNumber: string;
        timestamp: string;
      };
    }>;
    optionsPurchased: Array<{
      __typename?: 'OptionPurchase';
      amount: string;
      fee: string;
      isPut: boolean;
      expiry: string;
      strike: string;
      premium: string;
      transaction: {
        __typename?: 'Transaction';
        id: string;
        blockNumber: string;
        timestamp: string;
      };
    }>;
    optionsExercised: Array<{
      __typename?: 'OptionExercise';
      amount: string;
      fee: string;
      isPut: boolean;
      pnl: string;
      expiry: string;
      strike: string;
      transaction: {
        __typename?: 'Transaction';
        id: string;
        blockNumber: string;
        timestamp: string;
      };
    }>;
    rewards: {
      __typename?: 'UserReward';
      totalCallRewards: string;
      totalOptionPoolRewards: string;
      totalVolumePoolRewards: string;
    };
    optionPoolReward: Array<{
      __typename?: 'UserOptionPoolReward';
      amount: string;
      poolEpoch: string;
    }>;
    callReward: Array<{
      __typename?: 'UserCallReward';
      rewardKey: string;
      amount: string;
      poolEpoch: string;
    }>;
  }>;
};

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
export function useGetLeaderboardDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLeaderboardDataQuery,
    GetLeaderboardDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLeaderboardDataQuery,
    GetLeaderboardDataQueryVariables
  >(GetLeaderboardDataDocument, options);
}
export function useGetLeaderboardDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLeaderboardDataQuery,
    GetLeaderboardDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLeaderboardDataQuery,
    GetLeaderboardDataQueryVariables
  >(GetLeaderboardDataDocument, options);
}
export type GetLeaderboardDataQueryHookResult = ReturnType<
  typeof useGetLeaderboardDataQuery
>;
export type GetLeaderboardDataLazyQueryHookResult = ReturnType<
  typeof useGetLeaderboardDataLazyQuery
>;
export type GetLeaderboardDataQueryResult = Apollo.QueryResult<
  GetLeaderboardDataQuery,
  GetLeaderboardDataQueryVariables
>;
export const GetOptionsContractsDocument = gql`
  query getOptionsContracts($expiry: BigInt) {
    optionPools {
      address: id
      baseAsset
      optionsContracts(where: { expiry_gte: $expiry }, first: 1000) {
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
export function useGetOptionsContractsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetOptionsContractsQuery,
    GetOptionsContractsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetOptionsContractsQuery,
    GetOptionsContractsQueryVariables
  >(GetOptionsContractsDocument, options);
}
export function useGetOptionsContractsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOptionsContractsQuery,
    GetOptionsContractsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetOptionsContractsQuery,
    GetOptionsContractsQueryVariables
  >(GetOptionsContractsDocument, options);
}
export type GetOptionsContractsQueryHookResult = ReturnType<
  typeof useGetOptionsContractsQuery
>;
export type GetOptionsContractsLazyQueryHookResult = ReturnType<
  typeof useGetOptionsContractsLazyQuery
>;
export type GetOptionsContractsQueryResult = Apollo.QueryResult<
  GetOptionsContractsQuery,
  GetOptionsContractsQueryVariables
>;
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
export function useGetUserDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserDataQuery,
    GetUserDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserDataQuery, GetUserDataQueryVariables>(
    GetUserDataDocument,
    options
  );
}
export function useGetUserDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserDataQuery,
    GetUserDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserDataQuery, GetUserDataQueryVariables>(
    GetUserDataDocument,
    options
  );
}
export type GetUserDataQueryHookResult = ReturnType<typeof useGetUserDataQuery>;
export type GetUserDataLazyQueryHookResult = ReturnType<
  typeof useGetUserDataLazyQuery
>;
export type GetUserDataQueryResult = Apollo.QueryResult<
  GetUserDataQuery,
  GetUserDataQueryVariables
>;
