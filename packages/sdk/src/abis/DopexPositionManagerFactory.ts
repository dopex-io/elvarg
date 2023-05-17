const DopexPositionManagerFactoryAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'AddressNotContract', type: 'error' },
  { inputs: [], name: 'CallbackNotSet', type: 'error' },
  { inputs: [], name: 'ContractAlreadyWhitelisted', type: 'error' },
  { inputs: [], name: 'ContractNotWhitelisted', type: 'error' },
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
        internalType: 'address',
        name: '_callback',
        type: 'address',
      },
    ],
    name: 'CallbackSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_positionManager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_callback',
        type: 'address',
      },
    ],
    name: 'CallbackSetPositionManager',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_slippageBps',
        type: 'uint256',
      },
    ],
    name: 'MinSlippageBpsSet',
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
        name: '_positionManager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_callback',
        type: 'address',
      },
    ],
    name: 'PositionManagerCallbackSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_positionManager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_referralCode',
        type: 'bytes32',
      },
    ],
    name: 'PositionManagerReferralCodeSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_positionManager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_strategyController',
        type: 'address',
      },
    ],
    name: 'PositionManagerStrategyControllerSet',
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
    inputs: [],
    name: 'DopexPositionManagerImplementation',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
    name: 'callback',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'createPositionmanager',
    outputs: [
      { internalType: 'address', name: 'positionManager', type: 'address' },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'minSlipageBps',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    inputs: [{ internalType: 'address', name: '_callback', type: 'address' }],
    name: 'setCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_slippageBps', type: 'uint256' },
    ],
    name: 'setMinSlippageBps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_callback', type: 'address' },
    ],
    name: 'setPositionManagerCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'bytes32', name: '_referralCode', type: 'bytes32' },
    ],
    name: 'setPositionManagerReferralCode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_strategyController', type: 'address' },
    ],
    name: 'setPositionManagerStrategyController',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userPositionManagers',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
];
export default DopexPositionManagerFactoryAbi;
