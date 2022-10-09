import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import { SelectChangeEvent } from '@mui/material';
import useSendTx from 'hooks/useSendTx';
import {
  allowanceApproval,
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import {
  DECIMALS_STRIKE,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  MAX_VALUE,
} from 'constants/index';
import DepositPanel from './DepositPanel';

import { useBoundStore } from 'store';
import getDepositMessage from 'utils/contracts/getDepositMessage';
import { getNearestValidPrice } from './helper';

// For Goerli test net
const CHAIN_ID: number = 5;

const ProvideLp = () => {
  const sendTx = useSendTx();
  const {
    accountAddress,
    signer,
    getSlpContract,
    slpData,
    slpEpochData,
    updateSlpEpochData,
    updateSlpUserProvideLpData,
    selectedPoolName,
  } = useBoundStore();

  const slpContract = getSlpContract();
  const nearestValidPrice = useMemo(() => {
    return getNearestValidPrice(
      getUserReadableAmount(slpEpochData?.currentPrice!, DECIMALS_STRIKE)
    );
  }, [slpEpochData]);

  const [usdBalance, setUsdBalance] = useState<BigNumber>(BigNumber.from(0));
  const [underlyingBalance, setUnderlyingBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawDepositAmount, setRawDepositAmount] = useState<string>('0');
  const [rawMarkupAmount, setRawMarkupAmount] = useState<string>('0');
  const [rawStrike, setRawStrike] = useState<string>('0');
  const [approved, setApproved] = useState<boolean>(false);
  const [underlyingApproved, setUnderlyingApproved] = useState<boolean>(false);
  const [assetIdx, setAssetIdx] = useState<number>(0);

  useEffect(() => {
    if (rawStrike === '0') setRawStrike(nearestValidPrice.toString());
  }, [rawStrike, nearestValidPrice]);

  const depositAmount: number = useMemo(() => {
    return parseFloat(rawDepositAmount) || 0;
  }, [rawDepositAmount]);
  const markupAmount: number = useMemo(() => {
    return parseFloat(rawMarkupAmount) || 0;
  }, [rawMarkupAmount]);
  const strike: number = useMemo(() => {
    return parseFloat(rawStrike) || 0;
  }, [rawStrike]);
  const assetToWrite: number = useMemo(() => {
    return strike * depositAmount;
  }, [strike, depositAmount]);
  const handleSelectAsset = useCallback((e: SelectChangeEvent<number>) => {
    setAssetIdx(Number(e.target.value));
  }, []);

  const handleApprove = useCallback(async () => {
    if (
      !signer ||
      !slpData?.usd ||
      !slpContract?.address ||
      assetIdx === undefined
    )
      return;
    try {
      await sendTx(
        ERC20__factory.connect(slpData.usd, signer).approve(
          slpContract.address,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, slpContract, slpData, assetIdx]);

  const handleUnderlyingApprove = useCallback(async () => {
    if (
      !signer ||
      !slpData?.underlying ||
      !slpContract?.address ||
      assetIdx === undefined
    )
      return;
    try {
      await sendTx(
        ERC20__factory.connect(slpData.underlying, signer).approve(
          slpContract.address,
          MAX_VALUE
        )
      );
      setUnderlyingApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, slpContract, slpData, assetIdx]);

  const handleDeposit = useCallback(async () => {
    if (
      !signer ||
      !slpData ||
      !slpEpochData ||
      !slpContract ||
      !accountAddress ||
      assetIdx === undefined
    )
      return;
    try {
      await sendTx(
        slpContract.connect(signer).addToLp(
          getContractReadableAmount(strike, DECIMALS_STRIKE),
          getContractReadableAmount(depositAmount, DECIMALS_TOKEN),
          markupAmount,
          accountAddress,
          assetIdx === 0 // isUsd
        )
      );

      setRawDepositAmount('0');
      setRawMarkupAmount('0');

      await updateSlpEpochData!();
      await updateSlpUserProvideLpData!();
    } catch (err) {
      console.log(err);
    }
  }, [
    signer,
    sendTx,
    accountAddress,
    slpContract,
    slpData,
    slpEpochData,
    updateSlpEpochData,
    updateSlpUserProvideLpData,
    markupAmount,
    depositAmount,
    strike,
    assetIdx,
  ]);

  useEffect(() => {
    (async () => {
      if (!signer || !accountAddress || !slpData?.usd || !slpContract?.address)
        return;
      try {
        if (assetIdx === 0) {
          allowanceApproval(
            slpData.usd,
            accountAddress,
            slpContract.address,
            signer,
            getContractReadableAmount(rawDepositAmount, DECIMALS_USD),
            setApproved,
            setUsdBalance
          );
        } else {
          allowanceApproval(
            slpData.underlying,
            accountAddress,
            slpContract.address,
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
    slpContract,
    slpData,
    rawDepositAmount,
    rawStrike,
    assetIdx,
  ]);

  const depositButtonMessage: string = useMemo(() => {
    return getDepositMessage(
      slpEpochData!.isEpochExpired,
      assetToWrite,
      assetIdx,
      approved,
      underlyingApproved,
      usdBalance,
      underlyingBalance,
      markupAmount
    );
  }, [
    approved,
    slpEpochData,
    assetToWrite,
    markupAmount,
    usdBalance,
    assetIdx,
    underlyingApproved,
    underlyingBalance,
  ]);

  return (
    <DepositPanel
      rawMarkupAmount={rawMarkupAmount}
      setRawMarkupAmount={setRawMarkupAmount}
      rawDepositAmount={rawDepositAmount}
      setRawDepositAmount={setRawDepositAmount}
      rawStrike={rawStrike}
      setRawStrike={setRawStrike}
      nearestValidPrice={nearestValidPrice}
      usdBalance={usdBalance}
      underlyingBalance={underlyingBalance}
      selectedPoolName={selectedPoolName!}
      assetToWrite={assetToWrite}
      expiry={slpEpochData!.expiry}
      isEpochExpired={slpEpochData!.isEpochExpired}
      chainId={CHAIN_ID}
      approved={approved}
      underlyingApproved={underlyingApproved}
      handleApprove={handleApprove}
      handleUnderlyingApprove={handleUnderlyingApprove}
      handleDeposit={handleDeposit}
      depositButtonMessage={depositButtonMessage}
      assetIdx={assetIdx}
      handleSelectAsset={handleSelectAsset}
    />
  );
};

export default ProvideLp;
