import { useMemo } from 'react';
import Link from 'next/link';

import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { Button } from '@dopex-io/ui';
import cx from 'classnames';
import format from 'date-fns/format';
import Coin from 'svgs/icons/Coin';

import InfoBox from 'components/UI/InfoBox';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  className?: string;
  data: {
    currentEpoch: string;
    utilization: string;
    tvl: string;
    underlyingSymbol: string;
    retired: boolean;
    symbol: string;
    epochTimes: {
      startTime: string;
      expiry: string;
    };
  };
}

const StyledWrapper = styled('div')`
  ${(props: { symbol: string }) => {
    if (props.symbol === 'ETH-ATLANTIC-STRADDLE-3')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #7818c4 100%)';
    else if (props.symbol === 'RDPX-ATLANTIC-STRADDLE-3')
      return 'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #0400ff 99.1%)';
    return '';
  }};
`;

function VaultCard(props: Props) {
  const { className, data } = props;
  const {
    currentEpoch,
    tvl,
    underlyingSymbol,
    retired,
    symbol,
    epochTimes,
    utilization,
  } = data;

  const info = useMemo(() => {
    return [
      {
        heading: 'Total Value Locked ($)',
        value: Number(tvl) === 0 ? '...' : formatAmount(tvl, 0, true),
        Icon: Coin,
      },
      {
        heading: 'Utilization ($)',
        value:
          Number(utilization) === 0
            ? '...'
            : formatAmount(utilization, 0, true),
        Icon: Coin,
      },
    ];
  }, [tvl, utilization]);

  return (
    <StyledWrapper symbol={symbol} className="p-[1px] rounded-xl w-[350px]">
      <div
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto',
          className
        )}
      >
        <div>
          <div className="flex flex-row mb-4">
            <div className="mr-4 h-8 max-w-14 flex flex-row">
              <img
                className="w-9 h-9"
                alt={underlyingSymbol}
                src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
              />
            </div>
            <div className="flex flex-grow items-center justify-between">
              <h4 className="mr-2 font-bold">
                {symbol.split('-')[0]}
                {retired ? (
                  <span className="bg-red-500 p-1 text-sm rounded-sm ml-4">
                    RETIRED
                  </span>
                ) : null}
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 mb-2">
            {info.map((item) => {
              return <InfoBox key={item.heading} {...item} />;
            })}
          </div>
          <Link href={`/straddles/${underlyingSymbol}`} passHref>
            <Button size="medium" className="my-4 w-full">
              Manage
            </Button>
          </Link>
          <div className="flex justify-between">
            <h6 className="text-stieglitz">Epoch {currentEpoch}</h6>
            {!retired ? (
              <Tooltip
                className="text-stieglitz"
                arrow={true}
                title="Epoch Start & Expiry Times"
              >
                <div>
                  <h6 color="stieglitz">
                    {format(Number(epochTimes.startTime) * 1000, 'd LLL')} -{' '}
                    {format(Number(epochTimes.expiry) * 1000, 'd LLL')}
                  </h6>
                </div>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

export default VaultCard;
