import { useContext, useCallback, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { StakingRewards__factory } from '@dopex-io/sdk';

import { FarmingContext } from 'contexts/Farming';
import { WalletContext } from 'contexts/Wallet';

import Claim from '../Claim';
import LpTokenDistribution from '../LpTokenDistribution';
import PoolShare from './PoolShare/PoolShare';
import FarmingHeader from '../FarmingHeader';
import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import RewardsCountdown from './RewardsCountdown/RewardsCountdown';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

import { UNISWAP_LINKS } from 'constants/index';

import styles from './styles.module.scss';

interface PoolProps {
  Icon: any;
  token: any;
  poolInfo: any;
  className?: string;
}

const MODALS = {
  CLAIM: Claim,
};

const Pool = ({
  Icon,
  token,
  poolInfo: { periodFinish, APR, TVL, stakingAsset },
  className,
}: PoolProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const { setData, setStakingAsset } = useContext(FarmingContext);

  const { accountAddress, signer, chainId } = useContext(WalletContext);

  const [modalState, setModalState] = useState({
    open: false,
    type: 'CLAIM',
  });
  const Modal = MODALS[modalState.type];

  const navigate = useNavigate();

  const sendTx = useSendTx();

  const handleClose = useCallback(
    () => setModalState((prevState) => ({ ...prevState, open: false })),
    []
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleStake = useCallback(() => {
    if (token.selectedBaseAsset === 'RDPX') return;
    setData(() => ({
      token: token.selectedBaseAsset,
      isStake: true,
    }));
    navigate('manage');
  }, [setData, token, navigate]);

  const handleUnstake = useCallback(() => {
    setData(() => ({
      token: token.selectedBaseAsset,
      isStake: false,
    }));
    navigate('manage');
  }, [setData, token, navigate]);

  const handleCompound = useCallback(async () => {
    if (token.rewards[0] === 0) {
      console.log('Insufficient Rewards');
    }
    try {
      await sendTx(
        StakingRewards__factory.connect(
          token.stakingRewardsContractAddress,
          signer
        ).compound()
      );
      setStakingAsset(token.selectedBaseAsset);
    } catch (err) {
      console.log(err);
    }
  }, [token, setStakingAsset, signer, sendTx]);

  const handleClaim = useCallback(
    () => setModalState({ open: true, type: 'CLAIM' }),
    []
  );

  const options: { name: string; to: () => void; exclude?: string[] }[] = [
    {
      name: 'Stake',
      to:
        token.selectedBaseAsset === 'RDPX'
          ? () => {
              return;
            }
          : handleStake,
    },
    {
      name: 'Add liquidity',
      to: () => window.open(UNISWAP_LINKS[token.selectedBaseAsset], '_blank'),
      exclude: ['DPX', 'RDPX'],
    },
    {
      name: 'Buy DPX',
      to: () => window.open(UNISWAP_LINKS[token.selectedBaseAsset], '_blank'),
      exclude: ['DPX-WETH', 'rDPX-WETH', 'RDPX'],
    },
    {
      name: 'Buy rDPX',
      to: () => window.open(UNISWAP_LINKS[token.selectedBaseAsset], '_blank'),
      exclude: ['DPX-WETH', 'rDPX-WETH', 'DPX'],
    },
    {
      name: 'Compound',
      to: handleCompound,
      exclude: ['DPX-WETH', 'rDPX-WETH'],
    },
    ...(token.userStakedBalance?.gt(0)
      ? [
          {
            name: 'Unstake',
            to: handleUnstake,
          },
        ]
      : []),
  ];

  return (
    <Box
      className={cx(
        'flex flex-col items-start lg:mb-2 mb-12 bg-umbra p-4 rounded-xl',
        styles.poolCard,
        className
      )}
    >
      <Modal
        open={modalState.open}
        handleClose={handleClose}
        data={{
          token,
        }}
      />
      <Box className="w-full">
        <FarmingHeader
          Icon={Icon}
          heading={stakingAsset === 'RDPX' ? 'rDPX' : stakingAsset}
        />
      </Box>
      <RewardsCountdown
        periodFinish={periodFinish}
        stakingAsset={stakingAsset}
      />
      <Box className="border-cod-gray rounded-xl border p-4 flex flex-col justify-between w-full mb-4 h-full">
        {accountAddress ? (
          token.userStakedBalance > 0 ? (
            <Box className="mb-4 flex flex-col w-full justify-between items-start">
              <Box className="flex flex-row w-full justify-between space-x-2">
                <Box className="flex flex-col flex-1 items-start">
                  <Typography variant="h4">
                    {formatAmount(
                      getUserReadableAmount(
                        token.userStakedBalance,
                        token.selectedBaseAssetDecimals
                      ),
                      2
                    )}
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz">
                    Your Deposit
                  </Typography>
                </Box>
                <hr className="border-cod-gray mb-4" />
                <Box className="flex flex-col flex-1 items-start">
                  <PoolShare
                    userDeposit={token.userStakedBalance}
                    total={token.totalSupply}
                  />
                  <Typography variant="h6" className="text-stieglitz">
                    Pool share
                  </Typography>
                </Box>
              </Box>
              <hr className="border-cod-gray mb-4" />
              <LpTokenDistribution
                stakingAsset={stakingAsset}
                value={getUserReadableAmount(
                  token.userStakedBalance,
                  token.selectedBaseAssetDecimals
                )}
                layout="row"
              />
            </Box>
          ) : (
            <Box className="mb-4 flex flex-col w-full justify-between items-start">
              <Box className="flex flex-row w-full justify-between">
                <Box className="flex flex-col flex-1 items-start">
                  <Typography variant="h4">
                    {formatAmount(
                      getUserReadableAmount(
                        token.userStakedBalance,
                        token.selectedBaseAssetDecimals
                      ),
                      2
                    )}
                  </Typography>
                  <Typography variant="h6" className="text-stieglitz">
                    Balance
                  </Typography>
                </Box>
                <Box className="flex flex-col flex-1 items-start">
                  <PoolShare
                    userDeposit={token.userStakedBalance}
                    total={token.totalSupply}
                  />
                  <Typography variant="h6" className="text-stieglitz">
                    Pool Share
                  </Typography>
                </Box>
              </Box>
              <hr className="border-cod-gray mb-4" />
              <LpTokenDistribution
                stakingAsset={stakingAsset}
                value={getUserReadableAmount(
                  token.userStakedBalance,
                  token.selectedBaseAssetDecimals
                )}
                layout="row"
              />
            </Box>
          )
        ) : (
          <Box className="mb-4 flex flex-row w-full justify-between items-end">
            <Box className="flex flex-col">
              <Typography variant="h4">-</Typography>
              <Typography variant="h6" className="text-stieglitz">
                Balance
              </Typography>
            </Box>
            <LpTokenDistribution stakingAsset={stakingAsset} />
          </Box>
        )}
        <hr className="border-cod-gray mb-4" />
        <Box className="flex flex-row justify-between">
          <Box className="flex flex-col mr-2">
            <Typography variant="h4">${formatAmount(TVL)}</Typography>
            <Typography variant="h6" className="text-stieglitz">
              TVL
            </Typography>
          </Box>
          <Box className="flex flex-col mr-4">
            <Typography variant="h4">{formatAmount(APR, 2)}%</Typography>
            <Typography variant="h6" className="text-stieglitz">
              APR
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex flex-row justify-between w-full">
        {accountAddress && token.rewards ? (
          <Box className="w-full mt-auto">
            {token.rewards[0] > 0 ||
            token.rewards[1] > 0 ||
            token.userStakedBalance > 0 ? (
              <Box className="w-full ">
                <CustomButton
                  size="medium"
                  className="w-full lg:w-52"
                  onClick={handleClaim}
                  disabled={chainId === 1 ? true : false}
                >
                  Claim
                </CustomButton>
              </Box>
            ) : (
              <Box>
                <CustomButton
                  size="medium"
                  className="w-full lg:w-52"
                  onClick={() => {
                    handleStake();
                    navigate('/farms/manage');
                  }}
                >
                  Stake
                </CustomButton>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="w-full">
            <CustomButton
              size="medium"
              className="w-full lg:w-52"
              disabled={true}
            >
              Stake
            </CustomButton>
          </Box>
        )}
        <Box className="mt-auto">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            {...(!accountAddress ? { disabled: true } : { disabled: false })}
            className="w-6 ml-2 rounded-md h-9 hover:bg-gray-800"
          >
            <MoreVertIcon className={styles.vertIcon} />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                backgroundColor: '#3E3E3E',
              },
            }}
          >
            {options.map((option) => {
              if (option.exclude?.includes(token.selectedBaseAsset))
                return null;
              return (
                <MenuItem
                  key={option.name}
                  onClick={option.to}
                  className="text-white hover:text-wave-blue"
                >
                  {option.name}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Pool;
