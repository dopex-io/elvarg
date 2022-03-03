import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ERC20__factory, Escrow__factory } from '@dopex-io/sdk';
import * as yup from 'yup';
import { ethers } from 'ethers';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Input from '@material-ui/core/Input';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';
import ConfirmRfqDialog from '../dialogs/ConfirmRfqDialog';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import InfoPopover from 'components/UI/InfoPopover';

import useSendTx from 'hooks/useSendTx';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

const RfqForm = ({ isLive }: { isLive: boolean }) => {
  const sendTx = useSendTx();

  const { accountAddress, provider, signer } = useContext(WalletContext);
  const { validateUser, user, selectedEscrowData } = useContext(OtcContext);

  const [selection, setSelection] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [approved, setApproved] = useState(false);
  const [processing, setProcessing] = useState(false);
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
      const selection = selectedEscrowData.bases.find(
        (value) => value.address === e.target.value
      );
      setSelection(e.target.value);

      if (formik.values.isBuy) {
        formik.setFieldValue('base', e.target.value);
        formik.setFieldValue('baseSymbol', selection.symbol);

        formik.setFieldValue('quote', selectedEscrowData.quote);
        formik.setFieldValue('quoteSymbol', selectedEscrowData.symbol);
      } else {
        formik.setFieldValue('base', selectedEscrowData.quote);
        formik.setFieldValue('baseSymbol', selectedEscrowData.symbol);

        formik.setFieldValue('quote', e.target.value);
        formik.setFieldValue('quoteSymbol', selection.symbol);
      }
    },
    [formik, selectedEscrowData]
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

  // const handleVerifyAddress = useCallback((e) => {
  //   setValidAddress(ethers.utils.isAddress(e.target.value));
  // }, []);

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
    const approveAmount = getContractReadableAmount(formik.values.amount, 18);
    const asset = ERC20__factory.connect(
      formik.values.isBuy ? formik.values.quote : formik.values.base,
      provider
    );

    try {
      await sendTx(
        asset
          .connect(signer)
          .approve(selectedEscrowData.selectedEscrow, approveAmount)
      ).then(() => {
        setApproved(true);
        setProcessing(false);
      });
    } catch (e) {
      console.log(`Something went wrong. ERR_CODE ${e}`);
    }
  }, [formik.values, provider, selectedEscrowData, signer, sendTx]);

  const handleSubmit = useCallback(async () => {
    if (!user) validateUser();
    else {
      setProcessing(true);

      const escrow = Escrow__factory.connect(
        selectedEscrowData.selectedEscrow,
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
              .deposit(userQuote, userBase, depositAmount, receiveAmount)
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
    selectedEscrowData.selectedEscrow,
    provider,
    formik.values,
    isLive,
    signer,
    handleClose,
    accountAddress,
    sendTx,
  ]);

  // Check allowance
  useEffect(() => {
    (async () => {
      if (!formik.values.base || !formik.values.price || !formik.values.amount)
        return;
      try {
        const erc20 = ERC20__factory.connect(
          formik.values.isBuy ? selectedEscrowData?.quote : formik.values.base,
          provider
        );
        const allowance = await erc20.allowance(
          accountAddress,
          selectedEscrowData?.selectedEscrow
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
  }, [accountAddress, formik.values, provider, selectedEscrowData]);

  useEffect(() => {
    formik.setFieldValue('quote', selectedEscrowData.quote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  // Set default selection
  useEffect(() => {
    (async () => {
      if (selectedEscrowData.bases !== undefined) {
        setSelection(selectedEscrowData.bases[0]?.address);
        formik.setFieldValue('base', selectedEscrowData.bases[0]?.address);
      } else {
        setSelection('');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEscrowData, selectedEscrowData.bases]);

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
            {/* {console.log(selection)} */}
            <Select
              fullWidth
              disableUnderline
              value={selection || ''}
              label="option"
              classes={{ icon: 'text-white' }}
              className="px-2"
              MenuProps={{
                classes: { paper: 'bg-cod-gray p-0' },
              }}
              onChange={handleTokenSelection}
            >
              {selectedEscrowData.bases?.map((option, index) => (
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
          {/* <Box className="bg-cod-gray p-2 rounded-xl space-x-2 flex justify-between">
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
              classes={{ input: 'text-white text-xs text-right' }}
            />
          </Box> */}
          <Box className="flex justify-between px-2">
            <Box className="flex space-x-2">
              <Typography variant="h6" className="text-stieglitz my-auto">
                Buy Order
              </Typography>
              <InfoPopover
                infoText="Toggle between buy and sell order. Sell orders are settled in USDT."
                id="rfq-buy-toggle"
              />
            </Box>
            <Switch
              className="my-auto"
              checked={formik.values.checked}
              onClick={handleBuyOrder}
            />
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
          isLive &&
            (formik.errors.amount ||
              formik.errors.price ||
              formik.errors.base ||
              // (!validAddress && 'Invalid Address') ||
              '')
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
            disabled={!accountAddress}
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
