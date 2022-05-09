import { useMemo, useState, useContext } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';

import formatAmount from 'utils/general/formatAmount';

import { WalletContext } from 'contexts/Wallet';
import { SsovV3EpochData, SsovV3Data } from 'contexts/SsovV3';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';
import InfoBox from '../InfoBox';
import EpochSelector from '../../ssov/EpochSelector';
import PurchaseDialog from '../PurchaseDialog';
import Wrapper from '../Wrapper';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

import styles from './styles.module.scss';

const Description = ({
  ssovData,
  ssovEpochData,
}: {
  ssovData: SsovV3Data;
  ssovEpochData: SsovV3EpochData;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { accountAddress, connect } = useContext(WalletContext);

  const { APY, TVL } = ssovEpochData;

  const [wrapOpen, setWrapOpen] = useState(false);

  const type = useMemo(() => {
    return ssovData.isPut ? 'PUT' : 'CALL';
  }, [ssovData]);

  const info = [
    {
      heading: 'APY*',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      Icon: Action,
    },
    {
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
      Icon: Coin,
    },
  ];

  return (
    <Box className={cx('flex flex-col md:mr-5', styles.wrapperWidth)}>
      <Typography variant="h1" className="mb-6 flex items-center space-x-3">
        <span>{ssovData.underlyingSymbol}</span>
        <span
          className={cx(
            'text-lg text-black p-1.5 rounded-md',
            ssovData.isPut ? 'bg-down-bad' : 'bg-emerald-500'
          )}
        >
          {type + 'S'}
        </span>
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          {ssovData.underlyingSymbol} Single Staking Option Vault V3
        </span>
        <br />
        {`Deposit ${ssovData.collateralSymbol} into strikes providing liquidity into option pools to earn yield in premiums and rewards.`}
      </Typography>
      <EpochSelector className="mb-6" />
      <Box className="flex justify-center items-center flex-row mb-6">
        <Box className="w-full mr-2">
          <WalletButton
            size="medium"
            fullWidth
            className="rounded-lg"
            onClick={() => {
              accountAddress ? setPurchaseState(true) : connect();
            }}
          >
            Buy {type} Options
          </WalletButton>
        </Box>
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item) => {
          return <InfoBox key={item.heading} {...item} />;
        })}
      </Box>
      <Box>
        <Typography variant={'h6'} className={'text-stieglitz'}>
          *Effective APY if you deposit now
        </Typography>
      </Box>
      <Box
        role="button"
        className="underline mt-3"
        onClick={() => setWrapOpen(true)}
      >
        Wrap ETH
      </Box>
      <Wrapper open={wrapOpen} handleClose={() => setWrapOpen(false)} />
      {purchaseState && (
        <PurchaseDialog
          open={purchaseState}
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
