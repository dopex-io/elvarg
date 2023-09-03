export const OptionPoolsAbi = [
  {
    inputs: [
      {
        internalType: 'contract PositionManager',
        name: '_pm',
        type: 'address',
      },
      {
        internalType: 'contract SwapRouter',
        name: '_swapRouter',
        type: 'address',
      },
      {
        internalType: 'contract OptionPricing',
        name: '_optionPricing',
        type: 'address',
      },
      {
        internalType: 'contract VolatilityEngine',
        name: '_volatilityEngine',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_callAsset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_putAsset',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_volatilityEngineId',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'T',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IUniswapV3Pool',
        name: 'pool',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'callOrPut',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToExercise',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'ExerciseOptionRoll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IUniswapV3Pool',
        name: 'pool',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
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
        name: 'options',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'MintCallOptionRoll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IUniswapV3Pool',
        name: 'pool',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
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
        name: 'options',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'MintPutOptionRoll',
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
        internalType: 'contract IUniswapV3Pool',
        name: 'pool',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'callOrPut',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToSettle',
        type: 'uint256',
      },
    ],
    name: 'SettleOptionRoll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
    ],
    name: 'TransferBatch',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'TransferSingle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'value',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'URI',
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
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'balanceOf',
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
        name: 'accounts',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
    ],
    name: 'balanceOfBatch',
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
    inputs: [],
    name: 'callAsset',
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
    name: 'emergencyPause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyUnpause',
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
    ],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'optionId',
            type: 'uint256',
          },
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'amountToExercise',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.ExerciseOptionParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'exerciseOption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'expiry',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'callOrPut',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'amountToExercise',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.ExerciseOptionRollParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'exerciseOptionRoll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: '_pool',
        type: 'address',
      },
    ],
    name: 'getCurrentPricePerCallAsset',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
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
        name: 'expiry',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'strike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseIv',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'getPremiumAmount',
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
        internalType: 'contract IUniswapV3Pool',
        name: '_pool',
        type: 'address',
      },
      {
        internalType: 'int24',
        name: '_tick',
        type: 'int24',
      },
    ],
    name: 'getPricePerCallAssetViaTick',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'callOrPut',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'premium',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiry',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.OptionInfoIds',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'insertOptionInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
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
        components: [
          {
            internalType: 'uint256',
            name: 'optionId',
            type: 'uint256',
          },
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'liquidityToUse',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'premiumAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.MintOptionParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'mintCallOption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'liquidityToUse',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ttl',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.MintOptionRollParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'mintCallOptionRoll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'optionId',
            type: 'uint256',
          },
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'liquidityToUse',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'premiumAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.MintOptionParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'mintPutOption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'liquidityToUse',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ttl',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.MintOptionRollParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'mintPutOptionRoll',
    outputs: [],
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
    name: 'optionInfoIds',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'optionInfos',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'callOrPut',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'premium',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiry',
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
    name: 'putAsset',
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
        name: '_optionId',
        type: 'uint256',
      },
    ],
    name: 'removeOptionInfo',
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
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'optionId',
            type: 'uint256',
          },
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'amountToSettle',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.SettleOptionParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'settleOption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IUniswapV3Pool',
            name: 'pool',
            type: 'address',
          },
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
          {
            internalType: 'uint256',
            name: 'expiry',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'callOrPut',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'amountToSettle',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPools.SettleOptionRollParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'settleOptionRoll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
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
        internalType: 'uint256',
        name: '_minTTL',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxTTL',
        type: 'uint256',
      },
    ],
    name: 'updateMinAndMaxTTL',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'updateMinPremium',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract OptionPricing',
        name: '_op',
        type: 'address',
      },
    ],
    name: 'updateOptionPricing',
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
    name: 'uri',
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
    name: 'volatilityEngineId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default OptionPoolsAbi;