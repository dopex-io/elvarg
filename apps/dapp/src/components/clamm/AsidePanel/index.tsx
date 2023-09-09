import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import { Address, formatUnits, parseUnits, zeroAddress } from 'viem';

import {
  ERC20__factory,
  OptionPools__factory,
  PositionsManager__factory,
} from '@dopex-io/sdk';
import { Button, Input, Menu, Skeleton } from '@dopex-io/ui';
import { formatDistance } from 'date-fns';
import { useDebounce } from 'use-debounce';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useBoundStore } from 'store';

import { usePrepareApprove } from 'hooks/ssov/usePrepareWrites';

import ConnectButton from 'components/common/ConnectButton';
import PnlChart from 'components/common/PnlChart';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import generateStrikes from 'utils/clamm/generateStrikes';
import getPremium from 'utils/clamm/getPremium';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { getBlockTime } from 'utils/contracts';
import { getUserBalance } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { EXPIRIES_BY_INDEX, EXPIRIES_MENU } from 'constants/clamm';
import { DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

import DisclaimerDialog from './DisclaimerDialog';

type Strikes = {
  callPurchaseStrikes: PurchaseStrike[];
  putPurchaseStrikes: PurchaseStrike[];
  callDepositStrikes: DepositStrike[];
  putDepositStrikes: DepositStrike[];
};

type DepositStrike = {
  tickLower: number;
  tickUpper: number;
  tickLowerPrice: number;
  tickUpperPrice: number;
};

type PurchaseStrike = DepositStrike & {
  optionsAvailable: number;
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

const DEFAULT_CLAMM_STRIKE_DATA = {
  callPurchaseStrikes: [],
  putPurchaseStrikes: [],
  callDepositStrikes: [],
  putDepositStrikes: [],
};

type AsidePanelProps = {
  loadOptionsPool: Function;
  loadPositions: Function;
};

const AsidePanel = ({ loadOptionsPool, loadPositions }: AsidePanelProps) => {
  const {
    isPut,
    provider,
    userAddress,
    setIsPut,
    updateSelectedExpiry,
    optionsPool,
    ticksData,
    keys,
    positionManagerAddress,
    selectedClammExpiry,
  } = useBoundStore();

  const [strikes, setStrikes] = useState<Strikes>(DEFAULT_CLAMM_STRIKE_DATA);

  const [selectedClammStrike, setSelectedClammStrike] = useState<
    DepositStrike | PurchaseStrike
  >();
  const [loading, setLoading] = useState<boolean>(false);
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
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);

  const selectedToken = useMemo(() => {
    if (!optionsPool)
      return {
        symbol: '-',
        address: '0x0',
        decimals: 0,
      };
    return {
      symbol:
        optionsPool[isPut ? keys.putAssetSymbolKey : keys.callAssetSymbolKey],
      address:
        optionsPool[isPut ? keys.putAssetAddressKey : keys.callAssetAddressKey],
      decimals:
        optionsPool[
          isPut ? keys.putAssetDecimalsKey : keys.callAssetDecimalsKey
        ],
    };
  }, [
    keys.callAssetDecimalsKey,
    keys.putAssetDecimalsKey,
    optionsPool,
    isPut,
    keys.callAssetAddressKey,
    keys.callAssetSymbolKey,
    keys.putAssetAddressKey,
    keys.putAssetSymbolKey,
  ]);

  const handleStrikeSelected = useCallback(
    (strike: DepositStrike | PurchaseStrike) => {
      setSelectedClammStrike(strike);
    },
    [],
  );

  const strikeElement = useCallback(
    (strike: DepositStrike | PurchaseStrike, key: number) => ({
      textContent: (
        <div
          key={key}
          onClick={() => handleStrikeSelected(strike)}
          className="text-sm text-white flex w-full items-center justify-center overflow-x-hidden"
        >
          <span className="w-full pr-[25rem] py-1">
            {(isPut ? strike.tickLowerPrice : strike.tickUpperPrice).toFixed(5)}
          </span>
        </div>
      ),
    }),
    [handleStrikeSelected, isPut],
  );

  const readableStrikes = useMemo(() => {
    const {
      putDepositStrikes,
      callDepositStrikes,
      putPurchaseStrikes,
      callPurchaseStrikes,
    } = strikes;
    if (tradeOrLpIndex === 1) {
      if (isPut) {
        return putDepositStrikes.map((strike, index) =>
          strikeElement(strike, index),
        );
      } else {
        return callDepositStrikes.map((strike, index) =>
          strikeElement(strike, index),
        );
      }
    } else {
      if (isPut) {
        return putPurchaseStrikes.map((strike, index) =>
          strikeElement(strike, index),
        );
      } else {
        return callPurchaseStrikes.map((strike, index) =>
          strikeElement(strike, index),
        );
      }
    }
  }, [strikes, isPut, tradeOrLpIndex, strikeElement]);

  type MintPostionOrOptionsParams = {
    to: Address;
    tickLower: number;
    tickUpper: number;
    functionName: any;
    pool: Address;
    callOrPut: boolean;
    ttl: bigint;
    liquidity: bigint;
    liquidityToUse: bigint;
  };

  const parametersForMint: MintPostionOrOptionsParams | undefined =
    useMemo(() => {
      if (!optionsPool || !selectedClammStrike)
        return {
          to: zeroAddress,
          tickLower: 0,
          tickUpper: 0,
          functionName: '',
          pool: zeroAddress,
          callOrPut: false,
          ttl: 0n,
          liquidity: 0n,
          liquidityToUse: 0n,
        };

      const { tickLower, tickUpper, tickLowerPrice } = selectedClammStrike;
      const amount = parseUnits(amountDebounced, selectedToken.decimals);

      let to =
        tradeOrLpIndex === 0 ? optionsPool.address : positionManagerAddress;
      let liquidityToUse = 0n;
      let liquidity = 0n;
      let functionName = '';
      let pool = optionsPool.uniswapV3PoolAddress;
      let ttl = BigInt(selectedClammExpiry);
      let callOrPut = !isPut;

      if (tradeOrLpIndex === 0) {
        functionName = isPut ? 'mintPutOptionRoll' : 'mintCallOptionRoll';

        const _amount = parseUnits(
          isPut
            ? (Number(amountDebounced) * tickLowerPrice).toString()
            : amountDebounced,
          selectedToken.decimals,
        );

        liquidityToUse = optionsPool[
          isPut ? keys.putAssetGetLiquidity : keys.callAssetGetLiquidity
        ](
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          _amount,
        );
      } else {
        functionName = 'mintPosition';
        liquidity = optionsPool[
          isPut ? keys.putAssetGetLiquidity : keys.callAssetGetLiquidity
        ](
          getSqrtRatioAtTick(BigInt(tickLower)),
          getSqrtRatioAtTick(BigInt(tickUpper)),
          amount,
        );
      }

      console.log({
        to,
        liquidityToUse,
        liquidity,
        tickLower,
        tickUpper,
        functionName,
        ttl,
        callOrPut,
        pool,
      });

      return {
        to,
        liquidityToUse,
        liquidity,
        tickLower,
        tickUpper,
        functionName,
        ttl,
        callOrPut,
        pool,
      };
    }, [
      positionManagerAddress,
      keys.putAssetGetLiquidity,
      keys.callAssetGetLiquidity,
      optionsPool,
      selectedClammExpiry,
      selectedClammStrike,
      tradeOrLpIndex,
      amountDebounced,
      isPut,
      selectedToken.decimals,
    ]);

  const checkApproved = useCallback(async () => {
    if (!provider || !userAddress || !optionsPool) return;
    const token = ERC20__factory.connect(selectedToken.address, provider);
    const spender =
      tradeOrLpIndex === 0 ? optionsPool?.address : positionManagerAddress;
    const allowance = await token.allowance(userAddress, spender);
    if (BigNumber.from(tokenAmountToSpend.toString()).gt(allowance)) {
      setApproved(false);
    } else {
      setApproved(true);
    }
  }, [
    positionManagerAddress,
    optionsPool,
    selectedToken.address,
    userAddress,
    tradeOrLpIndex,
    provider,
    tokenAmountToSpend,
  ]);

  const updateTokenAmountsToSpend = useCallback(async () => {
    if (!provider) return;
    if (!optionsPool) return;

    setLoading(true);
    const blockTimestamp = Number(await getBlockTime(provider));
    let amount = 0n;
    try {
      amount =
        tradeOrLpIndex === 0
          ? ((await getPremium(
              optionsPool.address,
              isPut,
              blockTimestamp + selectedExpiry,
              0n,
              0n,
              0n,
              0n,
            )) as bigint)
          : parseUnits(amountDebounced, selectedToken.decimals);
    } catch {
      setLoading(false);
    }
    setTokenAmountToSpend(amount);
    setLoading(false);
  }, [
    selectedToken.decimals,
    optionsPool,
    amountDebounced,
    isPut,
    tradeOrLpIndex,
    provider,
    selectedExpiry,
  ]);

  const mintOptionsConfig = usePrepareContractWrite({
    abi: OptionPools__factory.abi,
    address: parametersForMint.to,
    functionName: isPut ? 'mintPutOptionRoll' : 'mintCallOptionRoll',
    args: [
      {
        pool: parametersForMint.pool,
        tickLower: parametersForMint.tickLower,
        tickUpper: parametersForMint.tickUpper,
        liquidityToUse: parametersForMint.liquidityToUse,
        ttl: parametersForMint.ttl,
      },
    ],
  });

  const writeMintOptions = useContractWrite(mintOptionsConfig.config);

  const mintPositionConfig = usePrepareContractWrite({
    abi: PositionsManager__factory.abi,
    address: parametersForMint.to,
    functionName: 'mintPosition',
    args: [
      {
        liquidity: parametersForMint.liquidity!,
        pool: parametersForMint.pool,
        tickLower: parametersForMint.tickLower!,
        tickUpper: parametersForMint.tickUpper!,
      },
    ],
  });

  const writeMintPosition = useContractWrite(mintPositionConfig.config);

  const handleMintOptions = useCallback(async () => {
    const { writeAsync } = writeMintOptions;
    if (!writeAsync) return;

    await writeAsync();
    await loadOptionsPool();
    await loadPositions();
  }, [loadOptionsPool, loadPositions, writeMintOptions]);

  const handleMintPosition = useCallback(async () => {
    const { writeAsync } = writeMintPosition;
    if (!writeAsync) return;

    await writeAsync();
    await loadOptionsPool();
    await loadPositions();
  }, [loadOptionsPool, loadPositions, writeMintPosition]);

  const handleSelectExpiry = useCallback(
    (index: number) => {
      setSelectedExpiry(index);
      updateSelectedExpiry(EXPIRIES_BY_INDEX[index]);
    },
    [updateSelectedExpiry],
  );

  const handleTradeOrLp = useCallback((index: number) => {
    setTradeOrLpIndex(index);
    setSelectedClammStrike(undefined);
  }, []);

  const handleIsPut = useCallback(
    (index: number) => {
      setIsPut(index === 1);
      setSelectedClammStrike(undefined);
    },
    [setIsPut],
  );

  const handleMax = useCallback(() => {
    setInputAmount(
      tradeOrLpIndex === 0
        ? (selectedClammStrike as PurchaseStrike).optionsAvailable.toString()
        : formatUnits(
            isPut
              ? userTokenBalances.collateralTokenBalance
              : userTokenBalances.underlyingTokenBalance,
            selectedToken.decimals,
          ),
    );
  }, [
    isPut,
    selectedClammStrike,
    tradeOrLpIndex,
    userTokenBalances.collateralTokenBalance,
    userTokenBalances.underlyingTokenBalance,
    selectedToken.decimals,
  ]);

  const handleInputAmount = (e: { target: { value: SetStateAction<any> } }) => {
    setInputAmount(e.target.value);
  };

  // const handleManualStrikeAmount = (e: {
  //   target: { value: SetStateAction<any> };
  // }) => {
  //   updateSelectedStrike(Number(e.target.value));
  // };

  const tokenApproveConfig = usePrepareApprove({
    spender:
      tradeOrLpIndex === 0 ? optionsPool?.address! : positionManagerAddress,
    token: selectedToken.address as Address,
    amount: tokenAmountToSpend,
  });

  const approveTokens = useContractWrite(tokenApproveConfig);

  const handleApprove = useCallback(async () => {
    const { writeAsync } = approveTokens;
    if (!writeAsync) return;
    await writeAsync();
    await checkApproved();
  }, [approveTokens, checkApproved]);

  const buttonProps = useMemo(() => {
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

    if (tradeOrLpIndex === 0) {
      text = 'Buy';
      action = handleMintOptions;
    } else {
      text = 'Deposit';
      action = handleMintPosition;
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

    // if (!agree) {
    //   action = () => setShowDisclaimer(true);
    // }

    return {
      text,
      action,
      color,
      disabled,
    };
  }, [
    isPut,
    userTokenBalances.collateralTokenBalance,
    userTokenBalances.underlyingTokenBalance,
    tradeOrLpIndex,
    tokenAmountToSpend,
    approved,
    handleMintOptions,
    handleMintPosition,
    handleApprove,
  ]);

  const loadStrikes = useCallback(() => {
    if (!optionsPool) return;
    const { tick, tickSpacing, token0Decimals, token1Decimals, inversePrice } =
      optionsPool;

    const callPurchaseStrikes = ticksData
      .map(
        ({
          tickUpperPrice,
          tickLowerPrice,
          liquidityAvailable,
          tickLower,
          tickUpper,
        }) => {
          const liquidityAvailableAtTick = formatUnits(
            liquidityAvailable[keys.callAssetAmountKey],
            optionsPool[keys.callAssetDecimalsKey],
          );
          const optionsAvailable = Number(liquidityAvailableAtTick);

          return {
            tickLower,
            tickUpper,
            tickLowerPrice,
            tickUpperPrice,
            optionsAvailable,
          };
        },
      )
      .filter(({ optionsAvailable }) => optionsAvailable > 0);

    const putPurchaseStrikes = ticksData
      .map(
        ({
          tickUpperPrice,
          tickLowerPrice,
          liquidityAvailable,
          tickLower,
          tickUpper,
        }) => {
          const liquidityAvailableAtTick = formatUnits(
            liquidityAvailable[keys.putAssetAmountKey],
            optionsPool[keys.putAssetDecimalsKey],
          );
          const optionsAvailable =
            Number(liquidityAvailableAtTick) / tickLowerPrice;

          return {
            tickLower,
            tickUpper,
            tickLowerPrice,
            tickUpperPrice,
            optionsAvailable,
          };
        },
      )
      .filter(({ optionsAvailable }) => optionsAvailable > 0);

    const generatedStrikes = generateStrikes(
      tick,
      tickSpacing,
      10 ** token0Decimals,
      10 ** token1Decimals,
      inversePrice,
      100,
    );
    setStrikes({
      callPurchaseStrikes,
      putPurchaseStrikes,
      putDepositStrikes: inversePrice
        ? generatedStrikes.token1Strikes
        : generatedStrikes.token0Strikes,
      callDepositStrikes: inversePrice
        ? generatedStrikes.token0Strikes
        : generatedStrikes.token1Strikes,
    });
  }, [
    optionsPool,
    ticksData,
    keys.callAssetAmountKey,
    keys.callAssetDecimalsKey,
    keys.putAssetAmountKey,
    keys.putAssetDecimalsKey,
  ]);

  const updateUserTokensBalances = useCallback(async () => {
    if (!optionsPool) return;
    const [collateralTokenBalance, underlyingTokenBalance] = await Promise.all([
      getUserBalance({
        owner: userAddress,
        tokenAddress: optionsPool[keys.putAssetAddressKey],
      }),
      getUserBalance({
        owner: userAddress,
        tokenAddress: optionsPool[keys.callAssetAddressKey],
      }),
    ]);
    setUserTokenBalances({
      collateralTokenBalance: collateralTokenBalance ?? 0n,
      underlyingTokenBalance: underlyingTokenBalance ?? 0n,
    });
  }, [
    keys.callAssetAddressKey,
    keys.putAssetAddressKey,
    optionsPool,
    userAddress,
  ]);

  useEffect(() => {
    loadStrikes();
  }, [loadStrikes]);

  useEffect(() => {
    updateUserTokensBalances();
  }, [updateUserTokensBalances]);

  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  useEffect(() => {
    updateTokenAmountsToSpend();
  }, [updateTokenAmountsToSpend]);

  return (
    <div className="flex flex-col space-y-4 min-w-[280px]">
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
          <>
            <Menu
              color="mineshaft"
              dropdownVariant="icon"
              handleSelection={() => {}}
              selection={
                <span className="text-sm text-white flex">
                  {!selectedClammStrike ? (
                    'Select strike'
                  ) : (
                    <>
                      <p className="text-stieglitz inline mr-1">$</p>
                      {(isPut
                        ? selectedClammStrike?.tickLowerPrice
                        : selectedClammStrike?.tickUpperPrice
                      )?.toFixed(5)}
                    </>
                  )}
                </span>
              }
              data={readableStrikes}
              className="w-full"
              showArrow
            />
          </>
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
                selectedToken.symbol,
              )?.toLowerCase()}.svg`}
              alt={String(selectedToken.symbol)?.toLowerCase()}
              className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
            />
          }
          bottomElement={
            <CustomBottomElement
              symbol={selectedToken.symbol}
              label={tradeOrLpIndex === 0 ? 'Options' : 'Deposit amount'}
              value={formatAmount(
                tradeOrLpIndex === 0
                  ? selectedClammStrike
                    ? (selectedClammStrike as PurchaseStrike).optionsAvailable
                    : 0
                  : formatUnits(
                      isPut
                        ? userTokenBalances.collateralTokenBalance
                        : userTokenBalances.underlyingTokenBalance,
                      selectedToken.decimals,
                    ),

                5,
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
                  new Date(),
                )}
              />
              <RowItem
                label="Premium"
                content={
                  loading ? (
                    <Skeleton height={10} />
                  ) : (
                    <div className="flex">
                      <p className="inline-block mr-1">
                        {formatUnits(
                          tokenAmountToSpend,
                          selectedToken.decimals,
                        )}
                      </p>
                      <p className="inline-block text-stieglitz">
                        {selectedToken.symbol}
                      </p>
                    </div>
                  )
                }
              />
              <RowItem
                label="Balance"
                content={
                  <div className="flex">
                    <p className="inline-block">
                      {formatAmount(
                        isPut
                          ? formatUnits(
                              userTokenBalances.collateralTokenBalance,
                              selectedToken.decimals,
                            )
                          : formatUnits(
                              userTokenBalances.underlyingTokenBalance,
                              selectedToken.decimals,
                            ),
                        3,
                      )}{' '}
                    </p>
                    <p className="inline-block ml-1 text-stieglitz">
                      {selectedToken.symbol}
                    </p>
                  </div>
                }
              />
              {userAddress === undefined ? (
                <ConnectButton className="w-full" />
              ) : (
                <Button
                  variant="contained"
                  onClick={buttonProps.action}
                  color={buttonProps.color}
                  className="w-full"
                >
                  {buttonProps.text}
                </Button>
              )}
            </>
          ) : (
            <>
              <RowItem
                label="Balance"
                content={
                  <div className="flex">
                    <p className="inline-block">
                      {formatAmount(
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
                      )}{' '}
                    </p>
                    <p className="inline-block ml-1 text-stieglitz">
                      {selectedToken.symbol}
                    </p>
                  </div>
                }
              />
              {userAddress === undefined ? (
                <ConnectButton className="w-full" />
              ) : (
                <Button
                  variant="contained"
                  disabled={buttonProps?.disabled}
                  onClick={buttonProps.action}
                  color={buttonProps.color}
                  className="w-full"
                >
                  {buttonProps.text}
                </Button>
              )}
            </>
          )}
        </div>

        {/* {!agree && (
          <DisclaimerDialog
            isOpen={showDisclaimer}
            handleClose={() => {
              setShowDisclaimer(false);
            }}
            handleAgree={() => {
              setAgree(true);
            }}
          />
        )} */}
        {/* remove for MVP */}
        {/* <StrikeRangeSelectorWrapper /> */}
      </div>
      {/* {tradeOrLpIndex === 0 ? (
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
            price={markPrice}
            symbol={underlyingTokenSymbol}
          />
        </div>
      ) : null} */}
    </div>
  );
};

export default AsidePanel;
