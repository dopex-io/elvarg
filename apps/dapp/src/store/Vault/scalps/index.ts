import { BigNumber, ethers } from 'ethers';

import { OptionScalpsLp, OptionScalpsLp__factory } from '@dopex-io/sdk';
import graphSdk from 'graphql/graphSdk';
import queryClient from 'queryClient';
import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

const optionScalpsABI = [
  {
    inputs: [
      { internalType: 'address', name: '_base', type: 'address' },
      { internalType: 'address', name: '_quote', type: 'address' },
      { internalType: 'uint256', name: '_baseDecimals', type: 'uint256' },
      { internalType: 'uint256', name: '_quoteDecimals', type: 'uint256' },
      { internalType: 'address', name: '_uniswapV3Router', type: 'address' },
      { internalType: 'address', name: '_limitOrdersManager', type: 'address' },
      {
        internalType: 'address',
        name: '_nonFungiblePositionManager',
        type: 'address',
      },
      {
        components: [
          { internalType: 'uint256', name: 'maxSize', type: 'uint256' },
          { internalType: 'uint256', name: 'maxOpenInterest', type: 'uint256' },
          {
            internalType: 'contract IOptionPricing',
            name: 'optionPricing',
            type: 'address',
          },
          {
            internalType: 'contract IVolatilityOracle',
            name: 'volatilityOracle',
            type: 'address',
          },
          {
            internalType: 'contract IPriceOracle',
            name: 'priceOracle',
            type: 'address',
          },
          { internalType: 'address', name: 'insuranceFund', type: 'address' },
          { internalType: 'uint256', name: 'minimumMargin', type: 'uint256' },
          { internalType: 'uint256', name: 'feeOpenPosition', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'minimumAbsoluteLiquidationThreshold',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'withdrawTimeout', type: 'uint256' },
        ],
        internalType: 'struct OptionScalp.Configuration',
        name: 'config',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'ContractNotPaused', type: 'error' },
  { inputs: [], name: 'ContractPaused', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bool', name: 'isQuote', type: 'bool' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AddProceeds',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
    ],
    name: 'AddToContractWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'int256', name: 'pnl', type: 'int256' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'ClosePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bool', name: 'isQuote', type: 'bool' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'EmergencyWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'size',
        type: 'uint256',
      },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'OpenPosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
    ],
    name: 'RemoveFromContractWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bool', name: 'isQuote', type: 'bool' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Shortfall',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bool', name: 'isQuote', type: 'bool' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '_contract', type: 'address' }],
    name: 'addToContractWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'base',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseDecimals',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseLp',
    outputs: [{ internalType: 'contract ScalpLP', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: 'pool',
        type: 'address',
      },
      { internalType: 'uint256', name: 'positionId', type: 'uint256' },
      { internalType: 'bool', name: 'isShort', type: 'bool' },
    ],
    name: 'burnUniswapV3Position',
    outputs: [{ internalType: 'uint256', name: 'swapped', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'calcFees',
    outputs: [{ internalType: 'uint256', name: 'fees', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'calcPnl',
    outputs: [{ internalType: 'int256', name: 'pnl', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'strike', type: 'uint256' },
      { internalType: 'uint256', name: 'size', type: 'uint256' },
      { internalType: 'uint256', name: 'timeToExpiry', type: 'uint256' },
    ],
    name: 'calcPremium',
    outputs: [{ internalType: 'uint256', name: 'premium', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'claimCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'closePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'swapped', type: 'uint256' },
    ],
    name: 'closePositionFromLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'cumulativePnl',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'cumulativeVolume',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'bool', name: 'isQuote', type: 'bool' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [{ internalType: 'uint256', name: 'shares', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'divisor',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'tokens', type: 'address[]' },
      { internalType: 'bool', name: 'transferNative', type: 'bool' },
    ],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeOpenPosition',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getLiquidationPrice',
    outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMarkPrice',
    outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getPosition',
    outputs: [
      {
        components: [
          { internalType: 'bool', name: 'isOpen', type: 'bool' },
          { internalType: 'bool', name: 'isShort', type: 'bool' },
          { internalType: 'uint256', name: 'size', type: 'uint256' },
          { internalType: 'uint256', name: 'positions', type: 'uint256' },
          { internalType: 'uint256', name: 'amountBorrowed', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
          { internalType: 'uint256', name: 'entry', type: 'uint256' },
          { internalType: 'uint256', name: 'margin', type: 'uint256' },
          { internalType: 'uint256', name: 'premium', type: 'uint256' },
          { internalType: 'uint256', name: 'fees', type: 'uint256' },
          { internalType: 'int256', name: 'pnl', type: 'int256' },
          { internalType: 'uint256', name: 'openedAt', type: 'uint256' },
          { internalType: 'uint256', name: 'timeframe', type: 'uint256' },
        ],
        internalType: 'struct OptionScalp.ScalpPosition',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'strike', type: 'uint256' }],
    name: 'getVolatility',
    outputs: [{ internalType: 'uint256', name: 'volatility', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'insuranceFund',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
    name: 'isContract',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'isLiquidatable',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'limitOrderManager',
    outputs: [
      { internalType: 'contract LimitOrderManager', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxOpenInterest',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxSize',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimumAbsoluteLiquidationThreshold',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimumMargin',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'int24', name: 'tick0', type: 'int24' },
      { internalType: 'int24', name: 'tick1', type: 'int24' },
      { internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1', type: 'uint256' },
    ],
    name: 'mintUniswapV3Position',
    outputs: [{ internalType: 'uint256', name: 'positionId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nonFungiblePositionManager',
    outputs: [
      {
        internalType: 'contract INonfungiblePositionManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    name: 'openInterest',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: 'isShort', type: 'bool' },
      { internalType: 'uint256', name: 'size', type: 'uint256' },
      { internalType: 'uint256', name: 'timeframeIndex', type: 'uint256' },
      { internalType: 'uint256', name: 'margin', type: 'uint256' },
      { internalType: 'uint256', name: 'entryLimit', type: 'uint256' },
    ],
    name: 'openPosition',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'entry', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'swapped', type: 'uint256' },
      { internalType: 'bool', name: 'isShort', type: 'bool' },
      { internalType: 'uint256', name: 'collateral', type: 'uint256' },
      { internalType: 'uint256', name: 'size', type: 'uint256' },
      { internalType: 'uint256', name: 'timeframeIndex', type: 'uint256' },
      { internalType: 'uint256', name: 'lockedLiquidity', type: 'uint256' },
    ],
    name: 'openPositionFromLimitOrder',
    outputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'optionPricing',
    outputs: [
      { internalType: 'contract IOptionPricing', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'positionOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'positionsOfOwner',
    outputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceOracle',
    outputs: [
      { internalType: 'contract IPriceOracle', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quote',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quoteDecimals',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quoteLp',
    outputs: [{ internalType: 'contract ScalpLP', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_contract', type: 'address' }],
    name: 'removeFromContractWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'scalpPositionMinter',
    outputs: [
      {
        internalType: 'contract ScalpPositionMinter',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'scalpPositions',
    outputs: [
      { internalType: 'bool', name: 'isOpen', type: 'bool' },
      { internalType: 'bool', name: 'isShort', type: 'bool' },
      { internalType: 'uint256', name: 'size', type: 'uint256' },
      { internalType: 'uint256', name: 'positions', type: 'uint256' },
      { internalType: 'uint256', name: 'amountBorrowed', type: 'uint256' },
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'entry', type: 'uint256' },
      { internalType: 'uint256', name: 'margin', type: 'uint256' },
      { internalType: 'uint256', name: 'premium', type: 'uint256' },
      { internalType: 'uint256', name: 'fees', type: 'uint256' },
      { internalType: 'int256', name: 'pnl', type: 'int256' },
      { internalType: 'uint256', name: 'openedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'timeframe', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bool', name: 'isQuote', type: 'bool' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'fees', type: 'uint256' },
    ],
    name: 'settleOpenOrderDeletion',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'timeframes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uniswapV3Router',
    outputs: [
      { internalType: 'contract IUniswapV3Router', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'maxSize', type: 'uint256' },
          { internalType: 'uint256', name: 'maxOpenInterest', type: 'uint256' },
          {
            internalType: 'contract IOptionPricing',
            name: 'optionPricing',
            type: 'address',
          },
          {
            internalType: 'contract IVolatilityOracle',
            name: 'volatilityOracle',
            type: 'address',
          },
          {
            internalType: 'contract IPriceOracle',
            name: 'priceOracle',
            type: 'address',
          },
          { internalType: 'address', name: 'insuranceFund', type: 'address' },
          { internalType: 'uint256', name: 'minimumMargin', type: 'uint256' },
          { internalType: 'uint256', name: 'feeOpenPosition', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'minimumAbsoluteLiquidationThreshold',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'withdrawTimeout', type: 'uint256' },
        ],
        internalType: 'struct OptionScalp.Configuration',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'updateConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'volatilityOracle',
    outputs: [
      { internalType: 'contract IVolatilityOracle', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whitelistedContracts',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: 'isQuote', type: 'bool' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [{ internalType: 'uint256', name: 'assets', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawTimeout',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];
const limitOrdersABI = [
  {
    inputs: [],
    name: 'ContractNotPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ContractPaused',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
    ],
    name: 'AddToContractWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'CancelCloseOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'CancelOpenOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'CreateCloseOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'CreateOpenOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
    ],
    name: 'RemoveFromContractWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_optionScalps',
        type: 'address[]',
      },
    ],
    name: 'addOptionScalps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'cancelCloseOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'cancelOpenOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'closeOrders',
    outputs: [
      {
        internalType: 'address',
        name: 'optionScalp',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'filled',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract OptionScalp',
        name: 'optionScalp',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'int24',
        name: 'tick0',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tick1',
        type: 'int24',
      },
    ],
    name: 'createCloseOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract OptionScalp',
        name: 'optionScalp',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isShort',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timeframeIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collateral',
        type: 'uint256',
      },
      {
        internalType: 'int24',
        name: 'tick0',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tick1',
        type: 'int24',
      },
    ],
    name: 'createOpenOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'divisor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'fillCloseOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'fillOpenOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fundingRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'contract IOptionScalp',
        name: 'optionScalp',
        type: 'address',
      },
    ],
    name: 'getNFTPositionTicks',
    outputs: [
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'isCloseOrderActive',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'isContract',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxFundingTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'openOrders',
    outputs: [
      {
        internalType: 'address',
        name: 'optionScalp',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isShort',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'filled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'cancelled',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timeframeIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collateral',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockedLiquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'orderCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '_maxTickSpaceMultiplier',
        type: 'int24',
      },
      {
        internalType: 'uint256',
        name: '_maxFundingTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_fundingRate',
        type: 'uint256',
      },
    ],
    name: 'updateConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'whitelistedContracts',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface optionScalpData {
  optionScalpContract: any | undefined;
  limitOrdersContract: any | undefined;
  quoteLpContract: OptionScalpsLp;
  baseLpContract: OptionScalpsLp;
  minimumMargin: BigNumber;
  feeOpenPosition: BigNumber;
  minimumAbsoluteLiquidationThreshold: BigNumber;
  maxSize: BigNumber;
  maxOpenInterest: BigNumber;
  longOpenInterest: BigNumber;
  shortOpenInterest: BigNumber;
  markPrice: BigNumber;
  totalQuoteDeposits: BigNumber;
  totalQuoteAvailable: BigNumber;
  totalBaseDeposits: BigNumber;
  totalBaseAvailable: BigNumber;
  quoteLpValue: BigNumber;
  baseLpValue: BigNumber;
  quoteLpAPR: BigNumber;
  baseLpAPR: BigNumber;
  quoteDecimals: BigNumber;
  baseDecimals: BigNumber;
  quoteSymbol: string;
  baseSymbol: string;
  inverted: boolean;
}

export interface ScalpPosition {
  id: BigNumber;
  isOpen: boolean;
  isShort: boolean;
  size: BigNumber;
  positions: BigNumber;
  amountBorrowed: BigNumber;
  amountOut: BigNumber;
  entry: BigNumber;
  margin: BigNumber;
  premium: BigNumber;
  fees: BigNumber;
  pnl: BigNumber;
  openedAt: BigNumber;
  timeframe: BigNumber;
  liquidationPrice: BigNumber;
}

export interface ScalpOrder {
  transactionHash: string;
  id: number;
  isOpen: boolean;
  isShort: boolean;
  size: BigNumber;
  timeframe: BigNumber;
  collateral: BigNumber;
  price: BigNumber;
  expiry: BigNumber | null;
  filled: boolean;
  type: string;
}

export interface optionScalpUserData {
  scalpPositions?: ScalpPosition[];
  scalpOrders?: ScalpOrder[];
  coolingPeriod: {
    quote: number;
    base: number;
  };
}

export interface OptionScalpSlice {
  optionScalpData?: optionScalpData | undefined;
  optionScalpUserData?: optionScalpUserData;
  updateOptionScalpUserData: Function;
  getScalpPositions: Function;
  getScalpOrders: Function;
  getScalpOpenOrder: Function;
  getScalpCloseOrder: Function;
  updateOptionScalp: Function;
  getUserPositionData: Function;
  setSelectedPoolName?: Function;
  getLimitOrdersContract: Function;
  getOptionScalpContract: Function;
  getOptionScalpsBaseLpContract: Function;
  getOptionScalpsQuoteLpContract: Function;
  getScalpPosition: Function;
  calcPnl: Function;
  calcLiqPrice: Function;
  uniWethPrice: BigNumber;
  uniArbPrice: BigNumber;
  setUniWethPrice: Function;
  setUniArbPrice: Function;
}

export const createOptionScalpSlice: StateCreator<
  OptionScalpSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  OptionScalpSlice
> = (set, get) => ({
  setUniWethPrice: (uniWethPrice: BigNumber) => {
    set((prevState) => ({ ...prevState, uniWethPrice }));
  },
  setUniArbPrice: (uniArbPrice: BigNumber) => {
    set((prevState) => ({ ...prevState, uniArbPrice }));
  },
  uniWethPrice: BigNumber.from(0),
  uniArbPrice: BigNumber.from(0),
  optionScalpUserData: {
    coolingPeriod: {
      quote: 0,
      base: 0,
    },
  },
  getOptionScalpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;
    return new ethers.Contract(
      selectedPoolName === 'ETH'
        ? '0xA5d6b283d2812A7CdAe26f9561d21376Bb649BE6'
        : '0x8c5b7D87D80726768a4a8D0C39690aCAB2F66C3a',
      optionScalpsABI,
      provider
    );
  },
  getLimitOrdersContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;
    return new ethers.Contract(
      '0x1F8734Acacc33380B7EfA59663670c52B2fED46f',
      limitOrdersABI,
      provider
    );
  },
  getOptionScalpsQuoteLpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    return OptionScalpsLp__factory.connect(
      selectedPoolName === 'ETH'
        ? '0xdce834f1d749bC2acc8533c3dc94Ff2Bc7bBA250'
        : '0x0dd032de45ae834e7950d455084ff4c896ab781c',
      provider
    );
  },
  getOptionScalpsBaseLpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    return OptionScalpsLp__factory.connect(
      selectedPoolName === 'ETH'
        ? '0x8F05172E5fA7be44960748115194aE5bB9499348'
        : '0x79f41545df078ad3b6168fe4c5379101682c4ee3',
      provider
    );
  },
  getScalpPosition: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();
    const optionScalpContract = getOptionScalpContract();
    return await optionScalpContract!['scalpPositions'](id);
  },
  calcPnl: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();

    const optionScalpContract = getOptionScalpContract();
    return await optionScalpContract.calcPnl(id);
  },
  calcLiqPrice: (position: ScalpPosition) => {
    const { optionScalpData } = get();

    const divisor: BigNumber = BigNumber.from(
      10 ** optionScalpData!.quoteDecimals.toNumber()
    );

    const variation: BigNumber = position.margin
      .mul(divisor)
      .sub(
        optionScalpData!.minimumAbsoluteLiquidationThreshold.mul(position.size)
      )
      .div(position.positions);

    let price: BigNumber;

    if (position.isShort) {
      price = position.entry.add(variation);
    } else {
      price = position.entry.sub(variation);
    }

    return price;
  },
  getScalpPositions: async () => {
    const {
      accountAddress,
      provider,
      getOptionScalpContract,
      getScalpPosition,
      calcPnl,
      calcLiqPrice,
    } = get();

    const optionScalpContract = await getOptionScalpContract();

    let scalpPositionsIndexes: any = [];
    let positionsOfOwner: any = [];

    try {
      positionsOfOwner = await optionScalpContract['positionsOfOwner'](
        accountAddress
      );

      for (let i in positionsOfOwner) {
        scalpPositionsIndexes.push(positionsOfOwner[i].toNumber());
      }
    } catch (err) {
      console.log(err);
    }

    const scalpPositionsPromises: any[] = [];

    const blockNumber = await provider.getBlockNumber();

    const events = await optionScalpContract?.queryFilter(
      optionScalpContract.filters.OpenPosition(null, null, accountAddress),
      72264883,
      blockNumber
    );

    for (let i in events) {
      if (
        !scalpPositionsIndexes.includes(Number(events[i]['args'][0])) &&
        events[i]['args'][2] === accountAddress
      ) {
        scalpPositionsIndexes.push(events[i]['args'][0]);
      }
    }

    const pnlsPromises: any[] = [];

    for (let i in scalpPositionsIndexes) {
      scalpPositionsPromises.push(getScalpPosition(scalpPositionsIndexes[i]));
      pnlsPromises.push(calcPnl(scalpPositionsIndexes[i]));
    }

    let scalpPositions: ScalpPosition[] = await Promise.all(
      scalpPositionsPromises
    );

    let pnls: BigNumber[] = await Promise.all(pnlsPromises);

    scalpPositions = scalpPositions.map((position, index) => ({
      ...position,
      id: scalpPositionsIndexes[index],
      pnl: position.isOpen
        ? pnls[index]!.sub(position.premium).sub(position.fees)
        : position.pnl,
      liquidationPrice: calcLiqPrice(position),
    }));

    scalpPositions.reverse();

    return scalpPositions;
  },
  getScalpOpenOrder: async (id, hash) => {
    const { getLimitOrdersContract, getOptionScalpContract, optionScalpData } =
      get();

    if (!optionScalpData) return;

    const limitOrdersContract = await getLimitOrdersContract();
    const optionScalpContract = await getOptionScalpContract();

    try {
      const openOrder = await limitOrdersContract.callStatic.openOrders(id);

      const ticks = await limitOrdersContract.callStatic.getNFTPositionTicks(
        openOrder['positionId'],
        openOrder['optionScalp']
      );

      const tick = (ticks[0] + ticks[1]) / 2;

      const price = BigNumber.from(Math.round(1 / 1.0001 ** tick));

      const maxFundingTime = await limitOrdersContract.maxFundingTime();

      const expiry = openOrder['timestamp'].add(maxFundingTime);
      const timeframe = await optionScalpContract.timeframes(
        openOrder['timeframeIndex']
      );

      const positions = openOrder['size']
        .mul(BigNumber.from(10 ** optionScalpData?.quoteDecimals.toNumber()))
        .div(price);

      if (
        openOrder['cancelled'] === false &&
        openOrder['optionScalp'] === optionScalpContract.address
      )
        return {
          transactionHash: hash,
          id: id,
          isOpen: true,
          isShort: openOrder['isShort'],
          size: openOrder['size'],
          timeframe: timeframe,
          collateral: openOrder['collateral'],
          price: price,
          expiry: expiry,
          filled: openOrder['filled'],
          positions: positions,
          type: 'open',
        };

      return;
    } catch (e) {
      console.log(e);
      return;
    }
  },
  getScalpCloseOrder: async (id, hash) => {
    const { getLimitOrdersContract, getOptionScalpContract, optionScalpData } =
      get();

    if (!optionScalpData) return;

    const limitOrdersContract = await getLimitOrdersContract();
    const optionScalpContract = await getOptionScalpContract();

    try {
      const scalpPosition = await optionScalpContract.scalpPositions(id);
      const closeOrder = await limitOrdersContract.closeOrders(id);

      const ticks = await limitOrdersContract.callStatic.getNFTPositionTicks(
        closeOrder['positionId'],
        closeOrder['optionScalp']
      );

      const tick = (ticks[0] + ticks[1]) / 2;

      const price = BigNumber.from(Math.round(1.0001 ** tick * 10 ** 18));

      const positions = scalpPosition['size']
        .mul(BigNumber.from(10 ** optionScalpData.quoteDecimals.toNumber()))
        .div(price);

      return {
        transactionHash: hash,
        id: id,
        isOpen: false,
        isShort: scalpPosition['isShort'],
        size: scalpPosition['size'],
        timeframe: scalpPosition['timeframe'],
        collateral: scalpPosition['collateral'],
        price: price,
        expiry: null,
        positions: positions,
        type: 'close',
      };
    } catch (e) {
      console.log(e);
      return;
    }
  },
  getScalpOrders: async () => {
    const {
      accountAddress,
      provider,
      getScalpOpenOrder,
      getScalpCloseOrder,
      getLimitOrdersContract,
    } = get();

    if (!accountAddress) return;

    const limitOrdersContract = await getLimitOrdersContract();

    const openOrdersIndexes: any = [];
    const openOrdersPromises: any[] = [];
    const closeOrdersIndexes: any = [];
    const closeOrdersPromises: any[] = [];

    const blockNumber = await provider.getBlockNumber();

    const openOrdersEvents = await limitOrdersContract?.queryFilter(
      limitOrdersContract.filters.CreateOpenOrder(null, accountAddress),
      72264883,
      blockNumber
    );

    const closeOrdersEvents = await limitOrdersContract?.queryFilter(
      limitOrdersContract.filters.CreateCloseOrder(null, accountAddress),
      72264883,
      blockNumber
    );

    const openOrdersTransactionsHashes: string[] = [];
    const closeOrdersTransactionsHashes: string[] = [];

    for (let i in openOrdersEvents) {
      if (
        !openOrdersIndexes.includes(Number(openOrdersEvents[i]['args'][0])) &&
        openOrdersEvents[i]['args'][1] === accountAddress
      ) {
        openOrdersIndexes.push(openOrdersEvents[i]['args'][0]);
        openOrdersTransactionsHashes.push(
          openOrdersEvents[i]['transactionHash']
        );
      }
    }

    for (let i in closeOrdersEvents) {
      console.log(closeOrdersEvents[i]);
      if (
        !closeOrdersIndexes.includes(Number(closeOrdersEvents[i]['args'][0])) &&
        closeOrdersEvents[i]['args'][1] === accountAddress
      ) {
        closeOrdersIndexes.push(closeOrdersEvents[i]['args'][0]);
        closeOrdersTransactionsHashes.push(
          closeOrdersEvents[i]['transactionHash']
        );
      }
    }

    for (let i in openOrdersIndexes) {
      openOrdersPromises.push(
        getScalpOpenOrder(openOrdersIndexes[i], openOrdersTransactionsHashes[i])
      );
    }

    for (let i in closeOrdersIndexes) {
      closeOrdersPromises.push(
        getScalpCloseOrder(
          closeOrdersIndexes[i],
          closeOrdersTransactionsHashes[i]
        )
      );
    }

    const openOrders: ScalpOrder[] = await Promise.all(openOrdersPromises);

    const closeOrders: ScalpOrder[] = await Promise.all(closeOrdersPromises);

    return openOrders.concat(closeOrders).filter((_) => _); // filter out null
  },
  updateOptionScalpUserData: async () => {
    const {
      accountAddress,
      getOptionScalpsBaseLpContract,
      getOptionScalpsQuoteLpContract,
      getScalpPositions,
      getScalpOrders,
    } = get();

    const scalpPositions = await getScalpPositions();
    const scalpOrders = await getScalpOrders();

    const [quoteCoolingPeriod, baseCoolingPeriod] = await Promise.all([
      getOptionScalpsQuoteLpContract().lockedUsers(accountAddress),
      getOptionScalpsBaseLpContract().lockedUsers(accountAddress),
    ]);

    set((prevState) => ({
      ...prevState,
      optionScalpUserData: {
        ...prevState.optionScalpUserData,
        scalpPositions: scalpPositions,
        scalpOrders: scalpOrders,
        coolingPeriod: {
          quote: Number(quoteCoolingPeriod),
          base: Number(baseCoolingPeriod),
        },
      },
    }));
  },
  getUserPositionData: async () => {
    const userPositionData = await queryClient.fetchQuery({
      queryKey: ['getTraderStats'],
      queryFn: () => graphSdk.getTraderStats(),
    });

    if (!userPositionData) return;
    return userPositionData.traderStats;
  },
  updateOptionScalp: async () => {
    const {
      getOptionScalpContract,
      getLimitOrdersContract,
      getOptionScalpsQuoteLpContract,
      getOptionScalpsBaseLpContract,
      selectedPoolName,
    } = get();

    const optionScalpContract = getOptionScalpContract();
    const limitOrdersContract = getLimitOrdersContract();
    const quoteLpContract = getOptionScalpsQuoteLpContract();
    const baseLpContract = getOptionScalpsBaseLpContract();

    const [
      minimumMargin,
      feeOpenPosition,
      minimumAbsoluteLiquidationThreshold,
      maxSize,
      maxOpenInterest,
      longOpenInterest,
      shortOpenInterest,
      markPrice,
      totalQuoteDeposits,
      totalBaseDeposits,
      totalQuoteAvailable,
      totalBaseAvailable,
      quoteSupply,
      baseSupply,
    ] = await Promise.all([
      optionScalpContract!['minimumMargin'](),
      optionScalpContract!['feeOpenPosition'](),
      optionScalpContract!['minimumAbsoluteLiquidationThreshold'](),
      optionScalpContract!['maxSize'](),
      optionScalpContract!['maxOpenInterest'](),
      optionScalpContract!['openInterest'](false),
      optionScalpContract!['openInterest'](true),
      optionScalpContract!['getMarkPrice'](),
      quoteLpContract!['totalAssets'](),
      baseLpContract!['totalAssets'](),
      quoteLpContract!['totalAvailableAssets'](),
      baseLpContract!['totalAvailableAssets'](),
      quoteLpContract!['totalSupply'](),
      baseLpContract!['totalSupply'](),
    ]);

    const quoteDecimals: BigNumber =
      selectedPoolName === 'ETH' || selectedPoolName === 'ARB'
        ? BigNumber.from('6')
        : BigNumber.from('18');
    const baseDecimals: BigNumber =
      selectedPoolName === 'ETH' || selectedPoolName === 'ARB'
        ? BigNumber.from('18')
        : BigNumber.from('8');

    const quoteLpValue: BigNumber = quoteSupply.gt(0)
      ? BigNumber.from((10 ** quoteDecimals.toNumber()).toString())
          .mul(totalQuoteDeposits)
          .div(quoteSupply)
      : BigNumber.from('0');

    const baseLpValue: BigNumber = baseSupply.gt(0)
      ? BigNumber.from((10 ** baseDecimals.toNumber()).toString())
          .mul(totalBaseDeposits)
          .div(baseSupply)
      : BigNumber.from('0');

    let quoteSymbol: string;
    let baseSymbol: string;

    if (selectedPoolName === 'ETH' || selectedPoolName === 'ARB') {
      quoteSymbol = 'USDC';
    }

    if (selectedPoolName === 'ETH') {
      baseSymbol = 'ETH';
    }

    if (selectedPoolName === 'ARB') {
      baseSymbol = 'ARB';
    }

    const compStartDate = new Date(1680300000000); // 4 APR 2023
    const today = new Date();

    const daysSinceComp = BigNumber.from(
      Math.ceil(
        (today.getTime() - compStartDate.getTime()) / (1000 * 3600 * 24)
      )
    );

    const baseLpAPR = totalBaseDeposits.gt(0)
      ? totalBaseDeposits
          .sub(baseSupply)
          .mul(365)
          .div(daysSinceComp)
          .mul(100)
          .div(totalBaseDeposits)
      : BigNumber.from(0);

    const quoteLpAPR = totalQuoteDeposits.gt(0)
      ? totalQuoteDeposits
          .sub(quoteSupply)
          .mul(365)
          .div(daysSinceComp)
          .mul(100)
          .div(totalQuoteDeposits)
      : BigNumber.from(0);

    set((prevState) => ({
      ...prevState,
      optionScalpData: {
        optionScalpContract: optionScalpContract,
        limitOrdersContract: limitOrdersContract,
        quoteLpContract: quoteLpContract,
        baseLpContract: baseLpContract,
        minimumMargin: minimumMargin,
        feeOpenPosition: feeOpenPosition,
        minimumAbsoluteLiquidationThreshold:
          minimumAbsoluteLiquidationThreshold,
        maxSize: maxSize,
        maxOpenInterest: maxOpenInterest,
        longOpenInterest: longOpenInterest,
        shortOpenInterest: shortOpenInterest,
        markPrice: markPrice,
        totalQuoteDeposits: totalQuoteDeposits,
        totalBaseDeposits: totalBaseDeposits,
        totalQuoteAvailable: totalQuoteAvailable,
        totalBaseAvailable: totalBaseAvailable,
        quoteLpValue: quoteLpValue,
        baseLpValue: baseLpValue,
        quoteLpAPR: quoteLpAPR,
        baseLpAPR: baseLpAPR,
        quoteDecimals: quoteDecimals,
        baseDecimals: baseDecimals,
        quoteSymbol: quoteSymbol,
        baseSymbol: baseSymbol,
        inverted: selectedPoolName === 'BTC',
      },
    }));
  },
});
