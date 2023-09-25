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
import { Button, Skeleton } from '@dopex-io/ui';
import { formatDistance } from 'date-fns';
import { useDebounce } from 'use-debounce';
import wagmiConfig from 'wagmi-config';
import { writeContract } from 'wagmi/actions';

import { useBoundStore } from 'store';
import { DepositStrike, PurchaseStrike, Strikes } from 'store/Vault/clamm';

import ConnectButton from 'components/common/ConnectButton';
import PnlChart from 'components/common/PnlChart';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import generateStrikes from 'utils/clamm/generateStrikes';
import getPremium from 'utils/clamm/getPremium';
import getPrices from 'utils/clamm/getPrices';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { getBlockTime } from 'utils/contracts';
import { getUserBalance } from 'utils/contracts/getERC20Info';
import formatAmount from 'utils/general/formatAmount';

import { EXPIRIES, EXPIRIES_BY_INDEX, EXPIRIES_MENU } from 'constants/clamm';

import ButtonGroup from './components/ButtonGroup';
import ClammInput from './components/ClammInput';
import ExpiriesMenu from './components/ExpiriesMenu';
import StrikesMenu from './components/StrikesMenu';
import TradeSideMenu from './components/TradeSideMenu';

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

const DEFAULT_CLAMM_STRIKE_DATA = {
  callPurchaseStrikes: [],
  putPurchaseStrikes: [],
  callDepositStrikes: [],
  putDepositStrikes: [],
};

