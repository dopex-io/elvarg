import { useCallback, useMemo, useState } from 'react';
import {
  BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  Hex,
} from 'viem';

import { Button } from '@dopex-io/ui';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowPathIcon,
  XMarkIcon,
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
import * as Tooltip from '@radix-ui/react-tooltip';
import { createColumnHelper } from '@tanstack/react-table';
import { DopexV2PositionManager } from 'pages/clamm-v2/abi/DopexV2PositionManager';
import { UniswapV3Pool } from 'pages/clamm-v2/abi/UniswapV3Pool';
import { UniswapV3SingleTickLiquidityHandlerV2 } from 'pages/clamm-v2/abi/UniswapV3SingalTickLiquidityHandlerV2';
import toast from 'react-hot-toast';
import { useContractRead, useWalletClient } from 'wagmi';
import wagmiConfig from 'wagmi-config';

import TableLayout from 'components/common/TableLayout';
import CheckBox from 'components/UI/CheckBox/CheckBox';

import getPositionManagerAddress from 'utils/clamm/getPositionManagerAddress';
import { cn, formatAmount } from 'utils/general';

import { LPPositionItemForTable, PrepareWithdrawData } from './columns';
import Reserve from './Reserve';
import WithdrawButton from './WithdrawButton';

export type CreateWithdrawTx = {
  max: boolean;
  withdrawableLiquidity: bigint;
  tokenId: bigint;
  tickLower: number;
  tickUpper: number;
};

export type PrepareReserve = {
  amount0: string;
  amount0Symbol: string;
  amount1: string;
  amount1Symbol: string;
};

type Props = {
  positions: LPPositionItemForTable[];
  refetch: (...args: any) => Promise<any>;
};
const helper = createColumnHelper<LPPositionItemForTable>();

