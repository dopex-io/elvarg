import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Typography from 'components/UI/Typography';

const STRATS: Record<string | symbol, string>[] = [
  {
    title: 'Insured Long Perps',
    path: '/atlantics/manage/insured-perps/',
    chainId: '42161',
    contractAddress: '0xb54f8134f8a52C92f11E0b47D6C77CEE9C7F5dDE',
  },
];

const PoolStrategies = ({
  pair,
}: {
  pair: [string | undefined, string | undefined];
}) => {
  const [underlying, base] = pair;
  const [selection, setSelection] = useState<string>('Insured Long Perps');

  const handleClick = useCallback((event: any) => {
    setSelection(event.target.textContent);
  }, []);

  const menu = useMemo(() => {
    if (!base || !underlying || !STRATS)
      return (
        <Typography variant="h6" className="font-mono">
          Loading...
        </Typography>
      );

    return (
      <Select
        value={selection}
        onChange={handleClick}
        className="bg-umbra rounded-md text-center w-3/4 text-white"
        MenuProps={{
          classes: { paper: 'bg-umbra' },
        }}
        classes={{ icon: 'text-white', select: 'px-3' }}
        variant="standard"
        disableUnderline
      >
        {STRATS.map((strategyItem, index) => (
          <MenuItem key={index} value={strategyItem['title']}>
            <Link
              href={
                strategyItem['path']?.concat(`${underlying + '-' + base}`) ?? ''
              }
              passHref
              className="text-white font-mono"
            >
              {selection}
            </Link>
          </MenuItem>
        ))}
      </Select>
    );
  }, [base, handleClick, selection, underlying]);

  return menu;
};

export default PoolStrategies;
