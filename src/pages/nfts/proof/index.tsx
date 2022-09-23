import Head from 'next/head';
import { useContext, useState, useCallback } from 'react';

import { ethers } from 'ethers';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import { WalletContext } from 'contexts/Wallet';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';

import styles from 'components/nfts/duel/styles.module.scss';

const Proof = () => {
  const [message, setMessage] = useState('');
  const { accountAddress, signer } = useContext(WalletContext);
  const broadcast = useCallback(async () => {
    if (!signer || !accountAddress) return;

    await signer.sendTransaction({
      to: accountAddress,
      value: 0,
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)),
    });

    setMessage('');
  }, [accountAddress, message, signer]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Duel Pepes Verify | Dopex</title>
      </Head>

      <Box className={styles['background'] ?? ''}>
        <Box className={styles['backgroundOverlay'] ?? ''} />
        <Box className={styles['mobileBackgroundOverlay'] ?? ''} />
        <AppBar />

        <Box className="pt-28 md:pt-32 pb-6lg:max-w-9xl md:max-w-7xl sm:max-w-xl mx-auto px-4 lg:px-0">
          <Box className="text-center mx-auto md:mb-12 lg:mt-24 flex">
            <img
              src={'/images/nfts/pepes/duel-pepe-logo.png'}
              className="ml-auto mr-auto z-1 relative md:w-[50rem] w-60"
              alt="Pepe"
            />
          </Box>
          <Box className="mt-6 md:mt-2 max-w-4xl mx-auto">
            <Typography
              variant="h4"
              className="text-[#78859E] text-center md:leading-10 z-1 relative font-['Minecraft']"
            >
              Broadcast a message through a transaction on Arbitrum to prove you
              are the effective owner of a Diamond Pepe
            </Typography>
          </Box>
          <Box className="mt-12 max-w-4xl mx-auto">
            <Input
              disableUnderline={true}
              name="address"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-13 text-lg text-white mb-5 w-full border border-mineshaft p-3"
              placeholder="Enter your message"
              classes={{ input: 'text-white' }}
            />

            <button className={styles['pepeButtonFluid']} onClick={broadcast}>
              Broadcast
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Proof;
