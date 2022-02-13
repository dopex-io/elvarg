import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ERC20__factory, Escrow__factory } from '@dopex-io/sdk';
// import { doc, addDoc, setDoc, collection } from '@firebase/firestore';
import * as yup from 'yup';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';
import ErrorBox from 'components/ErrorBox';
import ConfirmRfqDialog from '../dialogs/ConfirmRfqDialog';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import Dropdown from 'assets/farming/Dropdown';
import InfoPopover from 'components/UI/InfoPopover';

import useSendTx from 'hooks/useSendTx';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

const RfqForm = ({ isLive }: { isLive: boolean }) => {
  const sendTx = useSendTx();

  const { accountAddress, provider, signer } = useContext(WalletContext);
  const { validateUser, user, selectedEscrowData } = useContext(OtcContext);

  const [selection, setSelection] = useState('');
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
      .required('Strike is required'),
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
        <Typography variant="h6" className="text-stieglitz">
          Quantity
        </Typography>
        <Input
          className="py-2 px-2"
          value={formik.values.amount || 0}
          onChange={handleChangeAmount}
          type="number"
          leftElement={
            <Select
              id="base"
              name="base"
              fullWidth
              disableUnderline
              value={selection}
              label="Option"
              onChange={handleTokenSelection}
              className="bg-cod-gray rounded-lg p-2 w-1/2 text-white"
              IconComponent={Dropdown}
              variant="outlined"
              classes={{ icon: 'mt-3 text-white', root: 'p-0' }}
              MenuProps={{
                classes: { paper: 'bg-cod-gray' },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              {selectedEscrowData.bases?.map((option, index) => {
                return (
                  <MenuItem
                    value={option.address}
                    key={index}
                    className="text-white"
                  >
                    <Typography variant="h6" className="text-white">
                      {option.symbol}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          }
        />

        <Typography variant="h6" className="text-stieglitz">
          Price
        </Typography>
        <Input
          className="py-2 px-2"
          value={formik.values.price || 0}
          onChange={handleChangePrice}
          type="number"
          placeholder="Price"
          leftElement={
            <Box
              id="token"
              className="bg-cod-gray p-2 rounded-xl space-x-2 flex"
            >
              <img
                src={`/assets/${selectedEscrowData.symbol?.toLocaleLowerCase()}.svg`}
                alt={selectedEscrowData.symbol}
                className="my-auto w-1/2"
              />
              <Typography variant="h5" className="text-white my-auto">
                {selectedEscrowData.symbol}
              </Typography>
            </Box>
          }
        />
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
        <Box>
          <Accordion
            summary="What are RFQs?"
            details="Dealers can place requests-for-quote for options that they own and would like to sell. Interested buyers may bid on ongoing RFQs."
            footer={<Link to="/portfolio">Read More</Link>}
          />
        </Box>
        <Box>
          <ErrorBox
            error={String(
              formik.errors.amount ||
                formik.errors.price ||
                formik.errors.base ||
                ''
            )}
          />
        </Box>
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
