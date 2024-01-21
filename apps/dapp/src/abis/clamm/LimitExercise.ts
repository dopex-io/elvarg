const LimitExercise = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'DEFAULT_ADMIN_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'KEEPER_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ORDER_TYPEHASH',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cancelOrder',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: '_sigMeta',
        type: 'tuple',
        internalType: 'struct LimitExercise.SignatureMeta',
        components: [
          { name: 'v', type: 'uint8', internalType: 'uint8' },
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelledOrders',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'computeDigest',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'eip712Domain',
    inputs: [],
    outputs: [
      { name: 'fields', type: 'bytes1', internalType: 'bytes1' },
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'version', type: 'string', internalType: 'string' },
      { name: 'chainId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'verifyingContract',
        type: 'address',
        internalType: 'address',
      },
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      {
        name: 'extensions',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOrderSigHash',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: '_sigMeta',
        type: 'tuple',
        internalType: 'struct LimitExercise.SignatureMeta',
        components: [
          { name: 'v', type: 'uint8', internalType: 'uint8' },
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getRoleAdmin',
    inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getStructHash',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'grantRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'limitExercise',
    inputs: [
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: '_signatureMeta',
        type: 'tuple',
        internalType: 'struct LimitExercise.SignatureMeta',
        components: [
          { name: 'v', type: 'uint8', internalType: 'uint8' },
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
        ],
      },
      {
        name: '_exerciseParams',
        type: 'tuple',
        internalType: 'struct IOptionMarket.ExerciseOptionParams',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'swapper',
            type: 'address[]',
            internalType: 'contract ISwapper[]',
          },
          {
            name: 'swapData',
            type: 'bytes[]',
            internalType: 'bytes[]',
          },
          {
            name: 'liquidityToExercise',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'executorProfit',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'multicall',
    inputs: [{ name: 'data', type: 'bytes[]', internalType: 'bytes[]' }],
    outputs: [{ name: 'results', type: 'bytes[]', internalType: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'renounceRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'revokeRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'verify',
    inputs: [
      { name: '_signer', type: 'address', internalType: 'address' },
      {
        name: '_order',
        type: 'tuple',
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: '_signatureMeta',
        type: 'tuple',
        internalType: 'struct LimitExercise.SignatureMeta',
        components: [
          { name: 'v', type: 'uint8', internalType: 'uint8' },
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'EIP712DomainChanged',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogLimitExerciseOrderCancelled',
    inputs: [
      {
        name: 'order',
        type: 'tuple',
        indexed: false,
        internalType: 'struct LimitExercise.Order',
        components: [
          {
            name: 'optionId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'minProfit',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'profitToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'optionMarket',
            type: 'address',
            internalType: 'address',
          },
          { name: 'signer', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: 'sigMeta',
        type: 'tuple',
        indexed: false,
        internalType: 'struct LimitExercise.SignatureMeta',
        components: [
          { name: 'v', type: 'uint8', internalType: 'uint8' },
          { name: 'r', type: 'bytes32', internalType: 'bytes32' },
          { name: 's', type: 'bytes32', internalType: 'bytes32' },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleAdminChanged',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'previousAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'newAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleGranted',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleRevoked',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'InvalidShortString', inputs: [] },
  { type: 'error', name: 'LimitExercise__CancelledOrder', inputs: [] },
  { type: 'error', name: 'LimitExercise__NotSigner', inputs: [] },
  {
    type: 'error',
    name: 'StringTooLong',
    inputs: [{ name: 'str', type: 'string', internalType: 'string' }],
  },
] as const;

export default LimitExercise;
