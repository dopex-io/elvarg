import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { BigNumber } from 'ethers';
import format from 'date-fns/format';
import axios from 'axios';
import cx from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import ZapInButton from 'components/common/ZapInButton';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';
import { RateVaultContext } from 'contexts/RateVault';

import { MAX_VALUE } from 'constants/index';

import styles from './styles.module.scss';
import Curve2PoolSelector from './components/Curve2PoolSelector';

export interface Props {
  activeVaultContextSide: string;
  strikeIndex: number;
  setStrikeIndex: Function;
  poolName: string;
}

const now = new Date();

const PurchaseCard = ({
  activeVaultContextSide,
  strikeIndex,
  setStrikeIndex,
  poolName,
}: Props) => {
  const rateVaultContext = useContext(RateVaultContext);
  const { rateVaultEpochData } = rateVaultContext;
  const {
    accountAddress,
    provider,
    chainId,
    signer,
    contractAddresses,
    updateAssetBalances,
    tokenPrices,
  } = useBoundStore();

  const { epochTimes } = rateVaultContext.rateVaultEpochData;

  const epochEndTime: Date = useMemo(() => {
    return new Date(epochTimes[1].toNumber() * 1000);
  }, [epochTimes]);

  // @ts-ignore TODO: FIX
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);

  // @ts-ignore TODO: FIX
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(false);

  const { epochStrikes } = rateVaultEpochData;

  const [approved, setApproved] = useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  // @ts-ignore TODO: FIX
  const [isPurchaseStatsLoading, setIsPurchaseStatsLoading] =
    useState<Boolean>(false);

  const userEpochStrikePurchasableAmount: number = useMemo(() => {
    let available, deposits;

    if (activeVaultContextSide === 'CALL') {
      deposits = rateVaultContext.rateVaultEpochData.callsDeposits[strikeIndex];
      if (deposits)
        available = deposits.sub(
          rateVaultContext.rateVaultEpochData.totalCallsPurchased
        );
    } else if (activeVaultContextSide === 'PUT') {
      deposits = rateVaultContext.rateVaultEpochData.putsDeposits[strikeIndex];
      if (deposits)
        available = deposits.sub(
          rateVaultContext.rateVaultEpochData.totalPutsPurchased
        );
    }

    return getUserReadableAmount(available || BigNumber.from('0'), 18);
  }, [strikeIndex, activeVaultContextSide, rateVaultContext]);

  const [rawNotionalSize, setRawNotionalSize] = useState<string>('1000');

  const notionalSize: number = useMemo(() => {
    return parseFloat(rawNotionalSize) || 0;
  }, [rawNotionalSize]);

  const optionPrice: BigNumber = useMemo(() => {
    const _price =
      activeVaultContextSide === 'CALL'
        ? rateVaultEpochData.callsCosts[strikeIndex]
        : rateVaultEpochData.putsCosts[strikeIndex];

    return _price || BigNumber.from('0');
  }, [rateVaultEpochData, strikeIndex, activeVaultContextSide]);

  const totalCost: BigNumber = useMemo(() => {
    let amount: number = Math.round(notionalSize);
    return Number.isFinite(amount)
      ? optionPrice.mul(BigNumber.from(amount))
      : BigNumber.from('0');
  }, [optionPrice, notionalSize]);

  const fees: BigNumber = useMemo(() => {
    const _fees =
      activeVaultContextSide === 'CALL'
        ? rateVaultEpochData.callsFees[strikeIndex]
        : rateVaultEpochData.putsFees[strikeIndex];

    return (
      _fees?.mul(BigNumber.from(Math.round(notionalSize))) ||
      BigNumber.from('0')
    );
  }, [rateVaultEpochData, strikeIndex, notionalSize, activeVaultContextSide]);

  const premium: BigNumber = useMemo(() => {
    const _premium =
      activeVaultContextSide === 'CALL'
        ? rateVaultEpochData.callsPremiumCosts[strikeIndex]
        : rateVaultEpochData.putsPremiumCosts[strikeIndex];

    return (
      _premium?.mul(BigNumber.from(Math.round(notionalSize))) ||
      BigNumber.from('0')
    );
  }, [rateVaultEpochData, strikeIndex, notionalSize, activeVaultContextSide]);

  const volatility: BigNumber = useMemo(() => {
    return rateVaultEpochData.volatilities[strikeIndex] || BigNumber.from('0');
  }, [rateVaultEpochData, strikeIndex]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [purchaseTokenName, setPurchaseTokenName] = useState<string>('2CRV');

  const isZapActive: boolean = useMemo(() => {
    if (activeVaultContextSide === 'PUT')
      return !['2CRV', 'USDC', 'USDT'].includes(
        purchaseTokenName.toUpperCase()
      );
    return purchaseTokenName.toUpperCase() !== '2CRV'.toUpperCase();
  }, [purchaseTokenName, activeVaultContextSide]);

  const spender = useMemo(() => {
    if (!contractAddresses) return;
    return contractAddresses['RATE-VAULTS'][poolName];
  }, [contractAddresses, poolName]);

  const purchasePower: number = useMemo(() => {
    return parseFloat(
      getUserReadableAmount(
        userTokenBalance,
        getTokenDecimals(purchaseTokenName, chainId)
      ).toString()
    );
  }, [purchaseTokenName, userTokenBalance, chainId]);

  const sendTx = useSendTx();

  const strikes = useMemo(
    () =>
      epochStrikes.map((strike) => getUserReadableAmount(strike, 8).toString()),
    [epochStrikes]
  );

  const selectedTokenPrice: number = useMemo(() => {
    let price = 0;
    tokenPrices.map((record) => {
      if (record['name'] === purchaseTokenName) price = record['price'];
    });
    return price;
  }, [tokenPrices, purchaseTokenName]);

  const isLiquidityEnough = notionalSize < userEpochStrikePurchasableAmount;
  const isPurchasePowerEnough =
    activeVaultContextSide === 'CALL'
      ? purchasePower >= getUserReadableAmount(totalCost, 18)
      : true;

  const openZapIn = () => setIsZapInVisible(true);

  const handleApprove = useCallback(async () => {
    try {
      if (signer)
        await sendTx(
          ERC20__factory.connect(
            contractAddresses[purchaseTokenName],
            signer
          ).approve(spender, MAX_VALUE)
        );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, contractAddresses, purchaseTokenName]);

  const handlePurchase = useCallback(async () => {
    await sendTx(
      rateVaultContext.rateVaultData.rateVaultContract
        .connect(signer)
        .purchase(
          strikeIndex,
          activeVaultContextSide === 'PUT',
          getContractReadableAmount(notionalSize, 18),
          accountAddress
        )
    );

    updateAssetBalances();
    rateVaultContext.updateRateVaultEpochData();
    rateVaultContext.updateRateVaultUserData();
  }, [
    accountAddress,
    rateVaultContext,
    activeVaultContextSide,
    notionalSize,
    sendTx,
    strikeIndex,
    updateAssetBalances,
    signer,
  ]);

  const checkDEXAggregatorStatus = useCallback(async () => {
    try {
      const { status } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/healthcheck`
      );
      setIsZapInAvailable(!!(status === 200));
    } catch (err) {
      setIsZapInAvailable(false);
    }
  }, [chainId]);

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, [checkDEXAggregatorStatus]);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress) return;

      const finalAmount: BigNumber = getContractReadableAmount(
        notionalSize,
        18
      );
      const token = ERC20__factory.connect(
        contractAddresses[purchaseTokenName],
        provider
      );
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        spender
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    purchaseTokenName,
    accountAddress,
    approved,
    notionalSize,
    contractAddresses,
    spender,
    signer,
    chainId,
    provider,
  ]);

  const purchaseButtonProps = useMemo(() => {
    const disabled = Boolean(
      notionalSize < 1000 ||
        !isPurchasePowerEnough ||
        isPurchaseStatsLoading ||
        getUserReadableAmount(totalCost, 18) > purchasePower ||
        !isLiquidityEnough
    );

    let onClick = () => {};

    if (notionalSize > 0 && isPurchasePowerEnough) {
      if (approved) {
        if (isPurchasePowerEnough) {
          onClick = handlePurchase;
        }
      } else {
        onClick = handleApprove;
      }
    }

    let children = 'Enter an amount';

    if (isLiquidityEnough) {
      if (isPurchaseStatsLoading) {
        children = 'Loading prices...';
      } else if (notionalSize >= 1000) {
        if (getUserReadableAmount(totalCost, 18) > purchasePower) {
          children = 'Insufficient Balance';
        } else if (approved) {
          children = 'Purchase';
        } else {
          children = 'Approve';
        }
      } else {
        children = 'Min. amount is $1000';
      }
    } else {
      children = 'Not enough liquidity';
    }

    return {
      disabled,
      children,
      color: disabled ? 'mineshaft' : 'primary',
      onClick,
    };
  }, [
    approved,
    handleApprove,
    handlePurchase,
    isLiquidityEnough,
    isPurchasePowerEnough,
    isPurchaseStatsLoading,
    notionalSize,
    purchasePower,
    totalCost,
  ]);

  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl lg:pt-4 text-center',
        styles['cardWidth']
      )}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Buy Options</Typography>
      </Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-10">
              <img src={'/images/tokens/crv.svg'} alt={'2CRV'} />
            </Box>
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawNotionalSize}
            onChange={(e) => setRawNotionalSize(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="flex flex-row justify-between">
          <Box className="flex">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2"
            >
              Available:{' '}
              <span className="text-white">
                {formatAmount(userEpochStrikePurchasableAmount, 3)}{' '}
              </span>
            </Typography>
          </Box>
          <Box className="ml-auto mr-0">
            <Typography
              variant="h6"
              className="text-stieglitz text-sm pl-1 pt-2 pr-3"
            >
              Notional size ($)
            </Typography>
          </Box>
        </Box>
      </Box>
      <Curve2PoolSelector
        className="mb-4 ml-1"
        token={purchaseTokenName}
        setToken={setPurchaseTokenName}
        isPurchasing={true}
      />
      <Box>
        <Box className="h-[12.88rem]">
          <Box className={'flex'}>
            <Box className="rounded-tl-xl flex p-3 border border-neutral-800 w-full">
              <Box className={'w-5/6'}>
                <Typography variant="h5" className="text-white pb-1 pr-2">
                  {strikes[strikeIndex]}%
                </Typography>
                <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                  Strike
                </Typography>
              </Box>
              <Box className="bg-mineshaft hover:bg-neutral-700 rounded-md items-center w-1/6 h-fit clickable">
                <IconButton
                  className="p-0"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  size="large"
                >
                  {anchorEl ? (
                    <ArrowDropUpIcon
                      className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
                    />
                  ) : (
                    <ArrowDropDownIcon
                      className={'fill-gray-100 h-50 pl-0.5 pr-1 md:pr-0'}
                    />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  classes={{ paper: 'bg-umbra' }}
                  className="mt-12"
                >
                  {strikes.map((strike, strikeIndex) => (
                    <MenuItem
                      key={strikeIndex}
                      className="capitalize text-white hover:bg-mineshaft cursor-pointer"
                      onClick={() => {
                        setStrikeIndex(strikeIndex);
                        setAnchorEl(null);
                      }}
                    >
                      {strike}%
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
            <Box className="rounded-tr-xl flex flex-col p-3 border border-neutral-800 w-full">
              <Typography variant="h5" className="text-white pb-1 pr-2">
                {epochEndTime > now ? format(epochEndTime, 'd LLL yyyy') : '-'}
              </Typography>
              <Typography variant="h6" className="text-stieglitz pb-1 pr-2">
                Expiry
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-bl-xl rounded-br-xl flex flex-col mb-4 p-3 border border-neutral-800 w-full">
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Breakeven
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {activeVaultContextSide === 'CALL' ? '+' : '-'}
                  {formatAmount(
                    (getUserReadableAmount(optionPrice, 18) * 52) / (1 / 100),
                    2
                  )}
                  %
                </Typography>
              </Box>
            </Box>
            <Box className={'flex justify-between mb-2'}>
              <Box className={'flex'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Option Price
                </Typography>
                <Box className="ml-1 flex items-end">
                  <Tooltip
                    className="h-4 text-stieglitz"
                    title={'Option price for 1000$ of notional'}
                    arrow={true}
                  >
                    <InfoOutlinedIcon />
                  </Tooltip>
                </Box>
              </Box>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  ${formatAmount(getUserReadableAmount(optionPrice, 15), 6)}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex mb-2'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Side
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {activeVaultContextSide}
                </Typography>
              </Box>
            </Box>
            <Box className={'flex'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                IV
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {getUserReadableAmount(volatility, 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="flex mt-3 mb-2"></Box>
      <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-4 p-4 border border-neutral-800 w-full bg-neutral-800">
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Purchasing with
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {purchaseTokenName}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Fees
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(fees, 18), 2)} {'2CRV'}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              Premium
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(premium, 18), 2)}{' '}
                {purchaseTokenName}
              </Typography>
            </Box>
          </Box>
          <Box className={'flex mb-2'}>
            <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
              You will pay
            </Typography>
            <Box className={'text-right'}>
              <Typography variant="h6" className="text-white mr-auto ml-0">
                {formatAmount(getUserReadableAmount(totalCost, 18), 2)}{' '}
                {purchaseTokenName}
              </Typography>
            </Box>
          </Box>
          <EstimatedGasCostButton gas={700000} chainId={chainId} />
        </Box>
        <ZapInButton
          openZapIn={openZapIn}
          isZapActive={isZapActive}
          quote={{}}
          path={{}}
          isFetchingPath={false}
          fromTokenSymbol={purchaseTokenName}
          toTokenSymbol={'USDC'}
          selectedTokenPrice={selectedTokenPrice}
          isZapInAvailable={false}
          chainId={chainId}
        />
        <Box className="flex">
          <Box className="flex text-center p-2 mr-2 mt-1">
            <AlarmIcon />
          </Box>
          <Typography variant="h6" className="text-stieglitz">
            This option will <span className="text-white">Auto Exercise</span>{' '}
            and can be settled anytime after expiry.
          </Typography>
        </Box>
        <CustomButton
          size="medium"
          className="w-full mt-4 !rounded-md"
          color={purchaseButtonProps.color}
          disabled={purchaseButtonProps.disabled}
          onClick={purchaseButtonProps.onClick}
        >
          {purchaseButtonProps.children}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PurchaseCard;
