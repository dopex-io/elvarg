import { ReactNode, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import LaunchIcon from '@mui/icons-material/Launch';

import { FarmStatus, LpData } from 'types/farms';

import { useBoundStore } from 'store/index';

import CustomButton from 'components/UI/Button';
import NumberDisplay from 'components/UI/NumberDisplay';
import Skeleton from 'components/UI/Skeleton';

import formatAmount from 'utils/general/formatAmount';
import getExplorerUrl from 'utils/general/getExplorerUrl';

import Chip from './Chip';
import LpRatios from './LpRatios';
import Stat from './Stat';
import SushiMigrationStepper from './SushiMigrationStepper';

const Header = ({
  stakingTokenSymbol,
  type,
  onManage,
  onMigrate,
  status,
  userStakingRewardsBalance,
}: {
  stakingTokenSymbol: string;
  type: 'SINGLE' | 'LP';
  status: FarmStatus;
  onManage: any;
  onMigrate: any;
  userStakingRewardsBalance: BigNumber;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex space-x-3 items-center">
        <img
          src={`/images/tokens/${stakingTokenSymbol.toLowerCase()}.svg`}
          alt={stakingTokenSymbol}
          className="w-8 h-8 block"
        />
        <div>
          <div className="text-white">{stakingTokenSymbol}</div>
          <div className="text-xs text-stieglitz">
            {type === 'SINGLE' ? 'Single Side Farm' : 'LP Farm'}
            <span className="text-down-bad">
              {' '}
              {status !== 'ACTIVE' ? `(${status})` : null}
            </span>
          </div>
        </div>
      </div>
      {type === 'LP' && userStakingRewardsBalance.gt(0) ? (
        <CustomButton size="small" onClick={onMigrate}>
          Migrate
        </CustomButton>
      ) : null}
      <CustomButton size="small" onClick={onManage}>
        Manage
      </CustomButton>
    </div>
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
    <div className="w-full mb-3">
      <div className="mb-3 text-xs text-stieglitz">{title}</div>
      <div className="bg-carbon p-2 w-full rounded-md flex justify-between items-center mb-1">
        <div className="flex items-center space-x-1">{children}</div>
      </div>
    </div>
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
  status: FarmStatus;
  type: 'SINGLE' | 'LP';
  version: number;
}

const FarmCard = (props: Props) => {
  const {
    farmsDataLoading,
    userDataLoading,
    TVL,
    // APR,
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
    version,
  } = props;

  const [sushiMigrationOpen, setSushiMigrationOpen] = useState(false);

  const { accountAddress, chainId, signer } = useBoundStore();

  const onManage = () => {
    setDialog({
      data: {
        status,
        stakingTokenSymbol,
        stakingTokenAddress,
        stakingRewardsAddress,
        userStakingTokenBalance,
        userStakingRewardsBalance,
        version,
      },
      open: true,
    });
  };

  const onMigrate = async () => {
    if (!signer) return;
    setSushiMigrationOpen(true);
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

  if (userStakingRewardsBalance.isZero() && status !== 'ACTIVE') return <></>;

  return (
    <div className="bg-cod-gray text-red rounded-2xl p-3 flex flex-col space-y-3 w-[343px]">
      <SushiMigrationStepper
        data={{
          status,
          stakingTokenSymbol,
          stakingTokenAddress,
          stakingRewardsAddress,
          userStakingTokenBalance,
          userStakingRewardsBalance,
          version,
        }}
        open={sushiMigrationOpen}
        handleClose={(_e, reason) => {
          if (reason !== 'backdropClick') setSushiMigrationOpen(false);
        }}
      />
      <Header
        stakingTokenSymbol={stakingTokenSymbol}
        type={type}
        status={status}
        onManage={onManage}
        onMigrate={onMigrate}
        userStakingRewardsBalance={userStakingRewardsBalance}
      />
      <div className="flex space-x-3">
        {farmsDataLoading ? (
          <>
            <Skeleton variant="rectangular" width={153.5} height={64} />
            <Skeleton variant="rectangular" width={153.5} height={64} />
          </>
        ) : (
          <>
            <Stat name="APR" value="--" />
            <Stat
              name="TVL"
              value={TVL === 0 ? '--' : `$${formatAmount(TVL, 2)}`}
            />
          </>
        )}
      </div>
      {userDataLoading ? (
        <Skeleton variant="rectangular" width={319} height={180} />
      ) : (
        <div className="bg-umbra p-3 w-full rounded-md">
          {!accountAddress ? (
            <div className="h-24 text-stieglitz text-base">
              Please connect your wallet to see your deposits
            </div>
          ) : (
            <>
              <UserStat title="Deposits">
                <div className="flex items-center space-x-1">
                  <div className="text-white text-xs">
                    <NumberDisplay
                      n={userStakingRewardsBalance}
                      decimals={18}
                    />
                  </div>
                </div>
                {type === 'LP' ? (
                  <LpRatios
                    userStakingRewardsBalance={userStakingRewardsBalance}
                    stakingTokenSymbol={stakingTokenSymbol}
                  />
                ) : (
                  <Chip text={stakingTokenSymbol} />
                )}
              </UserStat>
            </>
          )}
        </div>
      )}
      <a
        href={`${getExplorerUrl(chainId)}address/${stakingRewardsAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="self-end"
      >
        <span className="text-xs text-stieglitz">
          Contract <LaunchIcon className="w-3" />
        </span>
      </a>
    </div>
  );
};

export default FarmCard;
