import { useCallback } from 'react';
import {
  BaseError,
  PrepareTransactionRequestReturnType,
  zeroAddress,
} from 'viem';

import { useAccount, useBalance } from 'wagmi';

const useUserBalance = () => {
  const { address: userAddress = zeroAddress } = useAccount();
  const { data: ethBalance } = useBalance({
    address: userAddress ? userAddress : undefined,
  });
  const checkEthBalance = useCallback(
    (request: PrepareTransactionRequestReturnType) => {
      if (!request || userAddress == zeroAddress || !ethBalance) return;

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
