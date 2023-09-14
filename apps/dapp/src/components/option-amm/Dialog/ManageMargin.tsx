import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';

import { OptionAmmPortfolioManager__factory } from '@dopex-io/sdk';
import { Button, Dialog, Input } from '@dopex-io/ui';
import { useDebounce } from 'use-debounce';
import { erc20ABI, useAccount, useContractWrite } from 'wagmi';
import { readContract } from 'wagmi/actions';

import useAmmUserData from 'hooks/option-amm/useAmmUserData';
import useVaultStore from 'hooks/option-amm/useVaultStore';

import { ButtonGroupSub } from 'components/option-amm/AsidePanel';
import { CustomBottomElement } from 'components/ssov-beta/AsidePanel';

import { getAllowance, getUserBalance } from 'utils/contracts/getERC20Info';
import { formatAmount } from 'utils/general';
import getHighlightingFromRisk from 'utils/optionAmm/getHighlightingFromRisk';
import getMMSeverity from 'utils/optionAmm/getMMSeverity';

import { DECIMALS_USD } from 'constants/index';

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

  const vault = useVaultStore((store) => store.vault);
  const { address } = useAccount();
  const collateralSymbol = useVaultStore(
    (store) => store.vault.collateralSymbol,
  );
  const collateralToken = useVaultStore(
    (store) => store.vault.collateralTokenAddress,
  );
  const { portfolioData, updatePortfolio } = useAmmUserData({
    ammAddress: vault.address,
    portfolioManager: vault.portfolioManager,
    positionMinter: vault.positionMinter,
    lpAddress: vault.lp,
    account: address || zeroAddress,
  });

  const [activeState, setActiveState] = useState<PanelState>(
    PanelState.Deposit,
  );
  const [balance, setBalance] = useState<bigint>(0n);
  const [amount, setAmount] = useState<string>('');
  const [approved, setApproved] = useState<boolean>(false);
  const [portfolioHealth, setPortfolioHealth] = useState<bigint>(0n);
  const [debouncedHealth] = useDebounce(portfolioHealth, 1000);

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

  const updatePortfolioHealth = useCallback(async () => {
    const config = {
      abi: OptionAmmPortfolioManager__factory.abi,
      address: vault.portfolioManager,
    };

    const _newHealth = await readContract({
      ...config,
      functionName: 'getPortfolioHealthFromAddedCollateral',
      args: [address || zeroAddress, parseUnits(amount, DECIMALS_USD)],
    });
    setPortfolioHealth(_newHealth);
  }, [address, amount, vault.portfolioManager]);

  useEffect(() => {
    updatePortfolioHealth();
  }, [updatePortfolioHealth]);

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
        await updatePortfolio();
        const _balance = portfolioData?.collateralAmount;
        setBalance(_balance || 0n);
      }
    })();
  }, [
    activeState,
    address,
    collateralToken,
    portfolioData?.collateralAmount,
    updatePortfolio,
  ]);

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

  const riskHighlighting = useMemo(() => {
    if (!portfolioData)
      return { current: 'text-stieglitz', new: 'text-stieglitz' };
    const currentRisk = getMMSeverity(
      portfolioData.health,
      portfolioData.liquidationThreshold,
    );
    const newRisk = getMMSeverity(
      debouncedHealth,
      portfolioData.liquidationThreshold,
    );
    return {
      current: getHighlightingFromRisk(currentRisk),
      new: getHighlightingFromRisk(newRisk),
    };
  }, [debouncedHealth, portfolioData]);

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
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Portfolio Health</p>
            <span className="flex space-x-2">
              <p className={`text-${riskHighlighting.current}`}>
                {formatUnits(portfolioData?.health || 0n, 2)}%
              </p>
              {amount !== '' && amount !== '0' ? (
                <>
                  <p>→</p>
                  <p className={`text-${riskHighlighting.new}`}>
                    {formatUnits(debouncedHealth || 0n, 2)}%
                  </p>
                </>
              ) : null}
            </span>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Liquidation Threshold</p>
            <p>{formatUnits(portfolioData?.liquidationThreshold || 0n, 2)}%</p>
          </div>
          <div className="flex justify-between text-xs p-3">
            <p className="text-stieglitz">Margin Balance</p>
            <p>
              $
              {formatUnits(
                portfolioData?.availableCollateral || 0n,
                DECIMALS_USD,
              )}
            </p>
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
