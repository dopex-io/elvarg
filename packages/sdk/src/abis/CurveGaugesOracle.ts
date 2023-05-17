const CurveGaugesOracleAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_gaugeSnapshotReceiverAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_chainlinkCRVAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'epochStart', type: 'uint256' },
      { internalType: 'uint256', name: 'epochEnd', type: 'uint256' },
      { internalType: 'address', name: 'gauge', type: 'address' },
    ],
    name: 'getRate',
    outputs: [{ internalType: 'uint256', name: 'rate', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];
export default CurveGaugesOracleAbi;
