import { useCallback, useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { ERC20__factory, GmxRouter__factory } from '@dopex-io/sdk';

import Wrapper from 'components/ssov/Wrapper';
import CustomInput from 'components/UI/CustomInput';
import Typography from 'components/UI/Typography';
import Button from 'components/UI/Button';
import SwapInfo from 'components/atlantics/InsuredPerps/Swap/SwapInfo';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';

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
      userAssetBalances[underlying.toUpperCase() ?? ''] ?? '0',
      TOKEN_DECIMALS[chainId.toString()]?.[underlying?.toUpperCase() ?? '']
    );

    const stableBalance = getUserReadableAmount(
      userAssetBalances[stable.toUpperCase() ?? ''] ?? '0',
      TOKEN_DECIMALS[chainId.toString()]?.[stable?.toUpperCase() ?? '']
    );

    return [underlyingBalance, stableBalance];
  }, [chainId, stable, underlying, userAssetBalances]);

  const updateAmountOut = useCallback(
    (param: number) => {
      if (!tokenPrices || !prices) return;
      setAmountOut(((prices[1] ?? 0) * Number(param)).toString());
    },
    [prices, tokenPrices]
  );

  const handleChange = useCallback(
    (e: any) => {
      if (!setAmountIn || !prices) return;
      setAmountIn(e.target.value);
      updateAmountOut(Number(prices[0]) * Number(e.target.value || 0));
    },
    [prices, updateAmountOut]
  );

  const handleMax = useCallback(() => {
    if (
      !userAssetBalances ||
      !underlying ||
      !chainId ||
      !setAmountIn ||
      !prices
    )
      return;

    const maxValue = getUserReadableAmount(
      userAssetBalances[underlying.toUpperCase()] ?? '0',
      TOKEN_DECIMALS[chainId.toString()]?.[underlying.toUpperCase()]
    ).toString();

    setAmountIn(maxValue);
    updateAmountOut(Number(prices[0]) * Number(amountIn));
  }, [
    userAssetBalances,
    underlying,
    chainId,
    prices,
    updateAmountOut,
    amountIn,
  ]);

  const handleSubmit = useCallback(async () => {
    if (
      !amountIn ||
      !amountOut ||
      !signer ||
      !contractAddresses ||
      !accountAddress ||
      !path ||
      !path[0]
    )
      return;

    const gmxRouter = GmxRouter__factory.connect(
      contractAddresses['GMX-ROUTER'],
      signer
    );
    const tokenIn = ERC20__factory.connect(path[0], signer);

    const amountInContractReadable = getContractReadableAmount(
      Number(amountIn),
      inverted ? 6 : 18
    );
    const _minOut = getContractReadableAmount(1, 6);

    try {
      if (approved)
        await sendTx(
          gmxRouter.swap(
            path,
            amountInContractReadable,
            _minOut,
            accountAddress
          )
        );
      else await sendTx(tokenIn.approve(gmxRouter.address, MAX_VALUE));
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    amountIn,
    amountOut,
    approved,
    contractAddresses,
    inverted,
    path,
    sendTx,
    signer,
  ]);

  const handleInvert = useCallback(() => {
    const [tokenA, tokenB] = path;

    if (!tokenA || !tokenB || !prices || !prices[0] || !prices[1]) return;

    // swap amountIn/amountOut
    const _amountOut = amountIn;
    setAmountIn(amountOut);
    setAmountOut(_amountOut);
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
        signer
      );
      const _tokenIn = ERC20__factory.connect(path[0], signer);

      const allowance = await _tokenIn.allowance(
        accountAddress,
        gmxRouter.address
      );

      setApproved(
        allowance.gte(
          getContractReadableAmount(String(amountIn).substring(0, 15), 18)
        )
      );
    })();
  }, [accountAddress, amountIn, contractAddresses, inverted, path, signer]);

  useEffect(() => {
    (async () => {
      if (!contractAddresses || !underlying || !stable) return;

      setPath(
        !inverted
          ? [contractAddresses[underlying], contractAddresses[stable]]
          : [contractAddresses[stable], contractAddresses[underlying]]
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
          <CustomInput
            size="small"
            variant="outlined"
            outline="umbra"
            value={amountIn}
            onChange={handleChange}
            leftElement={
              <Box className="flex my-auto">
                <Box className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                  <img
                    src={`/images/tokens/${
                      inverted ? stable.toLowerCase() : underlying.toLowerCase()
                    }.svg`}
                    alt={inverted ? stable : underlying}
                    className="w-[2rem]"
                  />
                  <Typography variant="h6" className="my-auto">
                    {inverted ? stable : underlying}
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
            <Box className="flex space-x-1">
              <Typography variant="h6" color="stieglitz">
                &#x2248;
              </Typography>
              <Typography variant="h6">
                ${formatAmount((prices?.[0] ?? 0) * Number(amountIn ?? 0), 3)}
              </Typography>
            </Box>
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
          <CustomInput
            size="small"
            variant="outlined"
            outline="umbra"
            value={amountOut || 0}
            disabled
            sx={{
              '& input.MuiInputBase-input': {
                '-webkit-text-fill-color': '#5D5D5D',
                overflowX: 'true',
              },
            }}
            leftElement={
              <Box className="flex my-auto">
                <Box className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                  <img
                    src={`/images/tokens/${
                      inverted ? underlying.toLowerCase() : stable.toLowerCase()
                    }.svg`}
                    alt={stable}
                    className="w-[2rem]"
                  />
                  <Typography variant="h6" className="my-auto">
                    {inverted ? underlying : stable}
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
            <Box className="flex space-x-1">
              <Typography variant="h6" color="stieglitz">
                &#x2248;
              </Typography>
              <Typography variant="h6">
                ${formatAmount((prices?.[1] ?? 0) * Number(amountOut ?? 0), 3)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="rounded-lg bg-umbra p-3 space-y-1">
        <SwapInfo
          description="WETH Price"
          value={`$${formatAmount(prices?.[!inverted ? 0 : 1] ?? 0, 3)}`}
        />
        <SwapInfo
          description="USDC Price"
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
