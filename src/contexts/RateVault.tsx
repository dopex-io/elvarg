import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';
import { VolatilityOracle, SSOVOptionPricing } from '@dopex-io/sdk';

import { BigNumber, ethers } from 'ethers';

import { WalletContext } from './Wallet';

const abi = [
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'sources',
        type: 'bytes32[]',
      },
      {
        internalType: 'address[]',
        name: 'destinations',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: '_crvLP',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_crvPool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'source',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'destination',
        type: 'address',
      },
    ],
    name: 'ZeroAddress',
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
        indexed: true,
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'destination',
        type: 'address',
      },
    ],
    name: 'AddressSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'Bootstrap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'Leverage',
        type: 'uint256',
      },
    ],
    name: 'CallsLeverageSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewards',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldBalance',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBalance',
        type: 'uint256',
      },
    ],
    name: 'Compound',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'strike',
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
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
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
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'EmergencyWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rateAtSettlement',
        type: 'uint256',
      },
    ],
    name: 'EpochExpired',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expireDelayTolerance',
        type: 'uint256',
      },
    ],
    name: 'ExpireDelayToleranceUpdate',
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
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'strike',
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
        name: 'premium',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'Purchase',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'Leverage',
        type: 'uint256',
      },
    ],
    name: 'PutsLeverageSet',
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
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
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
        name: 'pnl',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'Settle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
    ],
    name: 'StrikeSet',
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
        indexed: false,
        internalType: 'uint256',
        name: 'windowSizeInHours',
        type: 'uint256',
      },
    ],
    name: 'WindowSizeUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userDeposits',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'crvLPWithdrawn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'crvRewards',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'addresses',
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
        internalType: 'uint256',
        name: '_expiry',
        type: 'uint256',
      },
    ],
    name: 'bootstrap',
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
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
    ],
    name: 'calculatePnl',
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
        name: '_strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_isPut',
        type: 'bool',
      },
    ],
    name: 'calculatePremium',
    outputs: [
      {
        internalType: 'uint256',
        name: 'premium',
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
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
    ],
    name: 'calculatePurchaseFees',
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
        name: 'rateAtSettlement',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pnl',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
    ],
    name: 'calculateSettlementFees',
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
    name: 'crvLP',
    outputs: [
      {
        internalType: 'contract ICrv2Pool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'crvPool',
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
    name: 'currentEpoch',
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
        internalType: 'uint256[]',
        name: 'strikeIndex',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'callLeverageIndex',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'putLeverageIndex',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amount',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'depositMultiple',
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
    name: 'emergencyWithdraw',
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
    name: 'expireDelayTolerance',
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
    name: 'expireEpoch',
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
        internalType: 'uint256',
        name: 'rateAtSettlement',
        type: 'uint256',
      },
    ],
    name: 'expireEpoch',
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
        internalType: 'bytes32',
        name: 'name',
        type: 'bytes32',
      },
    ],
    name: 'getAddress',
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
    name: 'getCurrentRate',
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
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochData',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochLeverages',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
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
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochPremiums',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
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
    name: 'getEpochStrikeData',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
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
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochStrikes',
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
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochTimes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'end',
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
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochTokens',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLpPrice',
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
        name: '_strike',
        type: 'uint256',
      },
    ],
    name: 'getVolatility',
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
    name: 'optionsTokenImplementation',
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
        internalType: 'uint256',
        name: 'strikeIndex',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'purchase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'names',
        type: 'bytes32[]',
      },
      {
        internalType: 'address[]',
        name: 'destinations',
        type: 'address[]',
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
        internalType: 'uint256[]',
        name: 'callsLeverages',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'putsLeverages',
        type: 'uint256[]',
      },
    ],
    name: 'setLeverages',
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
        internalType: 'uint256[]',
        name: 'strikes',
        type: 'uint256[]',
      },
    ],
    name: 'setStrikes',
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
        internalType: 'uint256',
        name: 'strikeIndex',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'settle',
    outputs: [
      {
        internalType: 'uint256',
        name: 'pnl',
        type: 'uint256',
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
    name: 'totalEpochData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCallsDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalPutsDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalTokenDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'epochCallsPremium',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'epochPutsPremium',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCallsPurchased',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalPutsPurchased',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'epochStartTimes',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'epochExpiryTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isEpochExpired',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isVaultReady',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'epochBalanceAfterUnstaking',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'crvToDistribute',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rateAtSettlement',
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
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'totalStrikeData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalTokensStrikeDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCallsStrikeDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalPutsStrikeDeposits',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCallsPurchased',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalPutsPurchased',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'callsSettlement',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'putsSettlement',
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
        internalType: 'uint256',
        name: '_expireDelayTolerance',
        type: 'uint256',
      },
    ],
    name: 'updateExpireDelayTolerance',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'userEpochStrikeDeposits',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'callLeverage',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'putLeverage',
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
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'userStrikePurchaseData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'putsPurchased',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'callsPurchased',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'userEpochCallsPremium',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'userEpochPutsPremium',
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
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'strikeIndex',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'callLeverageIndex',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'putLeverageIndex',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'withdrawMultiple',
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
];

