/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import type { DpxToken, DpxTokenInterface } from '../DpxToken';

const _abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
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
  '0x60806040523480156200001157600080fd5b50604080518082018252600e81526d2237b832bc1734b7902a37b5b2b760911b602080830191825283518085019094526003845262088a0b60eb1b90840152815191929183918391620000679160059162000402565b5080516200007d90600690602084019062000402565b50506007805460ff1916905550620000976000336200010e565b620000c37f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6336200010e565b620000ef7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a336200010e565b50620001089050306969e10de76676d08000006200011e565b6200050c565b6200011a828262000215565b5050565b6001600160a01b0382166200017a5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b620001886000838362000258565b80600460008282546200019c9190620004a8565b90915550506001600160a01b03821660009081526002602052604081208054839290620001cb908490620004a8565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6200022c82826200027060201b62000a611760201c565b60008281526001602090815260409091206200025391839062000ae562000310821b17901c565b505050565b620002538383836200033060201b62000afa1760201c565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166200011a576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620002cc3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062000327836001600160a01b038416620003b0565b90505b92915050565b620003488383836200025360201b620005f11760201c565b60075460ff1615620002535760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b606482015260840162000171565b6000818152600183016020526040812054620003f9575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556200032a565b5060006200032a565b8280546200041090620004cf565b90600052602060002090601f0160209004810192826200043457600085556200047f565b82601f106200044f57805160ff19168380011785556200047f565b828001600101855582156200047f579182015b828111156200047f57825182559160200191906001019062000462565b506200048d92915062000491565b5090565b5b808211156200048d576000815560010162000492565b60008219821115620004ca57634e487b7160e01b600052601160045260246000fd5b500190565b600181811c90821680620004e457607f821691505b602082108114156200050657634e487b7160e01b600052602260045260246000fd5b50919050565b61198c806200051c6000396000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c806370a08231116100f9578063a457c2d711610097578063d539139311610071578063d5391393146103af578063d547741f146103d6578063dd62ed3e146103e9578063e63ab1e91461042257600080fd5b8063a457c2d714610376578063a9059cbb14610389578063ca15c8731461039c57600080fd5b80639010d07c116100d35780639010d07c1461032857806391d148541461035357806395d89b4114610366578063a217fddf1461036e57600080fd5b806370a08231146102e457806379cc67901461030d5780638456cb591461032057600080fd5b8063313ce567116101665780633f4ba83a116101405780633f4ba83a146102ab57806340c10f19146102b357806342966c68146102c65780635c975abb146102d957600080fd5b8063313ce5671461027657806336568abe14610285578063395093511461029857600080fd5b806318160ddd116101a257806318160ddd1461021957806323b872dd1461022b578063248a9ca31461023e5780632f2ff15d1461026157600080fd5b806301ffc9a7146101c957806306fdde03146101f1578063095ea7b314610206575b600080fd5b6101dc6101d7366004611632565b610449565b60405190151581526020015b60405180910390f35b6101f9610474565b6040516101e89190611688565b6101dc6102143660046116d7565b610506565b6004545b6040519081526020016101e8565b6101dc610239366004611701565b61051c565b61021d61024c36600461173d565b60009081526020819052604090206001015490565b61027461026f366004611756565b6105cb565b005b604051601281526020016101e8565b610274610293366004611756565b6105f6565b6101dc6102a63660046116d7565b610674565b6102746106b0565b6102746102c13660046116d7565b610756565b6102746102d436600461173d565b6107f5565b60075460ff166101dc565b61021d6102f2366004611782565b6001600160a01b031660009081526002602052604090205490565b61027461031b3660046116d7565b610802565b610274610883565b61033b61033636600461179d565b610927565b6040516001600160a01b0390911681526020016101e8565b6101dc610361366004611756565b610946565b6101f961096f565b61021d600081565b6101dc6103843660046116d7565b61097e565b6101dc6103973660046116d7565b610a17565b61021d6103aa36600461173d565b610a24565b61021d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6102746103e4366004611756565b610a3b565b61021d6103f73660046117bf565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b61021d7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b03198216635a05180f60e01b148061046e575061046e82610b60565b92915050565b606060058054610483906117e9565b80601f01602080910402602001604051908101604052809291908181526020018280546104af906117e9565b80156104fc5780601f106104d1576101008083540402835291602001916104fc565b820191906000526020600020905b8154815290600101906020018083116104df57829003601f168201915b5050505050905090565b6000610513338484610b95565b50600192915050565b6000610529848484610cb9565b6001600160a01b0384166000908152600360209081526040808320338452909152902054828110156105b35760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b60648201526084015b60405180910390fd5b6105c08533858403610b95565b506001949350505050565b6000828152602081905260409020600101546105e78133610e94565b6105f18383610ef8565b505050565b6001600160a01b03811633146106665760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016105aa565b6106708282610f1a565b5050565b3360008181526003602090815260408083206001600160a01b038716845290915281205490916105139185906106ab90869061183a565b610b95565b6106da7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610946565b61074c5760405162461bcd60e51b815260206004820152603960248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20756e70617573650000000000000060648201526084016105aa565b610754610f3c565b565b6107807f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610946565b6107eb5760405162461bcd60e51b815260206004820152603660248201527f45524332305072657365744d696e7465725061757365723a206d7573742068616044820152751d99481b5a5b9d195c881c9bdb19481d1bc81b5a5b9d60521b60648201526084016105aa565b6106708282610fcf565b6107ff33826110ba565b50565b600061080e83336103f7565b90508181101561086c5760405162461bcd60e51b8152602060048201526024808201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f77604482015263616e636560e01b60648201526084016105aa565b6108798333848403610b95565b6105f183836110ba565b6108ad7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610946565b61091f5760405162461bcd60e51b815260206004820152603760248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20706175736500000000000000000060648201526084016105aa565b610754611214565b600082815260016020526040812061093f908361128f565b9392505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b606060068054610483906117e9565b3360009081526003602090815260408083206001600160a01b038616845290915281205482811015610a005760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105aa565b610a0d3385858403610b95565b5060019392505050565b6000610513338484610cb9565b600081815260016020526040812061046e9061129b565b600082815260208190526040902060010154610a578133610e94565b6105f18383610f1a565b610a6b8282610946565b610670576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055610aa13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061093f836001600160a01b0384166112a5565b60075460ff16156105f15760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b60648201526084016105aa565b60006001600160e01b03198216637965db0b60e01b148061046e57506301ffc9a760e01b6001600160e01b031983161461046e565b6001600160a01b038316610bf75760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105aa565b6001600160a01b038216610c585760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105aa565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038316610d1d5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105aa565b6001600160a01b038216610d7f5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105aa565b610d8a8383836112f4565b6001600160a01b03831660009081526002602052604090205481811015610e025760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105aa565b6001600160a01b03808516600090815260026020526040808220858503905591851681529081208054849290610e3990849061183a565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610e8591815260200190565b60405180910390a35b50505050565b610e9e8282610946565b61067057610eb6816001600160a01b031660146112ff565b610ec18360206112ff565b604051602001610ed2929190611852565b60408051601f198184030181529082905262461bcd60e51b82526105aa91600401611688565b610f028282610a61565b60008281526001602052604090206105f19082610ae5565b610f24828261149b565b60008281526001602052604090206105f19082611500565b60075460ff16610f855760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105aa565b6007805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b0382166110255760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105aa565b611031600083836112f4565b8060046000828254611043919061183a565b90915550506001600160a01b0382166000908152600260205260408120805483929061107090849061183a565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b03821661111a5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016105aa565b611126826000836112f4565b6001600160a01b0382166000908152600260205260409020548181101561119a5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016105aa565b6001600160a01b03831660009081526002602052604081208383039055600480548492906111c99084906118c7565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b60075460ff161561125a5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105aa565b6007805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610fb23390565b600061093f8383611515565b600061046e825490565b60008181526001830160205260408120546112ec5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561046e565b50600061046e565b6105f1838383610afa565b6060600061130e8360026118de565b61131990600261183a565b67ffffffffffffffff811115611331576113316118fd565b6040519080825280601f01601f19166020018201604052801561135b576020820181803683370190505b509050600360fc1b8160008151811061137657611376611913565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106113a5576113a5611913565b60200101906001600160f81b031916908160001a90535060006113c98460026118de565b6113d490600161183a565b90505b600181111561144c576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061140857611408611913565b1a60f81b82828151811061141e5761141e611913565b60200101906001600160f81b031916908160001a90535060049490941c9361144581611929565b90506113d7565b50831561093f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105aa565b6114a58282610946565b15610670576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061093f836001600160a01b03841661153f565b600082600001828154811061152c5761152c611913565b9060005260206000200154905092915050565b600081815260018301602052604081205480156116285760006115636001836118c7565b8554909150600090611577906001906118c7565b90508181146115dc57600086600001828154811061159757611597611913565b90600052602060002001549050808760000184815481106115ba576115ba611913565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806115ed576115ed611940565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061046e565b600091505061046e565b60006020828403121561164457600080fd5b81356001600160e01b03198116811461093f57600080fd5b60005b8381101561167757818101518382015260200161165f565b83811115610e8e5750506000910152565b60208152600082518060208401526116a781604085016020870161165c565b601f01601f19169190910160400192915050565b80356001600160a01b03811681146116d257600080fd5b919050565b600080604083850312156116ea57600080fd5b6116f3836116bb565b946020939093013593505050565b60008060006060848603121561171657600080fd5b61171f846116bb565b925061172d602085016116bb565b9150604084013590509250925092565b60006020828403121561174f57600080fd5b5035919050565b6000806040838503121561176957600080fd5b82359150611779602084016116bb565b90509250929050565b60006020828403121561179457600080fd5b61093f826116bb565b600080604083850312156117b057600080fd5b50508035926020909101359150565b600080604083850312156117d257600080fd5b6117db836116bb565b9150611779602084016116bb565b600181811c908216806117fd57607f821691505b6020821081141561181e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561184d5761184d611824565b500190565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161188a81601785016020880161165c565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516118bb81602884016020880161165c565b01602801949350505050565b6000828210156118d9576118d9611824565b500390565b60008160001904831182151516156118f8576118f8611824565b500290565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008161193857611938611824565b506000190190565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220ab10a4af92843b3ffccc8460799b8a42697d9dac203083881a4818101c536b0164736f6c63430008090033';

export class DpxToken__factory extends ContractFactory {
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
  ): Promise<DpxToken> {
    return super.deploy(overrides || {}) as Promise<DpxToken>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DpxToken {
    return super.attach(address) as DpxToken;
  }
  connect(signer: Signer): DpxToken__factory {
    return super.connect(signer) as DpxToken__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DpxTokenInterface {
    return new utils.Interface(_abi) as DpxTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DpxToken {
    return new Contract(address, _abi, signerOrProvider) as DpxToken;
  }
}
