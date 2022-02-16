import { useMemo, useState } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import useBnbSsovConversion from 'hooks/useBnbSsovConversion';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovData, SsovEpochData, SsovUserData } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import styles from './styles.module.scss';

const Description = ({
  ssovData,
  ssovEpochData,
  ssovUserData,
}: {
  ssovData: SsovData;
  ssovEpochData: SsovEpochData;
  ssovUserData: SsovUserData;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { convertToBNB } = useBnbSsovConversion();

  const { tokenPrice } = ssovData;
  const { APY, isVaultReady } = ssovEpochData;

  const tokenSymbol = useMemo(
    () => SSOV_MAP[ssovData.tokenName].tokenSymbol,
    [ssovData]
  );

  const TVL: number = useMemo(() => {
    if (tokenPrice && ssovEpochData) {
      if (tokenSymbol === 'BNB') {
        return convertToBNB(ssovEpochData.totalEpochDeposits)
          .mul(tokenPrice)
          .div(1e8)
          .toNumber();
      } else {
        getUserReadableAmount(ssovEpochData.totalEpochDeposits, 18) *
          getUserReadableAmount(tokenPrice, 8);
      }
    } else {
      return 0;
    }
  }, [ssovEpochData, convertToBNB, tokenPrice, tokenSymbol]);

  const info = [
    {
      heading: 'Asset',
      value: tokenSymbol,
      imgSrc: SSOV_MAP[ssovData.tokenName].imageSrc,
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
      <Typography variant="h1" className="mb-6">
        {tokenSymbol} SSOV
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          {tokenSymbol} Single Staking Option Vault (SSOV)
        </span>{' '}
        {ssovInfo[tokenSymbol].mainPageMessage}
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
            <WalletButton
              size="medium"
              fullWidth
              className="rounded-lg"
              onClick={() => {
                setPurchaseState(true);
              }}
              disabled={!isVaultReady}
            >
              Buy Call Options
            </WalletButton>
          </Box>
        </Tooltip>
        <EpochSelector />
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item) => {
          return <InfoBox key={item.heading} {...item} />;
        })}
      </Box>
      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
          ssovUserData={ssovUserData}
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
