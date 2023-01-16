import { useCallback, useEffect, useState, useMemo } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import Dialog from 'components/UI/Dialog';
import FillPositionDialog from 'components/olp/FillPosition/FillPositionDialog';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import {
  allowanceApproval,
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';

import { MAX_VALUE, DECIMALS_TOKEN, DECIMALS_USD } from 'constants/index';

const CHAIN_ID: number = 5;

export interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
}

const FillPosition = ({ anchorEl, setAnchorEl }: Props) => {
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
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawFillAmount, setRawFillAmount] = useState<string>('1');
  const [outUsd, setOutUsd] = useState<boolean>(false);

  const fillAmount: number = useMemo(() => {
    return rawFillAmount ? parseFloat(rawFillAmount) : 0;
  }, [rawFillAmount]);

  const usdToReceive: number = useMemo(() => {
    if (!olpContract || !olpData || !lpPositionSelected) return 0;
    try {
      return fillAmount
        ? getUserReadableAmount(lpPositionSelected?.premium, DECIMALS_USD) *
            fillAmount
        : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }, [fillAmount, olpContract, olpData, lpPositionSelected]);

  const underlyingToReceive: number = useMemo(() => {
    if (!olpContract || !olpData || !lpPositionSelected) return 0;
    try {
      return fillAmount
        ? getUserReadableAmount(
            lpPositionSelected?.underlyingPremium,
            DECIMALS_TOKEN
          ) * fillAmount
        : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }, [fillAmount, olpContract, olpData, lpPositionSelected]);

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
      await sendTx(strikeToken, 'approve', [olpContract.address, MAX_VALUE]);
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, olpContract, olpData, lpPositionSelected]);

  const handleOutUsd = useCallback(async () => {
    try {
      setOutUsd(!outUsd);
    } catch (err) {
      console.log(err);
    }
  }, [setOutUsd, outUsd]);

  const handleFillPosition = useCallback(async () => {
    if (!olpContract || !signer || !lpPositionSelected || !olpData) return;
    try {
      const strikeTokenAddress = await olpContract.getSsovOptionToken(
        olpData?.ssov,
        olpData?.currentEpoch,
        lpPositionSelected?.strike
      );

      await sendTx(olpContract.connect(signer), 'fillLpPosition', [
        olpData?.isPut,
        outUsd,
        strikeTokenAddress,
        BigNumber.from(lpPositionSelected?.lpId),
        getContractReadableAmount(rawFillAmount, DECIMALS_TOKEN),
      ]);

      setRawFillAmount('1');

      await updateOlpEpochData!();
      await updateOlpUserData!();
    } catch (err) {
      console.log(err);
    }
  }, [
    olpContract,
    olpData,
    lpPositionSelected,
    outUsd,
    signer,
    updateOlpEpochData,
    updateOlpUserData,
    sendTx,
    rawFillAmount,
  ]);

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
        // TODO: verify
        allowanceApproval(
          strikeTokenAddress,
          accountAddress,
          olpContract.address,
          signer,
          getContractReadableAmount(rawFillAmount, DECIMALS_TOKEN),
          setApproved,
          setUserTokenBalance
        );
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

  const fillButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (fillAmount === 0) return 'Insert an amount';
    else if (
      fillAmount > getUserReadableAmount(userTokenBalance, DECIMALS_TOKEN)
    )
      return 'Insufficient balance';
    else if (
      lpPositionSelected?.usdLiquidity.gt(BigNumber.from(0)) &&
      usdToReceive >
        getUserReadableAmount(lpPositionSelected?.usdLiquidity!, DECIMALS_USD)
    )
      return 'Insufficient liquidity';
    else if (
      lpPositionSelected?.underlyingLiquidity.gt(BigNumber.from(0)) &&
      underlyingToReceive >
        getUserReadableAmount(
          lpPositionSelected?.underlyingLiquidity!,
          DECIMALS_TOKEN
        )
    )
      return 'Insufficient liquidity';
    return 'Fill';
  }, [
    approved,
    fillAmount,
    userTokenBalance,
    usdToReceive,
    underlyingToReceive,
    lpPositionSelected,
  ]);

  return (
    <Dialog
      open={anchorEl != null}
      handleClose={() => setAnchorEl(null)}
      disableScrollLock={true}
      sx={{
        '.MuiPaper-root': {
          padding: '12px',
        },
      }}
      width={368}
    >
      <FillPositionDialog
        isPut={olpData?.isPut!}
        lpPositionSelected={lpPositionSelected!}
        usdToReceive={usdToReceive!}
        underlyingToReceive={underlyingToReceive!}
        rawFillAmount={rawFillAmount!}
        setRawFillAmount={setRawFillAmount}
        userTokenBalance={userTokenBalance}
        approved={approved}
        chainId={CHAIN_ID}
        outUsd={outUsd}
        handleApprove={handleApprove}
        handleFillPosition={handleFillPosition}
        handleOutUsd={handleOutUsd}
        fillButtonMessage={fillButtonMessage}
        underlyingSymbol={olpData?.underlyingSymbol!}
      />
    </Dialog>
  );
};

export default FillPosition;
