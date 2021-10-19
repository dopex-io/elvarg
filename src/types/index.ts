import { ERC20 } from '@dopex-io/sdk';

import { OptionExercise, OptionPurchase, OptionSwap } from 'generated';

export enum OptionActionTypeEnum {
  Transfer = 'TRANSFER',
  Exercise = 'EXERCISE',
  Swap = 'SWAP',
  AutoExercise = 'AUTOEXERCISE',
  Withdraw = 'WITHDRAW',
  Claim = 'CLAIM',
}

export enum TimePeriodEnum {
  Month = 'MONTH',
  Week = 'WEEK',
}

export type OptionData = {
  expiry: string;
  strike: string;
  address: string;
  userBalance?: string;
  isPut: boolean;
  optionsContract: ERC20;
  optionsContractId: string;
};

export type OptionPoolBrokerTransaction =
  | OptionPurchase
  | OptionExercise
  | OptionSwap;

export type AssetData = {
  [key: string]: {
    fullName: string;
    symbol: string;
    _symbol: string;
    price: string;
    address?: string;
    priceUsd?: number;
    priceEth?: number;
    priceBtc?: number;
  };
};
