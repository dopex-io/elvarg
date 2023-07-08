import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';

import { ERC20__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import ApproveDepositButton from 'components/common/ApproveDepositButton';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
import DiscountBox from 'components/common/LpCommon/DiscountBox';
import WithdrawInfoBox from 'components/common/LpCommon/WithdrawInfoBox';
import {
  DepositBalanceBox,
  PutBox,
  StrikeBox,
} from 'components/olp/ProvideLp/DepositPanel';
import Typography from 'components/UI/Typography';

import allowanceApproval from 'utils/contracts/allowanceApproval';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getDepositMessage from 'utils/contracts/getDepositMessage';

import { DECIMALS_TOKEN, DECIMALS_USD, MAX_VALUE } from 'constants/index';

// For Goerli test net
const CHAIN_ID: number = 5;

const ProvideLp = () => {
  const sendTx = useSendTx();
  const {
    accountAddress,
    signer,
    getOlpContract,
    setSelectedIsPut,
    updateOlp,
    olpData,
    olpEpochData,
    updateOlpEpochData,
    updateOlpUserData,
  } = useBoundStore();

  const olpContract = getOlpContract();
  const [usdBalance, setUsdBalance] = useState<BigNumber>(BigNumber.from(0));
  const [underlyingBalance, setUnderlyingBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawDepositAmount, setRawDepositAmount] = useState<string>('1');
  const [rawDiscountAmount, setRawDiscountAmount] = useState<string>('1');
  const [approved, setApproved] = useState<boolean>(false);
  const [underlyingApproved, setUnderlyingApproved] = useState<boolean>(false);
  const [strikeIdx, setStrikeIdx] = useState<number>(0);
  const [assetIdx, setAssetIdx] = useState<number>(0);

  const depositAmount: number = useMemo(() => {
    return parseFloat(rawDepositAmount);
  }, [rawDepositAmount]);
  const discountAmount: number = useMemo(() => {
    return parseFloat(rawDiscountAmount);
  }, [rawDiscountAmount]);
  const handleSelectStrike = useCallback((e: SelectChangeEvent<number>) => {
    setStrikeIdx(Number(e.target.value));
  }, []);
  const handleSelectAsset = useCallback((e: SelectChangeEvent<number>) => {
    setAssetIdx(Number(e.target.value));
  }, []);

  const handleApprove = useCallback(async () => {
    if (
      !signer ||
      !olpData?.usd ||
      !olpContract?.address ||
      assetIdx === undefined
    )
      return;
    try {
      await sendTx(ERC20__factory.connect(olpData.usd, signer), 'approve', [
        olpContract.address,
        MAX_VALUE,
      ]);
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, olpContract, olpData, assetIdx]);

  const handleUnderlyingApprove = useCallback(async () => {
    if (
      !signer ||
      !olpData?.underlying ||
      !olpContract?.address ||
      assetIdx === undefined
    )
      return;
    try {
      await sendTx(
        ERC20__factory.connect(olpData.underlying, signer),
        'approve',
        [olpContract.address, MAX_VALUE]
      );
      setUnderlyingApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, olpContract, olpData, assetIdx]);

  const handleDeposit = useCallback(async () => {
    if (
      !signer ||
      !olpData ||
      !olpEpochData ||
      !olpContract ||
      !accountAddress ||
      assetIdx === undefined
    )
      return;

    try {
      await sendTx(olpContract.connect(signer), 'addToLp', [
        olpData.underlying,
        assetIdx === 0, // isUsd
        olpData?.isPut,
        olpEpochData.strikes[strikeIdx]!,
        getContractReadableAmount(
          depositAmount,
          assetIdx === 0 ? DECIMALS_USD : DECIMALS_TOKEN
        ),
        discountAmount,
        MAX_VALUE,
        accountAddress,
      ]);

      setRawDepositAmount('1');
      setRawDiscountAmount('1');

      await updateOlpEpochData!();
      await updateOlpUserData!();
    } catch (err) {
      console.log(err);
    }
  }, [
    signer,
    sendTx,
    accountAddress,
    olpContract,
    olpData,
    olpEpochData,
    strikeIdx,
    depositAmount,
    discountAmount,
    updateOlpEpochData,
    updateOlpUserData,
    assetIdx,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !accountAddress ||
        !olpData?.usd ||
        !olpContract?.address ||
        !olpData?.underlying
      )
        return;
      try {
        if (assetIdx === 0) {
          allowanceApproval(
            olpData.usd,
            accountAddress,
            olpContract.address,
            signer,
            getContractReadableAmount(rawDepositAmount, DECIMALS_USD),
            setApproved,
            setUsdBalance
          );
        } else {
          allowanceApproval(
            olpData.underlying,
            accountAddress,
            olpContract.address,
            signer,
            getContractReadableAmount(rawDepositAmount, DECIMALS_TOKEN),
            setUnderlyingApproved,
            setUnderlyingBalance
          );
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [
    signer,
    accountAddress,
    olpContract,
    olpData,
    assetIdx,
    rawDepositAmount,
  ]);

  const handleIsPut = useCallback(
    async (isPut: boolean) => {
      if (!setSelectedIsPut) return;
      setSelectedIsPut(isPut);
      await updateOlp();
      await updateOlpEpochData();
      await updateOlpUserData();
    },
    [setSelectedIsPut, updateOlp, updateOlpEpochData, updateOlpUserData]
  );

  const depositButtonMessage = getDepositMessage(
    olpEpochData!.isEpochExpired,
    depositAmount,
    assetIdx,
    approved,
    underlyingApproved,
    usdBalance,
    underlyingBalance,
    discountAmount,
    rawDiscountAmount
  );

  if (!olpData) {
    return (
      <div className="bg-cod-gray p-3 rounded-xl w-full md:w-[350px] flex justify-around">
        <CircularProgress className="justify-around" />
      </div>
    );
  }

  return (
    <Box className="bg-cod-gray p-3 rounded-xl w-full md:w-[350px]">
      <Box className="flex mb-3">
        <Typography variant="h6">Provide LP</Typography>
      </Box>
      <DepositBalanceBox
        rawDepositAmount={rawDepositAmount}
        setRawDepositAmount={setRawDepositAmount}
        usdBalance={usdBalance}
        underlyingBalance={underlyingBalance}
        assetIdx={assetIdx}
        underlyingSymbol={olpData?.underlyingSymbol!}
        assets={['usdc', olpData?.underlyingSymbol!.toLowerCase()!]}
        handleSelectAsset={handleSelectAsset}
      />
      <Box className="flex flex-row justify-between bg-umbra pb-2 border-radius rounded-lg mt-1">
        <PutBox
          isPut={olpData?.isPut!}
          handleIsPut={handleIsPut}
          hasPut={olpData?.hasPut!}
          hasCall={olpData?.hasCall!}
        />
        <StrikeBox
          strikeIdx={strikeIdx}
          handleSelectStrike={handleSelectStrike}
          olpEpochData={olpEpochData}
        />
      </Box>
      <Box className="bg-umbra p-1 pb-2 border-radius rounded-lg mt-1">
        <DiscountBox
          rawAmount={rawDiscountAmount}
          setRawAmount={setRawDiscountAmount}
          amount={discountAmount}
        />
      </Box>
      <Box className="bg-umbra p-2 border-radius rounded-lg mt-4">
        <Box className="bg-carbon p-2 border-radius rounded-lg my-2 space-y-1">
          <EstimatedGasCostButton gas={500000} chainId={CHAIN_ID} />
          <WithdrawInfoBox expiry={olpEpochData?.expiry!} />
        </Box>
        {assetIdx === 0 ? (
          <ApproveDepositButton
            approved={approved}
            fillButtonMessage={depositButtonMessage}
            handleFillPosition={handleDeposit}
            handleApprove={handleApprove}
            showPrimary={
              !olpEpochData?.isEpochExpired &&
              (!approved || depositButtonMessage === 'Provide LP')
            }
          />
        ) : (
          <ApproveDepositButton
            approved={underlyingApproved}
            fillButtonMessage={depositButtonMessage}
            handleFillPosition={handleDeposit}
            handleApprove={handleUnderlyingApprove}
            showPrimary={
              !olpEpochData?.isEpochExpired &&
              (!approved || depositButtonMessage === 'Provide LP')
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default ProvideLp;
