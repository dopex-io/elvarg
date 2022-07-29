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
import Button from '@mui/material/Button';
import { SelectChangeEvent } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useDebounce } from 'use-debounce';

import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import CustomInput from 'components/UI/CustomInput';
import CustomButton from 'components/UI/CustomButton';
import CollateralSelector from 'components/atlantics/InsuredPerpsModal/CollateralSelector';
import StrategyDetails from 'components/atlantics/InsuredPerpsModal/StrategyDetails/StrategyDetails';
import Switch from 'components/UI/Switch';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { WalletContext } from 'contexts/Wallet';
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
    value: 4.9,
    label: '4.9x',
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

export const OpenPositionDialog = ({ isOpen, handleClose }: IProps) => {
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
  const [selectedToken, setSelectedToken] = useState<string>('USDC');
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
    if (
      !selectedPool ||
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
    const indexTokenPrice = (await putsContract.getUsdPrice()).mul(
      oneEBigNumber(22)
    );

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
        selectedPool.config.tickSize,
        contractAddresses[underlying]
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
    selectedPool,
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
      !selectedPool ||
      !selectedPool.contracts ||
      !accountAddress ||
      !selectedPool.asset ||
      !contractAddresses ||
      !selectToken
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

    let baseTokenCost = debouncedStrategyDetails[0].callOptionsFees
      .add(debouncedStrategyDetails[0].callOptionsPremium)
      .add(debouncedStrategyDetails[0].callsFundingFee);
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
    selectedPool,
    accountAddress,
    contractAddresses,
    debouncedStrategyDetails,
    selectedToken,
    chainId,
    positionBalance,
  ]);

  const handleApproveQuoteToken = useCallback(async () => {
    if (
      !signer ||
      !selectedPool ||
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

    try {
      await sendTx(tokenContract.approve(strategyContractAddress, MAX_VALUE));
    } catch (err) {
      console.log(err);
    }

    await checkIfApproved();
  }, [signer, selectedPool, contractAddresses, checkIfApproved, sendTx]);

  const handleApproveBaseToken = useCallback(async () => {
    if (
      !signer ||
      !selectedPool ||
      !selectedPool.contracts ||
      !selectedPool.tokens ||
      !contractAddresses
    )
      return;
    try {
      const strategyContractAddress =
        contractAddresses['STRATEGIES']['INSURED-PERPS'];
      const { underlying } = selectedPool.tokens;
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
  }, [signer, contractAddresses, sendTx, checkIfApproved, selectedPool]);

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
      !contractAddresses['STRATEGIES']['INSURED-PERPS'] ||
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

    try {
      const strategyContract = LongPerpStrategy__factory.connect(
        contractAddresses['STRATEGIES']['INSURED-PERPS'],
        signer
      );

      let path: string[] = [];
      if (selectedToken === 'USDC') {
        path = [contractAddresses['USDC'], contractAddresses['WETH']];
      }
      if (selectedToken === 'WETH') path = [contractAddresses['WETH']];

      const _tx = strategyContract.useStrategyAndOpenLongPosition(
        {
          path: path,
          indexToken: contractAddresses['WETH'],
          positionCollateralSize: getContractReadableAmount(
            positionBalance,
            getTokenDecimals(selectedToken, chainId)
          ),
          positionSize: debouncedStrategyDetails[0].positionSize,
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

      await sendTx(_tx);
    } catch (err) {
      console.log(err);
    }
  }, [
    contractAddresses,
    signer,
    selectedPool,
    chainId,
    selectedCollateral,
    positionBalance,
    selectedToken,
    debouncedStrategyDetails,
    keepCollateral,
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
            max={4.9}
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
          <Box className="px-1 mb-2 flex justify-between items-center">
            <Typography variant="h6">
              Keep Collateral on Expiry
              <Tooltip title="Choose whether to keep collateral incase puts are ITM and would like to keep the position post expiry. Note: Positions that have AC options as collateral cannot keep collateral beyond expiry of the pool and will be automatically closed on expiry.">
                <InfoOutlined className="h-4 fill-current text-mineshaft" />
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
          data={debouncedStrategyDetails[0]}
          selectedCollateral={selectedCollateral}
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
            <CustomButton
              onClick={handleApproveBaseToken}
              disabled={
                positionBalance === '' || parseInt(positionBalance) === 0
              }
              className={`${isApproved.base && 'hidden'} flex-1 display ${
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
              className={` ${isApproved.quote && 'hidden'} flex-1 ${
                !isApproved.quote && 'animate-pulse '
              }`}
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
            //   parseInt(positionBalance) === 0
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
