import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Address, formatUnits, parseUnits } from 'viem';

import { Button, Input } from '@dopex-io/ui';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useDebounce } from 'use-debounce';
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
} from 'wagmi';
import wagmiConfig from 'wagmi-config';

import {
  usePrepareApprove,
  usePreparePurchase,
} from 'hooks/ssov/usePrepareWrites';
import useStrikesData from 'hooks/ssov/useStrikesData';
import useVaultsData from 'hooks/ssov/useVaultsData';
import useVaultStore from 'hooks/ssov/useVaultStore';

import PnlChart from 'components/common/PnlChart';
import alerts from 'components/ssov-beta/AsidePanel/alerts';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';
import DepositStepper from 'components/ssov-beta/Dialogs/DepositStepper';

import { getUserBalance, isApproved } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

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

const CustomBottomElement = ({
  symbol,
  value,
  label,
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  symbol: string | undefined;
  label: string;
  value: string;
}) => (
  <div className="flex justify-between text-xs text-stieglitz" {...rest}>
    <p>{label}</p>
    <span className="flex">
      <img
        src="/assets/max.svg"
        className="hover:bg-silver rounded-[4px]"
        alt="max"
      />
      <p className="text-white px-1">{value}</p>
      {symbol || ''}
    </span>
  </div>
);

