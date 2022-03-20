import { useMemo, useState, useContext, Dispatch, SetStateAction } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { RateVaultContext } from 'contexts/RateVault';
import { WalletContext } from 'contexts/Wallet';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseCard from '../PurchaseCard';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import styles from './styles.module.scss';

const Description = ({
  activeVaultContextSide,
  setActiveVaultContextSide,
}: {
  activeVaultContextSide: string;
  setActiveVaultContextSide: Dispatch<SetStateAction<string>>;
}) => {
  const { accountAddress, connect } = useContext(WalletContext);
  const rateVaultContext = useContext(RateVaultContext);

  const APY = 0;
  const isVaultReady = true;

  const tokenSymbol = '2CRV';

  const TVL: number = 0;

  const info = [
    {
      heading: 'Asset',
      value: tokenSymbol,
      imgSrc: '/assets/ir.svg',
    },
    {
      heading: 'Farm APY',
      value: `0%`,
      Icon: Action,
      tooltip: 'Curve 2Pool Fee APY and Curve Rewards',
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
        <Box className={'rounded-full mt-auto mb-auto'}>
          <img src={'/assets/ir.svg'} className={'w-20'} />
        </Box>
        <Typography variant="h1" className="ml-5 flex items-center space-x-3">
          Pool2 Interest Rate Vaults
        </Typography>
      </Box>
      <Typography variant="h4" className="text-stieglitz mt-6 mb-6">
        <span className="text-white mr-2">Curve Interest Rate Vault</span>
        accepts Curve LP deposits and lets users write Interest Rate options
        that allows for bet/hedge on the underlying interest rate.
      </Typography>
    </Box>
  );
};

export default Description;
