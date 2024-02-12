import { useCallback, useMemo, useState } from 'react';
import {
  BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  parseUnits,
} from 'viem';

import { Button } from '@dopex-io/ui';
import {
  ArrowLongRightIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Slider from '@radix-ui/react-slider';
import { DopexV2PositionManager } from 'pages/clamm-v2/abi/DopexV2PositionManager';
import { UniswapV3Pool } from 'pages/clamm-v2/abi/UniswapV3Pool';
import { UniswapV3SingleTickLiquidityHandlerV2 } from 'pages/clamm-v2/abi/UniswapV3SingalTickLiquidityHandlerV2';
import { getPositionManagerAddress } from 'pages/clamm-v2/constants';
import toast from 'react-hot-toast';
import { useContractRead, useWalletClient } from 'wagmi';

import { getLiquidityForAmounts } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { formatAmount } from 'utils/general';

import { PrepareWithdrawData } from './columns';
import { CreateWithdrawTx } from './ManageDialog';

type Props = {
  reserved: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  current: {
    amount0: number;
    amount1: number;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  withdraw: PrepareWithdrawData;
  createWithdrawTx: (
    params: CreateWithdrawTx[],
  ) => Promise<`0x${string}`[] | undefined>;
};

const Reserve = ({
  reserved,
  current: { amount0, amount0Symbol, amount1, amount1Symbol },
  withdraw,
  createWithdrawTx,
}: Props) => {
  const { data: walletClient } = useWalletClient();
  const [sliderAmount, setSliderAmount] = useState([100]);
  const [open, setOpen] = useState(false);

  const reserveAmounts = useMemo(() => {
    const perc = sliderAmount[0];
    return {
      amount0: amount0 - (perc / 100) * amount0,
      amount1: amount1 - (perc / 100) * amount1,
    };
  }, [amount0, amount1, sliderAmount]);

  const { data } = useContractRead({
    abi: UniswapV3Pool,
    address: withdraw.pool,
    functionName: 'slot0',
  });

  const handleReserve = useCallback(async () => {
    if (!walletClient) return;
    const _amount0 = amount0 - reserveAmounts.amount0;
    const _amount1 = amount1 - reserveAmounts.amount1;

    const positionManager = getPositionManagerAddress(walletClient.chain.id);
    if (!positionManager) return;

    if (!data) return;
    const {
      tickLower,
      tickUpper,
      tokenId,
      amount0Decimals,
      amount1Decimals,
      pool,
      hook,
      handler,
    } = withdraw;

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
        withdrawableLiquidity: BigInt(liquidity),
      },
    ]);

    console.log(liquidity, _amount0, _amount1);

    if (!withdrawTX) return;

    const reserveTx = encodeFunctionData({
      abi: UniswapV3SingleTickLiquidityHandlerV2,
      functionName: 'reserveLiquidity',
      args: [
        encodeAbiParameters(
          [
            {
              name: 'pool',
              type: 'address',
            },
            {
              name: 'hook',
              type: 'address',
            },
            {
              name: 'tickLower',
              type: 'int24',
            },
            {
              name: 'tickUpper',
              type: 'int24',
            },
            {
              name: 'shares',
              type: 'uint128',
            },
          ],
          [pool, hook, tickLower, tickUpper, liquidity],
        ),
      ],
    });

    let withdrawSkipped = false;
    try {
      const tx0 = await walletClient.writeContract({
        abi: DopexV2PositionManager,
        functionName: 'burnPosition',
        address: positionManager,
        args: [handler, withdrawTX[0]],
      });

      toast.success('Transaction sent!: ' + tx0);
      console.log('Withdraw transaction receipt: ', tx0);
    } catch (err) {
      withdrawSkipped = true;
      if (err instanceof BaseError) {
        toast.error(err['shortMessage']);
      } else {
        console.error(err);
        toast.error(
          'Action Failed. Check console for more information on error',
        );
      }
    }

    if (!withdrawSkipped) {
      try {
        const tx1 = await walletClient.writeContract({
          abi: UniswapV3SingleTickLiquidityHandlerV2,
          functionName: 'reserveLiquidity',
          address: handler,
          args: [reserveTx],
        });

        toast.success('Transaction sent!: ' + tx1);
        console.log('Withdraw transaction receipt: ', tx1);
      } catch (err) {
        if (err instanceof BaseError) {
          toast.error(err['shortMessage']);
        } else {
          console.error(err);
          toast.error(
            'Action Failed. Check console for more information on error',
          );
        }
      }
    }
  }, [
    walletClient,
    withdraw,
    createWithdrawTx,
    amount0,
    amount1,
    data,
    reserveAmounts.amount0,
    reserveAmounts.amount1,
  ]);

  return reserved.amount0 + reserved.amount1 !== 0 ? (
    <div className="text-[13px] flex flex-col items-start">
      <div className="flex space-x-[4px]">
        <span>{formatAmount(reserved.amount0, 5)}</span>
        <span className="text-stieglitz text-[12px]">
          {reserved.amount0Symbol}
        </span>
      </div>
      <div className="flex space-x-[4px]">
        <span>{formatAmount(reserved.amount1, 5)}</span>
        <span className="text-stieglitz text-[12px]">
          {reserved.amount1Symbol}
        </span>
      </div>
    </div>
  ) : (
    <DropdownMenu.Root open={open}>
      <DropdownMenu.Trigger
        onClick={() => setOpen(true)}
        className="text-[13px] text-stieglitz flex items-center space-x-[4px] hover:text-white border-b w-fit border-dashed hover:border-white border-stieglitz hover:cursor-pointer"
      >
        <span>Set</span>
        <PencilSquareIcon height={14} width={14} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-[280px] h-fit space-y-[12px] bg-umbra border border-mineshaft rounded-lg p-[12px]">
          <h6 className="text-center text-[14px] text-stieglitz font-medium">
            Select liquidity to reserve
          </h6>
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex flex-col items-center justify-center flex-[0.45] space-y-[4px]">
              <span className="text-stieglitz">Current</span>
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
                  <span>{formatAmount(reserveAmounts.amount0, 4)}</span>
                  <span className="text-stieglitz">{amount0Symbol}</span>
                </span>
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>{formatAmount(reserveAmounts.amount1, 4)}</span>
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
          <div className="flex items-center justify-center w-full border rounded-md p-[6px] border-stieglitz bg-cod-gray bg-opacity-30 border-opacity-30">
            <p className="w-full text-[11px] text-stieglitz leading-[12px]">
              <b>IMPORTANT:</b> Liquidity reserved cannot be unreserved, you
              will have to re-deposit in the same strike. After each reserve
              request there will be a{' '}
              <b className="text-jaffa">6 hour cooldown</b> before a new reserve
              request is made to the same deposit.
            </p>
          </div>
          <div className="flex items-center justify-around">
            <Button onClick={() => setOpen(false)} size="xsmall" variant="text">
              Cancel
            </Button>
            <Button size="xsmall" onClick={handleReserve}>
              Confirm
            </Button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Reserve;
