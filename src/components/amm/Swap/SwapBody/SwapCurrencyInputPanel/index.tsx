import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { TOKEN_DECIMALS } from 'constants/index';

interface SwapCurrencyInputPanelProps {
  token1?:
    | {
        symbol: string;
        address: string;
      }
    | undefined;
  token2?:
    | {
        symbol: string;
        address: string;
      }
    | undefined;
  amountIn?: BigNumber | string;
  setAmountIn?: Function;
  minAmountOut?: BigNumber | string;
}

const SwapCurrencyInputPanel = (props: SwapCurrencyInputPanelProps) => {
  const { token1, setAmountIn, amountIn /*token2, amountIn, minAmountOut*/ } =
    props;

  const { chainId, userAssetBalances } = useBoundStore();

  // const

  const handleMax = useCallback(() => {
    if (!userAssetBalances || !token1 || !chainId || !setAmountIn) return;
    setAmountIn(
      getUserReadableAmount(
        userAssetBalances[token1?.symbol.toUpperCase() ?? ''] ?? '0',
        TOKEN_DECIMALS[chainId.toString()]?.[token1?.symbol.toUpperCase() ?? '']
      )
    );
  }, [chainId, setAmountIn, token1, userAssetBalances]);

  const handleChange = useCallback(
    (e: any) => {
      if (!setAmountIn) return;
      setAmountIn(e.target.value);
    },
    [setAmountIn]
  );

  return (
    <Box className="bg-umbra rounded-xl">
      <Input
        placeholder="0.0"
        value={amountIn}
        onChange={handleChange}
        type="number"
        leftElement={
          <Box className="flex w-full h-full my-auto">
            <Box
              className="flex w-fit mr-3 bg-cod-gray rounded-full space-x-1 p-1 pr-3"
              role="button"
            >
              <img
                src={`/images/tokens/${token1?.symbol.toLowerCase()}.svg`}
                alt={token1?.symbol.toLowerCase()}
                className="w-8 h-8"
              />
              <Typography variant="h5" className="my-auto">
                {token1?.symbol.toUpperCase()}
              </Typography>
              <KeyboardArrowDownRoundedIcon className="fill-current text-mineshaft my-auto" />
            </Box>
            <Box
              className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
              role="button"
              onClick={handleMax}
            >
              <Typography variant="caption" color="stieglitz">
                MAX
              </Typography>
            </Box>
          </Box>
        }
      />
      <Box className="flex justify-between p-3 pt-0">
        <Typography variant="h6" color="stieglitz">
          Balance:{' '}
          {formatAmount(
            getUserReadableAmount(
              userAssetBalances[token1?.symbol.toUpperCase() ?? ''] ?? '0',
              TOKEN_DECIMALS[chainId.toString()]?.[
                token1?.symbol.toUpperCase() ?? ''
              ]
            ),
            3
          )}
        </Typography>
        <Typography variant="h6" color="stieglitz"></Typography>
      </Box>
    </Box>
  );
};

export default SwapCurrencyInputPanel;