const AsidePanel = () => {
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
    loading,
    setLoading,
    selectedClammStrike,
    setSelectedClammStrike,
    markPrice,
    fullReload,
  } = useBoundStore();

  const [strikes, setStrikes] = useState<Strikes>(DEFAULT_CLAMM_STRIKE_DATA);
  const [inputAmount, setInputAmount] = useState<string>('1');
  const [tradeOrLpIndex, setTradeOrLpIndex] = useState<number>(0);
  const [selectedExpiry, setSelectedExpiry] = useState<number>(0);
  const [approved, setApproved] = useState<boolean>(false);
  const [amountDebounced] = useDebounce(inputAmount, 1000);
  const [premium, setPremium] = useState<bigint>(0n);
  const [depositAmount, setDepositAmount] = useState<bigint>(0n);
  const [userTokenBalances, setUserTokenBalances] = useState({
    collateralTokenBalance: 0n,
    underlyingTokenBalance: 0n,
  });

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
    [setSelectedClammStrike],
  );

  const strikeElement = useCallback(
    (strike: DepositStrike | PurchaseStrike, key: number) => ({
      textContent: (
        <div
          key={key}
          onClick={() => handleStrikeSelected(strike)}
          className="text-sm text-white flex w-full items-center justify-center border]"
        >
          <div className="w-full h-full pr-[4rem]">
            {(isPut ? strike.tickLowerPrice : strike.tickUpperPrice).toFixed(5)}
          </div>
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

  const balanceOrOptionsAmount = useMemo(() => {
    const balance = Number(
      formatUnits(
        isPut
          ? userTokenBalances.collateralTokenBalance
          : userTokenBalances.underlyingTokenBalance,
        selectedToken.decimals,
      ),
    ).toFixed(5);

    const selectedStrike = selectedClammStrike as PurchaseStrike;

    if (tradeOrLpIndex === 0) {
      if (!selectedStrike || !selectedStrike.optionsAvailable) return '0';
      return selectedStrike.optionsAvailable.toFixed(5);
    } else {
      return balance;
    }
  }, [
    isPut,
    selectedClammStrike,
    selectedToken.decimals,
    tradeOrLpIndex,
    userTokenBalances.collateralTokenBalance,
    userTokenBalances.underlyingTokenBalance,
  ]);

  const readablePremium = useMemo(() => {
    return {
      amount: formatUnits(premium, selectedToken.decimals),
      symbol: selectedToken.symbol,
    };
  }, [premium, selectedToken.decimals, selectedToken.symbol]);

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

      const { tickLower, tickUpper } = selectedClammStrike;
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

        const _amount = parseUnits(amountDebounced, selectedToken.decimals);

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
      tradeOrLpIndex === 0 ? optionsPool.address : positionManagerAddress;

    const amountToSpend = tradeOrLpIndex === 0 ? premium : depositAmount;
    const allowance = await token.allowance(userAddress, spender);

    if (BigNumber.from(amountToSpend.toString()).gt(allowance)) {
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
    depositAmount,
    premium,
  ]);

  // const updateTokenAmountsToSpend = useCallback(async () => {
  //   if (!provider) return;
  //   if (!optionsPool) return;
  //   if (!selectedClammStrike) return;
  //   setLoading('asidePanelButton', true);

  //   const blockTimestamp = Number(await getBlockTime(provider));
  //   const { tickLower, tickUpper, tickLowerPrice } = selectedClammStrike;

  //   const { iv, currentPrice, strike } = (await getPrices(
  //     optionsPool.address,
  //     optionsPool.uniswapV3PoolAddress,
  //     tickLower,
  //     tickUpper,
  //     BigInt(selectedClammExpiry),
  //     isPut,
  //   )) as {
  //     currentPrice: bigint;
  //     strike: bigint;
  //     iv: any;
  //   };

  //   let amount = parseUnits(amountDebounced, selectedToken.decimals);

  //   if (tradeOrLpIndex === 0) {
  //     try {
  //       const collateralAmount = isPut
  //         ? parseUnits(
  //             (Number(amountDebounced) * tickLowerPrice).toString(),
  //             selectedToken.decimals,
  //           )
  //         : amount;
  //       amount =
  //         tradeOrLpIndex === 0
  //           ? ((await getPremium(
  //               optionsPool.address,
  //               isPut,
  //               blockTimestamp + selectedClammExpiry,
  //               strike,
  //               currentPrice,
  //               BigInt(iv),
  //               collateralAmount,
  //             )) as bigint)
  //           : amount;
  //       setTokenAmountToSpend(amount);
  //     } catch {
  //       setLoading('asidePanelButton', false);
  //       setTokenAmountToSpend(0n);
  //     }
  //   } else {
  //     setTokenAmountToSpend(amount);
  //   }
  //   setLoading('asidePanelButton', false);
  // }, [
  //   selectedClammStrike,
  //   selectedToken.decimals,
  //   optionsPool,
  //   amountDebounced,
  //   isPut,
  //   tradeOrLpIndex,
  //   provider,
  //   selectedClammExpiry,
  //   setLoading,
  // ]);

  const handleMintOptions = useCallback(async () => {
    if (!optionsPool) return;
    const { request } = await wagmiConfig.publicClient.simulateContract({
      address: optionsPool.address,
      abi: OptionPools__factory.abi,
      functionName: isPut ? 'mintPutOptionRoll' : 'mintCallOptionRoll',
      args: [
        {
          pool: optionsPool.uniswapV3PoolAddress,
          tickLower: parametersForMint.tickLower,
          tickUpper: parametersForMint.tickUpper,
          liquidityToUse: parametersForMint.liquidityToUse - 1n,
          ttl: parametersForMint.ttl,
        },
      ],
      account: userAddress,
    });

    await writeContract(request);
    await checkApproved();
    await fullReload();
  }, [
    optionsPool,
    fullReload,
    checkApproved,
    parametersForMint.tickLower,
    parametersForMint.tickUpper,
    userAddress,
    isPut,
    parametersForMint.liquidityToUse,
    parametersForMint.ttl,
  ]);

  const handleMintPosition = useCallback(async () => {
    const { request } = await wagmiConfig.publicClient.simulateContract({
      address: parametersForMint.to,
      abi: PositionsManager__factory.abi,
      functionName: 'mintPosition',
      args: [
        {
          liquidity: parametersForMint.liquidity!,
          pool: parametersForMint.pool,
          tickLower: parametersForMint.tickLower!,
          tickUpper: parametersForMint.tickUpper!,
        },
      ],
      account: userAddress,
    });

    await writeContract(request);
    await checkApproved();
    await fullReload();
  }, [
    fullReload,
    checkApproved,
    parametersForMint.to,
    parametersForMint.liquidity,
    parametersForMint.pool,
    parametersForMint.tickLower,
    parametersForMint.tickUpper,
    userAddress,
  ]);

  const handleSelectExpiry = useCallback(
    (index: number) => {
      setSelectedExpiry(index);
      updateSelectedExpiry(EXPIRIES_BY_INDEX[index]);
    },
    [updateSelectedExpiry],
  );

  const handleTradeOrLp = useCallback(
    (index: number) => {
      setTradeOrLpIndex(index);
      setSelectedClammStrike(undefined);
      setPremium(0n);
      setInputAmount('0');
    },
    [setSelectedClammStrike],
  );

  const handleIsPut = useCallback(
    (index: number) => {
      setIsPut(index === 1);
      setSelectedClammStrike(undefined);
      setPremium(0n);
    },
    [setIsPut, setSelectedClammStrike],
  );

  const handleMax = useCallback(() => {
    if (!selectedClammStrike) return;
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
    if (isNaN(Number(e.target.value))) return;
    setInputAmount(e.target.value);
  };

  const handleApprove = useCallback(async () => {
    if (!optionsPool) return;

    const approveAmount =
      tradeOrLpIndex === 0
        ? premium + (premium * 200n) / 10000n // Approving 2% more to account for premium instant changes on contract side
        : parseUnits(amountDebounced, selectedToken.decimals);

    const { request } = await wagmiConfig.publicClient.simulateContract({
      address: selectedToken.address as Address,
      abi: ERC20__factory.abi,
      functionName: 'approve',
      args: [
        tradeOrLpIndex === 0 ? optionsPool.address : positionManagerAddress,
        approveAmount,
      ],
      account: userAddress,
    });

    await writeContract(request);
    await checkApproved();
  }, [
    optionsPool,
    userAddress,
    checkApproved,
    positionManagerAddress,
    selectedToken.address,
    tradeOrLpIndex,
    amountDebounced,
    premium,
    selectedToken.decimals,
  ]);

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
    let disabled = loading.asidePanelButton;

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

    if (Number(amountDebounced) === 0) {
      disabled = true;
      text = 'Enter amount';
    }

    if (tradeOrLpIndex === 0) {
      if (Number(amountDebounced) !== 0 && premium === 0n) {
        disabled = true;
        text = 'Premium is zero, Try a different expiry or strike.';
      }
    }

    if (!selectedClammStrike) {
      text = 'Select a strike';
      disabled = true;
    }

    if (!approved) {
      text = 'Approve';
      color = 'primary';
      action = handleApprove;
    }

    if ((tradeOrLpIndex === 0 ? premium : depositAmount) > consideredBalance) {
      text = 'Insufficient Balance';
      color = 'mineshaft';
      disabled = true;
    }

    return {
      text,
      action,
      color,
      disabled,
    };
  }, [
    depositAmount,
    premium,
    selectedClammStrike,
    amountDebounced,
    isPut,
    userTokenBalances.collateralTokenBalance,
    userTokenBalances.underlyingTokenBalance,
    tradeOrLpIndex,
    approved,
    handleMintOptions,
    handleMintPosition,
    handleApprove,
    loading,
  ]);

  const validExpiries = useMemo(() => {
    const defaultExpires = EXPIRIES_MENU.map((expiry) => ({
      expiry: expiry,
      disabled: false,
    }));

    if (!selectedClammStrike || tradeOrLpIndex === 1) return defaultExpires;

    const clammStrikeData = ticksData.find(
      ({ tickLower, tickUpper }) =>
        tickLower === selectedClammStrike.tickLower &&
        tickUpper === selectedClammStrike.tickUpper,
    );

    if (!clammStrikeData) return defaultExpires;

    const premiums = isPut
      ? clammStrikeData.putPremiums
      : clammStrikeData.callPremiums;

    return defaultExpires.map(({ expiry }) => {
      const premiumToNumber = Number(premiums[EXPIRIES[expiry]].toString());
      return {
        expiry: expiry,
        disabled: premiumToNumber === 0,
      };
    });
  }, [isPut, selectedClammStrike, ticksData, tradeOrLpIndex]);

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

  const updatePremium = useCallback(async () => {
    if (
      !provider ||
      !optionsPool ||
      !selectedClammStrike ||
      tradeOrLpIndex === 1
    )
      return;

    setLoading('tokenAmountsToSpend', true);
    const blockTimestamp = Number(await getBlockTime(provider));
    const { tickLower, tickUpper } = selectedClammStrike;

    const { iv, currentPrice, strike } = (await getPrices(
      optionsPool.address,
      optionsPool.uniswapV3PoolAddress,
      tickLower,
      tickUpper,
      BigInt(selectedClammExpiry),
      isPut,
    )) as {
      currentPrice: bigint;
      strike: bigint;
      iv: any;
    };

    let amount = parseUnits(amountDebounced, selectedToken.decimals);
    try {
      const collateralAmount = isPut
        ? (amount * parseUnits('10', selectedToken.decimals)) / strike
        : amount;
      amount =
        tradeOrLpIndex === 0
          ? ((await getPremium(
              optionsPool.address,
              isPut,
              blockTimestamp + selectedClammExpiry,
              strike,
              currentPrice,
              BigInt(iv),
              collateralAmount,
            )) as bigint)
          : amount;

      setPremium(amount);
    } catch {
      setPremium(0n);
    }
    setLoading('tokenAmountsToSpend', true);
  }, [
    amountDebounced,
    isPut,
    optionsPool,
    provider,
    selectedClammExpiry,
    selectedClammStrike,
    tradeOrLpIndex,
    selectedToken.decimals,
    setLoading,
  ]);

  const updateDepositAmount = useCallback(() => {
    if (
      !provider ||
      !optionsPool ||
      !selectedClammStrike ||
      tradeOrLpIndex === 0
    )
      return;

    setDepositAmount(parseUnits(amountDebounced, selectedToken.decimals));
  }, [
    tradeOrLpIndex,
    amountDebounced,
    optionsPool,
    provider,
    selectedClammStrike,
    selectedToken.decimals,
  ]);

  // const readableDepositAmount = useMemo(() => {
  //   return {
  //     amount: formatUnits(depositAmount, selectedToken.decimals),
  //     symbol: selectedToken.symbol,
  //   };
  // }, [depositAmount, selectedToken.decimals, selectedToken.symbol]);

  useEffect(() => {
    loadStrikes();
  }, [loadStrikes]);

  useEffect(() => {
    updateUserTokensBalances();
  }, [updateUserTokensBalances]);

  useEffect(() => {
    updatePremium();
  }, [updatePremium]);

  useEffect(() => {
    updateDepositAmount();
  }, [updateDepositAmount]);

  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col bg-cod-gray rounded-lg p-3 space-y-4">
        <ButtonGroup
          active={tradeOrLpIndex}
          labels={['Trade', 'Liquidity Provision']}
          handleClick={handleTradeOrLp}
        />
        {/* <div className="flex border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2 gap-3">
          <div className="flex-1">
            <span className="text-stieglitz text-sm">Side</span>
            <BgButtonGroup
              active={isPut ? 1 : 0}
              labels={['Call', 'Put']}
              handleClick={handleIsPut}
            />
          </div>
        </div> */}
        <div className="mt-2 flex items-center justify-center space-x-1">
          <StrikesMenu
            loading={loading.ticksData}
            selectedStrike={selectedClammStrike as PurchaseStrike}
            strikes={readableStrikes}
          />
          {/* <ExpiriesMenu
            updateSelectedExpiry={updateSelectedExpiry}
            expiries={validExpiries}
          /> */}
          <TradeSideMenu
            activeIndex={isPut ? 1 : 0}
            setActiveIndex={handleIsPut}
          />
        </div>
        {tradeOrLpIndex === 0 ? (
          <ExpiriesMenu
            expiries={validExpiries}
            selectedExpiry={selectedExpiry}
            handleSelectExpiry={handleSelectExpiry}
          />
        ) : null}
        <ClammInput
          inputAmount={inputAmount}
          handleInputAmountChange={handleInputAmount}
          handleMax={handleMax}
          selectedTokenSymbol={selectedToken.symbol}
          optionsAvailable={balanceOrOptionsAmount}
          depositBalance={balanceOrOptionsAmount}
          isTrade={tradeOrLpIndex === 0}
        />
        <div className="border border-[#1E1E1E] bg-[#1E1E1E] rounded-md p-2">
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
                  loading.asidePanelButton ? (
                    <Skeleton height={10} />
                  ) : (
                    <div className="flex">
                      <p className="inline-block mr-1">
                        {readablePremium.amount}
                      </p>
                      <p className="inline-block text-stieglitz">
                        {readablePremium.symbol}
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
              {userAddress === undefined || userAddress === zeroAddress ? (
                <ConnectButton className="w-full" />
              ) : (
                <Button
                  variant="contained"
                  onClick={buttonProps.action}
                  disabled={buttonProps.disabled}
                  color={buttonProps.color}
                  className="w-full mt-2"
                >
                  {buttonProps.text}
                </Button>
              )}
            </>
          ) : (
            <>
              {/* <RowItem
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
              /> */}
              {userAddress === undefined ? (
                <ConnectButton className="w-full" />
              ) : (
                <Button
                  variant="contained"
                  disabled={buttonProps.disabled}
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
      {tradeOrLpIndex === 0 ? (
        <div className="bg-cod-gray p-3 rounded-lg">
          <PnlChart
            breakEven={
              isPut
                ? markPrice - Number(readablePremium.amount)
                : markPrice + Number(readablePremium.amount) * markPrice
            }
            optionPrice={Number(readablePremium.amount)}
            amount={Number(amountDebounced)}
            isPut={isPut}
            price={markPrice}
            symbol={'Mark'}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AsidePanel;
