import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useNetwork } from 'wagmi';

import { useBoundStore } from 'store';

import { DEFAULT_CHAIN_ID } from 'constants/env';

import ConnectButton from '../ConnectButton';
import AppLink from './AppLink';
import AppSubMenu from './AppSubMenu';
import NetworkButton from './NetworkButton';
import { LinkType } from './types';

const appLinks: {
  [key: number]: LinkType[];
} = {
  42161: [{ name: 'Duel', to: '/duel' }],
};

const menuLinks = [{ name: 'Dopex', to: 'https://dopex.io' }];

export default function AppBar() {
  const { accountAddress, updateTokenPrices, updateAssetBalances, provider } =
    useBoundStore();

  const { chain } = useNetwork();

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances, provider]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElSmall, setAnchorElSmall] = useState<null | HTMLElement>(null);
  const [isNotifiCardOpen, setIsNotifiCardOpen] = useState(false);

  const links = appLinks[chain?.id! || DEFAULT_CHAIN_ID] || [];

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
                className="text-white border-cod-gray bg-black bg-opacity-30  rounded-md hover:bg-carbon hover:opacity-80"
              >
                <NotificationsIcon />
              </IconButton>
            ) : null}
            <NetworkButton className="inline-flex mr-2 !bg-black !bg-opacity-30" />
            <ConnectButton />
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClickMenu}
              style={{ height: 38 }}
              className="w-9 long-menu ml-2 rounded-md !bg-black !bg-opacity-30 hidden lg:flex"
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
