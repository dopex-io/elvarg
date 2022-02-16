import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import {
  OptionPool,
  ERC20,
  OptionPoolBroker__factory,
  ERC20__factory,
  VolumePool__factory,
  Dopex__factory,
  Router__factory,
  Margin__factory,
} from '@dopex-io/sdk';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import { ethers, BigNumber } from 'ethers';

import { OptionsContext, OptionTypeEnum } from 'contexts/Options';
import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import parseError from 'utils/general/parseError';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import isZeroAddress from 'utils/contracts/isZeroAddress';
import { getWeeklyPool, getMonthlyPool } from 'utils/contracts/getPool';
import oneEBigNumber from 'utils/math/oneEBigNumber';
import getTimePeriod from 'utils/contracts/getTimePeriod';
import getOptionPoolId from 'utils/contracts/getOptionPoolId';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE, STRIKE_PRECISION } from 'constants/index';

const getPutOptionsBuyable = (
  quotePoolAssets: BigNumber,
  strikePrice: BigNumber
): BigNumber => {
  return strikePrice.isZero()
    ? BigNumber.from(0)
    : BigNumber.from(quotePoolAssets)
        .mul(oneEBigNumber(2))
        .div(strikePrice.mul(oneEBigNumber(8)))
        .mul(oneEBigNumber(18));
};

