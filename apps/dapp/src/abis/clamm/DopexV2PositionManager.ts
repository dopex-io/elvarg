const DopexV2PositionManager = [
  {
    inputs: [],
    name: 'DopexV2PositionManager__NotWhitelistedApp',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2PositionManager__NotWhitelistedHandler',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
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
        name: 'sharesBurned',
        type: 'uint256',
      },
    ],
    name: 'LogBurnPosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidityDonated',
        type: 'uint256',
      },
    ],
    name: 'LogDonation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
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
        name: 'sharesMinted',
        type: 'uint256',
      },
    ],
    name: 'LogMintPosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidityUnused',
        type: 'uint256',
      },
    ],
    name: 'LogUnusePosition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'LogUpdateWhitelistHandler',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_app',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'LogUpdateWhitelistHandlerWithApp',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidityUsed',
        type: 'uint256',
      },
    ],
    name: 'LogUsePosition',
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
    inputs: [
      {
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_burnPositionData',
        type: 'bytes',
      },
    ],
    name: 'burnPosition',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sharesBurned',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_donatePosition',
        type: 'bytes',
      },
    ],
    name: 'donateToPosition',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_mintPositionData',
        type: 'bytes',
      },
    ],
    name: 'mintPosition',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sharesMinted',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
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
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_unusePositionData',
        type: 'bytes',
      },
    ],
    name: 'unusePosition',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
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
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'updateWhitelistHandler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_app',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'updateWhitelistHandlerWithApp',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_usePositionData',
        type: 'bytes',
      },
    ],
    name: 'usePosition',
    outputs: [
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'liquidityUsed',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'whitelistedHandlers',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'whitelistedHandlersWithApp',
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
] as const;

export default DopexV2PositionManager;
