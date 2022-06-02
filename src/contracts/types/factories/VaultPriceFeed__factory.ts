/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import type {
  VaultPriceFeed,
  VaultPriceFeedInterface,
} from '../VaultPriceFeed';

const _abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
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
    name: 'MAX_ADJUSTMENT_BASIS_POINTS',
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
    name: 'MAX_ADJUSTMENT_INTERVAL',
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
    name: 'MAX_SPREAD_BASIS_POINTS',
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
    name: 'ONE_USD',
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
    name: 'PRICE_PRECISION',
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
    name: 'adjustmentBasisPoints',
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
    name: 'bnb',
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
    name: 'bnbBusd',
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
    name: 'btc',
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
    name: 'btcBnb',
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
    name: 'chainlinkFlags',
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
    name: 'eth',
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
    name: 'ethBnb',
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
    name: 'favorPrimaryPrice',
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
        name: '_token',
        type: 'address',
      },
    ],
    name: 'getAmmPrice',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_maximise',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_primaryPrice',
        type: 'uint256',
      },
    ],
    name: 'getAmmPriceV2',
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
        name: '_pair',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_divByReserve0',
        type: 'bool',
      },
    ],
    name: 'getPairPrice',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_maximise',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_includeAmmPrice',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    name: 'getPrice',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_maximise',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_includeAmmPrice',
        type: 'bool',
      },
    ],
    name: 'getPriceV1',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_maximise',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '_includeAmmPrice',
        type: 'bool',
      },
    ],
    name: 'getPriceV2',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_maximise',
        type: 'bool',
      },
    ],
    name: 'getPrimaryPrice',
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
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_referencePrice',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_maximise',
        type: 'bool',
      },
    ],
    name: 'getSecondaryPrice',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isAdjustmentAdditive',
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
    name: 'isAmmEnabled',
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
    name: 'isSecondaryPriceEnabled',
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
        name: '',
        type: 'address',
      },
    ],
    name: 'lastAdjustmentTimings',
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
    name: 'maxStrictPriceDeviation',
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
    name: 'priceDecimals',
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
    name: 'priceFeeds',
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
    name: 'priceSampleSpace',
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
    name: 'secondaryPriceFeed',
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
        internalType: 'bool',
        name: '_isAdditive',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '_adjustmentBps',
        type: 'uint256',
      },
    ],
    name: 'setAdjustment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_chainlinkFlags',
        type: 'address',
      },
    ],
    name: 'setChainlinkFlags',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_favorPrimaryPrice',
        type: 'bool',
      },
    ],
    name: 'setFavorPrimaryPrice',
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
        internalType: 'bool',
        name: '_isEnabled',
        type: 'bool',
      },
    ],
    name: 'setIsAmmEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isEnabled',
        type: 'bool',
      },
    ],
    name: 'setIsSecondaryPriceEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxStrictPriceDeviation',
        type: 'uint256',
      },
    ],
    name: 'setMaxStrictPriceDeviation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_bnbBusd',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ethBnb',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_btcBnb',
        type: 'address',
      },
    ],
    name: 'setPairs',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_priceSampleSpace',
        type: 'uint256',
      },
    ],
    name: 'setPriceSampleSpace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_secondaryPriceFeed',
        type: 'address',
      },
    ],
    name: 'setSecondaryPriceFeed',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'uint256',
        name: '_spreadBasisPoints',
        type: 'uint256',
      },
    ],
    name: 'setSpreadBasisPoints',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_spreadThresholdBasisPoints',
        type: 'uint256',
      },
    ],
    name: 'setSpreadThresholdBasisPoints',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: '_priceFeed',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_priceDecimals',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_isStrictStable',
        type: 'bool',
      },
    ],
    name: 'setTokenConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_btc',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_eth',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bnb',
        type: 'address',
      },
    ],
    name: 'setTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_useV2Pricing',
        type: 'bool',
      },
    ],
    name: 'setUseV2Pricing',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'spreadBasisPoints',
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
    name: 'spreadThresholdBasisPoints',
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
    name: 'strictStableTokens',
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
    name: 'useV2Pricing',
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
];

