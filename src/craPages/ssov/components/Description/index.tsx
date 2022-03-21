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
import PurchaseCard from '../PurchaseCard';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import styles from './styles.module.scss';

const Description = ({
  activeSsovContextSide,
  setActiveSsovContextSide,
}: {
  activeSsovContextSide: string;
  setActiveSsovContextSide: Dispatch<SetStateAction<string>>;
}) => {
  const ssovContext = useContext(SsovContext);
  const { accountAddress, connect } = useContext(WalletContext);
  const { convertToBNB } = useContext(BnbConversionContext);

  const { APY, isVaultReady } =
    ssovContext[activeSsovContextSide].ssovEpochData;

  const tokenSymbol = useMemo(
    () =>
      SSOV_MAP[ssovContext[activeSsovContextSide].ssovData.tokenName]
        .tokenSymbol,
    [ssovContext[activeSsovContextSide].ssovData]
  );

  const TVL: number = useMemo(() => {
    if (
      ssovContext[activeSsovContextSide].ssovData.tokenPrice &&
      ssovContext[activeSsovContextSide].ssovEpochData
    ) {
      if (activeSsovContextSide === 'PUT') {
        return (
          getUserReadableAmount(
            ssovContext[activeSsovContextSide].ssovEpochData.totalEpochDeposits,
            18
          ) *
          getUserReadableAmount(
            ssovContext[activeSsovContextSide].ssovData.lpPrice,
            18
          )
        );
      } else if (tokenSymbol === 'BNB') {
        return convertToBNB(
          ssovContext[activeSsovContextSide].ssovEpochData.totalEpochDeposits
        )
          .mul(ssovContext[activeSsovContextSide].ssovData.tokenPrice)
          .div(1e8)
          .toNumber();
      } else {
        return (
          getUserReadableAmount(
            ssovContext[activeSsovContextSide].ssovEpochData.totalEpochDeposits,
            18
          ) *
          getUserReadableAmount(
            ssovContext[activeSsovContextSide].ssovData.tokenPrice,
            8
          )
        );
      }
    } else {
      return 0;
    }
  }, [
    ssovContext[activeSsovContextSide].ssovEpochData,
    convertToBNB,
    ssovContext[activeSsovContextSide].ssovData,
    tokenSymbol,
    activeSsovContextSide,
  ]);

  const info = [
    {
      heading: 'Asset',
      value: tokenSymbol,
      imgSrc:
        SSOV_MAP[ssovContext[activeSsovContextSide].ssovData.tokenName]
          .imageSrc,
    },
    {
      heading: 'Farm APY',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      Icon: Action,
      tooltip:
        activeSsovContextSide === 'PUT'
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
    <Box className={'lg:w-3/4'}>
      <Box className={'flex'}>
        <Box
          className={
            'border-[2px] border-gray-500 rounded-full mt-auto mb-auto'
          }
        >
          <img
            src={'/assets/' + tokenSymbol.toLowerCase() + '.svg'}
            className={'w-[6rem]'}
          />
        </Box>
        <Typography
          variant="h3"
          className="ml-5 flex items-center space-x-3 lg:text-4xl"
        >
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
