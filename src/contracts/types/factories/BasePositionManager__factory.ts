/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import type {
  BasePositionManager,
  BasePositionManagerInterface,
} from '../BasePositionManager';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_router',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_weth',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_depositFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sizeDelta',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'marginFeeBasisPoints',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'referralCode',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
    ],
    name: 'DecreasePositionReferral',
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sizeDelta',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'marginFeeBasisPoints',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'referralCode',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
    ],
    name: 'IncreasePositionReferral',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
    ],
    name: 'SetAdmin',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositFee',
        type: 'uint256',
      },
    ],
    name: 'SetDepositFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'increasePositionBufferBps',
        type: 'uint256',
      },
    ],
    name: 'SetIncreasePositionBufferBps',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'longSizes',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'shortSizes',
        type: 'uint256[]',
      },
    ],
    name: 'SetMaxGlobalSizes',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'referralStorage',
        type: 'address',
      },
    ],
    name: 'SetReferralStorage',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawFees',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BASIS_POINTS_DIVISOR',
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
    inputs: [],
    name: 'admin',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositFee',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'feeReserves',
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
    inputs: [],
    name: 'gov',
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
    inputs: [],
    name: 'increasePositionBufferBps',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'maxGlobalLongSizes',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'maxGlobalShortSizes',
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
    inputs: [],
    name: 'referralStorage',
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
    inputs: [],
    name: 'router',
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
        internalType: 'address payable',
        name: '_receiver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'sendValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
    ],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_depositFee',
        type: 'uint256',
      },
    ],
    name: 'setDepositFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_gov',
        type: 'address',
      },
    ],
    name: 'setGov',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_increasePositionBufferBps',
        type: 'uint256',
      },
    ],
    name: 'setIncreasePositionBufferBps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_tokens',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_longSizes',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '_shortSizes',
        type: 'uint256[]',
      },
    ],
    name: 'setMaxGlobalSizes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_referralStorage',
        type: 'address',
      },
    ],
    name: 'setReferralStorage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vault',
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
    inputs: [],
    name: 'weth',
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
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
    ],
    name: 'withdrawFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

