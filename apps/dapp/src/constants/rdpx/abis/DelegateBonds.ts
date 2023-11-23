const DelegateBonds = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fees',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'delegateId',
        type: 'uint256',
      },
      { indexed: false, internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'LogAddToDelegate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256[]',
            name: 'delegateReceiptTokenAmount',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'bondAmountForUser',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'wethRequired',
            type: 'uint256[]',
          },
          { internalType: 'uint256', name: 'rdpxRequired', type: 'uint256' },
        ],
        indexed: false,
        internalType: 'struct DelegationController.BondWithDelegateReturnValue',
        name: 'returnValue',
        type: 'tuple',
      },
    ],
    name: 'LogBondWithDelegate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'delegateId',
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
        name: 'wethRequired',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'delegateAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'position',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
    ],
    name: 'LogDelegateBond',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'delegateId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'LogDelegateWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'delegateId',
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
        name: 'rdpxRequired',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'position',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiry',
        type: 'uint256',
      },
    ],
    name: 'LogDelegateeBond',
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
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
    ],
    name: 'LogEmergencyWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'position',
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
    ],
    name: 'LogRedeem',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'delegationFeePercentage',
        type: 'uint256',
      },
    ],
    name: 'LogSetDelegationFeePercentage',
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
    name: 'PAUSER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_fee', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'addToDelegate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_delegateIds', type: 'uint256[]' },
      { internalType: 'uint256', name: 'rdpxBondId', type: 'uint256' },
    ],
    name: 'bondWithDelegate',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256[]',
            name: 'delegateReceiptTokenAmount',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'bondAmountForUser',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'wethRequired',
            type: 'uint256[]',
          },
          { internalType: 'uint256', name: 'rdpxRequired', type: 'uint256' },
        ],
        internalType: 'struct DelegationController.BondWithDelegateReturnValue',
        name: 'returnValue',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectDelegateFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'delegates',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'fee', type: 'uint256' },
      { internalType: 'uint256', name: 'activeCollateral', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'delegationFeePercentage',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address[]', name: 'tokens', type: 'address[]' }],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_delegateId', type: 'uint256' }],
    name: 'getDelegatePosition',
    outputs: [
      { internalType: 'address', name: 'delegate', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'fee', type: 'uint256' },
      { internalType: 'uint256', name: 'activeCollateral', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDelegatesLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
      { internalType: 'address', name: '_weth', type: 'address' },
      { internalType: 'address', name: '_rdpx', type: 'address' },
      { internalType: 'address', name: '_rdpxV2Core', type: 'address' },
      { internalType: 'address', name: '_rdpxDecayingBonds', type: 'address' },
      { internalType: 'address', name: '_receiptToken', type: 'address' },
      { internalType: 'address', name: '_rdpxV2Bond', type: 'address' },
    ],
    name: 'initalize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'positions', type: 'uint256[]' },
    ],
    name: 'multiRedeem',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'rdpx',
    outputs: [
      { internalType: 'contract IERC20WithBurn', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rdpxDecayingBonds',
    outputs: [
      {
        internalType: 'contract IRdpxDecayingBonds',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rdpxV2Bond',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rdpxV2Core',
    outputs: [
      { internalType: 'contract IRdpxV2Core', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'receiptToken',
    outputs: [
      { internalType: 'contract IERC20WithBurn', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'receiptTokens',
    outputs: [
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'bondId', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'pos', type: 'uint256' }],
    name: 'redeem',
    outputs: [
      { internalType: 'uint256', name: 'receiptTokenAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'redeemed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_delegationFeePercentage',
        type: 'uint256',
      },
    ],
    name: 'setDelegationFeePercentage',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'totalDelegateFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
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
    name: 'weth',
    outputs: [
      { internalType: 'contract IERC20WithBurn', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'delegateId', type: 'uint256' }],
    name: 'withdraw',
    outputs: [
      { internalType: 'uint256', name: 'amountWithdrawn', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default DelegateBonds;
