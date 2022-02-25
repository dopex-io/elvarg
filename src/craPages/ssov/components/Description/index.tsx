import { useMemo, useState, useContext } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import useBnbSsovConversion from 'hooks/useBnbSsovConversion';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SsovData, SsovEpochData, SsovUserData } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import styles from './styles.module.scss';

const Description = ({
  ssovData,
  ssovEpochData,
  ssovUserData,
  type,
}: {
  ssovData: SsovData;
  ssovEpochData: SsovEpochData;
  ssovUserData: SsovUserData;
  type: string;
}) => {
  const { accountAddress, connect } = useContext(WalletContext);
  const { convertToBNB } = useBnbSsovConversion();

  const { APY, isVaultReady } = ssovEpochData;

  const tokenSymbol = useMemo(
    () => SSOV_MAP[ssovData.tokenName].tokenSymbol,
    [ssovData]
  );

  const isPut = useMemo(() => type === 'PUT', [type]);

  const TVL: number = useMemo(() => {
    if (ssovData.tokenPrice && ssovEpochData) {
      if (isPut) {
        return (
          getUserReadableAmount(ssovEpochData.totalEpochDeposits, 18) *
          getUserReadableAmount(ssovData.lpPrice, 18)
        );
      } else if (tokenSymbol === 'BNB') {
        return convertToBNB(ssovEpochData.totalEpochDeposits)
          .mul(ssovData.tokenPrice)
          .div(1e8)
          .toNumber();
      } else {
        return (
          getUserReadableAmount(ssovEpochData.totalEpochDeposits, 18) *
          getUserReadableAmount(ssovData.tokenPrice, 8)
        );
      }
    } else {
      return 0;
    }
  }, [ssovEpochData, convertToBNB, ssovData, tokenSymbol, isPut]);

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
      tooltip: isPut
        ? 'Curve 2Pool Fee APY and Curve Rewards'
        : ssovInfo[tokenSymbol].aprToolTipMessage,
    },
    {
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
      Icon: Coin,
    },
  ];

  return (
    <Box className={'w-3/4'}>
      <Box className={'flex'}>
        <Box className={'border-[2px] border-gray-500 rounded-full'}>
          <img
            src={'/assets/' + tokenSymbol.toLowerCase() + '.svg'}
            className={'w-20 h-20'}
          />
        </Box>
        <Typography variant="h1" className="ml-5 flex items-center space-x-3">
          Single Staking Option Vault ({tokenSymbol})
        </Typography>
      </Box>
      <Typography variant="h4" className="text-stieglitz mt-6 mb-6">
        <span className="text-white mr-2">
          {tokenSymbol} Single Staking Option Vault (SSOV)
        </span>
        {ssovInfo[tokenSymbol].mainPageMessage}
        <br />
        <br />
        This farms simultaneously auto-compounds, farms and supplies ETH
        liquidity to our first options pool.
      </Typography>
    </Box>
  );
};

export default Description;
