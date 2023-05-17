const AtlanticStraddleV2Abi = [
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'errorCode', type: 'uint256' }],
    name: 'DopexError',
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
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
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
        name: 'amount',
        type: 'uint256',
      },
      { indexed: false, internalType: 'bool', name: 'rollover', type: 'bool' },
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
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
        name: 'caller',
        type: 'address',
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
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'EpochPreExpired',
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
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'straddleId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    name: 'Purchase',
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
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'usd', type: 'address' },
          { internalType: 'address', name: 'underlying', type: 'address' },
          { internalType: 'address', name: 'priceOracle', type: 'address' },
          {
            internalType: 'address',
            name: 'volatilityOracle',
            type: 'address',
          },
          { internalType: 'address', name: 'optionPricing', type: 'address' },
          { internalType: 'address', name: 'feeDistributor', type: 'address' },
          {
            internalType: 'address',
            name: 'aggregationRouterV5',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'rewardDistributor',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct AtlanticStraddleV2.Addresses',
        name: 'addresses',
        type: 'tuple',
      },
    ],
    name: 'SetAddresses',
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
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      { indexed: false, internalType: 'bool', name: 'increase', type: 'bool' },
    ],
    name: 'SetRouterAllowance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'purchaseFeePercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'settlementFeePercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'delegationFeePercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxDelegationFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'apFundingPercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pnlSlippagePercent',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'maxPriceImpact', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'blackoutPeriodBeforeExpiry',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct AtlanticStraddleV2.VaultVariables',
        name: 'vaultVariables',
        type: 'tuple',
      },
    ],
    name: 'SetVaultVariables',
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
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'pnl', type: 'uint256' },
    ],
    name: 'Settle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'bool', name: 'rollover', type: 'bool' },
    ],
    name: 'ToggleRollover',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
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
        name: 'epoch',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'pnl', type: 'uint256' },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'AMOUNT_PRICE_TO_USDC_DECIMALS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MANAGER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_DEPOSIT_AMOUNT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_PURCHASE_AMOUNT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PERCENT_PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SECONDS_A_YEAR',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDC_DECIMALS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
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
    name: 'addresses',
    outputs: [
      { internalType: 'address', name: 'usd', type: 'address' },
      { internalType: 'address', name: 'underlying', type: 'address' },
      { internalType: 'address', name: 'priceOracle', type: 'address' },
      { internalType: 'address', name: 'volatilityOracle', type: 'address' },
      { internalType: 'address', name: 'optionPricing', type: 'address' },
      { internalType: 'address', name: 'feeDistributor', type: 'address' },
      { internalType: 'address', name: 'aggregationRouterV5', type: 'address' },
      { internalType: 'address', name: 'rewardDistributor', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'expiry', type: 'uint256' }],
    name: 'bootstrap',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_price', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_timeToExpiry', type: 'uint256' },
    ],
    name: 'calculateApFunding',
    outputs: [{ internalType: 'uint256', name: 'funding', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: '_isPut', type: 'bool' },
      { internalType: 'uint256', name: '_price', type: 'uint256' },
      { internalType: 'uint256', name: '_strike', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_expiry', type: 'uint256' },
    ],
    name: 'calculatePremium',
    outputs: [{ internalType: 'uint256', name: 'premium', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'calculateStraddlePositionPnl',
    outputs: [{ internalType: 'uint256', name: 'buyerPnl', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'calculateWritePositionPnl',
    outputs: [
      { internalType: 'uint256', name: 'writePositionPnl', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentEpoch',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bool', name: 'shouldRollover', type: 'bool' },
      { internalType: 'address', name: 'user', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
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
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'epochData',
    outputs: [
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'uint256', name: 'usdDeposits', type: 'uint256' },
      { internalType: 'uint256', name: 'activeUsdDeposits', type: 'uint256' },
      { internalType: 'uint256', name: 'settlementPrice', type: 'uint256' },
      { internalType: 'uint256', name: 'underlyingSwapped', type: 'uint256' },
      { internalType: 'uint256', name: 'underlyingPurchased', type: 'uint256' },
      { internalType: 'uint256', name: 'usdPremiums', type: 'uint256' },
      { internalType: 'uint256', name: 'usdFunding', type: 'uint256' },
      { internalType: 'uint256', name: 'totalSold', type: 'uint256' },
      { internalType: 'uint256', name: 'straddleCounter', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'finalUsdBalanceBeforeWithdraw',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'epochStatus',
    outputs: [
      {
        internalType: 'enum AtlanticStraddleV2.EpochStatus',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'expireEpoch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnderlyingPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_strike', type: 'uint256' }],
    name: 'getVolatility',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
    inputs: [{ internalType: 'uint256[]', name: 'ids', type: 'uint256[]' }],
    name: 'multirollover',
    outputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'ids', type: 'uint256[]' }],
    name: 'multisettle',
    outputs: [{ internalType: 'uint256[]', name: 'pnls', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'underlyingToSwapToUsd',
        type: 'uint256',
      },
      { internalType: 'uint256', name: 'minAmountOut', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'swapId', type: 'uint256' },
          {
            components: [
              { internalType: 'address', name: 'srcToken', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
              { internalType: 'uint256[]', name: 'pools', type: 'uint256[]' },
            ],
            internalType: 'struct I1inchRouterV5.UnoswapParams',
            name: 'unoswapParams',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
              { internalType: 'uint256[]', name: 'pools', type: 'uint256[]' },
            ],
            internalType: 'struct I1inchRouterV5.UniswapV3Params',
            name: 'uniswapV3Params',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract IAggregationExecutor',
                name: 'executor',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'srcToken',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'dstToken',
                    type: 'address',
                  },
                  {
                    internalType: 'address payable',
                    name: 'srcReceiver',
                    type: 'address',
                  },
                  {
                    internalType: 'address payable',
                    name: 'dstReceiver',
                    type: 'address',
                  },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                  {
                    internalType: 'uint256',
                    name: 'minReturnAmount',
                    type: 'uint256',
                  },
                  { internalType: 'uint256', name: 'flags', type: 'uint256' },
                ],
                internalType: 'struct SwapDescription',
                name: 'desc',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'permit', type: 'bytes' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct I1inchRouterV5.SwapParams',
            name: 'swapParams',
            type: 'tuple',
          },
        ],
        internalType: 'struct AtlanticStraddleV2.PurchaseParams',
        name: 'purchaseParams',
        type: 'tuple',
      },
    ],
    name: 'preExpireEpoch',
    outputs: [
      { internalType: 'uint256', name: 'usdObtained', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minAmountOut', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      {
        components: [
          { internalType: 'uint256', name: 'swapId', type: 'uint256' },
          {
            components: [
              { internalType: 'address', name: 'srcToken', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
              { internalType: 'uint256[]', name: 'pools', type: 'uint256[]' },
            ],
            internalType: 'struct I1inchRouterV5.UnoswapParams',
            name: 'unoswapParams',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
              { internalType: 'uint256[]', name: 'pools', type: 'uint256[]' },
            ],
            internalType: 'struct I1inchRouterV5.UniswapV3Params',
            name: 'uniswapV3Params',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract IAggregationExecutor',
                name: 'executor',
                type: 'address',
              },
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'srcToken',
                    type: 'address',
                  },
                  {
                    internalType: 'address',
                    name: 'dstToken',
                    type: 'address',
                  },
                  {
                    internalType: 'address payable',
                    name: 'srcReceiver',
                    type: 'address',
                  },
                  {
                    internalType: 'address payable',
                    name: 'dstReceiver',
                    type: 'address',
                  },
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                  {
                    internalType: 'uint256',
                    name: 'minReturnAmount',
                    type: 'uint256',
                  },
                  { internalType: 'uint256', name: 'flags', type: 'uint256' },
                ],
                internalType: 'struct SwapDescription',
                name: 'desc',
                type: 'tuple',
              },
              { internalType: 'bytes', name: 'permit', type: 'bytes' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct I1inchRouterV5.SwapParams',
            name: 'swapParams',
            type: 'tuple',
          },
        ],
        internalType: 'struct AtlanticStraddleV2.PurchaseParams',
        name: 'purchaseParams',
        type: 'tuple',
      },
    ],
    name: 'purchase',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'protocolFee', type: 'uint256' },
      { internalType: 'uint256', name: 'straddleCost', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'rollover',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'usd', type: 'address' },
          { internalType: 'address', name: 'underlying', type: 'address' },
          { internalType: 'address', name: 'priceOracle', type: 'address' },
          {
            internalType: 'address',
            name: 'volatilityOracle',
            type: 'address',
          },
          { internalType: 'address', name: 'optionPricing', type: 'address' },
          { internalType: 'address', name: 'feeDistributor', type: 'address' },
          {
            internalType: 'address',
            name: 'aggregationRouterV5',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'rewardDistributor',
            type: 'address',
          },
        ],
        internalType: 'struct AtlanticStraddleV2.Addresses',
        name: '_addresses',
        type: 'tuple',
      },
    ],
    name: 'setAddresses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
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
            name: 'purchaseFeePercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'settlementFeePercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'delegationFeePercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxDelegationFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'apFundingPercent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pnlSlippagePercent',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'maxPriceImpact', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'blackoutPeriodBeforeExpiry',
            type: 'uint256',
          },
        ],
        internalType: 'struct AtlanticStraddleV2.VaultVariables',
        name: '_vaultVariables',
        type: 'tuple',
      },
    ],
    name: 'setFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_value', type: 'uint256' },
      { internalType: 'bool', name: '_increase', type: 'bool' },
    ],
    name: 'setRouterAllowance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'settle',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'straddlePositions',
    outputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'apStrike', type: 'uint256' },
      { internalType: 'uint256', name: 'underlyingPurchased', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'straddlePositionsOfOwner',
    outputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'toggleRollover',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
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
    inputs: [],
    name: 'vaultVariables',
    outputs: [
      { internalType: 'uint256', name: 'purchaseFeePercent', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'settlementFeePercent',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'delegationFeePercent',
        type: 'uint256',
      },
      { internalType: 'uint256', name: 'maxDelegationFee', type: 'uint256' },
      { internalType: 'uint256', name: 'apFundingPercent', type: 'uint256' },
      { internalType: 'uint256', name: 'pnlSlippagePercent', type: 'uint256' },
      { internalType: 'uint256', name: 'maxPriceImpact', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'blackoutPeriodBeforeExpiry',
        type: 'uint256',
      },
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
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'withdraw',
    outputs: [
      { internalType: 'uint256', name: 'writePositionPnl', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'writePositions',
    outputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'uint256', name: 'usdDeposit', type: 'uint256' },
      { internalType: 'bool', name: 'rollover', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'writePositionsOfOwner',
    outputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export default AtlanticStraddleV2Abi;
