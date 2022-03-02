import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import cx from 'classnames';
import Head from 'next/head';
import {
  ERC20,
  Addresses,
  DiamondPepeNFTs1inchRouter__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { LoaderIcon } from 'react-hot-toast';
import { utils as ethersUtils, BigNumber, ethers } from 'ethers';

import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import ArrowRightIcon from 'components/Icons/ArrowRightIcon';

import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import { CURRENCIES_MAP, MAX_VALUE, SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Tzwap = () => {
  const { chainId, signer, accountAddress, provider } =
    useContext(WalletContext);
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const tzwapRouter = DiamondPepeNFTs1inchRouter__factory.connect(
    Addresses[chainId]['Tzwap1inchRouter'] ||
      '0x818ceD3D446292061913f1f74B2EAeE6341a76Ec', // TODO REMOVE || ADDRESS
    signer
  );
  const [activeTab, setActiveTab] = useState(0);
  const [fromToken, setFromToken] = useState<ERC20 | any>('ETH');
  const [fromTokenName, setFromTokenName] = useState<string>('ETH');
  const [toToken, setToToken] = useState<ERC20 | any>(
    ERC20__factory.connect(Addresses[chainId]['DPX'], provider)
  );
  const [toTokenName, setToTokenName] = useState<string>('DPX');
  const [rawAmount, setRawAmount] = useState<string>('1');
  const [approved, setApproved] = useState<boolean>(false);
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] =
    useState<boolean>(false);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const handleFromTokenChange = useCallback(async () => {
    if (!fromToken) return;
    const symbol = IS_NATIVE(fromToken) ? fromToken : await fromToken.symbol();
    setFromTokenName(symbol);
  }, [fromToken]);

  const handleToTokenChange = useCallback(async () => {
    if (!toToken) return;
    const symbol = IS_NATIVE(toToken) ? toToken : await toToken.symbol();
    setToTokenName(symbol);
  }, [toToken]);

  const setMaxAmount = useCallback(async () => {}, []);

  useEffect(() => {
    handleFromTokenChange();
  }, [handleFromTokenChange]);

  useEffect(() => {
    handleToTokenChange();
  }, [handleToTokenChange]);

  useEffect(() => {
    (async function () {
      if (!tzwapRouter || !fromToken) return;

      const userAmount = IS_NATIVE(fromToken)
        ? BigNumber.from(userAssetBalances[CURRENCIES_MAP[chainId.toString()]])
        : await fromToken.balanceOf(accountAddress);

      setUserTokenBalance(userAmount);

      let allowance = IS_NATIVE(fromToken)
        ? BigNumber.from(0)
        : await fromToken.allowance(accountAddress, tzwapRouter.address);

      if (!allowance.eq(0)) {
        setApproved(true);
      } else {
        if (IS_NATIVE(fromToken)) {
          setApproved(true);
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    })();
  }, [accountAddress, fromToken, userAssetBalances, chainId, provider]);

  return (
    <Box className="bg-[url('/assets/vaultsbg.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Tzwap | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="flex mx-auto max-w-xl mb-8 mt-32">
          <Box
            className={cx(
              'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 ml-auto mr-auto',
              styles.cardWidth
            )}
          >
            <TabPanel value={activeTab} index={0}>
              <Box className={'flex'}>
                <Box className={'w-full'}>
                  <Box className="flex flex-row mb-4 justify-between p-1 border-[1px] border-[#1E1E1E] rounded-md">
                    <Box
                      className={
                        activeTab === 0
                          ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                          : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                      }
                      onClick={() => setActiveTab(0)}
                    >
                      <Typography variant="h6" className="text-xs font-normal">
                        Create new
                      </Typography>
                    </Box>
                    <Box
                      className={
                        activeTab === 1
                          ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#2D2D2D] cursor-pointer group rounded hover:bg-mineshaft hover:opacity-80'
                          : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                      }
                      onClick={() => setActiveTab(1)}
                    >
                      <Typography variant="h6" className="text-xs font-normal">
                        Active orders
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="bg-umbra rounded-2xl flex flex-col mb-[3px] p-3 pr-2">
                    <Box className="flex flex-row justify-between">
                      <Box
                        className="h-11 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                        onClick={() => setIsTokenSelectorVisible(true)}
                      >
                        <Box className="flex flex-row h-9 w-9 mr-1.5">
                          {fromTokenName !== '' ? (
                            <img
                              src={
                                '/assets/' +
                                fromTokenName.toLowerCase().split('.e')[0] +
                                '.svg'
                              }
                              alt={fromTokenName}
                            />
                          ) : (
                            <LoaderIcon className="mt-3.5 ml-3.5" />
                          )}
                        </Box>
                        <Typography
                          variant="h5"
                          className="text-white pb-1 pr-1.5"
                        >
                          {fromTokenName}
                        </Typography>
                        <IconButton className="opacity-40 p-0 group-hover:opacity-70">
                          <ArrowDropDownIcon className={'fill-gray-100 mr-2'} />
                        </IconButton>
                      </Box>
                      <Input
                        disableUnderline
                        id="optionsAmount"
                        name="optionsAmount"
                        placeholder="0"
                        type="number"
                        className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                        value={rawAmount}
                        onChange={(e) => setRawAmount(e.target.value)}
                        classes={{ input: 'text-right' }}
                      />
                    </Box>
                    <Box className="flex flex-row justify-between">
                      <Box className="flex">
                        <Typography
                          variant="h6"
                          className="text-stieglitz text-sm pl-1 pt-2"
                        >
                          ~
                        </Typography>
                      </Box>
                      <Box className="ml-auto mr-0">
                        <Typography
                          variant="h6"
                          className="text-stieglitz text-sm pl-1 pt-2 pr-3"
                        >
                          Balance:{' '}
                          <span className={'text-white'}>
                            {formatAmount(
                              getUserReadableAmount(
                                userTokenBalance,
                                getTokenDecimals(fromTokenName, chainId)
                              ),
                              4
                            )}
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2 relative">
                    <Box
                      className={
                        'absolute top-[-0.7rem] left-[50%] border border-cod-gray rounded-full p-1 bg-umbra'
                      }
                    >
                      <img
                        src={'/assets/arrowdown.svg'}
                        className={'w-3 h-3'}
                      />
                    </Box>
                    <Box className="flex flex-row justify-between">
                      <Box
                        className="h-11 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center cursor-pointer group"
                        onClick={() => setIsTokenSelectorVisible(true)}
                      >
                        <Box className="flex flex-row h-9 w-9 mr-1.5">
                          {toTokenName !== '' ? (
                            <img
                              src={
                                '/assets/' +
                                toTokenName.toLowerCase().split('.e')[0] +
                                '.svg'
                              }
                              alt={toTokenName}
                            />
                          ) : (
                            <LoaderIcon className="mt-3.5 ml-3.5" />
                          )}
                        </Box>
                        <Typography
                          variant="h5"
                          className="text-white pb-1 pr-1.5"
                        >
                          {toTokenName}
                        </Typography>
                        <IconButton className="opacity-40 p-0 group-hover:opacity-70">
                          <ArrowDropDownIcon className={'fill-gray-100 mr-2'} />
                        </IconButton>
                      </Box>
                      <Typography
                        className={
                          'text-2xl text-white mt-2.5 ml-2 mr-3 font-mono'
                        }
                        variant={'h6'}
                      >
                        -
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value={activeTab} index={1}></TabPanel>
          </Box>
        </Box>
        <Box
          className={cx(
            'flex mx-auto max-w-xl mb-8 mt-32 text-center',
            styles.cardWidth
          )}
        >
          <Typography variant="h5" className="z-1 text-stieglitz">
            <span className={'text-white'}>TZWAP</span> allows anyone to create
            an on-chain TWAP order split by intervals and ticksizes that can be
            filled by bots for a fee.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Tzwap;
