/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { OptionLP, OptionLPInterface } from '../OptionLP';

const _abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'usd',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'underlying',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'optionPricing',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'assetSwapper',
            type: 'address',
          },
        ],
        internalType: 'struct BaseOptionLp.Addresses',
        name: '_addresses',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AmountTooSmall',
    type: 'error',
  },
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
    inputs: [],
    name: 'InsuffientLiquidity',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidDiscount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidEpochToFill',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidLiquidity',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidLpIndex',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidStrike',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LpPositionDead',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyBuyerCanKill',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SsovDoesNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SsovEpochExpired',
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
        components: [
          {
            internalType: 'address',
            name: 'usd',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'underlying',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'optionPricing',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'assetSwapper',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct BaseOptionLp.Addresses',
        name: '_addresses',
        type: 'tuple',
      },
    ],
    name: 'AddressesSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'EmergencyWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'epochStrikeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'LPDustCleared',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'epochStrikeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdPremium',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'underlyingPremium',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
    ],
    name: 'LPPositionFilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'epochStrikeToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'LPPositionKilled',
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
        name: 'ssov',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
    ],
    name: 'SsovExpiryUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'ssov',
        type: 'address',
      },
    ],
    name: 'SsovForTokenRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'ssov',
        type: 'address',
      },
    ],
    name: 'SsovForTokenRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'epochStrikeToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'baseLiquidity',
        type: 'uint256',
      },
    ],
    name: 'UnderlyingLiquidityForStrikeAdded',
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
      {
        indexed: true,
        internalType: 'address',
        name: 'epochStrikeToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdLiquidity',
        type: 'uint256',
      },
    ],
    name: 'UsdLiquidityForStrikeAdded',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
    ],
    name: 'addToContractWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isUsd',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'discount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'addToLp',
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
    inputs: [],
    name: 'addresses',
    outputs: [
      {
        internalType: 'address',
        name: 'usd',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'underlying',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'optionPricing',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'assetSwapper',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'volatility',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'calculatePremium',
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
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        internalType: 'bool',
        name: 'transferNative',
        type: 'bool',
      },
    ],
    name: 'emergencyWithdrawn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'outUsd',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'strikeToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lpIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'fillLpPosition',
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
        name: 'strikeToken',
        type: 'address',
      },
    ],
    name: 'getAllLpPositions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'lpId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'epoch',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'strike',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'usdLiquidity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingLiquidity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'usdLiquidityUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingLiquidityUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'discount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'purchased',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'buyer',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'killed',
            type: 'bool',
          },
        ],
        internalType: 'struct OptionLp.LpPosition[]',
        name: '',
        type: 'tuple[]',
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
    ],
    name: 'getOptionTokenInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'ssov',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'usdLiquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'underlyingLiquidity',
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
        name: 'ssov',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'usdPremium',
        type: 'uint256',
      },
    ],
    name: 'getPremiumInUnderlying',
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
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'getSsov',
    outputs: [
      {
        internalType: 'contract ISSOV',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'getSsovCollateralPrecision',
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
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'getSsovEpoch',
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
        name: 'ssov',
        type: 'address',
      },
    ],
    name: 'getSsovEpochExpiries',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getSsovEpochStrikes',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'strikes',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ssov',
        type: 'address',
      },
    ],
    name: 'getSsovEpochs',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getSsovExpiry',
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
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
    ],
    name: 'getSsovOptionToken',
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
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getSsovOptionTokens',
    outputs: [
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'getSsovUnderlyingPrice',
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
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
    ],
    name: 'getSsovVolatility',
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
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
    ],
    name: 'getTokenVaultRegistry',
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
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'strikeToken',
        type: 'address',
      },
    ],
    name: 'getUserLpPositions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'lpId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'epoch',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'strike',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'usdLiquidity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingLiquidity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'usdLiquidityUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingLiquidityUsed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'discount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'purchased',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'buyer',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'killed',
            type: 'bool',
          },
        ],
        internalType: 'struct OptionLp.LpPosition[]',
        name: 'positions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'hasEpochExpired',
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
    inputs: [
      {
        internalType: 'address',
        name: 'strikeToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lpIndex',
        type: 'uint256',
      },
    ],
    name: 'killLpPosition',
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
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isUsd',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256[]',
        name: 'strikes',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'liquidity',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'discount',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'multiAddToLp',
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
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'outUsd',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'strikeToken',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'lpIndices',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amount',
        type: 'uint256[]',
      },
    ],
    name: 'multiFillLpPosition',
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
        name: 'strikeToken',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'lpIndices',
        type: 'uint256[]',
      },
    ],
    name: 'multiKillLpPosition',
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
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
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
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'registerSsovForToken',
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
        name: '_contract',
        type: 'address',
      },
    ],
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
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'usd',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'underlying',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'optionPricing',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'assetSwapper',
            type: 'address',
          },
        ],
        internalType: 'struct BaseOptionLp.Addresses',
        name: '_addresses',
        type: 'tuple',
      },
    ],
    name: 'setAddresses',
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
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
    ],
    name: 'unregisterSsovForToken',
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
        name: 'ssov',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'updateSsovEpoch',
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

export class OptionLP__factory {
  static readonly abi = _abi;
  static createInterface(): OptionLPInterface {
    return new utils.Interface(_abi) as OptionLPInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OptionLP {
    return new Contract(address, _abi, signerOrProvider) as OptionLP;
  }
}
