import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessageFromCode } from 'eth-rpc-errors';
import { useFormik } from 'formik';
import { BigNumber } from 'ethers';
import { ERC20__factory, Margin__factory } from '@dopex-io/sdk';
import cx from 'classnames';
import * as yup from 'yup';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';

import { PoolsContext, PoolsProvider } from 'contexts/Pools';
import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import WalletButton from 'components/WalletButton';
import Input from 'components/UI/Input';
import MaxApprove from 'components/MaxApprove';
import ErrorBox from 'components/ErrorBox';

import { MAX_VALUE } from 'constants/index';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import calculateApy from 'utils/contracts/calculateApy';
import sendTx from 'utils/contracts/sendTx';

import styles from './styles.module.scss';

export interface Props {
  open: boolean;
  handleClose: () => void;
  data: {
    isPut: boolean;
    timePeriod: string;
    asset: any;
  };
}

const Margin = () => {
  const [amount, setAmount] = useState('0');
  const [withdraw, setWithdraw] = useState(false);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState(false);
  const [maxApprove, setMaxApprove] = useState(false);

  const validationSchema = yup.object({
    amount: yup
      .number()
      .min(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
  });

  const formik = useFormik({
    initialValues: {
      token: 'USDT',
      amount: '0',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const { setFieldValue } = formik;

  const {
    totalMarginPoolDeposits,
    userMarginPoolDeposits,
    marginPoolSupplyRate,
    updateMarginPoolData,
  } = useContext(PoolsContext);
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);
  const { usdtContract, usdtDecimals, userAssetBalances, updateAssetBalances } =
    useContext(AssetsContext);

  const finalMarginPoolSupplyRate = calculateApy(marginPoolSupplyRate);
  const finalTotalMarginPoolDeposits = getUserReadableAmount(
    totalMarginPoolDeposits,
    usdtDecimals
  );
  const finalUserMarginPoolDeposits = getUserReadableAmount(
    userMarginPoolDeposits,
    usdtDecimals
  );

  const isManage: boolean = finalUserMarginPoolDeposits > 0;

  const userBalance = useMemo(() => {
    return getUserReadableAmount(userAssetBalances['USDT'], usdtDecimals);
  }, [userAssetBalances, usdtDecimals]);

  const handleMax = useCallback(() => {
    if (withdraw) {
      setAmount(finalUserMarginPoolDeposits.toString());
      setFieldValue('amount', Number(finalUserMarginPoolDeposits).toFixed(3));
    } else {
      setAmount(userBalance.toString());
      setFieldValue('amount', Number(userBalance).toFixed(3));
    }
  }, [setFieldValue, userBalance, finalUserMarginPoolDeposits, withdraw]);

  const inputHandleChange = useCallback(
    (e) => {
      setFieldValue('amount', e.target.value);
      setAmount(e.target.value.toString());
    },
    [setFieldValue, setAmount]
  );

  useEffect(() => {
    if (!usdtContract || !accountAddress || !contractAddresses.Margin) return;
    (async function () {
      const finalAmount = getContractReadableAmount(amount, usdtDecimals);

      const usdtAllowance = await usdtContract.allowance(
        accountAddress,
        contractAddresses.Margin
      );
      setApproved(finalAmount.lte(usdtAllowance));
    })();
  }, [accountAddress, amount, usdtContract, usdtDecimals, contractAddresses]);

  const handleApprove = useCallback(async () => {
    setError('');
    try {
      if (!maxApprove) {
        if (!amount) {
          setError('Please enter an amount.');
          return;
        }
        if (Number(amount) < 0) {
          setError('Please enter a valid amount.');
          return;
        }
      }
      const finalAmount = getContractReadableAmount(amount, usdtDecimals);
      await sendTx(
        ERC20__factory.connect(usdtContract.address, signer).approve(
          contractAddresses.Margin,
          maxApprove ? MAX_VALUE : finalAmount
        )
      );
      setApproved(true);
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    signer,
    amount,
    maxApprove,
    contractAddresses,
    usdtContract,
    usdtDecimals,
  ]);

  const handleDeposit = useCallback(async () => {
    setError('');
    try {
      if (!amount) {
        setError('Please enter an amount.');
        return;
      }
      if (Number(amount) < 0) {
        setError('Please enter a valid amount.');
        return;
      }
      const finalAmount = getContractReadableAmount(amount, usdtDecimals);
      if (finalAmount.gt(userAssetBalances['USDT'])) {
        setError('Insufficient Balance');
        return;
      }
      await sendTx(
        Margin__factory.connect(contractAddresses.Margin, signer).deposit(
          finalAmount
        )
      );
      updateMarginPoolData();
      updateAssetBalances();
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    amount,
    signer,
    usdtDecimals,
    updateAssetBalances,
    userAssetBalances,
    updateMarginPoolData,
    contractAddresses,
  ]);

  const handleWithdraw = useCallback(async () => {
    setError('');
    try {
      const finalAmount = getContractReadableAmount(amount, usdtDecimals);
      if (finalAmount.gt(BigNumber.from(userMarginPoolDeposits))) {
        setError('Insufficient deposits');
        return;
      }
      await sendTx(
        Margin__factory.connect(contractAddresses.Margin, signer).withdraw(
          finalAmount
        )
      );
      updateMarginPoolData();
      updateAssetBalances();
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    signer,
    amount,
    updateAssetBalances,
    updateMarginPoolData,
    contractAddresses,
    userMarginPoolDeposits,
  ]);

  useEffect(() => {
    if (!isManage) {
      setWithdraw(false);
    }
  }, [isManage]);

  useEffect(() => {
    if (withdraw && !(finalUserMarginPoolDeposits === 0)) {
      setAmount(finalUserMarginPoolDeposits.toString());
      setFieldValue('amount', Number(finalUserMarginPoolDeposits).toFixed(3));
    }
  }, [withdraw, finalUserMarginPoolDeposits, setFieldValue]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className="overflow-x-hidden bg-black text-white min-h-screen">
      <AppBar active="pools" />
      <Box className={cx('mx-auto my-40 px-2', styles.cardSize)}>
        <Box className="flex flex-col mb-14 bg-cod-gray p-5 rounded-xl">
          <Box className="flex flex-row justify-between mb-4">
            <Box className="flex flex-row">
              <IconButton className=" w-3 h-3 mr-3 mt-1">
                <Link to="/pools">
                  <ArrowBackIcon className="text-stieglitz" />
                </Link>
              </IconButton>
              <Typography variant="h4" className="mt-1">
                {isManage ? `Manage` : `Supply liquidity`}
              </Typography>
            </Box>
            {isManage && (
              <Box className="flex space-x-2">
                <Button
                  onClick={() => setWithdraw(true)}
                  className={cx(
                    'rounded-md h-10 ml-1 text-white hover:bg-opacity-70',
                    !withdraw
                      ? 'bg-umbra hover:bg-cod-gray'
                      : 'bg-primary hover:bg-primary'
                  )}
                >
                  Withdraw
                </Button>
                <Button
                  onClick={() => setWithdraw(false)}
                  className={cx(
                    'rounded-md h-10 ml-1 text-white hover:bg-opacity-70',
                    withdraw
                      ? 'bg-umbra hover:bg-cod-gray'
                      : 'bg-primary hover:bg-primary'
                  )}
                >
                  Deposit
                </Button>
              </Box>
            )}
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz mb-2">
              {isManage
                ? withdraw
                  ? `Deposited: ${formatAmount(finalUserMarginPoolDeposits)}`
                  : `Balance: ${formatAmount(userBalance)}`
                : `Balance: ${formatAmount(userBalance)}`}
            </Typography>
            <Typography
              variant="h6"
              className="text-wave-blue uppercase mb-2 mr-2"
              role="button"
              onClick={handleMax}
            >
              Max
            </Typography>
          </Box>
          <Input
            id="amount"
            name="amount"
            value={formik.values.amount}
            onBlur={formik.handleBlur}
            onChange={inputHandleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            type="number"
            leftElement={
              <Box
                className={cx(
                  'bg-cod-gray py-2 px-3 rounded-xl flex space-x-2 items-center'
                )}
              >
                <Box className="w-8">
                  <img src={'/assets/usdt.svg'} alt="USDT" />
                </Box>
                <Box>USDT</Box>
              </Box>
            }
          />
          <Box className="flex flex-col justify-between w-full mt-4">
            <Box className="flex flex-col w-full border-cod-gray rounded-xl border p-4 bg-umbra space-y-4 mb-4">
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Asset
                </Typography>
                <Typography variant="h6">USDT</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  APY
                </Typography>
                <Typography variant="h6">
                  {`${formatAmount(finalMarginPoolSupplyRate)}%`}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="h6" className="text-stieglitz">
                  Deposits
                </Typography>
                <Typography variant="h6">
                  {finalUserMarginPoolDeposits > 0 ? (
                    <Box>
                      <span className="text-wave-blue">
                        ${formatAmount(finalUserMarginPoolDeposits)}
                      </span>
                      {` / $${formatAmount(finalTotalMarginPoolDeposits)}`}
                    </Box>
                  ) : (
                    `$${formatAmount(finalTotalMarginPoolDeposits)}`
                  )}
                </Typography>
              </Box>
              <Box className="rounded-xl w-full text-center flex flex-col bg-cod-gray p-4">
                <Typography variant="h6">
                  {finalUserMarginPoolDeposits > 0 ? (
                    <Box>
                      <span className="text-wave-blue">
                        {formatAmount(finalUserMarginPoolDeposits)}
                      </span>
                      {` / ${formatAmount(finalTotalMarginPoolDeposits)}`}
                    </Box>
                  ) : (
                    formatAmount(finalTotalMarginPoolDeposits)
                  )}
                </Typography>
                <Typography variant="h6" className="text-stieglitz">
                  USDT
                </Typography>
              </Box>
            </Box>
            <Box className="lg:w-96 border-umbra rounded-xl border p-4 mb-4">
              <Typography
                variant="h6"
                className="text-stieglitz"
                component="div"
              >
                The USDT lending pool lends USDT and collects interest from
                users who buy options on margin.
              </Typography>
            </Box>
            <ErrorBox error={error} className="mb-4" />
            {!withdraw && formik.values.amount <= '0' ? (
              <WalletButton size="large" className="w-full" disabled>
                Enter an amount
              </WalletButton>
            ) : isManage && withdraw ? (
              <Box className="flex flex-row">
                <CustomButton size="large" fullWidth onClick={handleWithdraw}>
                  Withdraw
                </CustomButton>
              </Box>
            ) : approved ? (
              <Box className="flex flex-row">
                <CustomButton
                  size="large"
                  className="w-full"
                  onClick={handleDeposit}
                >
                  Deposit
                </CustomButton>
              </Box>
            ) : (
              <Box className="flex flex-col w-full">
                <MaxApprove value={maxApprove} setValue={setMaxApprove} />
                <Box className="flex flex-row mt-2 space-x-4">
                  <CustomButton
                    size="large"
                    className="w-11/12"
                    onClick={handleApprove}
                    disabled={approved}
                  >
                    Approve
                  </CustomButton>
                  <CustomButton size="large" className="w-11/12" disabled>
                    Deposit
                  </CustomButton>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function MarginPage() {
  return (
    <PoolsProvider>
      <Margin />
    </PoolsProvider>
  );
}
