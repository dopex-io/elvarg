import { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { ERC20__factory, Escrow__factory } from '@dopex-io/sdk';
import * as yup from 'yup';
import { ethers } from 'ethers';
import Input from '@mui/material/Input';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';
import ConfirmRfqDialog from '../dialogs/ConfirmRfqDialog';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import useSendTx from 'hooks/useSendTx';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

const RfqForm = ({ isLive }: { isLive: boolean }) => {
  const sendTx = useSendTx();

  const { accountAddress, provider, signer } = useContext(WalletContext);
  const { validateUser, user, escrowData, loaded } = useContext(OtcContext);

  const [selection, setSelection] = useState<{
    address: string;
    symbol: string;
  }>({ address: '', symbol: '' });
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [validAddress, setValidAddress] = useState(false);
  const [approved, setApproved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [targetAddress, setTargetAddress] = useState('');
  const [dialogState, setDialogState] = useState({
    open: false,
    handleClose: () => {},
    data: {},
  });

  const validationSchema = yup.object({
    amount: yup
      .number()
      .moreThan(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
    price: yup
      .number()
      .moreThan(0, 'Price has to be greater than 0')
      .required('Price is required'),
    base: yup.string().required('Option token required'),
  });

  const formik = useFormik({
    initialValues: {
      isPut: false,
      isBuy: true,
      quote: '',
      quoteSymbol: '',
      price: 0,
      base: '',
      baseSymbol: '',
      amount: 0,
      timestamp: new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: noop,
  });

  const handleTokenSelection = useCallback(
    (e) => {
      const selected = escrowData.bases.find(
        (value) => value.address === e.target.value
      );

      const index = escrowData.bases.indexOf(selected);

      setSelection(selected);
      setSelectionIndex(index);

      if (formik.values.isBuy) {
        formik.setFieldValue('base', e.target.value);
        formik.setFieldValue('baseSymbol', selected.symbol);

        formik.setFieldValue('quote', escrowData.quotes[0].address);
        formik.setFieldValue('quoteSymbol', escrowData.quotes[0].symbol);
      } else {
        formik.setFieldValue('base', escrowData.quotes[0].address);
        formik.setFieldValue('baseSymbol', escrowData.quotes[0].symbol);

        formik.setFieldValue('quote', e.target.value);
        formik.setFieldValue('quoteSymbol', escrowData.quotes[0].symbol);
      }
    },
    [formik, escrowData.bases, escrowData.quotes]
  );

  const handleChangeAmount = useCallback(
    (e) => {
      formik.setFieldValue('amount', e.target.value);
    },
    [formik]
  );

  const handleChangePrice = useCallback(
    (e) => {
      formik.setFieldValue('price', e.target.value);
    },
    [formik]
  );

  const handleVerifyAddress = useCallback((e) => {
    setValidAddress(ethers.utils.isAddress(e.target.value));
    setTargetAddress(
      ethers.utils.isAddress(e.target.value) ? e.target.value : ''
    );
  }, []);

  const handleBuyOrder = useCallback(
    (e) => {
      formik.setFieldValue('isBuy', e.target.checked);
    },
    [formik]
  );

  const handleClose = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  }, []);

  const handleApprove = useCallback(async () => {
    if (!formik.values.quote || !formik.values.base) return;

    const approveAmount = getContractReadableAmount(
      formik.values.isBuy ? formik.values.price : formik.values.amount,
      18
    );
    const asset = ERC20__factory.connect(
      formik.values.isBuy
        ? escrowData.quotes[0].address
        : escrowData.bases[selectionIndex].address,
      provider
    );

    try {
      await sendTx(
        asset.connect(signer).approve(escrowData.escrowAddress, approveAmount)
      ).then(() => {
        setApproved(true);
        setProcessing(false);
      });
    } catch (e) {
      console.log(`Something went wrong. ERR_CODE ${e}`);
    }
  }, [formik.values, provider, selectionIndex, escrowData, signer, sendTx]);

  const handleSubmit = useCallback(async () => {
    if (!user) validateUser();
    else {
      setProcessing(true);

      const escrow = Escrow__factory.connect(
        escrowData.escrowAddress,
        provider
      );

      const [userQuote, userBase] = [
        formik.values.isBuy ? formik.values.quote : formik.values.base,
        formik.values.isBuy ? formik.values.base : formik.values.quote,
      ];

      const [depositAmount, receiveAmount] = [
        formik.values.isBuy
          ? getContractReadableAmount(formik.values.price, 18)
          : getContractReadableAmount(formik.values.amount, 18),
        formik.values.isBuy
          ? getContractReadableAmount(formik.values.amount, 18)
          : getContractReadableAmount(formik.values.price, 18),
      ];

      if (isLive)
        try {
          await sendTx(
            escrow
              .connect(signer)
              .open(
                userQuote,
                userBase,
                targetAddress,
                depositAmount,
                receiveAmount
              )
          ).catch(() => {
            console.log('Failed to update db');
            setProcessing(false);
          });
        } catch (e) {
          console.log('Deposit Failed');
          setProcessing(false);
        }
      else {
        setDialogState({
          open: true,
          handleClose,
          data: {
            isBuy: formik.values.isBuy,
            quote: {
              address: formik.values.quote,
              symbol: formik.values.quoteSymbol,
            },
            price: formik.values.price,
            base: {
              address: formik.values.base,
              symbol: formik.values.baseSymbol,
            },
            amount: formik.values.amount,
            dealer: accountAddress,
            username: user.username,
            timestamp: formik.values.timestamp,
            isFulfilled: false,
          },
        });
      }
      setProcessing(false);
    }
  }, [
    user,
    validateUser,
    escrowData,
    provider,
    formik,
    isLive,
    sendTx,
    signer,
    targetAddress,
    handleClose,
    accountAddress,
  ]);

  // Check allowance
  useEffect(() => {
    (async () => {
      if (!formik.values.base || !formik.values.price || !formik.values.amount)
        return;
      try {
        const erc20 = ERC20__factory.connect(
          formik.values.isBuy
            ? escrowData?.quotes[0].address
            : escrowData.bases[selectionIndex]?.address,
          provider
        );
        const allowance = await erc20.allowance(
          accountAddress,
          escrowData?.escrowAddress
        );
        setApproved(
          allowance.gte(
            getContractReadableAmount(
              formik.values.isBuy ? formik.values.price : formik.values.amount,
              18
            )
          )
        );
      } catch (e) {
        console.log(e);
      }
    })();
  }, [accountAddress, formik.values, provider, escrowData, selectionIndex]);

  useEffect(() => {
    (async () => {
      if (!escrowData.bases) return;
      formik.setFieldValue('quote', escrowData.quotes[0].address);
      formik.setFieldValue('base', escrowData.bases[selectionIndex].address);
      formik.setFieldValue('quoteSymbol', escrowData.quotes[0].symbol);
      formik.setFieldValue(
        'baseSymbol',
        escrowData.bases[selectionIndex].symbol
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrowData, selectionIndex]);

  // Set default selection
  useEffect(() => {
    (async () => {
      if (escrowData.bases !== undefined) {
        formik.setFieldValue('base', escrowData.bases[0]?.address);
        setSelection({
          symbol: escrowData.bases[0]?.symbol,
          address: escrowData.bases[0]?.address,
        });
      } else {
        setSelection({
          symbol: '',
          address: '',
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrowData, escrowData.bases]);

  return (
    <Box className="bg-cod-gray rounded-lg p-2 border border-umbra">
      <Box className="flex flex-col space-y-2">
        <Box className="flex rounded-2xl space-x-2">
          <CustomButton
            size="small"
            className="w-full"
            color={formik.values.isPut ? 'umbra' : 'primary'}
            onClick={() => formik.setFieldValue('isPut', false)}
          >
            CALL
          </CustomButton>
          <CustomButton
            size="small"
            className="w-full"
            color={formik.values.isPut ? 'down-bad' : 'umbra'}
            onClick={() => formik.setFieldValue('isPut', true)}
            disabled
          >
            PUT
          </CustomButton>
        </Box>
        <Box className="space-y-2 py-3">
          <Box className="flex justify-between bg-umbra rounded-lg mx-2 border border-mineshaft">
            <Select
              fullWidth
              value={selection.address || ''}
              label="option"
              classes={{ icon: 'text-white', select: 'py-1 px-2' }}
              MenuProps={{
                classes: { paper: 'bg-cod-gray p-0' },
              }}
              onChange={handleTokenSelection}
            >
              {escrowData.bases?.map((option, index) => (
                <MenuItem
                  value={option.address}
                  key={index}
                  className="text-white bg-cod-gray hover:bg-cod-gray"
                >
                  <Typography variant="h6" className="text-white mx-auto">
                    {option.symbol}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box className="bg-cod-gray p-2 rounded-xl space-x-2 flex justify-between">
            <Typography variant="h6" className="text-stieglitz my-auto">
              Quantity
            </Typography>
            <Input
              disableUnderline
              value={formik.values.amount || 0}
              onChange={handleChangeAmount}
              type="number"
              className="border border-mineshaft rounded-md px-2 bg-umbra w-2/3"
              classes={{ input: 'text-white text-xs text-right' }}
            />
          </Box>
          <Box
            id="token"
            className="bg-cod-gray p-2 rounded-xl space-x-2 flex justify-between"
          >
            <Typography variant="h6" className="text-stieglitz my-auto">
              Price ($)
            </Typography>
            <Input
              disableUnderline={true}
              value={formik.values.price || 0}
              onChange={handleChangePrice}
              type="number"
              className="border border-mineshaft rounded-md pl-2 pr-2 bg-umbra w-2/3"
              classes={{ input: 'text-white text-xs text-right' }}
            />
          </Box>
          {isLive ? (
            <Box className="bg-cod-gray p-2 rounded-xl space-x-2 flex justify-between">
              <Typography variant="h6" className="text-stieglitz my-auto">
                Recipient
              </Typography>
              <Input
                disableUnderline
                fullWidth
                disabled={!isLive}
                placeholder={isLive ? 'Enter Address' : 'Disabled for RFQs'}
                type="text"
                onChange={handleVerifyAddress}
                className="border border-mineshaft rounded-md px-2 bg-umbra w-2/3"
                classes={{
                  input: 'text-white text-xs text-right',
                  disabled: 'text-white',
                }}
              />
            </Box>
          ) : null}

          <Box className="flex justify-between p-2">
            <Typography variant="h6" className="text-stieglitz">
              Order Type
            </Typography>
            <Box className="flex px-2 space-x-2">
              <Typography
                variant="h6"
                className={`my-auto ${
                  formik.values.isBuy ? 'text-stieglitz' : 'text-white'
                }`}
              >
                Sell
              </Typography>
              <Switch
                className="my-auto"
                checked={formik.values.isBuy}
                onClick={handleBuyOrder}
              />
              <Typography
                variant="h6"
                className={`my-auto ${
                  formik.values.isBuy ? 'text-white' : 'text-stieglitz'
                }`}
              >
                Buy
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Accordion
            summary="What are RFQs?"
            details="Dealers can place requests-for-quote for options that they own and would like to sell. Interested buyers may bid on ongoing RFQs."
            footer={<Link to="/portfolio">Read More</Link>}
          />
        </Box>
        {Boolean(
          formik.errors.amount ||
            formik.errors.price ||
            formik.errors.base ||
            (isLive && !validAddress && 'Invalid Address') ||
            ''
        ) ? (
          <Box className="border rounded-lg border-down-bad bg-down-bad bg-opacity-20 p-2">
            <Typography
              variant="h6"
              className="text-down-bad text-xs text-center"
            >
              {String(
                formik.errors.amount ||
                  formik.errors.price ||
                  formik.errors.base ||
                  (!validAddress && 'Invalid Address') ||
                  ''
              )}
            </Typography>
          </Box>
        ) : null}
        {isLive ? (
          approved ? (
            <CustomButton
              size="medium"
              className="flex w-full"
              onClick={handleSubmit}
              disabled={
                user &&
                (processing ||
                  Boolean(formik.errors.price) ||
                  Boolean(formik.errors.amount) ||
                  Boolean(formik.errors.base))
              }
            >
              {user ? (
                <Typography variant="h6">
                  {processing ? <CircularProgress size="24" /> : 'Submit'}
                </Typography>
              ) : (
                <Typography variant="h6">Login</Typography>
              )}
            </CustomButton>
          ) : (
            <CustomButton
              size="medium"
              className="flex w-full"
              onClick={handleApprove}
              disabled={!loaded}
            >
              <Typography variant="h6">Approve</Typography>
            </CustomButton>
          )
        ) : (
          <CustomButton
            size="medium"
            className="flex w-full"
            onClick={() =>
              setDialogState((prevState) => ({ ...prevState, open: true }))
            }
            disabled={
              !accountAddress ||
              !loaded ||
              Boolean(formik.errors.price) ||
              Boolean(formik.errors.amount) ||
              Boolean(formik.errors.base)
            }
          >
            <Typography variant="h6">
              {!accountAddress ? 'Please Login' : 'Submit'}
            </Typography>
          </CustomButton>
        )}
        <ConfirmRfqDialog
          open={dialogState.open}
          handleClose={handleClose}
          data={{
            isBuy: formik.values.isBuy,
            quote: {
              address: formik.values.quote,
              symbol: formik.values.quoteSymbol,
            },
            price: formik.values.price,
            base: {
              address: formik.values.base,
              symbol: formik.values.baseSymbol,
            },
            amount: formik.values.amount,
            username: user?.username,
            address: accountAddress,
          }}
        />
      </Box>
    </Box>
  );
};

export default RfqForm;
