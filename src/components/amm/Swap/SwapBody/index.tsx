import { useState, useCallback } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import IconButton from '@mui/material/IconButton';

import SwapCurrencyInputPanel from 'components/amm/Swap/SwapBody/SwapCurrencyInputPanel';
import TokenOutPanel from 'components/amm/Swap/SwapBody/TokenOutPanel';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { TOKEN_DECIMALS } from 'constants/index';

const pools = {
  DPXETH: {
    pool: '0xabcdefabcdefabcdefabcdef',
    pair: [
      {
        symbol: 'ETH',
        address: '0x0',
      },
      {
        symbol: 'DPX',
        address: '0x1',
      },
    ],
  },
};

const undefinedPair = {
  symbol: '',
  address: '',
};

const SwapBody = () => {
  const { chainId } = useBoundStore();

  const [amountIn, setAmountIn] = useState<BigNumber | string>('0');
  const [reversed, setReversed] = useState<boolean>(false);

  const handleReverse = useCallback(() => {
    setReversed(!reversed);
  }, [reversed]);

  return (
    <Box className="space-y-1">
      <SwapCurrencyInputPanel
        amountIn={amountIn}
        setAmountIn={setAmountIn}
        token1={pools['DPXETH'].pair[+reversed] ?? undefinedPair}
        token2={pools['DPXETH'].pair[+!reversed] ?? undefinedPair}
      />
      <Box className="relative space-y-1 bg-cod-gray">
        <IconButton
          className="absolute -top-3 bg-cod-gray p-0 hover:bg-cod-gray"
          onClick={handleReverse}
        >
          <ArrowDownwardRoundedIcon className="rounded-full fill-current text-mineshaft" />
        </IconButton>
      </Box>
      <SwapCurrencyInputPanel
        token1={pools['DPXETH'].pair[+!reversed] ?? undefinedPair}
        token2={pools['DPXETH'].pair[+reversed] ?? undefinedPair}
        minAmountOut={'0'}
      />
      <TokenOutPanel
        tokenSymbol={pools['DPXETH'].pair[+!reversed]?.symbol ?? ''}
        amountWithFee={formatAmount(
          getUserReadableAmount(
            '1'.repeat(18),
            // @ts-ignore TODO: FIX
            TOKEN_DECIMALS[chainId.toString()][
              pools['DPXETH'].pair[+!reversed]?.symbol.toLocaleUpperCase() ?? ''
            ]
          ),
          3
        ).toString()}
      />
    </Box>
  );
};

export default SwapBody;
