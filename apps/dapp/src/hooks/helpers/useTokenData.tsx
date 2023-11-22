import { useCallback, useState } from 'react';
import { Address, parseUnits } from 'viem';

import { erc20ABI, useAccount } from 'wagmi';
import { readContract } from 'wagmi/actions';

interface Props {
  token: Address;
  amount: bigint | string;
  spender?: Address;
  owner?: Address;
}

const useTokenData = (props: Props) => {
  const { token, spender = '0x', owner, amount } = props;

  const { address: account = '0x' } = useAccount();

  const [balance, setBalance] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [approved, setApproved] = useState<boolean>(false);

  const getDecimals = useCallback(async () => {
    const decimals = await readContract({
      abi: erc20ABI,
      address: token,
      functionName: 'decimals',
    });

    return decimals;
  }, [token]);

  const updateBalance = useCallback(async () => {
    if (account === '0x' || token === '0x') return;
    try {
      const balance = await readContract({
        abi: erc20ABI,
        address: token,
        functionName: 'balanceOf',
        args: [owner ?? account],
      });
      setBalance(balance);
    } catch (e) {
      console.error(e);
    }
  }, [account, token, owner]);

  const updateAllowance = useCallback(async () => {
    if (spender === '0x') {
      console.log('No spender passed');
      return;
    }
    try {
      const allowance = await readContract({
        abi: erc20ABI,
        address: token,
        functionName: 'allowance',
        args: [owner ?? account, spender],
      });
      setAllowance(allowance);
      if (typeof amount === 'bigint') {
        setApproved(allowance >= amount);
      } else {
        const decimals = await getDecimals();
        setApproved(allowance >= parseUnits(amount, decimals));
      }
    } catch (e) {
      console.error(e);
    }
  }, [spender, token, owner, account, amount, getDecimals]);

  return {
    balance,
    updateBalance,
    allowance,
    approved,
    updateAllowance,
  };
};

export default useTokenData;
