import { useContext, useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';
import { utils as ethersUtils } from 'ethers';
import Link from 'next/link';

import { BnbConversionContext } from 'contexts/BnbConversion';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoBox from '../InfoBox';

import Coin from 'svgs/icons/Coin';
import Action from 'svgs/icons/Action';

import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import styles from './styles.module.scss';

function SsovCard(props) {
  const { className, data } = props;
  const { convertToBNB } = useContext(BnbConversionContext);
  const {
    currentEpoch,
    totalEpochDeposits,
    apy,
    tvl,
    underlyingSymbol: name,
    type,
    duration,
    retired,
    symbol,
    version,
  } = data;

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
        tooltip:
          type === 'put'
            ? 'This is the base APY calculated from Curve 2Pool Fees and Rewards'
            : ssovInfo[name]
            ? ssovInfo[name].aprToolTipMessage
            : undefined,
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
        imgSrc:
          type === 'put'
            ? '/assets/2crv.png'
            : SSOV_MAP[name]
            ? SSOV_MAP[name].imageSrc
            : '',
      },
    ];
  }, [apy, convertToBNB, name, totalEpochDeposits, tvl, type]);

  return (
    <Box className={cx('p-[1px] rounded-xl', styles[name], styles.Box)}>
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
                src={SSOV_MAP[name].imageSrc}
                alt={name}
              />
            </Box>
            <Box className="flex flex-grow items-center justify-between">
              <Typography variant="h4" className="mr-2 font-bold">
                {name} {duration === 'weekly' ? 'weekly' : ''}{' '}
                {retired ? (
                  <span className="bg-red-500 p-1 text-sm rounded-sm ml-1">
                    RETIRED
                  </span>
                ) : null}
              </Typography>
              <img
                src={'/assets/' + type + 's.svg'}
                className="w-12 mt-1.5"
                alt={type}
              />
            </Box>
          </Box>
          <Box className="grid grid-cols-3 gap-2 mb-2">
            {info.map((item) => {
              return <InfoBox key={item.heading} {...item} />;
            })}
          </Box>
          <Link
            href={{
              pathname: `/ssov/manage/[duration]`,
              query: {
                type,
                duration,
                symbol,
                name,
              },
            }}
            passHref
          >
            <CustomButton size="medium" className="my-4" fullWidth>
              Manage
            </CustomButton>
          </Link>
          <Typography variant="h6" className="text-stieglitz">
            Epoch {currentEpoch}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SsovCard;
