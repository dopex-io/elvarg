import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import {
  YieldMint__factory,
  UniswapPair__factory,
  Addresses,
} from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import Head from 'next/head';

import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';

import ActionsDialog from './components/ActionsDialog';
import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';

import getUserReadableAmount from '../../../utils/contracts/getUserReadableAmount';
import formatAmount from '../../../utils/general/formatAmount';

import { Data, UserData, initialData } from './interfaces';

import { WalletContext } from '../../../contexts/Wallet';

import useSendTx from 'hooks/useSendTx';

import styles from './styles.module.scss';

const DiamondPepesNfts = () => {
  const { accountAddress, contractAddresses, provider, signer, chainId } =
    useContext(WalletContext);
  const [data, setData] = useState<Data>(initialData.data);
  const [userData, setUserData] = useState<UserData>(initialData.userData);
  const [actionsDialogDisplayState, setActionsDialogDisplayState] = useState({
    visible: false,
    tab: 'mint',
  });

  const yieldMint = YieldMint__factory.connect(
    Addresses[chainId]['DiamondPepesNFTMint'],
    provider
  );
  const sendTx = useSendTx();

  const updateData = useCallback(async () => {
    if (!provider || !contractAddresses) return;
  }, [provider, contractAddresses, chainId]);

  const updateUserData = useCallback(async () => {
    if (!provider || !contractAddresses || !YieldMint__factory) return;
  }, [provider, contractAddresses]);

  useEffect(() => {}, [updateData]);

  useEffect(() => {}, [updateUserData]);

  const timeRemaining = useMemo(() => {
    if (!data.isDepositPeriod) return <span>-</span>;
    else if (data.isDepositPeriod) {
      return (
        <Countdown
          date={new Date((1645496520 + 2.22 * 86400) * 1000)}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (days < 1 && hours < 1) {
              return (
                <span>
                  {minutes}m {seconds}s
                </span>
              );
            } else {
              return (
                <span>
                  {days}d {hours}h {minutes}m {seconds}s
                </span>
              );
            }
          }}
        />
      );
    }
  }, [data]);

  const boxes = [
    { title: '1111', subTitle: 'PEPES REMAINING' },
    { title: '2PM 5/22/2022', subTitle: 'START' },
    { title: '-', subTitle: 'TIME REMAINING' },
    { title: '-', subTitle: 'DEPOSITS' },
  ];

  const handleWithdraw = useCallback(async () => {}, [
    sendTx,
    signer,
    updateData,
    updateUserData,
  ]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <ActionsDialog
        open={actionsDialogDisplayState.visible}
        tab={actionsDialogDisplayState.tab}
        data={data}
        userData={userData}
        handleClose={() => {
          setActionsDialogDisplayState({ visible: false, tab: 'mint' });
        }}
        updateData={updateData}
        updateUserData={updateUserData}
      />
      <Box className={styles.background}>
        <Box className={styles.backgroundOverlay} />
        <Box className={styles.mobileBackgroundOverlay} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24 flex">
            <img
              src={'/assets/pepe-2-logo.png'}
              className="ml-auto mr-auto z-1 relative md:w-auto w-60"
              alt="logo"
            />
          </Box>
          <Box className="mt-6 md:mt-2 max-w-4xl mx-auto">
            <Typography
              variant="h4"
              className="text-[#78859E] text-center md:leading-10 z-1 relative font-['Minecraft']"
            >
              Duel other Diamond Pepes in a commit-reveal based async game where
              any whitelisted NFT holder, starting with Gen 2 Diamond Pepes can
              create duels by submitting a token, wager amount and signature of
              their initial selected moves.
            </Typography>
          </Box>

          <Box className="p-2 mt-7 md:flex">
            {boxes.map((box) => (
              <Box className="md:w-1/4 p-4 text-center">
                <Typography
                  variant="h3"
                  className="text-white font-display font-['Minecraft'] relative z-1"
                >
                  <span className={styles.pepeText}>{box.title}</span>
                </Typography>
                <Typography
                  variant="h4"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
                >
                  {box.subTitle}
                </Typography>
              </Box>
            ))}
          </Box>
          <img
            src={'/assets/pepe-line.png'}
            className="ml-auto mr-auto mt-8 mb-8"
          />
          <Box className="flex">
            <Box className="ml-auto mr-auto mb-5 mt-5 lg:w-[23rem]">
              <button
                className={styles.pepeButton}
                onClick={() =>
                  setActionsDialogDisplayState({ visible: true, tab: 'mint' })
                }
              >
                Esteemed CEO, may I have a pepe?
              </button>
            </Box>
          </Box>
          <Box className="p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/pepe-header-1.png'}
                className="w-40 ml-auto mr-auto"
              />
              <img
                src={'/assets/pledge-pepe-button.png'}
                className="w-48 z-50 mt-12 ml-auto mr-auto cursor-pointr"
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
              >
                “A [redacted] always repays his debts.”
                <br />
                <br />
                Everyone who participated in the pledge event will be getting a
                free Gen 2 sent to their wallets.
              </Typography>

              <Box className={'flex mt-6'}>
                <img src={'/assets/export.svg'} className={'w-5 ml-auto'} />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles.pepeLink}>Pledge Event</span>
                </Typography>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/pepe-header-1.png'}
                className="w-40 ml-auto mr-auto"
              />
              <img
                src={'/assets/reveal-pepe-button.png'}
                className="w-60 z-50 mt-12 ml-auto mr-auto cursor-pointer"
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
              >
                Please stay tuned for a reveal announcement from esteemed CEO.{' '}
                <br />
                <br />
                Please follow his twitter or Dopex’s official Twitter account
                for more information.
              </Typography>

              <Box className={'flex mt-6'}>
                <img src={'/assets/export.svg'} className={'w-4 ml-auto'} />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles.pepeLink}>Tofunft</span>
                </Typography>

                <img
                  src={'/assets/pepe-tweet.png'}
                  className={'w-6 h-5 ml-auto'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles.pepeLink}>DOPEX</span>
                </Typography>

                <img
                  src={'/assets/pepe-tweet.png'}
                  className={'w-6 h-5 ml-auto'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles.pepeLink}>CEO</span>
                </Typography>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/pepe-header-1.png'}
                className="w-40 ml-auto mr-auto"
              />
              <img
                src={'/assets/duel-pepe-button.png'}
                className="w-56 z-50 mt-12 ml-auto mr-auto cursor-pointer"
              />
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-7"
              >
                Get Early Access to Duel Pepes, a commit-reveal based async pvp
                game with duels and wagers where winner takes all.
                <br />
              </Typography>

              <Box className={'flex mt-6'}>
                <img src={'/assets/export.svg'} className={'w-5 ml-auto'} />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles.pepeLink}>How to play</span>
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="flex text-center h-[10rem]">
            <Typography
              variant="h5"
              className={
                "mr-auto ml-auto mt-auto text-stieglitz font-['Minecraft'] font-[0.2rem] break-all"
              }
            >
              Mint contract
              <br />
              <a
                href={
                  'https://arbiscan.io/address/0xcAD9297f00487a88Afa120Bf9F4823B52AE388b0'
                }
                rel="noopener noreferrer"
                target={'_blank'}
              >
                0xcAD9297f00487a88Afa120Bf9F4823B52AE388b0
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
