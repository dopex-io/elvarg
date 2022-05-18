import React, { useContext, useCallback } from 'react';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

import Typography from 'components/UI/Typography';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';

import { TOKEN_DATA } from 'constants/index';

interface TokenSelectorProps {
  open: boolean;
  setOpen: Function;
  tokens: {
    symbol: string;
    address: string;
  }[];
  setSelection: (symbol: string) => void;
  containerRef: React.RefObject<HTMLInputElement>;
}

const TokenSelector = (props: TokenSelectorProps) => {
  const { open, setOpen, tokens, containerRef, setSelection } = props;
  const { chainId } = useContext(WalletContext);
  const { userAssetBalances, tokenPrices } = useContext(AssetsContext);

  const getValueInUsd = useCallback(
    (symbol: string) => {
      let value = 0;
      tokenPrices.map((record) => {
        if (record['name'] === symbol) {
          value =
            (record['price'] * parseInt(userAssetBalances[symbol] || '')) /
            10 ** getTokenDecimals(symbol, chainId);
        }
      });
      return value;
    },
    [tokenPrices, userAssetBalances, chainId]
  );

  return (
    <Slide
      direction="up"
      in={open}
      mountOnEnter
      unmountOnExit
      container={containerRef.current}
    >
      <Box className="overflow-y-auto w-full bg-cod-gray h-[33rem]">
        {tokens.map((token, index) => {
          return (
            <Box
              key={index}
              className={`flex justify-between px-2 hover:bg-mineshaft p-3 rounded-md`}
              role="button"
              onClick={() => {
                setSelection(token.symbol);
                setOpen(false);
              }}
            >
              <Box className="flex space-x-4">
                <img
                  src={`/images/tokens/${token.symbol.toLowerCase()}.svg`}
                  alt={token.symbol}
                  className="h-[2.4rem] my-auto"
                />
                <Box className="flex flex-col space-y-1">
                  <Typography variant="h5" className="my-auto font-normal">
                    {token.symbol}
                  </Typography>
                  <Typography variant="h6" className="my-auto text-stieglitz">
                    {TOKEN_DATA[token.symbol.toUpperCase()]?.name}
                  </Typography>
                </Box>
              </Box>
              <Box className="flex flex-col space-y-1 items-end">
                <Typography variant="h6" className="my-auto">
                  {formatAmount(
                    getUserReadableAmount(
                      // @ts-ignore TODO: FIX
                      userAssetBalances[token.symbol],
                      getTokenDecimals(token.symbol, chainId)
                    ),
                    3
                  )}
                </Typography>
                <Typography variant="h6" className="text-gray-500 font-small">
                  ${formatAmount(getValueInUsd(token.symbol), 2)}{' '}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Slide>
  );
};

export default TokenSelector;
