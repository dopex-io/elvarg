const DopexFeeStrategyAbi = [
  {
    inputs: [{ internalType: 'address', name: '_gov', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'Forbidden', type: 'error' },
  { inputs: [], name: 'MaxDiscountFeeBpsExceeded', type: 'error' },
  { inputs: [], name: 'MaxFeeBpsExceeded', type: 'error' },
  { inputs: [], name: 'ZeroAddressInput', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_feeType',
        type: 'uint256',
      },
      {
        components: [
          { internalType: 'uint256', name: 'feeBps', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'maxDiscountFeeBps',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct DopexFeeStrategy.FeeType',
        name: '_feeTypeBps',
        type: 'tuple',
      },
    ],
    name: 'FeeTypeBpsSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newGov',
        type: 'address',
      },
    ],
    name: 'GovSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_minFeeBps',
        type: 'uint256',
      },
    ],
    name: 'MinFeeBpsSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_feeBps',
        type: 'uint256',
      },
    ],
    name: 'TokenDiscountBpsSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'FEE_BPS_PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_feeType', type: 'uint256' }],
    name: 'getFeeBps',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'feeBps', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'maxDiscountFeeBps',
            type: 'uint256',
          },
        ],
        internalType: 'struct DopexFeeStrategy.FeeType',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_feeType', type: 'uint256' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'bool', name: '_useDiscount', type: 'bool' },
    ],
    name: 'getFeeBps',
    outputs: [{ internalType: 'uint256', name: '_feeBps', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_feeType', type: 'uint256' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'bool', name: '_useDiscount', type: 'bool' },
    ],
    name: 'getFeeBps',
    outputs: [{ internalType: 'uint256', name: '_feeBps', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gov',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_key', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'feeBps', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'maxDiscountFeeBps',
            type: 'uint256',
          },
        ],
        internalType: 'struct DopexFeeStrategy.FeeType',
        name: '_feeType',
        type: 'tuple',
      },
    ],
    name: 'setFeeTypes',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_gov', type: 'address' }],
    name: 'setGov',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_contract', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
          { internalType: 'uint256', name: 'decimals', type: 'uint256' },
          { internalType: 'uint256', name: 'maxBalance', type: 'uint256' },
          { internalType: 'uint256', name: 'discountBps', type: 'uint256' },
        ],
        internalType: 'struct DopexFeeStrategy.DiscountType[]',
        name: '_discounts',
        type: 'tuple[]',
      },
    ],
    name: 'setVaultDiscount',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'vaultDiscounts',
    outputs: [
      { internalType: 'address', name: 'tokenAddress', type: 'address' },
      { internalType: 'uint256', name: 'decimals', type: 'uint256' },
      { internalType: 'uint256', name: 'maxBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'discountBps', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export default DopexFeeStrategyAbi;
