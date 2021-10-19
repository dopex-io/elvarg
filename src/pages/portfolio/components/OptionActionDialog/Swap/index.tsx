import { useCallback, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import cx from 'classnames';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Typography from 'components/UI/Typography';
import CustomInput from 'components/UI/Input';
import CustomButton from 'components/UI/CustomButton';
import ExpirySelector from 'components/ExpirySelector';

import useOptionSwap from 'hooks/useOptionSwap';

import formatAmount from 'utils/general/formatAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { BASE_ASSET_MAP, STAT_NAMES } from 'constants/index';

import styles from './styles.module.scss';

import { DialogProps } from '..';

const OptionSwapDialog = ({ closeModal, icon, data }: DialogProps) => {
  const [initialData, setInitialData] = useState({
    strike: '',
    price: '',
    pnl: '',
    expiry: '',
  });
  const [swappedData, setSwappedData] = useState(initialData);
  const [newDoTokens, setNewDoTokens] = useState('0');
  const [newPnl, setNewPnl] = useState(BigNumber.from(0));
  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const swapAction = useOptionSwap(data);

  const formik = useFormik({
    initialValues: {
      amount: '0',
      strike: 0,
      expiry: Number(data.expiry) * 1000,
    },
    onSubmit: noop,
  });

  useEffect(() => {
    const inputAmount = Number(getUserReadableAmount(formik.values.amount, 18));
    const userBalance = Number(getUserReadableAmount(data.userBalance, 18));
    setInitialData({
      strike: '$' + getUserReadableAmount(data.strike, 8).toString(),
      price: '$' + getUserReadableAmount(data.assetPrice, 8).toString(),
      pnl:
        inputAmount <= userBalance
          ? '$' + formatAmount((data.pnl * inputAmount) / userBalance, 2)
          : '--',
      expiry: format(
        new Date(Number(data.expiry) * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
    });
    setSwappedData({
      strike: '$' + formik.values.strike,
      price: '$' + getUserReadableAmount(data.assetPrice, 8).toString(),
      pnl:
        '$' +
        formatAmount(getUserReadableAmount(newPnl.toString(), 8).toString(), 2),
      expiry: format(
        new Date(formik.values.expiry),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
    });
  }, [
    data,
    formik.values.expiry,
    formik.values.strike,
    newPnl,
    formik.values.amount,
  ]);

  const updateSwapState = useCallback(
    async ({ amount, expiry, strike }) => {
      let returnValues = await swapAction.swapCall(amount, strike, expiry);
      setNewDoTokens(returnValues.newDoTokens.toString());
      setNewPnl(returnValues.pnl);
      setVisible(true);
      getUserReadableAmount(amount, 18) >= 0
        ? setErrorMsg(returnValues.error)
        : setErrorMsg('Amount cannot be negative');
    },
    [swapAction]
  );

  const handleAmountChange = async (e: any) => {
    formik.setFieldValue(
      'amount',
      getContractReadableAmount(Number(e.target.value), 18).toString()
    );
    if (Number(e.target.value) !== 0 && formik.values.expiry !== 0) {
      await updateSwapState({
        amount: getContractReadableAmount(e.target.value, 18).toString(),
        strike: formik.values.strike,
        expiry: formik.values.expiry,
      });
    }
  };

  const handleExpiryChange = async (expiry: number) => {
    let newExpiry = new Date(expiry).setUTCHours(8, 0, 0);
    formik.setFieldValue('expiry', newExpiry);
    if (formik.values.strike !== 0 && formik.values.amount !== '0') {
      await updateSwapState({
        amount: formik.values.amount,
        strike: formik.values.strike,
        expiry: newExpiry,
      });
    }
  };

  const handleStrikeChange = async (e: any) => {
    formik.setFieldValue('strike', e.target.value);

    if (formik.values.strike !== 0 && formik.values.expiry !== 0) {
      await updateSwapState({
        amount: formik.values.amount,
        strike: e.target.value,
        expiry: formik.values.expiry,
      });
    }
  };

  const handleMax = useCallback(async () => {
    formik.setFieldValue('amount', data.userBalance);

    if (formik.values.strike !== 0 && formik.values.expiry !== 0) {
      await updateSwapState({
        amount: data.userBalance,
        strike: formik.values.strike,
        expiry: formik.values.expiry,
      });
    }
  }, [data.userBalance, formik, updateSwapState]);

  const swapOptions = useCallback(async () => {
    await swapAction.swapTransaction(
      formik.values.amount,
      formik.values.strike,
      formik.values.expiry
    );
    closeModal();
  }, [swapAction, formik, closeModal]);

  return (
    <Box className="bg-cod-gray rounded-2xl">
      <Typography variant="h5" className="mb-3">
        Swap Option
      </Typography>
      <Box className="flex flex-row justify-between pl-3 text-stieglitz mb-2">
        <Typography variant="h6" component="div" className="text-stieglitz">
          Balance: {getUserReadableAmount(data.userBalance, 18).toString()}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          className="text-wave-blue pr-3 my-auto"
          role="button"
          onClick={handleMax}
        >
          MAX
        </Typography>
      </Box>
      <Box className="flex flex-col bg-umbra rounded-lg">
        <CustomInput
          id="amount"
          name="amount"
          leftElement={
            <Box className="flex bg-cod-gray rounded-lg p-2 w-5/6">
              <img
                src={`${icon}`}
                alt={BASE_ASSET_MAP[data.asset].symbol}
                className="w-8 h-8 my-auto"
              />
              <Typography variant="h5" className="my-auto px-2">
                {BASE_ASSET_MAP[data.asset].symbol}
              </Typography>
              <Typography
                variant="h6"
                className="text-white bg-mineshaft rounded-md my-auto ml-2 p-2"
              >
                {data.isPut ? 'PUT' : 'CALL'}
              </Typography>
            </Box>
          }
          onChange={handleAmountChange}
          type="number"
          value={getUserReadableAmount(formik.values.amount, 18).toString()}
        />
        <Box className="px-4 pb-4 rounded-lg flex flex-col text-white">
          <Box className="flex justify-between">
            <Box className="flex flex-col space-y-4">
              {Object.values(STAT_NAMES.swap).map((param, index) => {
                return (
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                    key={index}
                  >
                    {param}
                  </Typography>
                );
              })}
            </Box>
            <Box className="flex flex-col space-y-4">
              {Object.values(initialData).map((value, index) => {
                return (
                  <Typography
                    variant="caption"
                    component="div"
                    className="self-end text-white"
                    key={index}
                  >
                    {value}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
      {visible ? (
        <Box className="flex flex-col bg-umbra rounded-lg p-4 mt-1 relative">
          <ExpandMoreIcon
            className={cx(
              'mx-auto my-auto w-8 h-8 fill-current text-stieglitz z-50 bg-umbra border-4 border-cod-gray',
              styles.arrowIcon
            )}
          />
          <Box className="flex justify-between">
            <Box className="flex bg-cod-gray rounded-lg p-2">
              <img
                src={`${icon}`}
                alt={BASE_ASSET_MAP[data.asset].symbol}
                className="w-8 h-8 my-auto"
              />
              <Typography variant="h5" className="my-auto px-2">
                {BASE_ASSET_MAP[data.asset].symbol}
              </Typography>
              <Typography
                variant="h6"
                className="text-white bg-mineshaft rounded-md my-auto ml-2 p-2"
              >
                {data.isPut ? 'PUT' : 'CALL'}
              </Typography>
            </Box>
            <Typography
              variant="h3"
              component="div"
              textAlign="end"
              className="text-white font-mono rounded-md p-0 text-end my-auto"
            >
              {formatAmount(getUserReadableAmount(newDoTokens, 18), 3)}
            </Typography>
          </Box>
          <Box className="rounded-lg flex flex-col text-white">
            <Box className="flex justify-between pt-4">
              <Box className="flex flex-col space-y-4">
                {Object.values(STAT_NAMES.new_swap).map((param, index) => {
                  return (
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                      key={index}
                    >
                      {param}
                    </Typography>
                  );
                })}
              </Box>
              <Box className="flex flex-col space-y-4">
                {Object.values(swappedData).map((value, index) => (
                  <Typography
                    variant="caption"
                    component="div"
                    className="self-end text-white"
                    key={index}
                  >
                    {value}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Box className="flex mt-2 justify-between">
        <Box className="p-2 bg-umbra flex rounded-md mr-2 w-1/2">
          <Input
            disableUnderline={true}
            id="strike"
            name="strike"
            type="number"
            onChange={handleStrikeChange}
            className="px-2 text-white"
            placeholder="New Strike"
          />
        </Box>
        <Box className="p-2 bg-umbra flex rounded-md w-1/2">
          <ExpirySelector
            expiry={formik.values.expiry}
            handleExpiryChange={handleExpiryChange}
          />
        </Box>
      </Box>
      <Box>
        {errorMsg.length !== 0 ? (
          <Typography
            variant="h6"
            className="text-down-bad text-center p-4 rounded-xl border-down-bad border mt-4"
          >
            {errorMsg}
          </Typography>
        ) : null}
      </Box>
      <CustomButton
        size="large"
        onClick={swapOptions}
        className="mt-4"
        disabled={Boolean(errorMsg) || swapAction.loading}
        fullWidth
      >
        {swapAction.loading ? (
          <CircularProgress className="text-stieglitz p-2" />
        ) : (
          'Swap'
        )}
      </CustomButton>
    </Box>
  );
};

export default OptionSwapDialog;
