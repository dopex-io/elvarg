import { useMemo, useState, useContext, Dispatch, SetStateAction } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

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

const Withdrawals = ({
  activeType,
  setActiveType,
}: {
  activeType: string;
  setActiveType: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Box className={'w-full'}>
      <Typography variant="h4" className="text-white">
        Withdrawals
      </Typography>
      <Typography variant="h4" className="text-stieglitz mt-3">
        At the end of every epoch, users can withdraw any excess funds from the
        volume pool - however they would have to pay a 1% penalty at withdrawal
        for non-usage of funds. All penalties are withdraw-able by DPX
        governance token holders in the form of protocol fees.
      </Typography>
    </Box>
  );
};

export default Withdrawals;
