import { useEffect, useMemo } from 'react';

import { Button } from '@dopex-io/ui';
import Countdown from 'react-countdown';
import { useAccount, useContractWrite } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Cell from 'components/rdpx-v2/Body/StrategyVault/DepositRow/CustomCell';
import Typography2 from 'components/UI/Typography2';

import formatBigint from 'utils/general/formatBigint';

import { DECIMALS_TOKEN } from 'constants/index';
import PerpVault from 'constants/rdpx/abis/PerpVault';
import addresses from 'constants/rdpx/addresses';

const DepositRow = () => {
  const { address: account } = useAccount();
  const {
    userPerpetualVaultData,
    updateUserPerpetualVaultData,
    perpetualVaultState,
    updatePerpetualVaultState,
  } = usePerpPoolData({
    user: account || '0x',
  });

  const { write: claim, isSuccess: claimSuccess } = useContractWrite({
    abi: PerpVault,
    address: addresses.perpPool,
    functionName: 'claim',
    args: [userPerpetualVaultData.userSharesLocked],
  });

  useEffect(() => {
    updatePerpetualVaultState();
  }, [updatePerpetualVaultState, claimSuccess]);

  useEffect(() => {
    updateUserPerpetualVaultData();
  }, [updateUserPerpetualVaultData, claimSuccess]);

  const buttonState = useMemo(() => {
    const defaultState = {
      label: 'Claim',
      handler: () => null,
      disabled: true,
    };
    if (
      userPerpetualVaultData.claimableTime <
      BigInt(Math.ceil(new Date().getTime() / 1000))
    ) {
      return {
        ...defaultState,
      };
    } else {
      return {
        ...defaultState,
        disabled: false,
        handler: () => claim(),
      };
    }
  }, [claim, userPerpetualVaultData.claimableTime]);

  return (
    <div className="space-y-3">
      <Typography2 variant="subtitle2">Your Deposits</Typography2>
      <div className="bg-umbra flex overflow-auto max-w-full divide-x divide-cod-gray rounded-lg">
        <Cell
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
          data={[
            [
              formatBigint(
                userPerpetualVaultData.shareComposition[0],
                DECIMALS_TOKEN,
              ),
              'ETH',
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
          data={[
            [
              formatBigint(
                userPerpetualVaultData.userShareOfFunding,
                DECIMALS_TOKEN,
              ),
              'ETH',
            ],
          ]}
        />
        <Cell
          label="Withdrawable"
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
                      <Typography2 variant="caption" color="white">
                        {seconds}
                      </Typography2>
                      s
                    </div>
                  </div>
                )}
              />,
              '',
            ],
          ]}
        />
        {userPerpetualVaultData.userSharesLocked > 0n &&
        Number(perpetualVaultState.expiry) < new Date().getTime() / 1000 ? (
          <Cell
            data={[
              [
                <Button key="claim" size="medium" onClick={buttonState.handler}>
                  Claim
                </Button>,
                '',
              ],
            ]}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DepositRow;
