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
import { useDebounce } from 'use-debounce';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import Switch from 'components/UI/Switch';
import CustomInput from 'components/UI/CustomInput';
import CustomButton from 'components/UI/Button';
import StrategyDetails from 'components/atlantics/InsuredPerps/ManagePosition/StrategyDetails';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

import { useBoundStore } from 'store';
import { AtlanticsContext } from 'contexts/Atlantics';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';

import { MIN_EXECUTION_FEE } from 'constants/gmx';
import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';

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
  fundingFees: BigNumber;
  feesWithoutDiscount: {
    fundingFees: BigNumber;
    purchaseFees: BigNumber;
    strategyFee: BigNumber;
  };
}

interface IncreaseOrderParams {
  path: string[];
  indexToken: string;
  collateralDelta: BigNumber;
  positionSizeDelta: BigNumber;
  acceptablePrice: BigNumber;
  isLong: boolean;
}

const ManagePosition = () => {
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
      acceptablePrice: BigNumber.from(0),
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
    fundingFees: BigNumber.from(0),
    feesWithoutDiscount: {
      fundingFees: BigNumber.from(0),
      purchaseFees: BigNumber.from(0),
      strategyFee: BigNumber.from(0),
    },
  });
  const [, setLoading] = useState<boolean>(true);
  const [strategyDetailsLoading, setStrategyDetailsLoading] = useState(false);
  // const [managePositionSelection, setManagePositionSelection] = useState<
  //   string | null
  // >('open');

  const debouncedStrategyDetails = useDebounce(strategyDetails, 500, {});

  const containerRef = React.useRef(null);

  const sendTx = useSendTx();

  const error = useMemo(() => {
    let errorMessage = '';
    if (!atlanticPoolEpochData) return errorMessage;
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

    const userBalance = userAssetBalances[selectedToken];

    const totalCost = putOptionsPremium
      .add(putOptionsfees)
      .add(
        increaseOrderParams.collateralDelta
          .add(positionFee)
          .add(strategyFee)
          .add(swapFees)
      );

    if (collateralRequired.gt(availableLiquidity)) {
      errorMessage = 'Insufficient liquidity for options';
    } else if (totalCost.gt(userBalance ?? '0')) {
      errorMessage = 'Insufficient balance to pay premium & fees';
    }

    return errorMessage;
  }, [
    increaseOrderParams.collateralDelta,
    atlanticPoolEpochData,
    selectedToken,
    strategyDetails,
    userAssetBalances,
  ]);

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
      acceptablePrice = BigNumber.from(0),
      collateralAccess = BigNumber.from(0),
      purchaseFeesWithoutDiscount = BigNumber.from(0),
      strategyFeeWithoutDiscount = BigNumber.from(0),
      fundingFeesWithoutDiscount = BigNumber.from(0),
      fundingFees = BigNumber.from(0);

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

    if (!inputAmount.isZero()) {
      try {
        liquidationPrice = await utilsContract[
          'getLiquidationPrice(address,address,uint256,uint256)'
        ](selectedTokenAddress, underlyingTokenAddress, inputAmount, sizeUsd);
      } catch (err) {
        liquidationPrice = BigNumber.from(0);
      }

      liquidationPrice = liquidationPrice.div(getContractReadableAmount(1, 22));

      [tickSizeMultiplier, strategyFee, strategyFeeWithoutDiscount] =
        await Promise.all([
          strategy.tickSizeMultiplierBps(underlyingTokenAddress),
          strategy.getPositionfee(
            sizeUsd,
            selectedTokenAddress,
            accountAddress
          ),
          strategy.getPositionfee(
            sizeUsd,
            selectedTokenAddress,
            putsContract.address
          ),
        ]);

      putStrike = await utilsContract[
        'getEligiblePutStrike(address,uint256,uint256)'
      ](putsContract.address, tickSizeMultiplier, liquidationPrice);

      optionsAmount = leveragedCollateral
        .mul(getContractReadableAmount(1, 20))
        .div(putStrike);

      [
        putOptionsPremium,
        putOptionsfees,
        markPrice,
        collateralAccess,
        purchaseFeesWithoutDiscount,
      ] = await Promise.all([
        putsContract.calculatePremium(putStrike, optionsAmount),
        putsContract.calculatePurchaseFees(
          accountAddress,
          putStrike,
          optionsAmount
        ),
        gmxVault.getMaxPrice(underlyingTokenAddress),
        putsContract.strikeMulAmount(putStrike, optionsAmount),
        putsContract.calculatePurchaseFees(
          putsContract.address,
          putStrike,
          optionsAmount
        ),
      ]);

      [fundingFees, fundingFeesWithoutDiscount] = await Promise.all([
        putsContract.calculateFundingFees(accountAddress, collateralAccess),
        putsContract.calculateFundingFees(
          putsContract.address,
          collateralAccess
        ),
      ]);
      const precision = 100000;
      const slippage = 400;
      acceptablePrice = markPrice.mul(precision + slippage).div(precision);
    }

    setStrategyDetails(() => ({
      fundingFees,
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
      feesWithoutDiscount: {
        fundingFees: fundingFeesWithoutDiscount,
        purchaseFees: purchaseFeesWithoutDiscount,
        strategyFee: strategyFeeWithoutDiscount,
      },
    }));

    setIncreaseOrderParams(() => ({
      path,
      indexToken: underlyingTokenAddress,
      collateralDelta: (inputAmount as BigNumber)
        .add(swapFees)
        .add(positionFee),
      positionSizeDelta: sizeUsd,
      acceptablePrice,
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

  const handleToggle = (event: any) => {
    setDeposutUnderlying(event.target.checked);
  };

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

  const handleChangeLeverage = useCallback(
    (_: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
      setLeverage(() =>
        getContractReadableAmount(
          typeof value == 'number' ? value : value.pop() ?? 0,
          30
        )
      );
      handleStrategyCalculations();
    },
    [handleStrategyCalculations]
  );

  const handlePositionBalanceChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setPositionBalance(value);
    handleStrategyCalculations();
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
      console.error(err);
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
      console.error(err);
    }
  }, [signer, atlanticPool, contractAddresses, sendTx]);

  // check approved
  useEffect(() => {
    (async () => {
      if (!atlanticPool || !accountAddress) return;
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
        base: !baseTokenAllowance.isZero(),
      }));
    })();
  }, [accountAddress, atlanticPool, contractAddresses, provider]);

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
      console.error(err);
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
    <Box className="">
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
        />
        <Box className="flex flex-col w-full space-y-3 mt-2">
          {!approved.quote ? (
            <Box className="flex flex-row w-full justify-around space-x-2">
              {depositUnderlying && !approved.base ? (
                <CustomButton
                  onClick={handleApproveBaseToken}
                  disabled={
                    positionBalance === '' ||
                    parseInt(positionBalance) === 0 ||
                    error !== ''
                  }
                  className={`${
                    !depositUnderlying &&
                    increaseOrderParams.path[0] !== allowedTokens[1]?.address &&
                    'hidden'
                  }  w-full ${approved.base && 'hidden'}`}
                >
                  Approve {selectedPoolTokens.underlying}
                </CustomButton>
              ) : null}
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
            <CustomButton
              disabled={error !== '' || strategyDetailsLoading}
              onClick={useStrategy}
            >
              {strategyDetailsLoading ? (
                <CircularProgress className="text-white p-3" />
              ) : (
                'Long'
              )}
            </CustomButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ManagePosition;
