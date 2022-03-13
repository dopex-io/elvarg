import { useContext, useMemo } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';

import { BnbConversionContext } from 'contexts/BnbConversion';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import InfoBox from '../InfoBox';

import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';

import styles from './styles.module.scss';

function SsovCard(props) {
  const { className, data } = props;
  const { convertToBNB } = useContext(BnbConversionContext);

  const info = useMemo(() => {
    if (!convertToBNB) return [];
    return [
      {
        heading: (
          <Box className={'flex'}>
            <Typography variant="caption" className={'text-[#6DFFB9]'}>
              |
            </Typography>
            <Typography
              variant="caption"
              className={'ml-1 mt-[1px] text-stieglitz'}
            >
              APY
            </Typography>
          </Box>
        ),
        value: `${
          data.call?.apy === 0 || !data.call?.apy ? '...' : `${data.call?.apy}%`
        }`,
        tooltip: data.name.aprToolTipMessage,
      },
      {
        heading: (
          <Box className={'flex'}>
            <Typography variant="caption" className={'text-[#FF617D]'}>
              |
            </Typography>
            <Typography
              variant="caption"
              className={'ml-1 mt-[1px] text-stieglitz'}
            >
              APY
            </Typography>
          </Box>
        ),
        value: `${
          data.put?.apy === 0 || !data.put?.apy ? '...' : `${data.put?.apy}%`
        }`,
        tooltip:
          'This is the base APY calculated from Curve 2Pool Fees and Rewards',
      },
      {
        heading: 'TVL',
        value:
          '$' +
          formatAmount(
            (parseFloat(data.put?.tvl) || 0) +
              (parseFloat(data.call?.tvl) || 0),
            0,
            true
          ),
      },
    ];
  }, [convertToBNB, data]);

  return (
    <Box className={cx('p-[1px] rounded-xl', styles[data.name], styles.Box)}>
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
                src={SSOV_MAP[data.name].imageSrc}
                alt={data.name}
              />
            </Box>
            <Box className="">
              <Typography variant="h4" className="mr-2 mb-0.5">
                {data.name}
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
              href={`/ssov/${data.name}`}
            >
              Manage
            </CustomButton>
          </Box>

          <Box className="grid grid-cols-3 gap-2 mb-2">
            {info.map((item, i) => {
              return <InfoBox key={i} {...item} />;
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SsovCard;
