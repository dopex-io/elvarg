import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  ERC20,
  VolatilityOracle,
  SSOVOptionPricing,
  IRVault__factory,
} from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';

import { WalletContext } from './Wallet';

const abi = [
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
    inputs: [],
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'strikeIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'callLeverageIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'putLeverageIndex',
        type: 'uint256',
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
    name: 'deposit',
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
        name: 'settlementPrice',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'settlementPrice',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'strikeIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'callLeverageIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'putLeverageIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: 'userCrvLpWithdrawAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rewards',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
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
        name: 'settlementPrice',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'epoch',
        type: 'uint256',
      },
    ],
    name: 'getEpochCallsData',
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
    name: 'getEpochPutsData',
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
    name: 'getEpochStrikeData',
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
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'getMonthlyExpiryFromTimestamp',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUsdPrice',
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
        name: 'epochStartTimes',
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
        name: 'settlementPrice',
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
];

export interface RateVault {
  token?: string;
}
export interface RateVaultSigner {
  token: ERC20[];
  rateVaultContractWithSigner?: any;
}

export interface RateVaultData {
  rateVaultContract?: any;
  currentEpoch?: number;
  rateVaultOptionPricingContract?: SSOVOptionPricing;
  volatilityOracleContract?: VolatilityOracle;
}

export interface RateVaultEpochData {
  totalCallsPurchased: BigNumber;
  totalPutsPurchased: BigNumber;
  totalCallsDeposits: BigNumber;
  totalPutsDeposits: BigNumber;
  totalTokenDeposits: BigNumber;
  epochCallsPremium: BigNumber;
  epochPutsPremium: BigNumber;
  epochStartTimes: BigNumber;
  epochEndTimes: BigNumber;
  isEpochExpired: boolean;
  isVaultReady: boolean;
  epochBalanceAfterUnstaking: BigNumber;
  crvToDistribute: BigNumber;
  settlementPrice: BigNumber;
  epochStrikes: BigNumber[];
  epochCallsStrikeTokens: string[];
  epochPutsStrikeTokens: string[];
}

export interface RateVaultUserData {
  userEpochStrikeDeposits: {
    amount: BigNumber;
    callLeverage: BigNumber;
    putLeverage: BigNumber;
  }[];
  userStrikePurchaseData: {
    putsPurchased: BigNumber;
    callsPurchased: BigNumber;
    userEpochCallsPremium: BigNumber;
    userEpochPutsPremium: BigNumber;
  }[];
}

interface RateVaultContextInterface {
  rateVaultData?: RateVaultData;
  rateVaultEpochData?: RateVaultEpochData;
  rateVaultUserData?: RateVaultUserData;
  rateVaultSigner: RateVaultSigner;
  selectedEpoch?: number;
  updateRateVaultEpochData?: Function;
  updateRateVaultUserData?: Function;
  setSelectedEpoch?: Function;
}

const initialRateVaultUserData = {
  userEpochStrikeDeposits: [],
  userStrikePurchaseData: [],
};

const initialRateVaultSigner = {
  token: null,
  rateVaultContractWithSigner: null,
};

export const RateVaultContext = createContext<RateVaultContextInterface>({
  rateVaultUserData: initialRateVaultUserData,
  rateVaultSigner: initialRateVaultSigner,
});

