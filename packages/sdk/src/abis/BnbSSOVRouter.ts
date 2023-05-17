const BnbSSOVRouterAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_ssov', type: 'address' },
      { internalType: 'address', name: '_vbnb', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_strikeIndex', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: '_strikeIndices', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'depositMultiple',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_strikeIndex', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'purchase',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ssov',
    outputs: [
      { internalType: 'contract IERC20SSOV', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vbnb',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
export default BnbSSOVRouterAbi;
