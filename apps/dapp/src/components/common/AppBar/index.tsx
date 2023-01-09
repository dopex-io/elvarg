import {
  useCallback,
  useMemo,
  useState,
  ReactNode,
  MouseEvent,
  Key,
  useEffect,
  SetStateAction,
} from 'react';
import Router from 'next/router';
import { ethers } from 'ethers';
import cx from 'classnames';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

import ClaimRdpxDialog from './ClaimRdpxDialog';
import NetworkButton from './NetworkButton';
import Typography from 'components/UI/Typography';
import WalletDialog from 'components/common/AppBar/WalletDialog';
import CustomButton from 'components/UI/Button';
import PriceCarousel from 'components/common/AppBar/PriceCarousel';
import DisclaimerDialog from 'components/common/DisclaimerDialog';

import { getWeb3Modal } from 'store/Wallet/getWeb3Modal';
import { useBoundStore } from 'store';

import {
  CHAIN_ID_TO_RPC,
  CURRENCIES_MAP,
  DISCLAIMER_MESSAGE,
  OFAC_COMPLIANCE_LOCAL_STORAGE_KEY,
  PAGE_TO_SUPPORTED_CHAIN_IDS,
} from 'constants/index';
import { DEFAULT_CHAIN_ID } from 'constants/env';

import formatAmount from 'utils/general/formatAmount';
import displayAddress from 'utils/general/displayAddress';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const AppLink = ({
  name,
  to,
  active,
  children,
}: {
  name: Key | null | undefined;
  to: string;
  active?: boolean;
  children?: ReactNode;
}) => {
  const linkClassName = cx(
    'hover:no-underline hover:text-white cursor-pointer',
    active ? 'text-white' : 'text-stieglitz'
  );

  if (to.startsWith('http')) {
    return (
      <a
        href={to}
        className={children ? '' : linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children ? children : name}
      </a>
    );
  } else {
    return (
      <Link href={to} passHref>
        <Box className={children ? '' : linkClassName}>
          {children ? children : name}
        </Box>
      </Link>
    );
  }
};

type LinkType = {
  name: string;
  to?: string;
  description: string;
  subLinks?: LinkType[];
};

