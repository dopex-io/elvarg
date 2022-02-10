import { useState } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import InfoBox from '../InfoBox';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import useBnbSsovConversion from 'hooks/useBnbSsovConversion';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovProperties, SsovData, UserSsovData } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo/ssovInfo.json';

import styles from './styles.module.scss';

const MetavaultDescription = ({
  ssovProperties,
  ssovData,
  userSsovData,
}: {
  ssovProperties: SsovProperties;
  ssovData: SsovData;
  userSsovData: UserSsovData;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { convertToBNB } = useBnbSsovConversion();

  const { tokenPrice } = ssovProperties;
  const { APY, isVaultReady } = ssovData;

  const tokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;

  const TVL = tokenPrice
    ? ssovData?.totalEpochDeposits && tokenSymbol === 'BNB'
      ? convertToBNB(ssovData.totalEpochDeposits)
          .mul(tokenPrice)
          .div(1e8)
          .toString()
      : getUserReadableAmount(ssovData.totalEpochDeposits, 18) *
        getUserReadableAmount(tokenPrice, 8)
    : 0;

  const info = [
    {
      heading: 'Asset',
      value: tokenSymbol,
      imgSrc: SSOV_MAP[ssovProperties.tokenName].imageSrc,
    },
    {
      heading: 'Farm APY',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      Icon: Action,
      tooltip: ssovInfo[tokenSymbol].aprToolTipMessage,
    },
    {
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
      Icon: Coin,
    },
  ];

  return (
    <Box className={cx('flex flex-col md:mr-5', styles.wrapperWidth)}>
      <Box className={'flex'}>
        <img
          src={`/assets/${tokenSymbol.toLowerCase()}.svg`}
          className="w-[4rem] h-[4rem]  border-[2px] border-[#ffffff33] rounded-full"
        />
        <Typography variant="h2" className="mt-[0.8rem] ml-4">
          {tokenSymbol} SSOV
        </Typography>
      </Box>

      <Box className={'mt-6 max-w-screen-sm'}>
        <Typography variant="h5" className="text-stieglitz">
          <span className="text-white">{tokenSymbol} Metavault</span> accepts{' '}
          {tokenSymbol} deposits and will direct yield from SIngle Staking Farm
          towards call options from SSOV
        </Typography>
      </Box>

      <Box className={'flex-col mt-10 grid lg:grid-cols-3 grid-cols-1'}>
        <Box className={'md:pr-7'}>
          <Box className={'flex'}>
            <img
              src={'/assets/refresh.svg'}
              className={'w-3 h-4 mr-2 mt-1.5'}
            />
            <Typography variant="h5" className="text-white">
              Autosync
            </Typography>
          </Box>
          <Typography variant="h5" className="text-stieglitz mt-3">
            Set and forget with autosync. It will continuously rool your yield
            into every epoch with the same dollar cost average strategy
          </Typography>
        </Box>
        <Box className={'md:pr-7'}>
          <Box className={'flex'}>
            <img src={'/assets/pause.svg'} className={'w-4 h-4 mr-2 mt-1.5'} />
            <Typography variant="h5" className="text-white">
              Active/Paused
            </Typography>
          </Box>
          <Typography variant="h5" className="text-stieglitz mt-3">
            When paused your vault will stop its strategy and continue to stake
            and autocompound your farm rewards instead
          </Typography>
        </Box>
        <Box className={''}>
          <Box className={'flex'}>
            <img
              src={'/assets/white-alarm.svg'}
              className={'w-4 h-4 mr-2 mt-1.5'}
            />
            <Typography variant="h5" className="text-white">
              Settle anytime
            </Typography>
          </Box>
          <Typography variant="h5" className="text-stieglitz mt-3">
            These options periodically appear in your wallet which you can
            settle at anytime
          </Typography>
        </Box>
      </Box>

      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
          userSsovData={userSsovData}
          ssovProperties={ssovProperties}
          ssovData={ssovData}
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

export default MetavaultDescription;
