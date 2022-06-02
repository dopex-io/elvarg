/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { ITimelock, ITimelockInterface } from '../ITimelock';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
    ],
    name: 'disableLeverage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
    ],
    name: 'enableLeverage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_target',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_handler',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_isActive',
        type: 'bool',
      },
    ],
    name: 'managedSetHandler',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_target',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_minter',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_isActive',
        type: 'bool',
      },
    ],
    name: 'managedSetMinter',
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
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_isLeverageEnabled',
        type: 'bool',
      },
    ],
    name: 'setIsLeverageEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_target',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_gov',
        type: 'address',
      },
    ],
    name: 'signalSetGov',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export class ITimelock__factory {
  static readonly abi = _abi;
  static createInterface(): ITimelockInterface {
    return new utils.Interface(_abi) as ITimelockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITimelock {
    return new Contract(address, _abi, signerOrProvider) as ITimelock;
  }
}
