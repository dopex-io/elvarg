import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import styles from './styles.module.scss';
import CustomButton from '../../../components/UI/CustomButton';
import { Tooltip } from '@material-ui/core';
import {
  Addresses,
  Aggregation1inchRouterV4__factory,
  ERC20,
  ERC20__factory,
  ERC20SSOV1inchRouter__factory,
} from '@dopex-io/sdk';
import { useContext, useEffect, useMemo, useState } from 'react';
import { WalletContext } from '../../../contexts/Wallet';
import axios from 'axios';
import { IS_NATIVE } from '../../../contexts/Assets';
import getDecimalsFromSymbol from '../../../utils/general/getDecimalsFromSymbol';

const DiamondPepesNfts = () => {
  const { accountAddress, provider, chainId, signer } =
    useContext(WalletContext);
  const baseToken = ERC20__factory.connect(
    Addresses[chainId]['RDPX-WETH'],
    provider
  );
  const baseTokenName = 'RDPX-WETH';
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [isZapInAvailable, setIsZapInAvailable] = useState<boolean>(false);
  const [token, setToken] = useState<ERC20 | any>(baseToken);
  const [tokenName, setTokenName] = useState<string>('RDPX-WETH');
  const [quote, setQuote] = useState<object>({});
  const [path, setPath] = useState<object>({});
  const [isFetchingPath, setIsFetchingPath] = useState<boolean>(false);

  const isZapActive: boolean = useMemo(() => {
    return tokenName.toUpperCase() !== baseTokenName.toUpperCase();
  }, [tokenName]);

  const getQuote = async () => {
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    if (fromTokenAddress === toTokenAddress) return;
    const amount: number = 10 ** getDecimalsFromSymbol(tokenName, chainId);
    const { data } = await axios.get(
      `https://api.1inch.exchange/v4.0/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${Math.round(
        amount
      )}&fromAddress=${accountAddress}&slippage=0&disableEstimate=true`
    );

    setQuote(data);
  };

  const getPath = async () => {
    if (!isZapActive) return;
    setIsFetchingPath(true);
    const fromTokenAddress: string = IS_NATIVE(token)
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : token.address;
    const toTokenAddress: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  };

  const handleTokenChange = async () => {
    const symbol = IS_NATIVE(token) ? token : await token.symbol();
    setTokenName(symbol);
    await getQuote();
  };

  const aggregation1inchRouter = Addresses[chainId]['1inchRouter']
    ? Aggregation1inchRouterV4__factory.connect(
        Addresses[chainId]['1inchRouter'],
        signer
      )
    : null;

  const nft1inchRouter = Addresses[chainId]['nft1inchRouter']
    ? ERC20SSOV1inchRouter__factory.connect(
        // TODO: change this
        Addresses[chainId]['nft1inchRouter'],
        signer
      )
    : null;

  const checkDEXAggregatorStatus = async () => {
    try {
      const { status } = await axios.get(
        `https://api.1inch.exchange/v4.0/${chainId}/healthcheck`
      );
      setIsZapInAvailable(
        !!(status === 200 && (nft1inchRouter || nft1inchRouter))
      );
    } catch (err) {
      setIsZapInAvailable(false);
    }
  };

  useEffect(() => {
    checkDEXAggregatorStatus();
  }, []);

  useEffect(() => {
    getPath();
  }, [isZapInVisible]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <Box className={styles.backgroundOverlay}>
        <Box className={styles.mobileBackgroundOverlay} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24">
            <Typography
              variant="h1"
              className="mb-3 font-display text-wave-blue lg:text-[7rem] text-[4rem] hidden md:block"
            >
              <span className={styles.title}>DIAMOND PEPES</span>
            </Typography>
            <Typography
              variant={'h2'}
              className="text-white text-[1.6rem] block md:hidden z-40 relative"
            >
              Get Your Diamond Pepe
            </Typography>
          </Box>
          <Box className="mt-6 md:mt-4 max-w-4xl mx-auto">
            <Typography
              variant="h2"
              className="text-stieglitz text-center text-[1rem] leading-7 md:text-[1.6rem] md:leading-10 z-40 relative"
            >
              2,222 Unique Diamond Pepes up for grabs. Free mint passes by
              staking LP Tokens. Zap In with any asset.
            </Typography>
          </Box>
          <Box className="rounded-xl pl-4 pr-4 hidden md:flex border border-neutral-800 w-full mt-9">
            <Box
              className={
                'md:w-1/4 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
              }
            >
              <Typography variant={'h3'} className="text-white text-base pt-4">
                Genesis
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-4"
              >
                Collection
              </Typography>
            </Box>
            <Box
              className={
                'md:w-1/4 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
              }
            >
              <Typography variant={'h3'} className="text-white text-base pt-4">
                2PM CET 2/22/2022
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-4"
              >
                Start
              </Typography>
            </Box>
            <Box
              className={
                'md:w-1/4 w-6/12 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
              }
            >
              <Typography variant={'h3'} className="text-white text-base pt-4">
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-4"
              >
                Time Remaining
              </Typography>
            </Box>
            <Box className={'md:w-1/4 w-6/12 border-neutral-800'}>
              <Typography variant={'h3'} className="text-white text-base pt-4">
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[1.2rem] pb-4"
              >
                Deposits
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-t-xl p-0 flex md:hidden border border-neutral-800 w-full mt-9">
            <Box className={'w-[48%] border-r border-neutral-800 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1rem] leading-5 z-40 relative"
              >
                Genesis
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Collection
              </Typography>
            </Box>
            <Box className={'w-[52%] pl-3 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1.0rem] leading-5 z-40 relative"
              >
                2PM CET 2/22/2022
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Start
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-b-xl p-0 flex md:hidden border border-neutral-800 w-full mt-[-1.5px]">
            <Box className={'w-[48%] border-r border-neutral-800 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1rem] leading-5 z-40 relative"
              >
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Time remaining
              </Typography>
            </Box>
            <Box className={'w-[52%] pl-3 p-2.5'}>
              <Typography
                variant={'h3'}
                className="text-white text-[1.0rem] leading-5 z-40 relative"
              >
                -
              </Typography>
              <Typography
                variant={'h3'}
                className="text-stieglitz text-[0.9rem] z-40 relative"
              >
                Deposits
              </Typography>
            </Box>
          </Box>
          <Box className="rounded-xl bg-cod-gray p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4">
              <Box className="flex">
                <img
                  src={'/assets/pepe1.svg'}
                  className={'w-5 h-5 mt-1.5 mr-2'}
                />
                <Typography variant="h3" className="text-white font-display">
                  Deposit LP Tokens
                </Typography>
              </Box>
              <Typography variant="h4" className="text-stieglitz mt-2">
                This mint experience only requires you to stake LP tokens to get
                your Diamond Pepe(s).
              </Typography>
              <Typography variant="h5" className="text-mineshaft mt-5">
                Please note that you'll need to deposit 1.5 LP tokens minimum
                per pepe for a guaranteed mint.
              </Typography>
              <Tooltip title={'Not open yet'}>
                <CustomButton size="medium" className="mt-4">
                  Deposit
                </CustomButton>
              </Tooltip>
            </Box>
            <Box className="md:w-1/3 p-4">
              <Box className="flex">
                <img
                  src={'/assets/pepe2.svg'}
                  className={'w-5 h-5 mt-1.5 mr-2'}
                />
                <Typography variant="h3" className="text-white font-display">
                  Wait for Mint
                </Typography>
              </Box>
              <Typography variant="h4" className="text-stieglitz mt-2">
                You can mint your NFT when the deposit period ends. This is set
                for <span className="text-white">two days</span> from opening
                pool.
              </Typography>
              <Typography variant="h5" className="text-mineshaft mt-5">
                You can check the reveal of these NFTs on mint day on
                tofunft.com. <br />
                <br />
                Good luck kid.
              </Typography>

              <CustomButton
                size="medium"
                className="mt-4"
                disabled
                color={'mineshaft'}
              >
                2/24/2022
              </CustomButton>
            </Box>
            <Box className="md:w-1/3 p-4">
              <Box className="flex">
                <img
                  src={'/assets/pepe3.svg'}
                  className={'w-5 h-5 mt-1.5 mr-2'}
                />
                <Typography variant="h3" className="text-white font-display">
                  Withdraw Later
                </Typography>
              </Box>
              <Typography variant="h4" className="text-stieglitz mt-2">
                Your stake is locked for 14 days. Once unlocked you can withdraw
                all funds anytime.
              </Typography>
              <Typography variant="h5" className="text-mineshaft mt-5">
                Excess deposits that doesn't end up with additional pepes will
                also return its share of the farming reward upon withdrawing.
              </Typography>

              <CustomButton
                size="medium"
                className="mt-4"
                disabled
                color={'mineshaft'}
              >
                3/3/2022
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
