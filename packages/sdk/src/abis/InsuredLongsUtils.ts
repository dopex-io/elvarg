const InsuredLongsUtilsAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_olderOwner',
        type: 'address',
      },
    ],
    name: 'NewOwnerSet',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_collateralToken', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'uint256', name: '_collateralAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_size', type: 'uint256' },
    ],
    name: 'calculateCollateral',
    outputs: [{ internalType: 'uint256', name: 'collateral', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_size', type: 'uint256' },
      { internalType: 'uint256', name: '_collateral', type: 'uint256' },
      { internalType: 'address', name: '_collateralToken', type: 'address' },
    ],
    name: 'calculateLeverage',
    outputs: [{ internalType: 'uint256', name: '_leverage', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'get1TokenSwapPath',
    outputs: [{ internalType: 'address[]', name: 'path', type: 'address[]' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token1', type: 'address' },
      { internalType: 'address', name: '_token2', type: 'address' },
    ],
    name: 'get2TokenSwapPath',
    outputs: [{ internalType: 'address[]', name: 'path', type: 'address[]' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amountOut', type: 'uint256' },
      { internalType: 'uint256', name: '_slippage', type: 'uint256' },
      { internalType: 'address', name: '_tokenOut', type: 'address' },
      { internalType: 'address', name: '_tokenIn', type: 'address' },
    ],
    name: 'getAmountIn',
    outputs: [{ internalType: 'uint256', name: '_amountIn', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_outToken', type: 'address' },
    ],
    name: 'getAmountReceivedOnExitPosition',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'uint256', name: '_purchaseId', type: 'uint256' },
    ],
    name: 'getAtlanticUnwindCosts',
    outputs: [{ internalType: 'uint256', name: '_cost', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'uint256', name: '_purchaseId', type: 'uint256' },
    ],
    name: 'getCollateralAccess',
    outputs: [
      { internalType: 'uint256', name: '_collateralAccess', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'uint256', name: '_liquidationPrice', type: 'uint256' },
    ],
    name: 'getEligiblePutStrike',
    outputs: [
      { internalType: 'uint256', name: 'eligiblePutStrike', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'address', name: '_collateralToken', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'uint256', name: '_collateralDelta', type: 'uint256' },
      { internalType: 'uint256', name: '_sizeDelta', type: 'uint256' },
    ],
    name: 'getEligiblePutStrike',
    outputs: [
      { internalType: 'uint256', name: 'eligiblePutStrike', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_convertTo', type: 'address' },
    ],
    name: 'getFundingFee',
    outputs: [{ internalType: 'uint256', name: 'fundingFee', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
    ],
    name: 'getLiquidationPrice',
    outputs: [
      { internalType: 'uint256', name: 'liquidationPrice', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_collateralToken', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'uint256', name: '_collateralDelta', type: 'uint256' },
      { internalType: 'uint256', name: '_sizeDelta', type: 'uint256' },
    ],
    name: 'getLiquidationPrice',
    outputs: [
      { internalType: 'uint256', name: 'liquidationPrice', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_convertTo', type: 'address' },
    ],
    name: 'getMarginFees',
    outputs: [{ internalType: 'uint256', name: 'fees', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'uint256', name: '_purchaseId', type: 'uint256' },
    ],
    name: 'getOptionsPurchase',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
    ],
    name: 'getPositionCollateral',
    outputs: [{ internalType: 'uint256', name: 'collateral', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_size', type: 'uint256' }],
    name: 'getPositionFee',
    outputs: [{ internalType: 'uint256', name: 'feeUsd', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'bool', name: '_isIncrease', type: 'bool' },
    ],
    name: 'getPositionKey',
    outputs: [{ internalType: 'bytes32', name: 'key', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_collateralToken', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'uint256', name: '_collateralDelta', type: 'uint256' },
      { internalType: 'uint256', name: '_sizeDelta', type: 'uint256' },
    ],
    name: 'getPositionLeverage',
    outputs: [
      { internalType: 'uint256', name: '_positionLeverage', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
    ],
    name: 'getPositionLeverage',
    outputs: [
      { internalType: 'uint256', name: '_positionLeverage', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
    ],
    name: 'getPositionSize',
    outputs: [{ internalType: 'uint256', name: 'size', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'getPrice',
    outputs: [{ internalType: 'uint256', name: '_price', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_putStrike', type: 'uint256' },
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_quoteToken', type: 'address' },
    ],
    name: 'getRequiredAmountOfOptionsForInsurance',
    outputs: [
      { internalType: 'uint256', name: 'optionsAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_putStrike', type: 'uint256' },
      { internalType: 'uint256', name: '_sizeCollateralDiff', type: 'uint256' },
      { internalType: 'address', name: '_quoteToken', type: 'address' },
    ],
    name: 'getRequiredAmountOfOptionsForInsurance',
    outputs: [
      { internalType: 'uint256', name: 'optionsAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'uint256', name: '_purchaseId', type: 'uint256' },
    ],
    name: 'getStrategyExitSwapPath',
    outputs: [{ internalType: 'address[]', name: 'path', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'uint256', name: '_purchaseId', type: 'uint256' },
    ],
    name: 'getUsdOutForUnwindWithFee',
    outputs: [{ internalType: 'uint256', name: '_usdOut', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'positionRouter',
    outputs: [
      { internalType: 'contract IPositionRouter', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reader',
    outputs: [{ internalType: 'contract IReader', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_vault', type: 'address' },
      { internalType: 'address', name: '_positionRouter', type: 'address' },
      { internalType: 'address', name: '_reader', type: 'address' },
    ],
    name: 'setAddresses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newOwner', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'uint256', name: '_collateralDelta', type: 'uint256' },
    ],
    name: 'validateDecreaseCollateralDelta',
    outputs: [{ internalType: 'bool', name: 'valid', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_collateralSize', type: 'uint256' },
      { internalType: 'uint256', name: '_size', type: 'uint256' },
      { internalType: 'address', name: '_collateralToken', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
    ],
    name: 'validateIncreaseExecution',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_positionManager', type: 'address' },
      { internalType: 'address', name: '_indexToken', type: 'address' },
      { internalType: 'address', name: '_atlanticPool', type: 'address' },
      { internalType: 'uint256', name: '_purchaseId', type: 'uint256' },
    ],
    name: 'validateUnwind',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vault',
    outputs: [{ internalType: 'contract IVault', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
export default InsuredLongsUtilsAbi;
