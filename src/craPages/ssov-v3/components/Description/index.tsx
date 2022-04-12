import { useMemo, useState, useContext } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SsovData, SsovEpochData, SsovUserData } from 'contexts/Ssov';
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
import { SsovV3EpochData } from 'contexts/SsovV3';

const Description = ({
  ssovData,
  ssovEpochData,
  ssovUserData,
  type,
}: {
  ssovData: SsovData;
  ssovEpochData: SsovV3EpochData;
  ssovUserData: any;
  type: string;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { accountAddress, connect } = useContext(WalletContext);

  const { APY } = ssovEpochData;

  const isPut = useMemo(() => type === 'PUT', [type]);

  const TVL = 0;

  const info = [
    {
      heading: 'Asset',
      value: 'ETH',
      imgSrc: '/assets/eth.svg',
    },
    {
      heading: 'Farm APY',
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
        <span>ETH Weekly</span>
        <span
          className={cx(
            'text-lg text-black p-1.5 rounded-md',
            isPut ? 'bg-down-bad' : 'bg-emerald-500'
          )}
        >
          {type + 'S'}
        </span>
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          ETH Weekly Single Staking Option Vault V3
        </span>
        <br />
        {
          'Deposit WETH into strikes providing liquidity into option pools to earn DPX rewards and premiums in WETH from each option purchase.'
        }
      </Typography>
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
