import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { getMessageFromCode } from 'eth-rpc-errors';
import { ERC20__factory, OptionPool, OptionPool__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import * as yup from 'yup';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';

import { PoolsContext, PoolsProvider } from 'contexts/Pools';
import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import EpochSelector from 'craPages/pools/components/EpochSelector';
import AppBar from 'components/AppBar';
import MaxApprove from 'components/MaxApprove';
import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';

import { MAX_VALUE, BASE_ASSET_MAP } from 'constants/index';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import sendTx from 'utils/contracts/sendTx';

import sanitizeValue from 'utils/contracts/sanitizeValue';

import Dropdown from 'assets/farming/Dropdown';

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

const Manage = () => {
  const [, /*error*/ setError] = useState('');
  const [withdraw, setWithdraw] = useState(false);
  const [approved, setApproved] = useState(false);
  const [maxApprove, setMaxApprove] = useState(false);
  const [amount, setAmount] = useState('0');

  const validationSchema = yup.object({
    amount: yup
      .number()
      .min(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
  });

  const {
    currentEpoch,
    baseAssetsOptionPoolData,
    baseAssetsOptionPoolSdks,
    selectedEpoch,
    updateOptionPoolsData,
  } = useContext(PoolsContext);
  const { accountAddress, contractAddresses, signer } =
    useContext(WalletContext);
  const {
    selectedBaseAsset,
    selectedBaseAssetContract,
    usdtContract,
    selectedBaseAssetDecimals,
    usdtDecimals,
    baseAssetsWithPrices,
    userAssetBalances,
    updateAssetBalances,
  } = useContext(AssetsContext);

  const {
    optionPoolSdk,
    totalUserBasePoolDepositsForEpoch,
    totalUserQuotePoolDepositsForEpoch,
    userBaseWithdrawalRequests,
    userQuoteWithdrawalRequests,
    basePoolDeposits,
    quotePoolDeposits,
  }: {
    optionPoolSdk: OptionPool;
    totalUserBasePoolDepositsForEpoch: string;
    totalUserQuotePoolDepositsForEpoch: string;
    userBaseWithdrawalRequests: string;
    userQuoteWithdrawalRequests: string;
    basePoolDeposits: string;
    quotePoolDeposits: string;
  } = useMemo(() => {
    if (
      baseAssetsOptionPoolSdks.length === 0 ||
      baseAssetsOptionPoolData.length === 0
    ) {
      return {
        optionPoolSdk: undefined,
        totalUserBasePoolDepositsForEpoch: '0',
        totalUserQuotePoolDepositsForEpoch: '0',
        userBaseWithdrawalRequests: '0',
        userQuoteWithdrawalRequests: '0',
        basePoolDeposits: '0',
        quotePoolDeposits: '0',
      };
    }

    const i = baseAssetsOptionPoolSdks.findIndex(
      (item) => item.baseAsset === selectedBaseAsset
    );

    return {
      ...baseAssetsOptionPoolSdks[i],
      ...baseAssetsOptionPoolData[i],
    };
  }, [baseAssetsOptionPoolSdks, selectedBaseAsset, baseAssetsOptionPoolData]);

  const formik = useFormik({
    initialValues: {
      token: 'base',
      amount: '0',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const { setFieldValue } = formik;

  const isPut = formik.values.token === 'quote';

  const asset = BASE_ASSET_MAP[selectedBaseAsset ?? 'WETH'];

  const baseAssetPrice: number =
    baseAssetsWithPrices && baseAssetsWithPrices[selectedBaseAsset]
      ? getUserReadableAmount(baseAssetsWithPrices[selectedBaseAsset].price, 8)
      : 0;

  const userBasePoolDeposits = getUserReadableAmount(
    totalUserBasePoolDepositsForEpoch,
    selectedBaseAssetDecimals
  );

  const userQuotePoolDeposits = getUserReadableAmount(
    totalUserQuotePoolDepositsForEpoch,
    usdtDecimals
  );

  const basePoolWithdrawalRequests = getUserReadableAmount(
    userBaseWithdrawalRequests,
    selectedBaseAssetDecimals
  );

  const quotePoolWithdrawalRequests = getUserReadableAmount(
    userQuoteWithdrawalRequests,
    usdtDecimals
  );

  const totalBasePoolDeposits = getUserReadableAmount(
    basePoolDeposits,
    selectedBaseAssetDecimals
  );

  const totalQuotePoolDeposits = getUserReadableAmount(
    quotePoolDeposits,
    usdtDecimals
  );

  const depositedAmount = isPut ? userQuotePoolDeposits : userBasePoolDeposits;
  const withdrawableDepositedAmount = isPut
    ? quotePoolWithdrawalRequests
    : basePoolWithdrawalRequests;

  const isManage: boolean =
    userBasePoolDeposits > 0 ||
    userQuotePoolDeposits > 0 ||
    basePoolWithdrawalRequests > 0 ||
    quotePoolWithdrawalRequests > 0;

  const onTokenChange = useCallback(
    (e) => {
      setFieldValue('token', e.target.value);
      setFieldValue('amount', 0);
      setAmount('0');
    },
    [setFieldValue, setAmount]
  );

  const inputHandleChange = useCallback(
    (e) => {
      setFieldValue('amount', e.target.value);
      setAmount(e.target.value.toString());
    },
    [setFieldValue, setAmount]
  );

  useEffect(() => {
    if (!isManage) {
      setWithdraw(false);
    }
  }, [isManage]);

  useEffect(() => {
    if (
      withdraw &&
      !(currentEpoch <= selectedEpoch || withdrawableDepositedAmount === 0)
    ) {
      setAmount(withdrawableDepositedAmount.toString());
      setFieldValue('amount', Number(withdrawableDepositedAmount).toFixed(3));
    }
  }, [
    setFieldValue,
    withdraw,
    selectedEpoch,
    withdrawableDepositedAmount,
    currentEpoch,
  ]);

  useEffect(() => {
    if (
      !usdtContract ||
      !selectedBaseAssetContract ||
      !optionPoolSdk ||
      !accountAddress
    )
      return;
    (async function () {
      if (isPut) {
        const finalAmount = getContractReadableAmount(amount, usdtDecimals);
        const allowance = await usdtContract?.allowance(
          accountAddress,
          optionPoolSdk?.address
        );
        if (finalAmount.lte(allowance)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      } else {
        const finalAmount = getContractReadableAmount(
          amount,
          selectedBaseAssetDecimals
        );
        const allowance = await selectedBaseAssetContract?.allowance(
          accountAddress,
          optionPoolSdk?.address
        );
        if (finalAmount.lte(allowance)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [
    accountAddress,
    amount,
    isPut,
    optionPoolSdk,
    selectedBaseAssetContract,
    usdtContract,
    selectedBaseAssetDecimals,
    usdtDecimals,
  ]);

  const handleApprove = useCallback(async () => {
    if (!accountAddress || !signer) return;
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
      let finalAmount;
      if (isPut) {
        finalAmount = getContractReadableAmount(amount, usdtDecimals);
        await sendTx(
          ERC20__factory.connect(usdtContract.address, signer).approve(
            optionPoolSdk.address,
            maxApprove ? MAX_VALUE : finalAmount
          )
        );
      } else {
        finalAmount = await getContractReadableAmount(
          amount,
          selectedBaseAssetDecimals
        );
        const baseAssetContract = ERC20__factory.connect(
          contractAddresses[selectedBaseAsset],
          signer
        );
        await sendTx(
          baseAssetContract.approve(
            optionPoolSdk.address,
            maxApprove ? MAX_VALUE : sanitizeValue(finalAmount)
          )
        );
      }
      setApproved(true);
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    signer,
    contractAddresses,
    accountAddress,
    amount,
    isPut,
    maxApprove,
    optionPoolSdk,
    selectedBaseAsset,
    selectedBaseAssetDecimals,
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
      let finalAmount: BigNumber;
      if (isPut) {
        finalAmount = getContractReadableAmount(amount, usdtDecimals);
      } else {
        finalAmount = await getContractReadableAmount(
          amount,
          selectedBaseAssetDecimals
        );
      }
      if (
        finalAmount.gt(userAssetBalances[isPut ? 'USDT' : selectedBaseAsset])
      ) {
        setError('Insufficient Balance');
        return;
      }
      await sendTx(
        OptionPool__factory.connect(
          optionPoolSdk.contract.address,
          signer
        ).addToOptionPool(finalAmount, isPut)
      );
      updateOptionPoolsData();
      updateAssetBalances();
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    signer,
    amount,
    isPut,
    selectedBaseAssetDecimals,
    usdtDecimals,
    optionPoolSdk,
    updateOptionPoolsData,
    updateAssetBalances,
    userAssetBalances,
    selectedBaseAsset,
  ]);

  const handleWithdrawRequest = useCallback(async () => {
    if (!amount) {
      setError('Please enter an amount.');
      return;
    }
    if (Number(amount) < 0) {
      setError('Please enter a valid amount.');
      return;
    }
    try {
      let finalAmount: BigNumber;
      if (isPut) {
        finalAmount = getContractReadableAmount(amount, usdtDecimals);
      } else {
        finalAmount = getContractReadableAmount(
          amount,
          selectedBaseAssetDecimals
        );
      }
      await sendTx(
        OptionPool__factory.connect(
          optionPoolSdk.contract.address,
          signer
        ).createWithdrawRequestForPool(finalAmount, isPut)
      );
      updateOptionPoolsData();
      updateAssetBalances();
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    signer,
    updateAssetBalances,
    amount,
    isPut,
    optionPoolSdk,
    selectedBaseAssetDecimals,
    usdtDecimals,
    updateOptionPoolsData,
  ]);

  const handleWithdraw = useCallback(async () => {
    if (!amount) {
      setError('Please enter an amount.');
      return;
    }
    if (Number(amount) < 0) {
      setError('Please enter a valid amount.');
      return;
    }
    try {
      let finalAmount: BigNumber;
      if (isPut) {
        finalAmount = getContractReadableAmount(amount, usdtDecimals);
      } else {
        finalAmount = getContractReadableAmount(
          amount,
          selectedBaseAssetDecimals
        );
      }
      await sendTx(
        OptionPool__factory.connect(
          optionPoolSdk.contract.address,
          signer
        ).withdrawFromPool(selectedEpoch, finalAmount, isPut)
      );
      updateOptionPoolsData();
      updateAssetBalances();
    } catch (err) {
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    signer,
    selectedEpoch,
    updateAssetBalances,
    amount,
    isPut,
    optionPoolSdk,
    selectedBaseAssetDecimals,
    usdtDecimals,
    updateOptionPoolsData,
  ]);

  const userBalance =
    userAssetBalances &&
    userAssetBalances['USDT'] &&
    selectedBaseAsset &&
    userAssetBalances[selectedBaseAsset] &&
    selectedBaseAssetDecimals &&
    usdtDecimals
      ? getUserReadableAmount(
          userAssetBalances[isPut ? 'USDT' : selectedBaseAsset],
          isPut ? usdtDecimals : selectedBaseAssetDecimals
        )
      : 0;

  const handleMax = useCallback(() => {
    if (withdraw) {
      setAmount(depositedAmount.toString());
      setFieldValue('amount', Number(depositedAmount).toFixed(3));
    } else {
      setAmount(userBalance.toString());
      setFieldValue('amount', Number(userBalance).toFixed(3));
    }
  }, [setFieldValue, userBalance, depositedAmount, withdraw]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className="overflow-x-hidden bg-black text-white min-h-screen">
      <AppBar active="pools" />
      <Box className={cx('mx-auto my-40 px-2', styles.cardSize)}>
        <Box className="flex flex-col mb-14 bg-cod-gray p-5 rounded-xl">
          <Box className="flex flex-row justify-between">
            <Box className="flex flex-row mb-5">
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
              <Box className={'flex'}>
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
                  ? `Deposited: ${formatAmount(
                      depositedAmount + withdrawableDepositedAmount
                    )}`
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
          {isManage && withdraw && (
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz mb-2">
                {`Withdrawable Deposits: ${formatAmount(
                  withdrawableDepositedAmount
                )}`}
              </Typography>
            </Box>
          )}
          <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-4">
            <Select
              id="token"
              name="token"
              value={formik.values.token}
              className="w-72 h-12 bg-cod-gray rounded-xl p-2"
              IconComponent={Dropdown}
              onChange={onTokenChange}
              variant="outlined"
              classes={{ icon: 'mt-3 mr-1', root: 'p-0' }}
              MenuProps={{ classes: { paper: 'bg-cod-gray' } }}
              inputProps={{
                style: {
                  color: '#3E3E3E',
                },
              }}
            >
              <MenuItem value={'base'}>
                <Box className="flex flex-row items-center">
                  <Box className="flex flex-row h-8 w-8 mr-2">
                    <img
                      src={`/static/svg/tokens/${asset.symbol.toLowerCase()}.svg`}
                      alt={selectedBaseAsset}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    className="text-white hover:text-stieglitz"
                  >
                    {asset._symbol} (Call)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={'quote'}>
                <Box className="flex flex-row items-center">
                  <Box className="flex flex-row h-8 w-8 mr-2">
                    <img src={'/assets/usdt.svg'} alt={selectedBaseAsset} />
                  </Box>
                  <Typography
                    variant="h5"
                    className="text-white hover:text-stieglitz"
                  >
                    USDT (Put)
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
            <Input
              disableUnderline={true}
              id="amount"
              name="amount"
              disabled={
                withdraw
                  ? withdrawableDepositedAmount === 0
                    ? selectedEpoch <= currentEpoch
                    : false
                  : selectedEpoch < currentEpoch
              }
              value={formik.values.amount}
              onBlur={formik.handleBlur}
              onChange={inputHandleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              type="number"
              className="h-12 text-2xl text-white ml-2"
              classes={{ input: 'text-right' }}
            />
          </Box>
          <FormHelperText className="text-right mt-1 mb-2 text-red-400">
            {formik.touched.amount && formik.errors.amount}
          </FormHelperText>
          <Box className="flex flex-col justify-between w-full">
            <Box className="w-full">
              <Box className="mt-0.5 flex flex-col w-full border-cod-gray rounded-xl border p-4 bg-umbra">
                <Box className="flex flex-row w-full justify-between items-end mb-2">
                  <Typography variant="h6" className="text-stieglitz">
                    Base Asset
                  </Typography>
                  <Typography variant="h6">{asset._symbol}</Typography>
                </Box>
                <Box className="flex flex-row w-full justify-between items-end mb-2">
                  <Typography variant="h6" className="text-stieglitz">
                    Quote Asset
                  </Typography>
                  <Typography variant="h6">USDT</Typography>
                </Box>
                <Box className="flex flex-row w-full justify-between items-end mb-2">
                  <Typography variant="h6" className="text-stieglitz">
                    Deposits
                  </Typography>
                  <Typography variant="h6">
                    {userBasePoolDeposits > 0 ||
                    userQuotePoolDeposits > 0 ||
                    basePoolWithdrawalRequests > 0 ||
                    quotePoolWithdrawalRequests > 0 ? (
                      <Box>
                        <span className="text-wave-blue">
                          $
                          {formatAmount(
                            (userBasePoolDeposits +
                              basePoolWithdrawalRequests) *
                              baseAssetPrice +
                              (userQuotePoolDeposits +
                                quotePoolWithdrawalRequests)
                          )}
                        </span>
                        {` / $${formatAmount(
                          totalBasePoolDeposits * baseAssetPrice +
                            totalQuotePoolDeposits
                        )}`}
                      </Box>
                    ) : (
                      `$${formatAmount(
                        totalBasePoolDeposits * baseAssetPrice +
                          totalQuotePoolDeposits
                      )}`
                    )}
                  </Typography>
                </Box>
                <Box className="flex flex-row w-full justify-between items-end mb-2">
                  <Typography variant="h6" className="text-stieglitz">
                    Withdrawable Deposits
                  </Typography>
                  <Typography variant="h6">
                    {userBasePoolDeposits > 0 ||
                    userQuotePoolDeposits > 0 ||
                    basePoolWithdrawalRequests > 0 ||
                    quotePoolWithdrawalRequests > 0 ? (
                      <Box>
                        <span className="text-wave-blue">
                          $
                          {formatAmount(
                            basePoolWithdrawalRequests * baseAssetPrice +
                              quotePoolWithdrawalRequests
                          )}
                        </span>
                        {` / `}{' '}
                        <span className="text-wave-blue">
                          $
                          {formatAmount(
                            (userBasePoolDeposits +
                              basePoolWithdrawalRequests) *
                              baseAssetPrice +
                              (userQuotePoolDeposits +
                                quotePoolWithdrawalRequests)
                          )}
                        </span>
                      </Box>
                    ) : (
                      `$0`
                    )}
                  </Typography>
                </Box>
                <Box className="flex flex-col w-full space-y-5 items-end mt-2">
                  <Box className="border-cod-gray rounded-xl border p-4 w-full mr-0.5 text-center flex flex-col bg-cod-gray">
                    <Typography variant="h6">
                      {userBasePoolDeposits > 0 ||
                      basePoolWithdrawalRequests > 0 ? (
                        <Box>
                          <span className="text-wave-blue">
                            {formatAmount(
                              userBasePoolDeposits + basePoolWithdrawalRequests
                            )}
                          </span>
                          {` / ${formatAmount(totalBasePoolDeposits)}`}
                        </Box>
                      ) : (
                        formatAmount(totalBasePoolDeposits)
                      )}
                    </Typography>
                    <Typography variant="h6" className="text-stieglitz">
                      {asset._symbol}
                    </Typography>
                  </Box>
                  <Box className="border-cod-gray rounded-xl border p-4 w-full ml-0.5 text-center flex flex-col bg-cod-gray">
                    <Typography variant="h6">
                      {userQuotePoolDeposits > 0 ||
                      quotePoolWithdrawalRequests > 0 ? (
                        <Box>
                          <span className="text-wave-blue">
                            {formatAmount(
                              userQuotePoolDeposits +
                                quotePoolWithdrawalRequests
                            )}
                          </span>
                          {` / ${formatAmount(totalQuotePoolDeposits)}`}
                        </Box>
                      ) : (
                        formatAmount(totalQuotePoolDeposits)
                      )}
                    </Typography>
                    <Typography variant="h6" className="text-stieglitz">
                      USDT
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="lg:w-96 border-umbra rounded-xl border p-4 mb-4 mt-4">
                {!withdraw && (
                  <Typography variant="h6" className="text-stieglitz">
                    You are about to supply liquidity to one of Dopex’s pool.
                    Please understand the risks of writing call and put options.
                  </Typography>
                )}
                <Typography variant="h6" className="text-stieglitz mt-1">
                  To withdraw liquidity you must create a withdrawal request.
                  You will then be able to withdraw once the epoch is over.
                </Typography>
              </Box>
              {formik.values.amount <= '0' ? (
                <WalletButton size="large" className="w-full" disabled>
                  Enter an amount
                </WalletButton>
              ) : isManage && withdraw ? (
                <Box className="flex flex-row">
                  {depositedAmount === 0 || selectedEpoch <= currentEpoch ? (
                    <Tooltip
                      title="Requested withdrawals will be withdrawable after this epoch"
                      aria-label="add"
                      placement="top"
                    >
                      <Box className="w-11/12 mr-1">
                        <WalletButton
                          size="large"
                          className="w-full"
                          onClick={handleWithdrawRequest}
                          disabled
                        >
                          Request Withdrawal
                        </WalletButton>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Box className="w-11/12 mr-1">
                      <WalletButton
                        size="large"
                        className="w-full"
                        onClick={handleWithdrawRequest}
                      >
                        Request Withdrawal
                      </WalletButton>
                    </Box>
                  )}
                  {currentEpoch <= selectedEpoch ||
                  withdrawableDepositedAmount === 0 ? (
                    <Tooltip
                      title="Requested withdrawals will be withdrawable after this epoch"
                      aria-label="add"
                      placement="top"
                    >
                      <Box className="w-11/12">
                        <WalletButton
                          size="large"
                          className="w-full"
                          onClick={handleWithdraw}
                          disabled
                        >
                          Withdraw
                        </WalletButton>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Box className="w-11/12">
                      <WalletButton
                        size="large"
                        className="w-full"
                        onClick={handleWithdraw}
                      >
                        Withdraw
                      </WalletButton>
                    </Box>
                  )}
                </Box>
              ) : selectedEpoch <= currentEpoch ? (
                <Tooltip
                  title="Please deposit in the next epoch"
                  aria-label="add"
                  placement="top"
                >
                  <Box className="w-full">
                    <WalletButton
                      size="large"
                      className="w-full"
                      onClick={handleDeposit}
                      disabled
                    >
                      Deposit
                    </WalletButton>
                  </Box>
                </Tooltip>
              ) : approved ? (
                <Box className="flex flex-row">
                  <WalletButton
                    size="large"
                    className="w-full"
                    onClick={handleDeposit}
                  >
                    Deposit
                  </WalletButton>
                </Box>
              ) : (
                <Box className="flex flex-col w-full">
                  <MaxApprove value={maxApprove} setValue={setMaxApprove} />
                  <Box className="flex flex-row mt-2 space-x-4">
                    <WalletButton
                      size="large"
                      className="w-11/12"
                      onClick={handleApprove}
                    >
                      Approve
                    </WalletButton>
                    <WalletButton size="large" className="w-11/12" disabled>
                      Deposit
                    </WalletButton>
                  </Box>
                </Box>
              )}
              <Box className="flex flex-row w-full justify-between items-end mt-4">
                <EpochSelector />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function ManagePage() {
  return (
    <PoolsProvider>
      <Manage />
    </PoolsProvider>
  );
}
