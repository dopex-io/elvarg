const OptionPricingCustomAbi = [
  {
    inputs: [{ internalType: 'address', name: '_dopex', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: '_delegatedEntity', type: 'address' },
    ],
    name: 'addDelegatedEntity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'delegatedEntities',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dopex',
    outputs: [{ internalType: 'contract Dopex', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'optionPool', type: 'address' },
      { internalType: 'uint256', name: 'strike', type: 'uint256' },
      { internalType: 'uint256', name: 'lastPrice', type: 'uint256' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'bool', name: 'isPut', type: 'bool' },
    ],
    name: 'getIV',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: 'isPut', type: 'bool' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'uint256', name: 'strike', type: 'uint256' },
      { internalType: 'address', name: 'optionPool', type: 'address' },
    ],
    name: 'getOptionPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'optionPoolVars',
    outputs: [
      { internalType: 'uint256', name: 'ivCap', type: 'uint256' },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'callCurveMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'putCurveMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'callGrowthMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'putGrowthMultiplier',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPricingCustom.Multipliers',
        name: 'multipliers',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_optionPool', type: 'address' },
      {
        internalType: 'uint256',
        name: '_callCurveMultiplier',
        type: 'uint256',
      },
      { internalType: 'uint256', name: '_putCurveMultiplier', type: 'uint256' },
      {
        internalType: 'uint256',
        name: '_callGrowthMultiplier',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_putGrowthMultiplier',
        type: 'uint256',
      },
    ],
    name: 'propose',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'proposedQuotes',
    outputs: [
      { internalType: 'uint256', name: 'lastUpdated', type: 'uint256' },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'callCurveMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'putCurveMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'callGrowthMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'putGrowthMultiplier',
            type: 'uint256',
          },
        ],
        internalType: 'struct OptionPricingCustom.Multipliers',
        name: 'multipliers',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_delegatedEntity', type: 'address' },
    ],
    name: 'removeDelegatedEntity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strikePrecision',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'timeThreshold',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_optionPool', type: 'address' },
      { internalType: 'uint256', name: '_ivCap', type: 'uint256' },
    ],
    name: 'updateIVCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
export default OptionPricingCustomAbi;
