import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import {
  ERC20__factory,
  GmxReader__factory,
  GmxVault__factory,
  InsuredLongsStrategy__factory,
  InsuredLongsUtils__factory,
} from '@dopex-io/sdk';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import { useDebounce } from 'use-debounce';

import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import Switch from 'components/UI/Switch';
import CustomInput from 'components/UI/CustomInput';
import CustomButton from 'components/UI/Button';
import StrategyDetails from 'components/atlantics/Dialogs/InsuredPerps/UseStrategy/StrategyDetails';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

import { useBoundStore } from 'store';
import { AtlanticsContext } from 'contexts/Atlantics';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';

import { MIN_EXECUTION_FEE } from 'constants/gmx';
import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';
import { CircularProgress } from '@mui/material';

const steps = 0.1;
const minMarks = 1.1;
const maxMarks = 10;

const INITIAL_LEVERAGE = getContractReadableAmount(1.1, 30);

const customSliderStyle = {
  '.MuiSlider-markLabel': {
    color: 'white',
  },
  '.MuiSlider-rail': {
    color: '#3E3E3E',
  },
  '.MuiSlider-mark': {
    color: 'white',
  },
  '.MuiSlider-thumb': {
    color: 'white',
  },
  '.MuiSlider-track': {
    color: '#22E1FF',
  },
};

export interface IStrategyDetails {
  positionSize: BigNumber;
  putOptionsPremium: BigNumber;
  putOptionsfees: BigNumber;
  positionFee: BigNumber;
  optionsAmount: BigNumber;
  markPrice: BigNumber;
  liquidationPrice: BigNumber;
  putStrike: BigNumber;
  expiry: BigNumber;
  depositUnderlying: boolean;
  swapFees: BigNumber;
  strategyFee: BigNumber;
  unwindFee: BigNumber;
}

interface IncreaseOrderParams {
  path: string[];
  indexToken: string;
  collateralDelta: BigNumber;
  positionSizeDelta: BigNumber;
  isLong: boolean;
}

