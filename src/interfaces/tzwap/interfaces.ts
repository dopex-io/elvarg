import { BigNumber } from 'ethers';

export interface Order {
  id: number;
  minFees: BigNumber;
  maxFees: BigNumber;
  killed: boolean;
  creator: string;
  srcToken: string;
  srcTokenName: string;
  srcTokenDecimals: number;
  dstToken: string;
  dstTokenName: string;
  dstTokenDecimals: number;
  interval: BigNumber;
  tickSize: BigNumber;
  total: BigNumber;
  created: number;
  srcTokensSwapped: number;
  dstTokensSwapped: number;
}
