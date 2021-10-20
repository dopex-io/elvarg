import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import {
  OptionPool,
  OptionPoolBroker__factory,
  ERC20__factory,
  VolumePool__factory,
  Dopex__factory,
  Router__factory,
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
import { newEthersTransaction } from 'utils/contracts/transactions';
import { getWeeklyPool, getMonthlyPool } from 'utils/contracts/getPool';
import oneEBigNumber from 'utils/math/oneEBigNumber';
import getTimePeriod from 'utils/contracts/getTimePeriod';

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

  const { selectedOptionData, expiry } = useContext(OptionsContext);
  const {
    selectedBaseAsset,
    selectedBaseAssetContract,
    selectedBaseAssetDecimals,
    usdtContract,
    userAssetBalances,
  } = useContext(AssetsContext);
  const { provider, accountAddress, contractAddresses, signer } =
    useContext(WalletContext);

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
        // This else if can be deleted when the new router (that allows volume pool funds to be used) is deployed
      } else if (values.useVolumePoolFunds && values.delegate) {
        errors.amount = 'Please enable auto exercise after purchasing';
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

  const purchaseOptions = useCallback(async () => {
    if (!usdtContract || !signer) return;
    setTxError('');
    try {
      const amount = await getContractReadableAmount(
        formik.values.amount,
        selectedBaseAssetDecimals
      );

      const strike = BigNumber.from(selectedOptionData.strikePrice).mul(
        STRIKE_PRECISION
      );

      const weeklyPool = poolState?.weeklyPool;

      const monthlyPool = poolState?.monthlyPool;

      const router = Router__factory.connect(contractAddresses.Router, signer);

      if (
        weeklyPool &&
        (await weeklyPool.contract.isValidExpiry(expiry / 1000)) &&
        (await weeklyPool.contract.isPoolReady(
          await weeklyPool.contract.getCurrentEpoch()
        ))
      ) {
        const allowance = await usdtContract.allowance(
          accountAddress,
          router.address
        );

        if (!amount.lt(allowance)) {
          const signerUsdtContract = ERC20__factory.connect(
            usdtContract.address,
            signer
          );
          await newEthersTransaction(
            signerUsdtContract.approve(router.address, MAX_VALUE)
          );
        }

        const usdtBalance = await usdtContract.balanceOf(accountAddress);

        await newEthersTransaction(
          router.purchaseOption(usdtBalance, {
            useVolumePoolFunds: formik.values.useVolumePoolFunds,
            isPut: isPut,
            delegate: formik.values.delegate,
            strike: strike,
            expiry: expiry / 1000,
            amount: amount,
            timePeriod: getTimePeriod('weekly'),
            baseAssetAddress: selectedBaseAssetContract.address,
            quoteAssetAddress: usdtContract.address,
            to: accountAddress,
          })
        );
      } else if (
        monthlyPool &&
        (await monthlyPool.contract.isValidExpiry(expiry / 1000)) &&
        (await monthlyPool.contract.isPoolReady(
          await monthlyPool.contract.getCurrentEpoch()
        ))
      ) {
        const allowance = await usdtContract.allowance(
          accountAddress,
          monthlyPool.address
        );

        if (!amount.lt(allowance)) {
          const signerUsdtContract = ERC20__factory.connect(
            usdtContract.address,
            signer
          );
          await newEthersTransaction(
            signerUsdtContract.approve(monthlyPool.address, MAX_VALUE)
          );
        }

        const usdtBalance = await usdtContract.balanceOf(accountAddress);

        await newEthersTransaction(
          router.purchaseOption(usdtBalance, {
            useVolumePoolFunds: formik.values.useVolumePoolFunds,
            isPut: isPut,
            delegate: formik.values.delegate,
            strike: strike,
            expiry: expiry / 1000,
            amount: amount,
            timePeriod: getTimePeriod('monthly'),
            baseAssetAddress: selectedBaseAssetContract.address,
            quoteAssetAddress: usdtContract.address,
            to: accountAddress,
          })
        );
      } else {
        setTxError('Not enough liquidity');
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
    userVolumePoolFunds,
  };
};

export default useOptionPurchase;
