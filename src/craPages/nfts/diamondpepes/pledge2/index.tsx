import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import {
  DiamondPepeNFTsPledge2__factory,
  DiamondPepeNFTs__factory,
  Addresses,
} from '@dopex-io/sdk';
import Head from 'next/head';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';

import Pledge2Dialog from '../components/Pledge2Dialog';

import { Data, UserData, initialData } from '../interfaces';

import { WalletContext } from '../../../../contexts/Wallet';

import styles from '../styles.module.scss';

const DiamondPepesNfts = () => {
  const { accountAddress, contractAddresses, provider, signer, chainId } =
    useContext(WalletContext);
  const [data, setData] = useState<Data>(initialData.data);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>(initialData.userData);
  const [pledgeDialogVisibleTab, setPledgeDialogVisibleTab] =
    useState<string>('hidden');
  const diamondPepeNfts = useMemo(
    () =>
      DiamondPepeNFTs__factory.connect(
        Addresses[chainId]['NFTS']['DiamondPepesNFT'],
        signer
      ),
    [signer]
  );
  const pledge = useMemo(
    () =>
      DiamondPepeNFTsPledge2__factory.connect(
        '0x353e731EaA33fC1cc7f50E74EA390e95b192277F',
        signer
      ),
    [signer]
  );
  const [totalUserPledged, setTotalUserPledged] = useState<number>(0);
  const [totalPledged, setTotalPledged] = useState<number>(0);

  const updateData = useCallback(async () => {
    if (!provider) return;
    const total = await pledge.totalPledged();
    setTotalPledged(total.toNumber());
  }, [provider, pledge, setTotalPledged]);

  const updateUserData = useCallback(async () => {
    if (!provider) return;

    setIsLoading(true);

    let start = 9417023;
    let end = (await provider.getBlock('latest'))['number'];

    let userTotal = 0;
    while (start < end) {
      const events = await diamondPepeNfts.queryFilter(
        diamondPepeNfts.filters.Transfer(accountAddress, pledge.address, null),
        start,
        start + 2000
      );
      userTotal += events.length;
      start += 2000;
    }

    setTotalUserPledged(userTotal);
    setIsLoading(false);
  }, [
    signer,
    accountAddress,
    diamondPepeNfts,
    provider,
    pledge,
    setTotalUserPledged,
    totalPledged,
  ]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  const boxes = [
    { title: 'Gen 2 (Duel Pepes)', subTitle: 'Collection' },
    { title: '22:22 PM 6/4/22', subTitle: 'Start GMT' },
    { title: `${537 - totalPledged}`, subTitle: 'Remaining to pledge' },
    {
      title: totalPledged,
      subTitle: 'Pledged',
    },
    {
      title: isLoading ? (
        <CircularProgress size={13} color="inherit" />
      ) : (
        totalUserPledged
      ),
      subTitle: 'Your pledged',
    },
  ];

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      {provider ? (
        <Pledge2Dialog
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
        />
      ) : null}
      <Box>
        <Box className={styles.backgroundOverlay} />
        <Box className={styles.mobileBackgroundOverlay} />
        <AppBar />
        <Box className="pt-28 md:pt-32 lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
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
              This pledge runs until 33% of Gen 1 pepes are pledged to burn to
              trigger the Gen 2 mint
            </Typography>
          </Box>
          <Box className="text-center mx-auto md:mb-12 lg:mt-12 flex">
            <img
              src={'/assets/gen2-pepe-1.png'}
              className="z-1 ml-auto w-60 border border-bg-white"
              alt={'Pepe 1'}
            />
            <img
              src={'/assets/gen2-pepe-2.jpg'}
              className="z-1 ml-2 relative w-60 border border-bg-white"
              alt={'Pepe 2'}
            />
            <img
              src={'/assets/gen2-pepe-3.png'}
              className="z-1 ml-2 relative w-60 mr-auto border border-bg-white"
              alt={'Pepe 3'}
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
            <Box className="md:w-2/3 p-4 text-center ml-auto mr-auto">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-1"
              >
                <span className={styles.pepeText}>Trigger Gen 2</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                Each pledge receives a Gen 2 pepe in the Gen 2 mint
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                Up to 4 pepes can be pledged in a single pledge - each pledged
                pepe would result in a 12.5% increase in rarity traits for the
                Gen 2 mint resulting in an up to 50% chance of a rare trait in
                Gen 2
                <br />
              </Typography>

              <Box className="ml-5 mb-5 md:mt-10 md:mb-0">
                <button
                  className={styles.pepeButton}
                  onClick={() => setPledgeDialogVisibleTab('pledge')}
                >
                  Deposit
                </button>
              </Box>
            </Box>
          </Box>
          <Box className="flex text-center h-[7rem] mb-2">
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
                  'https://arbiscan.io/address/' +
                  '0x353e731EaA33fC1cc7f50E74EA390e95b192277F'
                }
                rel="noopener noreferrer"
                target={'_blank'}
              >
                {'0x353e731EaA33fC1cc7f50E74EA390e95b192277F'}
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
