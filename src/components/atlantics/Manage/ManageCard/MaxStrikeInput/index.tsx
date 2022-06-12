import { useCallback, useContext, useState } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

// import CustomInput from 'components/UI/CustomInput';

import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { TOKEN_DECIMALS } from 'constants/index';

interface MaxStrikeInputProps {
  token: string;
  tickSize?: BigNumber | undefined;
  maxStrikes?: any;
  setMaxStrike: (e: string | number) => void;
}

const MaxStrikeInput = (props: MaxStrikeInputProps) => {
  const { token, tickSize, setMaxStrike } = props;

  const { chainId } = useContext(WalletContext);

  const [error, setError] = useState('');

  const handleChange = useCallback(
    (e: { target: { value: number | string } }) => {
      if (Number(e.target.value) === 0) return;

      // console.log(
      //   'Tick Size: ',
      //   tickSize?.toNumber(),
      //   tickSize?.mod(
      //     getContractReadableAmount(
      //       Number(e.target.value),
      //       TOKEN_DECIMALS[chainId]?.[token] ?? 18
      //     )
      //   )
      // );

      if (
        tickSize
          ?.mod(
            getContractReadableAmount(
              Number(e.target.value),
              TOKEN_DECIMALS[chainId]?.[token] ?? 18
            )
          )
          .eq(BigNumber.from(0))
      ) {
        // console.log('Divisible');
        setMaxStrike(e.target.value);
        setError('');
      } else {
        // console.log('Not divisble');
        setError('Invalid Strike Price');
      }
    },
    [tickSize, chainId, token, setMaxStrike]
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
