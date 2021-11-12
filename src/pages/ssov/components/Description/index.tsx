import { useState, useContext } from 'react';
import Box from '@material-ui/core/Box';

import VaultBox from '../InfoBox';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';
import Dpx from 'assets/tokens/Dpx';
import Rdpx from 'assets/tokens/Rdpx';
import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovContext } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Description = ({ ssov }: { ssov: 'dpx' | 'rdpx' }) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const context = useContext(SsovContext);
  const { tokenPrice, APY, ssovData } = context[ssov];

  const tokenSymbol = ssov === 'dpx' ? 'DPX' : 'rDPX';

  const TVL =
    ssovData.totalEpochDeposits && tokenPrice
      ? getUserReadableAmount(ssovData.totalEpochDeposits, 18) *
        getUserReadableAmount(tokenPrice, 8)
      : 0;

  const info = [
    {
      icon: ssov === 'dpx' ? Dpx : Rdpx,
      heading: 'Asset',
      value: tokenSymbol,
    },
    {
      icon: Action,
      heading: 'Farm APY',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      toolTip: 'This is the base APY calculated from the single staking farm',
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
        {tokenSymbol} SSOV
      </Typography>
      <Typography variant="h5" className="text-stieglitz mb-6">
        <span className="text-white">
          {tokenSymbol} Single Staking Option Vault (SSOV)
        </span>{' '}
        accepts user {tokenSymbol} deposits and stakes them in the {tokenSymbol}{' '}
        Single Staking Farm.
        <br />
        <br />
        This farm simultaneously auto-compounds, farms and supplies{' '}
        {tokenSymbol}
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
        <EpochSelector ssov={ssov} />
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
          ssov={ssov}
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
