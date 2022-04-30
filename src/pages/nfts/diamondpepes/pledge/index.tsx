import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import {
  YieldMint__factory,
  UniswapPair__factory,
  DiamondPepeNFTsPledge__factory,
  DiamondPepeNFTs__factory,
  Addresses,
} from '@dopex-io/sdk';
import Head from 'next/head';
import { BigNumber } from 'ethers';
import Countdown from 'react-countdown';

import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';

import PledgeDialog from 'components/Nfts/PledgeDialog';

import {
  Data,
  UserData,
  initialData,
} from '../../../../interfaces/diamondpepes/interfaces';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { NftsProvider } from 'contexts/Nfts';

import styles from '../styles.module.scss';

const DiamondPepesNfts = () => {
  const { accountAddress, contractAddresses, provider, signer, chainId } =
    useContext(WalletContext);
  const [data, setData] = useState<Data>(initialData.data);
  const [userData, setUserData] = useState<UserData>(initialData.userData);
  const [pledgeDialogVisibleTab, setPledgeDialogVisibleTab] =
    useState<string>('hidden');
  const [isMintDialogVisible, setIsMintDialogVisible] =
    useState<boolean>(false);
  const yieldMint = YieldMint__factory.connect(
    Addresses[chainId]['DiamondPepesNFTMint'],
    provider
  );
  const diamondPepeNfts = DiamondPepeNFTs__factory.connect(
    Addresses[chainId]['NFTS']['DiamondPepesNFT'],
    signer
  );
  const pledge = DiamondPepeNFTsPledge__factory.connect(
    Addresses[chainId]['DiamondPepesNFTPledge'],
    provider
  );
  const [totalUserPledged, setTotalUserPledged] = useState<number>(0);
  const [totalPledged, setTotalPledged] = useState<number>(0);
  const winners = [
    { address: '0x294b5759E2Ce25458FD4a8F5dE0213F84622a177', number: 403 },
    { address: '0x919aA3ce040261bE8Ef86825f5d2D06cD1Bd2C68', number: 297 },
    { address: '0x6d9248Df52FeD8d12b0147FB7cda478E3e53710F', number: 91 },
    { address: '0x6d9248Df52FeD8d12b0147FB7cda478E3e53710F', number: 95 },
    { address: '0x6d9248Df52FeD8d12b0147FB7cda478E3e53710F', number: 90 },
    { address: '0xBC2530c310276d9B4D2497c58E5AdadB09f2BA41', number: 66 },
    { address: '0x47B456269E9AD24e12643c09A5d602748dE1d26D', number: 323 },
    { address: '0x7B7736a2C07C4332FfaD45a039d2117aE15e3f66', number: 84 },
    { address: '0x9c5083dd4838E120Dbeac44C052179692Aa5dAC5', number: 167 },
    { address: '0x9c5083dd4838E120Dbeac44C052179692Aa5dAC5', number: 190 },
    { address: '0x2822dd75E4B7F6d7BCFf1d63Ce05Fe2118dD92Cf', number: 478 },
  ];
  const sendTx = useSendTx();

  const updateData = useCallback(async () => {
    if (!provider) return;
    const total = await pledge.totalPledged();
    setTotalPledged(total.toNumber());
  }, [provider, pledge, setTotalPledged]);

  const updateUserData = useCallback(async () => {
    if (!provider) return;

    const nfts = await diamondPepeNfts
      .connect(signer)
      .walletOfOwner(accountAddress);
    let total = 0;

    const pledged = await Promise.all(nfts.map((n) => pledge.pledged(n)));

    nfts.map((n, i) => {
      if (pledged[i] !== '0x0000000000000000000000000000000000000000')
        total += 1;
    });

    setTotalUserPledged(total);
  }, [
    signer,
    accountAddress,
    diamondPepeNfts,
    provider,
    pledge,
    setTotalUserPledged,
  ]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  const timeRemaining = (
    <Countdown
      date={new Date(1646426662000)}
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

  const boxes = [
    { title: 'Genesis (Legendary)', subTitle: 'Collection' },
    { title: '22:22 PM 1/3/22', subTitle: 'Start GMT' },
    { title: timeRemaining, subTitle: 'Time remaining' },
    {
      title: totalPledged,
      subTitle: 'Pledged',
    },
    {
      title: totalUserPledged,
      subTitle: 'Your pledged',
    },
  ];

  const handleWithdraw = useCallback(async () => {
    try {
      await sendTx(yieldMint.connect(signer).withdraw());
      await updateData();
      await updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [accountAddress, updateData, updateUserData, signer]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      {provider ? (
        <PledgeDialog
          timeRemaining={timeRemaining}
          open={pledgeDialogVisibleTab != 'hidden'}
          handleClose={
            (() => {
              setPledgeDialogVisibleTab('hidden');
            }) as any
          }
          tab={pledgeDialogVisibleTab}
          userData={userData}
          data={data}
          updateData={updateData}
          updateUserData={updateUserData}
          pledge={pledge}
          winners={winners}
        />
      ) : null}
      <Box>
        <Box className={styles.backgroundOverlay} />
        <Box className={styles.mobileBackgroundOverlay} />
        <AppBar />
        <Box className="pt-28 md:pt-32 pb-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24 flex">
            <img
              src={'/assets/diamondpepes.svg'}
              className="ml-auto mr-auto z-1 relative md:w-auto w-60"
            />
          </Box>
          <Box className="mt-6 md:mt-2 max-w-4xl mx-auto">
            <Typography
              variant="h3"
              className="text-[#78859E] text-center leading-7 md:leading-10 z-1 relative font-['Minecraft'] text-[1rem]"
            >
              Pledge your floor NFTs to increase your chances of obtaining from
              a selection of 11 1-of-1 legendary NFTs
            </Typography>
            <Typography
              variant="h3"
              className="text-[red] text-center leading-7 md:leading-10 z-1 relative font-['Minecraft'] text-[1rem]"
            >
              ALERT: WINNERS HAVE BEEN ANNOUNCED
            </Typography>
          </Box>
          <Box className="text-center mx-auto md:mb-12 lg:mt-12 flex">
            <img src={'/assets/gold-pepe-1.png'} className="z-1 ml-40 w-60" />
            <img
              src={'/assets/gold-pepe-2.png'}
              className="z-1 ml-2 relative w-60"
            />
            <img
              src={'/assets/gold-pepe-3.png'}
              className="z-1 ml-2 relative w-60"
            />
            <img
              src={'/assets/gold-pepe-4.png'}
              className="z-1 ml-2 relative w-60"
            />
          </Box>
          <Box className="pl-4 pr-4 md:flex border border-[#232935] w-full mt-9 bg-[#181C24] z-1 relative">
            {boxes.map((box, i) => (
              <Box
                key={i}
                className={
                  i === boxes.length - 1
                    ? 'md:w-1/5 border-b md:border-b-0 border-neutral-800'
                    : 'md:w-1/5 border-b md:border-b-0 md:border-r border-neutral-800 md:mr-4'
                }
              >
                <Typography
                  variant={'h3'}
                  className="text-white text-base pt-4 pb-1 font-['Minecraft']"
                >
                  {box['title']}
                </Typography>
                <Typography
                  variant={'h4'}
                  className="text-[#78859E] pb-3 font-['Minecraft']"
                >
                  {box['subTitle']}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-1"
              >
                <span className={styles.pepeText}>Deposit Floors</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                Deposit Diamond Pepe(s) that you pledge to burn to increase your
                chances of obtaining a legendary by 1.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                You can deposit as many pepes as you want, the more the better.
                <br />
                <br />
              </Typography>

              <Box className="ml-5 mb-5 md:mt-10 md:mb-0">
                <button
                  className={styles.pepeButton}
                  onClick={() => setPledgeDialogVisibleTab('pledge')}
                  disabled={winners.length > 0}
                >
                  Deposit
                </button>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-1"
              >
                <span className={styles.pepeText}>Wait for RNG</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                Random numbers picking the winning pledges using Chainlink VRF
                will be fed into the contract.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                You can check them on the day on the smart contract(s) &amp; the
                Dopex discord. <br />
                <br />
              </Typography>

              <Box className="ml-5 mb-5 mt-6 md:mt-10 md:mb-0">
                <button
                  className={styles.pepeButton}
                  onClick={() => setPledgeDialogVisibleTab('winner')}
                  disabled={winners.length === 0}
                >
                  View winners
                </button>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-1"
              >
                <span className={styles.pepeText}> Receive Legendaries</span>
              </Typography>

              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                If you hold a winning pledge #, you will receive your legendary
                after the winners have been picked.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                If you did not win, your pledged NFTs are burned forever.
                <br />
                <br />
              </Typography>

              <Box className="ml-5 mb-5 mt-6 md:mt-10 md:mb-0">
                <Tooltip title={'Not open yet'}>
                  <button
                    className={styles.pepeButton}
                    disabled={!(!data.isFarmingPeriod && userData.minted)}
                    onClick={handleWithdraw}
                  >
                    {!(!data.isFarmingPeriod && userData.minted)
                      ? '2/3/2022'
                      : 'Withdraw'}
                  </button>
                </Tooltip>
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
          <Box className="flex text-center h-[10rem]">
            <Typography
              variant="h5"
              className={
                "mr-auto ml-auto mt-8 text-stieglitz font-['Minecraft'] font-[0.2rem] break-all"
              }
            >
              Pledge contract
              <br />
              <a
                href={
                  'https://arbiscan.io/address/0xE974a44f859C1218fE0d8d151349788475692954'
                }
                rel="noopener noreferrer"
                target={'_blank'}
              >
                0xE974a44f859C1218fE0d8d151349788475692954
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const DiamondPepesNftsPage = () => (
  <NftsProvider>
    <DiamondPepesNfts />
  </NftsProvider>
);
export default DiamondPepesNftsPage;