const useOptionPurchase = () => {
  const [isPut, setIsPut] = useState(false);
  const [poolState, setPoolState] = useState<{
    weeklyPool?: OptionPool;
    weeklyBasePoolAssets: string;
    weeklyQuotePoolAssets: string;
    monthlyPool?: OptionPool;
    monthlyBasePoolAssets: string;
    monthlyQuotePoolAssets: string;
  }>({
    weeklyBasePoolAssets: '0',
    weeklyQuotePoolAssets: '0',
    monthlyBasePoolAssets: '0',
    monthlyQuotePoolAssets: '0',
  });
  const [totalPrice, setTotalPrice] = useState('0');
  const [fees, setFees] = useState('0');
  const [userVolumePoolFunds, setUserVolumePoolFunds] = useState('0');
  const [txError, setTxError] = useState('');

  const { selectedOptionData, expiry, marginData } = useContext(OptionsContext);
  const {
    selectedBaseAsset,
    selectedBaseAssetContract,
    selectedBaseAssetDecimals,
    usdtContract,
    userAssetBalances,
    usdtDecimals,
  } = useContext(AssetsContext);
  const { provider, accountAddress, contractAddresses, signer } =
    useContext(WalletContext);

  const { collaterals } = marginData;
  const marginAvailable = collaterals.length > 0;
  const maxLeverage = useMemo(
    () =>
      marginData.maxLeverage !== '0' && marginData.minLeverage !== '0'
        ? BigNumber.from(marginData.maxLeverage)
            .div(marginData.minLeverage)
            .toString()
        : '0',
    [marginData.maxLeverage, marginData.minLeverage]
  );

  const sendTx = useSendTx();

  useEffect(() => {
    setIsPut(selectedOptionData.optionType === OptionTypeEnum.Put);
  }, [selectedOptionData.optionType]);

  useEffect(() => {
    if (!provider || !selectedBaseAsset || !usdtContract) return null;

    (async function () {
      const weeklyPool = await getWeeklyPool(
        provider,
        selectedBaseAsset,
        contractAddresses
      );

      if (!isZeroAddress(weeklyPool.address)) {
        const [weeklyBasePoolAssets, weeklyQuotePoolAssets] = await Promise.all(
          [
            weeklyPool.contract.getAvailablePoolFunds(false),
            weeklyPool.contract.getAvailablePoolFunds(true),
          ]
        );

        setPoolState((prevState) => ({
          ...prevState,
          weeklyPool,
          weeklyBasePoolAssets: weeklyBasePoolAssets.toString(),
          weeklyQuotePoolAssets: weeklyQuotePoolAssets.toString(),
        }));
      }

      const monthlyPool = await getMonthlyPool(
        provider,
        selectedBaseAsset,
        contractAddresses
      );

      if (!isZeroAddress(monthlyPool.address)) {
        const [monthlyBasePoolAssets, monthlyQuotePoolAssets] =
          await Promise.all([
            monthlyPool.contract.getAvailablePoolFunds(false),
            monthlyPool.contract.getAvailablePoolFunds(true),
          ]);

        setPoolState((prevState) => ({
          ...prevState,
          monthlyPool,
          monthlyBasePoolAssets: monthlyBasePoolAssets.toString(),
          monthlyQuotePoolAssets: monthlyQuotePoolAssets.toString(),
        }));
      }
    })();
  }, [
    selectedBaseAsset,
    provider,
    contractAddresses,
    selectedOptionData,
    usdtContract,
  ]);

  const formik = useFormik({
    initialValues: {
      amount: 1,
      useVolumePoolFunds: false,
      delegate: false,
      margin: false,
      collateralAmount: 1,
      collateralIndex: 0,
      leverage: 1,
    },
    validate: (values) => {
      const errors: any = {};

      if (!accountAddress) return errors;
      if (!values.amount) {
        errors.amount = 'Please enter an amount';
      } else if (values.amount < 0) {
        errors.amount = 'Amount needs to larger than 0';
      } else if (
        (isPut
          ? getPutOptionsBuyable(
              BigNumber.from(poolState.weeklyQuotePoolAssets ?? 0),
              BigNumber.from(selectedOptionData.strikePrice ?? 0)
            )
          : BigNumber.from(poolState.weeklyBasePoolAssets ?? 0)
        ).lte(getContractReadableAmount(values.amount, 18))
      ) {
        errors.amount = 'Not enough liquidity';
      } else if (values.margin && values.delegate) {
        errors.amount = 'Auto exercise cannot be enabled with margin';
      } else if (
        values.useVolumePoolFunds &&
        BigNumber.from(userVolumePoolFunds).lt(
          BigNumber.from(totalPrice).add(fees)
        )
      ) {
        errors.amount = 'Not enough balance in volume pool';
      } else if (
        !values.useVolumePoolFunds &&
        BigNumber.from(userAssetBalances.USDT).lt(
          BigNumber.from(totalPrice).add(fees)
        )
      ) {
        errors.amount = 'Not enough balance in wallet';
      } else if (values.margin && !marginAvailable) {
        errors.amount = 'Margin trading not available';
      } else if (
        values.margin &&
        values.collateralIndex >= collaterals.length
      ) {
        errors.amount = 'Invalid collateral selected';
      } else if (values.margin && values.collateralAmount < 0) {
        errors.amount = 'Invalid collateral amount';
      } else if (
        values.margin &&
        (values.leverage >
          Number(marginData.maxLeverage) / Number(marginData.minLeverage) ||
          values.leverage < 1)
      ) {
        errors.amount = 'Invalid leverage';
      }

      return errors;
    },
    onSubmit: noop,
  });

  useEffect(() => {
    (async function () {
      if (
        !provider ||
        !contractAddresses ||
        !selectedBaseAssetDecimals ||
        !selectedOptionData.optionPrice ||
        !poolState.weeklyPool
      )
        return;
      const optionPoolBroker = OptionPoolBroker__factory.connect(
        contractAddresses.OptionPoolBroker,
        provider
      );

      const costFromContract = await optionPoolBroker.getTotalOptionCost(
        ethers.utils
          .parseEther(selectedOptionData.optionPrice.toString())
          .div(oneEBigNumber(10)),
        ethers.utils.parseEther(String(formik.values.amount)),
        poolState.weeklyPool?.address,
        false
      );

      setTotalPrice(costFromContract[0].toString());
      setFees(costFromContract[1].toString());
      setTxError('');
    })();
  }, [
    formik.values.amount,
    contractAddresses,
    selectedOptionData.optionPrice,
    provider,
    selectedBaseAssetDecimals,
    poolState.weeklyPool,
  ]);

  const collateralValue = useMemo(
    () =>
      formik.values.collateralIndex < collaterals.length
        ? BigNumber.from(
            collaterals[formik.values.collateralIndex]?.price ?? '0'
          )
            .mul(
              getContractReadableAmount(
                formik.values.collateralAmount,
                collaterals[formik.values.collateralIndex]?.decimals ?? 0
              )
            )
            .div(ethers.utils.parseUnits('1', usdtDecimals))
            .toString()
        : '0',
    [formik, collaterals, usdtDecimals]
  );

  const requiredCollateralValue = useMemo(
    () =>
      formik.values.collateralIndex < collaterals.length
        ? BigNumber.from(totalPrice)
            .mul(
              collaterals[formik.values.collateralIndex]
                ?.collateralizationRatio ?? '0'
            )
            .div('100')
            .toString()
        : totalPrice,
    [totalPrice, collaterals, formik]
  );

  const handleChange = useCallback(
    async (e) => {
      formik.setFieldValue('amount', Number(e.target.value));

      if (e.target.value <= 0) {
        setTotalPrice('0');
        setFees('0');
        return;
      }
    },
    [formik]
  );

  const handleCollateralAmount = useCallback(
    async (e) => {
      formik.setFieldValue('collateralAmount', Number(e.target.value));
    },
    [formik]
  );

  const handleLeverage = useCallback(
    async (e) => {
      formik.setFieldValue('leverage', Number(e.target.value));
    },
    [formik]
  );

  const handleCollateralIndex = useCallback(
    (e) => formik.setFieldValue('collateralIndex', Number(e)),
    [formik]
  );

  const purchaseOptions = useCallback(async () => {
    if (!usdtContract || !signer) return;
    setTxError('');
    try {
      const amount = getContractReadableAmount(
        formik.values.amount,
        selectedBaseAssetDecimals
      );

      const collateralAmount = formik.values.margin
        ? getContractReadableAmount(
            formik.values.collateralAmount,
            collaterals[formik.values.collateralIndex].decimals
          )
        : BigNumber.from('0');
      const leverage = formik.values.margin
        ? BigNumber.from(
            Math.round(
              Number(formik.values.leverage) * Number(marginData.minLeverage)
            ).toString()
          )
        : BigNumber.from('0');

      const strike = BigNumber.from(selectedOptionData.strikePrice).mul(
        STRIKE_PRECISION
      );

      const weeklyPool = poolState?.weeklyPool;

      const monthlyPool = poolState?.monthlyPool;

      const router = Router__factory.connect(contractAddresses.Router, signer);

      const margin = contractAddresses.Margin
        ? Margin__factory.connect(contractAddresses.Margin, signer)
        : undefined;

      const approveToken: ERC20 = formik.values.margin
        ? ERC20__factory.connect(
            collaterals[formik.values.collateralIndex].token,
            signer
          )
        : ERC20__factory.connect(usdtContract.address, signer);
      const approveContractAddress = formik.values.margin
        ? margin.address
        : router.address;
      const approveAmount = formik.values.margin ? collateralAmount : amount;

      let timePeriod: 'weekly' | 'monthly' | undefined;

      if (
        weeklyPool &&
        (await weeklyPool.contract.isValidExpiry(expiry / 1000)) &&
        (await weeklyPool.contract.isPoolReady(
          await weeklyPool.contract.getCurrentEpoch()
        ))
      ) {
        timePeriod = 'weekly';
      } else if (
        monthlyPool &&
        (await monthlyPool.contract.isValidExpiry(expiry / 1000)) &&
        (await monthlyPool.contract.isPoolReady(
          await monthlyPool.contract.getCurrentEpoch()
        ))
      ) {
        timePeriod = 'monthly';
      } else {
        setTxError('Not enough liquidity');
      }

      if (timePeriod) {
        const allowance = await approveToken.allowance(
          accountAddress,
          approveContractAddress
        );

        if (!approveAmount.lt(allowance)) {
          await sendTx(approveToken.approve(approveContractAddress, MAX_VALUE));
        }

        if (formik.values.margin) {
          await margin.openMarginPosition({
            useVolumePoolFunds: formik.values.useVolumePoolFunds,
            isPut: isPut,
            amount: amount,
            leverage: leverage,
            strike: strike,
            expiry: expiry / 1000,
            collateralAmount: collateralAmount,
            collateral: collaterals[formik.values.collateralIndex].token,
            optionPoolId: getOptionPoolId(
              selectedBaseAssetContract.address,
              usdtContract.address,
              timePeriod
            ),
          });
        } else {
          const usdtBalance = await usdtContract.balanceOf(accountAddress);

          await sendTx(
            router.purchaseOption(usdtBalance, {
              useVolumePoolFunds: formik.values.useVolumePoolFunds,
              isPut: isPut,
              delegate: formik.values.delegate,
              strike: strike,
              expiry: expiry / 1000,
              amount: amount,
              timePeriod: getTimePeriod(timePeriod),
              baseAssetAddress: selectedBaseAssetContract.address,
              quoteAssetAddress: usdtContract.address,
              to: accountAddress,
            })
          );
        }
      }
    } catch (err) {
      setTxError(`Something went wrong. Error: ${parseError(err)}`);
    }
    // resets option size at purchase panel to 1
    formik.setFieldValue('amount', 1);
  }, [
    selectedOptionData,
    formik,
    accountAddress,
    usdtContract,
    expiry,
    selectedBaseAssetDecimals,
    selectedBaseAssetContract,
    isPut,
    poolState,
    contractAddresses,
    signer,
    collaterals,
    marginData,
    sendTx,
  ]);

  const availableOptions = useMemo(() => {
    return isPut
      ? getPutOptionsBuyable(
          BigNumber.from(poolState.weeklyQuotePoolAssets ?? 0),
          BigNumber.from(selectedOptionData.strikePrice ?? 0)
        )
      : BigNumber.from(poolState.weeklyBasePoolAssets ?? 0);
  }, [
    isPut,
    poolState.weeklyQuotePoolAssets,
    poolState.weeklyBasePoolAssets,
    selectedOptionData.strikePrice,
  ]);

  const handleMargin = useCallback(
    (e) => formik.setFieldValue('margin', e.target.checked),
    [formik]
  );

  const handleUseVolumePool = useCallback(
    (e) => formik.setFieldValue('useVolumePoolFunds', e.target.checked),
    [formik]
  );

  const handleDelegate = useCallback(
    (e) => formik.setFieldValue('delegate', e.target.checked),
    [formik]
  );

  useEffect(() => {
    if (!provider || !contractAddresses || !accountAddress) return;
    async function getVolumePoolUserFunds() {
      const volumePoolContract = VolumePool__factory.connect(
        contractAddresses.VolumePool,
        provider
      );

      const dopex = Dopex__factory.connect(contractAddresses.Dopex, provider);

      const epoch = await dopex.getCurrentGlobalWeeklyEpoch();

      const data = await volumePoolContract.userVolumePoolFunds(
        accountAddress,
        epoch
      );

      setUserVolumePoolFunds(data.toString());
    }

    getVolumePoolUserFunds();
  }, [provider, accountAddress, contractAddresses]);

  return {
    txError,
    availableOptions,
    expiry,
    fees,
    formik,
    handleChange,
    isPut,
    purchaseOptions,
    selectedBaseAsset,
    selectedOptionData,
    totalPrice,
    userAssetBalances,
    handleMargin,
    handleUseVolumePool,
    handleDelegate,
    handleCollateralIndex,
    handleCollateralAmount,
    handleLeverage,
    userVolumePoolFunds,
    maxLeverage,
    collaterals,
    marginAvailable,
    collateralValue,
    requiredCollateralValue,
  };
};

export default useOptionPurchase;
