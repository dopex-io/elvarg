/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import type {
  ERC20PresetMinterPauserUpgradeable,
  ERC20PresetMinterPauserUpgradeableInterface,
} from '../ERC20PresetMinterPauserUpgradeable';

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const _bytecode =
  '0x608060405234801561001057600080fd5b50611eb6806100206000396000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c80635c975abb11610104578063a217fddf116100a2578063d539139311610071578063d5391393146103ce578063d547741f146103f5578063dd62ed3e14610408578063e63ab1e91461044157600080fd5b8063a217fddf1461038d578063a457c2d714610395578063a9059cbb146103a8578063ca15c873146103bb57600080fd5b80638456cb59116100de5780638456cb591461033f5780639010d07c1461034757806391d148541461037257806395d89b411461038557600080fd5b80635c975abb146102f757806370a082311461030357806379cc67901461032c57600080fd5b8063313ce567116101715780633f4ba83a1161014b5780633f4ba83a146102b657806340c10f19146102be57806342966c68146102d15780634cd88b76146102e457600080fd5b8063313ce5671461028157806336568abe1461029057806339509351146102a357600080fd5b806318160ddd116101ad57806318160ddd1461022457806323b872dd14610236578063248a9ca3146102495780632f2ff15d1461026c57600080fd5b806301ffc9a7146101d457806306fdde03146101fc578063095ea7b314610211575b600080fd5b6101e76101e23660046119fd565b610456565b60405190151581526020015b60405180910390f35b610204610481565b6040516101f39190611a53565b6101e761021f366004611aa2565b610513565b60cb545b6040519081526020016101f3565b6101e7610244366004611acc565b610529565b610228610257366004611b08565b60009081526065602052604090206001015490565b61027f61027a366004611b21565b6105d8565b005b604051601281526020016101f3565b61027f61029e366004611b21565b610603565b6101e76102b1366004611aa2565b610681565b61027f6106bd565b61027f6102cc366004611aa2565b610751565b61027f6102df366004611b08565b6107f0565b61027f6102f2366004611bf0565b6107fd565b61012d5460ff166101e7565b610228610311366004611c54565b6001600160a01b0316600090815260c9602052604090205490565b61027f61033a366004611aa2565b610874565b61027f6108f5565b61035a610355366004611c6f565b610987565b6040516001600160a01b0390911681526020016101f3565b6101e7610380366004611b21565b6109a6565b6102046109d1565b610228600081565b6101e76103a3366004611aa2565b6109e0565b6101e76103b6366004611aa2565b610a79565b6102286103c9366004611b08565b610a86565b6102287f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b61027f610403366004611b21565b610a9d565b610228610416366004611c91565b6001600160a01b03918216600090815260ca6020908152604080832093909416825291909152205490565b610228600080516020611e6183398151915281565b60006001600160e01b03198216635a05180f60e01b148061047b575061047b82610ac3565b92915050565b606060cc805461049090611cbb565b80601f01602080910402602001604051908101604052809291908181526020018280546104bc90611cbb565b80156105095780601f106104de57610100808354040283529160200191610509565b820191906000526020600020905b8154815290600101906020018083116104ec57829003601f168201915b5050505050905090565b6000610520338484610af8565b50600192915050565b6000610536848484610c1c565b6001600160a01b038416600090815260ca60209081526040808320338452909152902054828110156105c05760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b60648201526084015b60405180910390fd5b6105cd8533858403610af8565b506001949350505050565b6000828152606560205260409020600101546105f48133610df7565b6105fe8383610e5b565b505050565b6001600160a01b03811633146106735760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016105b7565b61067d8282610e7d565b5050565b33600081815260ca602090815260408083206001600160a01b038716845290915281205490916105209185906106b8908690611d0c565b610af8565b6106d5600080516020611e61833981519152336109a6565b6107475760405162461bcd60e51b815260206004820152603960248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20756e70617573650000000000000060648201526084016105b7565b61074f610e9f565b565b61077b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6336109a6565b6107e65760405162461bcd60e51b815260206004820152603660248201527f45524332305072657365744d696e7465725061757365723a206d7573742068616044820152751d99481b5a5b9d195c881c9bdb19481d1bc81b5a5b9d60521b60648201526084016105b7565b61067d8282610f34565b6107fa338261101f565b50565b600054610100900460ff1680610816575060005460ff16155b6108325760405162461bcd60e51b81526004016105b790611d24565b600054610100900460ff16158015610854576000805461ffff19166101011790555b61085e8383611179565b80156105fe576000805461ff0019169055505050565b60006108808333610416565b9050818110156108de5760405162461bcd60e51b8152602060048201526024808201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f77604482015263616e636560e01b60648201526084016105b7565b6108eb8333848403610af8565b6105fe838361101f565b61090d600080516020611e61833981519152336109a6565b61097f5760405162461bcd60e51b815260206004820152603760248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20706175736500000000000000000060648201526084016105b7565b61074f61121c565b600082815260976020526040812061099f9083611299565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b606060cd805461049090611cbb565b33600090815260ca602090815260408083206001600160a01b038616845290915281205482811015610a625760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105b7565b610a6f3385858403610af8565b5060019392505050565b6000610520338484610c1c565b600081815260976020526040812061047b906112a5565b600082815260656020526040902060010154610ab98133610df7565b6105fe8383610e7d565b60006001600160e01b03198216637965db0b60e01b148061047b57506301ffc9a760e01b6001600160e01b031983161461047b565b6001600160a01b038316610b5a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105b7565b6001600160a01b038216610bbb5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105b7565b6001600160a01b03838116600081815260ca602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038316610c805760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105b7565b6001600160a01b038216610ce25760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105b7565b610ced8383836112af565b6001600160a01b038316600090815260c9602052604090205481811015610d655760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105b7565b6001600160a01b03808516600090815260c96020526040808220858503905591851681529081208054849290610d9c908490611d0c565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610de891815260200190565b60405180910390a35b50505050565b610e0182826109a6565b61067d57610e19816001600160a01b031660146112ba565b610e248360206112ba565b604051602001610e35929190611d72565b60408051601f198184030181529082905262461bcd60e51b82526105b791600401611a53565b610e658282611456565b60008281526097602052604090206105fe90826114dc565b610e8782826114f1565b60008281526097602052604090206105fe9082611558565b61012d5460ff16610ee95760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105b7565b61012d805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610f8a5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105b7565b610f96600083836112af565b8060cb6000828254610fa89190611d0c565b90915550506001600160a01b038216600090815260c9602052604081208054839290610fd5908490611d0c565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b03821661107f5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016105b7565b61108b826000836112af565b6001600160a01b038216600090815260c96020526040902054818110156110ff5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016105b7565b6001600160a01b038316600090815260c960205260408120838303905560cb805484929061112e908490611de7565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b600054610100900460ff1680611192575060005460ff16155b6111ae5760405162461bcd60e51b81526004016105b790611d24565b600054610100900460ff161580156111d0576000805461ffff19166101011790555b6111d861156d565b6111e061156d565b6111e861156d565b6111f061156d565b6111fa83836115d8565b61120261156d565b61120a61166d565b61121261156d565b61085e83836116e3565b61012d5460ff16156112635760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105b7565b61012d805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610f173390565b600061099f8383611787565b600061047b825490565b6105fe8383836117b1565b606060006112c9836002611dfe565b6112d4906002611d0c565b67ffffffffffffffff8111156112ec576112ec611b4d565b6040519080825280601f01601f191660200182016040528015611316576020820181803683370190505b509050600360fc1b8160008151811061133157611331611e1d565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061136057611360611e1d565b60200101906001600160f81b031916908160001a9053506000611384846002611dfe565b61138f906001611d0c565b90505b6001811115611407576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106113c3576113c3611e1d565b1a60f81b8282815181106113d9576113d9611e1d565b60200101906001600160f81b031916908160001a90535060049490941c9361140081611e33565b9050611392565b50831561099f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105b7565b61146082826109a6565b61067d5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556114983390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061099f836001600160a01b038416611818565b6114fb82826109a6565b1561067d5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061099f836001600160a01b038416611867565b600054610100900460ff1680611586575060005460ff16155b6115a25760405162461bcd60e51b81526004016105b790611d24565b600054610100900460ff161580156115c4576000805461ffff19166101011790555b80156107fa576000805461ff001916905550565b600054610100900460ff16806115f1575060005460ff16155b61160d5760405162461bcd60e51b81526004016105b790611d24565b600054610100900460ff1615801561162f576000805461ffff19166101011790555b82516116429060cc906020860190611964565b5081516116569060cd906020850190611964565b5080156105fe576000805461ff0019169055505050565b600054610100900460ff1680611686575060005460ff16155b6116a25760405162461bcd60e51b81526004016105b790611d24565b600054610100900460ff161580156116c4576000805461ffff19166101011790555b61012d805460ff1916905580156107fa576000805461ff001916905550565b600054610100900460ff16806116fc575060005460ff16155b6117185760405162461bcd60e51b81526004016105b790611d24565b600054610100900460ff1615801561173a576000805461ffff19166101011790555b61174560003361195a565b61176f7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63361195a565b61085e600080516020611e618339815191523361195a565b600082600001828154811061179e5761179e611e1d565b9060005260206000200154905092915050565b61012d5460ff16156105fe5760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b60648201526084016105b7565b600081815260018301602052604081205461185f5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561047b565b50600061047b565b6000818152600183016020526040812054801561195057600061188b600183611de7565b855490915060009061189f90600190611de7565b90508181146119045760008660000182815481106118bf576118bf611e1d565b90600052602060002001549050808760000184815481106118e2576118e2611e1d565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061191557611915611e4a565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061047b565b600091505061047b565b61067d8282610e5b565b82805461197090611cbb565b90600052602060002090601f01602090048101928261199257600085556119d8565b82601f106119ab57805160ff19168380011785556119d8565b828001600101855582156119d8579182015b828111156119d85782518255916020019190600101906119bd565b506119e49291506119e8565b5090565b5b808211156119e457600081556001016119e9565b600060208284031215611a0f57600080fd5b81356001600160e01b03198116811461099f57600080fd5b60005b83811015611a42578181015183820152602001611a2a565b83811115610df15750506000910152565b6020815260008251806020840152611a72816040850160208701611a27565b601f01601f19169190910160400192915050565b80356001600160a01b0381168114611a9d57600080fd5b919050565b60008060408385031215611ab557600080fd5b611abe83611a86565b946020939093013593505050565b600080600060608486031215611ae157600080fd5b611aea84611a86565b9250611af860208501611a86565b9150604084013590509250925092565b600060208284031215611b1a57600080fd5b5035919050565b60008060408385031215611b3457600080fd5b82359150611b4460208401611a86565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112611b7457600080fd5b813567ffffffffffffffff80821115611b8f57611b8f611b4d565b604051601f8301601f19908116603f01168101908282118183101715611bb757611bb7611b4d565b81604052838152866020858801011115611bd057600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060408385031215611c0357600080fd5b823567ffffffffffffffff80821115611c1b57600080fd5b611c2786838701611b63565b93506020850135915080821115611c3d57600080fd5b50611c4a85828601611b63565b9150509250929050565b600060208284031215611c6657600080fd5b61099f82611a86565b60008060408385031215611c8257600080fd5b50508035926020909101359150565b60008060408385031215611ca457600080fd5b611cad83611a86565b9150611b4460208401611a86565b600181811c90821680611ccf57607f821691505b60208210811415611cf057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611d1f57611d1f611cf6565b500190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611daa816017850160208801611a27565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611ddb816028840160208801611a27565b01602801949350505050565b600082821015611df957611df9611cf6565b500390565b6000816000190483118215151615611e1857611e18611cf6565b500290565b634e487b7160e01b600052603260045260246000fd5b600081611e4257611e42611cf6565b506000190190565b634e487b7160e01b600052603160045260246000fdfe65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862aa26469706673582212201e8e71d04321c61cbea798e0c220b88d5e37b921bdfb67b7e07db65b7fd1d00064736f6c63430008090033';

export class ERC20PresetMinterPauserUpgradeable__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC20PresetMinterPauserUpgradeable> {
    return super.deploy(
      overrides || {}
    ) as Promise<ERC20PresetMinterPauserUpgradeable>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC20PresetMinterPauserUpgradeable {
    return super.attach(address) as ERC20PresetMinterPauserUpgradeable;
  }
  connect(signer: Signer): ERC20PresetMinterPauserUpgradeable__factory {
    return super.connect(signer) as ERC20PresetMinterPauserUpgradeable__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20PresetMinterPauserUpgradeableInterface {
    return new utils.Interface(
      _abi
    ) as ERC20PresetMinterPauserUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20PresetMinterPauserUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC20PresetMinterPauserUpgradeable;
  }
}
