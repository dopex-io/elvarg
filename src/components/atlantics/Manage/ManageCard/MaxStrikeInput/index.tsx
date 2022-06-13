import { useCallback, useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';
import { AtlanticsContext } from 'contexts/Atlantics';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { TOKEN_DECIMALS } from 'constants/index';

interface MaxStrikeInputProps {
  token: string;
  currentPrice: BigNumber;
  tickSize?: BigNumber | undefined;
  maxStrikes?: any;
  setMaxStrike: (e: string | number) => void;
}

const MaxStrikeInput = (props: MaxStrikeInputProps) => {
  const { currentPrice, token, tickSize, setMaxStrike } = props;

  const { chainId, signer } = useContext(WalletContext);

  const [error, setError] = useState('');

  const handleChange = useCallback(
    (e: { target: { value: number | string } }) => {
      if (Number(e.target.value) === 0) return;

      const _input = getContractReadableAmount(
        Number(e.target.value),
        TOKEN_DECIMALS[chainId]?.[token] ?? 18
      ).mul(1e2);

      let _mod = _input.mod(tickSize ?? BigNumber.from(0));

      if (
        _mod.eq('0') &&
        currentPrice.gte(_input) &&
        _input.gt(BigNumber.from(0))
      ) {
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
      <Typography variant="h6" className="text-stieglitz">
        Max Strike
      </Typography>
      <Input
        disableUnderline
        placeholder="Enter Strike"
        onChange={handleChange}
        type="number"
        className={`border ${
          !error ? 'border-mineshaft' : 'border-down-bad'
        } rounded-md px-2 bg-umbra w-full`}
        classes={{ input: 'text-white text-xs text-right py-2' }}
      />
      {error ? (
        <Typography variant="h6" className="text-red-400 text-right">
          {error}
        </Typography>
      ) : null}
    </Box>
  );
};

export default MaxStrikeInput;
