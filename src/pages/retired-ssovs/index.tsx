import { useState, useCallback } from 'react';
import { BigNumber, ethers, Signer } from 'ethers';
import axios from 'axios';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {
  Addresses,
  SsovV3Viewer__factory,
  ERC20__factory,
} from '@dopex-io/sdk';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import WalletButton from 'components/common/WalletButton';
import SsovDepositCard from 'components/retired-ssovs/SsovDepositCard';
import SsovOption from 'components/retired-ssovs/SsovOption';

import retiredStrikeTokens from 'constants/json/retiredStrikeTokens.json';

interface Ssov {
  type: string;
  underlyingSymbol: string;
  symbol: string;
  version: number;
  chainId: number;
  collateralDecimals: number;
  duration: string;
  retired: boolean;
  address: string;
  currentEpoch?: number;
  userDeposits?: BigNumber[][];
  userWritePositions?: BigNumber[];
}

const fetchDepositsForV2 = async (ssovs: Ssov[], signer: Signer) => {
  const v2Abi = [
    'function getUserEpochDeposits(uint256, address) view returns (uint256[])',
  ];

  const userAddress = await signer.getAddress();

  const epochDepositCalls = await Promise.all(
    ssovs
      .map((ssov) => {
        const _calls = [];

        const _contract = new ethers.Contract(ssov.address, v2Abi, signer);

        for (let i = 1; i <= ssov.currentEpoch!; i++) {
          _calls.push(_contract['getUserEpochDeposits'](i, userAddress));
        }

        return _calls;
      })
      .flat()
  );

  // Rearrange epoch deposit calls
  const finalSsovs = ssovs.map((ssov, i: number) => {
    const userDeposits: BigNumber[][] = epochDepositCalls.slice(
      i,
      i + ssov.currentEpoch!
    );

    return { ...ssov, userDeposits };
  });

  return finalSsovs;
};

const fetchDepositsForV3 = async (ssovs: Ssov[], signer: Signer) => {
  const viewer = SsovV3Viewer__factory.connect(
    Addresses[42161]['SSOV-V3']['VIEWER'],
    signer
  );

  const userAddress = await signer.getAddress();

  const userWritePositions = await Promise.all(
    ssovs.map((ssov) => {
      return viewer.walletOfOwner(userAddress, ssov.address);
    })
  );

  // Rearrange epoch deposit calls
  const finalSsovs = ssovs.map((ssov, i) => {
    return { ...ssov, userWritePositions: userWritePositions[i] || [] };
  });

  return finalSsovs;
};

const baseAbi = ['function currentEpoch() view returns (uint256)'];

const RetiredSsovs = () => {
  const { signer, accountAddress } = useBoundStore();
  const [ssovs, setSsovs] = useState<Ssov[]>([]);
  const [options, setOptions] = useState<any>([]);

  const handleCheckDeposits = useCallback(async () => {
    if (!signer) return;
    let data: Ssov[] = await axios
      .get(
        `https://dopex-api-git-feat-retired-ssovs-dopex-io.vercel.app/v2/ssov/retired`
      )
      .then((payload) => payload.data);

    const ssovCurrentEpochs = await Promise.all(
      data.map((ssov) => {
        const _contract = new ethers.Contract(ssov.address, baseAbi, signer);

        return _contract['currentEpoch']();
      })
    );

    // Insert data to ssovs
    const _ssovs = data.map((ssov: any, i: number) => {
      return { ...ssov, currentEpoch: ssovCurrentEpochs[i].toNumber() };
    });

    const ssovV2 = _ssovs.filter(
      (ssov: { version: number }) => ssov.version === 2
    );
    const ssovV3 = _ssovs.filter(
      (ssov: { version: number }) => ssov.version === 3
    );

    const ssovV2WithDeposits = await fetchDepositsForV2(ssovV2, signer);

    const ssovV3WithDeposits = await fetchDepositsForV3(ssovV3, signer);

    // @ts-ignore
    setSsovs(ssovV2WithDeposits.concat(ssovV3WithDeposits));
  }, [signer]);

  const handleCheckOptions = useCallback(async () => {
    if (!signer || !accountAddress) return;

    const balanceCalls = retiredStrikeTokens.map(
      (strikeToken: { token: string }) => {
        const erc20 = ERC20__factory.connect(strikeToken.token, signer);

        return erc20.balanceOf(accountAddress);
      }
    );

    const balances = await Promise.all(balanceCalls);

    const _options: any = [];

    balances.forEach((bal, index) => {
      if (!bal.isZero()) {
        _options.push({
          ...retiredStrikeTokens[index],
          balance: bal,
        });
      }
    });

    setOptions(_options);
  }, [signer, accountAddress]);

  return (
    <Box className="bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Retired SSOVs | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="text-center mx-auto max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="mb-2">
            Retired SSOVs
          </Typography>
          <Typography variant="h5" className="text-stieglitz mb-2">
            Withdraw and settle your write positions and options respectively
            from ssov contracts which have been retired.
          </Typography>
          <WalletButton onClick={handleCheckDeposits} className="mr-2">
            Check Deposits
          </WalletButton>
          <WalletButton onClick={handleCheckOptions}>
            Check Options
          </WalletButton>
        </Box>
        {ssovs.map((ssov) => {
          return <SsovDepositCard key={ssov.symbol} ssov={ssov} />;
        })}
        {options.length > 0 ? (
          <Typography variant="h3" className="mb-2">
            Options
          </Typography>
        ) : null}
        {options.map((option: any) => {
          return <SsovOption key={option.token} option={option} />;
        })}
      </Box>
    </Box>
  );
};

export default RetiredSsovs;
