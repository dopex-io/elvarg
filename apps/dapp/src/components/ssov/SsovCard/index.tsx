import { useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import format from 'date-fns/format';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import InfoBox from 'components/ssov/InfoBox';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';

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
  } = data;

  const name = underlyingSymbol as string;

  const info = useMemo(() => {
    return [
      {
        heading: 'APY',
        value: `${
          apy > 0 && apy !== 'Infinity'
            ? formatAmount(apy, 0, true).toString() + '%'
            : '...'
        }`,
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
            : SSOV_MAP[name]
            ? SSOV_MAP[name]?.imageSrc
            : '',
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
            <Box className="mr-4 h-8 max-w-14 flex flex-row">
              <img
                className="w-9 h-9"
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
          <Link href={`/ssov/${symbol}`} passHref>
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
        </Box>
      </Box>
    </CustomBox>
  );
}

export default SsovCard;
