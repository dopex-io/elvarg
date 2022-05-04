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

import ActionsDialog from 'components/nfts-page/ActionsDialog';
import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import {
  Data,
  UserData,
  initialData,
} from '../../../interfaces/diamondpepes/interfaces';

import { WalletContext } from 'contexts/Wallet';
import { NftsProvider } from 'contexts/Nfts';

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
    const lp = UniswapPair__factory.connect(
      Addresses[chainId]['RDPX-WETH'],
      provider
    );

    const [
      isDepositPeriod,
      isFarmingPeriod,
      maxLpDeposits,
      mintPrice,
      totalDeposits,
      lpReserves,
      lpTotalSupply,
    ] = await Promise.all([
      yieldMint.depositPeriod(),
      yieldMint.farmingPeriod(),
      yieldMint.maxLpDeposits(),
      yieldMint.mintPrice(),
      yieldMint.totalDeposits(),
      lp.getReserves(),
      lp.totalSupply(),
    ]);

    setData({
      lpReserves: lpReserves,
      lpSupply: lpTotalSupply,
      isDepositPeriod: isDepositPeriod,
      isFarmingPeriod: isFarmingPeriod,
      maxLpDeposits: maxLpDeposits,
      mintPrice: mintPrice,
      totalDeposits: totalDeposits,
    });
  }, [provider, contractAddresses, chainId, yieldMint]);

  const updateUserData = useCallback(async () => {
    if (!provider || !contractAddresses || !YieldMint__factory) return;

    const [deposits, minted] = await Promise.all([
      yieldMint.usersDeposit(accountAddress),
      yieldMint.didUserMint(accountAddress),
    ]);

    setUserData({ deposits: deposits, minted: minted });
  }, [provider, contractAddresses, yieldMint, accountAddress]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

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
    { title: 'Genesis', subTitle: 'Collection' },
    { title: '2:22 AM 22/2/22', subTitle: 'Start CET' },
    { title: timeRemaining, subTitle: 'Time remaining' },
    {
      title: formatAmount(getUserReadableAmount(data.totalDeposits, 18), 2),
      subTitle: 'Deposits',
    },
    {
      title: formatAmount(getUserReadableAmount(userData.deposits, 18), 2),
      subTitle: 'Your deposits',
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
  }, [sendTx, yieldMint, signer, updateData, updateUserData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      {provider ? (
        <ActionsDialog
          open={actionsDialogDisplayState.visible}
          tab={actionsDialogDisplayState.tab}
          data={data}
          userData={userData}
          yieldMint={yieldMint}
          handleClose={() => {
            setActionsDialogDisplayState({ visible: false, tab: 'mint' });
          }}
          updateData={updateData}
          updateUserData={updateUserData}
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
              alt="logo"
            />
          </Box>
          <Box className="mt-6 md:mt-2 max-w-4xl mx-auto">
            <Typography
              variant="h3"
              className="text-[#78859E] text-center leading-7 md:leading-10 z-1 relative font-['Minecraft'] text-[1rem]"
            >
              2,222 Unique Diamond Pepes up for grabs. Free mint passes by
              staking LP Tokens. Zap In with any asset.
            </Typography>
            <Box className="ml-auto mr-auto mb-5 mt-5 w-[10rem]">
              <a href={'/nfts/diamondpepes/pledge2'}>
                <button className={styles.pepeButton}>Pledge</button>
              </a>
            </Box>
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
                <span className={styles.pepeText}>Deposit LP Tokens</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                This mint experience only requires you to stake LP tokens to get
                your Diamond Pepe(s).
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                Please note that{" you'll "}need to deposit 10 LP tokens minimum
                per pepe for a guaranteed mint.
                <br />
                <br />
              </Typography>
              <Box className="ml-5 mb-5 md:mt-10 md:mb-0">
                <button className={styles.pepeButton} disabled>
                  Deposit
                </button>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-1"
              >
                <span className={styles.pepeText}>Wait for mint</span>
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                You can mint your NFT when the deposit period ends. This is set
                for two days from opening pool.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                You can check the reveal of these NFTs on mint day on
                tofunft.com. <br />
                <br />
                Good luck kid.
              </Typography>
              <Box className="ml-5 mb-5 mt-6 md:mt-10 md:mb-0">
                <Tooltip title={'Not open yet'}>
                  <button
                    className={styles.pepeButton}
                    onClick={() =>
                      setActionsDialogDisplayState({
                        visible: true,
                        tab: 'mint',
                      })
                    }
                    disabled={!data.isFarmingPeriod}
                  >
                    {data.isFarmingPeriod ? 'Mint' : '2/24/2022'}
                  </button>
                </Tooltip>
              </Box>
            </Box>
            <Box className="md:w-1/3 p-4 text-center">
              <Typography
                variant="h3"
                className="text-white font-display font-['Minecraft'] relative z-1"
              >
                <span className={styles.pepeText}> Withdraw Later</span>
              </Typography>

              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-4"
              >
                Your stake is locked for 14 days. Once unlocked you can withdraw
                all funds anytime.
              </Typography>
              <Typography
                variant="h4"
                className="text-[#78859E] font-['Minecraft'] relative z-1 mt-5"
              >
                Excess deposits that {"doesn't"} end up with additional pepes
                will also return its share of the farming reward upon
                withdrawing.
              </Typography>
              <Box className="ml-5 mb-5 mt-6 md:mt-10 md:mb-0">
                <Tooltip title={'Not open yet'}>
                  <button
                    className={styles.pepeButton}
                    onClick={handleWithdraw}
                  >
                    Withdraw
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
