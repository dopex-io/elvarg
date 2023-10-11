import { useCallback, useMemo, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

import { OptionAmmPortfolioManager__factory } from '@dopex-io/sdk';
import { Button, Dialog, Input } from '@dopex-io/ui';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';

import useMarginCalculator, {
  ManageMarginAction,
} from 'hooks/option-amm/helpers/useMarginCalculator';
import useMarginContractsState from 'hooks/option-amm/helpers/useMarginTokenStates';
import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import { ButtonGroupSub } from 'components/option-amm/AsidePanel';
import { CustomBottomElement } from 'components/ssov-beta/AsidePanel';

import { formatAmount } from 'utils/general';

import { DECIMALS_USD } from 'constants/index';

import DialogRow from '../DialogRow';
import HealthIndicator from './HealthIndicator';

interface Props {
  open: boolean;
  handleClose: () => void;
}

enum PanelState {
  Deposit = 0,
  Withdraw = 1,
}

const buttonLabels = ['Deposit', 'Withdraw'];

const ManageMargin = (props: Props) => {
  const { open, handleClose } = props;

  const [activeState, setActiveState] = useState<PanelState>(
    PanelState.Deposit,
  );
  const [amount, setAmount] = useState<string>('');

  const vault = useVaultStore((store) => store.vault);
  const { address } = useAccount();
  const collateralSymbol = useVaultStore(
    (store) => store.vault.collateralSymbol,
  );
  const { portfolioData } = useAmmUserData({
    ammAddress: vault.address,
    portfolioManager: vault.portfolioManager,
    positionMinter: vault.positionMinter,
    lpAddress: vault.lp,
    account: address || zeroAddress,
  });
  const { approved, balance } = useMarginContractsState({
    vault: vault,
    address: address || zeroAddress,
    amount,
    portfolio: portfolioData,
    action:
      activeState === PanelState.Deposit
        ? ManageMarginAction.AddCollateral
        : ManageMarginAction.RemoveCollateral,
  });
  const { newHealth } = useMarginCalculator({
    collateralAmount: portfolioData?.collateralAmount || 0n,
    activeCollateral: portfolioData?.activeCollateral || 0n,
    availableCollateral: portfolioData?.availableCollateral || 0n,
    liquidationThreshold: portfolioData?.liquidationThreshold || 0n,
    currentHealth: portfolioData?.health || 0n,
    input: parseUnits(amount, DECIMALS_USD),
    action:
      activeState === PanelState.Deposit
        ? ManageMarginAction.AddCollateral
        : ManageMarginAction.RemoveCollateral,
  });
  const { write: deposit } = useContractWrite({
    abi: OptionAmmPortfolioManager__factory.abi,
    address: vault.portfolioManager,
    functionName: 'depositPortfolioCollateral',
    args: [address!, parseUnits(amount, DECIMALS_USD)],
  });
  const { write: withdraw } = useContractWrite({
    abi: OptionAmmPortfolioManager__factory.abi,
    address: vault.portfolioManager,
    functionName: 'withdrawPortfolioCollateral',
    args: [parseUnits(amount, DECIMALS_USD)],
  });
  const { write: approve } = useContractWrite({
    abi: erc20ABI,
    address: vault.collateralTokenAddress,
    functionName: 'approve',
    args: [vault.portfolioManager, parseUnits(amount, DECIMALS_USD)],
  });

  const handleClickState = (index: number) => {
    setActiveState(index);
  };

  const handleMax = useCallback(() => {
    setAmount(formatUnits(balance, DECIMALS_USD));
  }, [balance]);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmount(e.target.value);
  };

  const handleClick = useCallback(() => {
    if (!approved && activeState === PanelState.Deposit) approve?.();
    else activeState === PanelState.Deposit ? deposit?.() : withdraw?.();
  }, [activeState, approve, approved, deposit, withdraw]);

  const buttonState = useMemo(() => {
    const defaultState = {
      handler: handleClick,
    };
    if (amount === '' || amount === '0')
      return {
        disabled: true,
        textContent: 'Enter an amount',
      };
    else if (!approved && activeState === PanelState.Deposit)
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
              value={formatAmount(formatUnits(balance, DECIMALS_USD), 3)}
              role="button"
              onClick={handleMax}
            />
          }
          placeholder="0.0"
        />
        <div className="border border-carbon rounded-lg divide-y divide-carbon">
          <HealthIndicator
            health={portfolioData?.health || 0n}
            newHealth={newHealth || '-'}
            amount={amount}
            liquidationThreshold={portfolioData?.liquidationThreshold || 0n}
          />
          <DialogRow
            label="Liquidation Threshold"
            content={`${formatUnits(
              portfolioData?.liquidationThreshold || 0n,
              2,
            )}%`}
          />
          <DialogRow
            label="Margin Balance"
            content={`$${formatUnits(
              portfolioData?.availableCollateral || 0n,
              DECIMALS_USD,
            )}`}
          />
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
