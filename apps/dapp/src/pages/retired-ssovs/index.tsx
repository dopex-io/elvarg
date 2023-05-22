import { useCallback, useState } from 'react';

import Head from 'next/head';

import { BigNumber, Signer, ethers } from 'ethers';

import {
  Addresses,
  ERC20__factory,
  SsovV3Viewer__factory,
} from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import AppBar from 'components/common/AppBar';
import SignerButton from 'components/common/SignerButton';
import SsovDepositCard from 'components/retired-ssovs/SsovDepositCard';
import SsovOption from 'components/retired-ssovs/SsovOption';

import { DOPEX_API_BASE_URL } from 'constants/env';
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

  let count = 0;
  // Rearrange epoch deposit calls
  const finalSsovs = ssovs.map((ssov) => {
    const userDeposits: BigNumber[][] = epochDepositCalls.slice(
      count,
      count + ssov.currentEpoch!
    );

    count = count + ssov.currentEpoch!;

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
  const [options, setOptions] = useState<any>([]);
  const [deposits, setDeposits] = useState<any>([]);
  const [ssovsLoading, setSsovsLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const handleCheckDeposits = useCallback(async () => {
    if (!signer) return;
    setSsovsLoading(true);
    let data: Ssov[] = await axios
      .get(`${DOPEX_API_BASE_URL}/v2/ssov/retired`)
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

    const _deposits: any[] = [];

    ssovV2WithDeposits.forEach((ssov) => {
      ssov.userDeposits.forEach((epochDeposits: BigNumber[], epoch: number) => {
        epochDeposits.forEach((deposit: BigNumber, strikeIndex: number) => {
          if (!deposit.isZero()) {
            _deposits.push({
              ssovSymbol: ssov.symbol,
              ssovAddress: ssov.address,
              epoch: epoch + 1,
              strikeIndex,
              amount: deposit,
              version: 2,
            });
          }
        });
      });
    });

    ssovV3WithDeposits.forEach((ssov) => {
      ssov.userWritePositions.forEach((id) => {
        _deposits.push({
          ssovSymbol: ssov.symbol,
          ssovAddress: ssov.address,
          version: 3,
          id,
        });
      });
    });

    setDeposits(_deposits);
    setSsovsLoading(false);
  }, [signer]);

  const handleCheckOptions = useCallback(async () => {
    if (!signer || !accountAddress) return;

    setOptionsLoading(true);

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
    setOptionsLoading(false);
  }, [signer, accountAddress]);

  return (
    <Box className="min-h-screen">
      <Head>
        <title>Retired SSOVs | Dopex</title>
      </Head>
      <AppBar />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="max-w-xl mb-8 mt-32">
          <Typography variant="h2" className="mb-2">
            Retired SSOVs
          </Typography>
          <Typography variant="h5" className="text-stieglitz mb-3">
            Withdraw and settle your write positions and options respectively
            from ssov contracts which have been retired.
          </Typography>
          <SignerButton onClick={handleCheckDeposits} className="mr-2">
            Check Deposits
          </SignerButton>
          <SignerButton onClick={handleCheckOptions}>
            Check Options
          </SignerButton>
        </Box>
        <Box className="mb-4">
          <Typography variant="h3" className="mb-2">
            Deposits
          </Typography>
          {ssovsLoading ? (
            <CircularProgress />
          ) : deposits.length > 0 ? (
            deposits.map((deposit: any, index: any) => {
              return <SsovDepositCard key={index} deposit={deposit} />;
            })
          ) : (
            'Nothing to show here.'
          )}
        </Box>
        <Box>
          <Typography variant="h3" className="mb-2">
            Options
          </Typography>
          {optionsLoading ? (
            <CircularProgress />
          ) : options.length > 0 ? (
            options.map((option: any) => {
              return <SsovOption key={option.token} option={option} />;
            })
          ) : (
            'Nothing to show here.'
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RetiredSsovs;
