const SsovV3ViewerAbi = [
  {
    inputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'uint256', name: 'strike', type: 'uint256' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'getCheckpoints',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'activeCollateral',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'totalCollateral', type: 'uint256' },
          { internalType: 'uint256', name: 'accruedPremium', type: 'uint256' },
        ],
        internalType: 'struct VaultCheckpoint[]',
        name: 'checkpoints',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'getEpochStrikeTokens',
    outputs: [
      { internalType: 'address[]', name: 'strikeTokens', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'getTotalEpochOptionsPurchased',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '_totalEpochOptionsPurchased',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'getTotalEpochPremium',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '_totalEpochPremium',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'epoch', type: 'uint256' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'getTotalEpochStrikeDeposits',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'totalEpochStrikeDeposits',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'getWritePositionValue',
    outputs: [
      {
        internalType: 'uint256',
        name: 'estimatedCollateralUsage',
        type: 'uint256',
      },
      { internalType: 'uint256', name: 'accruedPremium', type: 'uint256' },
      {
        internalType: 'uint256[]',
        name: 'rewardTokenWithdrawAmounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'contract ISsovV3', name: 'ssov', type: 'address' },
    ],
    name: 'walletOfOwner',
    outputs: [
      { internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export default SsovV3ViewerAbi;
