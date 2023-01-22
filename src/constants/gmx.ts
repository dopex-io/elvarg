import { BigNumber } from 'ethers';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

export const MIN_EXECUTION_FEE = BigNumber.from(100000000000000);
export const DEFAULT_REFERRAL_CODE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const BASIS_POINTS_DIVISOR = 10000;
export const TAX_BASIS_POINTS = 50;
export const STABLE_TAX_BASIS_POINTS = 5;
export const MINT_BURN_FEE_BASIS_POINTS = 25;
export const SWAP_FEE_BASIS_POINTS = 30;
export const STABLE_SWAP_FEE_BASIS_POINTS = 1;
export const MARGIN_FEE_BASIS_POINTS = 10;
export const LIQUIDATION_FEE_USD = getContractReadableAmount(1, 30);
