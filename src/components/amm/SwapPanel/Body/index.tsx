import { useState, useCallback, useMemo, useEffect } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import IconButton from '@mui/material/IconButton';

import SwapCurrencyInputPanel from 'components/amm/SwapPanel/Body/SwapCurrencyInputPanel';
import TokenOutPanel from 'components/amm/SwapPanel/Body/TokenOutPanel';
import DetailsSwapSection from 'components/amm/SwapPanel/Body/DetailsSwapSection';
import Button from 'components/UI/Button';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { TOKEN_DECIMALS } from 'constants/index';

const undefinedPair = {
  symbol: '',
  address: '',
};

const Body = () => {
  const {
    chainId,
    ammPools: pools,
    getSelectedAmmPool,
    updateAmmPools,
    getAmmPools,
  } = useBoundStore();

  const [amountIn, setAmountIn] = useState<BigNumber | string>('0');
  const [reversed, setReversed] = useState<boolean>(false);
  const [selectedPair, _] = useState<string>('RDPXDSC');
  const [buttonState, setButtonState] = useState<[boolean, string]>([
    false,
    '',
  ]);

  const selectedPool = useMemo(() => {
    if (!pools) return;
    return getSelectedAmmPool(selectedPair);
  }, [getSelectedAmmPool, pools, selectedPair]);

  const handleReverse = useCallback(() => {
    setReversed(!reversed);
  }, [reversed]);

  const handleSwapOrder = useCallback(() => {}, []);

  useEffect(() => {
    (async () => {
      await updateAmmPools();
      setButtonState([false, 'Not Enough Collateral']);
    })();
  }, [getAmmPools, pools, updateAmmPools]);

  return (
    <Box className="space-y-1">
      {/* 
      <SwapCurrencyInputPanel />
      - amountIn
      - tokenIn
      - tokenOut
      - calculate price in USD for both tokenIn, tokenOut inside component
      - same for tokenOut input panel 
      - two-way input
        - user can change both amountIn & amountOut
        - update the other input field value
      - update Body component states...
        - change amountIn => update amountOut
        - update usd value of amountIn, amountOut
        - pass updated tokenIn, tokenOut, amountIn, amountOut into DetailsSwapSection for updated fee calc
      */}
      <SwapCurrencyInputPanel
        amountIn={amountIn}
        setAmountIn={setAmountIn}
        token1={selectedPool?.pair[+reversed] ?? undefinedPair}
        token2={selectedPool?.pair[+!reversed] ?? undefinedPair}
      />
      <Box className="relative bg-cod-gray">
        <IconButton
          className="absolute -top-4 bg-umbra p-0 hover:bg-umbra"
          onClick={handleReverse}
        >
          <ArrowDownwardRoundedIcon className="w-7 h-7 rounded-full fill-current text-stieglitz border-4 border-cod-gray" />
        </IconButton>
      </Box>
      <SwapCurrencyInputPanel
        token1={selectedPool?.pair[+!reversed] ?? undefinedPair}
        token2={selectedPool?.pair[+reversed] ?? undefinedPair}
        minAmountOut={'0'}
      />
      <TokenOutPanel
        tokenSymbol={selectedPool?.pair[+!reversed]?.['symbol'] ?? ''}
        amountWithFee={formatAmount(
          getUserReadableAmount(
            '0',
            // @ts-ignore TODO: FIX
            TOKEN_DECIMALS[chainId.toString()][
              pools?.[selectedPair]?.pair[+!reversed]?.[
                'symbol'
              ]?.toLocaleUpperCase() ?? ''
            ]
          ),
          3
        ).toString()}
      />
      <Box className="flex flex-col bg-umbra rounded-xl p-3 space-y-2">
        {/*
        <DetailsSwapSection />
        - tokenIn prop
        - amountIn prop
        - tokenOut prop
        - calculate price impact from reserves
        - fetch fee
        */}
        <DetailsSwapSection />
        <Button
          onClick={handleSwapOrder}
          color={buttonState[0] ? 'primary' : 'mineshaft'}
          disabled={!buttonState[0]}
        >
          {buttonState[1]}
        </Button>
      </Box>
    </Box>
  );
};

export default Body;
