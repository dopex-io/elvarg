import { SetStateAction, useCallback, useMemo, useState } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { SsovV3__factory } from '@dopex-io/sdk';
import { Button, Input } from '@dopex-io/ui';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useDebounce } from 'use-debounce';
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import wagmiConfig from 'wagmi-config';

import useStrikesData from 'hooks/ssov/useStrikesData';
import useVaultsData from 'hooks/ssov/useVaultsData';
import useVaultStore from 'hooks/ssov/useVaultStore';

import RowItem from 'components/ssov-new/AsidePanel/RowItem';

import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN } from 'constants/index';

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

const AsidePanel = ({ market }: { market: string }) => {
  const [amount, setAmount] = useState<string>('0');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [amountDebounced] = useDebounce(amount, 1000);

  const vault = useVaultStore((vault) => vault.vault);
  const activeStrikeIndex = useVaultStore((vault) => vault.activeStrikeIndex);

  const { vaults } = useVaultsData({ market });

  const selectedVault = useMemo(() => {
    const selected = vaults.find(
      (_vault) =>
        vault.duration === _vault.duration && vault.isPut === _vault.isPut
    );

    return selected;
  }, [vaults, vault]);

  const { strikesData } = useStrikesData({
    ssovAddress: selectedVault?.contractAddress as Address,
    epoch: selectedVault?.currentEpoch,
  });

  const { address } = useAccount();

  const collateralTokenReads = useContractReads({
    contracts: [
      {
        abi: erc20ABI,
        address: vault.collateralTokenAddress,
        functionName: 'allowance',
        args: [address as `0x${string}`, vault.address as `0x${string}`],
        chainId: wagmiConfig.lastUsedChainId,
      },
      {
        abi: erc20ABI,
        address: vault.collateralTokenAddress,
        functionName: 'balanceOf',
        args: [address!],
        chainId: wagmiConfig.lastUsedChainId,
      },
      {
        abi: erc20ABI,
        address: vault.collateralTokenAddress,
        functionName: 'symbol',
        chainId: wagmiConfig.lastUsedChainId,
      },
    ],
  });
  const { config: approveConfig, isSuccess: isSuccessApprove } =
    usePrepareContractWrite({
      abi: erc20ABI,
      address: vault.collateralTokenAddress,
      functionName: 'approve',
      args: [vault.address, parseUnits(amountDebounced || '0', DECIMALS_TOKEN)],
    });

  const { config } = usePrepareContractWrite({
    abi: SsovV3__factory.abi,
    address: vault.address as `0x${string}`,
    ...(activeIndex === 0 // 0: purchase, 1: deposit
      ? { functionName: 'purchase' }
      : { functionName: 'deposit' }),
    args: [
      BigInt(activeStrikeIndex),
      parseUnits(amountDebounced || '0', DECIMALS_TOKEN),
      address as Address,
    ],
  });

  const { write } = useContractWrite(config);
  const { write: approve } = useContractWrite(approveConfig);

  const selectedStrike = useMemo(() => {
    if (strikesData.length === 0 || !selectedVault)
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
        premiumPerOption: BigInt(0),
        premiumsAccrued: BigInt(0),
        totalCollateral: BigInt(0),
        activeCollateral: BigInt(0),
      };

    const strikeData = strikesData[activeStrikeIndex];
    const premiumInUSD =
      (selectedVault.isPut ? 1 : Number(selectedVault.currentPrice)) *
      Number(formatUnits(strikeData.premiumPerOption || 0n, DECIMALS_TOKEN));
    const breakeven = selectedVault.isPut
      ? strikeData.strike - premiumInUSD
      : premiumInUSD + strikeData.strike;
    const availableCollateral = formatAmount(
      selectedVault.isPut
        ? Number(formatUnits(strikeData.availableCollateral || 0n, 18)) /
            Number(strikeData.strike)
        : formatUnits(strikeData.availableCollateral || 0n, 18),
      5
    );
    const totalPremium = premiumInUSD * Number(amountDebounced);

    return { ...strikeData, breakeven, availableCollateral, totalPremium };
  }, [activeStrikeIndex, amountDebounced, selectedVault, strikesData]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleChange = useCallback(
    (e: { target: { value: SetStateAction<any> } }) => {
      setAmount(e.target.value);
    },
    []
  );

  const infoPopover = useMemo(() => {
    const buttonContent = activeIndex === 0 ? 'Purchase' : 'Deposit';
    if (!selectedVault || !collateralTokenReads.data || !isSuccessApprove)
      return {
        ...alerts.error.fallback,
        buttonContent,
      };

    if (!Number(amountDebounced)) {
      return {
        ...alerts.info.emptyInput,
        buttonContent,
      };
    } else if (
      !address ||
      (Number(selectedStrike.availableCollateral) < Number(amountDebounced) &&
        activeIndex === 0)
    )
      return {
        ...alerts.info.insufficientLiquidity,
      };
    else if (
      // @ts-ignore
      (collateralTokenReads.data[1].result ?? 0n) <
      parseUnits(amountDebounced || '0', DECIMALS_TOKEN)
    )
      return {
        ...alerts.error.insufficientBalance,
        buttonContent,
      };
    else if (
      // @ts-ignore
      ((collateralTokenReads.data[0] as any).result ?? 0n) <
      parseUnits(amountDebounced, DECIMALS_TOKEN)
    ) {
      return {
        ...alerts.error.insufficientAllowance,
      };
    } else if (selectedStrike.iv > 100)
      return {
        ...alerts.warning.highIv,
        buttonContent,
      };
    else
      return {
        ...alerts.info.enabled,
        buttonContent,
      };
  }, [
    activeIndex,
    address,
    amountDebounced,
    collateralTokenReads.data,
    selectedStrike,
    selectedVault,
    isSuccessApprove,
  ]);

  const transact = useCallback(() => {
    if (infoPopover.textContent?.includes('allowance')) {
      approve?.();
    } else {
      write?.();
    }
  }, [approve, infoPopover.textContent, write]);

  const renderCondition = useMemo(() => {
    return !selectedStrike || !selectedStrike || !selectedVault;
  }, [selectedStrike, selectedVault]);

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
            src={`/images/tokens/${String(
              collateralTokenReads.data?.[2].result
            )?.toLowerCase()}.svg`}
            alt={String(collateralTokenReads.data?.[2].result)?.toLowerCase()}
            className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
          />
        }
        placeholder="0.0"
      />
      {infoPopover.textContent !== '' ? (
        <div
          className={`${infoPopover.alertBg} p-3 rounded-md text-center flex justify-center`}
        >
          <ExclamationTriangleIcon className="h-6 w-6 fill-current mr-2" />
          {infoPopover.textContent}
        </div>
      ) : null}
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
                  formatUnits(selectedStrike.premiumPerOption || 0n, 18),
                  3
                )}{' '}
                <span className="text-stieglitz">
                  {vault?.isPut ? '$' : vault?.underlyingSymbol}
                </span>
              </p>
            </span>
          </div>
        ) : null}
      </div>
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
                {selectedStrike.availableCollateral}{' '}
                {String(collateralTokenReads.data?.[2].result)}
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
                    formatUnits(
                      selectedStrike.premiumPerOption || 0n,
                      DECIMALS_TOKEN
                    ),
                    3
                  )}
                </p>
                <p className="text-stieglitz">
                  {selectedVault?.isPut
                    ? '$'
                    : String(collateralTokenReads.data?.[2].result)}
                </p>
              </span>
            }
          />
          <RowItem
            label="Premium APR"
            content={
              formatAmount(
                (Number(
                  formatUnits(selectedStrike?.premiumsAccrued, DECIMALS_TOKEN)
                ) /
                  Number(
                    formatUnits(selectedStrike.activeCollateral, DECIMALS_TOKEN)
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
        className={`hover:cursor-pointer ${
          infoPopover.disabled ? 'cursor-not-allowed' : 'cursor-default'
        }`}
        disabled={infoPopover.disabled}
      >
        {infoPopover.buttonContent}
      </Button>
    </div>
  );
};

export default AsidePanel;
