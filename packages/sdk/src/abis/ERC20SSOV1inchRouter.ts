const ERC20SSOV1inchRouterAbi = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_aggregationRouterV4Address',
        type: 'address',
      },
      { internalType: 'address', name: '_wethAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'aggregationRouterV4',
    outputs: [
      {
        internalType: 'contract I1inchAggregationRouterV4',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_ssovAddress', type: 'address' },
      { internalType: 'address', name: '_ssovTokenAddress', type: 'address' },
      { internalType: 'address', name: '_caller', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'srcToken', type: 'address' },
          { internalType: 'address', name: 'dstToken', type: 'address' },
          { internalType: 'address', name: 'srcReceiver', type: 'address' },
          { internalType: 'address', name: 'dstReceiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
          { internalType: 'bytes', name: 'permit', type: 'bytes' },
        ],
        internalType: 'struct I1inchAggregationRouterV4.SwapDescription',
        name: '_desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
      { internalType: 'uint256', name: '_strikeIndex', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'swapAndDeposit',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_ssovAddress', type: 'address' },
      { internalType: 'address', name: '_ssovTokenAddress', type: 'address' },
      { internalType: 'address', name: '_caller', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'srcToken', type: 'address' },
          { internalType: 'address', name: 'dstToken', type: 'address' },
          { internalType: 'address', name: 'srcReceiver', type: 'address' },
          { internalType: 'address', name: 'dstReceiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
          { internalType: 'bytes', name: 'permit', type: 'bytes' },
        ],
        internalType: 'struct I1inchAggregationRouterV4.SwapDescription',
        name: '_desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
      { internalType: 'uint256[]', name: '_strikeIndices', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'swapAndDepositMultiple',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_ssovAddress', type: 'address' },
      { internalType: 'address', name: '_ssovTokenAddress', type: 'address' },
      { internalType: 'address', name: '_caller', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'srcToken', type: 'address' },
          { internalType: 'address', name: 'dstToken', type: 'address' },
          { internalType: 'address', name: 'srcReceiver', type: 'address' },
          { internalType: 'address', name: 'dstReceiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
          { internalType: 'bytes', name: 'permit', type: 'bytes' },
        ],
        internalType: 'struct I1inchAggregationRouterV4.SwapDescription',
        name: '_desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
      {
        components: [
          { internalType: 'uint256', name: 'strikeIndex', type: 'uint256' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
        ],
        internalType: 'struct ERC20SSOV1inchRouter.PurchaseOption',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'swapAndPurchase',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_ssovAddress', type: 'address' },
      { internalType: 'address', name: '_ssovTokenAddress', type: 'address' },
      { internalType: 'address', name: '_caller', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'srcToken', type: 'address' },
          { internalType: 'address', name: 'dstToken', type: 'address' },
          { internalType: 'address', name: 'srcReceiver', type: 'address' },
          { internalType: 'address', name: 'dstReceiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
          { internalType: 'bytes', name: 'permit', type: 'bytes' },
        ],
        internalType: 'struct I1inchAggregationRouterV4.SwapDescription',
        name: '_desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
      { internalType: 'uint256', name: '_strikeIndex', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'swapNativeAndDeposit',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_ssovAddress', type: 'address' },
      { internalType: 'address', name: '_ssovTokenAddress', type: 'address' },
      { internalType: 'address', name: '_caller', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'srcToken', type: 'address' },
          { internalType: 'address', name: 'dstToken', type: 'address' },
          { internalType: 'address', name: 'srcReceiver', type: 'address' },
          { internalType: 'address', name: 'dstReceiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
          { internalType: 'bytes', name: 'permit', type: 'bytes' },
        ],
        internalType: 'struct I1inchAggregationRouterV4.SwapDescription',
        name: '_desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
      { internalType: 'uint256[]', name: '_strikeIndices', type: 'uint256[]' },
      { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'swapNativeAndDepositMultiple',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_ssovAddress', type: 'address' },
      { internalType: 'address', name: '_ssovTokenAddress', type: 'address' },
      { internalType: 'address', name: '_caller', type: 'address' },
      {
        components: [
          { internalType: 'address', name: 'srcToken', type: 'address' },
          { internalType: 'address', name: 'dstToken', type: 'address' },
          { internalType: 'address', name: 'srcReceiver', type: 'address' },
          { internalType: 'address', name: 'dstReceiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
          { internalType: 'bytes', name: 'permit', type: 'bytes' },
        ],
        internalType: 'struct I1inchAggregationRouterV4.SwapDescription',
        name: '_desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
      {
        components: [
          { internalType: 'uint256', name: 'strikeIndex', type: 'uint256' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
        ],
        internalType: 'struct ERC20SSOV1inchRouter.PurchaseOption',
        name: '_params',
        type: 'tuple',
      },
    ],
    name: 'swapNativeAndPurchase',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wrappedNativeToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
export default ERC20SSOV1inchRouterAbi;