const _bytecode =
  '0x6080604052606460075534801561001557600080fd5b506040516113be3803806113be8339818101604052608081101561003857600080fd5b50805160208201516040830151606090930151600160008181558154336001600160a01b031991821681179093556003805482166001600160a01b03978816179055600480548216958716959095179094556005805485169590961694909417909455600655600280549091169092179091556113039081906100bb90396000f3fe60806040526004361061012d5760003560e01c8063704b6c02116100ab578063e1f21c671161006f578063e1f21c67146103ed578063ef12c67e14610430578063f2555278146105e8578063f851a44014610623578063f887ea4014610638578063fbfa77cf1461064d5761017d565b8063704b6c021461030c5780639698d25a1461033f57806398d1e03a14610372578063ae4d7f9a14610387578063cfad57a2146103ba5761017d565b8063233bfe3b116100f2578063233bfe3b1461025557806324a084df1461027f5780633fc8cef3146102b8578063490ae210146102cd57806367a52793146102f75761017d565b80626cc35e146101825780631045c74e146101b3578063126082cf146101f857806312d43a511461020d5780631ce9cb8f146102225761017d565b3661017d576005546001600160a01b0316331461017b5760405162461bcd60e51b81526004018080602001828103825260238152602001806112816023913960400191505060405180910390fd5b005b600080fd5b34801561018e57600080fd5b50610197610662565b604080516001600160a01b039092168252519081900360200190f35b3480156101bf57600080fd5b506101e6600480360360208110156101d657600080fd5b50356001600160a01b0316610671565b60408051918252519081900360200190f35b34801561020457600080fd5b506101e6610683565b34801561021957600080fd5b50610197610689565b34801561022e57600080fd5b506101e66004803603602081101561024557600080fd5b50356001600160a01b0316610698565b34801561026157600080fd5b5061017b6004803603602081101561027857600080fd5b50356106aa565b34801561028b57600080fd5b5061017b600480360360408110156102a257600080fd5b506001600160a01b038135169060200135610732565b3480156102c457600080fd5b506101976107a0565b3480156102d957600080fd5b5061017b600480360360208110156102f057600080fd5b50356107af565b34801561030357600080fd5b506101e6610837565b34801561031857600080fd5b5061017b6004803603602081101561032f57600080fd5b50356001600160a01b031661083d565b34801561034b57600080fd5b506101e66004803603602081101561036257600080fd5b50356001600160a01b03166108e8565b34801561037e57600080fd5b506101e66108fa565b34801561039357600080fd5b5061017b600480360360208110156103aa57600080fd5b50356001600160a01b0316610900565b3480156103c657600080fd5b5061017b600480360360208110156103dd57600080fd5b50356001600160a01b03166109a1565b3480156103f957600080fd5b5061017b6004803603606081101561041057600080fd5b506001600160a01b03813581169160208101359091169060400135610a1a565b34801561043c57600080fd5b5061017b6004803603606081101561045357600080fd5b81019060208101813564010000000081111561046e57600080fd5b82018360208201111561048057600080fd5b803590602001918460208302840111640100000000831117156104a257600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092959493602081019350359150506401000000008111156104f257600080fd5b82018360208201111561050457600080fd5b8035906020019184602083028401116401000000008311171561052657600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561057657600080fd5b82018360208201111561058857600080fd5b803590602001918460208302840111640100000000831117156105aa57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610af9945050505050565b3480156105f457600080fd5b5061017b6004803603604081101561060b57600080fd5b506001600160a01b0381358116916020013516610ce8565b34801561062f57600080fd5b50610197610dcc565b34801561064457600080fd5b50610197610ddb565b34801561065957600080fd5b50610197610dea565b6008546001600160a01b031681565b600a6020526000908152604090205481565b61271081565b6001546001600160a01b031681565b60096020526000908152604090205481565b6002546001600160a01b031633146106f7576040805162461bcd60e51b815260206004820152601e6024820152600080516020611261833981519152604482015290519081900360640190fd5b60078190556040805182815290517f21167d0d4661af93817ebce920f18986eed3d75d5e1c03f2aed05efcbafbc4529181900360200190a150565b6001546001600160a01b03163314610789576040805162461bcd60e51b815260206004820152601560248201527423b7bb32b93730b136329d103337b93134b23232b760591b604482015290519081900360640190fd5b61079c6001600160a01b03831682610df9565b5050565b6005546001600160a01b031681565b6002546001600160a01b031633146107fc576040805162461bcd60e51b815260206004820152601e6024820152600080516020611261833981519152604482015290519081900360640190fd5b60068190556040805182815290517f974fd3c1fcb4653dfc4fb740c4c692cd212d55c28f163f310128cb64d83006759181900360200190a150565b60065481565b6001546001600160a01b03163314610894576040805162461bcd60e51b815260206004820152601560248201527423b7bb32b93730b136329d103337b93134b23232b760591b604482015290519081900360640190fd5b600280546001600160a01b0383166001600160a01b0319909116811790915560408051918252517f5a272403b402d892977df56625f4164ccaf70ca3863991c43ecfe76a6905b0a19181900360200190a150565b600b6020526000908152604090205481565b60075481565b6002546001600160a01b0316331461094d576040805162461bcd60e51b815260206004820152601e6024820152600080516020611261833981519152604482015290519081900360640190fd5b600880546001600160a01b0383166001600160a01b0319909116811790915560408051918252517f828abcccea18192c21d645e575652c49e20b986dab777906fc473d056b01b6a89181900360200190a150565b6001546001600160a01b031633146109f8576040805162461bcd60e51b815260206004820152601560248201527423b7bb32b93730b136329d103337b93134b23232b760591b604482015290519081900360640190fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b03163314610a71576040805162461bcd60e51b815260206004820152601560248201527423b7bb32b93730b136329d103337b93134b23232b760591b604482015290519081900360640190fd5b826001600160a01b031663095ea7b383836040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b158015610ac857600080fd5b505af1158015610adc573d6000803e3d6000fd5b505050506040513d6020811015610af257600080fd5b5050505050565b6002546001600160a01b03163314610b46576040805162461bcd60e51b815260206004820152601e6024820152600080516020611261833981519152604482015290519081900360640190fd5b60005b8351811015610be1576000848281518110610b6057fe5b60200260200101519050838281518110610b7657fe5b6020026020010151600a6000836001600160a01b03166001600160a01b0316815260200190815260200160002081905550828281518110610bb357fe5b6020908102919091018101516001600160a01b039092166000908152600b9091526040902055600101610b49565b507fae32d569b058895b9620d6552b09aaffedc9a6f396be4d595a224ad09f8b213983838360405180806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b83811015610c4e578181015183820152602001610c36565b50505050905001848103835286818151815260200191508051906020019060200280838360005b83811015610c8d578181015183820152602001610c75565b50505050905001848103825285818151815260200191508051906020019060200280838360005b83811015610ccc578181015183820152602001610cb4565b50505050905001965050505050505060405180910390a1505050565b6002546001600160a01b03163314610d35576040805162461bcd60e51b815260206004820152601e6024820152600080516020611261833981519152604482015290519081900360640190fd5b6001600160a01b03821660009081526009602052604090205480610d59575061079c565b6001600160a01b038316600081815260096020526040812055610d7d908383610ee3565b604080516001600160a01b0380861682528416602082015280820183905290517f4f1b51dd7a2fcb861aa2670f668be66835c4ee12b4bbbf037e4d0018f39819e49181900360600190a1505050565b6002546001600160a01b031681565b6004546001600160a01b031681565b6003546001600160a01b031681565b80471015610e4e576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604482015290519081900360640190fd5b6040516000906001600160a01b0384169083908381818185875af1925050503d8060008114610e99576040519150601f19603f3d011682016040523d82523d6000602084013e610e9e565b606091505b5050905080610ede5760405162461bcd60e51b815260040180806020018281038252603a815260200180611201603a913960400191505060405180910390fd5b505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610ede9084906060610f85826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610fe19092919063ffffffff16565b805190915015610ede57808060200190516020811015610fa457600080fd5b5051610ede5760405162461bcd60e51b815260040180806020018281038252602a8152602001806112a4602a913960400191505060405180910390fd5b6060610ff08484600085610ffa565b90505b9392505050565b60608247101561103b5760405162461bcd60e51b815260040180806020018281038252602681526020018061123b6026913960400191505060405180910390fd5b61104485611156565b611095576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b60006060866001600160a01b031685876040518082805190602001908083835b602083106110d45780518252601f1990920191602091820191016110b5565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114611136576040519150601f19603f3d011682016040523d82523d6000602084013e61113b565b606091505b509150915061114b82828661115c565b979650505050505050565b3b151590565b6060831561116b575081610ff3565b82511561117b5782518084602001fd5b8160405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156111c55781810151838201526020016111ad565b50505050905090810190601f1680156111f25780820380516001836020036101000a031916815260200191505b509250505060405180910390fdfe416464726573733a20756e61626c6520746f2073656e642076616c75652c20726563697069656e74206d61792068617665207265766572746564416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c42617365506f736974696f6e4d616e616765723a20666f7262696464656e000042617365506f736974696f6e4d616e616765723a20696e76616c69642073656e6465725361666545524332303a204552433230206f7065726174696f6e20646964206e6f742073756363656564a26469706673582212201cbb877b1e9f8d23c0c301d4bd970365f04a61e512e565b153af2c3ef71982d264736f6c634300060c0033';

export class BasePositionManager__factory extends ContractFactory {
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
    _vault: string,
    _router: string,
    _weth: string,
    _depositFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BasePositionManager> {
    return super.deploy(
      _vault,
      _router,
      _weth,
      _depositFee,
      overrides || {}
    ) as Promise<BasePositionManager>;
  }
  getDeployTransaction(
    _vault: string,
    _router: string,
    _weth: string,
    _depositFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _vault,
      _router,
      _weth,
      _depositFee,
      overrides || {}
    );
  }
  attach(address: string): BasePositionManager {
    return super.attach(address) as BasePositionManager;
  }
  connect(signer: Signer): BasePositionManager__factory {
    return super.connect(signer) as BasePositionManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BasePositionManagerInterface {
    return new utils.Interface(_abi) as BasePositionManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BasePositionManager {
    return new Contract(address, _abi, signerOrProvider) as BasePositionManager;
  }
}
