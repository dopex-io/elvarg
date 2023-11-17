const DopexV2OptionMarket = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pm',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_optionPricing',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_dpFee',
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
        internalType: 'address',
        name: '_primePool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__ArrayLenMismatch',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__IVNotSet',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__InvalidPool',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__MaxCostAllowanceExceeded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__NotApprovedSettler',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__NotEnoughAfterSwap',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__NotIVSetter',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__NotOwnerOrDelegator',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__NotValidStrikeTick',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__OptionExpired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__OptionNotExpired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DopexV2OptionMarket__PoolNotApproved',
    type: 'error',
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
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
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
        internalType: 'address',
        name: 'user',
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
        internalType: 'uint256',
        name: 'totalProfit',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalAssetRelocked',
        type: 'uint256',
      },
    ],
    name: 'LogExerciseOption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_setter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'LogIVSetterUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'ttl',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'iv',
        type: 'uint256[]',
      },
    ],
    name: 'LogIVUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
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
        internalType: 'bool',
        name: 'isCall',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'premiumAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalAssetWithdrawn',
        type: 'uint256',
      },
    ],
    name: 'LogMintOption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'primePool',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'optionPricing',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'dpFee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'callAsset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'putAsset',
        type: 'address',
      },
    ],
    name: 'LogOptionsMarketInitialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'LogSettleOption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
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
        internalType: 'uint256',
        name: 'newTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'LogSplitOption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokeURIFetcher',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'dpFee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'optionPricing',
        type: 'address',
      },
    ],
    name: 'LogUpdateAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'delegate',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'status',
        type: 'bool',
      },
    ],
    name: 'LogUpdateExerciseDelegate',
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
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
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
    name: 'approvedPools',
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
        name: 'owner',
        type: 'address',
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
    name: 'callAssetDecimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dpFee',
    outputs: [
      {
        internalType: 'contract IDopexV2ClammFeeStrategy',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'exerciseDelegator',
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
            internalType: 'contract ISwapper[]',
            name: 'swapper',
            type: 'address[]',
          },
          {
            internalType: 'bytes[]',
            name: 'swapData',
            type: 'bytes[]',
          },
          {
            internalType: 'uint256[]',
            name: 'liquidityToExercise',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct DopexV2OptionMarket.ExerciseOptionParams',
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
    inputs: [],
    name: 'feeTo',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
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
        internalType: 'contract IUniswapV3Pool',
        name: '_pool',
        type: 'address',
      },
    ],
    name: 'getCurrentPricePerCallAsset',
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
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'iv',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'premium',
        type: 'uint256',
      },
    ],
    name: 'getFee',
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
        name: 'owner',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'ivSetter',
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
            components: [
              {
                internalType: 'contract IHandler',
                name: '_handler',
                type: 'address',
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
            ],
            internalType: 'struct DopexV2OptionMarket.OptionTicks[]',
            name: 'optionTicks',
            type: 'tuple[]',
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
            name: 'ttl',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isCall',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'maxCostAllowance',
            type: 'uint256',
          },
        ],
        internalType: 'struct DopexV2OptionMarket.OptionParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'mintOption',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'opData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'opTickArrayLen',
        type: 'uint256',
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
        name: 'isCall',
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
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'opTickMap',
    outputs: [
      {
        internalType: 'contract IHandler',
        name: '_handler',
        type: 'address',
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
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'optionIds',
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
    name: 'optionPricing',
    outputs: [
      {
        internalType: 'contract IOptionPricing',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
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
    name: 'positionManager',
    outputs: [
      {
        internalType: 'contract IDopexV2PositionManager',
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
        components: [
          {
            internalType: 'uint256',
            name: 'optionId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256[]',
            name: 'liquidityToSplit',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct DopexV2OptionMarket.PositionSplitterParams',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'positionSplitter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'primePool',
    outputs: [
      {
        internalType: 'contract IUniswapV3Pool',
        name: '',
        type: 'address',
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
    inputs: [],
    name: 'putAssetDecimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
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
        name: 'tokenId',
        type: 'uint256',
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
        name: 'tokenId',
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
            internalType: 'contract ISwapper[]',
            name: 'swapper',
            type: 'address[]',
          },
          {
            internalType: 'bytes[]',
            name: 'swapData',
            type: 'bytes[]',
          },
          {
            internalType: 'uint256[]',
            name: 'liquidityToSettle',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct DopexV2OptionMarket.SettleOptionParams',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'settlers',
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
    inputs: [],
    name: 'symbol',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
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
    name: 'tokenURIFetcher',
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
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'ttlToVol',
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
        name: '_feeTo',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokeURIFetcher',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_dpFee',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_optionPricing',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_settler',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_statusSettler',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: '_pool',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_statusPools',
        type: 'bool',
      },
    ],
    name: 'updateAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_delegateTo',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'updateExerciseDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_setter',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'updateIVSetter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_ttls',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_ttlIV',
        type: 'uint256[]',
      },
    ],
    name: 'updateIVs',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
export default DopexV2OptionMarket;
