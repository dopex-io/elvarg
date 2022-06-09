import { BigNumber, ethers } from 'ethers';

export const expandToDecimals = (n: number | string, d: number): BigNumber =>
  ethers.utils.parseUnits(String(n), d);
