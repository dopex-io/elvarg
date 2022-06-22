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
import { BigNumber } from 'ethers';
import {
  AtlanticCallsPool__factory,
  AtlanticPutsPool,
  ERC20__factory,
  LongPerpStrategy__factory,
} from '@dopex-io/sdk';
import { Button, SelectChangeEvent, Switch, Tooltip } from '@mui/material';

import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import ArrowRightIcon from 'svgs/icons/ArrowRightIcon';
import CustomInput from 'components/UI/CustomInput';
import CustomButton from 'components/UI/CustomButton';
import CollateralSelector from 'components/atlantics/InsuredPerpsModal/CollateralSelector/CollateralSelector';
import StrategyDetails from '../../../InsuredPerpsModal/StrategyDetails/StrategyDetails';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { WalletContext } from 'contexts/Wallet';
import { AtlanticsContext } from 'contexts/Atlantics';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE } from 'constants/index';
import { DEFAULT_REFERRAL_CODE, MIN_EXECUTION_FEE } from 'constants/gmx';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

interface IProps {
  isOpen: boolean;
  setClose: () => void;
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
  callOptionsPremium: BigNumber;
  putOptionsfees: BigNumber;
  callOptionsFees: BigNumber;
  callsFundingFee: BigNumber;
  optionsAmount: BigNumber;
  liquidationPrice: BigNumber;
  putStrike: BigNumber;
  expiry: BigNumber;
}

