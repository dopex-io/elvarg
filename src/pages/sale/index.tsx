import { useEffect, useCallback } from 'react';
import Head from 'next/head';
import { TokenSale__factory } from '@dopex-io/sdk';
import c from 'classnames';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import AppBar from 'components/common/AppBar';
import ClaimSection from 'components/sale/ClaimSection';
import StatsSection from 'components/sale/StatsSection';
import InfoSection from 'components/sale/InfoSection';

import { useBoundStore } from 'store';

import useEthPrice from 'hooks/useEthPrice';
import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';

const TokenSale = () => {
  const {
    // Wallet
    accountAddress,
    signer,
    contractAddresses,
    // TokenSale
    updateUserData,
    updateSaleData,
    weiDeposited,
    saleStart,
    saleWhitelistStart,
    saleClose,
    tokensAllocated,
    claimAmount,
    deposits,
    blockTime,
  } = useBoundStore();

  const ethPrice = useEthPrice();
  const sendTx = useSendTx();

  const saleStartedWhitelist = blockTime >= saleWhitelistStart ? true : false;

  const saleStarted = blockTime >= saleStart ? true : false;
  let validationSchema;

  if (saleStartedWhitelist && !saleStarted) {
    validationSchema = yup.object({
      amount: yup
        .number()
        .min(0, 'Amount has to be greater than 0')
        .required('Amount is required'),
    });
  } else {
    validationSchema = yup.object({
      amount: yup
        .number()
        .min(0, 'Amount has to be greater than 0')
        .required('Amount is required'),
    });
  }

  const formik = useFormik({
    initialValues: {
      amount: '0',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleClaim = useCallback(async () => {
    if (!signer || !accountAddress || !contractAddresses['TokenSale']) return;
    try {
      await sendTx(
        TokenSale__factory.connect(
          contractAddresses['TokenSale'],
          signer
        ).claim(accountAddress)
      );
      updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [signer, accountAddress, contractAddresses, sendTx, updateUserData]);

  const depositShare = formik.values.amount
    ? (Number(deposits) / Number(weiDeposited)) * 100 || 0
    : (Number(deposits) / Number(weiDeposited)) * 100 || 0;

  const dpxEthPrice = Number(weiDeposited)
    ? Number(weiDeposited) / Number(tokensAllocated)
    : 0;

  const dpxPrice = dpxEthPrice * ethPrice;

  const saleClosed = blockTime > saleClose ? true : false;

  useEffect(() => {
    updateSaleData();
  }, [updateSaleData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Token Sale | Dopex</title>
      </Head>
      <AppBar active="token sale" />
      <Box className="py-32 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="mb-10 text-center rounded-xl">
          <Typography variant="h2" className="mb-4">
            Sale has ended. Thank you for participating!
          </Typography>
        </Box>
        <Box className="flex flex-col lg:flex-row max-w-4xl mx-auto">
          <InfoSection />
          <Box
            className={c(
              accountAddress
                ? 'lg:w-5/12 mb-20 lg:mb-0'
                : 'lg:w-5/12 mb-20 lg:mb-0 opacity-40'
            )}
          >
            <Box className="bg-cod-gray p-4 rounded-xl">
              <Box className="flex flex-row mb-2 justify-between">
                <Box className="flex flex-row w-full items-center justify-between">
                  <Typography variant="h4">Claim DPX</Typography>
                </Box>
              </Box>
              <ClaimSection data={{ saleClose, saleClosed }} />
              <StatsSection
                data={{
                  formik,
                  deposits,
                  depositShare,
                  claimAmount,
                  dpxPrice,
                }}
              />
              <Box className="flex flex-row">
                <CustomButton
                  size="large"
                  disabled={claimAmount?.toString() === '0'}
                  className="w-full"
                  onClick={handleClaim}
                >
                  {claimAmount?.toString() === '0' || claimAmount === null
                    ? 'Nothing to Claim'
                    : `Claim ${formatAmount(claimAmount.toString())} DPX`}
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function TokenSalePage() {
  return <TokenSale />;
}
