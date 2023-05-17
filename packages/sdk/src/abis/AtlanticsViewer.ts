const AtlanticsViewerAbi = [
  {
    inputs: [
      {
        internalType: 'contract IAtlanticPutsPool',
        name: '_pool',
        type: 'address',
      },
      { internalType: 'uint256', name: '_epoch', type: 'uint256' },
      { internalType: 'uint256', name: '_strike', type: 'uint256' },
    ],
    name: 'getEpochCheckpoints',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'startTime', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'unlockedCollateral',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'premiumAccrued', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'borrowFeesAccrued',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAccrued',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'totalLiquidity', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'liquidityBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'activeCollateral',
            type: 'uint256',
          },
        ],
        internalType: 'struct Checkpoint[]',
        name: '_checkpoints',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAtlanticPutsPool',
        name: '_pool',
        type: 'address',
      },
      { internalType: 'uint256', name: '_epoch', type: 'uint256' },
    ],
    name: 'getEpochStrikes',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAtlanticPutsPool',
        name: '_pool',
        type: 'address',
      },
      { internalType: 'uint256', name: '_epoch', type: 'uint256' },
    ],
    name: 'getEpochUserDeposits',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { internalType: 'uint256', name: 'strike', type: 'uint256' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'checkpoint', type: 'uint256' },
          { internalType: 'address', name: 'depositor', type: 'address' },
          { internalType: 'bool', name: 'rollover', type: 'bool' },
        ],
        internalType: 'struct DepositPosition[]',
        name: '_depositPositions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAtlanticPutsPool',
        name: '_pool',
        type: 'address',
      },
      { internalType: 'uint256', name: '_epoch', type: 'uint256' },
    ],
    name: 'getEpochUserOptionsPurchases',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { internalType: 'uint256', name: 'optionStrike', type: 'uint256' },
          { internalType: 'uint256', name: 'optionsAmount', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'unlockEntryTimestamp',
            type: 'uint256',
          },
          { internalType: 'uint256[]', name: 'strikes', type: 'uint256[]' },
          { internalType: 'uint256[]', name: 'checkpoints', type: 'uint256[]' },
          { internalType: 'uint256[]', name: 'weights', type: 'uint256[]' },
          { internalType: 'enum OptionsState', name: 'state', type: 'uint8' },
          { internalType: 'address', name: 'user', type: 'address' },
          { internalType: 'address', name: 'delegate', type: 'address' },
        ],
        internalType: 'struct OptionsPurchase[]',
        name: '_purchasePositions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAtlanticPutsPool',
        name: '_pool',
        type: 'address',
      },
      { internalType: 'uint256', name: '_epoch', type: 'uint256' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getUserDeposits',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { internalType: 'uint256', name: 'strike', type: 'uint256' },
          { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
          { internalType: 'uint256', name: 'checkpoint', type: 'uint256' },
          { internalType: 'address', name: 'depositor', type: 'address' },
          { internalType: 'bool', name: 'rollover', type: 'bool' },
        ],
        internalType: 'struct DepositPosition[]',
        name: '_depositPositions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAtlanticPutsPool',
        name: '_pool',
        type: 'address',
      },
      { internalType: 'uint256', name: '_epoch', type: 'uint256' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'getUserOptionsPurchases',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { internalType: 'uint256', name: 'optionStrike', type: 'uint256' },
          { internalType: 'uint256', name: 'optionsAmount', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'unlockEntryTimestamp',
            type: 'uint256',
          },
          { internalType: 'uint256[]', name: 'strikes', type: 'uint256[]' },
          { internalType: 'uint256[]', name: 'checkpoints', type: 'uint256[]' },
          { internalType: 'uint256[]', name: 'weights', type: 'uint256[]' },
          { internalType: 'enum OptionsState', name: 'state', type: 'uint8' },
          { internalType: 'address', name: 'user', type: 'address' },
          { internalType: 'address', name: 'delegate', type: 'address' },
        ],
        internalType: 'struct OptionsPurchase[]',
        name: '_purchasePositions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export default AtlanticsViewerAbi;
