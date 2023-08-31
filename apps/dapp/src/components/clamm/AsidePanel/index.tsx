import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

import { OptionPools__factory, PositionsManager__factory } from '@dopex-io/sdk';
import { Button, Input, Menu } from '@dopex-io/ui';
import { useDebounce } from 'use-debounce';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';
import { ClammStrikeData } from 'store/Vault/clamm';

import { usePrepareApprove } from 'hooks/ssov/usePrepareWrites';

import PnlChart from 'components/common/PnlChart';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import generateStrikes from 'utils/clamm/generateStrikes';
import { getUserBalance, isApproved } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { EXPIRIES_MENU } from 'constants/clamm/expiries';
import { MARKETS } from 'constants/clamm/markets';
import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  ZERO_ADDRESS,
} from 'constants/index';

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

export const BgButtonGroup = ({
  active,
  labels,
  handleClick,
}: {
  active: number;
  labels: (React.ReactNode | string)[];
  handleClick: (i: number) => void;
}) => {
  return (
    <div className="flex justify-between bg-carbon border border-carbon rounded-md">
      {labels.map((label, i: number) => (
        <span
          key={i}
          role="button"
          className={`p-0.5 py-1 text-sm text-white flex items-center justify-center border-0 hover:border-0 w-full m-1 transition ease-in-out duration-500 rounded-sm ${
            active === i
              ? 'bg-umbra hover:bg-umbra'
              : 'bg-carbon hover:bg-carbon'
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
  const {
    updateSelectedStrike,
    selectedStrike,
    clammStrikesData,
    isPut,
    positionManagerContract,
    optionPoolsContract,
    updateIsPut,
    availableOptions,
    clammMarkPrice,
    breakeven,
    premiumPerOption,
    updateIsTrade,
    updateClammStrikesData,
    tokenA,
    uniswapPoolContract,
    provider,
  } = useBoundStore();

  // TODO: note that this is always token A
  const collateralToken = MARKETS[tokenA];
  const actionToken = isPut ? MARKETS['USDC'] : collateralToken;

  const loadStrikes = useCallback(async () => {
    const pool = '0xcda53b1f66614552f834ceef361a8d12a0b8dad8';
    let strikes = await generateStrikes(pool, 10, isPut);
    let strikesForMenu = strikes.map((strike) => ({
      textContent: strike.toFixed(4),
      disabled: false,
    }));
    setClammStrikes(strikesForMenu);
  }, [isPut]);

  useEffect(() => {
    loadStrikes();
  }, [loadStrikes]);

  // const clammStrikes = clammStrikesData.map((s: ClammStrikeData) => ({
  //   textContent: `${formatAmount(s.strike, 3)}`,
  //   isDisabled: false,
  // }));

  const [clammStrikes, setClammStrikes] = useState<
    { textContent: string; disabled: boolean }[]
  >([]);
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [tradeOrLpIndex, setTradeOrLpIndex] = useState<number>(0);
  const [selectedExpiry, setSelectedExpiry] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isManualInput, setIsManualInput] = useState(false);
  const [amountDebounced] = useDebounce(inputAmount, 1000);
  const { address } = useAccount();

  const tokenAApproveConfig = usePrepareApprove({
    spender: positionManagerContract,
    token: actionToken.collateralTokenAddress,
    amount: parseUnits(amountDebounced || '0', DECIMALS_TOKEN),
  });
  const { write: approveTokenA } = useContractWrite(tokenAApproveConfig);

  // IUniswapV3Pool pool;
  // int24 tickLower;
  // int24 tickUpper;
  // uint256 liquidity;
  const tickLower = 2299; // TODO: any decimals?
  const tickUpper = 2302;
  const liquidity = BigInt(0); // LiquidityAmounts.getLiquidityForAmounts(
  //   uniswapV3TestLib.getCurrentSqrtPriceX96(pool),
  //   tickLower,
  //   tickUpper,
  //   isPut ? parseEther(inputAmount) : 0,
  //   !isPut ? parseEther(inputAmount) : 0,
  // )
  const { config: mintPositionConfig } = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: positionManagerContract,
    functionName: 'mintPosition',
    args: [
      {
        pool: uniswapPoolContract,
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidity: liquidity,
      },
    ], // TODO: liquidity type bigint?
  });
  const { write: mintPosition } = useContractWrite(mintPositionConfig);

  // uint256 optionId;
  // IUniswapV3Pool pool;
  // int24 tickLower;
  // int24 tickUpper;
  // uint256 liquidityToUse;
  // uint256 premiumAmount;
  const optionIdCall = BigInt(1);
  const premiumAmountCalls = BigInt(1);
  const { config: mintCallOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionPoolsContract,
    functionName: 'mintCallOption',
    args: [
      {
        optionId: optionIdCall,
        pool: uniswapPoolContract,
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidityToUse: liquidity,
        premiumAmount: premiumAmountCalls,
      },
    ],
  });
  const { write: mintCallOption } = useContractWrite(mintCallOptionConfig);

  const optionIdPut = BigInt(1);
  const premiumAmountPuts = BigInt(1);
  const { config: mintPutOptionConfig } = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: optionPoolsContract,
    functionName: 'mintPutOption',
    args: [
      {
        optionId: optionIdPut,
        pool: uniswapPoolContract,
        tickLower: tickLower,
        tickUpper: tickUpper,
        liquidityToUse: liquidity,
        premiumAmount: premiumAmountPuts,
      },
    ],
  });
  const { write: mintPutOption } = useContractWrite(mintPutOptionConfig);

  const handleSelectStrikePrice = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numStrike = Number(e.target.innerText.replace(/,/g, ''));
      updateSelectedStrike(numStrike);
    },
    [updateSelectedStrike],
  );

  const handleSelectExpiry = (index: number) => {
    setSelectedExpiry(index);
  };

  const handleTradeOrLp = (index: number) => {
    setTradeOrLpIndex(index);
    updateIsTrade(index === 0);
  };

  const handleIsPut = (index: number) => {
    updateIsPut(index === 1);
    updateClammStrikesData();
  };

  const handleMax = useCallback(() => {
    setInputAmount(
      formatUnits(BigInt(userBalance), isPut ? DECIMALS_USD : DECIMALS_TOKEN),
    );
  }, [isPut, userBalance]);

  const handleInputAmount = (e: { target: { value: SetStateAction<any> } }) => {
    setInputAmount(e.target.value);
  };

  const handleManualStrikeAmount = (e: {
    target: { value: SetStateAction<any> };
  }) => {
    updateSelectedStrike(Number(e.target.value));
  };

  const handleAction = useCallback(async () => {
    if (!approved) {
      approveTokenA?.();
    } else if (tradeOrLpIndex === 0) {
      if (isPut) {
        mintPutOption?.();
      } else {
        mintCallOption?.();
      }
    } else {
      mintPosition?.();
    }
  }, [
    approveTokenA,
    approved,
    isPut,
    mintCallOption,
    mintPosition,
    mintPutOption,
    tradeOrLpIndex,
  ]);

  useEffect(() => {
    if (optionPoolsContract === ZERO_ADDRESS || !address) return;
    (async () => {
      const _approved = await isApproved({
        owner: address,
        spender: optionPoolsContract,
        tokenAddress: actionToken.collateralTokenAddress,
        amount: parseUnits(amountDebounced, DECIMALS_TOKEN),
      });
      setApproved(_approved);
      const _balance = await getUserBalance({
        owner: address,
        tokenAddress: actionToken.collateralTokenAddress,
      });
      setUserBalance(
        Number(
          formatUnits(_balance || 0n, isPut ? DECIMALS_USD : DECIMALS_TOKEN),
        ),
      );
    })();
  }, [address, optionPoolsContract, amountDebounced, actionToken, isPut]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col bg-cod-gray rounded-lg p-3 space-y-1">
        <ButtonGroup
          active={tradeOrLpIndex}
          labels={['Trade', 'Liquidity Provision']}
          handleClick={handleTradeOrLp}
        />
        <Input
          variant="xl"
          type="number"
          value={inputAmount}
          onChange={handleInputAmount}
          leftElement={
            <img
              src={`/images/tokens/${String(
                collateralToken.underlyingSymbol,
              )?.toLowerCase()}.svg`}
              alt={String(collateralToken)?.toLowerCase()}
              className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
            />
          }
          bottomElement={
            <CustomBottomElement
              symbol={actionToken.underlyingSymbol as string}
              label={tradeOrLpIndex === 0 ? 'Options' : 'Deposit amount'}
              value={formatAmount(userBalance, 3, true)}
              role="button"
              onClick={handleMax}
            />
          }
          placeholder="0.0"
        />
        {tradeOrLpIndex === 0 ? (
          <div className="flex border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2 gap-3">
            <div className="w-full">
              <span className="text-stieglitz text-sm">Expiry</span>
              <BgButtonGroup
                active={selectedExpiry}
                labels={EXPIRIES_MENU}
                handleClick={handleSelectExpiry}
              />
            </div>
          </div>
        ) : null}
        <div className="flex border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2 gap-3">
          <div className="flex-1">
            <span className="text-stieglitz text-sm">Side</span>
            <BgButtonGroup
              active={isPut ? 1 : 0}
              labels={['Call', 'Put']}
              handleClick={handleIsPut}
            />
          </div>
        </div>
        <div className="border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2">
          <div className="flex justify-between">
            <span className="text-stieglitz text-sm">Strike</span>
            <div className="-mt-1">
              {/* {isManualInput ? (
                <button onClick={() => setIsManualInput(false)}>
                  <span className="text-sm text-[#22E1FF]">Select Strike</span>
                </button>
              ) : (
                // TODO: disable manual input for MVP
                <button onClick={() => setIsManualInput(true)} disabled>
                  <span className="text-sm text-[#22E1FF]">Manual Input</span>
                </button>
              )} */}
            </div>
          </div>
          <div className="mt-2">
            {isManualInput ? (
              <div className="relative p-1">
                <span className="absolute top-1/2 transform -translate-y-1/2 text-stieglitz text-sm left-2">
                  $
                </span>
                <input
                  placeholder="0.0"
                  type="number"
                  className="text-sm text-white rounded-md w-full border border-carbon text-right bg-cod-gray p-1 pr-2"
                  value={selectedStrike}
                  onChange={handleManualStrikeAmount}
                  disabled
                />
              </div>
            ) : (
              <Menu
                color="mineshaft"
                dropdownVariant="icon"
                handleSelection={handleSelectStrikePrice}
                selection={
                  <span className="text-sm text-white flex">
                    <p className="text-stieglitz inline mr-1">$</p>
                    {formatAmount(selectedStrike, 3)}
                  </span>
                }
                data={clammStrikes}
                className="w-full"
                showArrow
              />
            )}
          </div>
        </div>
        <div className="border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2 space-y-2">
          {tradeOrLpIndex === 0 ? (
            <>
              <RowItem label="Time to expiry" content={`1 hour`} />
              <RowItem
                label="Fees"
                content={
                  <div className="flex">
                    <p className="inline-block text-stieglitz">$</p>
                    <p className="inline-block ml-1">10.31</p>
                  </div>
                }
              />
              <RowItem
                label="Balance"
                content={
                  <div className="flex">
                    <p className="inline-block">10.31</p>
                    <p className="inline-block ml-1 text-stieglitz">USDC</p>
                  </div>
                }
              />
              <Button
                variant="contained"
                onClick={handleAction}
                disabled={
                  Number(inputAmount) <= 0 || Number(inputAmount) > userBalance
                }
                color={
                  !approved ||
                  (Number(inputAmount) > 0 &&
                    Number(inputAmount) <= userBalance)
                    ? 'primary'
                    : 'mineshaft'
                }
                className="w-full"
              >
                {approved
                  ? inputAmount.trim() == ''
                    ? 'Insert an amount'
                    : Number(inputAmount) > userBalance
                    ? 'Insufficient balance'
                    : 'Deposit'
                  : 'Approve'}
              </Button>
            </>
          ) : (
            <>
              <RowItem label="Balance" content={`10,313 USDC`} />
              <Button
                variant="contained"
                onClick={handleAction}
                disabled={
                  Number(inputAmount) <= 0 || Number(inputAmount) > userBalance
                }
                color={
                  !approved ||
                  (Number(inputAmount) > 0 &&
                    Number(inputAmount) <= userBalance)
                    ? 'primary'
                    : 'mineshaft'
                }
                className="w-full"
              >
                {approved
                  ? inputAmount.trim() == ''
                    ? 'Insert an amount'
                    : Number(inputAmount) > userBalance
                    ? 'Insufficient balance'
                    : 'Deposit'
                  : 'Approve'}
              </Button>
            </>
          )}
        </div>
        {/* remove for MVP */}
        {/* <StrikeRangeSelectorWrapper /> */}
      </div>
      {tradeOrLpIndex === 0 ? (
        <div className="bg-cod-gray p-3 rounded-lg">
          <PnlChart
            breakEven={breakeven}
            optionPrice={premiumPerOption}
            // Number(
            //   formatUnits(premiumPerOption || 0n, DECIMALS_TOKEN),
            // )}
            amount={Number(amountDebounced)}
            isPut={isPut}
            price={clammMarkPrice}
            symbol={collateralToken.underlyingSymbol}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AsidePanel;
