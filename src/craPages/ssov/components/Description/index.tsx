import { useMemo, useState, useContext, Dispatch, SetStateAction } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import {
  SsovContext,
  SsovData,
  SsovEpochData,
  SsovUserData,
} from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';
import { BnbConversionContext } from 'contexts/BnbConversion';

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
  activeType,
  setActiveType,
}: {
  activeType: string;
  setActiveType: Dispatch<SetStateAction<string>>;
}) => {
  const ssovContext = useContext(SsovContext);
  const { accountAddress, connect } = useContext(WalletContext);
  const { convertToBNB } = useContext(BnbConversionContext);

  const { APY, isVaultReady } = ssovContext[activeType].ssovEpochData;

  const tokenSymbol = useMemo(
    () => SSOV_MAP[ssovContext[activeType].ssovData.tokenName].tokenSymbol,
    [ssovContext[activeType].ssovData]
  );

  const isPut = useMemo(() => activeType === 'PUT', [activeType]);

  const TVL: number = useMemo(() => {
    if (
      ssovContext[activeType].ssovData.tokenPrice &&
      ssovContext[activeType].ssovEpochData
    ) {
      if (isPut) {
        return (
          getUserReadableAmount(
            ssovContext[activeType].ssovEpochData.totalEpochDeposits,
            18
          ) *
          getUserReadableAmount(ssovContext[activeType].ssovData.lpPrice, 18)
        );
      } else if (tokenSymbol === 'BNB') {
        return convertToBNB(
          ssovContext[activeType].ssovEpochData.totalEpochDeposits
        )
          .mul(ssovContext[activeType].ssovData.tokenPrice)
          .div(1e8)
          .toNumber();
      } else {
        return (
          getUserReadableAmount(
            ssovContext[activeType].ssovEpochData.totalEpochDeposits,
            18
          ) *
          getUserReadableAmount(ssovContext[activeType].ssovData.tokenPrice, 8)
        );
      }
    } else {
      return 0;
    }
  }, [
    ssovContext[activeType].ssovEpochData,
    convertToBNB,
    ssovContext[activeType].ssovData,
    tokenSymbol,
    isPut,
  ]);

  const info = [
    {
      heading: 'Asset',
      value: tokenSymbol,
      imgSrc: SSOV_MAP[ssovContext[activeType].ssovData.tokenName].imageSrc,
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
        {ssovInfo[tokenSymbol]?.mainPageMessage}
        <br />
        <br />
        This farms simultaneously auto-compounds, farms and supplies{' '}
        {tokenSymbol}
        liquidity to our first options pool.
      </Typography>
    </Box>
  );
};

export default Description;
