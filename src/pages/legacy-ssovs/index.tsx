import { useState, useCallback } from 'react';
import { ethers, Signer } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { Addresses, SsovV3Viewer__factory } from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import WalletButton from 'components/common/WalletButton';
import SsovCard from 'components/legacy-ssovs/SsovCard';

const fetchDepositsForV2 = async (ssovs: any, signer: Signer) => {
  const v2Abi = [
    'function getUserEpochDeposits(uint256, address) view returns (uint256[])',
  ];

  const userAddress = await signer.getAddress();

  const epochDepositCalls = await Promise.all(
    ssovs
      .map((ssov: { address: string; currentEpoch: number }) => {
        const _calls = [];

        const _contract = new ethers.Contract(ssov.address, v2Abi, signer);

        for (let i = 1; i <= ssov.currentEpoch; i++) {
          _calls.push(_contract['getUserEpochDeposits'](i, userAddress));
        }

        return _calls;
      })
      .flat()
  );

  // Rearrange epoch deposit calls
  const finalSsovs = ssovs.map((ssov: { currentEpoch: number }, i: number) => {
    const userDeposits = epochDepositCalls.slice(i, i + ssov.currentEpoch);

    return { ...ssov, userDeposits };
  });

  return finalSsovs;
};

const fetchDepositsForV3 = async (ssovs: any, signer: Signer) => {
  const viewer = SsovV3Viewer__factory.connect(
    Addresses[42161]['SSOV-V3']['VIEWER'],
    signer
  );

  const userAddress = await signer.getAddress();

  const userWritePositions = await Promise.all(
    ssovs.map((ssov: { address: string; currentEpoch: number }) => {
      return viewer.walletOfOwner(userAddress, ssov.address);
    })
  );

  // Rearrange epoch deposit calls
  const finalSsovs = ssovs.map((ssov: any) => {
    return { ...ssov, userWritePositions };
  });

  return finalSsovs;
};

const baseAbi = ['function currentEpoch() view returns (uint256)'];

const LegacySsovs = () => {
  const { signer } = useBoundStore();
  const [ssovs, setSsovs] = useState<any>([]);

  const handleCheckDeposits = useCallback(async () => {
    if (!signer) return;
    let data = await axios
      .get(
        `https://dopex-api-git-feat-retired-ssovs-dopex-io.vercel.app/v2/ssov/retired`
      )
      .then((payload) => payload.data);

    const ssovCurrentEpochs = await Promise.all(
      data.map((ssov: { address: string }) => {
        const _contract = new ethers.Contract(ssov.address, baseAbi, signer);

        return _contract['currentEpoch']();
      })
    );

    // Insert data to ssovs
    const ssovs = data.map((ssov: any, i: number) => {
      return { ...ssov, currentEpoch: ssovCurrentEpochs[i].toNumber() };
    });

    const ssovV2 = ssovs.filter(
      (ssov: { version: number }) => ssov.version === 2
    );
    const ssovV3 = ssovs.filter(
      (ssov: { version: number }) => ssov.version === 3
    );

    const ssovV2WithDeposits = await fetchDepositsForV2(ssovV2, signer);

    const ssovV3WithDeposits = await fetchDepositsForV3(ssovV3, signer);

    setSsovs(ssovV2WithDeposits.concat(ssovV3WithDeposits));
  }, [signer]);

  // const handleCheckOptions = useCallback(async () => {
  //   if (!signer) return;
  //   let data = await axios
  //     .get(`http://localhost:5001/v2/ssov/retired`)
  //     .then((payload) => payload.data);

  //   const ssovCurrentEpochs = await Promise.all(
  //     data.map((ssov: { address: string }) => {
  //       const _contract = new ethers.Contract(ssov.address, baseAbi, signer);

  //       return _contract['currentEpoch']();
  //     })
  //   );

  //   // Insert data to ssovs
  //   const ssovs = data.map((ssov: any, i: number) => {
  //     return { ...ssov, currentEpoch: ssovCurrentEpochs[i].toNumber() };
  //   });

  //   const ssovV2 = ssovs.filter(
  //     (ssov: { version: number }) => ssov.version === 2
  //   );
  //   const ssovV3 = ssovs.filter(
  //     (ssov: { version: number }) => ssov.version === 3
  //   );

  //   const ssovV2WithDeposits = await fetchDepositsForV2(ssovV2, signer);

  //   const ssovV3WithDeposits = await fetchDepositsForV3(ssovV3, signer);

  //   setSsovs(ssovV2WithDeposits.concat(ssovV3WithDeposits));
  // }, [signer]);

  return (
    <Box className="bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Legacy SSOVs | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="mb-2">
            Legacy SSOVs
          </Typography>
          <Typography variant="h5" className="text-stieglitz mb-2">
            Withdraw and settle your write positions and options respectively
            from legacy ssov contracts which have been retired.
          </Typography>
          <WalletButton onClick={handleCheckDeposits}>
            Check Deposits
          </WalletButton>
          {/* <WalletButton onClick={handleCheckOptions}>
            Check Options
          </WalletButton> */}
        </Box>
        {ssovs.map((ssov: any) => {
          return <SsovCard key={ssov.symbol} ssov={ssov} />;
        })}
      </Box>
    </Box>
  );
};

export default LegacySsovs;
