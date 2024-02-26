import { useCallback, useMemo, useState } from 'react';
import { BaseError, encodeAbiParameters, formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';
import {
  ArrowLongRightIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';
import {
  Close,
  Content,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Slider from '@radix-ui/react-slider';
import DopexV2PositionManager from 'abis/clamm/DopexV2PositionManager';
import UniswapV3Pool from 'abis/clamm/UniswapV3Pool';
import UniswapV3SingleTickLiquidityHandlerV2 from 'abis/clamm/UniswapV3SingleTickLiquidityHandlerV2';
import Countdown from 'react-countdown';
import toast from 'react-hot-toast';
import { useContractRead, usePublicClient, useWalletClient } from 'wagmi';

import Typography2 from 'components/UI/Typography2';

import getPositionManagerAddress from 'utils/clamm/getPositionManagerAddress';
import { getLiquidityForAmounts } from 'utils/clamm/liquidityAmountMath';
import { getSqrtRatioAtTick } from 'utils/clamm/tickMath';
import { cn, formatAmount } from 'utils/general';

import { PrepareWithdrawData } from './columns';

type Props = {
  disabled: boolean;
  reserved: {
    lastReserve: number;
    amount0: string;
    amount1: string;
    amount0Symbol: string;
    amount1Symbol: string;
    amount0Decimals: number;
    amount1Decimals: number;
    withdrawable: {
      amount0: string;
      amount1: string;
      liquidity: string;
    };
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

const Reserve = ({
  reserved,
  current,
  withdraw,
  getShares,
  disabled,
}: Props) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [sliderAmount, setSliderAmount] = useState([100]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawDisabled, setWithdrawDisabled] = useState(true);

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
        functionName: 'convertToShares',
        args: [liquidityToReserve, tokenId],
      },
      {
        abi: UniswapV3SingleTickLiquidityHandlerV2,
        address: handler,
        functionName: 'convertToShares',
        args: [BigInt(withdraw.withdrawableLiquidity), tokenId],
      },
    ]);

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
    if (BigInt(withdraw.withdrawableLiquidity) > 1n) {
      const withdrawData = encodeAbiParameters(
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
        [pool, hook, tickLower, tickUpper, shares[1] - 1n],
      );

      let withdrawLoadingId = '';
      try {
        withdrawLoadingId = toast.loading(
          'Withdrawing any remaining liquidity',
        );
        const { request } = await publicClient.simulateContract({
          account: walletClient.account.address,
          abi: DopexV2PositionManager,
          functionName: 'burnPosition',
          address: positionManager,
          args: [handler, withdrawData],
        });

        const hash = await walletClient.writeContract(request);

        const { transactionHash } =
          await publicClient.waitForTransactionReceipt({
            hash,
          });
        toast.success('Transaction sent!');
        console.log('Withdraw transaction receipt: ', transactionHash);
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
      toast.remove(withdrawLoadingId);
    }

    try {
      const { request } = await publicClient.simulateContract({
        account: walletClient.account.address,
        abi: UniswapV3SingleTickLiquidityHandlerV2,
        address: handler,
        functionName: 'reserveLiquidity',
        args: [reserveData],
      });

      const hash = await walletClient.writeContract(request);

      const { transactionHash } = await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success('Transaction sent!');
      console.log('Withdraw transaction receipt: ', transactionHash);
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

  const handleWithdrawReserve = useCallback(async () => {
    if (!publicClient || !walletClient) return;
    const { withdrawable } = reserved;
    const { liquidity } = withdrawable;
    const { tickLower, tickUpper, pool, hook, handler } = withdraw;

    const loadingId = toast.loading('Opening wallet');
    const reserveCallData = encodeAbiParameters(
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
      [pool, hook, tickLower, tickUpper, BigInt(liquidity)],
    );

    setLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        account: walletClient?.account.address,
        abi: UniswapV3SingleTickLiquidityHandlerV2,
        address: handler,
        functionName: 'withdrawReserveLiquidity',
        args: [reserveCallData],
      });

      const hash = await walletClient.writeContract(request);
      const { transactionHash } = await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success('Transaction sent!');
      console.log('Reserve transaction receipt: ', transactionHash);
    } catch (err) {
      if (err instanceof BaseError) {
        toast.error(err.shortMessage);
      } else {
        toast.error(
          'Failed to withdraw reserves. Please check console for more details',
        );
        console.error(err);
      }
    }
    toast.remove(loadingId);
    setLoading(false);
  }, [reserved, publicClient, walletClient, withdraw]);

  return BigInt(reserved.amount0) + BigInt(reserved.amount1) !== 0n ? (
    <div className="flex items-start  flex-col w-full space-y-[4px]">
      <div className="text-[13px] flex flex-col items-start">
        {BigInt(reserved.amount0) !== 0n && (
          <div className="flex space-x-[4px]">
            <span>
              {formatAmount(
                formatUnits(
                  BigInt(reserved.withdrawable.amount0),
                  withdraw.amount0Decimals,
                ),
                5,
              )}
            </span>
            <span>/</span>
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
        )}
        {BigInt(reserved.amount1) !== 0n && (
          <div className="flex space-x-[4px]">
            <span>
              {formatAmount(
                formatUnits(
                  BigInt(reserved.withdrawable.amount1),
                  withdraw.amount0Decimals,
                ),
                5,
              )}
            </span>
            <span>/</span>
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
        )}
      </div>
      <Root>
        <Trigger
          disabled={
            withdrawDisabled || BigInt(reserved.withdrawable.liquidity) === 0n
          }
          className={cn(
            'text-[13px] px-[16px] py-[4px] rounded-md bg-carbon',
            BigInt(reserved.withdrawable.liquidity) === 0n &&
              'hover:cursor-not-allowed',
          )}
        >
          <Countdown
            key={Number(reserved.lastReserve * 1000 + 10000)}
            date={Number(reserved.lastReserve * 1000) + 10000}
            renderer={({ days, hours, minutes, completed }) => {
              if (completed) {
                setWithdrawDisabled(false);
                return 'Withdraw Reserve';
              } else {
                <div className="flex space-x-1 text-stieglitz">
                  <Typography2 variant="caption" color="stieglitz">
                    in
                  </Typography2>
                  <div className="space-x-1">
                    <Typography2 variant="caption" color="white">
                      {days}
                    </Typography2>
                    d
                    <Typography2 variant="caption" color="white">
                      {hours}
                    </Typography2>
                    h
                    <Typography2 variant="caption" color="white">
                      {minutes}
                    </Typography2>
                    m
                  </div>
                </div>;
              }
            }}
          />
        </Trigger>
        <Portal>
          <Overlay className="fixed inset-0 backdrop-blur-sm" />
          <Content className="fixed border border-mineshaft top-[50%] left-[50%] w-f translate-x-[-50%] translate-y-[-50%] bg-cod-gray rounded-xl flex flex-col h-fit space-y-[14px] py-[14px] px-[12px] max-w-[300px] items-center justify-center ">
            <Title className="text-[13px] font-medium">Withdraw Reserves</Title>
            <div className="text-[11px] border-jaffa bg-opacity-25 bg-jaffa p-[6px] rounded-md border">
              <span>
                Withdrawing will incur 10 seconds cooldown before you can
                withdraw or reserve again.
              </span>
            </div>
            <div className="flex items-center space-x-[4px]">
              <Close className="text-[12px] bg-carbon px-[14px] py-[6px] rounded-md">
                Cancel
              </Close>
              <Button
                disabled={loading}
                size="xsmall"
                onClick={handleWithdrawReserve}
              >
                <span className="text-[12px]">Withdraw</span>
              </Button>
            </div>
          </Content>
        </Portal>
      </Root>
    </div>
  ) : (
    <DropdownMenu.Root open={open}>
      <DropdownMenu.Trigger
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        className={cn(
          'text-[13px] text-stieglitz flex items-center space-x-[4px]  border-b w-fit border-dashed border-stieglitz hover:cursor-pointer',
          !disabled && 'hover:text-white hover:border-white',
        )}
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
              {BigInt(withdraw.withdrawableLiquidity) > 1n
                ? 'Withdraw'
                : 'Reserve'}
            </Button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Reserve;
