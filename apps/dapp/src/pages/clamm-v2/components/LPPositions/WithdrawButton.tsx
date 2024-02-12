import { useCallback, useMemo, useState } from 'react';
import { BaseError, Hex, parseUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import { ArrowLongRightIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Slider from '@radix-ui/react-slider';
import { UniswapV3Pool } from 'pages/clamm-v2/abi/UniswapV3Pool';
import toast from 'react-hot-toast';
import { useContractRead, useWalletClient } from 'wagmi';

import { getLiquidityForAmounts } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { formatAmount } from 'utils/general';

import { PrepareWithdrawData } from './columns';
import { CreateWithdrawTx } from './ManageDialog';

type Props = {
  updateTxQueue: (
    id: string,
    tx: Hex,
    amount0: number,
    amount1: number,
  ) => void;
  createWithdrawTx: (
    params: CreateWithdrawTx[],
  ) => Promise<`0x${string}`[] | undefined>;
};

const WithdrawButton = ({
  amount0,
  amount1,
  amount0Symbol,
  amount1Symbol,
  amount0Decimals,
  amount1Decimals,
  pool,
  tickLower,
  tickUpper,
  tokenId,
  createWithdrawTx,
  updateTxQueue,
}: PrepareWithdrawData & Props) => {
  const [sliderAmount, setSliderAmount] = useState([100]);
  const { data: walletClient } = useWalletClient();
  const [open, setOpen] = useState(false);
  const { data } = useContractRead({
    abi: UniswapV3Pool,
    address: pool,
    functionName: 'slot0',
  });

  const withdrawAmounts = useMemo(() => {
    const perc = sliderAmount[0];
    return {
      amount0: amount0 - (perc / 100) * amount0,
      amount1: amount1 - (perc / 100) * amount1,
    };
  }, [amount0, amount1, sliderAmount]);

  const handleWithdraw = useCallback(async () => {
    if (!data || !walletClient) return;
    const _amount0 = amount0 - withdrawAmounts.amount0;
    const _amount1 = amount1 - withdrawAmounts.amount1;
    try {
      const liquidity = getLiquidityForAmounts(
        data[0],
        getSqrtRatioAtTick(BigInt(tickLower)),
        getSqrtRatioAtTick(BigInt(tickUpper)),
        parseUnits(_amount0.toFixed(8), amount0Decimals),
        parseUnits(_amount1.toFixed(8), amount1Decimals),
      );

      const withdrawTX = await createWithdrawTx([
        {
          tickLower,
          tickUpper,
          tokenId: BigInt(tokenId),
          withdrawableLiquidity: liquidity,
        },
      ]);

      if (!withdrawTX) return;

      updateTxQueue(tokenId, withdrawTX[0], _amount0, _amount1);
    } catch (err) {
      if (err instanceof BaseError) {
        toast.error(err['message']);
      } else {
        toast.error('Action Failed. Check console for more information');
        console.error(err);
      }
    }
  }, [
    createWithdrawTx,
    updateTxQueue,
    walletClient,
    tokenId,
    amount0,
    amount1,
    amount0Decimals,
    amount1Decimals,
    data,
    tickLower,
    tickUpper,
    withdrawAmounts.amount0,
    withdrawAmounts.amount1,
  ]);

  return (
    <DropdownMenu.Root open={open}>
      <DropdownMenu.Trigger
        onClick={() => setOpen(true)}
        className="text-stieglitz text-[13px]"
      >
        <Cog6ToothIcon height={18} width={18} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-[280px] h-fit space-y-[12px] bg-umbra border border-mineshaft rounded-lg p-[12px]">
          <h6 className="text-center text-[14px] text-stieglitz font-medium">
            Adjust Withdrawable amounts
          </h6>
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex flex-col items-center justify-center flex-[0.45] space-y-[4px]">
              <span className="text-stieglitz">Withdrawable</span>
              <span className="flex flex-col">
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>{formatAmount(amount0, 4)}</span>
                  <span className="text-stieglitz">{amount0Symbol}</span>
                </span>
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>{formatAmount(amount1, 4)}</span>
                  <span className="text-stieglitz">{amount1Symbol}</span>
                </span>
              </span>
            </div>
            <ArrowLongRightIcon
              className="flex-[0.05]"
              height={14}
              width={14}
            />
            <div className="flex flex-col items-center justify-center flex-[0.45] space-y-[4px]">
              <span className="text-stieglitz">Remainder</span>
              <span className="flex flex-col">
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>{formatAmount(withdrawAmounts.amount0, 4)}</span>
                  <span className="text-stieglitz">{amount0Symbol}</span>
                </span>
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>{formatAmount(withdrawAmounts.amount1, 4)}</span>
                  <span className="text-stieglitz">{amount1Symbol}</span>
                </span>
              </span>
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            defaultValue={sliderAmount}
            onValueChange={(v) => setSliderAmount(v)}
            max={100}
            step={1}
          >
            <Slider.Track className="relative grow rounded-full h-[3px] bg-mineshaft">
              <Slider.Range className="absolute bg-wave-blue rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-3 h-3 bg-white rounded-[10px] focus:outline-none"
              aria-label="Volume"
            />
          </Slider.Root>
          <div className="flex items-center justify-around">
            <Button onClick={() => setOpen(false)} size="xsmall" variant="text">
              Cancel
            </Button>
            <Button size="xsmall" onClick={handleWithdraw}>
              Confirm
            </Button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default WithdrawButton;
