import { useState, useContext } from 'react';
import Box from '@material-ui/core/Box';

import VaultBox from '../VaultBox';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EpochSelector from '../EpochSelector';
import PurchaseVault from '../ManageCard/PurchaseVault';
import Dpx from 'assets/icons/DpxIcon';
import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Description = () => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { currentEpoch, dpxTokenPrice, APY, currentEpochSsovData } =
    useContext(SsovContext);

  const TVL =
    currentEpochSsovData.totalEpochDeposits && dpxTokenPrice
      ? getUserReadableAmount(currentEpochSsovData.totalEpochDeposits, 18) *
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
      heading: 'APY',
      value: APY || '...',
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
        DPX SSF Option Vault
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">DPX SSF Option Vault (SSOV)</span> accepts
        user DPX deposits and stakes them in the DPX Single-Staking-Farm (SSF).
        <br />
        <br />
        This farm simultaneously auto-compounds, farms and supplies DPX
        liquidity to our first L1 options pool.
      </Typography>
      <Box className="flex flex-row">
        <CustomButton
          size="medium"
          className="w-52 mb-6 mr-2"
          onClick={() => {
            setPurchaseState(true);
          }}
          disabled={currentEpoch < 1}
        >
          Buy Call Options From Vault
        </CustomButton>
        <EpochSelector />
      </Box>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {info.map((item, index) => {
          return (
            <VaultBox
              key={index}
              Icon={item.icon}
              heading={item.heading}
              value={item.value}
            />
          );
        })}
      </Box>
      {purchaseState && (
        <PurchaseVault
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
