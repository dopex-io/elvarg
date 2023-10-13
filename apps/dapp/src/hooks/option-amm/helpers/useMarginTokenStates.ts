import { useEffect, useState } from 'react';
import { Address, parseUnits, zeroAddress } from 'viem';

import { ManageMarginAction } from 'hooks/option-amm/helpers/useMarginCalculator';
import { Portfolio } from 'hooks/option-amm/useAmmUserData';
import { VaultState } from 'hooks/option-amm/useVaultStore';

import { getAllowance, getUserBalance } from 'utils/contracts/getERC20Info';

import { DECIMALS_USD } from 'constants/index';

interface Props {
  amount: string;
  address: Address;
  vault: VaultState;
  portfolio: Portfolio | undefined;
  action: ManageMarginAction;
}

const useMarginTokenStates = (props: Props) => {
  const { amount, address, vault, portfolio, action } = props;

  const [approved, setApproved] = useState<boolean>(false);
  const [balance, setBalance] = useState<bigint>(0n);

  useEffect(() => {
    (async () => {
      if (
        !address ||
        vault.portfolioManager === '0x' ||
        vault.collateralTokenAddress === '0x'
      )
        return;

      const allowance = await getAllowance({
        owner: address,
        spender: vault.portfolioManager,
        tokenAddress: vault.collateralTokenAddress,
      });
      setApproved(allowance >= parseUnits(amount, DECIMALS_USD));
    })();
  }, [address, amount, vault.collateralTokenAddress, vault.portfolioManager]);

  useEffect(() => {
    (async () => {
      if (!address || address === zeroAddress || !vault.collateralTokenAddress)
        return;

      if (action === ManageMarginAction.AddCollateral) {
        const _balance = await getUserBalance({
          owner: address,
          tokenAddress: vault.collateralTokenAddress,
        });
        setBalance(_balance || 0n);
      } else {
        const _balance = portfolio?.availableCollateral || 0n;
        setBalance(_balance);
      }
    })();
  }, [action, address, portfolio, vault.collateralTokenAddress]);

  return { approved, balance };
};

export default useMarginTokenStates;
