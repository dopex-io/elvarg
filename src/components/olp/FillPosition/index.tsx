import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { Modal } from '@mui/material';
import { BigNumber } from 'ethers';
import useSendTx from 'hooks/useSendTx';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import { MAX_VALUE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';
import FillPositionDialog from './FillPositionDialog';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import { useBoundStore } from 'store';

const CHAIN_ID: number = 5;
const PERCENT: number = 100;

export interface Props {
  open: boolean;
  handleClose: Function;
}

const FillPosition = ({ open, handleClose }: Props) => {
  const sendTx = useSendTx();
  const {
    accountAddress,
    signer,
    getOlpContract,
    olpData,
    olpEpochData,
    updateOlpEpochData,
    updateOlpUserData,
    selectedPositionIdx,
  } = useBoundStore();

  const olpContract = getOlpContract();
  const lpPositionSelected = useMemo(() => {
    return olpEpochData?.lpPositions[selectedPositionIdx!];
  }, [olpEpochData, selectedPositionIdx]);

  const [approved, setApproved] = useState<boolean>(false);
  const [strikeTokenPrice, setStrikeTokenPrice] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawFillAmount, setRawFillAmount] = useState<string>('0');

  // Parse and update info entered by user
  const fillAmount: number = useMemo(() => {
    return rawFillAmount ? parseFloat(rawFillAmount) : 0;
  }, [rawFillAmount]);

  const usdToReceive: number = useMemo(() => {
    if (!olpContract || !olpData || !lpPositionSelected) return 0;
    try {
      // Note that 0 < discount < 100 and to calculate price after discount,
      // we take (100 - discount) / 100
      const pricePerTokenAfterDiscount = strikeTokenPrice
        .mul(
          BigNumber.from(PERCENT).sub(
            BigNumber.from(lpPositionSelected?.discount)
          )
        )
        .div(BigNumber.from(PERCENT));

      return fillAmount
        ? getUserReadableAmount(pricePerTokenAfterDiscount, DECIMALS_USD) *
            fillAmount
        : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }, [fillAmount, olpContract, olpData, lpPositionSelected, strikeTokenPrice]);

  // Update premium
  useEffect(() => {
    (async () => {
      if (!olpContract || !olpData || !lpPositionSelected) return;
      try {
        // $7 usd per token
        const price = await olpContract.getSsovUsdPremiumCalculation(
          olpData?.ssov,
          lpPositionSelected?.strike,
          oneEBigNumber(DECIMALS_TOKEN)
        );
        setStrikeTokenPrice(price);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [olpContract, olpData, lpPositionSelected]);

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (!signer || !olpData || !olpContract || !lpPositionSelected) return;
    try {
      const strikeTokenAddress = await olpContract.getSsovOptionToken(
        olpData?.ssov,
        olpData?.currentEpoch,
        lpPositionSelected?.strike
      );
      const strikeToken = await ERC20__factory.connect(
        strikeTokenAddress,
        signer
      );
      await sendTx(strikeToken.approve(olpContract.address, MAX_VALUE));
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, olpContract, olpData, lpPositionSelected]);

  // Handle fill
  const handleFillPosition = useCallback(async () => {
    if (
      !olpContract ||
      !signer ||
      !lpPositionSelected ||
      !olpData ||
      !lpPositionSelected
    )
      return;
    try {
      const strikeTokenAddress = await olpContract.getSsovOptionToken(
        olpData?.ssov,
        olpData?.currentEpoch,
        lpPositionSelected?.strike
      );
      await sendTx(
        olpContract
          .connect(signer)
          .fillLpPosition(
            strikeTokenAddress,
            BigNumber.from(lpPositionSelected?.lpId),
            getContractReadableAmount(rawFillAmount, DECIMALS_TOKEN)
          )
      );

      setRawFillAmount('0');

      await updateOlpEpochData!();
      await updateOlpUserData!();
    } catch (err) {
      console.log(err);
    }
  }, [
    olpContract,
    olpData,
    lpPositionSelected,
    signer,
    updateOlpEpochData,
    updateOlpUserData,
    sendTx,
    rawFillAmount,
  ]);

  // Update approved state
  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !accountAddress ||
        !olpContract ||
        !olpData ||
        !rawFillAmount ||
        !lpPositionSelected
      )
        return;
      try {
        const strikeTokenAddress = await olpContract.getSsovOptionToken(
          olpData?.ssov,
          olpData?.currentEpoch,
          lpPositionSelected?.strike
        );
        const finalAmount: BigNumber = getContractReadableAmount(
          rawFillAmount,
          DECIMALS_TOKEN
        );
        const strikeToken = await ERC20__factory.connect(
          strikeTokenAddress,
          signer
        );
        const allowance: BigNumber = await strikeToken.allowance(
          accountAddress,
          olpContract.address
        );
        const balance: BigNumber = await strikeToken.balanceOf(accountAddress);
        setApproved(allowance.gte(finalAmount));
        setUserTokenBalance(balance);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [
    signer,
    accountAddress,
    olpContract,
    olpData,
    rawFillAmount,
    fillAmount,
    lpPositionSelected,
  ]);

  // Message to display during deposit
  const fillButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (fillAmount == 0) return 'Insert an amount';
    else if (
      fillAmount > getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN)
    )
      return 'Insufficient balance';
    else if (
      usdToReceive >
      getUserReadableAmount(lpPositionSelected?.liquidity!, DECIMALS_USD)
    )
      return 'Insufficient liquidity';
    return 'Fill';
  }, [
    approved,
    fillAmount,
    userTokenBalance,
    usdToReceive,
    lpPositionSelected,
  ]);

  return (
    <Modal
      className="flex items-center justify-center"
      open={open}
      onClose={() => handleClose}
    >
      <FillPositionDialog
        handleClose={handleClose}
        strike={lpPositionSelected?.strike!}
        liquidity={lpPositionSelected?.liquidity!}
        usdToReceive={usdToReceive!}
        rawFillAmount={rawFillAmount!}
        setRawFillAmount={setRawFillAmount}
        userTokenBalance={userTokenBalance}
        approved={approved}
        chainId={CHAIN_ID}
        fillAmount={fillAmount}
        handleApprove={handleApprove}
        handleFillPosition={handleFillPosition}
        fillButtonMessage={fillButtonMessage}
      />
    </Modal>
  );
};

export default FillPosition;
