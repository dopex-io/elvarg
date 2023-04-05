import { useMemo, useState } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import noop from 'lodash/noop';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { SsovV3EpochData, SsovV3Data, Reward } from 'store/Vault/ssov';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';
import SignerButton from 'components/common/SignerButton';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

const Description = ({
  ssovData,
  ssovEpochData,
}: {
  ssovData: SsovV3Data;
  ssovEpochData: SsovV3EpochData;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { accountAddress } = useBoundStore();

  const { APY, TVL, rewards } = ssovEpochData;

  const type = useMemo(() => {
    return ssovData.isPut ? 'PUT' : 'CALL';
  }, [ssovData]);

  const epochStartTime = Number(ssovEpochData.epochTimes[0]?.toNumber());
  const epochEndTime = Number(ssovEpochData.epochTimes[1]?.toNumber());

  const Incentives = () => {
    if (rewards?.length === 0) {
      return (
        <Typography variant="h5" className="text-stieglitz mb-5">
          -
        </Typography>
      );
    }

    return (
      <Box className="mb-5">
        {rewards?.map((rewardInfo: Reward, idx: number) => {
          return (
            <Typography key={idx} variant="h5" className="text-stieglitz">
              {formatAmount(
                getUserReadableAmount(rewardInfo.amount.hex, 18),
                2
              )}{' '}
              {rewardInfo.rewardToken}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const info = [
    {
      heading: 'APY*',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      Icon: Action,
    },
    {
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
      Icon: Coin,
    },
  ];

  return (
    <Box className="flex flex-col md:mr-5 w-full md:w-[400px]">
      <Box className="flex">
        <Typography variant="h1" className="mb-6 flex items-center space-x-3">
          <span>{ssovData.underlyingSymbol}</span>
          <span
            className={cx(
              'text-lg text-black p-1.5 rounded-md',
              ssovData.isPut ? 'bg-down-bad' : 'bg-emerald-500'
            )}
          >
            {type + 'S'}
          </span>
        </Typography>
        <Typography
          variant="h4"
          className="mb-6 ml-3 flex text-lg items-center space-x-3 border border-primary py-1 px-2 rounded-md"
        >
          $
          {formatAmount(
            getUserReadableAmount(ssovData.tokenPrice || '0', 8),
            2
          )}
        </Typography>
      </Box>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          {ssovData.underlyingSymbol} Single Staking Option Vault V3
        </span>
        <br />
        {`Deposit ${ssovData.collateralSymbol} into strikes providing liquidity into option pools to earn yield in premiums and rewards.`}
      </Typography>
      <Typography variant="h5" className="text-stieglitz">
        <span className="text-white">Current incentives</span>
      </Typography>
      <Incentives />
      <EpochSelector className="mb-6" />
      {ssovEpochData.isEpochExpired ? (
        <Box className="mb-3">
          <Typography variant="h5">
            Settlement price was{' $'}
            {formatAmount(
              getUserReadableAmount(ssovEpochData.settlementPrice, 8),
              2
            )}
          </Typography>
        </Box>
      ) : null}
      <Box className="mb-3">
        Epoch duration
        <p className="font-bold">
          {format(epochStartTime * 1000, 'd MMM yyyy HH:mm')} -{' '}
          {format(epochEndTime * 1000, 'd MMM yyyy HH:mm')}
        </p>
      </Box>
      <Box className="flex justify-center items-center flex-row mb-6">
        <Box className="w-full mr-2">
          <SignerButton
            size="medium"
            className="rounded-lg"
            onClick={() => {
              accountAddress ? setPurchaseState(true) : noop;
            }}
            disabled={ssovData?.isCurrentEpochExpired || false}
          >
            Buy {type} Options
          </SignerButton>
        </Box>
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item) => {
          return <InfoBox key={item.heading} {...item} />;
        })}
      </Box>
      <Box>
        <Typography variant={'h6'} className={'text-stieglitz'}>
          *Effective APY if you deposit now
        </Typography>
      </Box>
      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
          ssovData={ssovData}
          ssovEpochData={ssovEpochData}
          handleClose={
            (() => {
              setPurchaseState(false);
            }) as any
          }
        />
      )}
    </Box>
  );
};

export default Description;
