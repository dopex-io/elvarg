const MerklDistributor = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'InvalidDispute', type: 'error' },
  { inputs: [], name: 'InvalidLengths', type: 'error' },
  { inputs: [], name: 'InvalidProof', type: 'error' },
  { inputs: [], name: 'InvalidUninitializedRoot', type: 'error' },
  { inputs: [], name: 'NoDispute', type: 'error' },
  { inputs: [], name: 'NotGovernorOrGuardian', type: 'error' },
  { inputs: [], name: 'NotTrusted', type: 'error' },
  { inputs: [], name: 'NotWhitelisted', type: 'error' },
  { inputs: [], name: 'UnresolvedDispute', type: 'error' },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Claimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'isEnabled', type: 'bool' },
    ],
    name: 'OperatorClaimingToggled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isWhitelisted',
        type: 'bool',
      },
    ],
    name: 'OperatorToggled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'merkleRoot',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'ipfsHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint48',
        name: 'endOfDisputePeriod',
        type: 'uint48',
      },
    ],
    name: 'TreeUpdated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'users', type: 'address[]' },
      { internalType: 'address[]', name: 'tokens', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'bytes32[][]', name: 'proofs', type: 'bytes32[][]' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'claimed',
    outputs: [
      { internalType: 'uint208', name: 'amount', type: 'uint208' },
      { internalType: 'uint48', name: 'timestamp', type: 'uint48' },
      { internalType: 'bytes32', name: 'merkleRoot', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMerkleRoot',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastTree',
    outputs: [
      { internalType: 'bytes32', name: 'merkleRoot', type: 'bytes32' },
      { internalType: 'bytes32', name: 'ipfsHash', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tree',
    outputs: [
      { internalType: 'bytes32', name: 'merkleRoot', type: 'bytes32' },
      { internalType: 'bytes32', name: 'ipfsHash', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'merkleRoot', type: 'bytes32' },
          { internalType: 'bytes32', name: 'ipfsHash', type: 'bytes32' },
        ],
        internalType: 'struct MerkleTree',
        name: '_tree',
        type: 'tuple',
      },
    ],
    name: 'updateTree',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newImplementation', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newImplementation', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export default MerklDistributor;