export interface RateVault {
  token?: string;
}

export interface RateVaultData {
  rateVaultContract: any;
  currentEpoch: number;
  rateVaultOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface RateVaultEpochData {
  volatilities: BigNumber[];
  callsFees: BigNumber[];
  putsFees: BigNumber[];
  callsPremiumCosts: BigNumber[];
  putsPremiumCosts: BigNumber[];
  lpPrice: BigNumber;
  callsCosts: BigNumber[];
  putsCosts: BigNumber[];
  totalCallsPremiums: BigNumber;
  totalPutsPremiums: BigNumber;
  callsDeposits: BigNumber[];
  putsDeposits: BigNumber[];
  totalCallsPurchased: BigNumber;
  totalPutsPurchased: BigNumber;
  totalCallsDeposits: BigNumber;
  totalPutsDeposits: BigNumber;
  totalTokenDeposits: BigNumber;
  epochCallsPremium: BigNumber;
  epochPutsPremium: BigNumber;
  epochStartTimes: BigNumber;
  epochEndTimes: BigNumber;
  epochTimes: [BigNumber, BigNumber];
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochBalanceAfterUnstaking: BigNumber;
  crvToDistribute: BigNumber;
  rateAtSettlement: BigNumber;
  epochStrikes: BigNumber[];
  callsLeverages: BigNumber[];
  putsLeverages: BigNumber[];
  callsToken: string[];
  putsToken: string[];
  isBootstrapped: boolean;
  epochStrikeCallsPremium: BigNumber[];
  epochStrikePutsPremium: BigNumber[];
  curveLpPrice: BigNumber;
  rate: BigNumber;
}

export interface RateVaultUserData {
  userEpochStrikeDeposits: {
    amount: BigNumber;
    callLeverage: BigNumber;
    putLeverage: BigNumber;
    callLeverageIndex: number;
    putLeverageIndex: number;
    strike: BigNumber;
    strikeIndex: number;
  }[];
  userStrikePurchaseData: {
    callsPurchased: BigNumber;
    putsPurchased: BigNumber;
    strikeIndex: number;
    strike: BigNumber;
  }[];
}

interface RateVaultContextInterface {
  rateVaultData: RateVaultData;
  rateVaultEpochData: RateVaultEpochData;
  rateVaultUserData: RateVaultUserData;
  selectedPoolName: string;
  selectedEpoch: number;
  updateRateVaultEpochData: Function;
  updateRateVaultUserData: Function;
  setSelectedEpoch: Function;
  setSelectedPoolName: Function;
}

const initialRateVaultUserData = {
  totalUserCallsDeposits: BigNumber.from('0'),
  totalUserPutsDeposits: BigNumber.from('0'),
  userEpochStrikeDeposits: [],
  userStrikePurchaseData: [],
};

// @ts-ignore TODO: FIX
export const RateVaultContext = createContext<RateVaultContextInterface>({
  rateVaultUserData: initialRateVaultUserData,
});

export const RateVault = () => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedPoolName, setSelectedPoolName] = useState<string | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [rateVaultData, setRateVaultData] = useState<RateVaultData>();
  const [rateVaultEpochData, setRateVaultEpochData] =
    useState<RateVaultEpochData>();
  const [rateVaultUserData, setRateVaultUserData] =
    useState<RateVaultUserData>();
  const rateVaultContract = useMemo(() => {
    return new ethers.Contract(
      '0x602B9f9B7126DEce2b9a589B49Fe5947c903A156',
      abi,
      signer
    );
  }, [signer]);

  const getUserStrikePurchaseData = useCallback(
    async (strike: BigNumber, strikeIndex: number) => {
      const identifier = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [accountAddress, strike]
      );

      return {
        purchase: await rateVaultContract['userStrikePurchaseData'](
          Math.max(selectedEpoch || 0, 1),
          identifier
        ),
        strike: strike,
        strikeIndex: strikeIndex,
      };
    },
    [rateVaultContract, contractAddresses, accountAddress, selectedEpoch]
  );

  const getUserStrikeDeposits = useCallback(
    async (
      strike: BigNumber,
      strikeIndex: number,
      callLeverage: any,
      putLeverage: any
    ) => {
      const identifier = ethers.utils.solidityKeccak256(
        ['address', 'uint256', 'uint256', 'uint256'],
        [accountAddress, strike, callLeverage, putLeverage]
      );

      return {
        strike: strike,
        strikeIndex: strikeIndex,
        deposits: await rateVaultContract['userEpochStrikeDeposits'](
          Math.max(selectedEpoch || 0, 1),
          identifier
        ),
      };
    },
    [rateVaultContract, contractAddresses, accountAddress, selectedEpoch]
  );

  const updateRateVaultUserData = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !rateVaultEpochData?.epochStrikes ||
      !selectedPoolName
    )
      return;

    const userEpochStrikeDeposits: RateVaultUserData['userEpochStrikeDeposits'][] =
      [];
    const userStrikePurchaseData: RateVaultUserData['userStrikePurchaseData'][] =
      [];
    const userStrikePurchaseDataPromises: any[] = [];

    for (let i in rateVaultEpochData.callsLeverages) {
      for (let j in rateVaultEpochData.putsLeverages) {
        const userEpochStrikeDepositsPromises: any[] = [];

        rateVaultEpochData.epochStrikes.map((strike, strikeIndex) => {
          userEpochStrikeDepositsPromises.push(
            getUserStrikeDeposits(
              strike,
              strikeIndex,
              rateVaultEpochData.callsLeverages[i],
              rateVaultEpochData.putsLeverages[j]
            )
          );
        });

        const _userEpochStrikeDeposits = await Promise.all(
          userEpochStrikeDepositsPromises
        );

        _userEpochStrikeDeposits.map((record) => {
          userEpochStrikeDeposits.push({
            // @ts-ignore TODO: FIX
            amount: record.deposits.amount,
            callLeverage: rateVaultEpochData.callsLeverages[i],
            putLeverage: rateVaultEpochData.putsLeverages[j],
            callLeverageIndex: Number(i),
            putLeverageIndex: Number(j),
            strike: record.strike,
            strikeIndex: record.strikeIndex,
          });
        });
      }
    }

    rateVaultEpochData.epochStrikes.map((strike, strikeIndex) => {
      userStrikePurchaseDataPromises.push(
        getUserStrikePurchaseData(strike, strikeIndex)
      );
    });

    const _userStrikePurchaseData = await Promise.all(
      userStrikePurchaseDataPromises
    );

    _userStrikePurchaseData.map((record) => {
      userStrikePurchaseData.push({
        // @ts-ignore TODO: FIX
        callsPurchased: record.purchase.callsPurchased,
        putsPurchased: record.purchase.putsPurchased,
        strike: record.strike,
        strikeIndex: record.strikeIndex,
      });
    });

    setRateVaultUserData({
      // @ts-ignore TODO: FIX
      userEpochStrikeDeposits: userEpochStrikeDeposits,
      // @ts-ignore TODO: FIX
      userStrikePurchaseData: userStrikePurchaseData,
    });
  }, [
    accountAddress,
    contractAddresses,
    provider,
    selectedEpoch,
    rateVaultEpochData,
    selectedPoolName,
  ]);

  const getEpochStrikes = useCallback(async () => {
    return await rateVaultContract['getEpochStrikes'](
      Math.max(selectedEpoch || 0, 1)
    );
  }, [rateVaultContract, selectedEpoch]);

  const getEpochData = useCallback(async () => {
    try {
      return await rateVaultContract['getEpochData'](
        Math.max(selectedEpoch || 0, 1)
      );
    } catch (err) {
      return [[], [], []];
    }
  }, [rateVaultContract, selectedEpoch]);

  const getTotalEpochData = useCallback(async () => {
    return await rateVaultContract['totalEpochData'](
      Math.max(selectedEpoch || 0, 1)
    );
  }, [rateVaultContract, selectedEpoch]);

  const getEpochLeverages = useCallback(async () => {
    try {
      return await rateVaultContract['getEpochLeverages'](
        Math.max(selectedEpoch || 0, 1)
      );
    } catch (err) {
      return [[], []];
    }
  }, [rateVaultContract, selectedEpoch]);

  const getEpochPremiums = useCallback(async () => {
    return await rateVaultContract['getEpochPremiums'](
      Math.max(selectedEpoch || 0, 1)
    );
  }, [rateVaultContract, selectedEpoch]);

  const getTotalStrikeData = useCallback(
    async (strike: BigNumber) => {
      try {
        return await rateVaultContract['totalStrikeData'](
          Math.max(selectedEpoch || 0, 1),
          strike
        );
      } catch (err) {
        console.log(err);
        return BigNumber.from('0');
      }
    },
    [rateVaultContract, selectedEpoch, provider]
  );

  const calculatePremium = useCallback(
    async (strike: BigNumber, isPut: boolean) => {
      try {
        return await rateVaultContract['calculatePremium'](
          strike,
          BigNumber.from('1000000000000000000'),
          isPut
        );
      } catch (err) {
        return BigNumber.from('0');
      }
    },
    [rateVaultContract]
  );

  const calculatePurchaseFee = useCallback(
    async (rate: BigNumber, strike: BigNumber, isPut: boolean) => {
      try {
        return await rateVaultContract['calculatePremium'](
          rate,
          strike,
          BigNumber.from('1000000000000000000'),
          isPut
        );
      } catch (err) {
        return BigNumber.from('0');
      }
    },
    [rateVaultContract]
  );

  const getCurrentRate = useCallback(async () => {
    try {
      return await rateVaultContract['getCurrentRate']();
    } catch (err) {
      return BigNumber.from('0');
    }
  }, [rateVaultContract]);

  const updateRateVaultEpochData = useCallback(async () => {
    if (selectedEpoch === null || !selectedPoolName) return;
    const lpPrice = await rateVaultContract['getLpPrice']();

    try {
      const promises = await Promise.all([
        getEpochData(),
        getTotalEpochData(),
        getEpochLeverages(),
        getEpochPremiums(),
        getEpochStrikes(),
      ]);

      const epochStrikes = promises[4];
      const epochCallsStrikeTokens = promises[0][1];
      const epochPutsStrikeTokens = promises[0][2];

      let epochTimes;

      epochTimes = await rateVaultContract['getEpochTimes'](
        Math.max(selectedEpoch, 1)
      );

      const callsPremiumCostsPromises = [];
      const putsPremiumCostsPromises = [];
      const callsFeesPromises = [];
      const putsFeesPromises = [];
      const totalStrikesDataPromises = [];
      const curveLpPrice = await rateVaultContract['getLpPrice']();
      const rate = await getCurrentRate();
      const volatilitiesPromises = [];

      for (let i in epochStrikes) {
        volatilitiesPromises.push(
          rateVaultContract['getVolatility'](epochStrikes[i])
        );
        callsPremiumCostsPromises.push(
          calculatePremium(epochStrikes[i], false)
        );
        putsPremiumCostsPromises.push(calculatePremium(epochStrikes[i], true));

        callsFeesPromises.push(
          calculatePurchaseFee(rate, epochStrikes[i], false)
        );
        putsFeesPromises.push(
          calculatePurchaseFee(rate, epochStrikes[i], true)
        );
        totalStrikesDataPromises.push(getTotalStrikeData(epochStrikes[i]));
      }

      const volatilities = await Promise.all(volatilitiesPromises);
      const totalStrikesData = await Promise.all(totalStrikesDataPromises);
      const callsPremiumCosts = await Promise.all(callsPremiumCostsPromises);
      const putsPremiumCosts = await Promise.all(putsPremiumCostsPromises);
      const callsFees = await Promise.all(callsFeesPromises);
      const putsFees = await Promise.all(putsFeesPromises);

      const callsLeverages = promises[2][0];
      const putsLeverages = promises[2][1];

      let totalCallsPremiums = BigNumber.from('0');
      let totalPutsPremiums = BigNumber.from('0');

      for (let i in promises[3][0]) {
        totalCallsPremiums = totalCallsPremiums.add(promises[3][0][i]);
        totalPutsPremiums = totalPutsPremiums.add(promises[3][1][i]);
      }

      const callsCosts: BigNumber[] = [];
      const putsCosts: BigNumber[] = [];
      const callsDeposits: BigNumber[] = [];
      const putsDeposits: BigNumber[] = [];

      for (let i in callsPremiumCosts) {
        callsCosts.push(callsPremiumCosts[i].add(callsFees[i]));
        putsCosts.push(putsPremiumCosts[i].add(putsFees[i]));

        callsDeposits.push(totalStrikesData[i].totalCallsStrikeDeposits);
        putsDeposits.push(totalStrikesData[i].totalPutsStrikeDeposits);
      }

      setRateVaultEpochData({
        volatilities: volatilities,
        callsFees: callsFees,
        putsFees: putsFees,
        callsPremiumCosts: callsPremiumCosts,
        putsPremiumCosts: putsPremiumCosts,
        lpPrice: lpPrice,
        callsCosts: callsCosts,
        putsCosts: putsCosts,
        totalCallsPremiums: totalCallsPremiums,
        totalPutsPremiums: totalPutsPremiums,
        callsDeposits: callsDeposits,
        putsDeposits: putsDeposits,
        totalCallsPurchased: BigNumber.from('0'),
        totalPutsPurchased: BigNumber.from('0'),
        totalCallsDeposits: promises[1][0],
        totalPutsDeposits: promises[1][1],
        totalTokenDeposits: promises[1][2],
        epochCallsPremium: promises[1][5],
        epochPutsPremium: promises[1][6],
        epochStartTimes: promises[1][7],
        epochEndTimes: epochTimes[1],
        epochTimes: epochTimes,
        isEpochExpired: promises[1][9],
        isVaultReady: promises[1][10],
        epochBalanceAfterUnstaking: promises[1][8],
        crvToDistribute: promises[1][11],
        rateAtSettlement: promises[1][12],
        epochStrikes: epochStrikes,
        callsLeverages: callsLeverages,
        putsLeverages: putsLeverages,
        callsToken: epochCallsStrikeTokens,
        isBootstrapped: epochCallsStrikeTokens.length > 0,
        putsToken: epochPutsStrikeTokens,
        epochStrikeCallsPremium: promises[3][0],
        epochStrikePutsPremium: promises[3][1],
        curveLpPrice: curveLpPrice,
        rate: rate,
      });
    } catch (err) {
      console.log(err);
      const epochTimes = await rateVaultContract['getEpochTimes'](
        Math.max(selectedEpoch, 1)
      );
      const curveLpPrice = await rateVaultContract['getLpPrice']();
      const rate = BigNumber.from('100000000');
      setRateVaultEpochData({
        volatilities: [],
        callsFees: [],
        putsFees: [],
        callsPremiumCosts: [],
        putsPremiumCosts: [],
        lpPrice: lpPrice,
        callsCosts: [],
        putsCosts: [],
        totalCallsPremiums: BigNumber.from('0'),
        totalPutsPremiums: BigNumber.from('0'),
        callsDeposits: [],
        putsDeposits: [],
        totalCallsPurchased: BigNumber.from('0'),
        totalPutsPurchased: BigNumber.from('0'),
        totalCallsDeposits: BigNumber.from('0'),
        totalPutsDeposits: BigNumber.from('0'),
        totalTokenDeposits: BigNumber.from('0'),
        epochCallsPremium: BigNumber.from('0'),
        epochPutsPremium: BigNumber.from('0'),
        epochStartTimes: epochTimes[0],
        epochEndTimes: epochTimes[1],
        epochTimes: epochTimes,
        isEpochExpired: true,
        isVaultReady: false,
        epochBalanceAfterUnstaking: BigNumber.from('0'),
        crvToDistribute: BigNumber.from('0'),
        rateAtSettlement: BigNumber.from('0'),
        epochStrikes: [
          BigNumber.from('0'),
          BigNumber.from('0'),
          BigNumber.from('0'),
          BigNumber.from('0'),
        ],
        callsLeverages: [],
        putsLeverages: [],
        callsToken: [],
        putsToken: [],
        isBootstrapped: false,
        epochStrikeCallsPremium: [
          BigNumber.from('0'),
          BigNumber.from('0'),
          BigNumber.from('0'),
          BigNumber.from('0'),
        ],
        epochStrikePutsPremium: [
          BigNumber.from('0'),
          BigNumber.from('0'),
          BigNumber.from('0'),
          BigNumber.from('0'),
        ],
        curveLpPrice: curveLpPrice,
        rate: rate,
      });
    }
  }, [rateVaultContract, contractAddresses, selectedEpoch, provider]);

  useEffect(() => {
    async function update() {
      const rateVaultAddresses = '0x602B9f9B7126DEce2b9a589B49Fe5947c903A156';

      const _rateVaultContract = new ethers.Contract(
        rateVaultAddresses,
        abi,
        signer
      );

      let currentEpoch;

      try {
        currentEpoch = parseInt(await _rateVaultContract['currentEpoch']());
      } catch (err) {
        console.log(err);
        return;
      }

      setSelectedEpoch(Number(currentEpoch));

      setRateVaultData({
        currentEpoch: Number(currentEpoch),
        rateVaultContract: _rateVaultContract,
      });
    }

    update();
  }, [contractAddresses, provider]);

  useEffect(() => {
    updateRateVaultUserData();
  }, [updateRateVaultUserData]);

  useEffect(() => {
    updateRateVaultEpochData();
  }, [updateRateVaultEpochData]);

  return {
    rateVaultData,
    rateVaultEpochData,
    rateVaultUserData,
    selectedEpoch,
    updateRateVaultEpochData,
    updateRateVaultUserData,
    setSelectedEpoch,
    setSelectedPoolName,
    selectedPoolName,
  };
};

export const RateVaultProvider = (props: {
  children:
    | string
    | number
    | boolean
    | ReactElement
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  const contextValue = RateVault();

  return (
    // @ts-ignore TODO: FIX
    <RateVaultContext.Provider value={contextValue}>
      {props.children}
    </RateVaultContext.Provider>
  );
};
