import { useMemo, useState, useContext } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SsovData, SsovEpochData, SsovUserData } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';
import { BnbConversionContext } from 'contexts/BnbConversion';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/common/WalletButton';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

const Wrapper = styled(Box)`
  width: 100%;
  @media (min-width: 768px) {
    width: 400px;
  }
`;

const Description = ({
  ssovData,
  ssovEpochData,
  ssovUserData,
  type,
}: {
  ssovData: SsovData;
  ssovEpochData: SsovEpochData;
  ssovUserData: SsovUserData;
  type: string;
}) => {
  const [purchaseState, setPurchaseState] = useState<boolean>(false);
  const { accountAddress, connect } = useContext(WalletContext);
  const { convertToBNB } = useContext(BnbConversionContext);

  const { APY, isVaultReady } = ssovEpochData;

  const tokenSymbol = useMemo(
    // @ts-ignore TODO: FIX
    () => SSOV_MAP[ssovData.tokenName].tokenSymbol,
    [ssovData]
  );

  const isPut = useMemo(() => type === 'PUT', [type]);

  const TVL: number = useMemo(() => {
    if (ssovData.tokenPrice && ssovEpochData) {
      if (isPut) {
        return (
          // @ts-ignore TODO: FIX
          getUserReadableAmount(ssovEpochData.totalEpochDeposits, 18) *
          // @ts-ignore TODO: FIX
          getUserReadableAmount(ssovData.lpPrice, 18)
        );
      } else if (tokenSymbol === 'BNB') {
        return convertToBNB(ssovEpochData.totalEpochDeposits)
          .mul(ssovData.tokenPrice)
          .div(1e8)
          .toNumber();
      } else {
        return (
          getUserReadableAmount(ssovEpochData.totalEpochDeposits, 18) *
          getUserReadableAmount(ssovData.tokenPrice, 8)
        );
      }
    } else {
      return 0;
    }
  }, [ssovEpochData, convertToBNB, ssovData, tokenSymbol, isPut]);

  const info = [
    {
      heading: 'Asset',
      value: tokenSymbol,
      // @ts-ignore TODO: FIX
      imgSrc: SSOV_MAP[ssovData.tokenName].imageSrc,
    },
    {
      heading: 'Farm APY',
      value: `${!APY ? '...' : APY.toString() + '%'}`,
      Icon: Action,
      tooltip: isPut
        ? 'Curve 2Pool Fee APY and Curve Rewards'
        : // @ts-ignore TODO: FIX
          ssovInfo[tokenSymbol].aprToolTipMessage,
    },
    {
      heading: 'TVL',
      value: TVL ? `$${formatAmount(TVL, 0, true)}` : '...',
      Icon: Coin,
    },
  ];

  return (
    <Wrapper className="flex flex-col md:mr-5">
      <Typography variant="h1" className="mb-6 flex items-center space-x-3">
        <span>{tokenSymbol} SSOV</span>
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
          {tokenSymbol} Single Staking Option Vault (SSOV)
        </span>
        <br />
        {isPut
          ? 'Deposit 2CRV (or USDT, USDC) into strikes providing liquidity into option pools to earn Fee APY, Curve rewards and premiums in 2CRV from each option purchase.'
          : // @ts-ignore TODO: FIX
            ssovInfo[tokenSymbol].mainPageMessage}
      </Typography>
      <Box className="flex justify-center items-center flex-row mb-6">
        <Tooltip
          className="text-stieglitz"
          title={
            !isVaultReady
              ? 'Options can not be bought during the deposit period'
              : ''
          }
          arrow={true}
        >
          <Box className="w-full mr-2">
            <WalletButton
              size="medium"
              fullWidth
              className="rounded-lg"
              onClick={() => {
                accountAddress ? setPurchaseState(true) : connect();
              }}
              disabled={!isVaultReady || ssovEpochData.isEpochExpired}
            >
              Buy {type} Options
            </WalletButton>
          </Box>
        </Tooltip>
        <EpochSelector />
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
    </Wrapper>
  );
};

export default Description;
