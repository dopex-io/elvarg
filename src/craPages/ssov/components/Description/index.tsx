import { useState } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import InfoBox from '../InfoBox';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovProperties, SsovData, UserSsovData } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';

const Description = ({
  ssovProperties,
  ssovData,
  userSsovData,
}: {
  ssovProperties: SsovProperties;
  ssovData: SsovData;
  userSsovData: UserSsovData;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);

  const { cgTokenPrice } = ssovProperties;
  const { APY, isVaultReady } = ssovData;

  const tokenSymbol = SSOV_MAP[ssovProperties.tokenName].tokenSymbol;

  const TVL =
    ssovData?.totalEpochDeposits && cgTokenPrice
      ? getUserReadableAmount(ssovData.totalEpochDeposits, 18) * cgTokenPrice
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
      tooltip: 'This is the base APY calculated from the single staking farm',
    },
    {
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
      Icon: Coin,
    },
  ];

  return (
    <Box className={cx('flex flex-col md:mr-5', styles.wrapperWidth)}>
      <Typography variant="h1" className="mb-6">
        {tokenSymbol} SSOV
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          {tokenSymbol} Single Staking Option Vault (SSOV)
        </span>{' '}
        accepts user {tokenSymbol} deposits and stakes them in the {tokenSymbol}{' '}
        Single Staking Farm.
        <br />
        <br />
        This farm simultaneously auto-compounds, farms and supplies{' '}
        {tokenSymbol} liquidity to our first options pool.
      </Typography>
      <Box className="flex justify-center items-center flex-row mb-6">
        <Tooltip
          className="text-stieglitz"
          title={
            !isVaultReady
              ? 'Options can not be bought during the deposit period'
              : ''
          }
          arrow={true}
        >
          <Box className="w-full mr-2">
            <CustomButton
              size="medium"
              fullWidth
              className="rounded-lg"
              onClick={() => {
                setPurchaseState(true);
              }}
              disabled={!isVaultReady}
            >
              Buy Call Options
            </CustomButton>
          </Box>
        </Tooltip>
        <EpochSelector ssovProperties={ssovProperties} />
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item) => {
          return <InfoBox key={item.heading} {...item} />;
        })}
      </Box>
      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
          ssovProperties={ssovProperties}
          ssovData={ssovData}
          userSsovData={userSsovData}
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
