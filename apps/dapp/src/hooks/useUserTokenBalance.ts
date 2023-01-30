import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';

const useUserTokenBalance = (
  accountAddress: string,
  tokenAddress: string,
  signer: any
) => {
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  useEffect(() => {
    (async function () {
      if (!accountAddress || !tokenAddress || !signer) return;
      const bal = await ERC20__factory.connect(tokenAddress, signer).balanceOf(
        accountAddress
      );
      setUserTokenBalance(bal);
    })();
  }, [accountAddress, signer, tokenAddress]);

  return userTokenBalance;
};

export default useUserTokenBalance;
