import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ERC20__factory } from '@dopex-io/sdk';
import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDebounce } from 'use-debounce';

import { useBoundStore } from 'store';
import { SsovV3EpochData } from 'store/Vault/ssov';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import Wrapper from 'components/ssov/Wrapper';
import InputWithTokenSelector from 'components/common/InputWithTokenSelector';

import LockerIcon from 'svgs/icons/LockerIcon';

import useSendTx from 'hooks/useSendTx';

import formatAmount from 'utils/general/formatAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { MAX_VALUE } from 'constants/index';

import get1inchQuote, { defaultQuoteData } from 'utils/general/get1inchQuote';
import get1inchSwap from 'utils/general/get1inchSwap';

import { getTokenDecimals } from 'utils/general';
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
    updateAssetBalances,
    updateSsovV3EpochData: updateSsovEpochData,
    updateSsovV3UserData: updateSsovUserData,
    ssovData,
    ssovEpochData,
    ssovSigner,
    selectedEpoch,
    contractAddresses,
    userAssetBalances,
    getContractAddress,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [wrapOpen, setWrapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState({
    quoteData: defaultQuoteData,
    swapData: '',
  });

  const [debouncedQuote] = useDebounce(quote, 1000);

  const [strikeDepositAmount, setStrikeDepositAmount] = useState<
    number | string
  >(0);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const [fromTokenSymbol, setFromTokenSymbol] = useState(
    ssovData?.collateralSymbol ?? ''
  );

  const [isTokenSelectorOpen, setTokenSelectorOpen] = useState(false);

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

  const strikes = epochStrikes.map((strike: string | number | BigNumber) =>
    getUserReadableAmount(strike, 8).toString()
  );

  const handleSelectStrike = useCallback((event: SelectChangeEvent<number>) => {
    setStrike(Number(event.target.value));
  }, []);

  const handleDepositAmount = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
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
        ERC20__factory.connect(contractAddresses[fromTokenSymbol], signer),
        'approve',
        [spender, MAX_VALUE]
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, spender, ssovData, fromTokenSymbol, contractAddresses]);

  // Handle Deposit
  const handleDeposit = useCallback(async () => {
    if (
      !ssovContractWithSigner ||
      !accountAddress ||
      !ssovData ||
      !ssovData.collateralSymbol ||
      !ssovSigner.ssovContractWithSigner ||
      !ssovSigner.ssovRouterWithSigner ||
      !chainId
    )
      return;
    const depositAmount = getContractReadableAmount(
      strikeDepositAmount,
      getTokenDecimals(fromTokenSymbol, chainId)
    );

    const toTokenAddress = ssovData.isPut
      ? fromTokenSymbol === 'USDC'
        ? getContractAddress('USDT')
        : getContractAddress('USDC')
      : ssovData.collateralAddress;

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
          debouncedQuote.quoteData.toTokenAmount,
          debouncedQuote.swapData,
        ]
      : [strike, depositAmount, accountAddress];
    const contractWithSigner = routerMode
      ? ssovSigner.ssovRouterWithSigner
      : ssovSigner.ssovContractWithSigner;

    isNativeToken(fromTokenSymbol)
      ? params.push({
          value: getContractReadableAmount(strikeDepositAmount, 18),
        })
      : 0;

    const method = routerMode ? 'swapAndDeposit' : ('deposit' as any);

    try {
      await sendTx(contractWithSigner, method, params).then(() => {
        setStrikeDepositAmount(0);
        updateAssetBalances();
        updateSsovEpochData();
        updateSsovUserData();
      });
    } catch (err) {
      console.log(err);
    }
  }, [
    getContractAddress,
    sendTx,
    routerMode,
    accountAddress,
    ssovContractWithSigner,
    strike,
    strikeDepositAmount,
    updateAssetBalances,
    updateSsovEpochData,
    updateSsovUserData,
    fromTokenSymbol,
    ssovData,
    ssovSigner.ssovContractWithSigner,
    ssovSigner.ssovRouterWithSigner,
    debouncedQuote.quoteData.toTokenAmount,
    debouncedQuote.swapData,
    chainId,
  ]);

  const handleMax = useCallback(() => {
    setStrikeDepositAmount(userTokenBalance.toString());
  }, [userTokenBalance]);

  const checkApproved = useCallback(async () => {
    if (!signer || !accountAddress || !spender || !chainId || !fromTokenSymbol)
      return;

    if (!isNativeToken(fromTokenSymbol)) {
      const finalAmount: BigNumber = getContractReadableAmount(
        strikeDepositAmount.toString(),
        getTokenDecimals(fromTokenSymbol, chainId)
      );
      const allowance: BigNumber = await ERC20__factory.connect(
        getContractAddress(fromTokenSymbol),
        signer
      ).allowance(accountAddress, spender);

      setApproved(allowance.gte(finalAmount));
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
  ]);

  const depositButtonProps = useMemo(() => {
    let disable = false;
    let text = 'Deposit';
    let color = 'primary';

    if (Number(strikeDepositAmount) === 0) {
      disable = true;
      text = 'Insert an amount';
      color = 'mineshaft';
    }

    if (!approved) {
      disable = false;
      text = 'Approve';
      color = 'primary';
    }
    if (
      strikeDepositAmount >
      getUserReadableAmount(
        userTokenBalance,
        getTokenDecimals(fromTokenSymbol, chainId)
      )
    ) {
      disable = true;
      text = 'Insufficient Balance';
      color = 'mineshaft';
    }

    if (hasExpiryElapsed) {
      disable = true;
      text = 'Pool expired';
      color = 'mineshaft';
    }

    return {
      disable,
      text,
      color,
    };
  }, [
    approved,
    chainId,
    fromTokenSymbol,
    strikeDepositAmount,
    userTokenBalance,
    hasExpiryElapsed,
  ]);

  // Updates approved state
  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  // Updates user token balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer) return;
      setUserTokenBalance(
        await ERC20__factory.connect(
          getContractAddress(fromTokenSymbol),
          signer
        ).balanceOf(accountAddress)
      );
    })();
  }, [
    accountAddress,
    signer,
    ssovData,
    userAssetBalances,
    getContractAddress,
    fromTokenSymbol,
  ]);

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

    const [
      quoteData,
      {
        tx: { data },
      },
    ] = await Promise.all([
      get1inchQuote(
        fromTokenAddress,
        toTokenAddress,
        getContractReadableAmount(
          strikeDepositAmount,
          getTokenDecimals(fromTokenSymbol, chainId)
        ).toString(),
        chainId,
        accountAddress,
        '3'
      ),
      get1inchSwap({
        fromTokenAddress,
        toTokenAddress,
        amount: getContractReadableAmount(
          strikeDepositAmount,
          getTokenDecimals(fromTokenSymbol, chainId)
        ),
        chainId,
        accountAddress: ssovSigner.ssovRouterWithSigner.address,
      }),
    ]);
    setQuote({
      quoteData: quoteData,
      swapData: data,
    });
    setLoading(false);
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
          handleInputAmountChange={handleDepositAmount}
          overrides={{ setTokenSelectorOpen }}
        />
      </Box>
      {!isTokenSelectorOpen && (
        <Box>
          <Box className="rounded-lg p-3 pt-2.5 pb-0 border border-neutral-800 w-full">
            <Box className="mt-2 flex">
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
                          debouncedQuote.quoteData.toTokenAmount,
                          debouncedQuote.quoteData.toToken.decimals
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
