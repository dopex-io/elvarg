import { ReactNode, useMemo, useState } from 'react';

import cx from 'classnames';
import format from 'date-fns/format';
import noop from 'lodash/noop';
import { useBoundStore } from 'store';
import Action from 'svgs/icons/Action';
import Coin from 'svgs/icons/Coin';

import { Reward, SsovV3Data, SsovV3EpochData } from 'store/Vault/ssov';

import Typography from 'components/UI/Typography';
import SignerButton from 'components/common/SignerButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import EpochSelector from '../EpochSelector';
import InfoBox from '../InfoBox';
import PurchaseDialog from '../PurchaseDialog';

const SsovStat = ({ name, value }: { name: ReactNode; value: ReactNode }) => (
  <div className="flex flex-col px-2 py-1 ml-1">
    <span className="text-white text-[0.5rem] sm:text-[0.8rem]">{value}</span>
    <span className="text-stieglitz text-[0.5rem] sm:text-[0.8rem]">
      {name}
    </span>
  </div>
);

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
      return null;
    }

    return (
      <div className="mb-5">
        <span className="text-white">Current incentives</span>
        {rewards?.map((rewardInfo: Reward, idx: number) => {
          if (rewardInfo.amount === '0') return null;
          return (
            <p key={idx}>
              <span>
                {formatAmount(getUserReadableAmount(rewardInfo.amount, 18), 2)}{' '}
              </span>
              <span>{rewardInfo.rewardToken}</span>
            </p>
          );
        })}
      </div>
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
    <div className="flex flex-col md:mr-5 w-full md:w-[480px]">
      <div className="flex">
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
        <SsovStat
          name="24h Volume"
          value={`$${formatAmount(
            getUserReadableAmount(ssovEpochData.totalEpochPurchasesInUSD, 28),
            2,
            true
          )}`}
        />
        <SsovStat
          name="Open Interest"
          value={`$${formatAmount(
            getUserReadableAmount(ssovEpochData.volumeInUSD, 24),
            2,
            true
          )}`}
        />
      </div>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          {ssovData.underlyingSymbol} Single Staking Option Vault V3
        </span>
        <br />
        {`Deposit ${ssovData.collateralSymbol} into strikes providing liquidity into option pools to earn yield in premiums and rewards.`}
      </Typography>

      <Incentives />
      <EpochSelector className="mb-6" />
      {ssovEpochData.isEpochExpired ? (
        <div className="mb-3">
          <Typography variant="h5">
            Settlement price was{' $'}
            {formatAmount(
              getUserReadableAmount(ssovEpochData.settlementPrice, 8),
              2
            )}
          </Typography>
        </div>
      ) : null}
      <div className="mb-3">
        Epoch duration
        <p className="font-bold">
          {format(epochStartTime * 1000, 'd MMM yyyy HH:mm')} -{' '}
          {format(epochEndTime * 1000, 'd MMM yyyy HH:mm')}
        </p>
      </div>
      <div className="flex justify-center items-center flex-row mb-6">
        <div className="w-full mr-2">
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
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item) => {
          return <InfoBox key={item.heading} {...item} />;
        })}
      </div>
      <div>
        <Typography variant={'h6'} className={'text-stieglitz'}>
          *Effective APY if you deposit now
        </Typography>
      </div>
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
    </div>
  );
};

export default Description;
