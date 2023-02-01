import { Box, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBoundStore } from 'store';
import { getTokenDecimals } from 'utils/general';

import get1inchQuote, {
  defaultQuoteData,
  I1inchQuote,
} from 'utils/general/get1inchQuote';

import { ZERO_ADDRESS } from 'constants/index';
import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';

interface IProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  amount: string;
}

interface IDisplayInfo {
  fromTokenAddress: string;
  toTokenAddress: string;
  amountIn: number;
  amountOut: number;
  route: { fromTokenAddress: string; name: string }[];
}

const OneinchSwapDetails = (props: IProps) => {
  const { fromTokenSymbol, toTokenSymbol, amount } = props;

  const { accountAddress, chainId, contractAddresses } = useBoundStore();

  const [slippage, setSlippage] = useState<number>(0.3);

  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<I1inchQuote>(defaultQuoteData);

  const displayInfo = useMemo(() => {
    let _displayInfo: IDisplayInfo = {
      fromTokenAddress: ZERO_ADDRESS,
      toTokenAddress: ZERO_ADDRESS,
      amountIn: 0,
      amountOut: 0,
      route: [],
    };

    if (quote.toTokenAmount !== defaultQuoteData.toTokenAmount)
      _displayInfo.amountOut = getUserReadableAmount(
        quote.toTokenAmount,
        getTokenDecimals(toTokenSymbol, chainId)
      );

    if (quote.protocols[0] && quote.protocols !== defaultQuoteData.protocols) {
      quote.protocols[0].map((protocol) => {
        _displayInfo.route.push({
          fromTokenAddress: protocol.fromTokenAddress,
          name: protocol.name,
        });
      });
    }

    const fromTokenAddress = contractAddresses[fromTokenSymbol];
    const toTokenAddress = contractAddresses[toTokenSymbol];

    if (fromTokenAddress) {
      _displayInfo.fromTokenAddress = fromTokenAddress;
    }

    if (toTokenAddress) {
      _displayInfo.toTokenAddress = toTokenAddress;
    }

    return _displayInfo;
  }, [
    chainId,
    contractAddresses,
    fromTokenSymbol,
    quote.protocols,
    quote.toTokenAmount,
    toTokenSymbol,
  ]);

  const updateQuote = useCallback(async () => {
    const { fromTokenAddress, toTokenAddress } = displayInfo;

    if (
      displayInfo.fromTokenAddress === ZERO_ADDRESS ||
      displayInfo.toTokenAddress === ZERO_ADDRESS ||
      !chainId ||
      !accountAddress ||
      !amount
    )
      return;

    const _quote = await get1inchQuote(
      fromTokenAddress,
      toTokenAddress,
      getContractReadableAmount(
        Number(amount).toFixed(0),
        getTokenDecimals(fromTokenSymbol, chainId)
      ).toString(),
      chainId,
      accountAddress
    );

    setQuote(() => _quote);
  }, [accountAddress, amount, chainId, displayInfo, fromTokenSymbol]);

  useEffect(() => {
    updateQuote();
  }, [updateQuote]);

  return (
    <Box className="flex w-full h-full p-[1rem]">
      <Typography>Receive:</Typography>
      <Typography>Slippage:</Typography>
      <Typography></Typography>
    </Box>
  );
};

export default OneinchSwapDetails;
