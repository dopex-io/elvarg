import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';

import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';

import axios from 'axios';
import { useNetwork } from 'wagmi';

import { useBoundStore } from 'store';

import DisclaimerDialog from 'components/common/DisclaimerDialog';

import { DEFAULT_CHAIN_ID } from 'constants/env';
import {
  DISCLAIMER_MESSAGE,
  OFAC_COMPLIANCE_LOCAL_STORAGE_KEY,
} from 'constants/index';

import ConnectButton from '../ConnectButton';
import AppLink from './AppLink';
import AppSubMenu from './AppSubMenu';
import NetworkButton from './NetworkButton';
import NftClaims from './NftClaims';
import RdpxAirdropButton from './RdpxAirdropButton';
import { LinkType } from './types';

const NotifiCard = lazy(() =>
  import('components/NotifiCard').then((module) => ({
    default: module.NotifiCard,
  })),
);

const appLinks: {
  [key: number]: LinkType[];
} = {
  1: [
    { name: 'Farms', to: '/farms' },
    { name: 'Sale', to: '/sale' },
  ],
  42161: [
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
    {
      name: 'Options',
      subLinks: [
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
          name: 'Straddles',
          to: '/straddles',
          description: 'Buy/write straddles for crypto assets',
        },
        {
          name: 'Zero Day To Expiry Options',
          to: '/zdte/eth',
          description: 'Buy/write ZDTE for crypto assets',
        },
      ],
    },
    {
      name: 'Trade',
      subLinks: [
        {
          name: 'Insured Perps',
          to: '/atlantics/manage/insured-perps/WETH-USDC',
          description: 'Open liquidation-free longs',
        },
        {
          name: 'Insured Perps LP',
          to: '/atlantics',
          description: 'Write weekly atlantic puts to earn premium + funding',
        },
        {
          name: 'Scalps',
          to: '/scalps/ETH',
          description:
            'Scalp market moves with short term positions & high leverage',
        },
        {
          name: 'DPX Bonds',
          to: '/dpx-bonds',
          description: 'Commit stables upfront to receive DPX at a discount',
        },
        {
          name: 'Tzwap',
          to: '/tzwap',
          description: 'Open TWAP orders',
        },
      ],
    },
  ],
  421613: [
    {
      name: 'V2',
      subLinks: [
        {
          name: 'Option AMM',
          to: '/option-amm/ETH-USDC',
          description: 'Trade options at margin via personalized portfolios',
        },
        {
          name: 'CLAMM',
          to: '/ssov',
          description: 'Trade options using UniswapV3 positions',
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
  { name: 'Price Oracles', to: '/oracles' },
  { name: 'Diamond Pepe NFTs', to: '/nfts/diamondpepes' },
  { name: 'Dopex NFTs', to: '/nfts/dopex' },
  { name: 'Community NFTs', to: '/nfts/community' },
];

export default function AppBar() {
  const {
    accountAddress,
    tokenPrices,
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
  const [isNotifiCardOpen, setIsNotifiCardOpen] = useState(false);

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
    const intervalId = setInterval(updateTokenPrices, 60000);

    return () => {
      clearInterval(intervalId);
    };
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
            {accountAddress && chain?.network === 'arbitrum' ? (
              <IconButton
                sx={{ mr: 1 }}
                onClick={() => setIsNotifiCardOpen(!isNotifiCardOpen)}
                className="text-white border-cod-gray bg-carbon rounded-md hover:bg-carbon hover:opacity-80"
              >
                <NotificationsIcon />
              </IconButton>
            ) : null}
            <Modal
              sx={{
                marginTop: '80px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                right: '165px',
                height: 'fit-content',
              }}
              open={isNotifiCardOpen}
              onClose={() => setIsNotifiCardOpen(false)}
              className="bg-opacity-10"
            >
              <Suspense fallback={<div>Loading...</div>}>
                <NotifiCard />
              </Suspense>
            </Modal>
            {accountAddress ? <NftClaims account={accountAddress} /> : null}
            {accountAddress ? (
              <RdpxAirdropButton account={accountAddress} />
            ) : null}
            <NetworkButton className="inline-flex mr-2" />
            <ConnectButton />
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClickMenu}
              style={{ height: 38 }}
              className="w-9 long-menu ml-2 rounded-md bg-carbon hover:bg-carbon hidden lg:flex"
              size="large"
            >
              <MoreVertIcon className="text-silver" />
            </IconButton>
            <IconButton
              onClick={handleClickMenuSmall}
              className="lg:hidden"
              size="large"
            >
              <MenuIcon className="text-white" />
            </IconButton>
            <div className="flex flex-row">
              <Menu
                anchorEl={anchorElSmall}
                open={Boolean(anchorElSmall)}
                onClose={handleCloseSmall}
                classes={{ paper: 'bg-cod-gray' }}
              >
                <div className="font-bold ml-4 my-2 text-white">App</div>
                {links?.map(({ to, name, subLinks }) => {
                  if (to)
                    return (
                      <MenuItem
                        onClick={handleCloseSmall}
                        className="ml-2 text-white"
                        key={name}
                      >
                        <AppLink to={to} name={name} />
                      </MenuItem>
                    );
                  else {
                    return subLinks!.map(
                      ({ to, name }: LinkType, i: number) => {
                        if (!to) return;
                        return (
                          <MenuItem
                            onClick={handleCloseSmall}
                            className="ml-2 text-white"
                            key={i}
                          >
                            <AppLink to={to} name={name} />
                          </MenuItem>
                        );
                      },
                    );
                  }
                })}
                <div>
                  <div className="font-bold ml-4 my-2 text-white">Links</div>
                  {menuLinks.map((item) => {
                    return (
                      <MenuItem
                        onClick={handleClose}
                        className="ml-2 text-white"
                        key={item.name}
                      >
                        <AppLink to={item.to} name={item.name} />
                      </MenuItem>
                    );
                  })}
                </div>
                <div className="border border-stieglitz" />
                <NetworkButton className="mx-3" />
              </Menu>
            </div>
            <div className="flex flex-row">
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: 'bg-cod-gray' }}
              >
                {menuLinks.map((item) => {
                  return (
                    <MenuItem
                      onClick={handleClose}
                      className="ml-2 text-white"
                      key={item.name}
                    >
                      <AppLink to={item.to} name={item.name} />
                    </MenuItem>
                  );
                })}
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