const UseStrategyDialog = () => {
  const {
    signer,
    accountAddress,
    provider,
    contractAddresses,
    chainId,
    atlanticPool,
    atlanticPoolEpochData,
    userAssetBalances,
  } = useBoundStore();
  const { selectedPool } = useContext(AtlanticsContext);
  const [leverage, setLeverage] = useState<BigNumber>(INITIAL_LEVERAGE);
  const [increaseOrderParams, setIncreaseOrderParams] =
    useState<IncreaseOrderParams>({
      path: [],
      indexToken: '',
      collateralDelta: BigNumber.from(0),
      positionSizeDelta: BigNumber.from(0),
      isLong: true,
    });
  const [approved, setApproved] = useState<{
    quote: boolean;
    base: boolean;
  }>({
    quote: false,
    base: false,
  });
  const [openTokenSelector, setOpenTokenSelector] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>('USDC');
  const [positionBalance, setPositionBalance] = useState<string>('');
  const [depositUnderlying, setDeposutUnderlying] = useState<boolean>(false);
  const [strategyDetails, setStrategyDetails] = useState<IStrategyDetails>({
    positionSize: BigNumber.from(0),
    putOptionsPremium: BigNumber.from(0),
    putOptionsfees: BigNumber.from(0),
    optionsAmount: BigNumber.from(0),
    depositUnderlying: false,
    positionFee: BigNumber.from(0),
    markPrice: BigNumber.from(0),
    liquidationPrice: BigNumber.from(0),
    putStrike: BigNumber.from(0),
    expiry: BigNumber.from(0),
    swapFees: BigNumber.from(0),
    strategyFee: BigNumber.from(0),
    unwindFee: BigNumber.from(0),
  });
  const [, setLoading] = useState<boolean>(true);
  const [strategyDetailsLoading, setStrategyDetailsLoading] = useState(false);

  const debouncedStrategyDetails = useDebounce(strategyDetails, 500, {});

  const containerRef = React.useRef(null);

  const sendTx = useSendTx();

  const error = useMemo(() => {
    let errorMessage = '';
    if (!atlanticPoolEpochData || !atlanticPool) return errorMessage;
    const {
      putStrike,
      optionsAmount,
      putOptionsPremium,
      putOptionsfees,
      positionFee,
      swapFees,
      strategyFee,
    } = strategyDetails;
    const collateralRequired = putStrike
      .mul(optionsAmount)
      .div(getContractReadableAmount(1, 18 + 8 - 6));

    if (putStrike.isZero()) return errorMessage;

    const availableStrikesData = atlanticPoolEpochData.epochStrikeData.filter(
      (data: any) => {
        return data.strike.gte(putStrike);
      }
    );
    let availableLiquidity = BigNumber.from(0);
    for (const i in availableStrikesData) {
      const { totalEpochMaxStrikeLiquidity, activeCollateral } =
        availableStrikesData[i] ?? {
          totalEpochMaxStrikeLiquidity: BigNumber.from(0),
          activeCollateral: BigNumber.from(0),
        };
      availableLiquidity = availableLiquidity.add(
        totalEpochMaxStrikeLiquidity.sub(activeCollateral)
      );
    }

    const collateralTokenBalanace = userAssetBalances[selectedToken];
    const indexTokenBalance = userAssetBalances[atlanticPool.tokens.underlying];

    const totalCost = putOptionsPremium
      .add(putOptionsfees)
      .add(
        increaseOrderParams.collateralDelta
          .add(positionFee)
          .add(strategyFee)
          .add(swapFees)
      );

    const unwindCost = strategyDetails.optionsAmount
      .mul(5e7)
      .div(getContractReadableAmount(1, 10));

    if (collateralRequired.gt(availableLiquidity)) {
      errorMessage = 'Insufficient liquidity for options';
    }

    if (totalCost.gt(collateralTokenBalanace ?? '0')) {
      errorMessage = 'Insufficient balance to pay premium & fees';
    }

    if (unwindCost.gt(indexTokenBalance ?? '0') && depositUnderlying) {
      errorMessage = 'Insuffucient underlying to deposit';
    }

    return errorMessage;
  }, [
    increaseOrderParams.collateralDelta,
    atlanticPoolEpochData,
    selectedToken,
    strategyDetails,
    userAssetBalances,
    atlanticPool,
    depositUnderlying,
  ]);

  const longButtonDisabled = useMemo(() => {
    if (increaseOrderParams.positionSizeDelta.isZero()) {
      return true;
    }
    if (strategyDetailsLoading) {
      return true;
    }
    if (error !== '') {
      return true;
    }
    return false;
  }, [strategyDetailsLoading, error, increaseOrderParams.positionSizeDelta]);

  const allowToOpenPosition = useMemo(() => {
    return approved.base && approved.quote;
  }, [approved.quote, approved.base]);

  const selectedPoolTokens = useMemo((): {
    deposit: string;
    underlying: string;
  } => {
    let _tokens = {
      deposit: '',
      underlying: '',
    };
    if (!selectedPool.tokens) return _tokens;
    const { deposit, underlying } = selectedPool.tokens;
    if (!deposit || !underlying) return _tokens;
    _tokens = {
      deposit,
      underlying,
    };
    return _tokens;
  }, [selectedPool.tokens]);

  const allowedTokens = useMemo(() => {
    let tokens = [{ symbol: '', address: '' }];
    if (!selectedPool || !contractAddresses || !selectedPool.tokens) return [];
    tokens = Object.keys(selectedPool.tokens).map((key: string) => {
      let symbol = selectedPool.tokens[key];
      if (symbol !== undefined) {
        return {
          symbol: symbol,
          address: contractAddresses[symbol],
        };
      } else {
        return { symbol: '', address: '' };
      }
    });
    return tokens;
  }, [selectedPool, contractAddresses]);

  const selectToken = (token: string) => {
    setSelectedToken(() => token);
  };

  const handleStrategyCalculations = useCallback(async () => {
    if (
      !atlanticPool ||
      !contractAddresses ||
      !atlanticPoolEpochData ||
      !signer ||
      !accountAddress
    )
      return;

    setStrategyDetailsLoading(true);
    const { underlying, depositToken } = atlanticPool.tokens;
    const putsContract = atlanticPool.contracts.atlanticPool;

    const utilsAddress =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['UTILS'];
    const gmxVaultAddress = contractAddresses['GMX-VAULT'];
    const depositTokenAddress = contractAddresses[depositToken];
    const underlyingTokenAddress = contractAddresses[underlying];
    const selectedTokenAddress = contractAddresses[selectedToken];

    const utilsContract = InsuredLongsUtils__factory.connect(
      utilsAddress,
      signer
    );
    const gmxVault = GmxVault__factory.connect(gmxVaultAddress, signer);
    const strategy = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );

    if (!utilsContract || !gmxVault || !strategy) return;

    const usdMultiplier = getContractReadableAmount(1, 30);

    let inputAmount: string | BigNumber = positionBalance;

    if (inputAmount === '') {
      inputAmount = '0';
    }

    inputAmount = getContractReadableAmount(
      inputAmount,
      getTokenDecimals(selectedToken, chainId)
    );

    let collateralUsd = await gmxVault.tokenToUsdMin(
      selectedTokenAddress,
      inputAmount
    );

    let sizeUsd = collateralUsd.mul(leverage).div(usdMultiplier);

    let swapFees = BigNumber.from(0);
    let path = [underlyingTokenAddress];
    let liquidationPrice = BigNumber.from(0);
    let putOptionsPremium = BigNumber.from(0),
      putOptionsfees = BigNumber.from(0),
      markPrice = BigNumber.from(0),
      strategyFee = BigNumber.from(0),
      tickSizeMultiplier = BigNumber.from(0),
      optionsAmount = BigNumber.from(0),
      putStrike = BigNumber.from(0),
      positionFee = BigNumber.from(0),
      unwindFee = BigNumber.from(0);

    positionFee = await utilsContract.getPositionFee(sizeUsd);
    positionFee = await gmxVault.usdToTokenMax(
      selectedTokenAddress,
      positionFee
    );
    const leveragedCollateral = await gmxVault.usdToTokenMax(
      depositTokenAddress,
      sizeUsd.sub(collateralUsd)
    );

    if (selectedToken !== underlying) {
      if (!collateralUsd.isZero()) {
        path = [selectedTokenAddress, underlyingTokenAddress];
        let [, fees] = await GmxReader__factory.connect(
          contractAddresses['GMX-READER'],
          signer
        ).getAmountOut(
          gmxVault.address,
          selectedTokenAddress,
          underlyingTokenAddress,
          inputAmount
        );

        swapFees = await gmxVault.tokenToUsdMin(underlyingTokenAddress, fees);
        swapFees = swapFees.mul(usdMultiplier).div(collateralUsd);
        swapFees = collateralUsd.mul(swapFees).div(usdMultiplier);
        swapFees = await gmxVault.usdToTokenMax(selectedTokenAddress, swapFees);
      }
    }

    if (
      !inputAmount.isZero() ||
      !utilsContract['getLiquidationPrice(address,address,uint256,uint256)'] ||
      !utilsContract['getEligiblePutStrike(address,uint256,uint256)']
    ) {
      liquidationPrice = await utilsContract[
        'getLiquidationPrice(address,address,uint256,uint256)'
      ](selectedTokenAddress, underlyingTokenAddress, inputAmount, sizeUsd);

      liquidationPrice = liquidationPrice.div(getContractReadableAmount(1, 22));

      [tickSizeMultiplier, strategyFee] = await Promise.all([
        strategy.tickSizeMultiplierBps(underlyingTokenAddress),
        strategy.getPositionfee(sizeUsd, selectedTokenAddress),
      ]);

      putStrike = await utilsContract[
        'getEligiblePutStrike(address,uint256,uint256)'
      ](putsContract.address, tickSizeMultiplier, liquidationPrice);

      optionsAmount = leveragedCollateral
        .mul(getContractReadableAmount(1, 20))
        .div(putStrike);

      [putOptionsPremium, putOptionsfees, markPrice] = await Promise.all([
        putsContract.calculatePremium(putStrike, optionsAmount),
        putsContract.calculatePurchaseFees(putStrike, optionsAmount),
        gmxVault.getMaxPrice(underlyingTokenAddress),
      ]);

      if (depositUnderlying) {
        unwindFee = await putsContract.calculateUnwindFees(optionsAmount);
      }
    }
    setStrategyDetails(() => ({
      positionSize: sizeUsd,
      putOptionsPremium,
      putOptionsfees,
      depositUnderlying,
      positionFee,
      optionsAmount,
      liquidationPrice,
      markPrice,
      putStrike,
      expiry: atlanticPoolEpochData.expiry,
      swapFees,
      strategyFee,
      unwindFee,
    }));

    setIncreaseOrderParams(() => ({
      path,
      indexToken: underlyingTokenAddress,
      collateralDelta: (inputAmount as BigNumber)
        .add(swapFees)
        .add(positionFee),
      positionSizeDelta: sizeUsd,
      isLong: true,
    }));
    setStrategyDetailsLoading(false);
  }, [
    selectedToken,
    signer,
    chainId,
    atlanticPool,
    accountAddress,
    positionBalance,
    leverage,
    depositUnderlying,
    contractAddresses,
    atlanticPoolEpochData,
  ]);

  const handleToggle = useCallback((event: any) => {
    setDeposutUnderlying(event.target.checked);
  }, []);

  const handleChangeLeverage = useCallback(
    (_: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
      setLeverage(() =>
        getContractReadableAmount(
          typeof value == 'number' ? value : value.pop() ?? 0,
          30
        )
      );
    },
    []
  );

  const handlePositionBalanceChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setPositionBalance(value);
  };

  const handleMax = useCallback(async () => {
    if (!accountAddress || !selectedToken) return;
    const tokenContract = ERC20__factory.connect(
      contractAddresses[selectedToken],
      provider
    );
    const balance = await tokenContract.balanceOf(accountAddress);
    const tokenDecimals = getTokenDecimals(selectedToken, chainId);
    setPositionBalance(() =>
      getUserReadableAmount(balance, tokenDecimals).toString()
    );
  }, [accountAddress, chainId, contractAddresses, provider, selectedToken]);

  const handleApproveQuoteToken = useCallback(async () => {
    if (!signer || !contractAddresses || !atlanticPool) return;
    const strategyContractAddress =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const { depositToken } = atlanticPool.tokens;

    if (!depositToken) return;
    const tokenContract = ERC20__factory.connect(
      contractAddresses[depositToken],
      signer
    );

    try {
      await sendTx(tokenContract.approve(strategyContractAddress, MAX_VALUE));
      setApproved((prevState) => ({ ...prevState, quote: true }));
    } catch (err) {
      console.log(err);
    }
  }, [signer, atlanticPool, contractAddresses, sendTx]);

  const handleApproveBaseToken = useCallback(async () => {
    if (!signer || !contractAddresses || !atlanticPool) return;
    try {
      const strategyContractAddress =
        contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];
      const { underlying } = atlanticPool.tokens;
      if (!underlying) return;
      const tokenContract = ERC20__factory.connect(
        contractAddresses[underlying],
        signer
      );
      await sendTx(tokenContract.approve(strategyContractAddress, MAX_VALUE));
      setApproved((prevState) => ({ ...prevState, base: true }));
    } catch (err) {
      console.log(err);
    }
  }, [signer, atlanticPool, contractAddresses, sendTx]);

  // check approved
  useEffect(() => {
    (async () => {
      if (!atlanticPool || !accountAddress || !provider) return;
      const quoteToken = ERC20__factory.connect(
        contractAddresses[atlanticPool.tokens.depositToken],
        provider
      );
      const baseToken = ERC20__factory.connect(
        contractAddresses[atlanticPool.tokens.underlying],
        provider
      );

      const strategyAddress =
        contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

      const quoteTokenAllowance = await quoteToken.allowance(
        accountAddress,
        strategyAddress
      );
      const baseTokenAllowance = await baseToken.allowance(
        accountAddress,
        strategyAddress
      );

      setApproved(() => ({
        quote: !quoteTokenAllowance.isZero(),
        base: depositUnderlying ? !baseTokenAllowance.isZero() : true,
      }));
    })();
  }, [
    depositUnderlying,
    accountAddress,
    atlanticPool,
    contractAddresses,
    provider,
  ]);

  const updatePrice = useCallback(async () => {
    if (!contractAddresses['GMX-VAULT'] || !signer || !atlanticPool) return;

    const gmxVault = GmxVault__factory.connect(
      contractAddresses['GMX-VAULT'],
      signer
    );

    const price = await gmxVault.getMaxPrice(
      contractAddresses[atlanticPool.tokens.underlying]
    );

    setStrategyDetails((prev) => ({
      ...prev,
      markPrice: price,
    }));
  }, [signer, contractAddresses, atlanticPool]);

  useEffect(() => {
    handleStrategyCalculations();
  }, [handleStrategyCalculations]);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePrice();
    }, 5000);
    return () => clearInterval(interval);
  }, [updatePrice]);

  useEffect(() => {
    setLoading(
      debouncedStrategyDetails[0].expiry.eq('0') ||
        positionBalance.length === 0 ||
        selectedToken === '' ||
        !approved.quote
    );
  }, [debouncedStrategyDetails, approved, positionBalance, selectedToken]);

  const useStrategy = useCallback(async () => {
    if (
      !contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'] ||
      !signer ||
      !chainId ||
      !atlanticPool ||
      !positionBalance ||
      !selectedToken ||
      !chainId ||
      !atlanticPoolEpochData
    ) {
      return;
    }
    const strategyContract = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );

    const { depositToken } = atlanticPool.tokens;

    const depositTokenAddress = contractAddresses[depositToken];
    const overrides = {
      value: MIN_EXECUTION_FEE,
    };

    try {
      const tx = strategyContract.useStrategyAndOpenLongPosition(
        increaseOrderParams,
        depositTokenAddress,
        atlanticPoolEpochData.expiry,
        depositUnderlying,
        overrides
      );
      await sendTx(tx);
    } catch (err) {
      console.log(err);
    }
  }, [
    atlanticPoolEpochData,
    atlanticPool,
    contractAddresses,
    signer,
    depositUnderlying,
    chainId,
    positionBalance,
    selectedToken,
    increaseOrderParams,
    sendTx,
  ]);

  return (
    <>
      <Box className="bg-umbra rounded-xl space-y-2" ref={containerRef}>
        <CustomInput
          size="small"
          variant="outlined"
          outline="umbra"
          value={positionBalance}
          onChange={handlePositionBalanceChange}
          leftElement={
            <Box className="flex my-auto">
              <Box
                className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-1"
                role="button"
                onClick={() => setOpenTokenSelector(() => true)}
              >
                <img
                  src={`/images/tokens/${selectedToken.toLowerCase()}.svg`}
                  alt={selectedToken}
                  className="w-[2rem]"
                />
                <Typography variant="h6" className="my-auto">
                  {selectedToken}
                </Typography>
                <KeyboardArrowDownRoundedIcon className="fill-current text-mineshaft my-auto" />
              </Box>
              <Box
                role="button"
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                onClick={handleMax}
              >
                <Typography variant="caption" color="stieglitz">
                  MAX
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box className="flex bg-umbra justify-between px-3 pb-3">
          <Typography variant="h6" color="stieglitz">
            Balance
          </Typography>
          <Typography variant="h6">
            {formatAmount(
              getUserReadableAmount(
                userAssetBalances[selectedToken] ?? '0',
                TOKEN_DECIMALS[chainId]?.[selectedToken]
              ),
              3,
              true
            )}{' '}
            {selectedToken}
          </Typography>
        </Box>
        <TokenSelector
          setSelection={selectToken}
          open={openTokenSelector}
          setOpen={setOpenTokenSelector}
          tokens={allowedTokens}
          containerRef={containerRef}
        />
      </Box>
      <Box className="w-full flex flex-col border-t-2 border-cod-gray">
        <Box className="flex flex-col items-center p-3 bg-umbra">
          <Typography
            variant="h6"
            className="text-left w-full"
            color="stieglitz"
          >
            Leverage
          </Typography>
          <Box className="w-full px-5 pt-2">
            <Slider
              sx={customSliderStyle}
              className="w-full"
              aria-label="Small steps"
              defaultValue={1.1}
              // onChange={handleChangeLeverage}
              onChangeCommitted={handleChangeLeverage}
              step={steps}
              min={minMarks}
              max={maxMarks}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
        <Box className="flex w-full bg-umbra justify-between border-t-2 border-cod-gray p-3 mb-2 rounded-b-xl">
          <Box className="flex">
            <Typography variant="h6" className="my-auto" color="stieglitz">
              Deposit underlying
            </Typography>
            <Tooltip
              title="Choose whether to deposit underlying and keep borrowed collateral incase your long position has collateral that was added when trigger price was crossed and would like to keep the position post expiry."
              enterTouchDelay={0}
              leaveTouchDelay={1000}
            >
              <InfoOutlined className="fill-current text-stieglitz p-1 my-auto" />
            </Tooltip>
          </Box>
          <Switch value={depositUnderlying} onChange={handleToggle} />
        </Box>
        {error !== '' && (
          <Box className="mb-2">
            <Typography
              variant="h6"
              className="text-red-400 border border-red-400 p-5 text-center rounded-xl"
            >
              {error}
            </Typography>
          </Box>
        )}
        <StrategyDetails
          data={debouncedStrategyDetails[0]}
          selectedCollateral={'selectedCollateral'}
          selectedToken={selectedToken}
          positionCollateral={getContractReadableAmount(
            positionBalance,
            getTokenDecimals(selectedToken, chainId)
          )}
          quoteToken={selectedPoolTokens.deposit}
          baseToken={selectedPoolTokens.underlying}
          strategyDetailsLoading={strategyDetailsLoading}
        />
        <Box className="flex flex-col w-full space-y-3 mt-2">
          {!allowToOpenPosition ? (
            <Box className="flex flex-row w-full justify-around space-x-2">
              <CustomButton
                onClick={handleApproveBaseToken}
                disabled={
                  positionBalance === '' ||
                  parseInt(positionBalance) === 0 ||
                  error !== ''
                }
                className={`${!depositUnderlying && 'hidden'}  w-full ${
                  approved.base && 'hidden'
                }`}
              >
                Approve {selectedPoolTokens.underlying}
              </CustomButton>
              <CustomButton
                onClick={handleApproveQuoteToken}
                disabled={
                  positionBalance === '' ||
                  parseInt(positionBalance) === 0 ||
                  error !== ''
                }
                className={` ${approved.quote && 'hidden'} w-full`}
              >
                Approve {selectedPoolTokens.deposit}
              </CustomButton>
            </Box>
          ) : (
            <CustomButton disabled={longButtonDisabled} onClick={useStrategy}>
              {strategyDetailsLoading ? (
                <CircularProgress className="text-white p-2" />
              ) : (
                'Long'
              )}
            </CustomButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UseStrategyDialog;
