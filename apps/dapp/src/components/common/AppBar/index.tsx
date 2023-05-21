import {
  Key,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import { ethers } from 'ethers';

import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import cx from 'classnames';
import { useBoundStore } from 'store';
import { useNetwork } from 'wagmi';

import Typography from 'components/UI/Typography';
import PriceCarousel from 'components/common/AppBar/PriceCarousel';
import DisclaimerDialog from 'components/common/DisclaimerDialog';

import {
  DISCLAIMER_MESSAGE,
  OFAC_COMPLIANCE_LOCAL_STORAGE_KEY,
} from 'constants/index';

import ConnectButton from '../ConnectButton';
import ClaimRdpxDialog from './ClaimRdpxDialog';
import NetworkButton from './NetworkButton';

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

const appLinks: {
  [key: number]: {
    name: string;
    to?: string;
    subLinks?: { name: string; to: string; description: string }[];
  }[];
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
  137: [
    { name: 'SSOV', to: '/ssov' },
    { name: 'Straddles', to: '/straddles' },
  ],
};

const baseAppLinks = [
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
    | 'Scalps'
    | 'OLPs'
    | 'SSOV'
    | 'leaderboard'
    | 'swap'
    | 'DPX Bonds'
    | 'vaults'
    | 'Atlantics'
    | 'ZDTE'
    | 'Vaults';
}

export default function AppBar(props: AppBarProps) {
  const { active } = props;
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
  const [claimRdpxDialog, setClaimRdpxDialog] = useState(false);

  const links = appLinks[chain?.id || 42161].concat(baseAppLinks);

  const handleRdpxDialogClose = () => setClaimRdpxDialog(false);

  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleCloseSmall = useCallback(() => setAnchorElSmall(null), []);

  const handleClickMenu = useCallback(
    (event: any) => setAnchorEl(event.currentTarget),
    []
  );

  const handleClickMenuSmall = useCallback(
    (event: any) => setAnchorElSmall(event.currentTarget),
    []
  );

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
      try {
        await axios
          .get(
            `https://flo7r5qw6dj5mi337w2esfvhhm0caese.lambda-url.us-east-1.on.aws/?address=${ethers.utils.getAddress(
              accountAddress
            )}`
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
      signature
    );

    if (signatureSigner === accountAddress) setUserCompliant(true);
  }, [accountAddress, setUserCompliant]);

  useEffect(() => {
    userComplianceCheck();
  }, [userComplianceCheck]);

  useEffect(() => {
    updateAssetBalances();
  }, [updateAssetBalances]);

  const menuItems = useMemo(() => {
    return [
      ...menuLinks,
      chain?.id === 1 && {
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
  }, [chain]);

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
                    active={link.name === active}
                    key={link.name}
                  />
                );
              })}
            </Box>
          </Box>
          <Box className="flex items-center">
            <NetworkButton className="lg:inline-flex hidden mr-2" />
            <ConnectButton />
            <Box>
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
            </Box>
            <Box>
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
