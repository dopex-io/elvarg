import Link from 'next/link';

import { useCallback, useMemo, useState } from 'react';

import LaunchIcon from '@mui/icons-material/Launch';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import { AP_STRATEGIES } from 'constants/atlanticPoolsInfo';
import { CHAINS } from 'constants/chains';

const PoolStrategies = ({
  pair,
}: {
  pair: [string | undefined, string | undefined];
}) => {
  const [underlying, base] = pair;

  const { chainId, contractAddresses, accountAddress } = useBoundStore();

  const [_, setSelection] = useState<string>('Insured Long Perps');

  const handleClick = useCallback((event: any) => {
    setSelection(event.target.textContent);
  }, []);

  const menu = useMemo(() => {
    if (
      !base ||
      !underlying ||
      !AP_STRATEGIES ||
      !contractAddresses ||
      !chainId
    )
      return (
        <Typography variant="h6" className="font-mono pt-2">
          {accountAddress ? 'Loading...' : '...'}
        </Typography>
      );

    return (
      <Select
        value={''}
        onChange={handleClick}
        className="bg-umbra rounded-md text-center text-white"
        MenuProps={{
          classes: { paper: 'bg-umbra' },
        }}
        displayEmpty
        renderValue={() => (
          <Typography variant="h6" className="text-center relative">
            Select Strategy
          </Typography>
        )}
        classes={{ icon: 'text-white', select: 'px-3' }}
        variant="standard"
        disableUnderline
      >
        {AP_STRATEGIES.map((strategyItem, index) => (
          <MenuItem key={index} value={strategyItem['title']} className="flex">
            <Link
              href={
                strategyItem['path']?.concat(`${underlying + '-' + base}`) ?? ''
              }
              passHref
              className="text-white"
            >
              {strategyItem['title']}
            </Link>
            <Tooltip
              title={'Visit Explorer'}
              placement="bottom"
              arrow
              enterTouchDelay={0}
              leaveTouchDelay={1000}
            >
              <Link
                target="_blank"
                href={`${CHAINS[chainId]?.explorer}address/${contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY']}`}
              >
                <LaunchIcon className="fill-current text-stieglitz p-1" />
              </Link>
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    );
  }, [
    base,
    chainId,
    accountAddress,
    contractAddresses,
    handleClick,
    underlying,
  ]);

  return menu;
};

export default PoolStrategies;
