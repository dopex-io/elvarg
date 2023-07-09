import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils as ethersUtils, utils } from 'ethers';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ERC20__factory, SsovV3Viewer__factory } from '@dopex-io/sdk';
import format from 'date-fns/format';
import useSendTx from 'hooks/useSendTx';
import LockerIcon from 'svgs/icons/LockerIcon';
import { useDebounce } from 'use-debounce';

import { useBoundStore } from 'store';
import { SsovV3EpochData } from 'store/Vault/ssov';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import InputWithTokenSelector from 'components/common/InputWithTokenSelector';
import Wrapper from 'components/ssov/Wrapper';
import CustomButton from 'components/UI/Button';

import { defaultQuoteData, get1inchQuote, get1inchSwap } from 'utils/1inch';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { getTokenDecimals } from 'utils/general';
import formatAmount from 'utils/general/formatAmount';
import isNativeToken from 'utils/general/isNativeToken';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const DepositPanel = () => {
  const { accountAddress, chainId, signer, selectedEpoch, getContractAddress } =
    useBoundStore();

  const sendTx = useSendTx();

  const [wrapOpen, setWrapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(defaultQuoteData);
  const [debouncedQuote] = useDebounce(quote, 1000);
  const [strikeDepositAmount, setStrikeDepositAmount] = useState<string>('0');
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const [isTokenSelectorOpen, setTokenSelectorOpen] = useState(false);
  const [fromTokenSymbol, setFromTokenSymbol] = ['USDC'];

  const [approved, setApproved] = useState<boolean>(false);
  const [strike, setStrike] = useState(0);

  const routerMode = true;

  const spender = '';

  const strikes = [1500];

  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrike(Number(event.target.value));
  }, []);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) => {
      setStrikeDepositAmount(e.target.value);
    },
    []
  );

  const hasExpiryElapsed = useMemo(() => {
    return false;
  }, []);

  const handleApprove = useCallback(async () => {}, [
    signer,
    spender,
    sendTx,
    getContractAddress,
    fromTokenSymbol,
    strikeDepositAmount,
  ]);

  const handleStake = useCallback(async () => {}, [
    signer,
    accountAddress,
    sendTx,
  ]);

  const updateUserTokenBalance = useCallback(async () => {
    if (!accountAddress || !signer) return;

    const tokenAddress = getContractAddress(fromTokenSymbol);

    if (!tokenAddress) return;

    setUserTokenBalance(
      await ERC20__factory.connect(tokenAddress, signer).balanceOf(
        accountAddress
      )
    );
  }, [accountAddress, fromTokenSymbol, getContractAddress, signer]);

  const depositButtonProps = useMemo(() => {
    let disable = false;
    let text = 'Deposit';
    let color = 'primary';
    let error = false;

    if (isNaN(parseFloat(strikeDepositAmount))) {
      error = true;
      disable = true;
      text = 'Not a valid amount';
      color = 'mineshaft';
    } else if (Number(strikeDepositAmount) === 0) {
      disable = true;
      text = 'Insert an amount';
      color = 'mineshaft';
    } else if (hasExpiryElapsed) {
      disable = true;
      text = 'Pool expired';
      color = 'mineshaft';
    } else if (
      Number(strikeDepositAmount) >
      getUserReadableAmount(
        userTokenBalance,
        getTokenDecimals(fromTokenSymbol, chainId)
      )
    ) {
      disable = true;
      text = 'Insufficient Balance';
      color = 'mineshaft';
    } else if (!approved) {
      disable = false;
      text = 'Approve';
      color = 'primary';
    }

    return {
      disable,
      text,
      color,
      error,
    };
  }, [
    approved,
    chainId,
    fromTokenSymbol,
    strikeDepositAmount,
    userTokenBalance,
    hasExpiryElapsed,
  ]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {}, [
    handleStake,
    updateUserTokenBalance,
    getContractAddress,
    sendTx,
    routerMode,
    accountAddress,
    strike,
    strikeDepositAmount,
    fromTokenSymbol,
    chainId,
    depositButtonProps.disable,
    loading,
  ]);

  const handleMax = useCallback(() => {
    setStrikeDepositAmount(ethersUtils.formatEther(userTokenBalance));
  }, [userTokenBalance]);

  const checkApproved = useCallback(async () => {
    if (!signer || !accountAddress || !spender || !chainId || !fromTokenSymbol)
      return;

    if (depositButtonProps.error) return;

    if (!isNativeToken(fromTokenSymbol)) {
      const tokenAddress = getContractAddress(fromTokenSymbol);

      if (!tokenAddress) return;

      const allowance: BigNumber = await ERC20__factory.connect(
        tokenAddress,
        signer
      ).allowance(accountAddress, spender);

      setApproved(allowance.gte(ethersUtils.parseEther(strikeDepositAmount)));
    } else {
      setApproved(true);
    }
  }, [
    accountAddress,
    chainId,
    fromTokenSymbol,
    getContractAddress,
    signer,
    spender,
    strikeDepositAmount,
    depositButtonProps,
  ]);

  // Updates approved state
  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  // Updates user token balance
  useEffect(() => {
    updateUserTokenBalance();
  }, [updateUserTokenBalance]);

  const updateQuote = useCallback(async () => {}, [
    getContractAddress,
    accountAddress,
    strikeDepositAmount,
    chainId,
    fromTokenSymbol,
  ]);

  const collateralCTA = useMemo(() => {
    if (true) {
      return (
        <Box role="button" className="underline ml-auto mt-1" onClick={null}>
          <h6 className="text-stieglitz">Use 2CRV</h6>
        </Box>
      );
    } else if (false) {
      return (
        <Box
          role="button"
          className="underline ml-auto mt-1 text-sm"
          onClick={() => setWrapOpen(true)}
        >
          Wrap ETH
        </Box>
      );
    } else if (false) {
      return (
        <a
          href="https://app.1inch.io/#/42161/unified/swap/ETH/wstETH"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto mt-1"
        >
          <Box role="button" className="underline">
            <h6 className="text-stieglitz">Get wstETH</h6>
          </Box>
        </a>
      );
    }
    return <React.Fragment />;
  }, []);

  return (
    <div className="bg-cod-gray rounded-xl w-full md:w-[400px] h-full">
      <div>
        <InputWithTokenSelector
          topRightTag="Deposit Amount"
          topLeftTag="Deposit With"
          selectedTokenSymbol={fromTokenSymbol}
          setSelectedToken={setFromTokenSymbol}
          handleMax={handleMax}
          inputAmount={strikeDepositAmount}
          userTokenBalance={userTokenBalance}
          handleInputAmountChange={handleDepositAmount}
          overrides={{ setTokenSelectorOpen }}
        />
      </div>
      <CustomButton
        size="medium"
        className="w-full mt-4 mb-6 !rounded-md"
        color={'primary'}
      >
        Purchase
      </CustomButton>

      <div className="mt-4 rounded-2xl">
        <div className="flex flex-col mt-3 mb-4 p-4 w-full">
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem] font-bold">
              Reserves
            </h6>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              wstETH
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                1,000 wstETH
              </h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">wETH</h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">
                9,000 wETH
              </h6>
            </div>
          </div>
        </div>
        <div className="flex flex-col mb-4 p-4 w-full">
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem] font-bold">
              Details
            </h6>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Epoch duration
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">3 days</h6>
            </div>
          </div>
          <div className={'flex mb-2'}>
            <h6 className="text-stieglitz ml-0 mr-auto text-[0.8rem]">
              Current strike
            </h6>
            <div className={'text-right'}>
              <h6 className="text-white mr-auto ml-0 text-[0.8rem]">0.99</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPanel;
