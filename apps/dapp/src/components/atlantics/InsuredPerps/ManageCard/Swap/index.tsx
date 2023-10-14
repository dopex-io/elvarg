import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import { ERC20__factory, GmxRouter__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import SwapInfo from 'components/atlantics/InsuredPerps/ManageCard/Swap/SwapInfo';
import Wrapper from 'components/ssov/Wrapper';
import Button from 'components/UI/Button';
import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { CHAINS } from 'constants/chains';
import { MAX_VALUE } from 'constants/index';

interface SwapProps {
  underlying: string;
  stable: string;
}

const Swap = (props: SwapProps) => {
  const { underlying = '', stable = '' } = props;
  const {
    signer,
    accountAddress,
    contractAddresses,
    chainId,
    userAssetBalances,
    tokens,
    tokenPrices,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [path, setPath] = useState<string[]>([]);
  const [inverted, setInverted] = useState<boolean>(false);
  const [wrapOpen, setWrapOpen] = useState(false);
  const [amountIn, setAmountIn] = useState<string>();
  const [amountOut, setAmountOut] = useState<string>();
  const [approved, setApproved] = useState<boolean>(false);

  const prices = useMemo(() => {
    if (!tokenPrices) return;
    const stableIndex = tokens.indexOf(stable);
    const underlyingIndex = tokens.indexOf(underlying);
    return [
      tokenPrices[underlyingIndex]?.price ?? 0,
      tokenPrices[stableIndex]?.price ?? 0,
    ];
  }, [stable, tokenPrices, tokens, underlying]);

  const userTokenBalances = useMemo(() => {
    if (!chainId || !stable || !underlying || !userAssetBalances) return;

    const underlyingBalance = getUserReadableAmount(
      BigNumber.from(userAssetBalances[underlying.toUpperCase() ?? ''] ?? '0'),
      CHAINS[chainId]?.tokenDecimals[underlying?.toUpperCase() ?? ''],
    );

    const stableBalance = getUserReadableAmount(
      BigNumber.from(userAssetBalances[stable.toUpperCase() ?? ''] ?? '0'),
      CHAINS[chainId]?.tokenDecimals[stable?.toUpperCase() ?? ''],
    );

    return [underlyingBalance, stableBalance];
  }, [chainId, stable, underlying, userAssetBalances]);

  const handleChange = useCallback(
    (e: any) => {
      if (!setAmountIn || !prices) return;
      setAmountIn(e.target.value);
      setAmountOut(
        (!inverted
          ? Number(e.target.value) * Number(prices[0])
          : Number(e.target.value) / Number(prices[1])
        ).toString(),
      );
    },
    [inverted, prices],
  );

  const handleMax = useCallback(() => {
    if (!userAssetBalances || !underlying || !chainId || !prices || !stable)
      return;

    const inputTokenSymbol = (
      inverted ? stable : underlying ?? ''
    ).toUpperCase();

    const maxValue = getUserReadableAmount(
      BigNumber.from(userAssetBalances[inputTokenSymbol] ?? '0'),
      CHAINS[chainId]?.tokenDecimals[inputTokenSymbol],
    ).toString();

    setAmountIn(maxValue);

    setAmountOut(
      (inverted
        ? Number(maxValue) / Number(prices[1])
        : Number(maxValue) * Number(prices[0])
      ).toString(),
    );
  }, [userAssetBalances, underlying, chainId, prices, stable, inverted]);

  const handleSubmit = useCallback(async () => {
    if (
      !amountIn ||
      !amountOut ||
      !signer ||
      !contractAddresses ||
      !accountAddress ||
      !path ||
      !path[0] ||
      !chainId
    )
      return;

    const gmxRouter = GmxRouter__factory.connect(
      contractAddresses['GMX-ROUTER'],
      signer,
    );
    const tokenIn = ERC20__factory.connect(path[0], signer);

    const amountInContractReadable = getContractReadableAmount(
      Number(amountIn),
      CHAINS[chainId]?.tokenDecimals[
        (inverted ? stable : underlying).toUpperCase() ?? ''
      ] || 18,
    );
    const _minOut = getContractReadableAmount(1, 6);

    try {
      if (approved)
        await sendTx(gmxRouter, 'swap', [
          path,
          amountInContractReadable,
          _minOut,
          accountAddress,
        ]);
      else await sendTx(tokenIn, 'approve', [gmxRouter.address, MAX_VALUE]);
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    amountIn,
    amountOut,
    approved,
    chainId,
    contractAddresses,
    inverted,
    path,
    sendTx,
    signer,
    stable,
    underlying,
  ]);

  const handleInvert = useCallback(() => {
    const [tokenA, tokenB] = path;

    if (!tokenA || !tokenB || !prices || !prices[0] || !prices[1]) return;

    // swap amountIn/amountOut
    const _newAmountOut = amountIn;
    setAmountIn(amountOut);
    setAmountOut(_newAmountOut);
    setPath([tokenB, tokenA]);

    // swap prices
    const temp = prices[0];
    prices[0] = prices[1];
    prices[1] = temp;

    setInverted(!inverted);
  }, [amountIn, amountOut, inverted, path, prices]);

  useEffect(() => {
    (async () => {
      if (!signer || !contractAddresses || !accountAddress || !path[0]) return;
      const gmxRouter = GmxRouter__factory.connect(
        contractAddresses['GMX-ROUTER'],
        signer,
      );
      const _tokenIn = ERC20__factory.connect(path[0], signer);

      const allowance = await _tokenIn.allowance(
        accountAddress,
        gmxRouter.address,
      );

      setApproved(
        allowance.gte(
          getContractReadableAmount(String(amountIn).substring(0, 15), 18),
        ),
      );
    })();
  }, [accountAddress, amountIn, contractAddresses, inverted, path, signer]);

  useEffect(() => {
    (async () => {
      if (!contractAddresses || !underlying || !stable) return;

      setPath(
        !inverted
          ? [contractAddresses[underlying], contractAddresses[stable]]
          : [contractAddresses[stable], contractAddresses[underlying]],
      );
    })();
  }, [contractAddresses, inverted, stable, underlying]);

  return (
    <Box className="space-y-1">
      <Box
        role="button"
        className="underline ml-auto text-sm pb-2 px-2"
        onClick={() => setWrapOpen(true)}
      >
        Wrap ETH
      </Box>
      <Wrapper open={wrapOpen} handleClose={() => setWrapOpen(false)} />
      <Box className="space-y-1">
        <Box className="bg-umbra rounded-xl">
          <Input
            size="small"
            variant="default"
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={handleChange}
            className="p-3"
            leftElement={
              <Box className="flex my-auto">
                <Box className="flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                  <img
                    src={`/images/tokens/${
                      inverted ? stable.toLowerCase() : underlying.toLowerCase()
                    }.svg`}
                    alt={inverted ? stable : underlying}
                    className="w-8"
                  />
                  <Typography variant="h6" className="my-auto">
                    {inverted ? 'USDC.e' : underlying}
                  </Typography>
                </Box>
                <Box
                  role="button"
                  className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                  onClick={handleMax}
                >
                  <Typography variant="caption" color="stieglitz">
                    MAX
                  </Typography>
                </Box>
              </Box>
            }
          />
          <Box className="flex justify-between pb-3 px-5 pt-0">
            <Typography variant="h6" color="stieglitz">
              Balance:{' '}
              {formatAmount(userTokenBalances?.[inverted ? 1 : 0] ?? 0, 3)}
            </Typography>
          </Box>
        </Box>
        <Box className="relative bg-cod-gray text-center">
          <IconButton
            className="absolute -top-4 bg-umbra p-0 hover:bg-umbra"
            onClick={handleInvert}
          >
            <ArrowDownwardRoundedIcon className="w-7 h-7 rounded-full fill-current text-stieglitz border-4 border-cod-gray" />
          </IconButton>
        </Box>
        <Box className="bg-umbra rounded-xl">
          <Input
            size="small"
            variant="default"
            type="number"
            placeholder="0.0"
            value={amountOut}
            disabled
            sx={{
              '& input.MuiInputBase-input': {
                '-webkit-text-fill-color': '#5D5D5D',
                overflowX: 'true',
                padding: '0',
              },
            }}
            leftElement={
              <Box className="flex my-auto">
                <Box className="flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                  <img
                    src={`/images/tokens/${
                      inverted ? underlying.toLowerCase() : stable.toLowerCase()
                    }.svg`}
                    alt={stable}
                    className="w-8"
                  />
                  <Typography variant="h6" className="my-auto">
                    {inverted ? underlying : 'USDC.e'}
                  </Typography>
                </Box>
              </Box>
            }
          />
          <Box className="flex justify-between pb-3 px-5 pt-0">
            <Typography variant="h6" color="stieglitz">
              Balance:{' '}
              {formatAmount(userTokenBalances?.[inverted ? 0 : 1] ?? 0, 3)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="rounded-lg bg-umbra p-3 space-y-1">
        <SwapInfo
          description="WETH Price"
          value={`$${formatAmount(prices?.[!inverted ? 0 : 1] ?? 0, 3)}`}
        />
        <SwapInfo
          description="USDC.e Price"
          value={`$${formatAmount(prices?.[!inverted ? 1 : 0] ?? 0, 3)}`}
        />
      </Box>
      <Button
        onClick={handleSubmit}
        // disabled={hasSufficientBalance}
        className="w-full"
      >
        {approved ? 'Swap' : 'Approve'}
      </Button>
    </Box>
  );
};

export default Swap;