const AppSubMenu = ({
  menuName,
  links,
}: {
  menuName: Key | null | undefined;
  links: LinkType[];
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    (event: { currentTarget: SetStateAction<HTMLElement | null> }) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);

  return (
    <>
      <Typography
        variant="h5"
        onClick={handleClick}
        color="stieglitz"
        className="cursor-pointer"
      >
        {menuName}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: 'bg-cod-gray' }}
      >
        {links.map((link) => {
          return (
            <MenuItem onClick={handleClose} key={link.name}>
              <Box className="flex flex-col">
                <AppLink
                  to={link.to || ''}
                  name={link.name}
                  active={link.name === menuName}
                >
                  <Typography variant="h6">{link.name}</Typography>
                  <Typography variant="caption" color="stieglitz">
                    {link.description}
                  </Typography>
                </AppLink>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

const appLinks = {
  1: [
    { name: 'Farms', to: '/farms' },
    { name: 'Sale', to: '/sale' },
  ],
  56: [{ name: 'SSOV', to: '/ssov' }],
  1337: [
    { name: 'options', to: '/' },
    { name: 'pools', to: '/pools' },
    { name: 'portfolio', to: '/portfolio' },
    { name: 'faucet', to: '/faucet' },
    { name: 'Atlantics', to: '/atlantics' },
  ],
  421613: [],
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
        { name: 'Lending', to: '/lending', description: 'Lending' },
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
  43114: [{ name: 'SSOV', to: '/ssov' }],
  1088: [{ name: 'SSOV', to: '/ssov' }],
  5: [
    { name: 'faucet', to: '/faucet' },
    { name: 'OLP', to: '/olp' },
  ],
  137: [{ name: 'Straddles', to: '/straddles' }],
  421613: [{ name: 'Lending', to: '/lending' }],
};

const menuLinks = [
  { name: 'Home', to: 'https://dopex.io' },
  { name: 'Docs', to: 'https://docs.dopex.io/' },
  { name: 'Discord', to: 'https://discord.gg/dopex' },
  { name: 'Github', to: 'https://github.com/dopex-io' },
  { name: 'Price Oracles', to: '/oracles' },
  { name: 'Diamond Pepe NFTs', to: 'https://dp2.dopex.io' },
  { name: 'Dopex NFTs', to: '/nfts/dopex' },
  { name: 'Community NFTs', to: '/nfts/community' },
];

interface AppBarProps {
  active?:
    | 'options'
    | 'pools'
    | 'rewards'
    | 'Stake'
    | 'Governance'
    | 'volume pool'
    | 'Portfolio'
    | 'token sale'
    | 'faucet'
    | 'Rate Vaults'
    | 'Straddles'
    | 'OLPs'
    | 'SSOV'
    | 'leaderboard'
    | 'swap'
    | 'DPX Bonds'
    | 'OLP'
    | 'Lending';
}

export default function AppBar(props: AppBarProps) {
  const { active } = props;
  const {
    accountAddress,
    connect,
    provider,
    wrongNetwork,
    chainId,
    ensName,
    ensAvatar,
    updateState,
    tokenPrices,
    updateTokenPrices,
    userAssetBalances,
    updateAssetBalances,
    setOpenComplianceDialog,
    openComplianceDialog,
    setUserCompliant,
  } = useBoundStore();

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances, provider]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElSmall, setAnchorElSmall] = useState<null | HTMLElement>(null);
  const [walletDialog, setWalletDialog] = useState(false);
  const [claimRdpxDialog, setClaimRdpxDialog] = useState(false);
  // TODO: FIX
  // @ts-ignore
  const links = appLinks[chainId];

  const handleRdpxDialogClose = () => setClaimRdpxDialog(false);

  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleCloseSmall = useCallback(() => setAnchorElSmall(null), []);

  const handleWalletConnect = useCallback(() => {
    connect && connect();
  }, [connect]);

  const handleWalletDialogClose = useCallback(() => {
    setWalletDialog(false);
  }, []);

  const handleClickMenu = useCallback(
    (event: MouseEvent<HTMLButtonElement, MouseEvent>) =>
      setAnchorEl(event.currentTarget),
    []
  );

  const handleClickMenuSmall = useCallback(
    (event: MouseEvent<HTMLButtonElement, MouseEvent>) =>
      setAnchorElSmall(event.currentTarget),
    []
  );

  const handleClick = useCallback(() => {
    setWalletDialog(true);
  }, []);

  const walletButtonContent = useMemo(() => {
    if (wrongNetwork) return 'Wrong Network';
    if (accountAddress) return displayAddress(accountAddress, ensName);
    return '';
  }, [accountAddress, ensName, wrongNetwork]);

  const handleClaimRdpx = () => {
    setClaimRdpxDialog(true);
  };

  const userComplianceCheck = useCallback(async () => {
    if (!accountAddress) return;

    let data = localStorage.getItem(accountAddress) as any;
    let signature: string | null = null;
    // If signature does not exit in local storage
    if (!data) {
      // Get signature from api
      let res;
      try {
        res = await axios.get(
          `https://flo7r5qw6dj5mi337w2esfvhhm0caese.lambda-url.us-east-1.on.aws/?address=${accountAddress}`
        );
      } catch (err) {
        console.log(err);
      }
      signature = res ? res.data.signature : null;
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
      signature
    );

    if (signatureSigner === accountAddress) setUserCompliant(true);
  }, [accountAddress, setUserCompliant]);

  useEffect(() => {
    userComplianceCheck();
  }, [userComplianceCheck]);

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances, provider]);

  const menuItems = useMemo(() => {
    return [
      ...menuLinks,
      chainId === 1 && {
        name: 'Claim',
        children: (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleClaimRdpx}
          >
            Claim rDPX
          </Button>
        ),
      },
    ].filter((i) => i);
  }, [chainId]);

  useEffect(() => {
    if (getWeb3Modal()?.cachedProvider) {
      connect();
    } else {
      updateState({
        provider: new ethers.providers.StaticJsonRpcProvider(
          CHAIN_ID_TO_RPC[
            PAGE_TO_SUPPORTED_CHAIN_IDS[Router.asPath]?.default ||
              DEFAULT_CHAIN_ID
          ]
        ),
      });
    }
  }, [connect, updateState]);

  useEffect(() => {
    updateTokenPrices();
    const intervalId = setInterval(updateTokenPrices, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [updateTokenPrices]);

  return (
    <>
      <ClaimRdpxDialog
        open={claimRdpxDialog}
        handleClose={handleRdpxDialogClose}
      />
      <DisclaimerDialog
        open={openComplianceDialog}
        handleClose={setOpenComplianceDialog}
      />
      <WalletDialog
        open={walletDialog}
        userBalances={userAssetBalances}
        handleClose={handleWalletDialogClose}
      />
      <nav className="fixed top-0 w-full text-gray-600 z-50 backdrop-blur-sm h-[74px]">
        <PriceCarousel tokenPrices={tokenPrices} />
        <Box className="flex w-full items-center container pl-5 pr-5 lg:pl-10 lg:pr-10 p-4 justify-between mx-auto max-w-full">
          <Box className="flex items-center">
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
            <Box className="space-x-10 mr-10 hidden lg:flex">
              {links.map(
                (link: {
                  name: Key | null | undefined;
                  to: string;
                  subLinks: any;
                  active: string;
                }) => {
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
                      active={link.name === active}
                      key={link.name}
                    />
                  );
                }
              )}
            </Box>
          </Box>
          <Box className="flex items-center">
            {accountAddress ? (
              <Box className="bg-cod-gray flex flex-row rounded-md items-center">
                <Button
                  variant="text"
                  className="text-white border-cod-gray hover:border-wave-blue border border-solid"
                  onClick={handleClick}
                >
                  {ensAvatar && (
                    <img
                      src={ensAvatar}
                      className="w-5 mr-2"
                      alt="ens avatar"
                    />
                  )}
                  {walletButtonContent}
                </Button>
                <Box className="bg-mineshaft flex-row px-2 py-2 rounded-md items-center mr-1 hidden lg:flex">
                  <Typography variant="caption" component="div">
                    {formatAmount(
                      getUserReadableAmount(
                        // TODO: FIX
                        // @ts-ignore
                        userAssetBalances[CURRENCIES_MAP[chainId]],
                        18
                      ),
                      3
                    )}{' '}
                    <span className="text-stieglitz">
                      {CURRENCIES_MAP[String(chainId)]
                        ? CURRENCIES_MAP[String(chainId)]
                        : 'ETH'}
                    </span>
                  </Typography>
                </Box>
              </Box>
            ) : (
              <CustomButton size="medium" onClick={handleWalletConnect}>
                Connect Wallet
              </CustomButton>
            )}
            <NetworkButton className="lg:inline-flex hidden ml-2 w-28" />
            <Box>
              {/* TODO: FIX */}
              {/* @ts-ignore */}
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClickMenu}
                style={{ height: 38 }}
                className="w-9 long-menu ml-2 rounded-md bg-umbra hover:bg-umbra hover:opacity-80 hidden lg:flex"
                size="large"
              >
                <MoreVertIcon className="text-silver" />
              </IconButton>
            </Box>
            <Box>
              {/* TODO: FIX */}
              {/* @ts-ignore */}
              <IconButton
                onClick={handleClickMenuSmall}
                className="lg:hidden"
                size="large"
              >
                <MenuIcon className="text-white" />
              </IconButton>
            </Box>
            <Box className="flex flex-row">
              <Menu
                anchorEl={anchorElSmall}
                open={Boolean(anchorElSmall)}
                onClose={handleCloseSmall}
                classes={{ paper: 'bg-cod-gray' }}
              >
                <Typography variant="h5" className="font-bold ml-4 my-2">
                  App
                </Typography>
                {links?.map(({ to, name, subLinks }: LinkType) => {
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
                      }
                    );
                  }
                })}
                <Box>
                  <Typography variant="h5" className="font-bold ml-4 my-2">
                    Links
                  </Typography>
                  {menuItems.map(
                    // TODO: FIX
                    // @ts-ignore
                    (item: {
                      name: string;
                      to: string;
                      children: ReactNode;
                    }) => {
                      if (item.children) {
                        return (
                          <MenuItem
                            onClick={handleClose}
                            className="ml-2"
                            key={item.name}
                          >
                            {item.children}
                          </MenuItem>
                        );
                      }
                      return (
                        <MenuItem
                          onClick={handleClose}
                          className="ml-2 text-white"
                          key={item.name}
                        >
                          <AppLink to={item.to} name={item.name} />
                        </MenuItem>
                      );
                    }
                  )}
                </Box>
                <Box className="border border-stieglitz" />
                <NetworkButton className="mx-3" />
              </Menu>
            </Box>
            <Box className="flex flex-row">
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: 'bg-cod-gray' }}
              >
                {menuItems.map(
                  // TODO: FIX
                  // @ts-ignore
                  (item: { name: string; to: string; children: ReactNode }) => {
                    if (item.children) {
                      return (
                        <MenuItem
                          onClick={handleClose}
                          className="ml-2"
                          key={item.name}
                        >
                          {item.children}
                        </MenuItem>
                      );
                    }
                    return (
                      <MenuItem
                        onClick={handleClose}
                        className="ml-2 text-white"
                        key={item.name}
                      >
                        <AppLink to={item.to} name={item.name} />
                      </MenuItem>
                    );
                  }
                )}
              </Menu>
            </Box>
          </Box>
        </Box>
      </nav>
    </>
  );
}
