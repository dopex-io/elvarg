'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { useNetwork } from 'wagmi';

import { useBoundStore } from 'store';

import DisclaimerDialog from 'components/common/DisclaimerDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/UI/Tooltip';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import {
  DISCLAIMER_MESSAGE,
  OFAC_COMPLIANCE_LOCAL_STORAGE_KEY,
} from 'constants/index';

import AppLink from './AppLink';
import AppSubMenu from './AppSubMenu';
import NftClaims from './NftClaims';
import RdpxAirdropButton from './RdpxAirdropButton';
import { LinkType } from './types';

const appLinks: {
  [key: number]: LinkType[];
} = {
  1: [
    { name: 'Farms', to: '/farms' },
    { name: 'Sale', to: '/sale' },
  ],
  42161: [
    {
      name: 'Options',
      subLinks: [
        {
          name: 'CLAMM',
          to: '/clamm/WETH-USDC',
          description: 'American Options powered by CLAMMs',
        },
        {
          name: 'SSOV',
          to: '/ssov',
          description: 'Covered calls and puts for crypto assets',
        },
        {
          name: 'Option LP',
          to: '/olp',
          description: 'Liquidity pools for SSOV options',
        },
        {
          name: 'Straddles DEPRECATED',
          to: '/straddles',
          description: 'Buy/write straddles for crypto assets',
        },
      ],
    },
    { name: 'Portfolio', to: '/portfolio' },
    { name: 'Stake', to: '/farms' },
    {
      name: 'Governance',
      subLinks: [
        {
          name: 'veDPX',
          to: '/governance/vedpx',
          description: 'Lock DPX to earn protocol fees & yield',
        },
      ],
    },
  ],
  137: [
    { name: 'Portfolio', to: '/portfolio' },
    { name: 'SSOV', to: '/ssov' },
    { name: 'Straddles', to: '/straddles' },
  ],
};

const baseAppLinks: LinkType[] = [
  {
    name: 'Analytics',
    to: 'https://dune.com/rebeca/dopex',
  },
];

const menuLinks = [
  { name: 'Home', to: 'https://dopex.io' },
  { name: 'Docs', to: 'https://docs.dopex.io/' },
  { name: 'Discord', to: 'https://discord.gg/dopex' },
  { name: 'Github', to: 'https://github.com/dopex-io' },
  { name: 'Bug Bounty', to: 'https://github.com/dopex-io/bug-bounty' },
  { name: 'Fees', to: '/fees' },
  { name: 'Dopex NFTs', to: '/nfts' },
];

export default function AppBar() {
  const {
    accountAddress,
    updateTokenPrices,
    updateAssetBalances,
    setOpenComplianceDialog,
    openComplianceDialog,
    setUserCompliant,
    provider,
  } = useBoundStore();

  const { chain } = useNetwork();

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances, provider]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElSmall, setAnchorElSmall] = useState<null | HTMLElement>(null);

  const links = (appLinks[chain?.id! || DEFAULT_CHAIN_ID] || []).concat(
    baseAppLinks,
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleCloseSmall = useCallback(() => setAnchorElSmall(null), []);

  const handleClickMenu = useCallback(
    (event: any) => setAnchorEl(event.currentTarget),
    [],
  );

  const handleClickMenuSmall = useCallback(
    (event: any) => setAnchorElSmall(event.currentTarget),
    [],
  );

  const userComplianceCheck = useCallback(async () => {
    if (!accountAddress) return;

    let data = localStorage.getItem(accountAddress) as any;
    let signature: string | null = null;
    // If signature does not exit in local storage
    if (!data) {
      // Get signature from api
      try {
        await axios
          .get(
            `https://flo7r5qw6dj5mi337w2esfvhhm0caese.lambda-url.us-east-1.on.aws/?address=${ethers.utils.getAddress(
              accountAddress,
            )}`,
          )
          .then((res) => {
            signature = res.data.signature;
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      let objectified = JSON.parse(data) as any;
      signature = objectified[OFAC_COMPLIANCE_LOCAL_STORAGE_KEY];
    }

    if (!signature) {
      setUserCompliant(false);
      return;
    }

    const signatureSigner = ethers.utils.verifyMessage(
      DISCLAIMER_MESSAGE['english'],
      signature,
    );

    if (signatureSigner === accountAddress) setUserCompliant(true);
  }, [accountAddress, setUserCompliant]);

  useEffect(() => {
    userComplianceCheck();
  }, [userComplianceCheck]);

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances]);

  useEffect(() => {
    updateTokenPrices();
  }, [updateTokenPrices]);

  return (
    <>
      <DisclaimerDialog
        open={openComplianceDialog}
        handleClose={setOpenComplianceDialog}
      />
      <nav className="fixed top-0 w-full text-gray-600 z-50 backdrop-blur-sm h-[74px]">
        <div className="flex w-full items-center container pl-5 pr-5 lg:pl-10 lg:pr-10 p-4 justify-between mx-auto max-w-full">
          <div className="flex items-center">
            <Link
              className="flex items-center mr-10 cursor-pointer hover:no-underline"
              href="/"
            >
              <img
                src="/images/brand/logo.svg"
                className="w-9 text-left"
                alt="logo"
              />
            </Link>
            <div className="space-x-10 mr-10 hidden lg:flex">
              {links?.map((link) => {
                if (link.subLinks) {
                  return (
                    <AppSubMenu
                      key={link.name}
                      menuName={link.name}
                      links={link.subLinks}
                    />
                  );
                }
                return (
                  <AppLink
                    to={link.to || ''}
                    name={link.name}
                    key={link.name}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src="/images/misc/camera-pepe-hd.png"
                      alt="camera-pepe-hd"
                      className="w-8 h-auto mr-4"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 bg-black/30 backdrop-blur-md">
                    <p className="text-stieglitz">
                      Your activity is being recorded for a future retroactive{' '}
                      <s>REDACTED</s>.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {accountAddress ? <NftClaims account={accountAddress} /> : null}
            {accountAddress ? (
              <RdpxAirdropButton account={accountAddress} />
            ) : null}
            <ConnectButton />
          </div>
        </div>
      </nav>
    </>
  );
}
