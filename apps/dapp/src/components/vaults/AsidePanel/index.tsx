import { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { Button, Input } from '@dopex-io/ui';
import { format } from 'date-fns';
import useVaultQuery from 'hooks/vaults/query';
import useVaultState from 'hooks/vaults/state';
import useFetchStrikes from 'hooks/vaults/strikes';
import { useDebounce } from 'use-debounce';
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import client from 'wagmi-client';

import RowItem from 'components/vaults/AsidePanel/RowItem';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';
import { TOKEN_SYMBOL_TO_ADDRESS } from 'constants/tokens';

import alerts from './alerts';

export const ButtonGroup = ({
  active,
  labels,
  handleClick,
}: {
  active: number;
  labels: (React.ReactNode | string)[];
  handleClick: (i: number) => void;
}) => {
  return (
    <div className="flex space-x-2">
      {labels.map((label, i: number) => (
        <span
          key={i}
          role="button"
          className={`text-sm font-normal transition ease-in-out duration-200 ${
            active === i ? 'text-white' : 'text-stieglitz'
          }`}
          onClick={() => handleClick(i)}
        >
          {label}
        </span>
      ))}
    </div>
  );
};

const AsidePanel = () => {
  const [amount, setAmount] = useState<string | number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const vault = useVaultState((vault) => vault.vault);
  const activeStrikeIndex = useVaultState((vault) => vault.activeStrikeIndex);
  const [amountDebounced] = useDebounce(amount, 1000);
  const { selectedVault, updateSelectedVault } = useVaultQuery({
    vaultSymbol: vault.base,
  });
  const strikes = useFetchStrikes({
    contractAddress: selectedVault?.contractAddress,
    epoch: selectedVault?.currentEpoch,
  });
  const { address } = useAccount();
  const { data } = useContractReads({
    contracts: [
      {
        abi: erc20ABI,
        address: TOKEN_SYMBOL_TO_ADDRESS[vault.base] as `0x${string}`,
        functionName: 'allowance',
        args: [address as `0x${string}`, vault.address as `0x${string}`],
        chainId: client.lastUsedChainId,
      },
      {
        abi: erc20ABI,
        address: TOKEN_SYMBOL_TO_ADDRESS[vault.base] as `0x${string}`,
        functionName: 'balanceOf',
        args: [address!],
        chainId: client.lastUsedChainId,
      },
    ],
  });
  const { config: approveConfig } = usePrepareContractWrite({
    abi: erc20ABI,
    address: TOKEN_SYMBOL_TO_ADDRESS[vault.base] as `0x${string}`,
    functionName: 'approve',
    args: [
      vault.address as `0x${string}`,
      getContractReadableAmount(amountDebounced, DECIMALS_TOKEN),
    ],
  });
  const { config } = usePrepareContractWrite({
    abi: vault.abi as any,
    address: vault.address as `0x${string}`,
    ...(activeIndex === 0 // 0: purchase, 1: deposit
      ? { functionName: 'purchase' }
      : { functionName: 'deposit' }),
    args: [
      activeStrikeIndex,
      getContractReadableAmount(amountDebounced, DECIMALS_TOKEN),
      address,
    ],
  });
  const { write } = useContractWrite(config);
  const { write: approve } = useContractWrite(approveConfig);

  useEffect(() => {
    updateSelectedVault(vault.durationType, vault.isPut as boolean);
  }, [updateSelectedVault, vault]);

  const selectedStrike = useMemo(() => {
    if (strikes.epochStrikeData.length === 0 || !selectedVault)
      return {
        strike: 0,
        delta: 0,
        gamma: 0,
        rho: 0,
        iv: 0,
        theta: 0,
        vega: 0,
        totalAvailableCollateral: 0,
        availableCollateralPercentage: 0,
        totalPurchased: 0,
        breakeven: 0,
        availableCollateral: 0,
        totalPremium: 0,
        premiumPerOption: BigNumber.from(0),
        premiumsAccrued: BigNumber.from(0),
        totalCollateral: BigNumber.from(0),
        activeCollateral: BigNumber.from(0),
      };

    const strikeData = strikes.epochStrikeData[activeStrikeIndex];
    const premiumInUSD =
      (selectedVault.isPut ? 1 : Number(selectedVault.currentPrice)) *
      getUserReadableAmount(strikeData.premiumPerOption, DECIMALS_TOKEN);
    const breakeven = selectedVault.isPut
      ? strikeData.strike - premiumInUSD
      : premiumInUSD + strikeData.strike;
    const availableCollateral = formatAmount(
      selectedVault.isPut
        ? getUserReadableAmount(strikeData.availableCollateral, 18) /
            Number(strikeData.strike)
        : getUserReadableAmount(strikeData.availableCollateral, 18),
      5
    );
    const totalPremium = premiumInUSD * Number(amountDebounced);

    return { ...strikeData, breakeven, availableCollateral, totalPremium };
  }, [
    activeStrikeIndex,
    amountDebounced,
    selectedVault,
    strikes.epochStrikeData,
  ]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setAmount(e.target.value);
    },
    []
  );

  const errorMsg = useMemo(() => {
    const buttonContent = activeIndex === 0 ? 'Purchase' : 'Deposit';
    if (!selectedVault || !data) return { ...alerts[1], buttonContent };

    if (
      !address ||
      (Number(selectedStrike.availableCollateral) < Number(amountDebounced) &&
        activeIndex === 0)
    )
      return { ...alerts[5] };
    else if (
      data[1].lt(getContractReadableAmount(amountDebounced, DECIMALS_TOKEN))
    )
      return {
        ...alerts[1],
        buttonContent,
      };
    else if (
      data[0].lt(getContractReadableAmount(amountDebounced, DECIMALS_TOKEN))
    ) {
      return {
        ...alerts[3],
      };
    } else if (selectedStrike.iv > 100)
      return {
        ...alerts[4],
        buttonContent,
      };
    else return { ...alerts[0], buttonContent };
  }, [
    activeIndex,
    address,
    amountDebounced,
    data,
    selectedStrike.availableCollateral,
    selectedStrike.iv,
    selectedVault,
  ]);

  const transact = useCallback(() => {
    if (errorMsg.textContent?.includes('allowance')) {
      approve?.();
    } else {
      write?.();
    }
  }, [approve, errorMsg.textContent, write]);

  const renderCondition = useMemo(() => {
    return (
      !selectedStrike ||
      !selectedStrike ||
      !selectedVault ||
      vault.base === 'UNKNOWN'
    );
  }, [selectedStrike, selectedVault, vault.base]);

  return renderCondition ? null : (
    <div className="flex flex-col bg-cod-gray rounded-lg p-3 space-y-3">
      <ButtonGroup
        active={activeIndex}
        labels={['Buy', 'Sell']}
        handleClick={handleClick}
      />
      <Input
        variant="xl"
        type="number"
        value={amount}
        onChange={handleChange}
        leftElement={
          <img
            src={`/images/tokens/${selectedVault?.underlyingSymbol}.svg`}
            alt={selectedVault?.underlyingSymbol}
            className="w-8 h-8 border border-mineshaft rounded-full ring-4 ring-cod-gray"
          />
        }
        placeholder="0.0"
      />
      <div className="flex flex-col divide-y divide-carbon border border-carbon rounded-md">
        <div className="flex divide-x divide-carbon text-xs">
          <span className="space-y-2 w-1/2 p-3">
            <p>${selectedStrike.strike}</p>
            <p className="text-stieglitz">Strike</p>
          </span>
          <span className="space-y-2 w-1/2 p-3">
            <p>{selectedVault?.currentEpoch}</p>
            <p className="text-xs text-stieglitz">Epoch</p>
          </span>
        </div>
        {activeIndex === 0 ? (
          <div className="flex flex-col space-y-2 p-3 text-xs">
            <span className="flex justify-between">
              <p className="text-stieglitz">Side</p>
              <p>{vault?.isPut ? 'PUT' : 'CALL'}</p>
            </span>
            <span className="flex justify-between">
              <p className="text-stieglitz">Premium</p>
              <p>
                {formatAmount(
                  getUserReadableAmount(selectedStrike.premiumPerOption, 18),
                  3
                )}{' '}
                <span className="text-stieglitz">
                  {vault?.isPut ? '$' : vault?.base}
                </span>
              </p>
            </span>
          </div>
        ) : null}
      </div>
      {errorMsg.status !== 'normal' ? (
        <div
          className={`${errorMsg.alertBg} p-3 rounded-md animate-pulse text-center text-cod-gray`}
        >
          {errorMsg.textContent}
        </div>
      ) : null}
      {activeIndex === 0 ? (
        <div className="flex flex-col bg-umbra rounded-md p-3 space-y-3">
          <RowItem
            label="Option Size"
            content={<p>{formatAmount(amountDebounced, 3)}</p>}
          />
          <RowItem label="Fees" content={selectedStrike.strike} />
          <RowItem label="IV" content={selectedStrike.iv} />
          <RowItem
            label="Breakeven"
            content={'$' + formatAmount(selectedStrike.breakeven, 3)}
          />
          <RowItem
            label="You will pay"
            content={<p>${formatAmount(selectedStrike.totalPremium, 3)}</p>}
          />
          <RowItem
            label="Available"
            content={
              <p>
                {selectedStrike.availableCollateral} {vault.base}
              </p>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col bg-umbra rounded-md p-3 space-y-3">
          <RowItem
            label="Side"
            content={selectedVault?.isPut ? 'Put' : 'Call'}
          />
          <RowItem
            label="Epoch"
            content={
              <p>
                {format(
                  new Date(Number(selectedVault?.epochTimes.startTime) * 1000),
                  'dd LLL yyy'
                )}
              </p>
            }
          />
          <RowItem
            label="Withdrawable"
            content={
              <p>
                {format(
                  new Date(Number(selectedVault?.epochTimes.expiry) * 1000),
                  'dd LLL yyy'
                )}
              </p>
            }
          />
          <RowItem
            label="Premium Per Option"
            content={
              <span
                className={`flex space-x-1 ${
                  selectedVault?.isPut ? 'flex-row-reverse' : null
                }`}
              >
                <p>
                  {formatAmount(
                    getUserReadableAmount(
                      selectedStrike.premiumPerOption,
                      DECIMALS_TOKEN
                    ),
                    3
                  )}
                </p>
                <p className="text-stieglitz">
                  {selectedVault?.isPut ? '$' : selectedVault?.underlyingSymbol}
                </p>
              </span>
            }
          />
          <RowItem
            label="Premium APR"
            content={
              formatAmount(
                (getUserReadableAmount(
                  selectedStrike?.premiumsAccrued,
                  DECIMALS_TOKEN
                ) /
                  getUserReadableAmount(
                    selectedStrike.activeCollateral,
                    DECIMALS_TOKEN
                  )) *
                  100,
                3
              ) + '%'
            }
          />
        </div>
      )}
      <Button
        onClick={transact}
        variant="contained"
        color="primary"
        className={`${
          errorMsg.disabled ? 'cursor-not-allowed' : 'cursor-default'
        }`}
        disabled={errorMsg.disabled}
      >
        {errorMsg.buttonContent}
      </Button>
    </div>
  );
};

export default AsidePanel;
