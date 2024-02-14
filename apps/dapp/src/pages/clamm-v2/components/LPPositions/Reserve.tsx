import { useCallback, useMemo, useState } from 'react';
import {
  BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  formatUnits,
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
import wagmiConfig from 'wagmi-config';

import { getLiquidityForAmounts } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { formatAmount } from 'utils/general';

import { PrepareWithdrawData } from './columns';
import { CreateWithdrawTx } from './ManageDialog';

type Props = {
  reserved: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  current: {
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
  };
  withdraw: PrepareWithdrawData;
  getShares: (multicallRequest: any[]) => Promise<bigint[]>;
};

const Reserve = ({ reserved, current, withdraw, getShares }: Props) => {
  const { data: walletClient } = useWalletClient();
  const [sliderAmount, setSliderAmount] = useState([100]);
  const [open, setOpen] = useState(false);

  const { publicClient } = wagmiConfig;

  const reserveAmounts = useMemo(() => {
    const perc = BigInt(sliderAmount[0] * 10);
    const amount0 = BigInt(current.amount0) - BigInt(withdraw.amount0);
    const amount1 = BigInt(current.amount1) - BigInt(withdraw.amount1);

    return {
      amount0: amount0 - (perc * amount0) / 1000n,
      amount1: amount1 - (perc * amount1) / 1000n,
    };
  }, [
    withdraw.amount0,
    withdraw.amount1,
    current.amount0,
    current.amount1,
    sliderAmount,
  ]);

  const { data, refetch } = useContractRead({
    abi: UniswapV3Pool,
    address: withdraw.pool,
    functionName: 'slot0',
  });

  const handleReserve = useCallback(async () => {
    if (!walletClient || !publicClient) return;
    await refetch();
    const _amount0 =
      BigInt(current.amount0) -
      BigInt(withdraw.amount0) -
      reserveAmounts.amount0;
    const _amount1 =
      BigInt(current.amount1) -
      BigInt(withdraw.amount1) -
      reserveAmounts.amount1;

    const positionManager = getPositionManagerAddress(walletClient.chain.id);
    if (!positionManager) return;

    if (!data) return;
    const { tickLower, tickUpper, tokenId, pool, hook, handler } = withdraw;

    const liquidityToWithdraw = getLiquidityForAmounts(
      data[0],
      getSqrtRatioAtTick(BigInt(tickLower)),
      getSqrtRatioAtTick(BigInt(tickUpper)),
      BigInt(withdraw.amount0),
      BigInt(withdraw.amount1),
    );

    console.log(
      'WITHDRAWAL AMOUNTS',
      BigInt(withdraw.amount0),
      BigInt(withdraw.amount1),
    );

    const liquidityToReserve = getLiquidityForAmounts(
      data[0],
      getSqrtRatioAtTick(BigInt(tickLower)),
      getSqrtRatioAtTick(BigInt(tickUpper)),
      _amount0,
      _amount1,
    );

    const shares = await getShares([
      {
        abi: UniswapV3SingleTickLiquidityHandlerV2,
        address: handler,
        functionName: 'balanceOf',
        args: [walletClient.account.address, tokenId],
      },
      {
        abi: UniswapV3SingleTickLiquidityHandlerV2,
        address: handler,
        functionName: 'convertToShares',
        args: [liquidityToWithdraw, tokenId],
      },
    ]);

    console.log('ALL SHARES', shares);

    console.log(pool, hook, tickLower, tickUpper);

    // const reserveData = encodePacked(
    //   ['address', 'address', 'int24', 'int24', 'uint128'],
    //   [pool, hook, tickLower, tickUpper, shares[0] - 1n],
    // );

    const reserveData = encodeAbiParameters(
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
      [pool, hook, tickLower, tickUpper, shares[0] - 1n],
    );

    console.log([pool, hook, tickLower, tickUpper, shares[0] - 1n]);

    // const withdrawData = encodeAbiParameters(
    //   [
    //     {
    //       name: 'pool',
    //       type: 'address',
    //     },
    //     {
    //       name: 'hook',
    //       type: 'address',
    //     },
    //     {
    //       name: 'tickLower',
    //       type: 'int24',
    //     },
    //     {
    //       name: 'tickUpper',
    //       type: 'int24',
    //     },
    //     {
    //       name: 'shares',
    //       type: 'uint128',
    //     },
    //   ],
    //   [pool, hook, tickLower, tickUpper, shares[1] > 1n ? shares[1] - 1n : 0n],
    // );

    // let withdrawSkipped = false;
    // if (shares[1] > 2n) {
    //   try {
    //     const tx0 = await walletClient.writeContract({
    //       abi: DopexV2PositionManager,
    //       functionName: 'burnPosition',
    //       address: positionManager,
    //       args: [handler, withdrawData],
    //     });

    //     toast.success('Transaction sent!: ' + tx0);
    //     console.log('Withdraw transaction receipt: ', tx0);
    //   } catch (err) {
    //     withdrawSkipped = true;
    //     if (err instanceof BaseError) {
    //       toast.error(err['shortMessage']);
    //     } else {
    //       console.error(err);
    //       toast.error(
    //         'Action Failed. Check console for more information on error',
    //       );
    //     }
    //   }
    // }

    // if (!withdrawSkipped) {
    console.log(shares[0]);
    try {
      // const { result } = await publicClient.simulateContract({
      //   abi: UniswapV3SingleTickLiquidityHandlerV2,
      //   address: handler,
      //   functionName: 'reserveLiquidity',
      //   args: [reserveData],
      // });

      // console.log(result);
      const tx1 = await walletClient.writeContract({
        abi: UniswapV3SingleTickLiquidityHandlerV2,
        functionName: 'reserveLiquidity',
        address: handler,
        args: [reserveData],
      });

      // toast.success('Transaction sent!: ' + tx1);
      // console.log('Withdraw transaction receipt: ', tx1);
    } catch (err) {
      console.log(err);
      if (err instanceof BaseError) {
        toast.error(err['shortMessage']);
      } else {
        console.error(err);
        toast.error(
          'Action Failed. Check console for more information on error',
        );
      }
    }
    // }
  }, [
    publicClient,
    walletClient,
    withdraw,
    data,
    current.amount0,
    current.amount1,
    getShares,
    reserveAmounts.amount0,
    reserveAmounts.amount1,
    refetch,
  ]);

  return BigInt(reserved.amount0) + BigInt(reserved.amount1) !== 0n ? (
    <div className="text-[13px] flex flex-col items-start">
      <div className="flex space-x-[4px]">
        <span>
          {formatAmount(
            formatUnits(BigInt(reserved.amount0), withdraw.amount0Decimals),
            5,
          )}
        </span>
        <span className="text-stieglitz text-[12px]">
          {reserved.amount0Symbol}
        </span>
      </div>
      <div className="flex space-x-[4px]">
        <span>
          {formatAmount(
            formatUnits(BigInt(reserved.amount1), withdraw.amount1Decimals),
            5,
          )}
        </span>
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
                  <span>
                    {formatAmount(
                      formatUnits(
                        BigInt(current.amount0) - BigInt(withdraw.amount0),
                        withdraw.amount0Decimals,
                      ),
                      4,
                    )}
                  </span>
                  <span className="text-stieglitz">
                    {current.amount0Symbol}
                  </span>
                </span>
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>
                    {formatAmount(
                      formatUnits(
                        BigInt(current.amount1) - BigInt(withdraw.amount1),
                        withdraw.amount1Decimals,
                      ),
                      4,
                    )}
                  </span>
                  <span className="text-stieglitz">
                    {current.amount1Symbol}
                  </span>
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
                  <span>
                    {formatAmount(
                      formatUnits(
                        reserveAmounts.amount0,
                        withdraw.amount0Decimals,
                      ),
                      4,
                    )}
                  </span>
                  <span className="text-stieglitz">
                    {current.amount0Symbol}
                  </span>
                </span>
                <span className="flex items-center justify-start space-x-[4px]">
                  <span>
                    {' '}
                    {formatAmount(
                      formatUnits(
                        reserveAmounts.amount1,
                        withdraw.amount1Decimals,
                      ),
                      4,
                    )}
                  </span>
                  <span className="text-stieglitz">
                    {current.amount1Symbol}
                  </span>
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
