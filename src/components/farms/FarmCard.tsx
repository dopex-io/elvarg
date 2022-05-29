import { ReactNode, useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import { BigNumber, utils } from 'ethers';
import BN from 'bignumber.js';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import Skeleton from 'components/UI/Skeleton';
import NumberDisplay from 'components/UI/NumberDisplay';
import Stat from './Stat';
import Chip from './Chip';
import LpRatios from './LpRatios';

import { WalletContext } from 'contexts/Wallet';

import formatAmount from 'utils/general/formatAmount';
import getExplorerUrl from 'utils/general/getExplorerUrl';

import { LpData } from 'types/farms';

const Header = ({
  stakingTokenSymbol,
  type,
  onManage,
  status,
}: {
  stakingTokenSymbol: string;
  type: 'SINGLE' | 'LP';
  status: 'RETIRED' | 'ACTIVE';
  onManage: any;
}) => {
  return (
    <Box className="flex justify-between">
      <Box className="flex space-x-3 items-center">
        <img
          src={`/images/tokens/${stakingTokenSymbol.toLowerCase()}.svg`}
          alt={stakingTokenSymbol}
          className="w-8 h-8 block"
        />
        <Box>
          <Typography variant="h5">
            {stakingTokenSymbol}
            <span className="text-down-bad">
              {status === 'RETIRED' ? '(Retired)' : null}
            </span>
          </Typography>
          <Typography variant="caption" color="stieglitz">
            {type === 'SINGLE' ? 'Single Side Farm' : 'LP Farm'}
          </Typography>
        </Box>
      </Box>
      <CustomButton size="small" onClick={onManage}>
        Manage
      </CustomButton>
    </Box>
  );
};

const UserStat = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <Box className="w-full mb-3">
      <Typography variant="caption" color="stieglitz" className="mb-3">
        {title}
      </Typography>
      <Box className="bg-carbon p-2 w-full rounded-md flex justify-between items-center mb-1">
        <Box className="flex items-center space-x-1">{children}</Box>
      </Box>
    </Box>
  );
};

interface Props {
  setDialog: Function;
  userStakingRewardsBalance: BigNumber;
  userStakingTokenBalance: BigNumber;
  farmTotalSupply: BigNumber;
  lpData: LpData;
  TVL: number;
  APR: number;
  stakingTokenSymbol: string;
  stakingRewardsAddress: string;
  stakingTokenAddress: string;
  farmsDataLoading: boolean;
  userDataLoading: boolean;
  status: 'RETIRED' | 'ACTIVE';
  type: 'SINGLE' | 'LP';
}

const FarmCard = (props: Props) => {
  const {
    farmsDataLoading,
    userDataLoading,
    TVL,
    APR,
    stakingTokenSymbol,
    userStakingRewardsBalance,
    stakingRewardsAddress,
    stakingTokenAddress,
    userStakingTokenBalance,
    type,
    status,
    setDialog,
    lpData,
    farmTotalSupply,
  } = props;

  const { accountAddress, chainId } = useContext(WalletContext);

  const onManage = () => {
    setDialog({
      data: {
        userStakingTokenBalance,
        userStakingRewardsBalance,
      },
      open: true,
      status,
      stakingTokenSymbol,
      stakingRewardsAddress,
      stakingTokenAddress,
    });
  };

  const stakingTokenPrice = useMemo(() => {
    if (!lpData) return 0;
    if (stakingTokenSymbol === 'DPX') return lpData.dpxPrice;
    else if (stakingTokenSymbol === 'RDPX') return lpData.rdpxPrice;
    else if (stakingTokenSymbol === 'DPX-WETH')
      return lpData.dpxWethLpTokenRatios.lpPrice;
    else if (stakingTokenSymbol === 'RDPX-WETH')
      return lpData.rdpxWethLpTokenRatios.lpPrice;

    return 0;
  }, [lpData, stakingTokenSymbol]);

  if (userStakingRewardsBalance.isZero() && status === 'RETIRED') return <></>;

  return (
    <Box className="bg-cod-gray text-red rounded-2xl p-3 flex flex-col space-y-3 w-[343px]">
      <Header
        stakingTokenSymbol={stakingTokenSymbol}
        type={type}
        status={status}
        onManage={onManage}
      />
      <Box className="flex space-x-3">
        {farmsDataLoading ? (
          <>
            <Skeleton variant="rectangular" width={153.5} height={64} />
            <Skeleton variant="rectangular" width={153.5} height={64} />
          </>
        ) : (
          <>
            <Stat name="APR" value={APR === 0 ? '--' : APR.toFixed(2) + '%'} />
            <Stat
              name="TVL"
              value={TVL === 0 ? '--' : `$${formatAmount(TVL, 2)}`}
            />
          </>
        )}
      </Box>
      {userDataLoading ? (
        <Skeleton variant="rectangular" width={319} height={180} />
      ) : (
        <Box className="bg-umbra p-3 w-full rounded-md">
          {!accountAddress ? (
            <Box className="h-24 text-stieglitz text-base">
              Please connect your wallet to see your deposits
            </Box>
          ) : (
            <>
              <UserStat title="Deposits">
                <Box className="flex items-center space-x-1">
                  <Typography variant="caption">
                    <NumberDisplay
                      n={userStakingRewardsBalance}
                      decimals={18}
                    />
                  </Typography>
                </Box>
                {type === 'LP' ? (
                  <LpRatios
                    userStakingRewardsBalance={userStakingRewardsBalance}
                    stakingTokenSymbol={stakingTokenSymbol}
                  />
                ) : (
                  <Chip text={stakingTokenSymbol} />
                )}
              </UserStat>
              <Box className="flex space-x-3">
                <UserStat title="Pool Share">
                  <Typography variant="caption">
                    {formatAmount(
                      new BN(userStakingRewardsBalance.toString())
                        .multipliedBy(1e2)
                        .dividedBy(new BN(farmTotalSupply.toString()))
                        .toNumber(),
                      8
                    )}
                    %
                  </Typography>
                </UserStat>
                <UserStat title="USD Value">
                  <Typography variant="caption">
                    $
                    {formatAmount(
                      Number(utils.formatEther(userStakingRewardsBalance)) *
                        stakingTokenPrice,
                      2
                    )}
                  </Typography>
                </UserStat>
              </Box>
            </>
          )}
        </Box>
      )}
      <a
        href={`${getExplorerUrl(chainId)}address/${stakingRewardsAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="self-end"
      >
        <Typography variant="caption" color="stieglitz" component="span">
          Contract <LaunchIcon className="w-3" />
        </Typography>
      </a>
    </Box>
  );
};

export default FarmCard;
