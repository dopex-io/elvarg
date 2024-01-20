import { useCallback } from 'react';
import { BaseError, PrepareTransactionRequestReturnType } from 'viem';

import { useAccount, useBalance } from 'wagmi';

const useUserBalance = () => {
  const { address: userAddress } = useAccount();
  const { data: ethBalance } = useBalance({
    address: userAddress ? userAddress : undefined,
  });
  const checkEthBalance = useCallback(
    (request: PrepareTransactionRequestReturnType) => {
      if (!request || !userAddress || !ethBalance) return;

      if (request.gasPrice && request.gas && ethBalance) {
        if (request.gasPrice * request.gas > ethBalance.value) {
          throw new BaseError('Insufficient ETH balance');
        }
      }
    },
    [ethBalance, userAddress],
  );

  return { checkEthBalance };
};

export default useUserBalance;
