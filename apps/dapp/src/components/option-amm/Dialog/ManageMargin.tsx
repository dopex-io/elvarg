import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { OptionAmmPortfolioManager__factory } from '@dopex-io/sdk';
import { Button, Dialog, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';

import useVaultStore from 'hooks/option-amm/useVaultStore';

import { ButtonGroupSub } from 'components/option-amm/AsidePanel';
import { CustomBottomElement } from 'components/ssov-beta/AsidePanel';

import { getAllowance, getUserBalance } from 'utils/contracts/getERC20Info';

import { DECIMALS_STRIKE } from 'constants/index';

interface Props {
  open: boolean;
  handleClose: () => void;
  data: {
    health: bigint;
    availableCollateral: bigint;
  };
}

enum PanelState {
  Deposit = 0,
  Withdraw = 1,
}

const buttonLabels = ['Deposit', 'Withdraw'];

const ManageMargin = (props: Props) => {
  const { open, handleClose, data } = props;

  const vault = useVaultStore((store) => store.vault);

  const [activeState, setActiveState] = useState<PanelState>(
    PanelState.Deposit,
  );
  const [balance, setBalance] = useState<bigint>(0n);
  const [amount, setAmount] = useState<string>('');
  const [approved, setApproved] = useState<boolean>(false);

  const { address } = useAccount();
  const collateralSymbol = useVaultStore(
    (store) => store.vault.collateralSymbol,
  );
  const collateralToken = useVaultStore(
    (store) => store.vault.collateralTokenAddress,
  );
  const { write: deposit } = useContractWrite({
    abi: OptionAmmPortfolioManager__factory.abi,
    address: vault.portfolioManager,
    functionName: 'depositPortfolioCollateral',
    args: [address!, parseUnits(amount, DECIMALS_STRIKE)],
  });
  const { write: withdraw } = useContractWrite({
    abi: OptionAmmPortfolioManager__factory.abi,
    address: vault.portfolioManager,
    functionName: 'withdrawPortfolioCollateral',
    args: [parseUnits(amount, DECIMALS_STRIKE)],
  });
  const { write: approve } = useContractWrite({
    abi: erc20ABI,
    address: vault.collateralTokenAddress,
    functionName: 'approve',
    args: [vault.portfolioManager, parseUnits(amount, DECIMALS_STRIKE)],
  });

  const handleClickState = (index: number) => {
    setActiveState(index);
  };

  const handleMax = useCallback(() => {
    setAmount(formatUnits(balance, DECIMALS_STRIKE));
  }, [balance]);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmount(e.target.value);
  };

  const handleClick = useCallback(() => {
    if (!approved) approve?.();
    else activeState === PanelState.Deposit ? deposit?.() : withdraw?.();
  }, [activeState, approve, approved, deposit, withdraw]);

  useEffect(() => {
    (async () => {
      if (!address || !collateralToken) return;

      if (activeState === PanelState.Deposit) {
        const _balance = await getUserBalance({
          owner: address,
          tokenAddress: collateralToken,
        });
        setBalance(_balance || 0n);
      } else {
        const _balance = data.availableCollateral;
        setBalance(_balance || 0n);
      }
    })();
  }, [activeState, address, data.availableCollateral, collateralToken]);

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
      setApproved(allowance > parseUnits(amount, DECIMALS_STRIKE));
    })();
  }, [address, amount, vault.collateralTokenAddress, vault.portfolioManager]);

  const buttonState = useMemo(() => {
    const defaultState = {
      handler: handleClick,
    };
    if (amount === '' || amount === '0')
      return {
        disabled: true,
        textContent: 'Enter an amount',
      };
    else if (!approved)
      return { ...defaultState, disabled: false, textContent: 'Approve' };
    else {
      return {
        disabled: false,
        textContent: activeState === PanelState.Deposit ? 'Add' : 'Remove',
      };
    }
  }, [activeState, amount, approved, handleClick]);

  return (
    <Dialog
      isOpen={open}
      handleClose={handleClose}
      title="Manage Margin"
      showCloseIcon
    >
      <div className="flex flex-col space-y-3 mt-2">
        <ButtonGroupSub
          active={activeState}
          labels={buttonLabels}
          handleClick={handleClickState}
        />
        <Input
          variant="xl"
          type="number"
          value={amount}
          onChange={handleChange}
          leftElement={
            <img
              src={`/images/tokens/${collateralSymbol.toLowerCase()}.svg`}
              alt={collateralSymbol.toLowerCase()}
              className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
            />
          }
          bottomElement={
            <CustomBottomElement
              symbol={collateralSymbol}
              label="Balance"
              value={formatUnits(balance, DECIMALS_STRIKE)}
              role="button"
              onClick={handleMax}
            />
          }
          placeholder="0.0"
        />
        <div className="border border-carbon rounded-lg divide-y divide-carbon">
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Health Factor</p>
            <p>{formatUnits(data.health, 4)}</p>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Margin Balance</p>
            <p>{formatUnits(data.availableCollateral, DECIMALS_STRIKE)}</p>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Margin Required</p>
            <p>0</p>
          </div>
        </div>
        <Button
          onClick={handleClick}
          disabled={buttonState.disabled}
          size="small"
          color={true ? 'mineshaft' : 'carbon'}
          className="font-normal transition ease-in-out duration-200"
        >
          {buttonState.textContent}
        </Button>
      </div>
    </Dialog>
  );
};

export default ManageMargin;
