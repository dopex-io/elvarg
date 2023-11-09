import { useEffect } from 'react';

import { Button } from '@dopex-io/ui';
import Countdown from 'react-countdown';
import { useAccount } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import useRewardsState from 'components/rdpx-v2/Body/hooks/useRewardsState';
import Cell from 'components/rdpx-v2/Body/StrategyVault/DepositRow/CustomCell';
import tooltips from 'components/rdpx-v2/Body/StrategyVault/DepositRow/tooltips';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';

const DepositRow = () => {
  const { address: user = '0x' } = useAccount();
  const {
    userPerpetualVaultData,
    updateUserPerpetualVaultData,
    perpetualVaultState,
    updatePerpetualVaultState,
    loading,
  } = usePerpPoolData({
    user,
  });
  const { buttonState, stake, unstake, earned } = useRewardsState({
    user,
    stakeAmount: userPerpetualVaultData.totalUserShares,
  });

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData]);

  return (
    <div className="space-y-2">
      <Typography2 variant="subtitle2" className="px-2">
        Your Position
      </Typography2>
      {loading ? (
        <div className="py-6 text-center w-full text-white">Loading...</div>
      ) : (
        <div className="bg-umbra flex overflow-auto max-w-full divide-x divide-cod-gray rounded-lg">
          <Cell
            tooltipInfo={tooltips.lp}
            label="Amount"
            data={[
              [
                formatBigint(
                  userPerpetualVaultData.totalUserShares,
                  DECIMALS_TOKEN,
                ),
                ' LP',
              ],
            ]}
          />
          <Cell
            label="Composition"
            tooltipInfo={tooltips.composition}
            data={[
              [
                formatBigint(
                  userPerpetualVaultData.shareComposition[0],
                  DECIMALS_TOKEN,
                ),
                'WETH',
              ],
              [
                formatBigint(
                  userPerpetualVaultData.shareComposition[1],
                  DECIMALS_TOKEN,
                ),
                'rDPX',
              ],
            ]}
          />
          <Cell
            label="Earnings"
            tooltipInfo={tooltips.earnings}
            data={[
              [
                formatBigint(
                  userPerpetualVaultData.userShareOfFunding,
                  DECIMALS_TOKEN,
                ),
                'ETH',
              ],
              [formatBigint(earned), ' rRT'],
            ]}
          />
          <Cell
            label="Redeemable"
            tooltipInfo={tooltips.redeemable}
            data={[
              [
                formatBigint(
                  userPerpetualVaultData.userSharesLocked,
                  DECIMALS_TOKEN,
                ),
                'LP',
              ],
              [
                <Countdown
                  key={Number(perpetualVaultState.expiry || 0n) * 1000}
                  date={Number(perpetualVaultState.expiry || 0n) * 1000}
                  renderer={({ days, hours, minutes, seconds }) => (
                    <div className="flex space-x-1 text-stieglitz">
                      <Typography2 variant="caption" color="stieglitz">
                        in
                      </Typography2>
                      <div className="space-x-1">
                        <Typography2 variant="caption" color="white">
                          {days}
                        </Typography2>
                        d
                        <Typography2 variant="caption" color="white">
                          {hours}
                        </Typography2>
                        h
                        <Typography2 variant="caption" color="white">
                          {minutes}
                        </Typography2>
                        m
                      </div>
                    </div>
                  )}
                />,
                '',
              ],
            ]}
          />
          {earned ? (
            <>
              <Button className="rounded-none" onClick={buttonState.handler}>
                {buttonState.label}
              </Button>
              <Button className="rounded-none" onClick={() => unstake()}>
                Withdraw
              </Button>
            </>
          ) : null}
          {userPerpetualVaultData.totalUserShares > 0n ? (
            <Button className="rounded-none" onClick={() => stake()}>
              Stake
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default DepositRow;
