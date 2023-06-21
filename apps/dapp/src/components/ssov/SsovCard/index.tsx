import { useMemo } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import cx from 'classnames';
import format from 'date-fns/format';
import Action from 'svgs/icons/Action';
import Coin from 'svgs/icons/Coin';

import InfoBox from 'components/ssov/InfoBox';
import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

const nameToSsovStyle: { [key: string]: string } = {
  ETH: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #7818c4 100%)',
  DPX: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #22e1ff 99.1%)',
  RDPX: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #0400ff 99.1%)',
  GOHM: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #e6e6e6 99.1%)',
  BNB: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #fffb00 99.1%)',
  GMX: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #04a7f0 99.1%)',
  AVAX: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #f00404 99.1%)',
  CRV: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #82f004 99.1%)',
  BTC: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #f06a04 99.1%)',
  stETH: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #68ccfc 99.1%)',
  ARB: 'linear-gradient(359.05deg, #3e3e3e 0.72%, #68ccfc 99.1%)',
};

const CustomBox = styled(Box)(({ token }: { token: string }) => ({
  background: nameToSsovStyle[token],
  width: '350px',
}));

function SsovCard(props: any) {
  const { className, data } = props;
  const {
    currentEpoch,
    totalEpochDeposits,
    apy,
    tvl,
    underlyingSymbol,
    type,
    duration,
    retired,
    symbol,
    epochTimes,
    volume,
    totalEpochPurchases,
    underlyingPrice,
  } = data;

  const name = underlyingSymbol as string;

  const info = useMemo(() => {
    let _apy =
      apy > 0 && apy !== 'Infinity'
        ? formatAmount(apy, 0, true).toString() + '%'
        : '...';

    if (typeof apy !== 'string') {
      _apy = `upto ${Math.max(...apy.map((apy: string) => Number(apy)))}`;
    }

    return [
      {
        heading: 'APY',
        value: _apy,
        Icon: Action,
      },
      {
        heading: 'TVL',
        value: tvl === 0 ? '...' : formatAmount(tvl, 0, true),
        Icon: Coin,
      },
      {
        heading: 'DEPOSITS',
        value: `${formatAmount(totalEpochDeposits, 0, true)}`,
        imgSrc:
          type === 'put'
            ? '/images/tokens/2crv.svg'
            : `/images/tokens/${name.toLowerCase()}.svg`,
      },
    ];
  }, [apy, totalEpochDeposits, tvl, type, name]);

  return (
    <CustomBox className="p-[1px] rounded-xl" token={name}>
      <Box
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl h-full mx-auto',
          className
        )}
      >
        <Box>
          <Box className="flex flex-row mb-4">
            <Box className="mr-4 max-w-14 flex flex-row">
              <img
                className="w-8 h-auto"
                src={`/images/tokens/${name.toLowerCase()}.svg`}
                alt={name}
              />
            </Box>
            <Box className="flex flex-grow items-center justify-between">
              <Typography variant="h4" className="mr-2 font-bold">
                {name} {duration}{' '}
                {retired ? (
                  <span className="bg-red-500 p-1 text-sm rounded-sm ml-1">
                    RETIRED
                  </span>
                ) : null}
              </Typography>
              <img
                src={'/images/misc/' + type + 's.svg'}
                className="w-12 mt-1.5"
                alt={type}
              />
            </Box>
          </Box>
          <Box className="grid grid-cols-3 gap-2 mb-2">
            {info.map((item: any) => {
              return <InfoBox key={item.heading} {...item} />;
            })}
          </Box>
          <Link href={`/ssov/${symbol}`}>
            <CustomButton size="medium" className="my-4" fullWidth>
              Manage
            </CustomButton>
          </Link>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Epoch {currentEpoch}
            </Typography>
            {!retired && epochTimes ? (
              <Tooltip
                className="text-stieglitz"
                arrow={true}
                title="Epoch Start & Expiry Times"
              >
                <Box>
                  <Typography variant="h6" color="stieglitz">
                    {format(Number(epochTimes.startTime) * 1000, 'd LLL')} -{' '}
                    {format(Number(epochTimes.expiry) * 1000, 'd LLL')}
                  </Typography>
                </Box>
              </Tooltip>
            ) : null}
          </Box>
          <div className="flex justify-between">
            <h6>
              <span className="text-sm">
                24h Volume: ${formatAmount(volume, 2, true)}
              </span>
            </h6>
            <h6>
              <span className="text-sm">
                Open Interest: $
                {formatAmount(totalEpochPurchases * underlyingPrice, 2, true)}
              </span>
            </h6>
          </div>
        </Box>
      </Box>
    </CustomBox>
  );
}

export default SsovCard;
