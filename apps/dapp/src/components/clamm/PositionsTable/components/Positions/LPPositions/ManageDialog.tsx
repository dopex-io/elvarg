import { useCallback, useMemo, useState } from 'react';
import {
  Address,
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
import DopexV2PositionManager from 'abis/clamm/DopexV2PositionManager';
import UniswapV3SingleTickLiquidityHandlerV2 from 'abis/clamm/UniswapV3SingleTickLiquidityHandlerV2';
import toast from 'react-hot-toast';
import { usePublicClient, useWalletClient } from 'wagmi';

import useClammStore from 'hooks/clamm/useClammStore';

import TableLayout from 'components/common/TableLayout';
import CheckBox from 'components/UI/CheckBox/CheckBox';

import getPositionManagerAddress from 'utils/clamm/getPositionManagerAddress';
import { cn, formatAmount } from 'utils/general';

import { LPPositionItemForTable, PrepareWithdrawData } from './columns';
import Reserve from './Reserve';
import WithdrawButton from './WithdrawButton';

export type CreateWithdrawTx = {
  pool: Address;
  hook: Address;
  handler: Address;
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
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isRefetching, setIsRefetching] = useState(false);
  const [isGeneratingTx, setIsGeneratingTx] = useState(false);
  const { selectedOptionsMarket } = useClammStore();

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
      if (!walletClient || !selectedOptionsMarket) return;
      setIsGeneratingTx(true);

      let multicallRequest = params.map(
        ({ tokenId, withdrawableLiquidity, max, handler }) =>
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
        setIsGeneratingTx(false);
        const convertToShares = await getSharesMulticall(multicallRequest);
        return convertToShares.map((shares, index) => {
          shares = shares > 3n ? shares - 1n : shares;

          return encodeFunctionData({
            abi: DopexV2PositionManager,
            functionName: 'burnPosition',
            args: [
              params[index]['handler'],
              selectedOptionsMarket.deprecated
                ? encodeAbiParameters(
                    [
                      {
                        name: 'pool',
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
                      params[index]['pool'],
                      params[index]['tickLower'],
                      params[index]['tickUpper'],
                      shares,
                    ],
                  )
                : encodeAbiParameters(
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
                      params[index]['pool'],
                      params[index]['hook'],
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
    [walletClient, getSharesMulticall, selectedOptionsMarket],
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
                        pool,
                        hook,
                        handler,
                        tickLower,
                        tickUpper,
                        tokenId,
                        withdrawableLiquidity,
                      },
                    }) => ({
                      pool,
                      hook,
                      handler,
                      max: false,
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
                  if (checked) {
                    const withdrawTx = await createWithdrawTx([
                      {
                        pool: rowData['pool'],
                        hook: rowData['hook'],
                        handler: rowData['handler'],
                        max: false,
                        tickLower: rowData['tickLower'],
                        tickUpper: rowData['tickUpper'],
                        tokenId: BigInt(rowData['tokenId']),
                        withdrawableLiquidity: BigInt(
                          rowData['withdrawableLiquidity'],
                        ),
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
            BigInt(liquidityRowData['amount0']) +
            BigInt(liquidityRowData['amount1']);
          const totalWithdrawable =
            BigInt(withdrawRowData['amount0']) +
            BigInt(withdrawRowData['amount1']);

          const utilization =
            totalWithdrawable === 0n
              ? 0n
              : 10000n - (totalCurrentLiq * 10000n) / totalWithdrawable;
          const canReserve =
            utilization !== 0n || totalCurrentLiq > totalWithdrawable;

          return (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger className="hover:none">
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
                  {selectedOptionsMarket?.deprecated ? (
                    <Tooltip.Content className="text-xs bg-carbon p-[4px] rounded-md mb-[6px]">
                      This feature is not supported for current option market
                    </Tooltip.Content>
                  ) : (
                    !canReserve &&
                    0 && (
                      <Tooltip.Content className="text-xs bg-carbon p-[4px] rounded-md mb-[6px]">
                        No utilized collateral to reserve
                      </Tooltip.Content>
                    )
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
          <></>
          // <WithdrawButton
          //   {...getValue()}
          //   createWithdrawTx={createWithdrawTx}
          //   updateTxQueue={updateTxQueue}
          // />
        ),
      }),
    ],
    [
      selectedOptionsMarket,
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

      const { request } = await publicClient.simulateContract({
        account: walletClient.account,
        abi: DopexV2PositionManager,
        functionName: 'multicall',
        address: positionManager,
        args: [txBatched],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Transaction sent!');
      handleRefresh();
    } catch (err) {
      if (err instanceof BaseError) {
        console.log(err);
        toast.error(err['shortMessage']);
      } else {
        console.error(err);
        toast.error(
          'Action Failed. Check console for more information on error',
        );
      }
    }
    setIsRefetching(false);
  }, [walletClient, withdrawTxQueue, handleRefresh, publicClient]);

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
        <Overlay className="fixed inset-0 backdrop-blur-sm" />
        <Content className="fixed border border-umbra top-[50%] left-[50%] w-[90vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] bg-cod-gray rounded-xl flex flex-col h-fit space-y-[12px] py-[14px]">
          <div className="px-[12px] text-stieglitz">
            <Title className="text-[13px] font-medium">
              Manage LP Positions
            </Title>
          </div>
          <div className="flex flex-col space-y-[12px]">
            <TableLayout
              columns={columns}
              data={positions.sort((a, b) => a.range.lower - b.range.upper)}
              isContentLoading={false}
            />
            <div className="flex items-center border border-t border-umbra w-full space-x-[4px]">
              <div className="flex-[0.9] pl-[12px] text-[13px] flex items-center space-x-[12px] justify-between">
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
                    onClick={isRefetching ? () => {} : handleRefresh}
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
