import { useCallback, useEffect, useState } from 'react';
import { formatUnits, getContract, maxUint256, parseUnits } from 'viem';

import { Button, Input } from '@dopex-io/ui';
import noop from 'lodash/noop';
import { useDebounce } from 'use-debounce';
import { erc20ABI, useAccount, usePublicClient, useWalletClient } from 'wagmi';

import AppBar from 'components/common/AppBar';

const SwapBody = () => {
  const [amount, setAmount] = useState(0n);
  const [output, setOutput] = useState(0n);
  const [allowance, setAllowance] = useState(0n);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [debouncedAmount] = useDebounce(amount, 1000);

  const { data: walletClient } = useWalletClient();

  const publicClient = usePublicClient();

  const { address } = useAccount();

  useEffect(() => {
    async function checkAllowance() {
      if (address) {
        const data = await publicClient.readContract({
          abi: erc20ABI,
          address: '0x32eb7902d4134bf98a28b963d26de779af92a212',
          functionName: 'allowance',
          args: [address, '0x1F721E2E82F6676FCE4eA07A5958cF098D339e18'],
        });
        setAllowance(data);
      }
    }
    checkAllowance();
  }, [address, publicClient]);

  useEffect(() => {
    async function computeOutput() {
      if (debouncedAmount > allowance) {
        setApproved(false);
      } else {
        setApproved(true);
      }

      if (publicClient && address) {
        try {
          const data = await publicClient.simulateContract({
            abi: swapRouterAbi,
            address: '0x1F721E2E82F6676FCE4eA07A5958cF098D339e18',
            functionName: 'exactInputSingleSupportingFeeOnTransferTokens',
            account: address,
            args: [
              {
                tokenIn: '0x32eb7902d4134bf98a28b963d26de779af92a212',
                tokenOut: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
                recipient: address,
                deadline: BigInt(
                  (new Date().getTime() / 1000 + 60000).toFixed(0),
                ),
                amountIn: debouncedAmount,
                amountOutMinimum: 0n,
                limitSqrtPrice: 0n,
              },
            ],
          });
          setOutput(data.result);
        } catch (err) {
          console.log(err);
        }
      }
      setLoading(false);
    }
    computeOutput();
  }, [address, allowance, debouncedAmount, publicClient]);

  const handleChange = useCallback(async (e: { target: { value: string } }) => {
    setLoading(true);
    setAmount(parseUnits(e.target.value, 18));
  }, []);

  const handleClick = useCallback(async () => {
    if (walletClient && address) {
      setLoading(true);
      if (!approved) {
        try {
          await walletClient.writeContract({
            abi: erc20ABI,
            address: '0x32eb7902d4134bf98a28b963d26de779af92a212',
            functionName: 'approve',
            args: ['0x1F721E2E82F6676FCE4eA07A5958cF098D339e18', maxUint256],
          });
        } catch {}
      }

      const contract = getContract({
        abi: swapRouterAbi,
        address: '0x1F721E2E82F6676FCE4eA07A5958cF098D339e18',
        walletClient,
      });

      try {
        await contract.write.exactInputSingleSupportingFeeOnTransferTokens([
          {
            tokenIn: '0x32eb7902d4134bf98a28b963d26de779af92a212',
            tokenOut: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
            recipient: address,
            deadline: BigInt((new Date().getTime() / 1000 + 60000).toFixed(0)),
            amountIn: debouncedAmount,
            amountOutMinimum: output - (output * 1n) / 100n,
            limitSqrtPrice: 0n,
          },
        ]);
      } catch {}

      setLoading(false);
    }
  }, [address, approved, debouncedAmount, output, walletClient]);

  return (
    <>
      <AppBar />
      <div className="p-4 bg-cod-gray rounded-xl w-1/4 mx-auto flex space-y-4 flex-col mt-32">
        <div>Swap rDPX to WETH</div>
        <Input
          onChange={handleChange}
          leftElement={
            <div className="flex items-center space-x-2 z-20">
              <img
                src="/images/tokens/rdpx.svg"
                alt="eth-token"
                className="w-10 h-10"
              />
              <p className="font-bold font-mono">rDPX</p>
            </div>
          }
          placeholder="Enter amount"
        />
        <Input
          leftElement={
            <div className="flex items-center space-x-2 z-20">
              <img
                src="/images/tokens/weth.svg"
                alt="weth-token"
                className="w-10 h-10"
              />
              <p className="font-bold font-mono">WETH</p>
            </div>
          }
          disabled
          value={Number(formatUnits(output, 18)).toFixed(4)}
          onChange={noop}
        />
        <Button
          className="px-12 float-right"
          onClick={handleClick}
          disabled={loading}
        >
          Swap
        </Button>
      </div>
    </>
  );
};

export default SwapBody;

const swapRouterAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_factory', type: 'address' },
      { internalType: 'address', name: '_WNativeToken', type: 'address' },
      { internalType: 'address', name: '_poolDeployer', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'WNativeToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'int256', name: 'amount0Delta', type: 'int256' },
      { internalType: 'int256', name: 'amount1Delta', type: 'int256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'algebraSwapCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes', name: 'path', type: 'bytes' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'amountOutMinimum',
            type: 'uint256',
          },
        ],
        internalType: 'struct ISwapRouter.ExactInputParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInput',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'amountOutMinimum',
            type: 'uint256',
          },
          { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
        ],
        internalType: 'struct ISwapRouter.ExactInputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingle',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'amountOutMinimum',
            type: 'uint256',
          },
          { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
        ],
        internalType: 'struct ISwapRouter.ExactInputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingleSupportingFeeOnTransferTokens',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes', name: 'path', type: 'bytes' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'amountInMaximum', type: 'uint256' },
        ],
        internalType: 'struct ISwapRouter.ExactOutputParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactOutput',
    outputs: [{ internalType: 'uint256', name: 'amountIn', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'amountInMaximum', type: 'uint256' },
          { internalType: 'uint160', name: 'limitSqrtPrice', type: 'uint160' },
        ],
        internalType: 'struct ISwapRouter.ExactOutputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactOutputSingle',
    outputs: [{ internalType: 'uint256', name: 'amountIn', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolDeployer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'refundNativeToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'selfPermit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'selfPermitAllowed',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'selfPermitAllowedIfNecessary',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'selfPermitIfNecessary',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amountMinimum', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
    ],
    name: 'sweepToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amountMinimum', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'feeBips', type: 'uint256' },
      { internalType: 'address', name: 'feeRecipient', type: 'address' },
    ],
    name: 'sweepTokenWithFee',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountMinimum', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
    ],
    name: 'unwrapWNativeToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountMinimum', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'feeBips', type: 'uint256' },
      { internalType: 'address', name: 'feeRecipient', type: 'address' },
    ],
    name: 'unwrapWNativeTokenWithFee',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;
