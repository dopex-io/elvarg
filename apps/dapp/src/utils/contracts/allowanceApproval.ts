import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber, Signer } from 'ethers';

export default async function allowanceApproval(
  tokenAddress: string,
  accountAddress: string,
  contractAddress: string,
  signer: Signer,
  finalAmount: BigNumber,
  setApproved: any,
  setUserTokenBalance: any
) {
  const strikeToken = await ERC20__factory.connect(tokenAddress, signer);
  const allowance: BigNumber = await strikeToken.allowance(
    accountAddress,
    contractAddress
  );
  const balance: BigNumber = await strikeToken.balanceOf(accountAddress);
  setApproved(allowance.gte(finalAmount));
  setUserTokenBalance(balance);
}
