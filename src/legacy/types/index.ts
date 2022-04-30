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
