import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import { SelectChangeEvent } from '@mui/material/Select';
import useSendTx from 'hooks/useSendTx';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { DECIMALS_USD, MAX_VALUE } from 'constants/index';
import DepositPanel from './DepositPanel';

import { useBoundStore } from 'store';

// For Goerli test net
const CHAIN_ID: number = 5;

const ProvideLp = () => {
  const sendTx = useSendTx();

  const {
    accountAddress,
    signer,
    getOlpContract,
    olpData,
    olpEpochData,
    selectedIsPut,
    updateOlp,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedIsPut,
  } = useBoundStore();

  const olpContract = getOlpContract();
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawDepositAmount, setRawDepositAmount] = useState<string>('0');
  const [rawDiscountAmount, setRawDiscountAmount] = useState<string>('0');
  const [approved, setApproved] = useState<boolean>(false);
  const [strikeIdx, setStrikeIdx] = useState<number>(0);

  const depositAmount: number = useMemo(() => {
    return parseFloat(rawDepositAmount);
  }, [rawDepositAmount]);
  const discountAmount: number = useMemo(() => {
    return parseFloat(rawDiscountAmount);
  }, [rawDiscountAmount]);
  const handleSelectStrike = useCallback((e: SelectChangeEvent<number>) => {
    setStrikeIdx(Number(e.target.value));
  }, []);

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (!signer || !olpData?.usd || !olpContract?.address) return;
    try {
      await sendTx(
        ERC20__factory.connect(olpData.usd, signer).approve(
          olpContract.address,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, olpContract, olpData]);

  // Handle deposit
  const handleDeposit = useCallback(async () => {
    if (
      !signer ||
      !olpData ||
      !olpEpochData ||
      !olpContract ||
      !accountAddress ||
      selectedIsPut === undefined
    )
      return;

    try {
      await sendTx(
        olpContract
          .connect(signer)
          .addToLp(
            olpData.underlying,
            selectedIsPut,
            olpEpochData.strikes[strikeIdx]!,
            getContractReadableAmount(depositAmount, DECIMALS_USD),
            discountAmount,
            accountAddress
          )
      );

      setRawDepositAmount('0');
      setRawDiscountAmount('0');

      updateOlpEpochData!();
      updateOlpUserData!();
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
    selectedIsPut,
    strikeIdx,
    depositAmount,
    discountAmount,
    updateOlpEpochData,
    updateOlpUserData,
  ]);

  // Update approved state
  useEffect(() => {
    (async () => {
      if (!signer || !accountAddress || !olpData?.usd || !olpContract?.address)
        return;
      try {
        const finalAmount: BigNumber = getContractReadableAmount(
          rawDepositAmount,
          DECIMALS_USD
        );
        const usdToken = await ERC20__factory.connect(olpData.usd, signer);
        const allowance: BigNumber = await usdToken.allowance(
          accountAddress,
          olpContract.address
        );
        const balance: BigNumber = await usdToken.balanceOf(accountAddress);

        setApproved(allowance.gte(finalAmount));
        setUserTokenBalance(balance);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [signer, accountAddress, olpContract, olpData, rawDepositAmount]);

  const depositButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (olpEpochData?.isEpochExpired) return 'Expired';
    else if (depositAmount == 0) return 'Insert an amount';
    else if (
      depositAmount > getUserReadableAmount(userTokenBalance, DECIMALS_USD)
    )
      return 'Insufficient balance';
    else if (discountAmount < 0 || discountAmount >= 100)
      return 'Invalid discount amount';
    return 'Provide LP';
  }, [approved, depositAmount, discountAmount, userTokenBalance, olpEpochData]);

  return (
    <DepositPanel
      strikeIdx={strikeIdx}
      handleSelectStrike={handleSelectStrike}
      strikes={olpEpochData!.strikes}
      rawDiscountAmount={rawDiscountAmount}
      setRawDiscountAmount={setRawDiscountAmount}
      rawDepositAmount={rawDepositAmount}
      setRawDepositAmount={setRawDepositAmount}
      userTokenBalance={userTokenBalance}
      expiry={olpEpochData?.expiry!}
      isEpochExpired={olpEpochData?.isEpochExpired!}
      chainId={CHAIN_ID}
      approved={approved}
      depositAmount={depositAmount}
      handleApprove={handleApprove}
      handleDeposit={handleDeposit}
      depositButtonMessage={depositButtonMessage}
      selectedIsPut={selectedIsPut}
      setSelectedIsPut={setSelectedIsPut}
      updateOlp={updateOlp}
      updateOlpEpochData={updateOlpEpochData}
      updateOlpUserData={updateOlpUserData}
    />
  );
};

export default ProvideLp;