const ManageDialog = ({ positions, refetch }: Props) => {
  const { publicClient } = wagmiConfig;
  const { data: walletClient } = useWalletClient();
  const [isRefetching, setIsRefetching] = useState(false);
  const [isGeneratingTx, setIsGeneratingTx] = useState(false);

  const [withdrawTxQueue, setWithdrawTxQueue] = useState<
    Map<
      string,
      {
        tx: Hex;
        amount0: number;
        amount1: number;
      }
    >
  >(new Map());
  const symbols = {
    symbol0: positions[0].liquidity.amount0Symbol,
    symbol1: positions[0].liquidity.amount1Symbol,
  };

  const pool = positions[0].withdraw.pool;
  const handler = positions[0].withdraw.handler;
  const hook = positions[0].withdraw.hook;

  const { data } = useContractRead({
    abi: UniswapV3Pool,
    address: pool,
    functionName: 'slot0',
  });

  const removeTxFromQueue = (id: string) => {
    setWithdrawTxQueue((prev) => {
      const newQueue = prev;
      newQueue.delete(id);
      return new Map(newQueue);
    });
  };

  const updateTxQueue = (
    id: string,
    tx: Hex,
    amount0: number,
    amount1: number,
  ) => {
    setWithdrawTxQueue((prev) => {
      const newQueue = prev;
      newQueue.set(id, {
        amount0,
        amount1,
        tx,
      });
      return new Map(newQueue);
    });
  };

  const clearTxQueue = () => {
    setWithdrawTxQueue(new Map());
  };

  const getSharesMulticall = useCallback(
    async (multicallRequest: any[]) => {
      return (
        await publicClient.multicall({
          contracts: multicallRequest,
        })
      ).map(({ result }) => (result as bigint) ?? 0n);
    },
    [publicClient],
  );

  const createWithdrawTx = useCallback(
    async (params: CreateWithdrawTx[]) => {
      if (!data || !walletClient) return;
      setIsGeneratingTx(true);

      let multicallRequest = params.map(
        ({ tokenId, withdrawableLiquidity, max }) =>
          max
            ? {
                abi: UniswapV3SingleTickLiquidityHandlerV2,
                functionName: 'balanceOf',
                address: handler,
                args: [walletClient?.account.address, tokenId],
              }
            : {
                abi: UniswapV3SingleTickLiquidityHandlerV2,
                functionName: 'convertToShares',
                address: handler,
                args: [withdrawableLiquidity, tokenId],
              },
      );

      try {
        const convertToShares = await getSharesMulticall(multicallRequest);
        setIsGeneratingTx(false);
        return convertToShares.map((shares, index) => {
          shares = shares > 2n ? shares - 1n : shares;
          return encodeFunctionData({
            abi: DopexV2PositionManager,
            functionName: 'burnPosition',
            args: [
              handler,
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
                [
                  pool,
                  hook,
                  params[index]['tickLower'],
                  params[index]['tickUpper'],
                  shares,
                ],
              ),
            ],
          });
        });
      } catch (err) {
        console.log(err);
      }
      setIsGeneratingTx(false);
    },
    [data, handler, pool, hook, walletClient, getSharesMulticall],
  );

  const isSelected = useCallback(
    (tokenId: string) => {
      return Boolean(withdrawTxQueue.get(tokenId));
    },
    [withdrawTxQueue],
  );

  const handleRefresh = useCallback(async () => {
    if (!isRefetching) {
      setIsRefetching(true);
      refetch().finally(() => setTimeout(() => setIsRefetching(false), 5000));
    }
  }, [refetch, isRefetching]);

  const columns = useMemo(
    () => [
      helper.accessor('range', {
        // @ts-ignore
        header: (
          <div className="flex items-center space-x-[6px]">
            <CheckBox
              checked={withdrawTxQueue.size === positions.length}
              onCheckedChange={async (checked) => {
                if (checked) {
                  const params = positions.map(
                    ({
                      withdraw: {
                        tickLower,
                        tickUpper,
                        tokenId,
                        withdrawableLiquidity,
                      },
                    }) => ({
                      max: true,
                      tickLower,
                      tickUpper,
                      tokenId: BigInt(tokenId),
                      withdrawableLiquidity: BigInt(withdrawableLiquidity),
                    }),
                  );
                  const withdrawTx = await createWithdrawTx(params);
                  if (!withdrawTx) return;

                  positions.map(
                    (
                      {
                        withdraw: {
                          tokenId,
                          amount0,
                          amount1,
                          amount0Decimals,
                          amount1Decimals,
                        },
                      },
                      index,
                    ) =>
                      updateTxQueue(
                        tokenId,
                        withdrawTx[index],
                        Number(formatUnits(BigInt(amount0), amount0Decimals)),
                        Number(formatUnits(BigInt(amount1), amount1Decimals)),
                      ),
                  );
                } else {
                  clearTxQueue();
                }
              }}
            />
            <span>Range</span>
          </div>
        ),
        cell: ({ getValue, row }) => {
          const len = row.getAllCells().length;
          const rowData = row
            .getAllCells()
            [len - 1].getValue() as PrepareWithdrawData;
          return (
            <div className="flex items-center space-x-[4px] text-[13px]">
              <CheckBox
                checked={isSelected(rowData['tokenId'])}
                onCheckedChange={async (checked) => {
                  console.log(rowData['withdrawableLiquidity']);
                  if (checked) {
                    const withdrawTx = await createWithdrawTx([
                      {
                        max: true,
                        tickLower: rowData['tickLower'],
                        tickUpper: rowData['tickUpper'],
                        tokenId: BigInt(rowData['tokenId']),
                        withdrawableLiquidity:
                          BigInt(rowData['withdrawableLiquidity']) - 2n,
                      },
                    ]);
                    if (withdrawTx) {
                      updateTxQueue(
                        rowData['tokenId'],
                        withdrawTx[0],
                        Number(
                          formatUnits(
                            BigInt(rowData['amount0']),
                            rowData['amount0Decimals'],
                          ),
                        ),
                        Number(
                          formatUnits(
                            BigInt(rowData['amount1']),
                            rowData['amount1Decimals'],
                          ),
                        ),
                      );
                    }
                  } else {
                    removeTxFromQueue(rowData['tokenId']);
                  }
                }}
              />
              <span>{formatAmount(getValue().lower, 5)}</span>
              <div className="flex -space-x-3">
                <ArrowLongLeftIcon height={14} width={14} />
                <ArrowLongRightIcon height={14} width={14} />
              </div>
              <span>{formatAmount(getValue().upper, 5)}</span>
            </div>
          );
        },
      }),
      helper.accessor('liquidity', {
        header: 'Liquidity',
        cell: ({ getValue }) => (
          <div className="text-[13px] flex flex-col items-start">
            <div className="flex space-x-[4px]">
              <span>
                {formatAmount(
                  formatUnits(
                    BigInt(getValue().amount0),
                    getValue().amount0Decimals,
                  ),
                  5,
                )}
              </span>
              <span className="text-stieglitz text-[12px]">
                {getValue().amount0Symbol}
              </span>
            </div>
            <div className="flex space-x-[4px]">
              <span>
                {formatAmount(
                  formatUnits(
                    BigInt(getValue().amount1),
                    getValue().amount1Decimals,
                  ),
                  5,
                )}
              </span>
              <span className="text-stieglitz text-[12px]">
                {getValue().amount1Symbol}
              </span>
            </div>
          </div>
        ),
      }),
      helper.accessor('earned', {
        header: 'Earned',
        cell: ({ getValue }) => (
          <div className="text-[13px] flex flex-col items-start">
            <div className="flex space-x-[4px]">
              <span>
                {formatAmount(
                  formatUnits(
                    BigInt(getValue().amount0),
                    getValue().amount0Decimals,
                  ),
                  5,
                )}
              </span>
              <span className="text-stieglitz text-[12px]">
                {getValue().amount0Symbol}
              </span>
            </div>
            <div className="flex space-x-[4px]">
              <span>
                {formatAmount(
                  formatUnits(
                    BigInt(getValue().amount1),
                    getValue().amount1Decimals,
                  ),
                  5,
                )}
              </span>
              <span className="text-stieglitz text-[12px]">
                {getValue().amount1Symbol}
              </span>
            </div>
          </div>
        ),
      }),
      helper.accessor('reserved', {
        header: 'Reserved',
        cell: ({ getValue, row }) => {
          const liquidityRowData = row
            .getAllCells()[1]
            .getValue() as PrepareReserve;
          const len = row.getAllCells().length;
          const withdrawRowData = row
            .getAllCells()
            [len - 1].getValue() as PrepareWithdrawData;

          const totalCurrentLiq =
            Number(liquidityRowData['amount0']) +
            Number(liquidityRowData['amount1']);
          const totalWithdrawable =
            Number(withdrawRowData['amount0']) +
            Number(withdrawRowData['amount1']);

          const canReserve = totalCurrentLiq > totalWithdrawable;
          console.log(
            'RESERVED REQUIRED',
            canReserve,
            "CANNOT RESERVE",
            !canReserve,
            totalCurrentLiq,
            totalWithdrawable,
          );
          return (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Reserve
                    disabled={!canReserve}
                    getShares={getSharesMulticall}
                    reserved={getValue()}
                    current={{
                      amount0: liquidityRowData['amount0'],
                      amount1: liquidityRowData['amount1'],
                      amount0Symbol: liquidityRowData['amount0Symbol'],
                      amount1Symbol: liquidityRowData['amount1Symbol'],
                    }}
                    withdraw={withdrawRowData}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  {!canReserve && (
                    <Tooltip.Content className="text-xs bg-carbon p-[4px] rounded-md mb-[6px]">
                      No utilized collateral to reserve
                    </Tooltip.Content>
                  )}
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          );
        },
      }),
      helper.accessor('utilization', {
        header: 'Utilization',
        cell: ({ getValue }) => (
          <div className="text-[13px] flex flex-col items-start">
            <div className="flex space-x-[4px]">
              <span>{formatAmount(getValue(), 2)}</span>
              <span className="text-stieglitz text-[12px]">%</span>
            </div>
          </div>
        ),
      }),
      helper.accessor('withdrawable', {
        header: 'Withdrawable',
        cell: ({ getValue }) => (
          <div className="text-[13px] flex flex-col items-start">
            <div className="flex space-x-[4px]">
              <span>
                {formatAmount(
                  formatUnits(
                    BigInt(getValue().amount0),
                    getValue().amount0Decimals,
                  ),
                  5,
                )}
              </span>
              <span className="text-stieglitz text-[12px]">
                {getValue().amount0Symbol}
              </span>
            </div>
            <div className="flex space-x-[4px]">
              <span>
                {formatAmount(
                  formatUnits(
                    BigInt(getValue().amount1),
                    getValue().amount1Decimals,
                  ),
                  5,
                )}
              </span>
              <span className="text-stieglitz text-[12px]">
                {getValue().amount1Symbol}
              </span>
            </div>
          </div>
        ),
      }),
      helper.accessor('withdraw', {
        header: '',
        cell: ({ getValue }) => (
          <WithdrawButton
            {...getValue()}
            createWithdrawTx={createWithdrawTx}
            updateTxQueue={updateTxQueue}
          />
        ),
      }),
    ],
    [
      isSelected,
      createWithdrawTx,
      positions,
      withdrawTxQueue.size,
      getSharesMulticall,
    ],
  );

  const handleWithdraw = useCallback(async () => {
    if (!walletClient) return;
    const positionManager = getPositionManagerAddress(walletClient.chain.id);
    if (!positionManager) return;
    try {
      const txBatched = Array.from(withdrawTxQueue).map(([_, { tx }]) => tx);

      const tx = await walletClient.writeContract({
        abi: DopexV2PositionManager,
        functionName: 'multicall',
        address: positionManager,
        args: [txBatched],
      });

      toast.success('Transaction sent!');
      console.log('Withdraw transaction receipt: ', tx);
      handleRefresh();
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
    setIsRefetching(false);
  }, [walletClient, withdrawTxQueue, handleRefresh]);

  const totalWithdrawAmounts = useMemo(() => {
    let total = {
      amount0: 0,
      amount1: 0,
    };

    if (withdrawTxQueue.size > 0) {
      Array.from(withdrawTxQueue).map(([_, { amount0, amount1 }]) => {
        total.amount0 += amount0;
        total.amount1 += amount1;
      });
    }

    return total;
  }, [withdrawTxQueue]);

  return (
    <Root>
      <Trigger className="bg-primary text-[13px] px-[16px] py-[4px] rounded-md">
        Manage
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 backdrop-blur-[1px]" />
        <Content className="fixed border border-umbra top-[50%] left-[50%] w-[90vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] bg-cod-gray rounded-xl flex flex-col h-fit space-y-[12px] py-[14px]">
          <div className="px-[12px] text-stieglitz">
            <Title className="text-[13px] font-medium">
              Manage LP Positions
            </Title>
          </div>
          <div className="flex flex-col space-y-[12px]">
            <TableLayout
              columns={columns}
              data={positions}
              isContentLoading={false}
            />
            <div className="flex items-center border border-t border-umbra w-full space-x-[4px]">
              <div className="flex-[0.9] pl-[12px] text-[13px] flex items-center space-x-[12px] justify-between">
                <div className="flex items-center space-x-[4px]">
                  <span className="text-stieglitz">
                    Initial deposit timestamp:
                  </span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                {totalWithdrawAmounts.amount0 + totalWithdrawAmounts.amount1 >
                  0 && (
                  <div className="flex items-start justify-end space-x-[12px]">
                    <span className="text-stieglitz">Total Withdraw:</span>
                    <div className="flex flex-col">
                      <span className="space-x-[4px]">
                        <span>
                          {formatAmount(totalWithdrawAmounts.amount0, 4)}
                        </span>
                        <span className="text-stieglitz">
                          {symbols.symbol0}
                        </span>
                      </span>
                      <span className="space-x-[4px]">
                        <span>
                          {formatAmount(totalWithdrawAmounts.amount1, 4)}
                        </span>
                        <span className="text-stieglitz">
                          {symbols.symbol1}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className=" flex-[0.1] flex items-center justify-end pr-[36px] space-x-[6px]">
                <div className="h-fit w-fit p-[2px] bg-mineshaft rounded-md">
                  <ArrowPathIcon
                    height={22}
                    width={22}
                    onClick={handleRefresh}
                    className={cn(
                      'bg-mineshaft text-stieglitz p-[2px] hover:text-white cursor-pointer',
                      isRefetching && 'animate-spin cursor-progress',
                    )}
                  />
                </div>
                <Button
                  size="xsmall"
                  onClick={handleWithdraw}
                  disabled={
                    isGeneratingTx || isRefetching || withdrawTxQueue.size === 0
                  }
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
          <Close>
            <XMarkIcon
              className="absolute top-[12px] right-[12px] inline-flex h-[18px] w-[18px] appearance-none items-center justify-center rounded-full focus:outline-none text-stieglitz hover:text-white"
              height={18}
              width={18}
            />
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};

export default ManageDialog;