const AsidePanel = ({ market }: { market: string }) => {
  const [amount, setAmount] = useState<string>('0');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<bigint>(0n);

  const [amountDebounced] = useDebounce(amount, 1000);

  const vault = useVaultStore((vault) => vault.vault);
  const activeStrikeIndex = useVaultStore((vault) => vault.activeStrikeIndex);

  const { vaults } = useVaultsData({ market });

  const selectedVault = useMemo(() => {
    const selected = vaults.find(
      (_vault) =>
        vault.duration === _vault.duration && vault.isPut === _vault.isPut,
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
        functionName: 'symbol',
        chainId: wagmiConfig.lastUsedChainId,
      },
    ],
  });
  const approveConfig = usePrepareApprove({
    spender: vault.address,
    token: vault.collateralTokenAddress,
    amount: parseUnits(amountDebounced || '0', DECIMALS_TOKEN),
  });
  const purchaseConfig = usePreparePurchase({
    ssov: vault.address,
    strikeIndex: BigInt(activeStrikeIndex),
    amount: parseUnits(amountDebounced || '0', DECIMALS_TOKEN),
    to: address as Address,
  });

  const { write: approve } = useContractWrite(approveConfig);
  const { write: purchase } = useContractWrite(purchaseConfig);

  const selectedStrike = useMemo(() => {
    if (
      strikesData.length === 0 ||
      !strikesData[activeStrikeIndex] ||
      !selectedVault
    )
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
        premiumPerOption: 0n,
        purchaseFeePerOption: 0n,
        premiumsAccrued: 0n,
        totalCollateral: 0n,
        activeCollateral: 0n,
      };

    const strikeData = strikesData[activeStrikeIndex];
    const premiumInUSD =
      (selectedVault.isPut ? 1 : Number(selectedVault.currentPrice)) *
      Number(formatUnits(strikeData.premiumPerOption || 0n, DECIMALS_TOKEN));
    const breakeven = selectedVault.isPut
      ? strikeData.strike - premiumInUSD
      : premiumInUSD + strikeData.strike;
    const availableCollateral = selectedVault.isPut
      ? Number(formatUnits(strikeData.availableCollateral || 0n, 18)) /
        Number(strikeData.strike)
      : formatUnits(strikeData.availableCollateral || 0n, 18);
    const totalPremium = premiumInUSD * Number(amountDebounced);

    return { ...strikeData, breakeven, availableCollateral, totalPremium };
  }, [activeStrikeIndex, amountDebounced, selectedVault, strikesData]);

  const panelData = useMemo(() => {
    if (!selectedStrike || !selectedVault)
      return {
        epoch: 0,
        strike: 0,
        optionSize: 0,
        fees: 0,
        iv: 0,
        breakeven: 0,
        totalCost: 0,
        availableCollateral: 0,
        side: '-',
        epochStartTime: format(new Date(), 'dd LLL yyyy'),
        withdrawableDate: format(new Date(), 'dd LLL yyyy'),
        premiumPerOption: 0,
        premiumApr: 0,
      };

    const activeCollateral =
      selectedStrike.activeCollateral === 0n
        ? 1
        : Number(formatUnits(selectedStrike.activeCollateral, DECIMALS_TOKEN));

    const totalFees = Number(
      formatUnits(
        selectedVault.isPut
          ? selectedStrike.purchaseFeePerOption *
              parseUnits(amountDebounced, DECIMALS_TOKEN)
          : (selectedStrike.purchaseFeePerOption *
              parseUnits(amountDebounced, DECIMALS_TOKEN) *
              parseUnits(selectedVault.currentPrice, DECIMALS_USD)) /
              parseUnits('1', DECIMALS_TOKEN),
        selectedVault.isPut
          ? 2 * DECIMALS_TOKEN
          : DECIMALS_TOKEN + DECIMALS_USD,
      ),
    );

    return {
      epoch: selectedVault.currentEpoch,
      strike: selectedStrike.strike,
      optionSize: formatAmount(amountDebounced, 3),
      fees: `$${formatAmount(totalFees, 3)}`,
      iv: selectedStrike.iv,
      breakeven: `$${formatAmount(selectedStrike.breakeven, 3)}`,
      totalCost: formatAmount(selectedStrike.totalPremium + totalFees, 3),
      availableCollateral: selectedStrike.availableCollateral,
      side: selectedVault.isPut ? 'Put' : 'Call',
      epochStartTime: format(
        new Date(Number(selectedVault.epochTimes.startTime) * 1000),
        'dd LLL yyy',
      ),
      withdrawableDate: format(
        new Date(Number(selectedVault.epochTimes.expiry) * 1000),
        'dd LLL yyy',
      ),
      premiumPerOption: formatAmount(
        formatUnits(selectedStrike.premiumPerOption || 0n, DECIMALS_TOKEN),
        3,
      ),
      premiumApr: formatAmount(
        (Number(formatUnits(selectedStrike.premiumsAccrued, DECIMALS_TOKEN)) /
          activeCollateral) *
          100,
        3,
      ),
    };
  }, [amountDebounced, selectedStrike, selectedVault]);

  const infoPopover = useMemo(() => {
    const isLong = activeIndex === 0;
    const buttonContent = isLong ? 'Purchase' : 'Deposit';
    const insufficientBalance = isLong
      ? Number(formatUnits(userBalance, DECIMALS_TOKEN)) <
        Number(panelData.totalCost) / Number(selectedVault?.currentPrice || 1)
      : userBalance < parseUnits(amountDebounced || '0', DECIMALS_TOKEN);

    if (!selectedVault || !collateralTokenReads.data || !approveConfig.result)
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
    else if (insufficientBalance)
      return {
        ...alerts.error.insufficientBalance,
        buttonContent,
      };
    else if (!approved) {
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
    selectedVault,
    collateralTokenReads.data,
    approveConfig.result,
    amountDebounced,
    address,
    selectedStrike.availableCollateral,
    selectedStrike.iv,
    userBalance,
    approved,
    panelData.totalCost,
  ]);

  const renderCondition = useMemo(() => {
    return !selectedStrike || !selectedStrike || !selectedVault;
  }, [selectedStrike, selectedVault]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleMax = useCallback(() => {
    setAmount(
      activeIndex === 0
        ? selectedStrike.availableCollateral.toString()
        : formatUnits(userBalance, DECIMALS_TOKEN),
    );
  }, [selectedStrike.availableCollateral, userBalance, activeIndex]);

  const handleChange = (e: { target: { value: SetStateAction<any> } }) => {
    setAmount(e.target.value);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const transact = useCallback(() => {
    if (infoPopover.textContent?.includes('allowance')) {
      approve?.();
    } else if (activeIndex === 0) {
      purchase?.();
    } else {
      setIsOpen((prevState) => !prevState);
    }
  }, [activeIndex, approve, infoPopover.textContent, purchase]);

  useEffect(() => {
    if (vault.address === '0x' || !address) return;
    (async () => {
      const _approved = await isApproved({
        owner: address,
        spender: vault.address,
        tokenAddress: vault.collateralTokenAddress,
        amount: parseUnits(amountDebounced, DECIMALS_TOKEN),
      });
      setApproved(_approved);
      const _balance = await getUserBalance({
        owner: address,
        tokenAddress: vault.collateralTokenAddress,
      });
      setUserBalance(_balance || 0n);
    })();
  }, [address, vault.address, vault.collateralTokenAddress, amountDebounced]);

  return renderCondition ? null : (
    <div className="flex flex-col space-y-4">
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
                collateralTokenReads.data?.[0].result,
              )?.toLowerCase()}.svg`}
              alt={String(collateralTokenReads.data?.[0].result)?.toLowerCase()}
              className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
            />
          }
          bottomElement={
            <CustomBottomElement
              symbol={collateralTokenReads.data?.[0].result as string}
              label={activeIndex === 0 ? 'Max Qty' : 'Balance'}
              value={formatAmount(
                activeIndex === 0
                  ? String(selectedStrike.availableCollateral)
                  : formatUnits(userBalance, DECIMALS_TOKEN),
                3,
                true,
              )}
              role="button"
              onClick={handleMax}
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
              <p>${panelData.strike}</p>
              <p className="text-stieglitz">Strike</p>
            </span>
            <span className="space-y-2 w-1/2 p-3">
              <p>{panelData.epoch}</p>
              <p className="text-xs text-stieglitz">Epoch</p>
            </span>
          </div>
          {activeIndex === 0 ? (
            <div className="flex flex-col space-y-2 p-3 text-xs">
              <span className="flex justify-between">
                <p className="text-stieglitz">Side</p>
                <p>{panelData.side}</p>
              </span>
              <span className="flex justify-between">
                <p className="text-stieglitz">Premium</p>
                <span
                  className={`flex ${
                    selectedVault?.isPut ? 'flex-row-reverse' : null
                  }`}
                >
                  {panelData.premiumPerOption}
                  <p
                    className={`text-stieglitz ${
                      selectedVault?.isPut ? null : 'pl-1'
                    }`}
                  >
                    {vault?.isPut ? '$' : vault?.underlyingSymbol}
                  </p>
                </span>
              </span>
            </div>
          ) : null}
        </div>
        {activeIndex === 0 ? (
          <div className="flex flex-col bg-umbra rounded-md p-3 space-y-3">
            <RowItem
              label="Option Size"
              content={<p>{panelData.optionSize}</p>}
            />
            <RowItem label="Fees" content={<p>{panelData.fees}</p>} />
            <RowItem label="IV" content={panelData.iv} />
            <RowItem label="Breakeven" content={panelData.breakeven} />
            <RowItem
              label="You will pay"
              content={<p>${panelData.totalCost}</p>}
            />
            <RowItem
              label="Balance"
              content={
                <span className="flex text-stieglitz space-x-1">
                  <p className="text-white">
                    {formatAmount(formatUnits(userBalance, DECIMALS_TOKEN), 3)}{' '}
                  </p>
                  <p>{String(collateralTokenReads.data?.[0].result)}</p>
                </span>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col bg-umbra rounded-md p-3 space-y-3">
            <RowItem label="Side" content={panelData.side} />
            <RowItem
              label="Epoch"
              content={<p>{panelData.epochStartTime}</p>}
            />
            <RowItem
              label="Withdrawable"
              content={<p>{panelData.withdrawableDate}</p>}
            />
            <RowItem
              label="Premium Per Option"
              content={
                <span
                  className={`flex space-x-1 ${
                    selectedVault?.isPut ? 'flex-row-reverse' : null
                  }`}
                >
                  <p>{panelData.premiumPerOption}</p>
                  <p className="text-stieglitz">
                    {selectedVault?.isPut
                      ? '$'
                      : String(collateralTokenReads.data?.[0].result)}
                  </p>
                </span>
              }
            />
            <RowItem label="Premium APR" content={panelData.premiumApr + '%'} />
          </div>
        )}
        <Button
          onClick={transact}
          variant="contained"
          color="primary"
          className={`hover:${
            infoPopover.disabled ? 'cursor-not-allowed' : 'cursor-default'
          }`}
          disabled={infoPopover.disabled}
        >
          {infoPopover.buttonContent}
        </Button>
        <DepositStepper
          isOpen={isOpen}
          handleClose={handleClose}
          data={{
            token: vault.collateralTokenAddress,
            vault: vault.address,
            strikeIndex: BigInt(activeStrikeIndex),
            amount: parseUnits(amountDebounced, DECIMALS_TOKEN),
            to: address as Address,
          }}
        />
      </div>
      <div className="bg-cod-gray p-3 rounded-lg">
        <PnlChart
          breakEven={selectedStrike.breakeven}
          optionPrice={Number(
            formatUnits(selectedStrike.premiumPerOption || 0n, DECIMALS_TOKEN),
          )}
          amount={Number(amountDebounced)}
          isPut={vault.isPut}
          price={Number(selectedVault?.currentPrice)}
          symbol={vault.underlyingSymbol}
        />
      </div>
    </div>
  );
};

export default AsidePanel;
