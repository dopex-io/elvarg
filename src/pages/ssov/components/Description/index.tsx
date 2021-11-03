import { useState, useContext } from 'react';
import Box from '@material-ui/core/Box';

import VaultBox from '../InfoBox';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../ManageCard/PurchaseDialog';
import Dpx from 'assets/icons/DpxIcon';
import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Description = () => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { dpxTokenPrice, APY, ssovData } = useContext(SsovContext);

  const TVL =
    ssovData.totalEpochDeposits && dpxTokenPrice
      ? getUserReadableAmount(ssovData.totalEpochDeposits, 18) *
        getUserReadableAmount(dpxTokenPrice, 8)
      : 0;

  const info = [
    {
      icon: Dpx,
      heading: 'Asset',
      value: 'DPX',
    },
    {
      icon: Action,
      heading: 'Farm APY',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      toolTip: 'This is the base APY calculated from the farms',
    },
    {
      icon: Coin,
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
    },
  ];

  return (
    <Box className="flex flex-col mr-10">
      <Typography variant="h1" className="mb-6">
        DPX SSOV
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          DPX Single Staking Option Vault (SSOV)
        </span>{' '}
        accepts user DPX deposits and stakes them in the DPX Single Staking
        Farm.
        <br />
        <br />
        This farm simultaneously auto-compounds, farms and supplies DPX
        liquidity to our first options pool.
      </Typography>
      <Box className="flex flex-row">
        <CustomButton
          size="medium"
          className="w-52 mb-6 mr-2"
          onClick={() => {
            setPurchaseState(true);
          }}
        >
          Buy Call Options
        </CustomButton>
        <EpochSelector />
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item, index) => {
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
