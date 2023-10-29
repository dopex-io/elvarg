import { useEffect, useMemo } from 'react';

import { Button } from '@dopex-io/ui';
import Countdown from 'react-countdown';
import { useAccount, useContractWrite } from 'wagmi';

import usePerpPoolData from 'hooks/rdpx/usePerpPoolData';

import Cell from 'components/rdpx-v2/Body/StrategyVault/DepositRow/CustomCell';

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
    <>
      <span className="text-sm mt-4 mb-3 flex">Your deposits</span>
      <div className="bg-umbra flex max-w-full divide-x divide-cod-gray rounded-lg">
        <Cell
          label="Amount"
          data={[
            [
              formatBigint(
                userPerpetualVaultData.totalUserShares,
                DECIMALS_TOKEN
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
                DECIMALS_TOKEN
              ),
              'ETH',
            ],
            [
              formatBigint(
                userPerpetualVaultData.shareComposition[1],
                DECIMALS_TOKEN
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
                DECIMALS_TOKEN
              ),
              'ETH',
            ],
          ]}
        />
        <Cell
          label="To be unlocked"
          data={[
            [
              formatBigint(
                userPerpetualVaultData.totalUserShares,
                DECIMALS_TOKEN
              ),
              'LP',
            ],
          ]}
        />
        <Cell
          label="Withdrawable"
          data={[
            [
              formatBigint(
                userPerpetualVaultData.userSharesLocked,
                DECIMALS_TOKEN
              ),
              'LP',
            ],
            [
              <Countdown
                key={Number(perpetualVaultState.expiry || 0n) * 1000}
                date={Number(perpetualVaultState.expiry || 0n) * 1000}
                renderer={({ days, hours, minutes, seconds }) => (
                  <div className="flex space-x-1 text-stieglitz">
                    <p>in</p>
                    <p className="text-white">{days}</p>d
                    <p className="text-white">{hours}</p>h
                    <p className="text-white">{minutes}</p>m
                    <p className="text-white">{seconds}</p>s
                  </div>
                )}
              />,
              '',
            ],
          ]}
        />
        {userPerpetualVaultData.userSharesLocked > 0n ? (
          <Cell
            label=""
            data={[
              [
                <Button
                  key="claim"
                  size="medium"
                  className="w-full"
                  onClick={buttonState.handler}
                >
                  Claim
                </Button>,
                '',
              ],
            ]}
          />
        ) : null}
      </div>
    </>
  );
};

export default DepositRow;
