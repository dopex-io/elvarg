import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import {
  YieldMint__factory,
  UniswapPair__factory,
  DiamondPepeNFTsPledge__factory,
  DiamondPepeNFTs__factory,
  Addresses,
} from '@dopex-io/sdk';
import Head from 'next/head';
import { BigNumber, ethers } from 'ethers';
import Countdown from 'react-countdown';

import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';

import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';

import Pledge2Dialog from '../../components/Pledge2Dialog';

import getUserReadableAmount from '../../../../utils/contracts/getUserReadableAmount';
import formatAmount from '../../../../utils/general/formatAmount';

import { Data, UserData, initialData } from '../interfaces';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from '../../../../contexts/Wallet';

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
  const abi = [
    {
      inputs: [
        { internalType: 'address', name: '_pepes', type: 'address' },
        { internalType: 'uint256', name: '_targetVote', type: 'uint256' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'LogBurn',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'pledgor',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256[]',
          name: 'tokenIds',
          type: 'uint256[]',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'LogNewPledge',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'pledgor',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'LogPledgedPepe',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      inputs: [
        { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
      ],
      name: 'burnFloors',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'burned',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTarget',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'operator', type: 'address' },
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'onERC721Received',
      outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pepes',
      outputs: [
        {
          internalType: 'contract ERC721PresetMinterPauserAutoId',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'percentPrecision',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256[][]', name: 'tokenIds', type: 'uint256[][]' },
      ],
      name: 'pledge',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'pledgeByIndex',
      outputs: [{ internalType: 'address', name: 'pledgor', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pledgeIndex',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'pledged',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'targetHit',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'targetVote',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalPledged',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];
  const pledge = useMemo(() => {
    return new ethers.Contract(
      '0x944b481d8aba4ecffdfd0081bdfe09f11123bbf8',
      abi,
      signer
    );
  }, [signer]);
  const [totalUserPledged, setTotalUserPledged] = useState<number>(0);
  const [totalPledged, setTotalPledged] = useState<number>(0);
  const winners = [];
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

  const boxes = [
    { title: 'Gen 2 (Duel Pepes)', subTitle: 'Collection' },
    { title: '22:22 PM 6/4/22', subTitle: 'Start GMT' },
    { title: `${537 - totalPledged}`, subTitle: 'Remaining to pledge' },
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
          winners={winners}
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
                  disabled={winners.length > 0}
                >
                  Deposit
                </button>
              </Box>
            </Box>
          </Box>
          <Box className="flex text-center h-[5rem]">
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

export default DiamondPepesNfts;
