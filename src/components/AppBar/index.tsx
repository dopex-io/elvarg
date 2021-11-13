import { useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ClaimRdpxDialog from './ClaimRdpxDialog';
import PriceTag from './PriceTag';
import NetworkButton from './NetworkButton';
import Typography from 'components/UI/Typography';
import WalletDialog from 'components/AppBar/WalletDialog';
import CustomButton from 'components/UI/CustomButton';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import formatAmount from 'utils/general/formatAmount';
import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import styles from './styles.module.scss';

const AppLink = ({
  name,
  to,
  active,
  className,
}: {
  name: string;
  to: string;
  active?: boolean;
  className?: string;
}) => {
  const linkClassName = cx(
    'hover:no-underline hover:text-white capitalize',
    active ? 'text-white' : 'text-stieglitz'
  );
  if (to.startsWith('http')) {
    return (
      <a
        href={to}
        className={cx(className, linkClassName)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </a>
    );
  } else {
    return (
      <Link to={to} className={linkClassName}>
        {name}
      </Link>
    );
  }
};

const appLinks = {
  1: [
    { name: 'farms', to: '/farms' },
    { name: 'sale', to: '/sale' },
  ],
  1337: [
    { name: 'options', to: '/' },
    { name: 'pools', to: '/pools' },
    { name: 'portfolio', to: '/portfolio' },
    { name: 'faucet', to: '/faucet' },
  ],
  421611: [
    { name: 'options', to: '/' },
    { name: 'pools', to: '/pools' },
    { name: 'portfolio', to: '/portfolio' },
    { name: 'faucet', to: '/faucet' },
    { name: 'swap', to: '/swap' },
    { name: 'SSOV', to: '/ssov' },
  ],
  42161: [
    { name: 'farms', to: '/farms' },
    { name: 'SSOV', to: '/ssov' },
  ],
};

const menuLinks = [
  { name: 'Dopex.io', to: 'https://dopex.io' },
  { name: 'Docs', to: 'https://docs.dopex.io/' },
  { name: 'Discord', to: 'https://discord.gg/dopex' },
  { name: 'Github', to: 'https://github.com/dopex-io' },
];

interface AppBarProps {
  active:
    | 'options'
    | 'pools'
    | 'rewards'
    | 'farms'
    | 'volume pool'
    | 'portfolio'
    | 'token sale'
    | 'faucet'
    | 'SSOV'
    | 'leaderboard'
    | 'swap';
}

export default function AppBar(props: AppBarProps) {
  const { active } = props;
  const { accountAddress, connect, wrongNetwork, chainId } =
    useContext(WalletContext);
  const { selectedBaseAsset, baseAssetsWithPrices, userAssetBalances } =
    useContext(AssetsContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElSmall, setAnchorElSmall] = useState<null | HTMLElement>(null);
  const [walletDialog, setWalletDialog] = useState(false);
  const [claimRdpxDialog, setClaimRdpxDialog] = useState(false);

  const links = appLinks[chainId];

  const handleRdpxDialogClose = () => setClaimRdpxDialog(false);

  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleCloseSmall = useCallback(() => setAnchorElSmall(null), []);

  const handleWalletConnect = useCallback(() => {
    connect();
  }, [connect]);

  const handleWalletDialogClose = useCallback(() => {
    setWalletDialog(false);
  }, []);

  const handleClickMenu = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    []
  );

  const handleClickMenuSmall = useCallback(
    (event) => setAnchorElSmall(event.currentTarget),
    []
  );

  const handleClick = useCallback(() => {
    setWalletDialog(true);
  }, []);

  let walletButtonContent = useMemo(() => {
    if (wrongNetwork) return 'Wrong Network';
    if (accountAddress) return smartTrim(accountAddress, 10);
  }, [accountAddress, wrongNetwork]);

  const handleClaimRdpx = () => {
    setClaimRdpxDialog(true);
  };

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

  return (
    <>
      <ClaimRdpxDialog
        open={claimRdpxDialog}
        handleClose={handleRdpxDialogClose}
      />
      <WalletDialog
        open={walletDialog}
        userBalances={userAssetBalances}
        handleClose={handleWalletDialogClose}
      />
      <nav
        className={cx(
          'bg-black fixed top-0 z-10 w-full text-gray-600',
          styles.appBar
        )}
      >
        <Box className="flex w-full items-center container lg:px-0 p-4 justify-between mx-auto">
          <Box className="flex items-center">
            <a
              className="flex items-center mr-6 cursor-pointer hover:no-underline"
              href="/"
            >
              <img
                src={'/assets/logo.svg'}
                className="w-9 text-left"
                alt="logo"
              />
            </a>
            <Box className="space-x-10 mr-10 hidden lg:flex">
              {links.map((link) => {
                if (link.name === active)
                  return (
                    <AppLink
                      to={link.to}
                      name={link.name}
                      key={link.name}
                      active
                    />
                  );
                return (
                  <AppLink to={link.to} name={link.name} key={link.name} />
                );
              })}
            </Box>
          </Box>
          <Box className="flex items-center">
            <Box className="space-x-2 mr-4 hidden lg:flex">
              {baseAssetsWithPrices
                ? Object.keys(baseAssetsWithPrices).map((asset) => {
                    return (
                      <PriceTag
                        key={baseAssetsWithPrices[asset].symbol}
                        asset={baseAssetsWithPrices[asset].symbol}
                        price={getUserReadableAmount(
                          baseAssetsWithPrices[asset].price,
                          8
                        )}
                      />
                    );
                  })
                : null}
            </Box>
            {baseAssetsWithPrices ? (
              <PriceTag
                asset={baseAssetsWithPrices[selectedBaseAsset].symbol}
                price={getUserReadableAmount(
                  baseAssetsWithPrices[selectedBaseAsset].price,
                  8
                )}
                className="mr-2 lg:hidden"
              />
            ) : null}
            {accountAddress ? (
              <Box className="bg-cod-gray flex flex-row p-1 rounded-md items-center">
                <Box className="bg-mineshaft flex-row px-2 py-2 rounded-md items-center mr-1 hidden lg:flex">
                  <Typography
                    variant="caption"
                    component="div"
                    className="mr-2"
                  >
                    {formatAmount(
                      getUserReadableAmount(userAssetBalances.ETH, 18),
                      3
                    )}{' '}
                    <span className="text-stieglitz">ETH</span>
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  className="text-white border-cod-gray hover:border-wave-blue border border-solid"
                  onClick={handleClick}
                >
                  {walletButtonContent}
                </Button>
              </Box>
            ) : (
              <CustomButton size="medium" onClick={handleWalletConnect}>
                Connect Wallet
              </CustomButton>
            )}
            <NetworkButton className="lg:flex hidden ml-4 w-28" />
            <Box>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClickMenu}
                style={{ height: 38 }}
                className="w-9 long-menu ml-2 rounded-md bg-umbra hover:bg-opacity-70 hidden lg:flex"
              >
                <MoreVertIcon className={cx('', styles.vertIcon)} />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={handleClickMenuSmall} className="lg:hidden">
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
                {links.map((link) => {
                  return (
                    <MenuItem
                      onClick={handleCloseSmall}
                      className="ml-2 text-white"
                      key={link.name}
                    >
                      <AppLink to={link.to} name={link.name} />
                    </MenuItem>
                  );
                })}
                <Box>
                  <Typography variant="h5" className="font-bold ml-4 my-2">
                    Links
                  </Typography>
                  {menuItems.map(
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
