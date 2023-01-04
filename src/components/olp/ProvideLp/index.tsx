import { useCallback, useEffect, useState, useMemo } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import { SelectChangeEvent } from '@mui/material/Select';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';
import { allowanceApproval, getContractReadableAmount } from 'utils/contracts';

import { DECIMALS_TOKEN, DECIMALS_USD, MAX_VALUE } from 'constants/index';

import DepositPanel from './DepositPanel';

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

  return (
    <DepositPanel
      strikeIdx={strikeIdx}
      assetIdx={assetIdx}
      handleSelectStrike={handleSelectStrike}
      olpEpochData={olpEpochData!}
      olpData={olpData!}
      rawDiscountAmount={rawDiscountAmount}
      setRawDiscountAmount={setRawDiscountAmount}
      discountAmount={discountAmount}
      rawDepositAmount={rawDepositAmount}
      setRawDepositAmount={setRawDepositAmount}
      handleSelectAsset={handleSelectAsset}
      usdBalance={usdBalance}
      underlyingBalance={underlyingBalance}
      chainId={CHAIN_ID}
      approved={approved}
      underlyingApproved={underlyingApproved}
      handleIsPut={handleIsPut}
      handleApprove={handleApprove}
      handleUnderlyingApprove={handleUnderlyingApprove}
      handleDeposit={handleDeposit}
      depositAmount={depositAmount}
    />
  );
};

export default ProvideLp;