export const RateVault = () => {
  const { accountAddress, contractAddresses, provider, signer } =
    useContext(WalletContext);

  const [selectedEpoch, setSelectedEpoch] = useState<number | null>(null);
  const [rateVaultData, setRateVaultData] = useState<RateVaultData>();
  const [rateVaultEpochData, setRateVaultEpochData] =
    useState<RateVaultEpochData>();
  const [rateVaultUserData, setRateVaultUserData] =
    useState<RateVaultUserData>();
  const [rateVaultSigner, setRateVaultSigner] = useState<RateVaultSigner>({
    token: [],
    rateVaultContractWithSigner: null,
  });

  const updateRateVaultUserData = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !selectedEpoch) return;

    if (!contractAddresses['Vaults']['IR']) return;

    const rateVaultAddresses = contractAddresses['Vaults']['IR'];

    if (!rateVaultAddresses) return;

    const rateVaultContract = new ethers.Contract(
      contractAddresses['Vaults']['IR'],
      abi,
      signer
    );

    const identifier =
      '0x2230786638383063363635353738616536613164313131613339396638626563'; // TODO: implement

    const depositsData = await rateVaultContract.userEpochStrikeDeposits(
      selectedEpoch,
      identifier
    );
    const purchaseData = await rateVaultContract.userStrikePurchaseData(
      selectedEpoch,
      identifier
    );

    setRateVaultUserData({
      userEpochStrikeDeposits: [],
      userStrikePurchaseData: [],
    });
  }, [accountAddress, contractAddresses, provider, selectedEpoch]);

  const updateRateVaultEpochData = useCallback(async () => {
    if (!contractAddresses || !selectedEpoch) return;

    if (!contractAddresses['Vaults']['IR']) return;

    const rateVaultAddresses = contractAddresses['Vaults']['IR'];

    if (!rateVaultAddresses) return;

    const rateVaultContract = new ethers.Contract(
      contractAddresses['Vaults']['IR'],
      abi,
      signer
    );
    const data = await rateVaultContract.totalEpochData(selectedEpoch);
    const times = await rateVaultContract.getEpochTimes(selectedEpoch);
    // const {_epochStrikes, _epochCallsStrikeTokens, _epochPutsStrikeTokens} = await rateVaultContract.getEpochStrikeData(selectedEpoch);
    // ISSUE IN THE SC?

    setRateVaultEpochData({
      totalCallsPurchased: BigNumber.from('0'),
      totalPutsPurchased: BigNumber.from('0'),
      totalCallsDeposits: data[0],
      totalPutsDeposits: data[1],
      totalTokenDeposits: data[2],
      epochCallsPremium: data[3],
      epochPutsPremium: data[4],
      epochStartTimes: data[5],
      epochEndTimes: times[1],
      isEpochExpired: data[6],
      isVaultReady: data[7],
      epochBalanceAfterUnstaking: data[8],
      crvToDistribute: data[9],
      settlementPrice: data[10],
      epochStrikes: [
        BigNumber.from('500000000'),
        BigNumber.from('60000000000'),
        BigNumber.from('70000000000'),
      ],
      epochCallsStrikeTokens: [],
      epochPutsStrikeTokens: [],
    });
  }, [contractAddresses, selectedEpoch, provider]);

  useEffect(() => {
    if (!provider || !contractAddresses || !contractAddresses?.Vaults?.IR)
      return;

    async function update() {
      let _rateVaultData: RateVaultData;

      if (!contractAddresses['Vaults']['IR']) return;

      const rateVaultAddresses = contractAddresses['Vaults']['IR'];

      if (!rateVaultAddresses) return;

      const _rateVaultContract = new ethers.Contract(
        contractAddresses['Vaults']['IR'],
        abi,
        signer
      );

      const currentEpoch = await _rateVaultContract.currentEpoch();
      setSelectedEpoch(Number(currentEpoch));

      setRateVaultData({
        currentEpoch: Number(currentEpoch),
      });
    }

    update();
  }, [contractAddresses, provider]);

  useEffect(() => {
    if (!contractAddresses || !signer || !contractAddresses?.Vaults?.IR) return;

    let _rateVaultSigner;

    if (!contractAddresses['Vaults']['IR']) return;

    const _rateVaultContractWithSigner = IRVault__factory.connect(
      contractAddresses['Vaults']['IR'],
      signer
    );

    _rateVaultSigner = {
      rateVaultContractWithSigner: _rateVaultContractWithSigner,
    };

    setRateVaultSigner(_rateVaultSigner);
  }, [contractAddresses, signer, accountAddress]);

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
    rateVaultSigner,
    selectedEpoch,
    updateRateVaultEpochData,
    updateRateVaultUserData,
    setSelectedEpoch,
  };
};

export const RateVaultProvider = (props) => {
  const contextValue = RateVault();

  return (
    <RateVaultContext.Provider value={contextValue}>
      {props.children}
    </RateVaultContext.Provider>
  );
};
