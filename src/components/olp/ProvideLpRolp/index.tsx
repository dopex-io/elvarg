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
import { OlpContext } from 'contexts/Rolp';
import { WalletContext } from 'contexts/Wallet';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import {
  DEFAULT_STRIKE_DECIMALS,
  DEFAULT_TOKEN_DECIMALS,
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
    selectedPoolName,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedIsPut,
    setSelectedEpoch,
  } = useContext(OlpContext);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rawDepositAmount, setRawDepositAmount] = useState<string>('0');
  const [rawMarkupAmount, setRawMarkupAmount] = useState<string>('0');
  const [approved, setApproved] = useState<boolean>(false);
  const [strikeIdx, setStrikeIdx] = useState<number>(0);

  // Parse and update info entered by user
  const depositAmount: number = useMemo(() => {
    return parseFloat(rawDepositAmount);
  }, [rawDepositAmount]);
  const markupAmount: number = useMemo(() => {
    return parseFloat(rawMarkupAmount);
  }, [rawMarkupAmount]);
  const getReadableStrikes: string[] = useMemo(() => {
    return olpEpochData!.strikes!.map((strike) =>
      getUserReadableAmount(strike, DEFAULT_STRIKE_DECIMALS).toString()
    );
  }, [olpEpochData]);
  const handleSelectStrike = useCallback((e: SelectChangeEvent<number>) => {
    setStrikeIdx(Number(e.target.value));
  }, []);

  // Token selected info
  const selectedStrikeToken = useMemo(() => {
    return !olpEpochData?.strikeTokens || strikeIdx === undefined
      ? ''
      : olpEpochData?.strikeTokens[strikeIdx];
  }, [olpEpochData, strikeIdx]);
  const strikeTokenName = useMemo(() => {
    if (
      !olpEpochData ||
      strikeIdx === undefined ||
      !selectedPoolName ||
      selectedIsPut === undefined
    )
      return '';
    let name: string = selectedPoolName;
    name += `-${getUserReadableAmount(
      olpEpochData.strikes[strikeIdx]!,
      DEFAULT_STRIKE_DECIMALS
    )}`;
    name += selectedIsPut ? '-P' : '-C';
    return name;
  }, [olpEpochData, strikeIdx, selectedPoolName, selectedIsPut]);
  const selectedStrikeTokenPrice = useMemo(() => {
    return !olpEpochData?.strikeTokenPrices || strikeIdx === undefined
      ? ''
      : olpEpochData?.strikeTokenPrices[strikeIdx];
  }, [olpEpochData, strikeIdx]);

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (!signer || !olpContract?.address || !selectedStrikeToken) return;
    try {
      await sendTx(
        ERC20__factory.connect(selectedStrikeToken, signer).approve(
          olpContract.address,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, olpContract, selectedStrikeToken]);

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
            getContractReadableAmount(depositAmount, DEFAULT_TOKEN_DECIMALS),
            markupAmount,
            accountAddress
          )
      );

      setRawDepositAmount('0');
      setRawMarkupAmount('0');

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
    markupAmount,
    updateOlpEpochData,
    updateOlpUserData,
  ]);

  // Update approved state
  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !accountAddress ||
        !olpContract?.address ||
        !selectedStrikeToken
      )
        return;
      try {
        const finalAmount = getContractReadableAmount(
          rawDepositAmount,
          DEFAULT_TOKEN_DECIMALS
        );
        const optionToken = await ERC20__factory.connect(
          selectedStrikeToken,
          signer
        );
        const allowance = await optionToken.allowance(
          accountAddress,
          olpContract.address
        );
        const balance = await optionToken.balanceOf(accountAddress);

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
    selectedStrikeToken,
    rawDepositAmount,
  ]);

  // Message to display during deposit
  const depositButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (depositAmount == 0) return 'Insert an amount';
    else if (
      depositAmount >
      getUserReadableAmount(userTokenBalance, DEFAULT_TOKEN_DECIMALS)
    )
      return 'Insufficient balance';
    else if (markupAmount < 0 || markupAmount >= 100)
      return 'Invalid discount amount';
    return 'Provide LP';
  }, [approved, depositAmount, markupAmount, userTokenBalance]);

  return (
    <DepositPanel
      key={ProvideLp}
      strikeIdx={strikeIdx}
      handleSelectStrike={handleSelectStrike}
      strikes={getReadableStrikes}
      rawMarkupAmount={rawMarkupAmount}
      setRawMarkupAmount={setRawMarkupAmount}
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
      selectedPoolName={selectedPoolName}
      strikeTokenName={strikeTokenName}
      selectedStrikeTokenPrice={selectedStrikeTokenPrice}
    />
  );
};

export default ProvideLp;