const _bytecode =
  '0x60806040526001805461ffff60b01b1960ff60a81b1960ff60a01b19909216600160a01b1791909116600160a81b171690556003600281905560009055601e60055534801561004d57600080fd5b50600080546001600160a01b031916331790556120858061006f6000396000f3fe608060405234801561001057600080fd5b506004361061030c5760003560e01c8063826e055f1161019d578063a28d57d8116100e9578063c2138d8c116100a2578063d694376c1161007c578063d694376c14610874578063e4440e02146108a8578063eb1c92a9146108b0578063fd34ec40146108cf5761030c565b8063c2138d8c14610802578063cefe0f2114610828578063cfad57a21461084e5761030c565b8063a28d57d81461074d578063a2ad7b9314610755578063a39c73a314610783578063b02a2de41461078b578063b731dd87146107bf578063b8f61105146107dc5761030c565b806397dfade7116101565780639b18dc47116101305780639b18dc47146106cd5780639b889380146106d55780639dcb511a14610701578063a27ea386146107275761030c565b806397dfade7146106805780639917dc74146106885780639a0a6635146106a75761030c565b8063826e055f1461060a5780638b86616c146106305780638c7c9e0c1461063857806393f690741461064057806395082d2514610578578063971bd396146106785761030c565b8063443be2091161025c578063593d9e80116102155780636ce8a44b116101ef5780636ce8a44b146105805780636fc80708146105a6578063717cfe7a146105ae578063732391b4146105d45761030c565b8063593d9e8014610551578063604f37e91461055957806367781c0e146105785761030c565b8063443be2091461047757806348cac277146104af57806349a876e4146104d55780634a4b1f4f146104dd5780634b9ade47146104e557806356c8c2c1146105235761030c565b80632fc3a70a116102c95780633d949c5f116102a35780633d949c5f146103fd5780633eba8d36146104335780633ebbc601146104675780633f0c3bb71461046f5761030c565b80632fc3a70a1461039b57806330536ee5146103d9578063378e7bf7146103f55761030c565b80630957aed9146103115780631193c8091461032b578063126082cf1461034f57806312d43a51146103575780632fa03b8f1461035f5780632fbfe3d31461037e575b600080fd5b6103196108ee565b60408051918252519081900360200190f35b6103336108f3565b604080516001600160a01b039092168252519081900360200190f35b610319610902565b610333610908565b61037c6004803603602081101561037557600080fd5b5035610917565b005b61037c6004803603602081101561039457600080fd5b50356109a8565b610319600480360360808110156103b157600080fd5b506001600160a01b0381351690602081013515159060408101351515906060013515156109fa565b6103e1610ab8565b604080519115158252519081900360200190f35b610319610ac8565b6103196004803603606081101561041357600080fd5b506001600160a01b03813516906020810135151590604001351515610ace565b6103196004803603606081101561044957600080fd5b506001600160a01b0381351690602081013590604001351515610ca2565b6103e1610d50565b6103e1610d60565b61037c6004803603606081101561048d57600080fd5b506001600160a01b038135811691602081013582169160409091013516610d70565b610319600480360360208110156104c557600080fd5b50356001600160a01b0316610dfc565b610333610e0e565b610319610e1d565b61037c600480360360808110156104fb57600080fd5b506001600160a01b038135811691602081013590911690604081013590606001351515610e22565b6103196004803603604081101561053957600080fd5b506001600160a01b0381351690602001351515610ec4565b6103e1611315565b61037c6004803603602081101561056f57600080fd5b50351515611325565b610319611390565b6103e16004803603602081101561059657600080fd5b50356001600160a01b03166113a0565b6103196113b5565b610319600480360360208110156105c457600080fd5b50356001600160a01b03166113bb565b610319600480360360608110156105ea57600080fd5b506001600160a01b038135169060208101351515906040013515156113cd565b61037c6004803603602081101561062057600080fd5b50356001600160a01b0316611422565b610333611491565b6103336114a0565b61037c6004803603606081101561065657600080fd5b506001600160a01b0381358116916020810135821691604090910135166114af565b61033361153b565b61033361154a565b61037c6004803603602081101561069e57600080fd5b50351515611559565b61037c600480360360208110156106bd57600080fd5b50356001600160a01b03166115c4565b610319611633565b61037c600480360360408110156106eb57600080fd5b506001600160a01b038135169060200135611639565b6103336004803603602081101561071757600080fd5b50356001600160a01b03166116e2565b6103196004803603602081101561073d57600080fd5b50356001600160a01b03166116fd565b61033361170f565b6103196004803603604081101561076b57600080fd5b506001600160a01b038135169060200135151561171e565b610319611812565b610319600480360360608110156107a157600080fd5b506001600160a01b0381351690602081013515159060400135611818565b61037c600480360360208110156107d557600080fd5b50356118e0565b6103e1600480360360208110156107f257600080fd5b50356001600160a01b0316611932565b6103196004803603602081101561081857600080fd5b50356001600160a01b0316611947565b6103196004803603602081101561083e57600080fd5b50356001600160a01b0316611a46565b61037c6004803603602081101561086457600080fd5b50356001600160a01b0316611a58565b61037c6004803603606081101561088a57600080fd5b506001600160a01b0381351690602081013515159060400135611ac7565b610333611c0a565b61037c600480360360208110156108c657600080fd5b50351515611c19565b61037c600480360360208110156108e557600080fd5b50351515611c84565b603281565b600a546001600160a01b031681565b61271081565b6000546001600160a01b031681565b6000546001600160a01b03163314610964576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600081116109a35760405162461bcd60e51b8152600401808060200182810382526029815260200180611f236029913960400191505060405180910390fd5b600255565b6000546001600160a01b031633146109f5576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600355565b6001546000908190600160b01b900460ff16610a2057610a1b868686610ace565b610a2b565b610a2b8686866113cd565b6001600160a01b0387166000908152601060205260409020549091508015610aae576001600160a01b03871660009081526011602052604090205460ff168015610a9657610a8f612710610a89610a828286611cef565b8690611d49565b90611da2565b9250610aac565b610aa9612710610a89610a828286611de4565b92505b505b5095945050505050565b600154600160b01b900460ff1681565b60035481565b600080610adb8585610ec4565b9050828015610af35750600154600160a01b900460ff165b15610b38576000610b0386611947565b90508015610b3657848015610b1757508181115b15610b20578091505b84158015610b2d57508181105b15610b36578091505b505b600154600160a81b900460ff1615610b5857610b55858286610ca2565b90505b6001600160a01b0385166000908152600f602052604090205460ff1615610c4157600068327cb2734119d3b7a9601e1b8211610ba957610ba468327cb2734119d3b7a9601e1b83611de4565b610bbf565b610bbf8268327cb2734119d3b7a9601e1b611de4565b90506003548111610be05768327cb2734119d3b7a9601e1b92505050610c9b565b848015610bf8575068327cb2734119d3b7a9601e1b82115b15610c0557509050610c9b565b84158015610c1e575068327cb2734119d3b7a9601e1b82105b15610c2b57509050610c9b565b68327cb2734119d3b7a9601e1b92505050610c9b565b6001600160a01b0385166000908152600e60205260409020548415610c8357610c7a612710610a89610c738285611cef565b8590611d49565b92505050610c9b565b610c96612710610a89610c738285611de4565b925050505b9392505050565b6004546000906001600160a01b0316610cbc575081610c9b565b6004805460408051630ffd9c6d60e31b81526001600160a01b038881169482019490945260248101879052851515604482015290519290911691637fece36891606480820192602092909190829003018186803b158015610d1c57600080fd5b505afa158015610d30573d6000803e3d6000fd5b505050506040513d6020811015610d4657600080fd5b5051949350505050565b600154600160a81b900460ff1681565b600154600160a01b900460ff1681565b6000546001600160a01b03163314610dbd576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600680546001600160a01b039485166001600160a01b031991821617909155600780549385169382169390931790925560088054919093169116179055565b60106020526000908152604090205481565b6008546001600160a01b031681565b601481565b6000546001600160a01b03163314610e6f576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b6001600160a01b039384166000908152600c6020908152604080832080546001600160a01b0319169690971695909517909555600d855283812092909255600f90935220805460ff1916911515919091179055565b6001600160a01b038083166000908152600c602052604081205490911680610f1d5760405162461bcd60e51b815260040180806020018281038252602281526020018061202e6022913960400191505060405180910390fd5b6001546001600160a01b031615610ffa5760015460408051631abf23ff60e11b815273a438451d6458044c3c8cd2f6f31c91ac882a6d91600482015290516000926001600160a01b03169163357e47fe916024808301926020929190829003018186803b158015610f8d57600080fd5b505afa158015610fa1573d6000803e3d6000fd5b505050506040513d6020811015610fb757600080fd5b505190508015610ff85760405162461bcd60e51b8152600401808060200182810382526025815260200180611fdf6025913960400191505060405180910390fd5b505b6000819050600080826001600160a01b031663668a0f026040518163ffffffff1660e01b815260040160206040518083038186803b15801561103b57600080fd5b505afa15801561104f573d6000803e3d6000fd5b505050506040513d602081101561106557600080fd5b5051905060005b600254816001600160501b0316101561129057806001600160501b0316826001600160501b03161161109d57611290565b60006001600160501b038216611172576000856001600160a01b03166350d25bcd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156110e857600080fd5b505afa1580156110fc573d6000803e3d6000fd5b505050506040513d602081101561111257600080fd5b505190506000811361116b576040805162461bcd60e51b815260206004820152601d60248201527f5661756c745072696365466565643a20696e76616c6964207072696365000000604482015290519081900360640190fd5b905061124c565b6000856001600160a01b0316639a6fc8f58486036040518263ffffffff1660e01b815260040180826001600160501b0316815260200191505060a06040518083038186803b1580156111c357600080fd5b505afa1580156111d7573d6000803e3d6000fd5b505050506040513d60a08110156111ed57600080fd5b5060200151905060008113611249576040805162461bcd60e51b815260206004820152601d60248201527f5661756c745072696365466565643a20696e76616c6964207072696365000000604482015290519081900360640190fd5b90505b83611258579250611288565b87801561126457508381115b15611270579250611288565b8715801561127d57508381105b15611286578093505b505b60010161106c565b50600082116112d05760405162461bcd60e51b8152600401808060200182810382526025815260200180611f4c6025913960400191505060405180910390fd5b6001600160a01b0387166000908152600d6020526040902054611307600a82900a610a898568327cb2734119d3b7a9601e1b611d49565b955050505050505b92915050565b600154600160b81b900460ff1681565b6000546001600160a01b03163314611372576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b60018054911515600160b81b0260ff60b81b19909216919091179055565b68327cb2734119d3b7a9601e1b81565b60116020526000908152604090205460ff1681565b60025481565b60126020526000908152604090205481565b6000806113da8585610ec4565b90508280156113f25750600154600160a01b900460ff165b15610b3857611402858583611818565b905060015460ff600160a81b9091041615610b5857610b55858286610ca2565b6000546001600160a01b0316331461146f576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6004546001600160a01b031681565b6007546001600160a01b031681565b6000546001600160a01b031633146114fc576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600980546001600160a01b039485166001600160a01b031991821617909155600a805493851693821693909317909255600b8054919093169116179055565b600b546001600160a01b031681565b6009546001600160a01b031681565b6000546001600160a01b031633146115a6576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b60018054911515600160a01b0260ff60a01b19909216919091179055565b6000546001600160a01b03163314611611576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600480546001600160a01b0319166001600160a01b0392909216919091179055565b611c2081565b6000546001600160a01b03163314611686576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b60328111156116c65760405162461bcd60e51b815260040180806020018281038252602a815260200180612004602a913960400191505060405180910390fd5b6001600160a01b039091166000908152600e6020526040902055565b600c602052600090815260409020546001600160a01b031681565b600e6020526000908152604090205481565b6006546001600160a01b031681565b6000806000846001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b15801561175c57600080fd5b505afa158015611770573d6000803e3d6000fd5b505050506040513d606081101561178657600080fd5b5080516020909101516dffffffffffffffffffffffffffff918216935016905083156117df57816117bc5760009250505061130f565b6117d682610a898368327cb2734119d3b7a9601e1b611d49565b9250505061130f565b806117ef5760009250505061130f565b61180981610a898468327cb2734119d3b7a9601e1b611d49565b95945050505050565b60055481565b60008061182485611947565b9050806118345782915050610c9b565b600083821161184c576118478483611de4565b611856565b6118568285611de4565b905061186d60055485611d4990919063ffffffff16565b61187982612710611d49565b10156118a357600154600160b81b900460ff161561189b578392505050610c9b565b509050610c9b565b8480156118af57508382115b156118bc57509050610c9b565b841580156118c957508382105b156118d657509050610c9b565b5091949350505050565b6000546001600160a01b0316331461192d576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600555565b600f6020526000908152604090205460ff1681565b6008546000906001600160a01b038381169116141561197e57600954611977906001600160a01b0316600161171e565b9050611a41565b6007546001600160a01b03838116911614156119f0576009546000906119ae906001600160a01b0316600161171e565b600a549091506000906119cb906001600160a01b0316600161171e565b90506119e768327cb2734119d3b7a9601e1b610a898484611d49565b92505050611a41565b6006546001600160a01b0383811691161415611a3d57600954600090611a20906001600160a01b0316600161171e565b600b549091506000906119cb906001600160a01b0316600161171e565b5060005b919050565b600d6020526000908152604090205481565b6000546001600160a01b03163314611aa5576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b03163314611b14576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b6001600160a01b0383166000908152601260205260409020544290611b3b90611c20611cef565b10611b775760405162461bcd60e51b815260040180806020018281038252602d815260200180611f92602d913960400191505060405180910390fd5b6014811115611bc6576040805162461bcd60e51b8152602060048201526016602482015275696e76616c6964205f61646a7573746d656e7442707360501b604482015290519081900360640190fd5b6001600160a01b03929092166000908152601160209081526040808320805460ff191694151594909417909355601081528282209390935560129092529020429055565b6001546001600160a01b031681565b6000546001600160a01b03163314611c66576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b60018054911515600160a81b0260ff60a81b19909216919091179055565b6000546001600160a01b03163314611cd1576040805162461bcd60e51b81526020600482015260196024820152600080516020611fbf833981519152604482015290519081900360640190fd5b60018054911515600160b01b0260ff60b01b19909216919091179055565b600082820183811015610c9b576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b600082611d585750600061130f565b82820282848281611d6557fe5b0414610c9b5760405162461bcd60e51b8152600401808060200182810382526021815260200180611f716021913960400191505060405180910390fd5b6000610c9b83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250611e26565b6000610c9b83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250611ec8565b60008183611eb25760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611e77578181015183820152602001611e5f565b50505050905090810190601f168015611ea45780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581611ebe57fe5b0495945050505050565b60008184841115611f1a5760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315611e77578181015183820152602001611e5f565b50505090039056fe5661756c745072696365466565643a20696e76616c6964205f707269636553616d706c6553706163655661756c745072696365466565643a20636f756c64206e6f74206665746368207072696365536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f775661756c745072696365466565643a2061646a7573746d656e74206672657175656e63792065786365656465645661756c745072696365466565643a20666f7262696464656e00000000000000436861696e6c696e6b20666565647320617265206e6f74206265696e6720757064617465645661756c745072696365466565643a20696e76616c6964205f7370726561644261736973506f696e74735661756c745072696365466565643a20696e76616c69642070726963652066656564a2646970667358221220f3a8cfa5a396198d8f4e96b03524d5ba12c8fa030b61c966d80e0033a1a49b8a64736f6c634300060c0033';

export class VaultPriceFeed__factory extends ContractFactory {
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
  ): Promise<VaultPriceFeed> {
    return super.deploy(overrides || {}) as Promise<VaultPriceFeed>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): VaultPriceFeed {
    return super.attach(address) as VaultPriceFeed;
  }
  connect(signer: Signer): VaultPriceFeed__factory {
    return super.connect(signer) as VaultPriceFeed__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VaultPriceFeedInterface {
    return new utils.Interface(_abi) as VaultPriceFeedInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VaultPriceFeed {
    return new Contract(address, _abi, signerOrProvider) as VaultPriceFeed;
  }
}
