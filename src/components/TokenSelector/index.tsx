import { Dispatch, SetStateAction, useContext, useState } from 'react';
import {
  ASSET_TO_NAME,
  AssetsContext,
  IS_NATIVE,
  CHAIN_ID_TO_NATIVE,
} from '../../contexts/Assets';
import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Slide from '@material-ui/core/Slide';
import formatAmount from '../../utils/general/formatAmount';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import { ERC20, ERC20__factory, Addresses } from '@dopex-io/sdk';
import { WalletContext } from '../../contexts/Wallet';
import getDecimalsFromSymbol from '../../utils/general/getDecimalsFromSymbol';

export interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<ERC20 | string>>;
  isInDialog: boolean;
  tokensToExclude?: string[];
  enableSearch?: boolean;
}

const TokenSelector = ({
  open,
  setOpen,
  setToken,
  isInDialog,
  tokensToExclude = ['2CRV'],
  enableSearch = true,
}: Props) => {
  const { contractAddresses, provider, chainId } = useContext(WalletContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { userAssetBalances, tokenPrices, tokens } = useContext(AssetsContext);

  const getValueInUsd = (symbol) => {
    let value = 0;
    tokenPrices.map((record) => {
      if (record['name'] === symbol) {
        value =
          (record['price'] * parseInt(userAssetBalances[symbol])) /
          10 ** getDecimalsFromSymbol(symbol, chainId);
      }
    });
    return value;
  };

  return (
    open && (
      <Box className="overflow-hidden">
        <Box className="flex flex-row items-center mb-4">
          <Typography variant="h5">Pay with</Typography>
          <IconButton
            className="p-0 pb-1 mr-0 ml-auto"
            onClick={() => setOpen(false)}
          >
            <img src="/assets/dark-cross.svg" alt={'Cancel'} />
          </IconButton>
        </Box>
        {enableSearch ? (
          <Box className="mb-2">
            <Input
              disableUnderline={true}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 text-lg text-white w-full bg-umbra pl-3 pr-3 rounded-md"
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
          <Box className={isInDialog ? '' : 'h-[36rem] overflow-y-scroll'}>
            {tokens
              .sort((a, b) => {
                return getValueInUsd(b) - getValueInUsd(a);
              })
              .map((symbol) =>
                (Addresses[chainId][symbol] ||
                  CHAIN_ID_TO_NATIVE[chainId] === symbol) &&
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
                      setToken(
                        IS_NATIVE(symbol)
                          ? symbol
                          : ERC20__factory.connect(
                              contractAddresses[symbol],
                              provider
                            )
                      );
                      setOpen(false);
                    }}
                  >
                    <Box className="flex">
                      {' '}
                      <Box className="flex flex-row h-11 w-11 mr-2">
                        <img
                          src={'/assets/' + symbol.toLowerCase() + '.svg'}
                          alt={ASSET_TO_NAME[symbol]}
                          className="border-0.5 border-gray-200 pb-0.5 pt-0.5 w-auto"
                        />
                      </Box>
                      <Box className="ml-1">
                        <Typography
                          variant="h5"
                          className="text-white font-medium"
                        >
                          {symbol}
                        </Typography>
                        <Typography variant="h6" className="text-gray-400">
                          {ASSET_TO_NAME[symbol]}
                        </Typography>
                      </Box>{' '}
                    </Box>
                    <Box className="ml-auto mr-0 text-right">
                      <Typography
                        variant="h5"
                        className="text-white font-medium"
                      >
                        {formatAmount(
                          getUserReadableAmount(
                            userAssetBalances[symbol],
                            getDecimalsFromSymbol(symbol, chainId)
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
    )
  );
};

export default TokenSelector;
