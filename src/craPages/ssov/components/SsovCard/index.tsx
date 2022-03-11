import { useContext, useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';

import { BnbConversionContext } from 'contexts/BnbConversion';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoBox from '../InfoBox';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import styles from './styles.module.scss';
import { BigNumber } from 'ethers';

function SsovCard(props) {
  const { className, data } = props;
  const { convertToBNB } = useContext(BnbConversionContext);

  const { currentEpoch, totalEpochDeposits, epochTimes, apy, tvl, name, type } = data;

  const info = [
    {
      heading: 'APY',
      value: `${apy === 0 ? '...' : `${apy}%`}`,
      tooltip:
        type === 'put'
          ? 'This is the base APY calculated from Curve 2Pool Fees and Rewards'
          : ssovInfo[name].aprToolTipMessage,
    },
    {
      heading: 'APY',
      value: `${apy === 0 ? '...' : `${apy}%`}`,
      tooltip:
        type === 'put'
          ? 'This is the base APY calculated from Curve 2Pool Fees and Rewards'
          : ssovInfo[name].aprToolTipMessage,
    },
    {
      heading: 'Volume',
      value: tvl === 0 ? '...' : '$' + formatAmount(tvl),
    },
  ];


  const info = useMemo(() => {
    if (!convertToBNB) return [];
    return [
      {
        heading: 'APY',
        value: `${apy === 0 ? '...' : `${apy}%`}`,
        Icon: Action,
        tooltip:
          type === 'put'
            ? 'This is the base APY calculated from Curve 2Pool Fees and Rewards'
            : ssovInfo[name].aprToolTipMessage,
      },
      {
        heading: 'TVL',
        value: tvl === 0 ? '...' : formatAmount(tvl, 0, true),
        Icon: Coin,
      },
      {
        heading: 'DEPOSITS',
        value: `${formatAmount(
          name === 'BNB'
            ? convertToBNB(BigNumber.from(totalEpochDeposits)).toString()
            : getUserReadableAmount(totalEpochDeposits, underlyingDecimals),
          0,
          true
        )}`,
        imgSrc: type === 'put' ? '/assets/2crv.png' : SSOV_MAP[name].imageSrc,
      },
    ];
  }, [
    apy,
    convertToBNB,
    name,
    totalEpochDeposits,
    tvl,
    type,
    underlyingDecimals,
  ]);

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
            <Box className="mr-3 h-8 max-w-14 flex flex-row">
              <img
                className="w-14 h-14 border-[0.1px] border-gray-600 rounded-full"
                src={SSOV_MAP[name].imageSrc}
                alt={name}
              />
            </Box>
            <Box className="">
              <Typography variant="h4" className="mr-2 mb-0.5">
                {name}
              </Typography>
              <Box className={'flex'}>
                <Typography variant="h5" className="text-stieglitz">
                  SSOV
                </Typography>
                <img
                  src={'/assets/calls.svg'}
                  className="w-10 h-5 mt-1 ml-2 mr-2"
                  alt={'CALL'}
                />
                <img
                  src={'/assets/puts.svg'}
                  className="w-10 h-5 mt-1"
                  alt={'PUT'}
                />
              </Box>
            </Box>
            <CustomButton
              size="small"
              className="ml-auto mt-1"
              href={`/ssov/${name}`}
            >
              Manage
            </CustomButton>
          </Box>

          <Box className="grid grid-cols-3 gap-2 mb-2">
            {info.map((item) => {
              return <InfoBox key={item.heading} {...item} />;
            })}
          </Box>
          <CustomButton
            size="medium"
            className="my-4"
            href={`/ssov/${type}/${name}`}
            fullWidth
          >
            Manage
          </CustomButton>
          <Typography variant="h6" className="text-stieglitz">
            Epoch {currentEpoch}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SsovCard;
