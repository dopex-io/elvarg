import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import {
  ERC20__factory,
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
  });
  const [, setLoading] = useState<boolean>(true);

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

    const totalCost = putOptionsPremium.add(putOptionsfees).add(
      getContractReadableAmount(
        positionBalance,
        TOKEN_DECIMALS[chainId]?.[selectedToken] ?? '0'
      )
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
    atlanticPoolEpochData,
    chainId,
    positionBalance,
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

    const { underlying, depositToken } = atlanticPool.tokens;
    const putsContract = atlanticPool.contracts.atlanticPool;

    const utilsAddress =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['UTILS'];
    const gmxVaultAddress = contractAddresses['GMX-VAULT'];
    const depositTokenAddress = contractAddresses[depositToken];
    const underlyingTokenAddress = contractAddresses[underlying];
    const selectedTokenAddress = contractAddresses[selectedToken];

    const utils = InsuredLongsUtils__factory.connect(utilsAddress, signer);
    const gmxVault = GmxVault__factory.connect(gmxVaultAddress, signer);
    const strategy = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );

    const usdMultiplier = getContractReadableAmount(1, 30);

    let path: string[] = [depositTokenAddress, underlyingTokenAddress];

    let inputAmount = positionBalance;

    if (inputAmount === '') {
      inputAmount = '0';
    }

    let collateralUsd = getContractReadableAmount(inputAmount, 30);

    if (selectedToken === underlying) {
      const maxPrice = await gmxVault.getMaxPrice(underlyingTokenAddress);
      collateralUsd = maxPrice.mul(inputAmount);
    }

    let size = collateralUsd.mul(leverage).div(usdMultiplier);
    let leveragedCollateralUsd = size.sub(collateralUsd);
    let indexTokenFromCollateralUsd = await gmxVault.usdToTokenMin(
      underlyingTokenAddress,
      collateralUsd
    );

    let amountIn: BigNumber;
    if (selectedToken === depositToken) {
      path = [depositTokenAddress, underlyingTokenAddress];
      amountIn = await utils.getAmountIn(
        indexTokenFromCollateralUsd,
        10,
        underlyingTokenAddress,
        depositTokenAddress
      );
    } else {
      path = [underlyingTokenAddress];
      amountIn = indexTokenFromCollateralUsd;
    }

    let [positionFee, markPrice, tickSizeMultiplier] = await Promise.all([
      utils.getPositionFee(size),
      gmxVault.getMaxPrice(underlyingTokenAddress),
      strategy.tickSizeMultiplierBps(underlyingTokenAddress),
    ]);

    let liquidationPrice = markPrice
      .sub(markPrice.mul(usdMultiplier).div(leverage))
      .div(getContractReadableAmount(1, 22));

    let levergedAmountToToken, putStrike: BigNumber, strategyFee: BigNumber;
    [levergedAmountToToken, putStrike, positionFee, strategyFee] =
      await Promise.all([
        gmxVault.usdToTokenMin(depositTokenAddress, leveragedCollateralUsd),
        utils['getEligiblePutStrike(address,uint256,uint256)'](
          putsContract.address,
          tickSizeMultiplier,
          liquidationPrice
        ),
        gmxVault.usdToTokenMin(selectedTokenAddress, positionFee),
        strategy.getPositionfee(size, contractAddresses[selectedToken]),
      ]);

    let optionsAmount = levergedAmountToToken
      .mul(getContractReadableAmount(1, 20))
      .div(putStrike);

    const [putOptionsPremium, putOptionsfees] = await Promise.all([
      putsContract.calculatePremium(putStrike, optionsAmount),
      putsContract.calculatePurchaseFees(putStrike, optionsAmount),
    ]);

    let swapFees = BigNumber.from(0);
    if (path.length > 1) {
      swapFees = amountIn.sub(
        getContractReadableAmount(
          inputAmount,
          getTokenDecimals(selectedToken, chainId)
        )
      );
    }

    setStrategyDetails(() => ({
      positionSize: size,
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
    }));

    setIncreaseOrderParams(() => ({
      path,
      indexToken: underlyingTokenAddress,
      collateralDelta: amountIn.add(swapFees).add(positionFee),
      positionSizeDelta: size,
      isLong: true,
    }));
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

  function onChangeLeverage(event: Event, value: any, aciveThumb: any) {
    event;
    aciveThumb;
    setLeverage(() => getContractReadableAmount(value, 30));
  }

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
              onChange={onChangeLeverage}
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
            <CustomButton disabled={error !== ''} onClick={useStrategy}>
              Long
            </CustomButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UseStrategyDialog;
