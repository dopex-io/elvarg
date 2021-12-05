import { useState } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import VaultBox from '../InfoBox';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { Ssov, SsovData, UserSsovData } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';

const Description = ({
  ssov,
  ssovData,
  userSsovData,
}: {
  ssov: Ssov;
  ssovData: SsovData;
  userSsovData: UserSsovData;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);

  const { tokenPrice } = ssov;
  const { APY, isVaultReady } = ssovData;

  const tokenSymbol = SSOV_MAP[ssov.tokenName].tokenSymbol;

  const TVL =
    ssovData?.totalEpochDeposits && tokenPrice
      ? getUserReadableAmount(ssovData.totalEpochDeposits, 18) *
        getUserReadableAmount(tokenPrice, 8)
      : 0;

  const info = [
    {
      icon: SSOV_MAP[ssov.tokenName].icon,
      heading: 'Asset',
      value: tokenSymbol,
    },
    {
      icon: Action,
      heading: 'Farm APY',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      toolTip: 'This is the base APY calculated from the single staking farm',
    },
    {
      icon: Coin,
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
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
      <Box className="flex flex-row">
        <CustomButton
          size="medium"
          className="mb-6 mr-2"
          fullWidth
          onClick={() => {
            setPurchaseState(true);
          }}
          disabled={!isVaultReady}
        >
          Buy Call Options
        </CustomButton>
        {!isVaultReady ? (
          <Box className="flex mt-3">
            <Tooltip
              className="h-4 text-stieglitz"
              title={'Options can not be bought during the deposit period'}
            >
              <InfoOutlinedIcon />
            </Tooltip>
          </Box>
        ) : null}
        <EpochSelector ssov={ssov} />
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item) => {
          return item.toolTip ? (
            <VaultBox
              key={item.heading}
              Icon={item.icon}
              heading={item.heading}
              value={item.value}
              toolTip={item.toolTip}
            />
          ) : (
            <VaultBox
              key={item.heading}
              Icon={item.icon}
              heading={item.heading}
              value={item.value}
            />
          );
        })}
      </Box>
      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
          ssov={ssov}
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
