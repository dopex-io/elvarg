import { SsovData, SsovProperties, UserSsovData } from '../../contexts/Ssov';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { ASSET_TO_NAME, AssetsContext } from '../../contexts/Assets';
import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Slide from '@material-ui/core/Slide';
import formatAmount from '../../utils/general/formatAmount';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import { ERC20, ERC20__factory } from '@dopex-io/sdk';
import { Scrollbars } from 'react-custom-scrollbars';
import { WalletContext } from '../../contexts/Wallet';

export interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<ERC20>>;
}

const TokenSelector = ({ open, setOpen, setToken }: Props) => {
  const { contractAddresses, provider } = useContext(WalletContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { userAssetBalances, tokenPrices, tokens } = useContext(AssetsContext);
  const getValueInUsd = (symbol) => {
    let value = 0;
    tokenPrices.map((record) => {
      if (record['name'] === symbol) {
        value =
          (record['price'] * parseInt(userAssetBalances[symbol])) / 10 ** 18;
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3002 0.709727C12.9102 0.319727 12.2802 0.319727 11.8902 0.709727L7.00022 5.58973L2.11022 0.699727C1.72022 0.309727 1.09021 0.309727 0.700215 0.699727C0.310215 1.08973 0.310215 1.71973 0.700215 2.10973L5.59022 6.99973L0.700215 11.8897C0.310215 12.2797 0.310215 12.9097 0.700215 13.2997C1.09021 13.6897 1.72022 13.6897 2.11022 13.2997L7.00022 8.40973L11.8902 13.2997C12.2802 13.6897 12.9102 13.6897 13.3002 13.2997C13.6902 12.9097 13.6902 12.2797 13.3002 11.8897L8.41021 6.99973L13.3002 2.10973C13.6802 1.72973 13.6802 1.08973 13.3002 0.709727Z"
                fill="#3E3E3E"
              />
            </svg>
          </IconButton>
        </Box>
        <Box className="mb-2">
          <Input
            disableUnderline={true}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 text-lg text-white w-full text-base bg-umbra pl-3 pr-3 rounded-md"
            placeholder="Search by token name"
            classes={{ input: 'text-white' }}
            startAdornment={
              <Box className="mr-3 opacity-30 w-18">
                <SearchIcon />
              </Box>
            }
          />
        </Box>
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Scrollbars style={{ height: 400 }}>
            {tokens
              .sort((a, b) => {
                return getValueInUsd(b) - getValueInUsd(a);
              })
              .map(
                (symbol) =>
                  symbol.includes(searchTerm.toUpperCase()) && (
                    <Box
                      key={symbol}
                      className="flex mt-2 mb-2 hover:bg-mineshaft pb-2 pt-2 pr-3 pl-2 mr-4 rounded-md cursor-pointer"
                      onClick={() => {
                        setToken(
                          symbol === 'ETH'
                            ? 'ETH'
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
                              18
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
                  )
              )}
          </Scrollbars>
        </Slide>
      </Box>
    )
  );
};

export default TokenSelector;
