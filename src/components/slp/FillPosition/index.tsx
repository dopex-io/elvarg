import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { Modal, SelectChangeEvent } from '@mui/material';
import { BigNumber } from 'ethers';
import useSendTx from 'hooks/useSendTx';
import {
  allowanceApproval,
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import {
  MAX_VALUE,
  DECIMALS_TOKEN,
  DECIMALS_USD,
  DECIMALS_STRIKE,
} from 'constants/index';
import FillPositionDialog from './FillPositionDialog';

import { useBoundStore } from 'store';
import getDepositMessage from 'utils/contracts/getDepositMessage';

const CHAIN_ID: number = 5;

export interface Props {
  open: boolean;
  handleClose: Function;
}

const FillPosition = ({ open, handleClose }: Props) => {
  const sendTx = useSendTx();
  const {
    accountAddress,
    selectedPoolName,
    signer,
    getSlpContract,
    slpData,
    slpEpochData,
    updateSlpEpochData,
    updateSlpUserProvideLpData,
    selectedPositionIdx,
  } = useBoundStore();

  const slpContract = getSlpContract();
  const lpPositionSelected = useMemo(() => {
    return slpEpochData?.lpPositions[selectedPositionIdx!];
  }, [slpEpochData, selectedPositionIdx]);

  const [approved, setApproved] = useState<boolean>(false);
  const [usdBalance, setUsdBalance] = useState<BigNumber>(BigNumber.from(0));
  const [underlyingApproved, setUnderlyingApproved] = useState<boolean>(false);
  const [underlyingBalance, setUnderlyingBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [assetIdx, setAssetIdx] = useState<number>(0);
  const [rawFillAmount, setRawFillAmount] = useState<string>('0');

  const fillAmount: number = useMemo(() => {
    return rawFillAmount ? parseFloat(rawFillAmount) : 0;
  }, [rawFillAmount]);

  const strikeTokenName = useMemo(() => {
    if (!slpEpochData || selectedPositionIdx === undefined || !selectedPoolName)
      return '';
    let name: string = selectedPoolName;
    name += `-${getUserReadableAmount(
      slpEpochData.lpPositions[selectedPositionIdx]?.strike!,
      DECIMALS_STRIKE
    )}`;
    name += '-P';
    return name;
  }, [slpEpochData, selectedPositionIdx, selectedPoolName]);

  const usdToPay: number = useMemo(() => {
    if (!lpPositionSelected) return 0;
    try {
      return fillAmount
        ? getUserReadableAmount(lpPositionSelected?.premium, DECIMALS_USD) *
            fillAmount
        : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }, [fillAmount, lpPositionSelected]);

  const underlyingToPay: number = useMemo(() => {
    if (!lpPositionSelected) return 0;
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
  }, [fillAmount, lpPositionSelected]);

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
      if (assetIdx === 0) {
        await sendTx(
          ERC20__factory.connect(slpData.usd, signer).approve(
            slpContract.address,
            MAX_VALUE
          )
        );
        setApproved(true);
      } else if (assetIdx === 1) {
        await sendTx(
          ERC20__factory.connect(slpData.underlying, signer).approve(
            slpContract.address,
            MAX_VALUE
          )
        );
        setUnderlyingApproved(true);
      } else {
        throw Error('Invalid index to approve!');
      }
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, slpContract, slpData, assetIdx]);

  const handleFillPosition = useCallback(async () => {
    if (!slpContract || !signer || !lpPositionSelected || !slpData) return;
    try {
      await sendTx(
        slpContract
          .connect(signer)
          .fillLpPosition(
            BigNumber.from(lpPositionSelected?.strike),
            BigNumber.from(lpPositionSelected?.lpId),
            getContractReadableAmount(rawFillAmount, DECIMALS_TOKEN),
            assetIdx === 0 /* isUsd */
          )
      );

      setRawFillAmount('0');

      await updateSlpUserProvideLpData!();
      await updateSlpEpochData!();
    } catch (err) {
      console.log(err);
    }
  }, [
    slpContract,
    slpData,
    lpPositionSelected,
    signer,
    updateSlpUserProvideLpData,
    updateSlpEpochData,
    sendTx,
    rawFillAmount,
    assetIdx,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !accountAddress ||
        !slpContract ||
        !slpData ||
        !rawFillAmount ||
        assetIdx === undefined
      )
        return;
      try {
        if (assetIdx === 0) {
          allowanceApproval(
            slpData.usd,
            accountAddress,
            slpContract.address,
            signer,
            getContractReadableAmount(rawFillAmount, DECIMALS_USD),
            setApproved,
            setUsdBalance
          );
        } else {
          allowanceApproval(
            slpData.underlying,
            accountAddress,
            slpContract.address,
            signer,
            getContractReadableAmount(rawFillAmount, DECIMALS_TOKEN),
            setUnderlyingApproved,
            setUnderlyingBalance
          );
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [signer, accountAddress, slpContract, slpData, rawFillAmount, assetIdx]);

  const fillButtonMessage: string = useMemo(() => {
    return getDepositMessage(
      slpEpochData!.isEpochExpired,
      fillAmount,
      assetIdx,
      approved,
      underlyingApproved,
      usdBalance,
      underlyingBalance,
      1 /* dummy variable */,
      'Fill'
    );
  }, [
    slpEpochData,
    fillAmount,
    assetIdx,
    approved,
    underlyingApproved,
    usdBalance,
    underlyingBalance,
  ]);

  return (
    <Modal
      className="flex items-center justify-center"
      open={open}
      onClose={() => handleClose}
      disableScrollLock={true}
    >
      <FillPositionDialog
        handleClose={handleClose}
        strikeTokenName={strikeTokenName}
        lpPositionSelected={lpPositionSelected!}
        usdToPay={usdToPay}
        rawFillAmount={rawFillAmount}
        setRawFillAmount={setRawFillAmount}
        usdBalance={usdBalance}
        underlyingToPay={underlyingToPay}
        underlyingBalance={underlyingBalance}
        approved={approved}
        underlyingApproved={underlyingApproved}
        isEpochExpired={slpEpochData!.isEpochExpired}
        chainId={CHAIN_ID}
        currentEpochExpiry={slpEpochData?.expiry!}
        handleApprove={handleApprove}
        handleFillPosition={handleFillPosition}
        fillButtonMessage={fillButtonMessage}
        assetIdx={assetIdx}
        handleSelectAsset={handleSelectAsset}
        selectedPoolName={selectedPoolName}
      />
    </Modal>
  );
};

export default FillPosition;
