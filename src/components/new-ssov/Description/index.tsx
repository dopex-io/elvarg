import { useMemo, useContext, Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';

import { SsovContext } from 'contexts/Ssov';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import Typography from 'components/UI/Typography';

const Description = ({
  activeSsovContextSide,
}: {
  activeSsovContextSide: string;
  setActiveSsovContextSide: Dispatch<SetStateAction<string>>;
}) => {
  const ssovContext = useContext(SsovContext);

  const tokenSymbol = useMemo(
    () =>
      // @ts-ignore TODO: FIX
      SSOV_MAP[ssovContext[activeSsovContextSide].ssovData.tokenName]
        .tokenSymbol,
    [ssovContext, activeSsovContextSide]
  );

  return (
    <Box className={'lg:w-3/4'}>
      <Box className={'flex'}>
        <Box
          className={
            'border-[2px] border-gray-500 rounded-full mt-auto mb-auto'
          }
        >
          <img
            src={'/images/tokens/' + tokenSymbol.toLowerCase() + '.svg'}
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
        {/* @ts-ignore TODO: FIX */}
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
