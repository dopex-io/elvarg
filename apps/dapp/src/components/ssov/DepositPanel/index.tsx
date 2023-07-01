import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber, utils as ethersUtils } from 'ethers';

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
import Typography from 'components/UI/Typography';

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
  const {
    accountAddress,
    chainId,
    signer,
    updateSsovV3EpochData: updateSsovEpochData,
    updateSsovV3UserData: updateSsovUserData,
    ssovData,
    ssovEpochData,
    ssovSigner,
    selectedEpoch,
    getContractAddress,
    getSsovViewerAddress,
  } = useBoundStore();

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
  const [fromTokenSymbol, setFromTokenSymbol] = useState(
    ssovData?.collateralSymbol ?? ''
  );

  const { ssovContractWithSigner } = ssovSigner;

  const { epochTimes, epochStrikes } = ssovEpochData as SsovV3EpochData;

  const [approved, setApproved] = useState<boolean>(false);
  const [strike, setStrike] = useState(0);

  const routerMode = useMemo(() => {
    return fromTokenSymbol !== ssovData?.collateralSymbol;
  }, [fromTokenSymbol, ssovData]);

  const spender = useMemo(() => {
    return routerMode
      ? ssovSigner?.ssovRouterWithSigner?.address
      : ssovSigner?.ssovContractWithSigner?.address;
  }, [
    routerMode,
    ssovSigner?.ssovRouterWithSigner?.address,
    ssovSigner?.ssovContractWithSigner?.address,
  ]);

  const strikes = epochStrikes.map((strike: BigNumber) =>
    getUserReadableAmount(strike, 8).toString()
  );

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
    const expiry = epochTimes[1]?.toNumber();
    if (!expiry) return true;
    return expiry < Math.ceil(Number(new Date()) / 1000);
  }, [epochTimes]);

  const handleApprove = useCallback(async () => {
    if (!ssovData?.collateralAddress || !signer || !spender) return;
    try {
      await sendTx(
        ERC20__factory.connect(getContractAddress(fromTokenSymbol), signer),
        'approve',
        [spender, ethersUtils.parseEther(strikeDepositAmount)]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [
    ssovData,
    signer,
    spender,
    sendTx,
    getContractAddress,
    fromTokenSymbol,
    strikeDepositAmount,
  ]);

  const handleStake = useCallback(async () => {
    if (!signer || !accountAddress || !ssovSigner) {
      return;
    }

    const { ssovContractWithSigner, ssovStakingRewardsWithSigner } = ssovSigner;

    if (!ssovContractWithSigner || !ssovStakingRewardsWithSigner) return;

    const positions = await SsovV3Viewer__factory.connect(
      getSsovViewerAddress(),
      signer
    ).walletOfOwner(accountAddress, ssovContractWithSigner.address);
    try {
      await sendTx(ssovStakingRewardsWithSigner, 'stake', [
        ssovContractWithSigner.address,
        positions[positions.length - 1],
      ]);
    } catch (err) {
      console.log(err);
    }
  }, [ssovSigner, signer, getSsovViewerAddress, accountAddress, sendTx]);

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
  const handleDeposit = useCallback(async () => {
    if (
      !ssovContractWithSigner ||
      !accountAddress ||
      !ssovData ||
      !ssovData.collateralSymbol ||
      !ssovSigner.ssovContractWithSigner ||
      !(chainId === 137 || ssovSigner.ssovRouterWithSigner) ||
      !chainId ||
      loading ||
      depositButtonProps.disable
    )
      return;

    const toTokenAddress = ssovData.isPut
      ? fromTokenSymbol === 'USDC'
        ? getContractAddress('USDT')
        : getContractAddress('USDC')
      : ssovData.collateralAddress;

    const fromTokenAddress = getContractAddress(fromTokenSymbol);
    let swapData;

    const depositAmount = ethersUtils.parseEther(strikeDepositAmount);

    if (routerMode) {
      swapData = await get1inchSwap({
        fromTokenAddress,
        toTokenAddress,
        amount: depositAmount,
        chainId,
        accountAddress: ssovSigner.ssovRouterWithSigner?.address!,
      });
    }

    const params = routerMode
      ? [
          ssovSigner.ssovContractWithSigner.address,
          isNativeToken(fromTokenSymbol)
            ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
            : getContractAddress(fromTokenSymbol),
          toTokenAddress,
          accountAddress,
          strike,
          depositAmount,
          swapData.toTokenAmount,
          swapData.tx.data,
        ]
      : [strike, depositAmount, accountAddress];
    const contractWithSigner = routerMode
      ? ssovSigner.ssovRouterWithSigner
      : ssovSigner.ssovContractWithSigner;

    if (!contractWithSigner) return;

    isNativeToken(fromTokenSymbol)
      ? params.push({
          value: depositAmount,
        })
      : 0;

    const method = routerMode ? 'swapAndDeposit' : ('deposit' as any);

    try {
      await sendTx(contractWithSigner, method, params)
        .then(async () => await handleStake())
        .then(() => {
          setStrikeDepositAmount('0');
          updateUserTokenBalance();
          updateSsovEpochData();
          updateSsovUserData();
        });
    } catch (err) {
      console.log(err);
    }
  }, [
    handleStake,
    updateUserTokenBalance,
    getContractAddress,
    sendTx,
    routerMode,
    accountAddress,
    ssovContractWithSigner,
    strike,
    strikeDepositAmount,
    updateSsovEpochData,
    updateSsovUserData,
    fromTokenSymbol,
    ssovData,
    ssovSigner.ssovContractWithSigner,
    ssovSigner.ssovRouterWithSigner,
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

  // @todo remove this useEffect once router is enabled
  useEffect(() => {
    if (!ssovData || !ssovData.collateralSymbol) return;
    setFromTokenSymbol(ssovData.collateralSymbol);
  }, [ssovData]);

  const updateQuote = useCallback(async () => {
    if (!ssovData || fromTokenSymbol === ssovData?.collateralSymbol) return;

    const fromTokenAddress = getContractAddress(fromTokenSymbol);

    const toTokenAddress = ssovData.isPut
      ? fromTokenSymbol === 'USDC'
        ? getContractAddress('USDT')
        : getContractAddress('USDC')
      : ssovData.collateralAddress;

    if (
      !chainId ||
      !accountAddress ||
      !strikeDepositAmount ||
      fromTokenAddress === toTokenAddress ||
      !ssovSigner.ssovRouterWithSigner
    )
      return;
    setLoading(true);

    await get1inchQuote(
      fromTokenAddress,
      toTokenAddress,
      ethersUtils.parseEther(strikeDepositAmount).toString(),
      chainId,
      accountAddress,
      '3'
    ).then((res) => {
      setQuote(res);
      setLoading(false);
      return res;
    });
  }, [
    getContractAddress,
    accountAddress,
    strikeDepositAmount,
    chainId,
    fromTokenSymbol,
    ssovData,
    ssovSigner,
  ]);

  useEffect(() => {
    updateQuote();
  }, [updateQuote]);

  const collateralCTA = useMemo(() => {
    if (ssovData?.isPut) {
      return (
        <Box
          role="button"
          className="underline ml-auto mt-1"
          onClick={() => setFromTokenSymbol(ssovData.collateralSymbol!)}
        >
          <Typography variant="h6" className="text-stieglitz">
            Use 2CRV
          </Typography>
        </Box>
      );
    } else if (ssovData?.collateralSymbol === 'WETH') {
      return (
        <Box
          role="button"
          className="underline ml-auto mt-1 text-sm"
          onClick={() => setWrapOpen(true)}
        >
          Wrap ETH
        </Box>
      );
    } else if (ssovData?.collateralSymbol === 'wstETH') {
      return (
        <a
          href="https://app.1inch.io/#/42161/unified/swap/ETH/wstETH"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto mt-1"
        >
          <Box role="button" className="underline">
            <Typography variant="h6" className="text-stieglitz">
              Get wstETH
            </Typography>
          </Box>
        </a>
      );
    }
    return <React.Fragment />;
  }, [ssovData]);

  return (
    <Box className="bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 w-full md:w-[400px] h-full">
      <Box className="flex mb-3">
        <Typography variant="h3" className="text-stieglitz">
          Deposit
        </Typography>
        {collateralCTA}
        <Wrapper open={wrapOpen} handleClose={() => setWrapOpen(false)} />
      </Box>
      <Box>
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
      </Box>
      {!isTokenSelectorOpen && (
        <Box>
          <Box className="rounded-lg p-0 mt-4 border border-neutral-800 w-full">
            <Box className="flex">
              <Box className={'w-full'}>
                <Select
                  className="bg-mineshaft hover:bg-mineshaft hover:opacity-80 rounded-md px-2 text-white"
                  fullWidth
                  value={strike}
                  onChange={handleSelectStrike}
                  input={<Input />}
                  variant="outlined"
                  placeholder="Select Strike Prices"
                  MenuProps={SelectMenuProps}
                  classes={{
                    icon: 'absolute right-7 text-white',
                    select: 'overflow-hidden',
                  }}
                  disableUnderline
                  label="strikes"
                >
                  {strikes.map((strike: string, index: number) => (
                    <MenuItem key={index} value={index} className="pb-2 pt-2">
                      <Typography
                        variant="h5"
                        className="text-white text-left w-full relative ml-3"
                      >
                        ${formatAmount(strike, 4)}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
          <Box className="mt-3.5">
            <Box className="rounded-xl flex flex-col mb-0 p-3 border border-neutral-800 w-full">
              <Box className={'flex mb-1'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Epoch
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {selectedEpoch}
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mb-1'}>
                <Typography
                  variant="h6"
                  className="text-stieglitz ml-0 mr-auto"
                >
                  Withdrawable
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    {epochTimes[1]
                      ? format(
                          new Date(epochTimes[1].toNumber() * 1000),
                          'd LLL yyyy'
                        )
                      : '-'}
                  </Typography>
                </Box>
              </Box>
              {fromTokenSymbol !== ssovData?.collateralSymbol && (
                <Box className={'flex mb-1'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    Deposit amount
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {formatAmount(
                        getUserReadableAmount(
                          BigNumber.from(debouncedQuote.toTokenAmount),
                          debouncedQuote.toToken.decimals
                        ),
                        3
                      )}{' '}
                      {ssovData?.collateralSymbol}~
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box className="rounded-xl p-4 border border-neutral-800 w-full bg-umbra mt-4">
            <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800">
              <EstimatedGasCostButton gas={500000} chainId={chainId} />
            </Box>
            <Box className="flex">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <LockerIcon />
              </Box>
              <Typography variant="h6" className="text-stieglitz">
                Withdrawals are locked until end of Epoch{' '}
                {ssovData?.currentEpoch || 0}{' '}
                <span className="text-white">
                  ({' '}
                  {epochTimes[1]
                    ? format(
                        new Date(epochTimes[1].toNumber() * 1000),
                        'd MMM yyyy HH:mm'
                      )
                    : '-'}
                  )
                </span>
              </Typography>
            </Box>
            <CustomButton
              size="medium"
              className="w-full mt-4 !rounded-md"
              color={depositButtonProps.color}
              disabled={depositButtonProps.disable || loading}
              onClick={approved ? handleDeposit : handleApprove}
            >
              {loading ? (
                <CircularProgress className="text-white p-3" />
              ) : (
                depositButtonProps.text
              )}
            </CustomButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DepositPanel;
