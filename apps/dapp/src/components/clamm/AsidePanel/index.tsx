import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'viem';

import { ERC20__factory } from '@dopex-io/sdk';
import { Button, Input, Menu } from '@dopex-io/ui';
import { formatDistance } from 'date-fns';
import { useDebounce } from 'use-debounce';
import { useContractWrite } from 'wagmi';

import { useBoundStore } from 'store';

import { ClammStrike } from 'hooks/clamm/useClammStrikes';
import useOptionPool from 'hooks/clamm/useOptionPool';
import usePositionManager from 'hooks/clamm/usePositionManager';
import {
  UsePrepareMintCallOrPutOptionProps,
  usePrepareMintCallOrPutOptionRoll,
  usePrepareMintPosition,
} from 'hooks/clamm/usePrepareWrites';
import { usePrepareApprove } from 'hooks/ssov/usePrepareWrites';

import PnlChart from 'components/common/PnlChart';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import getMarketInformation from 'utils/clamm/getMarketInformation';
import getPremium from 'utils/clamm/getPremium';
import { getBlockTime } from 'utils/contracts';
import { STRIKE_DECIMALS } from 'utils/contracts/atlantics/pool';
import { getUserBalance } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { CHAINS } from 'constants/chains';
import { EXPIRIES_BY_INDEX, EXPIRIES_MENU } from 'constants/clamm/expiries';
import { positionManagerAddress } from 'constants/clamm/markets';
import {
  DECIMALS_TOKEN,
  DECIMALS_USD,
  OPTION_TOKEN_DECIMALS,
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
    isPut,
    updateIsPut,
    clammMarkPrice,
    selectedPair,
    chainId,
    provider,
    isTrade,
    userAddress,
  } = useBoundStore();

  const [clammStrikes, setClammStrikes] = useState<ClammStrike[]>([]);
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [tradeOrLpIndex, setTradeOrLpIndex] = useState<number>(0);
  const [selectedExpiry, setSelectedExpiry] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [amountDebounced] = useDebounce(inputAmount, 1000);
  const [tokenAmountToSpend, setTokenAmountToSpend] = useState(0n);
  const [userTokenBalances, setUserTokenBalances] = useState({
    collateralTokenBalance: 0n,
    underlyingTokenBalance: 0n,
  });

  const {
    collateralTokenAddress,
    collateralTokenSymbol,
    underlyingTokenAddress,
    underlyingTokenSymbol,
    uniswapPoolAddress,
    optionPool,
  } = useMemo(() => {
    return getMarketInformation(selectedPair);
  }, [selectedPair]);

  const { getDepositParams, getStrikesWithTicks } = usePositionManager();
  const { /* getAvailableLiquidityAtTick  ,*/ getLiquidityToUse } =
    useOptionPool();

  const depositParams = useMemo(() => {
    const defaultDepositParams = {
      pool: uniswapPoolAddress,
      tickLower: 0,
      tickUpper: 0,
      liquidity: 0n,
    };
    if (isTrade) {
      return defaultDepositParams;
    }

    const clammStrike = clammStrikes.find(({ strike }) => {
      return Number(strike.toFixed(5)) === selectedStrike;
    });

    if (!clammStrike) {
      console.error('[handleDeposit] Relevant clammStrike not found');
      return defaultDepositParams;
    }

    const depositTokenSymbol = isPut
      ? collateralTokenSymbol
      : underlyingTokenSymbol;
    const tokenDecimals = CHAINS[chainId].tokenDecimals[depositTokenSymbol];

    const depositAMount = parseUnits(amountDebounced, tokenDecimals);

    return getDepositParams(
      clammStrike.lowerTick,
      clammStrike.upperTick,
      depositAMount,
    );
  }, [
    uniswapPoolAddress,
    isTrade,
    amountDebounced,
    chainId,
    clammStrikes,
    collateralTokenSymbol,
    getDepositParams,
    isPut,
    selectedStrike,
    underlyingTokenSymbol,
  ]);

  const loadStrikesForPair = useCallback(async () => {
    if (!uniswapPoolAddress) return console.error('UniswapPool not found');
    const strikes = await getStrikesWithTicks(10);
    const firstStrike = strikes[0];
    setClammStrikes(strikes);
    updateSelectedStrike(Number(firstStrike.strike.toFixed(5)));
  }, [uniswapPoolAddress, getStrikesWithTicks, updateSelectedStrike]);

  // const debugAvailableLiquidity = useCallback(async () => {
  //   const clammStrike = clammStrikes.find(({ strike }) => {
  //     return Number(strike.toFixed(5)) === selectedStrike;
  //   });

  //   if (!clammStrike) return;
  //   const availableLiquidity = await getAvailableLiquidityAtTick(
  //     clammStrike.lowerTick,
  //     clammStrike.upperTick,
  //   );

  //   console.log("available liquidity", availableLiquidity);
  // }, [clammStrikes, getAvailableLiquidityAtTick, selectedStrike]);

  // useEffect(() => {
  //   debugAvailableLiquidity();
  // }, [debugAvailableLiquidity]);

  // const debugGetUserOptionsPOsitions = useCallback(async () => {
  //   // const clammStrike = clammStrikes.find(({ strike }) => {
  //   //   return Number(strike.toFixed(5)) === selectedStrike;
  //   // });

  //   // const positions = await getUserOptionPositions(zeroAddress, uniswapPoolAddress)

  //   // console.log(positions)

  //   // if (!clammStrike) return;
  //   // const availableLiquidity = await getUserOptionPositions(
  //   //   clammStrike.lowerTick,
  //   //   clammStrike.upperTick,
  //   // );

  //   // console.log("available liquidity", availableLiquidity);
  // }, []);

  // useEffect(() => {
  //   debugGetUserOptionsPOsitions();
  // }, [debugGetUserOptionsPOsitions]);

  const readableClammStrikes = useMemo(() => {
    if (clammStrikes.length === 0) return [];
    return clammStrikes.map(({ strike }) => ({
      textContent: strike.toFixed(5),
      disabled: false,
    }));
  }, [clammStrikes]);

  const mintOptionsParams = useMemo(() => {
    let mintOptionsParams: UsePrepareMintCallOrPutOptionProps = {
      isPut: false,
      optionPool: optionPool,
      parameters: {
        liquidityToUse: 0n,
        pool: uniswapPoolAddress,
        tickLower: 0,
        tickUpper: 0,
        ttl: 0n,
      },
    };

    if (!isTrade) {
      return mintOptionsParams;
    }

    const clammStrike = clammStrikes.find(({ strike }) => {
      return Number(strike.toFixed(5)) === selectedStrike;
    });

    if (!clammStrike) {
      console.error('[handleDeposit] Relevant clammStrike not found');
      return mintOptionsParams;
    }

    const strikeToPrecision = BigInt(
      (clammStrike.strike * 10 ** STRIKE_DECIMALS).toFixed(0),
    );

    const liquidityToUse = getLiquidityToUse(
      strikeToPrecision,
      clammStrike.lowerTick,
      clammStrike.upperTick,
      parseUnits(amountDebounced, OPTION_TOKEN_DECIMALS),
      isPut,
    );

    return {
      isPut: isPut,
      optionPool: optionPool,
      parameters: {
        pool: uniswapPoolAddress,
        tickLower: clammStrike.lowerTick,
        tickUpper: clammStrike.upperTick,
        liquidityToUse: liquidityToUse,
        ttl: BigInt(EXPIRIES_BY_INDEX[selectedExpiry]),
      },
    };
  }, [
    selectedExpiry,
    optionPool,
    uniswapPoolAddress,
    clammStrikes,
    isTrade,
    selectedStrike,
    amountDebounced,
    getLiquidityToUse,
    isPut,
  ]);

  /***
   *
   * NEWLY ADDED START
   */
  useEffect(() => {
    loadStrikesForPair();
  }, [loadStrikesForPair]);

  const checkApproved = useCallback(async () => {
    if (!provider || !userAddress) return;
    const token = ERC20__factory.connect(
      isPut ? collateralTokenAddress : underlyingTokenAddress,
      provider,
    );
    const spender = isTrade ? optionPool : positionManagerAddress;
    const allowance = await token.allowance(userAddress, spender);
    // console.log('Spender', spender);
    // console.log('allowance', allowance);
    if (BigNumber.from(tokenAmountToSpend.toString()).gt(allowance)) {
      setApproved(false);
    } else {
      setApproved(true);
    }
  }, [
    userAddress,
    collateralTokenAddress,
    isPut,
    isTrade,
    optionPool,
    provider,
    tokenAmountToSpend,
    underlyingTokenAddress,
  ]);

  const updateTokenAmountsToSpend = useCallback(async () => {
    if (!provider) return;
    const decimals =
      CHAINS[chainId].tokenDecimals[
        isPut ? collateralTokenSymbol : underlyingTokenSymbol
      ];
    const blockTimestamp = Number(await getBlockTime(provider));
    const amount = isTrade
      ? ((await getPremium(
          optionPool,
          isPut,
          blockTimestamp + selectedExpiry,
          0n,
          0n,
          0n,
          0n,
        )) as bigint)
      : parseUnits(amountDebounced, decimals);

    // console.log('COST', amount);
    setTokenAmountToSpend(amount);
  }, [
    amountDebounced,
    chainId,
    collateralTokenSymbol,
    isPut,
    isTrade,
    optionPool,
    provider,
    selectedExpiry,
    underlyingTokenSymbol,
  ]);

  const updateUserTokensBalances = useCallback(async () => {
    const [collateralTokenBalance, underlyingTokenBalance] = await Promise.all([
      getUserBalance({
        owner: userAddress,
        tokenAddress: collateralTokenAddress,
      }),
      getUserBalance({
        owner: userAddress,
        tokenAddress: underlyingTokenAddress,
      }),
    ]);
    setUserTokenBalances({
      collateralTokenBalance: collateralTokenBalance ?? 0n,
      underlyingTokenBalance: underlyingTokenBalance ?? 0n,
    });
  }, [collateralTokenAddress, underlyingTokenAddress, userAddress]);

  useEffect(() => {
    updateUserTokensBalances();
  }, [updateUserTokensBalances]);

  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  useEffect(() => {
    updateTokenAmountsToSpend();
  }, [updateTokenAmountsToSpend]);

  const mintPositionConfig = usePrepareMintPosition({
    parameters: depositParams,
  });
  const { write: mintPosition } = useContractWrite(mintPositionConfig);

  const mintOptionsConfig =
    usePrepareMintCallOrPutOptionRoll(mintOptionsParams);
  const { write: mintOptions } = useContractWrite(mintOptionsConfig);

  const selectedToken = useMemo(() => {
    if (isPut) {
      return {
        tokenSymbol: collateralTokenSymbol,
        tokenAddress: collateralTokenAddress,
      };
    } else {
      return {
        tokenSymbol: underlyingTokenSymbol,
        tokenAddress: underlyingTokenAddress,
      };
    }
  }, [
    collateralTokenAddress,
    collateralTokenSymbol,
    isPut,
    underlyingTokenAddress,
    underlyingTokenSymbol,
  ]);

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
  };

  const handleIsPut = (index: number) => {
    updateIsPut(index === 1);
  };

  const handleMax = useCallback(() => {
    setInputAmount(
      isPut
        ? formatUnits(userTokenBalances.collateralTokenBalance, DECIMALS_USD)
        : formatUnits(userTokenBalances.underlyingTokenBalance, DECIMALS_TOKEN),
    );
  }, [isPut, userTokenBalances]);

  const handleInputAmount = (e: { target: { value: SetStateAction<any> } }) => {
    setInputAmount(e.target.value);
  };

  const handleManualStrikeAmount = (e: {
    target: { value: SetStateAction<any> };
  }) => {
    updateSelectedStrike(Number(e.target.value));
  };

  const tokenAApproveConfig = usePrepareApprove({
    spender: isTrade ? optionPool : positionManagerAddress,
    token: isPut ? collateralTokenAddress : underlyingTokenAddress,
    amount: tokenAmountToSpend,
  });

  const approveTokens = useContractWrite(tokenAApproveConfig);

  const handleApprove = useCallback(async () => {
    const { writeAsync } = approveTokens;
    if (!writeAsync) return;
    await writeAsync();
    await checkApproved();
  }, [approveTokens, checkApproved]);

  const buttonProps = useMemo(() => {
    // @todo, why is colors type never expored from UI packages.-.
    type colors =
      | 'primary'
      | 'mineshaft'
      | 'carbon'
      | 'umbra'
      | 'success'
      | 'error';

    let action: (() => void) | undefined;
    let text = 'Deposit';
    let color: colors = 'primary';
    let disabled = false;

    const consideredBalance = isPut
      ? userTokenBalances.collateralTokenBalance
      : userTokenBalances.underlyingTokenBalance;

    if (isTrade) {
      text = 'Buy';
      action = mintOptions;
    } else {
      text = 'Deposit';
      action = mintPosition;
    }

    if (tokenAmountToSpend > consideredBalance) {
      text = 'Insufficient Balance';
      color = 'mineshaft';
      disabled = true;
    }

    if (!approved) {
      text = 'Approve';
      color = 'primary';
      disabled = false;
      action = handleApprove;
    }

    return {
      text,
      action,
      color,
      disabled,
    };
  }, [
    mintOptions,
    mintPosition,
    handleApprove,
    approved,
    isPut,
    isTrade,
    tokenAmountToSpend,
    userTokenBalances.collateralTokenBalance,
    userTokenBalances.underlyingTokenBalance,
  ]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col bg-cod-gray rounded-lg p-3 space-y-1">
        <ButtonGroup
          active={tradeOrLpIndex}
          labels={['Trade', 'Liquidity Provision']}
          handleClick={handleTradeOrLp}
        />
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
        </div>
        <div className="mt-2">
          {/* {isManualInput ? (
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
          ) : ( */}
          <Menu
            color="mineshaft"
            dropdownVariant="icon"
            handleSelection={handleSelectStrikePrice}
            selection={
              <span className="text-sm text-white flex">
                <p className="text-stieglitz inline mr-1">$</p>
                {selectedStrike.toFixed(5)}
              </span>
            }
            data={readableClammStrikes}
            className="w-full"
            showArrow
          />
          {/* )} */}
        </div>
        <Input
          variant="xl"
          type="number"
          value={inputAmount}
          onChange={handleInputAmount}
          leftElement={
            <img
              src={`/images/tokens/${String(
                selectedToken.tokenSymbol,
              )?.toLowerCase()}.svg`}
              alt={String(selectedToken.tokenSymbol)?.toLowerCase()}
              className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
            />
          }
          bottomElement={
            <CustomBottomElement
              symbol={underlyingTokenSymbol as string}
              label={tradeOrLpIndex === 0 ? 'Options' : 'Deposit amount'}
              value={formatAmount(
                isPut
                  ? formatUnits(
                      userTokenBalances.collateralTokenBalance,
                      DECIMALS_USD,
                    )
                  : formatUnits(
                      userTokenBalances.underlyingTokenBalance,
                      DECIMALS_TOKEN,
                    ),
                3,
                true,
              )}
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
        <div className="border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2 space-y-2">
          {tradeOrLpIndex === 0 ? (
            <>
              <RowItem
                label="Time to expiry"
                content={formatDistance(
                  new Date().getTime() +
                    EXPIRIES_BY_INDEX[selectedExpiry] * 1000,
                  Number(new Date()),
                )}
              />
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
                onClick={buttonProps.action}
                color={buttonProps.color}
                className="w-full"
              >
                {buttonProps.text}
              </Button>
            </>
          ) : (
            <>
              <RowItem
                label="Balance"
                content={`${
                  isPut
                    ? formatUnits(
                        userTokenBalances.collateralTokenBalance,
                        DECIMALS_USD,
                      )
                    : formatUnits(
                        userTokenBalances.underlyingTokenBalance,
                        DECIMALS_TOKEN,
                      )
                }`}
              />
              <Button
                variant="contained"
                disabled={buttonProps?.disabled}
                onClick={buttonProps.action}
                color={buttonProps.color}
                className="w-full"
              >
                {buttonProps.text}
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
            breakEven={
              isPut
                ? selectedStrike -
                  Number(formatUnits(tokenAmountToSpend, DECIMALS_USD))
                : selectedStrike +
                  Number(formatUnits(tokenAmountToSpend, DECIMALS_TOKEN))
            }
            optionPrice={Number(
              isPut
                ? formatUnits(tokenAmountToSpend, DECIMALS_USD)
                : formatUnits(tokenAmountToSpend, DECIMALS_TOKEN),
            )}
            amount={Number(amountDebounced)}
            isPut={isPut}
            price={clammMarkPrice}
            symbol={underlyingTokenSymbol}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AsidePanel;
