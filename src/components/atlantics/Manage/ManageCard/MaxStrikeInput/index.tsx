import { useCallback, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { TOKEN_DECIMALS } from 'constants/index';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

interface MaxStrikeInputProps {
  token: string;
  currentPrice: BigNumber;
  tickSize?: BigNumber | undefined;
  maxStrikes?: any;
  setMaxStrike: (e: string | number) => void;
}

const MaxStrikeInput = (props: MaxStrikeInputProps) => {
  const { currentPrice, token, tickSize, setMaxStrike } = props;

  const { chainId } = useBoundStore();

  const [error, setError] = useState('');

  const depositPlaceHolderText = useMemo(() => {
    if (!tickSize || !currentPrice) return 'Enter Max Strike';
    const _tickSize = Number(tickSize) / 1e8;
    const _currentPrice = Number(currentPrice) / 1e8;
    const excess = _currentPrice % _tickSize;
    const validStrike = _currentPrice - excess;

    return `i.e. ${validStrike}, ${validStrike - _tickSize}, ${
      validStrike - _tickSize * 2
    } ...`;
  }, [tickSize, currentPrice]);

  const handleChange = useCallback(
    (e: { target: { value: number | string } }) => {
      if (Number(e.target.value) === 0) return;

      const _input = getContractReadableAmount(
        Number(e.target.value),
        TOKEN_DECIMALS[chainId]?.[token] ?? 18
      ).mul(1e2);

      let _mod = _input.mod(tickSize ?? BigNumber.from(0));

      if (_mod.eq('0') && currentPrice.gte(_input) && _input.gt('0')) {
        setMaxStrike(e.target.value);
        setError('');
      } else {
        setError('Invalid Strike Price');
      }
    },
    [tickSize, chainId, token, currentPrice, setMaxStrike]
  );

  return (
    <Box className="flex flex-col bg-umbra p-3 w-full rounded-xl space-y-3">
      <Typography variant="h6" className="text-right" color="stieglitz">
        Enter Max Strike{' '}
        <Tooltip title="Choice of strike must be below spot price and modulo of strike by tick size should be 0.">
          <InfoOutlined className="h-4" />
        </Tooltip>
      </Typography>
      <Input
        disableUnderline
        placeholder={depositPlaceHolderText}
        onChange={handleChange}
        type="number"
        className={`border ${
          !error ? 'border-mineshaft' : 'border-down-bad'
        } rounded-md px-2 bg-umbra w-full`}
        classes={{ input: 'text-white text-xs text-right py-2' }}
      />
      {error ? (
        <Typography variant="h6" className="text-right" color="down-bad">
          {error}
        </Typography>
      ) : null}
    </Box>
  );
};

export default MaxStrikeInput;
