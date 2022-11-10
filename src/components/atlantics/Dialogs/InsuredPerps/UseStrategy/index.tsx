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

const steps_testing = 1;
const minMarks_testing = 1.1;
const maxMarks_testing = 25;
const marks_testing = [
  { value: 1.1, label: '1.1x' },
  { value: 5, label: '5x' },
  { value: 10, label: '10x' },
  { value: 15, label: '15x' },
  { value: 20, label: '20x' },
  { value: 25, label: '25x' },
];

const steps = 0.1;
const minMarks = 1.1;
const maxMarks = 10;
const marks = [
  {
    value: 1.1,
    label: '1.1x',
  },
  {
    value: 2,
    label: '2x',
  },
  {
    value: 3,
    label: '3x',
  },
  {
    value: 4,
    label: '4x',
  },
  {
    value: 5,
    label: '5x',
  },
  {
    value: 6,
    label: '6x',
  },
  {
    value: 7,
    label: '7x',
  },
  {
    value: 8,
    label: '8x',
  },
  {
    value: 9,
    label: '9x',
  },
  {
    value: 10,
    label: '10x',
  },
];

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
  // ** TEMP *** //
  const [testing, setTesting] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<{
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
    const { putStrike, optionsAmount } = strategyDetails;
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

    if (collateralRequired.gt(availableLiquidity)) {
      errorMessage = 'Insufficient liquidity for options';
    }

    return errorMessage;
  }, [atlanticPoolEpochData, strategyDetails]);

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

  const getPreStrategyCalculations = useCallback(async () => {
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

    let collateralUsd = getContractReadableAmount(positionBalance, 30);

    if (selectedToken === underlying) {
      const maxPrice = await gmxVault.getMaxPrice(underlyingTokenAddress);
      collateralUsd = maxPrice.mul(positionBalance);
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
        350,
        underlyingTokenAddress,
        depositTokenAddress
      );
    } else {
      path = [underlyingTokenAddress];
      amountIn = indexTokenFromCollateralUsd;
    }

    let [positionFee, markPrice] = await Promise.all([
      utils.getPositionFee(size),
      gmxVault.getMaxPrice(underlyingTokenAddress),
    ]);

    let liquidationPrice = markPrice
      .sub(markPrice.mul(usdMultiplier).div(leverage))
      .div(getContractReadableAmount(1, 22));

    let levergedAmountToToken, putStrike: BigNumber, strategyFee: BigNumber;
    [levergedAmountToToken, putStrike, positionFee, strategyFee] =
      await Promise.all([
        gmxVault.usdToTokenMin(depositTokenAddress, leveragedCollateralUsd),
        utils.getEligblePutStrike(putsContract.address, liquidationPrice),
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
          positionBalance,
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
      String(getUserReadableAmount(balance, tokenDecimals))
    );
  }, [accountAddress, chainId, contractAddresses, provider, selectedToken]);

  const checkIfApproved = useCallback(async () => {
    if (
      !atlanticPool ||
      !accountAddress ||
      !contractAddresses ||
      !selectedToken ||
      !provider
    )
      return;
    const quoteToken = ERC20__factory.connect(
      contractAddresses[atlanticPool.tokens.depositToken],
      provider
    );
    const baseToken = ERC20__factory.connect(
      contractAddresses[atlanticPool.tokens.underlying],
      provider
    );
    const underlying = atlanticPool.tokens.underlying;

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

    let baseTokenCost = depositUnderlying
      ? debouncedStrategyDetails[0].optionsAmount
      : BigNumber.from(0);
    let quoteTokenCost = debouncedStrategyDetails[0].putOptionsPremium.add(
      debouncedStrategyDetails[0].putOptionsfees
    );

    const decimals = getTokenDecimals(selectedToken, chainId);
    const positionCollateral = getContractReadableAmount(
      positionBalance,
      decimals
    );

    if (selectedToken === underlying) {
      baseTokenCost = baseTokenCost.add(positionCollateral);
    }

    if (selectedToken !== underlying) {
      quoteTokenCost = quoteTokenCost.add(positionCollateral);
    }

    setIsApproved(() => ({
      quote: !quoteTokenAllowance.isZero(),
      base: !baseTokenAllowance.isZero(),
    }));
  }, [
    atlanticPool,
    provider,
    accountAddress,
    contractAddresses,
    debouncedStrategyDetails,
    depositUnderlying,
    selectedToken,
    chainId,
    positionBalance,
  ]);

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
    } catch (err) {
      console.log(err);
    }

    await checkIfApproved();
  }, [signer, atlanticPool, contractAddresses, checkIfApproved, sendTx]);

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
    } catch (err) {
      console.log(err);
    }
    await checkIfApproved();
  }, [signer, atlanticPool, contractAddresses, sendTx, checkIfApproved]);

  useEffect(() => {
    checkIfApproved();
  }, [checkIfApproved]);

  useEffect(() => {
    getPreStrategyCalculations();
  }, [getPreStrategyCalculations]);

  useEffect(() => {
    setLoading(
      debouncedStrategyDetails[0].expiry.eq('0') ||
        positionBalance.length === 0 ||
        selectedToken === '' ||
        !isApproved.quote
    );
  }, [
    debouncedStrategyDetails,
    isApproved.base,
    isApproved.quote,
    positionBalance,
    selectedToken,
  ]);

  // **** TEMP *** //

  const updateTestingMode = useCallback(async () => {
    if (!atlanticPoolEpochData || !atlanticPoolEpochData.tickSize) return;
    setTesting(Number(atlanticPoolEpochData.tickSize) == 10e8);
  }, [atlanticPoolEpochData]);
  useEffect(() => {
    updateTestingMode();
  }, [updateTestingMode]);

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
                <Typography
                  variant="caption"
                  className="text-xs"
                  color="stieglitz"
                >
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
              step={testing ? steps_testing : steps}
              min={testing ? minMarks_testing : minMarks}
              max={testing ? maxMarks_testing : maxMarks}
              valueLabelDisplay="auto"
              marks={testing ? marks_testing : marks}
            />
          </Box>
        </Box>
        <Box className="flex w-full bg-umbra justify-between border-t-2 border-cod-gray p-3 mb-2 rounded-b-xl">
          <Box className="flex">
            <Typography variant="h6" className="my-auto" color="stieglitz">
              Deposit underlying
            </Typography>
            <Tooltip title="Choose whether to deposit underlying and keep borrowed collateral incase your long position has collateral that was added when trigger price was crossed and would like to keep the position post expiry.">
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
        <Box className="flex flex-col w-full space-y-3">
          <Box className="flex flex-row w-full justify-around mt-4 space-x-2">
            {depositUnderlying && (
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
                }  w-full ${isApproved.base && 'hidden'}`}
              >
                Approve {'WETH'}
              </CustomButton>
            )}
            <CustomButton
              onClick={handleApproveQuoteToken}
              disabled={
                positionBalance === '' ||
                parseInt(positionBalance) === 0 ||
                error !== ''
              }
              className={` ${isApproved.quote && 'hidden'} w-full`}
            >
              Approve {'USDC'}
            </CustomButton>
          </Box>
          <CustomButton disabled={error !== ''} onClick={useStrategy}>
            Long
          </CustomButton>
        </Box>
      </Box>
    </>
  );
};

export default UseStrategyDialog;
