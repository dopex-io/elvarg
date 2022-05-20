// @ts-nocheck
import { useContext } from 'react';
import { Addresses } from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import cx from 'classnames';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';
import CircleIcon from 'svgs/icons/CircleIcon';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import displayAddress from 'utils/general/displayAddress';
import getExtendedLogoFromChainId from 'utils/general/getExtendedLogoFromChainId';
import getExplorerUrl from 'utils/general/getExplorerUrl';
import getFormattedDate from 'utils/date/getFormattedDate';

import styles from './styles.module.scss';

const SelectStrikeWidget = () => {
  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 text-center',
        styles.cardWidth
      )}
    >
      <img
        src={'/assets/buy-example.svg'}
        className={'w-24 h-14 mt-10 mx-auto'}
        alt={'Buy'}
      />
      <Typography variant="h5" className="mt-7">
        Start by selecting a strike price
      </Typography>
      <Typography variant="h6" className="text-stieglitz mt-3 mb-7">
        Use the table to the left or options below to generate an order{' '}
      </Typography>
    </Box>
  );
};

export default SelectStrikeWidget;
