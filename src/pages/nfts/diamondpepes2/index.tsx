import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import Head from 'next/head';

import Box from '@mui/material/Box';

import ActionsDialog from 'components/nfts/diamondpepes2/ActionsDialog';
import Typography from 'components/UI/Typography';
import AppBar from 'components/AppBar';

import styles from 'components/nfts/diamondpepes2/styles.module.scss';
import { BigNumber, ethers } from 'ethers';
import { WalletContext } from '../../../contexts/Wallet';
import Countdown from 'react-countdown';

const ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_layerZeroEndpoint', type: 'address' },
      { internalType: 'uint256', name: '_startMintId', type: 'uint256' },
      { internalType: 'uint256', name: '_maxPublicMints', type: 'uint256' },
      { internalType: 'uint256', name: '_mintPrice', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_srcChainId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_srcAddress',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: '_nonce',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_payload',
        type: 'bytes',
      },
    ],
    name: 'MessageFailed',
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_srcChainId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_toAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: '_nonce',
        type: 'uint64',
      },
    ],
    name: 'ReceiveFromChain',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint16',
        name: '_dstChainId',
        type: 'uint16',
      },
      {
        indexed: true,
        internalType: 'bytes',
        name: '_toAddress',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: '_nonce',
        type: 'uint64',
      },
    ],
    name: 'SendToChain',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_srcChainId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_srcAddress',
        type: 'bytes',
      },
    ],
    name: 'SetTrustedRemote',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'number', type: 'uint256' }],
    name: 'adminMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'time', type: 'uint256' }],
    name: 'adminSetEndTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'time', type: 'uint256' }],
    name: 'adminSetStartTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'adminWithdrawAPE',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'endTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_toAddress', type: 'bytes' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'bool', name: '_useZro', type: 'bool' },
      { internalType: 'bytes', name: '_adapterParams', type: 'bytes' },
    ],
    name: 'estimateSendFee',
    outputs: [
      { internalType: 'uint256', name: 'nativeFee', type: 'uint256' },
      { internalType: 'uint256', name: 'zroFee', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      { internalType: 'bytes', name: '', type: 'bytes' },
      { internalType: 'uint64', name: '', type: 'uint64' },
    ],
    name: 'failedMessages',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_srcAddress', type: 'bytes' },
    ],
    name: 'forceResumeReceive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_version', type: 'uint16' },
      { internalType: 'uint16', name: '_chainId', type: 'uint16' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '_configType', type: 'uint256' },
    ],
    name: 'getConfig',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_srcAddress', type: 'bytes' },
    ],
    name: 'isTrustedRemote',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lzEndpoint',
    outputs: [
      {
        internalType: 'contract ILayerZeroEndpoint',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_srcAddress', type: 'bytes' },
      { internalType: 'uint64', name: '_nonce', type: 'uint64' },
      { internalType: 'bytes', name: '_payload', type: 'bytes' },
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxPublicMints',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'number', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPriceInApe',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'number', type: 'uint256' }],
    name: 'mintWithAPE',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextMintId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_srcAddress', type: 'bytes' },
      { internalType: 'uint64', name: '_nonce', type: 'uint64' },
      { internalType: 'bytes', name: '_payload', type: 'bytes' },
    ],
    name: 'nonblockingLzReceive',
    outputs: [],
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
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'publicMints',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_srcAddress', type: 'bytes' },
      { internalType: 'uint64', name: '_nonce', type: 'uint64' },
      { internalType: 'bytes', name: '_payload', type: 'bytes' },
    ],
    name: 'retryMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_toAddress', type: 'bytes' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      {
        internalType: 'address payable',
        name: '_refundAddress',
        type: 'address',
      },
      { internalType: 'address', name: '_zroPaymentAddress', type: 'address' },
      { internalType: 'bytes', name: '_adapterParams', type: 'bytes' },
    ],
    name: 'send',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_toAddress', type: 'bytes' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      {
        internalType: 'address payable',
        name: '_refundAddress',
        type: 'address',
      },
      { internalType: 'address', name: '_zroPaymentAddress', type: 'address' },
      { internalType: 'bytes', name: '_adapterParams', type: 'bytes' },
    ],
    name: 'sendFrom',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_version', type: 'uint16' },
      { internalType: 'uint16', name: '_chainId', type: 'uint16' },
      { internalType: 'uint256', name: '_configType', type: 'uint256' },
      { internalType: 'bytes', name: '_config', type: 'bytes' },
    ],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_version', type: 'uint16' }],
    name: 'setReceiveVersion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_version', type: 'uint16' }],
    name: 'setSendVersion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'bytes', name: '_srcAddress', type: 'bytes' },
    ],
    name: 'setTrustedRemote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    name: 'trustedRemoteLookup',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const DiamondPepesNfts = () => {
  const { provider, signer, accountAddress } = useContext(WalletContext);
  const [data, setData] = useState<{
    publicMints: BigNumber;
    nextMintId: BigNumber;
    maxPublicMints: BigNumber;
    mintPrice: BigNumber;
    mintPriceInApe: BigNumber;
    endTime: BigNumber;
    startTime: BigNumber;
  }>();

  const publicSaleContract = new ethers.Contract(
    '0x12F0a58FD2cf60b929f6Ff4523A13B56585a2b4D',
    ABI,
    signer
  );

  const [actionsDialogDisplayState, setActionsDialogDisplayState] = useState({
    visible: false,
    tab: 'mint',
  });

  const boxes = useMemo(
    () => [
      {
        title: data?.maxPublicMints.sub(data?.nextMintId)?.toNumber(),
        subTitle: 'PEPES REMAINING',
      },
      { title: '5:55PM 5/12/2022', subTitle: 'START' },
      {
        title: (
          <Countdown
            date={new Date(data?.endTime?.toNumber() * 1000)}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return (
                  <span className="text-wave-blue">
                    The sale has been closed
                  </span>
                );
              } else {
                return (
                  <span className="text-wave-blue">
                    {days}d {hours}h {minutes}m {seconds}s
                  </span>
                );
              }
            }}
          />
        ),
        subTitle: 'TIME REMAINING',
      },
    ],
    [data]
  );

  const updateData = useCallback(async () => {
    if (!provider) return;

    const [
      publicMints,
      nextMintId,
      maxPublicMints,
      mintPrice,
      endTime,
      startTime,
    ] = await Promise.all([
      publicSaleContract.publicMints(),
      publicSaleContract.nextMintId(),
      publicSaleContract.maxPublicMints(),
      publicSaleContract.mintPrice(),
      publicSaleContract.endTime(),
      publicSaleContract.startTime(),
    ]);

    let mintPriceInApe = BigNumber.from('0');

    if (signer)
      mintPriceInApe = await publicSaleContract
        .connect(signer)
        .callStatic.mintPriceInApe();

    setData({
      publicMints: publicMints,
      nextMintId: nextMintId,
      maxPublicMints: maxPublicMints,
      mintPrice: mintPrice,
      mintPriceInApe: mintPriceInApe,
      endTime: endTime,
      startTime: startTime,
    });
  }, [provider, publicSaleContract, signer, accountAddress]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  return (
    <Box className="bg-black min-h-screen">
      <Head>
        <title>Diamond Pepes NFTs | Dopex</title>
      </Head>
      <ActionsDialog
        open={actionsDialogDisplayState.visible}
        tab={actionsDialogDisplayState.tab}
        handleClose={() => {
          setActionsDialogDisplayState({ visible: false, tab: 'mint' });
        }}
        data={data}
        updateData={updateData}
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
              alt="Pepe"
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
            {boxes.map((box, index) => (
              <Box key={index} className="md:w-1/3 p-4 text-center">
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
            alt={''}
          />
          <Box className="flex">
            <Box className="ml-auto mr-auto mb-5 mt-5 lg:w-[7rem]">
              <button
                className={styles.pepeButton}
                onClick={() =>
                  setActionsDialogDisplayState({ visible: true, tab: 'mint' })
                }
              >
                MINT
              </button>
            </Box>
          </Box>
          <Box className="p-2 mt-7 md:flex">
            <Box className="md:w-1/3 p-4 text-center">
              <img
                src={'/assets/pepe-header-1.png'}
                className="w-40 ml-auto mr-auto"
                alt={'Pepe'}
              />
              <img
                src={'/assets/pledge-pepe-button.png'}
                className="w-48 z-50 mt-12 ml-auto mr-auto cursor-pointr"
                alt={'Pepe Button'}
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
                <img
                  src={'/assets/export.svg'}
                  className={'w-5 ml-auto'}
                  alt={'Export'}
                />
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
                src={'/assets/hand-pepe.png'}
                className="w-32 ml-auto mr-auto"
                alt={'Pepe'}
              />
              <img
                src={'/assets/reveal-pepe-button.png'}
                className="w-60 z-50 mt-12 ml-auto mr-auto cursor-pointer"
                alt={'Reveal Pepe'}
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
                <img
                  src={'/assets/export.svg'}
                  className={'w-4 ml-auto'}
                  alt={'Export'}
                />
                <Typography
                  variant="h5"
                  className="text-[#78859E] font-['Minecraft'] relative z-1 mr-auto ml-2"
                >
                  <span className={styles.pepeLink}>Tofunft</span>
                </Typography>

                <img
                  src={'/assets/pepe-tweet.png'}
                  className={'w-6 h-5 ml-auto'}
                  alt={'Pepe tweet'}
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
                  alt={'Pepe tweet'}
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
                src={'/assets/joypad-pepe.png'}
                className="w-36 ml-auto mr-auto mt-9 mb-14"
                alt={'Joypad'}
              />
              <img
                src={'/assets/duel-pepe-button.png'}
                className="w-56 z-50 mt-12 ml-auto mr-auto cursor-pointer"
                alt={'Duel Pepe'}
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
                <img
                  src={'/assets/export.svg'}
                  className={'w-5 ml-auto'}
                  alt={'Export'}
                />
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
