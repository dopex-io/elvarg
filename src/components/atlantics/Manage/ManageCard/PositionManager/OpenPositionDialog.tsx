import Dialog from 'components/UI/Dialog';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  ERC20__factory,
  GmxVault__factory,
  LongPerpStrategy__factory,
} from '@dopex-io/sdk';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useDebounce } from 'use-debounce';

import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import CustomInput from 'components/UI/CustomInput';
import CustomButton from 'components/UI/Button';
import StrategyDetails from 'components/atlantics/InsuredPerpsModal/StrategyDetails/StrategyDetails';
import Switch from 'components/UI/Switch';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { useBoundStore } from 'store';
import { AtlanticsContext } from 'contexts/Atlantics';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE } from 'constants/index';
import { DEFAULT_REFERRAL_CODE, MIN_EXECUTION_FEE } from 'constants/gmx';

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

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
];

export interface IStrategyDetails {
  positionSize: BigNumber;
  putOptionsPremium: BigNumber;
  putOptionsfees: BigNumber;
  optionsAmount: BigNumber;
  liquidationPrice: BigNumber;
  putStrike: BigNumber;
  expiry: BigNumber;
  depositUnderlying: boolean;
}

export const OpenPositionDialog = ({ isOpen, handleClose }: IProps) => {
  const {
    signer,
    accountAddress,
    provider,
    contractAddresses,
    chainId,
    atlanticPool,
    atlanticPoolEpochData,
  } = useBoundStore();
  const { selectedPool } = useContext(AtlanticsContext);
  const [leverage, setLeverage] = useState<number>(2);
  const [isApproved, setIsApproved] = useState<{
    quote: boolean;
    base: boolean;
  }>({
    quote: false,
    base: false,
  });
  const [openTokenSelector, setOpenTokenSelector] = useState<boolean>(false);
  const [keepCollateral, setKeepCollateral] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>('USDC');
  const [positionBalance, setPositionBalance] = useState<string>('');
  const [depositUnderlying, setDeposutUnderlying] = useState<boolean>(false);
  const [strategyDetails, setStrategyDetails] = useState<IStrategyDetails>({
    positionSize: BigNumber.from(0),
    putOptionsPremium: BigNumber.from(0),
    putOptionsfees: BigNumber.from(0),
    optionsAmount: BigNumber.from(0),
    depositUnderlying: false,
    liquidationPrice: BigNumber.from(0),
    putStrike: BigNumber.from(0),
    expiry: BigNumber.from(0),
  });
  const [loading, setLoading] = useState<boolean>(true);

  const debouncedStrategyDetails = useDebounce(strategyDetails, 500, {});

  const containerRef = React.useRef(null);

  const sendTx = useSendTx();

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
    if (!atlanticPool || !contractAddresses || !atlanticPoolEpochData) return;

    const { underlying, depositToken } = atlanticPool.tokens;

    const putsContract = atlanticPool.contracts.atlanticPool;

    const insured_perps_address =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const strategyContract = LongPerpStrategy__factory.connect(
      insured_perps_address,
      provider
    );

    // Leverage in bigNumber 1e30 decimals
    const leverageBN = getContractReadableAmount(leverage * 10, 29);

    // index token price in 1e30 decimals
    const indexTokenPrice = (await putsContract.getUsdPrice()).mul(
      oneEBigNumber(22)
    );

    // spot price / leverage
    const difference = indexTokenPrice.mul(oneEBigNumber(30)).div(leverageBN);

    // in 1e30 decimals
    let positionBalanceValue = getContractReadableAmount(positionBalance, 30);

    if (selectedToken !== depositToken) {
      positionBalanceValue = indexTokenPrice
        .mul(positionBalanceValue)
        .div(oneEBigNumber(30));
    }

    // position balance * leverage
    const positionSize = positionBalanceValue.mul(leverage * 10).div(10);

    // spot price - difference
    const liquidationPrice = indexTokenPrice.sub(difference);

    // Put strike
    const putStrike = (
      await putsContract.eligiblePutPurchaseStrike(
        liquidationPrice,
        (
          await strategyContract.tokenStrategyConfigs(
            contractAddresses[underlying]
          )
        ).optionStrikeOffsetPercentage
      )
    ).div(oneEBigNumber(22));

    // Collateral accessible
    const collateralAccess = await strategyContract.getRequiredCollateralAccess(
      positionBalanceValue,
      leverageBN
    );

    const optionsAmount = collateralAccess
      .mul(oneEBigNumber(20))
      .div(putStrike);

    const [putOptionsPremium, putOptionsfees] = await Promise.all([
      putsContract.calculatePremium(putStrike, optionsAmount),
      putsContract.calculatePurchaseFees(putStrike, optionsAmount),
    ]);

    setStrategyDetails(() => ({
      positionSize,
      putOptionsPremium,
      putOptionsfees,
      depositUnderlying,
      optionsAmount,
      liquidationPrice,
      putStrike,
      expiry: atlanticPoolEpochData.expiry,
    }));
  }, [
    selectedToken,
    atlanticPool,
    leverage,
    depositUnderlying,
    contractAddresses,
    positionBalance,
    provider,
    atlanticPoolEpochData,
  ]);

  const handleDepositUnderlyingCheckboxChange = (event: any) => {
    setDeposutUnderlying(event.target.checked);
  };

  function onChangeLeverage(event: Event, value: any, aciveThumb: any) {
    event;
    aciveThumb;
    setLeverage(() => value);
  }

  const onEscapePressed = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

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
      !selectToken ||
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
        !isApproved.base ||
        !isApproved.quote
    );
  }, [
    debouncedStrategyDetails,
    isApproved.base,
    isApproved.quote,
    positionBalance,
    selectedToken,
  ]);

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

    const strategyContract = LongPerpStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );
    // GMX_VAULT
    const gmxVault = GmxVault__factory.connect(
      '0x489ee077994B6658eAfA855C308275EAd8097C4A',
      signer
    );

    try {
      let path: string[] = [];
      if (selectedToken === 'USDC') {
        path = [contractAddresses['USDC'], contractAddresses['WETH']];
      }
      if (selectedToken === 'WETH') path = [contractAddresses['WETH']];

      const indexToken = atlanticPool.tokens.underlying;

      if (!path[0]) return;

      const marginFeeBasisPoints = 10;
      const divisor = 10000;

      let positionBalanceWithDecimals = getContractReadableAmount(
        positionBalance,
        getTokenDecimals(selectedToken, chainId)
      );

      let positionCollateral;
      let positionSize;
      let indexTokenMaxPrice = await gmxVault.getMaxPrice(
        contractAddresses[indexToken]
      );

      if (path[0] !== contractAddresses[indexToken]) {
        const abi = [
          'function getAmountOut(address _vault, address _tokenIn, address _tokenOut, uint256 _amountIn) public view returns (uint256, uint256)',
        ];
        const reader = new ethers.Contract(
          '0x22199a49A999c351eF7927602CFB187ec3cae489',
          abi,
          signer
        );

        const amountOut = (
          await reader['getAmountOut'](
            gmxVault.address,
            path[0],
            path[1],
            positionBalanceWithDecimals
          )
        )[0];

        const newePositionSize = amountOut
          .mul(indexTokenMaxPrice)
          .div(oneEBigNumber(18))
          .mul(leverage * 10)
          .div(10);
        const positionSizeSubFee = newePositionSize
          .mul(divisor - marginFeeBasisPoints)
          .div(divisor);

        positionCollateral = positionBalanceWithDecimals;
        positionSize = positionSizeSubFee;
      } else {
        // const positionSizein30Usd = await gmxVault.tokenToUsdMin(contractAddresses['WETH'], strategyDetails.positionSize)
        const afterfeeUsd = strategyDetails.positionSize
          .mul(divisor - marginFeeBasisPoints)
          .div(divisor);
        const feeInTokenDecimals = await gmxVault.usdToTokenMin(
          contractAddresses[indexToken],
          strategyDetails.positionSize.sub(afterfeeUsd)
        );
        positionCollateral =
          positionBalanceWithDecimals.add(feeInTokenDecimals);
        positionSize = strategyDetails.positionSize;
      }

      console.log(
        path,
        contractAddresses[indexToken],
        positionCollateral.toString(),
        positionSize.toString(),
        MIN_EXECUTION_FEE.toString(),
        DEFAULT_REFERRAL_CODE,
        depositUnderlying,
        atlanticPoolEpochData.expiry.toString()
      );
      const _tx = strategyContract.useStrategyAndOpenLongPosition(
        {
          path: path,
          indexToken: contractAddresses[indexToken],
          positionCollateralSize: positionCollateral,
          positionSize: positionSize,
          executionFee: MIN_EXECUTION_FEE,
          referralCode: DEFAULT_REFERRAL_CODE,
          depositUnderlying: depositUnderlying,
        },
        keepCollateral,
        atlanticPoolEpochData.expiry,
        {
          value: MIN_EXECUTION_FEE,
        }
      );

      await sendTx(_tx);
    } catch (err) {
      console.log(err);
    }
  }, [
    // atlanticPoolEpochData.expiry,
    atlanticPoolEpochData,
    atlanticPool,
    contractAddresses,
    signer,
    depositUnderlying,
    chainId,
    positionBalance,
    selectedToken,
    keepCollateral,
    strategyDetails.positionSize,
    leverage,
    sendTx,
  ]);

  const handleKeepCollateral = (event: any, checked: boolean) => {
    event;
    setKeepCollateral(() => checked);
  };

  return (
    <Dialog
      open={isOpen}
      onKeyPress={onEscapePressed}
      handleClose={handleClose}
      showCloseIcon
    >
      <Typography className="w-full mb-4" variant="h5">
        Open Long Position
      </Typography>
      <Box>
        <CustomInput
          size="small"
          variant="outlined"
          outline="umbra"
          value={positionBalance}
          onChange={handlePositionBalanceChange}
          leftElement={
            <Box className="flex my-auto">
              <Box
                className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-3"
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
              </Box>
              <Button
                size="small"
                className="rounded-lg bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto"
                onClick={handleMax}
              >
                <Typography
                  variant="caption"
                  className="text-xs"
                  color="stieglitz"
                >
                  MAX
                </Typography>
              </Button>
            </Box>
          }
        />
        <Box ref={containerRef}>
          <TokenSelector
            setSelection={selectToken}
            open={openTokenSelector}
            setOpen={setOpenTokenSelector}
            tokens={allowedTokens}
            containerRef={containerRef}
          />
        </Box>
      </Box>
      <Box className="flex p-1 flex-col space-y-2">
        <Box className="flex flex-col items-center">
          <Typography
            variant="h6"
            className="text-left w-full"
            color="stieglitz"
          >
            Leverage
          </Typography>
          <Slider
            sx={{
              '.MuiSlider-markLabel': {
                color: 'gray',
              },
            }}
            className="w-[20rem]"
            color="primary"
            aria-label="Small steps"
            defaultValue={1.1}
            onChange={onChangeLeverage}
            step={0.1}
            min={1.1}
            max={5}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Box>
        <Box className="flex-col justify-center items-center">
          <Box className="px-1 flex">
            <Typography variant="h6">
              Deposit underlying
              <Checkbox
                className="text-white border"
                checked={depositUnderlying}
                onChange={handleDepositUnderlyingCheckboxChange}
              />
            </Typography>
          </Box>
          <Box className="px-1 mb-2 flex justify-between items-center">
            <Typography
              className={`${!depositUnderlying && 'text-stieglitz'}`}
              variant="h6"
            >
              Keep Collateral on Expiry
              <Tooltip title="Choose whether to keep collateral incase puts are ITM and would like to keep the position post expiry. Note: Positions that have AC options as collateral cannot keep collateral beyond expiry of the pool and will be automatically closed on expiry.">
                <InfoOutlined className="h-4 fill-current text-stieglitz" />
              </Tooltip>
            </Typography>
            <Switch
              disabled={!depositUnderlying}
              className="mt-1"
              onChange={handleKeepCollateral}
              value={keepCollateral}
              color="primary"
            />
          </Box>
        </Box>
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
        <Box className="flex flex-col w-full space-y-2">
          <Box className="flex flex-row w-full space-x-2">
            {selectedToken === atlanticPool?.tokens.underlying! && (
              <CustomButton
                onClick={handleApproveBaseToken}
                disabled={
                  positionBalance === '' || parseInt(positionBalance) === 0
                }
                className={`${isApproved.base && 'hidden'} flex-1 display`}
              >
                Approve {'WETH'}
              </CustomButton>
            )}
            <CustomButton
              onClick={handleApproveQuoteToken}
              disabled={
                positionBalance === '' || parseInt(positionBalance) === 0
              }
              className={` ${isApproved.quote && 'hidden'} flex-1`}
            >
              Approve {'USDC'}
            </CustomButton>
          </Box>
          <CustomButton
            disabled={loading}
            // {
            //   !isApproved.base ||
            //   !isApproved.quote ||
            //   positionBalance === '' ||
            // }
            onClick={useStrategy}
          >
            Long
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};
