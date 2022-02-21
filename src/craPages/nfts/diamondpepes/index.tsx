import Head from 'next/head';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';
import styles from './styles.module.scss';
import { useMemo } from 'react';
import { Tooltip } from '@material-ui/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import PurchaseDialog from '../components/PurchaseDialog';
import { BigNumber } from 'ethers';
import {
  YieldMint__factory,
  UniswapPair__factory,
  Addresses,
} from '@dopex-io/sdk';
import useSendTx from 'hooks/useSendTx';
import { WalletContext } from '../../../contexts/Wallet';
import getUserReadableAmount from '../../../utils/contracts/getUserReadableAmount';
import Countdown from 'react-countdown';
import formatAmount from '../../../utils/general/formatAmount';
import { Data, UserData, initialData } from '../diamondpepes/interfaces';

const DiamondPepesNfts = () => {
  const { accountAddress, contractAddresses, provider, signer, chainId } =
    useContext(WalletContext);
  const [data, setData] = useState<Data>(initialData.data);
  const [userData, setUserData] = useState<UserData>(initialData.userData);
  const [purchaseDialogVisibleTab, setPurchaseDialogVisibleTab] =
    useState<string>('hidden');
  const [isMintDialogVisible, setIsMintDialogVisible] =
    useState<boolean>(false);
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
  }, [provider, contractAddresses]);

  const updateUserData = useCallback(async () => {
    if (!provider || !contractAddresses || !YieldMint__factory) return;

    const [deposits, minted] = await Promise.all([
      yieldMint.usersDeposit(accountAddress),
      yieldMint.didUserMint(accountAddress),
    ]);

    setUserData({ deposits: deposits, minted: minted });
  }, [accountAddress, provider, contractAddresses]);

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
          date={new Date(1645631294 * 1000)}
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
    { title: '2:22 AM 2/2/22', subTitle: 'Start CET' },
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
  }, [accountAddress]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      {provider ? (
        <PurchaseDialog
          yieldMint={yieldMint}
          timeRemaining={timeRemaining}
          open={purchaseDialogVisibleTab != 'hidden'}
          handleClose={
            (() => {
              setPurchaseDialogVisibleTab('hidden');
            }) as any
          }
          tab={purchaseDialogVisibleTab}
          userData={userData}
          data={data}
          updateData={updateData}
          updateUserData={updateUserData}
          provider={provider}
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
              className="text-[#78859E] text-center leading-7 md:leading-10 z-40 relative font-['Minecraft'] text-[1rem]"
            >
              2,222 Unique Diamond Pepes up for grabs. Free mint passes by
              staking LP Tokens. Zap In with any asset.
            </Typography>
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
                Please note that you'll need to deposit 1.5 LP tokens minimum
                per pepe for a guaranteed mint.
                <br />
                <br />
              </Typography>

              <Box className="ml-5 mb-5 md:mt-10 md:mb-0">
                <button
                  className={styles.pepeButton}
                  onClick={() => setPurchaseDialogVisibleTab('deposit')}
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
                    onClick={() => setPurchaseDialogVisibleTab('mint')}
                    disabled={!data.isFarmingPeriod}
                  >
                    {data.isFarmingPeriod ? 'Mint' : '2/4/2022'}
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
                Excess deposits that doesn't end up with additional pepes will
                also return its share of the farming reward upon withdrawing.
              </Typography>

              <Box className="ml-5 mb-5 mt-6 md:mt-10 md:mb-0">
                <Tooltip title={'Not open yet'}>
                  <button
                    className={styles.pepeButton}
                    disabled={!(!data.isFarmingPeriod && userData.minted)}
                    onClick={handleWithdraw}
                  >
                    {!(!data.isFarmingPeriod && userData.minted)
                      ? '3/3/2022'
                      : 'Withdraw'}
                  </button>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiamondPepesNfts;
