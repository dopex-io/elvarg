import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Addresses } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Slide from '@mui/material/Slide';

import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

import { TOKEN_DATA } from 'constants/tokens';
import { CHAINS } from 'constants/chains';

export interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setFromTokenSymbol: Function;
  isInDialog: boolean;
  tokensToExclude?: string[];
  enableSearch?: boolean;
}

const TokenSelector = ({
  open,
  setOpen,
  setFromTokenSymbol,
  isInDialog,
  tokensToExclude = ['2CRV'],
  enableSearch = true,
}: Props) => {
  const { chainId, userAssetBalances, tokenPrices, tokens } = useBoundStore();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const getValueInUsd = useCallback(
    (symbol: string) => {
      let value = 0;
      tokenPrices.map((record) => {
        if (record['name'] === symbol) {
          value =
            (record['price'] * parseInt(userAssetBalances[symbol] || '0')) /
            10 ** getTokenDecimals(symbol, chainId);
        }
      });
      return value;
    },
    [tokenPrices, userAssetBalances, chainId]
  );

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handleSearch = useCallback(
    (e: { target: { value: SetStateAction<string> } }) =>
      setSearchTerm(e.target.value),
    []
  );

  return open ? (
    <Box className="overflow-hidden">
      <Box className="flex flex-row items-center">
        <IconButton
          className="p-0 mr-2 ml-auto"
          onClick={handleClose}
          size="large"
        >
          <img src="/assets/dark-cross.svg" alt={'Cancel'} />
        </IconButton>
      </Box>
      {enableSearch ? (
        <Box className="mb-2">
          <Input
            disableUnderline={true}
            value={searchTerm}
            onChange={handleSearch}
            className="h-11 text-lg text-white w-full bg-umbra pl-3 pr-3 rounded-md text-[1rem]"
            placeholder="Search by token name"
            classes={{ input: 'text-white' }}
            startAdornment={
              <Box className="mr-3 opacity-30 w-18">
                <SearchIcon />
              </Box>
            }
          />
        </Box>
      ) : null}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box className={isInDialog ? '' : 'h-[20rem] overflow-y-scroll'}>
          {tokens
            .sort((a, b) => {
              return getValueInUsd(b) - getValueInUsd(a);
            })
            .map((symbol) =>
              (Addresses[chainId][symbol] ||
                CHAINS[chainId]?.nativeToken === symbol) &&
              symbol.includes(searchTerm.toUpperCase()) &&
              !tokensToExclude.includes(symbol.toUpperCase()) ? (
                <Box
                  key={symbol}
                  className={
                    isInDialog
                      ? 'flex mt-2 mb-2 hover:bg-mineshaft p-2 rounded-md cursor-pointer'
                      : 'flex mt-2 mb-2 mr-2 hover:bg-mineshaft p-2 pr-3 rounded-md cursor-pointer'
                  }
                  onClick={() => {
                    setFromTokenSymbol(symbol);
                    setOpen(false);
                  }}
                >
                  <Box className="flex">
                    <Box className="flex flex-row h-11 w-11 mr-2">
                      <img
                        src={'/images/tokens/' + symbol.toLowerCase() + '.svg'}
                        alt={TOKEN_DATA[symbol]?.name || 'token'}
                        className="border-0.5 border-gray-200 pb-0.5 pt-0.5 w-auto"
                      />
                    </Box>
                    <Box className="ml-1">
                      <Typography
                        variant="h6"
                        className="text-white font-medium"
                      >
                        {symbol}
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        {TOKEN_DATA[symbol]?.name}
                      </Typography>
                    </Box>{' '}
                  </Box>
                  <Box className="ml-auto mr-0 text-right">
                    <Typography variant="h5" className="text-white font-medium">
                      {formatAmount(
                        getUserReadableAmount(
                          userAssetBalances[symbol] ?? '0',
                          getTokenDecimals(symbol, chainId)
                        ),
                        3
                      )}{' '}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-gray-500 font-small"
                    >
                      ${formatAmount(getValueInUsd(symbol), 2)}{' '}
                    </Typography>
                  </Box>
                </Box>
              ) : null
            )}
        </Box>
      </Slide>
    </Box>
  ) : null;
};

export default TokenSelector;
