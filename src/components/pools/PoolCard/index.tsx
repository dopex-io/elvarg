import React, { useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from 'components/UI/Typography';
import InfoBox from 'components/pools/InfoBox';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

import { VAULT_MAP } from 'constants/index';

interface Props {
  className: string;
  data: {
    currentEpoch: number;
    totalDeposits: string;
    tvl: number;
    underlyingSymbol: string;
    symbol: string;
  };
}

const StyledWrapper = styled(Box)`
  ${(props: { symbol: string }) => {
    if (props.symbol === 'ETH-ATLANTIC-STRADDLE-2')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #7818c4 100%)';
    else if (props.symbol === 'RDPX-ATLANTIC-STRADDLE-2')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #0400ff 99.1%)';
    return '';
  }};
`;

function PoolCard(props: Props) {
  const { className, data } = props;
  const { totalDeposits, tvl, underlyingSymbol: name, symbol } = data;
  const info = useMemo(() => {
    return [
      {
        heading: 'Value Locked',
        value: '$' + formatAmount(getUserReadableAmount(tvl, 8), 2),
        Icon: Action,
      },
      {
        heading: 'Volume',
        value: '-',
        Icon: Coin,
      },
    ];
  }, [tvl]);

  const openPool = (name: string) => {
    if (name) window?.open(`/pools/straddles/${name}`, '_blank');
  };

  return (
    <StyledWrapper symbol={symbol} className="p-[1px] rounded-xl w-[450px]">
      <Box
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto',
          className
        )}
      >
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 h-8 max-w-14 flex flex-row">
              <img
                className="w-9 h-9"
                alt={symbol}
                src={VAULT_MAP[symbol]?.src}
              />
            </Box>
            <Box className="flex flex-grow items-center justify-between">
              <Typography variant="h4" className="mr-2 font-bold">
                {symbol.split('-')[0]}
              </Typography>
            </Box>
          </Box>
          <Box className="grid grid-cols-2 gap-2 mb-2">
            {info.map((item) => {
              return <InfoBox key={item.heading} {...item} />;
            })}
          </Box>
          <Box>
            <Typography variant="h5" className="!text-stieglitz">
              Pools <span className="text-white text-sm">(1)</span>
            </Typography>
          </Box>
          <Box
            className="flex flex-col p-4 bg-umbra hover:bg-opacity-70 rounded-xl mt-2.5 cursor-pointer"
            onClick={() => openPool(name)}
          >
            <Box className="flex flex-row">
              <Box className="mr-4 h-8 max-w-14 flex flex-row">
                <img
                  className="w-6 h-6 mt-[5px]"
                  alt="USDC"
                  src="/images/tokens/usdc.svg"
                />
              </Box>
              <Box className="flex flex-grow items-center justify-between">
                <Typography variant="h5" className="font-semi-bold">
                  LONG STRADDLES
                </Typography>
                <img
                  src={'/images/misc/calls.svg'}
                  className="w-12 mt-1 ml-[15px] mr-auto"
                  alt={'CALLS'}
                />
                <img
                  src={'/images/misc/arrow-right-white.svg'}
                  className="w-3 mt-1 ml-auto mr-[10px]"
                  alt={'Enter'}
                />
              </Box>
            </Box>
            <Box className={'flex mt-3'}>
              <Typography variant="h5" className="!text-stieglitz ml-0 mr-auto">
                Epoch length
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h5" className="!text-white mr-auto ml-0">
                  Weekly
                </Typography>
              </Box>
            </Box>
            <Box className={'flex mt-1'}>
              <Typography variant="h5" className="!text-stieglitz ml-0 mr-auto">
                Deposits
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h5" className="!text-white mr-auto ml-0">
                  ${formatAmount(getUserReadableAmount(totalDeposits, 8), 2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledWrapper>
  );
}

export default PoolCard;
