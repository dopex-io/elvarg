// @ts-nocheck
import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { ERC20__factory, Escrow__factory } from '@dopex-io/sdk';
import * as yup from 'yup';
import { BigNumber, ethers } from 'ethers';
import Input from '@mui/material/Input';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';
import ConfirmRfqDialog from '../Dialogs/ConfirmRfqDialog';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import useSendTx from 'hooks/useSendTx';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface RfqFormProps {
  isLive: boolean;
  selectedQuote: { address: string; symbol: string };
}

const RfqForm = (props: RfqFormProps) => {
  const { isLive, selectedQuote } = props;

  const sendTx = useSendTx();

  const { accountAddress, provider, signer } = useContext(WalletContext);
  const { validateUser, user, escrowData, loaded } = useContext(OtcContext);

  const [selection, setSelection] = useState<{
    address: string;
    symbol: string;
  }>({ address: '', symbol: '' });
  const [selectionBalance, setSelectionBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [validAddress, setValidAddress] = useState(false);
  const [approved, setApproved] = useState(false);
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
    validateOnBlur: false,
  });

  const filteredBases = useMemo(() => {
    return escrowData.bases?.filter(
      (param) => param.isPut === formik.values.isPut
    );
  }, [formik.values, escrowData?.bases]);

  const handleTokenSelection = useCallback(
    async (e) => {
      const selected = escrowData.bases.find(
        (value) => value.address === e.target.value
      );

      const index = escrowData.bases.indexOf(selected);

      setSelection(selected);
      setSelectionIndex(index);

      const tokenBalance = await ERC20__factory.connect(
        selected.address,
        provider
      ).balanceOf(accountAddress);

      setSelectionBalance(tokenBalance);

      if (formik.values.isBuy) {
        formik.setFieldValue('base', e.target.value);
        formik.setFieldValue('baseSymbol', selected.symbol);

        formik.setFieldValue('quote', selectedQuote.address);
        formik.setFieldValue('quoteSymbol', selectedQuote.symbol);
      } else {
        formik.setFieldValue('base', selectedQuote.address);
        formik.setFieldValue('baseSymbol', selectedQuote.symbol);

        formik.setFieldValue('quote', e.target.value);
        formik.setFieldValue('quoteSymbol', selectedQuote.symbol);
      }
    },
    [escrowData.bases, formik, selectedQuote, accountAddress, provider]
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

  const handleTypeSelection = useCallback(
    (isPut) => {
      if (!filteredBases) return;

      formik.setFieldValue('isPut', isPut);
      formik.setFieldValue('base', filteredBases[0].address);
      setSelection({
        symbol: filteredBases[0].symbol,
        address: filteredBases[0].address,
      });
    },
    [formik, filteredBases]
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

    const erc20 = ERC20__factory.connect(
      formik.values.isBuy
        ? selectedQuote.address
        : escrowData.bases[selectionIndex].address,
      provider
    );

    const decimals = await erc20.decimals();

    const approveAmount = getContractReadableAmount(
      formik.values.isBuy ? formik.values.price : formik.values.amount,
      decimals
    );

    const asset = ERC20__factory.connect(
      formik.values.isBuy
        ? selectedQuote.address
        : escrowData.bases[selectionIndex].address,
      provider
    );

    try {
      await sendTx(
        asset.connect(signer).approve(escrowData.escrowAddress, approveAmount)
      ).then(() => {
        setApproved(true);
      });
    } catch (e) {
      console.log(`Something went wrong. ERR_CODE ${e}`);
    }
  }, [
    formik.values,
    provider,
    selectionIndex,
    escrowData,
    signer,
    sendTx,
    selectedQuote,
  ]);

  const error = useMemo(() => {
    return String(
      formik.errors.amount ||
        formik.errors.price ||
        formik.errors.base ||
        (!validAddress && 'Invalid Address') ||
        ''
    );
  }, [formik.errors, validAddress]);

  const handleSubmit = useCallback(async () => {
    if (!user) validateUser();
    else {
      const escrow = Escrow__factory.connect(
        escrowData.escrowAddress,
        provider
      );

      const [userQuote, userBase] = [
        formik.values.isBuy ? formik.values.quote : formik.values.base,
        formik.values.isBuy ? formik.values.base : formik.values.quote,
      ];

      const erc20 = ERC20__factory.connect(
        formik.values.isBuy ? userQuote : userBase,
        provider
      );

      const decimals = await erc20.decimals();

      const [depositAmount, receiveAmount] = [
        formik.values.isBuy
          ? getContractReadableAmount(formik.values.price, decimals)
          : getContractReadableAmount(formik.values.amount, 18),
        formik.values.isBuy
          ? getContractReadableAmount(formik.values.amount, 18)
          : getContractReadableAmount(formik.values.price, decimals),
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
          });
        } catch (e) {
          console.log('Deposit Failed');
        }
      else {
        setDialogState({
          open: true,
          handleClose,
          data: {
            isPut: formik.values.isPut,
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

  const invalidInputs = useMemo(
    () =>
      Boolean(
        formik.errors.amount || formik.errors.price || formik.errors.base
      ),
    [formik]
  ); // Check if RFQ input field values are valid

  const rfqButtonProps = useMemo(() => {
    if (isLive && approved)
      return {
        disabled: user && invalidInputs,
        buttonContent: user ? 'Submit' : 'Login',
        callback: handleSubmit,
      };
    else if (isLive && !approved) {
      return {
        disabled: !loaded,
        buttonContent: 'Approve',
        callback: handleApprove,
      };
    } else if (!isLive && user) {
      return {
        disabled: !accountAddress || !loaded || invalidInputs,
        buttonContent: !accountAddress ? 'Please Login' : 'Submit',
        callback: () =>
          setDialogState((prevState) => ({ ...prevState, open: true })),
      };
    } else if (!isLive && !user)
      return {
        disabled: true,
        buttonContent: 'Please Login',
        callback: () => {},
      };
  }, [
    accountAddress,
    approved,
    handleApprove,
    handleSubmit,
    invalidInputs,
    isLive,
    loaded,
    user,
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

        const decimals = await erc20.decimals();

        const allowance = await erc20.allowance(
          accountAddress,
          escrowData?.escrowAddress
        );
        setApproved(
          allowance.gte(
            getContractReadableAmount(
              formik.values.isBuy ? formik.values.price : formik.values.amount,
              decimals
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
      formik.setFieldValue('quote', selectedQuote.address);
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
    <Box className="flex flex-col col-span-2 space-y-4">
      <Box className="flex justify-between">
        <Typography variant="h5" className="font-bold">
          {isLive ? 'Trade' : 'Create RFQ'}
        </Typography>
        <Typography
          variant="h6"
          className={`py-0 px-3 rounded-r-2xl rounded-l-2xl border ${
            isLive
              ? 'text-down-bad bg-down-bad/[0.3] border-down-bad'
              : 'text-primary bg-primary/[0.3] border-primary'
          }`}
        >
          {isLive ? 'Trade' : 'RFQ'}
        </Typography>
      </Box>
      <Box className="bg-cod-gray rounded-lg p-2 border border-umbra">
        <Box className="flex flex-col space-y-2">
          <Box className="flex rounded-2xl space-x-2">
            <CustomButton
              size="small"
              className="w-full"
              color={formik.values.isPut ? 'umbra' : 'primary'}
              onClick={() => handleTypeSelection(false)}
              disabled={!filteredBases}
            >
              CALL
            </CustomButton>
            <CustomButton
              size="small"
              className="w-full"
              color={formik.values.isPut ? 'down-bad' : 'umbra'}
              onClick={() => handleTypeSelection(true)}
              disabled={!filteredBases}
            >
              PUT
            </CustomButton>
          </Box>
          <Box className="space-y-2 py-3">
            <Box className="flex space-x-2 mx-2">
              <Typography variant="h6" className="text-stieglitz">
                Balance:
              </Typography>
              <Typography variant="h6" className="text-white">
                {getUserReadableAmount(selectionBalance, 18)}
              </Typography>
            </Box>
            <Box className="flex justify-between bg-umbra rounded-lg mx-2 border border-mineshaft">
              <Select
                fullWidth
                value={selection.address || ''}
                label="Select Option"
                classes={{ icon: 'text-white', select: 'py-1 px-2' }}
                input={<Input />}
                disableUnderline
                MenuProps={{
                  classes: { paper: 'bg-cod-gray p-0' },
                }}
                renderValue={() => {
                  return (
                    <Typography
                      variant="h6"
                      className="text-white w-full relative"
                    >
                      {selection.symbol || 'Select Option'}
                    </Typography>
                  );
                }}
                onChange={handleTokenSelection}
              >
                {filteredBases?.map((option, index) => (
                  <MenuItem
                    value={option.address}
                    key={index}
                    className="text-white bg-cod-gray hover:bg-cod-gray"
                  >
                    <Typography variant="h6" className="text-white">
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
              footer={
                <a
                  href="https://blog.dopex.io/articles/product-launches-updates/introducing-otc-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              }
            />
          </Box>
          {invalidInputs || (isLive && !validAddress) ? (
            <Box className="border rounded-lg border-down-bad bg-down-bad bg-opacity-20 p-2">
              <Typography
                variant="h6"
                className="text-down-bad text-xs text-center"
              >
                {error}
              </Typography>
            </Box>
          ) : null}
          <CustomButton
            size="medium"
            className="flex w-full"
            onClick={rfqButtonProps.callback}
            disabled={rfqButtonProps.disabled}
          >
            <Typography variant="h6">{rfqButtonProps.buttonContent}</Typography>
          </CustomButton>
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
    </Box>
  );
};

export default RfqForm;