export const OpenPositionDialog = ({ isOpen, setClose }: IProps) => {
  const { signer, accountAddress, provider, contractAddresses, chainId } =
    useContext(WalletContext);
  const { selectedPool } = useContext(AtlanticsContext);
  const [leverage, setLeverage] = useState<number>(1.1);
  const [isApproved, setIsApproved] = useState<{
    quote: boolean;
    base: boolean;
  }>({
    quote: false,
    base: false,
  });
  const [openTokenSelector, setOpenTokenSelector] = useState<boolean>(false);
  const [keepCollateral, setKeepCollateral] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>('USDT');
  const [positionBalance, setPositionBalance] = useState<string>('');
  const [selectedCollateral, setSelectedCollateral] = useState<string>('');
  const [strategyDetails, setStrategyDetails] = useState<IStrategyDetails>({
    positionSize: BigNumber.from(0),
    putOptionsPremium: BigNumber.from(0),
    callOptionsPremium: BigNumber.from(0),
    putOptionsfees: BigNumber.from(0),
    callOptionsFees: BigNumber.from(0),
    callsFundingFee: BigNumber.from(0),
    optionsAmount: BigNumber.from(0),
    liquidationPrice: BigNumber.from(0),
    putStrike: BigNumber.from(0),
    expiry: BigNumber.from(0),
  });

  const tx = useSendTx();

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
      !selectedPool?.tokens ||
      !contractAddresses ||
      !selectedPool.contracts ||
      !selectedPool.config.tickSize
    )
      return;

    const { underlying, deposit } = selectedPool.tokens;

    if (!underlying) return;

    const putsContract = selectedPool.contracts.atlanticPool;

    const insured_perps_address =
      contractAddresses['STRATEGIES']['INSURED-PERPS'];
    const strategyContract = LongPerpStrategy__factory.connect(
      insured_perps_address,
      provider
    );

    // Leverage in bigNumber 1e30 decimals
    const leverageBN = getContractReadableAmount(leverage * 10, 29);

    // index token price in 1e30 decimals
    const indexTokenPrice = await (
      await putsContract.getUsdPrice()
    ).mul(oneEBigNumber(22));

    // spot price / leverage
    const difference = indexTokenPrice.mul(oneEBigNumber(30)).div(leverageBN);

    // in 1e30 decimals
    let positionBalanceValue = getContractReadableAmount(positionBalance, 30);

    if (selectedToken !== deposit) {
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
      await strategyContract.eligiblePutPurchaseStrike(
        liquidationPrice,
        selectedPool.config.tickSize
      )
    ).div(oneEBigNumber(22));

    // Collateral accessible
    const collateralAccess =
      await strategyContract.calculateAmountOfOptionsToPurchase(
        positionBalanceValue,
        leverageBN
      );

    const optionsAmount = collateralAccess
      .mul(oneEBigNumber(20))
      .div(putStrike);

    const putsPool = (await selectedPool.contracts
      .atlanticPool) as AtlanticPutsPool;
    const callsPoolAddress =
      contractAddresses['ATLANTIC-POOLS'][selectedPool.asset]['CALLS'][
        selectedPool.duration
      ];

    const [putOptionsPremium, putOptionsfees] = await Promise.all([
      putsPool.calculatePremium(putStrike, optionsAmount),
      putsPool.calculatePurchaseFees(putStrike, optionsAmount),
    ]);

    let callOptionsPremium: BigNumber = BigNumber.from(0),
      callOptionsFees: BigNumber = BigNumber.from(0),
      callsFundingFee: BigNumber = BigNumber.from(0),
      callsPool;

    if (selectedCollateral === 'AC-OPTIONS') {
      callsPool = AtlanticCallsPool__factory.connect(
        callsPoolAddress,
        provider
      );

      [callOptionsPremium, callOptionsFees, callsFundingFee] =
        await Promise.all([
          callsPool.calculatePremium(optionsAmount),
          callsPool.calculatePurchaseFees(optionsAmount),
          callsPool.calculateFundingTillExpiry(optionsAmount),
        ]);
    }

    setStrategyDetails(() => ({
      positionSize,
      putOptionsPremium,
      callOptionsPremium,
      putOptionsfees,
      callOptionsFees,
      callsFundingFee,
      optionsAmount,
      liquidationPrice,
      putStrike,
      expiry: selectedPool.state.expiryTime,
    }));
  }, [
    selectedToken,
    selectedCollateral,
    selectedPool.state.expiryTime,
    selectedPool.asset,
    selectedPool.config.tickSize,
    selectedPool.contracts,
    selectedPool.duration,
    selectedPool.tokens,
    leverage,
    contractAddresses,
    positionBalance,
    provider,
  ]);

  const handleCollateralSelectChange = (
    event: SelectChangeEvent<string | undefined>
  ) => {
    if (!event || !event.target || !event.target.value) return;
    setSelectedCollateral(() => event.target.value ?? 'Select Collateral');
  };

  function onChangeLeverage(event: Event, value: any, aciveThumb: any) {
    setLeverage(() => value);
  }

  const onEscapePressed = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setClose();
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
      !selectedPool.contracts ||
      !accountAddress ||
      !selectedPool.asset ||
      !contractAddresses
    )
      return;
    const quoteToken = selectedPool.contracts.quoteToken;
    const baseToken = selectedPool.contracts.baseToken;
    const underlying = selectedPool.asset;

    const strategyAddress = contractAddresses['STRATEGIES']['INSURED-PERPS'];

    const quoteTokenAllowance = await quoteToken.allowance(
      accountAddress,
      strategyAddress
    );
    const baseTokenAllowance = await baseToken.allowance(
      accountAddress,
      strategyAddress
    );

    let baseTokenCost = strategyDetails.callOptionsFees
      .add(strategyDetails.callOptionsPremium)
      .add(strategyDetails.callsFundingFee);
    let quoteTokenCost = strategyDetails.putOptionsPremium.add(
      strategyDetails.putOptionsfees
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
    selectedPool.contracts,
    accountAddress,
    selectedPool.asset,
    contractAddresses,
    chainId,
    positionBalance,
    selectedToken,
    strategyDetails.callOptionsFees,
    strategyDetails.callOptionsPremium,
    strategyDetails.callsFundingFee,
    strategyDetails.putOptionsPremium,
    strategyDetails.putOptionsfees,
  ]);

  const handleApproveQuoteToken = useCallback(async () => {
    if (
      !signer ||
      !selectedPool.contracts ||
      !selectedPool.tokens ||
      !contractAddresses
    )
      return;
    const strategyContractAddress =
      contractAddresses['STRATEGIES']['INSURED-PERPS'];
    const { deposit } = selectedPool.tokens;
    if (!deposit) return;
    const tokenContract = ERC20__factory.connect(
      contractAddresses[deposit],
      signer
    );
    tx(tokenContract.approve(strategyContractAddress, MAX_VALUE));
    await checkIfApproved();
  }, [
    signer,
    selectedPool.contracts,
    contractAddresses,
    selectedPool.tokens,
    checkIfApproved,
    tx,
  ]);

  const handleApproveBaseToken = useCallback(async () => {
    if (
      !signer ||
      !selectedPool.contracts ||
      !selectedPool.tokens ||
      !contractAddresses
    )
      return;
    const strategyContractAddress =
      contractAddresses['STRATEGIES']['INSURED-PERPS'];
    const { underlying } = selectedPool.tokens;
    if (!underlying) return;

    const tokenContract = ERC20__factory.connect(
      contractAddresses[underlying],
      signer
    );
    tx(tokenContract.approve(strategyContractAddress, MAX_VALUE));
    await checkIfApproved();
  }, [
    signer,
    selectedPool.contracts,
    contractAddresses,
    tx,
    selectedPool.tokens,
    checkIfApproved,
  ]);

  useEffect(() => {
    checkIfApproved();
  }, [checkIfApproved]);

  useEffect(() => {
    getPreStrategyCalculations();
  }, [getPreStrategyCalculations]);

  const useStrategy = useCallback(async () => {
    if (
      !contractAddresses ||
      !signer ||
      !selectedPool ||
      !selectedPool.state.expiryTime ||
      !selectedPool.asset ||
      !chainId ||
      !selectedCollateral ||
      !positionBalance ||
      !selectedToken ||
      !chainId
    ) {
      return;
    }

    const strategyContract = LongPerpStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS'],
      signer
    );

    let path: string[] = [];
    if (selectedToken === 'USDT') {
      path = [contractAddresses['USDT'], contractAddresses['WETH']];
    }
    if (selectedToken === 'WETH') path = [contractAddresses['WETH']];

    await strategyContract.useStrategyAndOpenLongPosition(
      {
        path: path,
        indexToken: contractAddresses['WETH'],
        positionCollateralSize: getContractReadableAmount(
          positionBalance,
          getTokenDecimals(selectedToken, chainId)
          // getTokenDecimals(selectedToken, chainId)
        ),
        positionSize: strategyDetails.positionSize,
        executionFee: MIN_EXECUTION_FEE,
        referralCode: DEFAULT_REFERRAL_CODE,
        isCollateralOptionToken: selectedCollateral === 'AC-OPTIONS',
      },
      keepCollateral,
      selectedPool.state.expiryTime,
      {
        value: MIN_EXECUTION_FEE,
      }
    );
  }, [
    chainId,
    contractAddresses,
    positionBalance,
    selectedCollateral,
    selectedPool,
    selectedToken,
    signer,
    strategyDetails.positionSize,
    keepCollateral,
  ]);

  const handleKeepCollateral = (event: any, checked: boolean) => {
    setKeepCollateral(() => checked);
  };

  return (
    <Dialog open={isOpen} onKeyPress={onEscapePressed}>
      <Box className="flex flex-row justify-center items-center mb-5">
        <Typography className="w-full text-center" variant="h6">
          Open Long Position
        </Typography>
        <Box onClick={setClose} className=" flex flex-row-reverse">
          <ArrowRightIcon fill="white" className="cursor-pointer" />
        </Box>
      </Box>
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
                className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1"
                role="button"
                onClick={() => setOpenTokenSelector(() => true)}
              >
                <img
                  src={`/images/tokens/${selectedToken}.svg`}
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
        <TokenSelector
          setSelection={selectToken}
          open={openTokenSelector}
          setOpen={setOpenTokenSelector}
          tokens={allowedTokens}
        />
      </Box>
      <Box className="flex p-3 flex-col ">
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
        <Box className="flex">
          <CollateralSelector
            collateral={selectedCollateral}
            setCollateral={handleCollateralSelectChange}
            options={[
              {
                title: 'WETH',
                asset: 'WETH',
              },
              {
                title: 'AC Option',
                asset: 'AC-OPTIONS',
              },
            ]}
          />
        </Box>
        {selectedCollateral !== 'AC-OPTIONS' && (
          <Box className="px-1 mb-2 flex justify-between items-center ">
            <Typography variant="h6">
              Keep Collateral on Expiry
              <Tooltip title="Choose whether to keep collateral incase puts are ITM and would like to keep the position post expiry. Note: Positions that have AC options as collateral cannot keep collateral beyond expiry of the pool and will be automatically closed on expiry.">
                <InfoOutlined className="h-4" />
              </Tooltip>
            </Typography>
            <Switch
              className="mt-1"
              onChange={handleKeepCollateral}
              value={keepCollateral}
              color="primary"
            />
          </Box>
        )}
        <StrategyDetails
          data={strategyDetails}
          selectedCollateral={selectedCollateral}
          selectedToken={selectedToken}
          positionCollateral={getContractReadableAmount(
            positionBalance,
            getTokenDecimals(selectedToken, chainId)
          )}
          quoteToken={selectedPoolTokens.deposit}
          baseToken={selectedPoolTokens.underlying}
        />
        <Box className="flex flex-col w-full mt-2 p-4">
          <Box className="flex flex-row w-full">
            <CustomButton
              onClick={handleApproveBaseToken}
              disabled={
                positionBalance === '' || parseInt(positionBalance) === 0
              }
              className={`${isApproved.base && 'hidden'} flex-1 mx-1 display ${
                !isApproved.base && 'animate-pulse '
              }`}
            >
              Approve {'WETH'}
            </CustomButton>
            <CustomButton
              onClick={handleApproveQuoteToken}
              disabled={
                positionBalance === '' || parseInt(positionBalance) === 0
              }
              className={` ${isApproved.quote && 'hidden'} flex-1 mx-1 ${
                !isApproved.quote && 'animate-pulse '
              }`}
            >
              Approve {'USDT'}
            </CustomButton>
          </Box>
          <CustomButton
            disabled={
              !isApproved.base ||
              !isApproved.quote ||
              positionBalance === '' ||
              parseInt(positionBalance) === 0
            }
            onClick={useStrategy}
            className="mx-1 my-1"
          >
            Long
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};
