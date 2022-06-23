import { useContext, useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import { utils as ethersUtils } from 'ethers';
import Link from 'next/link';
// import { css } from '@emotion/css';

import { BnbConversionContext } from 'contexts/BnbConversion';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoBox from 'components/ir/InfoBox';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

import formatAmount from 'utils/general/formatAmount';

import { VAULT_MAP } from 'constants/index';

interface Props {
  className: string;
  data: {
    currentEpoch: number;
    totalEpochDeposits: string;
    rate: number;
    tvl: number;
    underlyingSymbol: string;
    retired: boolean;
    symbol: string;
    version: string;
  };
}

// const backgrounds: { [key: string]: string } = {
//   'MIM3CRV-1':
//     'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #7818c4 100%)',
//   PUSD3CRV:
//     'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #22e1ff 99.1%)',
//   'MIM3CRV-2':
//     'background: linear-gradient(359.05deg, #3e3e3e 0.72%, #0400ff 99.1%)',
// };

function VaultCard(props: Props) {
  const { className, data } = props;
  const { convertToBNB } = useContext(BnbConversionContext);
  const {
    currentEpoch,
    totalEpochDeposits,
    rate,
    tvl,
    underlyingSymbol: name,
    retired,
    symbol,
    version,
  } = data;
  const info = useMemo(() => {
    return [
      {
        heading: 'RATE',
        value: `${
          rate > 0 && String(rate) !== 'Infinity'
            ? formatAmount(rate, 2, true).toString() + '%'
            : '...'
        }`,
        Icon: Action,
        tooltip: 'Current rate of the pool MIM3CRV',
      },
      {
        heading: 'TVL',
        value: tvl === 0 ? '...' : formatAmount(tvl, 0, true),
        Icon: Coin,
      },
      {
        heading: 'DEPOSITS',
        value: `${formatAmount(
          name === 'BNB' && convertToBNB
            ? convertToBNB(
                ethersUtils.parseUnits(totalEpochDeposits, 8)
              ).toString()
            : totalEpochDeposits,
          0,
          true
        )}`,
        imgSrc: VAULT_MAP[symbol]?.src,
      },
    ];
  }, [rate, convertToBNB, name, totalEpochDeposits, tvl, symbol]);

  return (
    <Box className={cx('p-[1px] rounded-xl w-[350px]')}>
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
                {retired ? (
                  <span className="bg-red-500 p-1 text-sm rounded-sm ml-4">
                    RETIRED
                  </span>
                ) : null}
              </Typography>
              <img
                src={'/images/misc/calls.svg'}
                className="w-12 mt-1.5 ml-auto mr-2"
                alt={'CALLS'}
              />
              <img
                src={'/images/misc/puts.svg'}
                className="w-12 mt-1.5"
                alt={'PUTS'}
              />
            </Box>
          </Box>
          <Box className="grid grid-cols-3 gap-2 mb-2">
            {info.map((item) => {
              return <InfoBox key={item.heading} {...item} />;
            })}
          </Box>
          <Link href={`/vaults/ir/pool/${symbol}`} passHref>
            <CustomButton size="medium" className="my-4" fullWidth>
              Manage
            </CustomButton>
          </Link>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Epoch {currentEpoch}
            </Typography>
            <Typography variant="h6" className="text-stieglitz">
              Version {version}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default VaultCard;
