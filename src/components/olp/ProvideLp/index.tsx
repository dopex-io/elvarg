import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import { SelectChangeEvent } from '@mui/material/Select';
import useSendTx from 'hooks/useSendTx';
import { OlpContext } from 'contexts/Olp';
import { WalletContext } from 'contexts/Wallet';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import {
  DEFAULT_STRIKE_DECIMALS,
  DEFAULT_USD_DECIMALS,
  MAX_VALUE,
} from 'constants/index';
import DepositPanel from './DepositPanel';

// For Goerli test net
const CHAIN_ID: number = 5;

const ProvideLp = () => {
  const sendTx = useSendTx();
  const { accountAddress, signer } = useContext(WalletContext);
  const {
    olpContract,
    olpData,
    olpEpochData,
    selectedIsPut,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedIsPut,
    setSelectedEpoch,
  } = useContext(OlpContext);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawDepositAmount, setRawDepositAmount] = useState<string>('0');
  const [rawDiscountAmount, setRawDiscountAmount] = useState<string>('0');
  const [approved, setApproved] = useState<boolean>(false);
  const [strikeIdx, setStrikeIdx] = useState<number>(0);

  // Parse and update info entered by user
  const depositAmount: number = useMemo(() => {
    return parseFloat(rawDepositAmount);
  }, [rawDepositAmount]);
  const discountAmount: number = useMemo(() => {
    return parseFloat(rawDiscountAmount);
  }, [rawDiscountAmount]);
  const getReadableStrikes: string[] = useMemo(() => {
    return olpEpochData!.strikes!.map((strike) =>
      getUserReadableAmount(strike, DEFAULT_STRIKE_DECIMALS).toString()
    );
  }, [olpEpochData]);
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
      // 184351787044251203
      // 3586916382
      await sendTx(
        olpContract
          .connect(signer)
          .addToLp(
            olpData.underlying,
            selectedIsPut,
            olpEpochData.strikes[strikeIdx]!,
            getContractReadableAmount(depositAmount, DEFAULT_USD_DECIMALS),
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
          DEFAULT_USD_DECIMALS
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

  // Message to display during deposit
  const depositButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (depositAmount == 0) return 'Insert an amount';
    else if (
      depositAmount >
      getUserReadableAmount(userTokenBalance, DEFAULT_USD_DECIMALS)
    )
      return 'Insufficient balance';
    else if (discountAmount < 0 || discountAmount >= 100)
      return 'Invalid discount amount';
    return 'Provide LP';
  }, [approved, depositAmount, discountAmount, userTokenBalance]);

  return (
    <DepositPanel
      key={ProvideLp}
      strikeIdx={strikeIdx}
      handleSelectStrike={handleSelectStrike}
      strikes={getReadableStrikes}
      rawDiscountAmount={rawDiscountAmount}
      setRawDiscountAmount={setRawDiscountAmount}
      rawDepositAmount={rawDepositAmount}
      setRawDepositAmount={setRawDepositAmount}
      userTokenBalance={userTokenBalance}
      expiry={olpData!.expiry}
      chainId={CHAIN_ID}
      approved={approved}
      depositAmount={depositAmount}
      handleApprove={handleApprove}
      handleDeposit={handleDeposit}
      depositButtonMessage={depositButtonMessage}
      setSelectedEpoch={setSelectedEpoch}
      selectedIsPut={selectedIsPut}
      setSelectedIsPut={setSelectedIsPut}
      updateOlpEpochData={updateOlpEpochData}
    />
  );
};

export default ProvideLp;
