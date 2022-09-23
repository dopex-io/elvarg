import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { Modal } from '@mui/material';
import { BigNumber } from 'ethers';
import useSendTx from 'hooks/useSendTx';
import { OlpContext } from 'contexts/Rolp';
import { WalletContext } from 'contexts/Wallet';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import {
  MAX_VALUE,
  DEFAULT_TOKEN_DECIMALS,
  DEFAULT_USD_DECIMALS,
  DEFAULT_STRIKE_DECIMALS,
} from 'constants/index';
import FillPositionDialog from './FillPositionDialog';
import oneEBigNumber from 'utils/math/oneEBigNumber';

const CHAIN_ID: number = 5;
const PERCENT: number = 100;

export interface Props {
  open: boolean;
  handleClose: Function;
}

const FillPositionRolp = ({ open, handleClose }: Props) => {
  const sendTx = useSendTx();
  const { accountAddress, signer } = useContext(WalletContext);
  const {
    olpContract,
    olpData,
    olpEpochData,
    updateOlpEpochData,
    updateOlpUserData,
    selectedPositionIdx,
    selectedPoolName,
    selectedIsPut,
  } = useContext(OlpContext);

  const lpPositionSelected = useMemo(() => {
    return olpEpochData?.lpPositions[selectedPositionIdx!];
  }, [olpEpochData, selectedPositionIdx]);

  const [approved, setApproved] = useState<boolean>(false);
  const [strikeTokenPrice, setStrikeTokenPrice] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [userUsdBalance, setUserUsdBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawFillAmount, setRawFillAmount] = useState<string>('0');

  // Parse and update info entered by user
  const fillAmount: number = useMemo(() => {
    return rawFillAmount ? parseFloat(rawFillAmount) : 0;
  }, [rawFillAmount]);

  const strikeTokenName = useMemo(() => {
    if (
      !olpEpochData ||
      selectedPositionIdx === undefined ||
      !selectedPoolName ||
      selectedIsPut === undefined
    )
      return '';
    let name: string = selectedPoolName;
    name += `-${getUserReadableAmount(
      olpEpochData.lpPositions[selectedPositionIdx]?.strike!,
      DEFAULT_STRIKE_DECIMALS
    )}`;
    name += selectedIsPut ? '-P' : '-C';
    return name;
  }, [olpEpochData, selectedPositionIdx, selectedPoolName, selectedIsPut]);

  const usdToPay: number = useMemo(() => {
    if (!olpContract || !olpData || !lpPositionSelected) return 0;
    try {
      // Note that 0 < markup < 100 and to calculate price after markup,
      // we take (100 - markup) / 100
      const pricePerTokenAfterMarkup = strikeTokenPrice
        .mul(
          BigNumber.from(PERCENT).add(
            BigNumber.from(lpPositionSelected?.markup)
          )
        )
        .div(BigNumber.from(PERCENT));

      return fillAmount
        ? getUserReadableAmount(
            pricePerTokenAfterMarkup,
            DEFAULT_USD_DECIMALS
          ) * fillAmount
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
          oneEBigNumber(DEFAULT_TOKEN_DECIMALS)
        );
        setStrikeTokenPrice(price);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [olpContract, olpData, lpPositionSelected]);

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
            getContractReadableAmount(rawFillAmount, DEFAULT_TOKEN_DECIMALS)
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
        const usdFinalAmount: BigNumber = getContractReadableAmount(
          rawFillAmount,
          DEFAULT_USD_DECIMALS
        );
        const usdToken = await ERC20__factory.connect(olpData.usd, signer);
        const allowance: BigNumber = await usdToken.allowance(
          accountAddress,
          olpContract.address
        );
        const balance: BigNumber = await usdToken.balanceOf(accountAddress);

        setApproved(allowance.gte(usdFinalAmount));
        setUserUsdBalance(balance);
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
    else if (usdToPay == 0) return 'Insert an amount';
    else if (
      usdToPay > getUserReadableAmount(userUsdBalance, DEFAULT_USD_DECIMALS)
    )
      return 'Insufficient balance';
    else if (
      fillAmount >
      getUserReadableAmount(
        lpPositionSelected?.numTokensProvided!,
        DEFAULT_TOKEN_DECIMALS
      )
    )
      return 'Insufficient liquidity';
    return 'Fill';
  }, [approved, fillAmount, userUsdBalance, usdToPay, lpPositionSelected]);

  return (
    <Modal
      className="flex items-center justify-center"
      open={open}
      onClose={() => handleClose}
    >
      <FillPositionDialog
        open={open}
        handleClose={handleClose}
        strikeTokenName={strikeTokenName}
        strike={lpPositionSelected?.strike}
        numTokensProvided={lpPositionSelected?.numTokensProvided}
        usdToPay={usdToPay}
        rawDepositAmount={rawFillAmount}
        setRawFillAmount={setRawFillAmount}
        userUsdBalance={userUsdBalance}
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

export default FillPositionRolp;
