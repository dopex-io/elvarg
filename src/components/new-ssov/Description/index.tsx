import { useMemo, useContext, Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';
import { BnbConversionContext } from 'contexts/BnbConversion';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import Typography from 'components/UI/Typography';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

const Description = ({
  activeSsovContextSide,
}: {
  activeSsovContextSide: string;
  setActiveSsovContextSide: Dispatch<SetStateAction<string>>;
}) => {
  const ssovContext = useContext(SsovContext);
  const { convertToBNB } = useContext(BnbConversionContext);

  const { APY } = ssovContext[activeSsovContextSide].ssovEpochData;

  const tokenSymbol = useMemo(
    () =>
      SSOV_MAP[ssovContext[activeSsovContextSide].ssovData.tokenName]
        .tokenSymbol,
    [ssovContext, activeSsovContextSide]
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
  }, [ssovContext, convertToBNB, tokenSymbol, activeSsovContextSide]);

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
            alt={tokenSymbol}
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
