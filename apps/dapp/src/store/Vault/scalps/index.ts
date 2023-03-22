import { BigNumber, ethers } from 'ethers';

import { StateCreator } from 'zustand';

import { CommonSlice } from 'store/Vault/common';
import { WalletSlice } from 'store/Wallet';

export interface optionScalpData {
  optionScalpContract: any | undefined;
  quoteLpContract: any | undefined;
  baseLpContract: any | undefined;
  minimumMargin: BigNumber;
  feeOpenPosition: BigNumber;
  minimumAbsoluteLiquidationThreshold: BigNumber;
  maxSize: BigNumber;
  maxOpenInterest: BigNumber;
  longOpenInterest: BigNumber;
  shortOpenInterest: BigNumber;
  markPrice: BigNumber;
  totalQuoteDeposits: BigNumber;
  totalQuoteAvailable: BigNumber;
  totalBaseDeposits: BigNumber;
  totalBaseAvailable: BigNumber;
  quoteLpValue: BigNumber;
  baseLpValue: BigNumber;
  quoteDecimals: BigNumber;
  baseDecimals: BigNumber;
  quoteSymbol: string;
  baseSymbol: string;
  inverted: boolean;
}

export interface ScalpPosition {
  id: BigNumber;
  isOpen: boolean;
  isShort: boolean;
  size: BigNumber;
  positions: BigNumber;
  amountBorrowed: BigNumber;
  amountOut: BigNumber;
  entry: BigNumber;
  margin: BigNumber;
  premium: BigNumber;
  fees: BigNumber;
  pnl: BigNumber;
  openedAt: BigNumber;
  timeframe: BigNumber;
  liquidationPrice: BigNumber;
}
export interface optionScalpUserData {
  scalpPositions?: ScalpPosition[];
}

export interface OptionScalpSlice {
  optionScalpData?: optionScalpData | undefined;
  optionScalpUserData?: optionScalpUserData;
  updateOptionScalpUserData: Function;
  updateOptionScalp: Function;
  setSelectedPoolName?: Function;
  getOptionScalpContract: Function;
  getBaseLpContract: Function;
  getQuoteLpContract: Function;
  getScalpPosition: Function;
  calcPnl: Function;
  calcLiqPrice: Function;
  uniPrice: BigNumber;
  setUniPrice: Function;
}

export const createOptionScalpSlice: StateCreator<
  OptionScalpSlice & WalletSlice & CommonSlice,
  [['zustand/devtools', never]],
  [],
  OptionScalpSlice
> = (set, get) => ({
  setUniPrice: (uniPrice: BigNumber) => {
    set((prevState) => ({ ...prevState, uniPrice }));
  },
  uniPrice: BigNumber.from(0),
  optionScalpUserData: {},
  getOptionScalpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_base',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_quote',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_baseDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_quoteDecimals',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: '_uniswapV3Router',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_gmxHelper',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'maxSize',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxOpenInterest',
                type: 'uint256',
              },
              {
                internalType: 'contract IOptionPricing',
                name: 'optionPricing',
                type: 'address',
              },
              {
                internalType: 'contract IVolatilityOracle',
                name: 'volatilityOracle',
                type: 'address',
              },
              {
                internalType: 'contract IPriceOracle',
                name: 'priceOracle',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'insuranceFund',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minimumMargin',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'feeOpenPosition',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'minimumAbsoluteLiquidationThreshold',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'withdrawTimeout',
                type: 'uint256',
              },
            ],
            internalType: 'struct OptionScalp.Configuration',
            name: 'config',
            type: 'tuple',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'ContractNotPaused',
        type: 'error',
      },
      {
        inputs: [],
        name: 'ContractPaused',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'int256',
            name: 'pnl',
            type: 'int256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
        ],
        name: 'ClosePosition',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'bool',
            name: 'isQuote',
            type: 'bool',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'EmergencyWithdraw',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'size',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
        ],
        name: 'OpenPosition',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
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
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'bool',
            name: 'isQuote',
            type: 'bool',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'Withdraw',
        type: 'event',
      },
      {
        inputs: [],
        name: 'base',
        outputs: [
          {
            internalType: 'contract IERC20',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'baseDecimals',
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
        name: 'baseLp',
        outputs: [
          {
            internalType: 'contract ScalpLP',
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
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'calcFees',
        outputs: [
          {
            internalType: 'uint256',
            name: 'fees',
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
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'calcPnl',
        outputs: [
          {
            internalType: 'int256',
            name: 'pnl',
            type: 'int256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'strike',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timeToExpiry',
            type: 'uint256',
          },
        ],
        name: 'calcPremium',
        outputs: [
          {
            internalType: 'uint256',
            name: 'premium',
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
        name: 'claimCollateral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'closePosition',
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
        name: 'cumulativePnl',
        outputs: [
          {
            internalType: 'int256',
            name: '',
            type: 'int256',
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
        name: 'cumulativeVolume',
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
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isQuote',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'deposit',
        outputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'divisor',
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
            internalType: 'address[]',
            name: 'tokens',
            type: 'address[]',
          },
          {
            internalType: 'bool',
            name: 'transferNative',
            type: 'bool',
          },
        ],
        name: 'emergencyWithdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'feeOpenPosition',
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
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'getLiquidationPrice',
        outputs: [
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getMarkPrice',
        outputs: [
          {
            internalType: 'uint256',
            name: 'price',
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
            name: 'strike',
            type: 'uint256',
          },
        ],
        name: 'getVolatility',
        outputs: [
          {
            internalType: 'uint256',
            name: 'volatility',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'gmxHelper',
        outputs: [
          {
            internalType: 'contract IGmxHelper',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'insuranceFund',
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
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'isLiquidatable',
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
        name: 'maxOpenInterest',
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
        name: 'maxSize',
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
        name: 'minimumAbsoluteLiquidationThreshold',
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
        name: 'minimumMargin',
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
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        name: 'openInterest',
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
            internalType: 'bool',
            name: 'isShort',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timeframeIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'margin',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'entryLimit',
            type: 'uint256',
          },
        ],
        name: 'openPosition',
        outputs: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'entry',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'optionPricing',
        outputs: [
          {
            internalType: 'contract IOptionPricing',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
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
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'positionsOfOwner',
        outputs: [
          {
            internalType: 'uint256[]',
            name: 'tokenIds',
            type: 'uint256[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'priceOracle',
        outputs: [
          {
            internalType: 'contract IPriceOracle',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'quote',
        outputs: [
          {
            internalType: 'contract IERC20',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'quoteDecimals',
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
        name: 'quoteLp',
        outputs: [
          {
            internalType: 'contract ScalpLP',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'scalpPositionMinter',
        outputs: [
          {
            internalType: 'contract ScalpPositionMinter',
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
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'scalpPositions',
        outputs: [
          {
            internalType: 'bool',
            name: 'isOpen',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isShort',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'size',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'positions',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountBorrowed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountOut',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'entry',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'margin',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'premium',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fees',
            type: 'uint256',
          },
          {
            internalType: 'int256',
            name: 'pnl',
            type: 'int256',
          },
          {
            internalType: 'uint256',
            name: 'openedAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timeframe',
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
            name: '',
            type: 'uint256',
          },
        ],
        name: 'timeframes',
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
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'uniswapV3Router',
        outputs: [
          {
            internalType: 'contract IUniswapV3Router',
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
            components: [
              {
                internalType: 'uint256',
                name: 'maxSize',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxOpenInterest',
                type: 'uint256',
              },
              {
                internalType: 'contract IOptionPricing',
                name: 'optionPricing',
                type: 'address',
              },
              {
                internalType: 'contract IVolatilityOracle',
                name: 'volatilityOracle',
                type: 'address',
              },
              {
                internalType: 'contract IPriceOracle',
                name: 'priceOracle',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'insuranceFund',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'minimumMargin',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'feeOpenPosition',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'minimumAbsoluteLiquidationThreshold',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'withdrawTimeout',
                type: 'uint256',
              },
            ],
            internalType: 'struct OptionScalp.Configuration',
            name: 'config',
            type: 'tuple',
          },
        ],
        name: 'updateConfig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'volatilityOracle',
        outputs: [
          {
            internalType: 'contract IVolatilityOracle',
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
            internalType: 'bool',
            name: 'isQuote',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'withdraw',
        outputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'withdrawTimeout',
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
    ];

    return new ethers.Contract(
      selectedPoolName === 'ETH'
        ? '0xeDe5aD2D3c1E774DFE3EAb2CAFecF2e8347c9635'
        : '0x',
      abi,
      provider
    );
  },
  getQuoteLpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_scalp',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_collateral',
            type: 'address',
          },
          {
            internalType: 'string',
            name: '_collateralSymbol',
            type: 'string',
          },
        ],
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
            name: 'amount',
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
            indexed: true,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'Deposit',
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
            name: 'amount',
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
            indexed: true,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'Withdraw',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
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
        name: '_lockedLiquidity',
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
        name: '_totalAssets',
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
            name: 'proceeds',
            type: 'uint256',
          },
        ],
        name: 'addProceeds',
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
          {
            internalType: 'address',
            name: '',
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
        inputs: [],
        name: 'asset',
        outputs: [
          {
            internalType: 'contract ERC20',
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
        inputs: [],
        name: 'collateral',
        outputs: [
          {
            internalType: 'contract ERC20',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'collateralSymbol',
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'convertToAssets',
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
            name: 'assets',
            type: 'uint256',
          },
        ],
        name: 'convertToShares',
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
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'deposit',
        outputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
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
        name: 'lockLiquidity',
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
        name: 'maxDeposit',
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
        name: 'maxMint',
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
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'maxRedeem',
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
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'maxWithdraw',
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
            name: 'shares',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'mint',
        outputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
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
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'nonces',
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
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
        name: 'previewDeposit',
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
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'previewMint',
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
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'previewRedeem',
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
            name: 'assets',
            type: 'uint256',
          },
        ],
        name: 'previewWithdraw',
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
            name: 'shares',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'redeem',
        outputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'scalp',
        outputs: [
          {
            internalType: 'contract OptionScalp',
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
            internalType: 'uint256',
            name: 'loss',
            type: 'uint256',
          },
        ],
        name: 'subtractLoss',
        outputs: [],
        stateMutability: 'nonpayable',
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
        name: 'totalAssets',
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
        name: 'totalAvailableAssets',
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
            name: 'to',
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
            name: 'from',
            type: 'address',
          },
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
        name: 'underlyingSymbol',
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'unlockLiquidity',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'withdraw',
        outputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    return new ethers.Contract(
      selectedPoolName === 'ETH'
        ? '0x7e9c9b61df3ab2d182d6686b5de2a9ee3e401609'
        : '0x',
      abi,
      provider
    );
  },
  getBaseLpContract: () => {
    const { selectedPoolName, provider } = get();

    if (!selectedPoolName || !provider) return;

    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_scalp',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_collateral',
            type: 'address',
          },
          {
            internalType: 'string',
            name: '_collateralSymbol',
            type: 'string',
          },
        ],
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
            name: 'amount',
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
            indexed: true,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'Deposit',
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
            name: 'amount',
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
            indexed: true,
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'Withdraw',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
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
        name: '_lockedLiquidity',
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
        name: '_totalAssets',
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
            name: 'proceeds',
            type: 'uint256',
          },
        ],
        name: 'addProceeds',
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
          {
            internalType: 'address',
            name: '',
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
        inputs: [],
        name: 'asset',
        outputs: [
          {
            internalType: 'contract ERC20',
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
        inputs: [],
        name: 'collateral',
        outputs: [
          {
            internalType: 'contract ERC20',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'collateralSymbol',
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'convertToAssets',
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
            name: 'assets',
            type: 'uint256',
          },
        ],
        name: 'convertToShares',
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
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'deposit',
        outputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
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
        name: 'lockLiquidity',
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
        name: 'maxDeposit',
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
        name: 'maxMint',
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
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'maxRedeem',
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
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'maxWithdraw',
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
            name: 'shares',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'mint',
        outputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
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
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'nonces',
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
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
        name: 'previewDeposit',
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
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'previewMint',
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
            name: 'shares',
            type: 'uint256',
          },
        ],
        name: 'previewRedeem',
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
            name: 'assets',
            type: 'uint256',
          },
        ],
        name: 'previewWithdraw',
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
            name: 'shares',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'redeem',
        outputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'scalp',
        outputs: [
          {
            internalType: 'contract OptionScalp',
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
            internalType: 'uint256',
            name: 'loss',
            type: 'uint256',
          },
        ],
        name: 'subtractLoss',
        outputs: [],
        stateMutability: 'nonpayable',
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
        name: 'totalAssets',
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
        name: 'totalAvailableAssets',
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
            name: 'to',
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
            name: 'from',
            type: 'address',
          },
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
        name: 'underlyingSymbol',
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'unlockLiquidity',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'assets',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'withdraw',
        outputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    return new ethers.Contract(
      selectedPoolName === 'ETH'
        ? '0x23e115dbc797ee28eef70d02e0d711fa9f4b5f0a'
        : '0x',
      abi,
      provider
    );
  },
  getScalpPosition: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();
    const optionScalpContract = getOptionScalpContract();
    return await optionScalpContract!['scalpPositions'](id);
  },
  calcPnl: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();

    const optionScalpContract = getOptionScalpContract();
    return await optionScalpContract.calcPnl(id);
  },
  calcLiqPrice: async (id: BigNumber) => {
    const { getOptionScalpContract } = get();

    const optionScalpContract = getOptionScalpContract();
    try {
      return await optionScalpContract.getLiquidationPrice(id);
    } catch (e) {
      return BigNumber.from('0');
    }
  },
  updateOptionScalpUserData: async () => {
    const {
      accountAddress,
      getOptionScalpContract,
      getScalpPosition,
      calcPnl,
      calcLiqPrice,
    } = get();

    const optionScalpContract = await getOptionScalpContract();

    let scalpPositionsIndexes: any = [];

    try {
      scalpPositionsIndexes = await optionScalpContract['positionsOfOwner'](
        accountAddress
      );
    } catch (err) {}

    const scalpPositionsPromises: any[] = [];
    const pnlsPromises: any[] = [];
    const liquidationPricesPromises: any[] = [];

    for (let i in scalpPositionsIndexes) {
      scalpPositionsPromises.push(getScalpPosition(scalpPositionsIndexes[i]));
      pnlsPromises.push(calcPnl(scalpPositionsIndexes[i]));
      liquidationPricesPromises.push(calcLiqPrice(scalpPositionsIndexes[i]));
    }

    let scalpPositions: ScalpPosition[] = await Promise.all(
      scalpPositionsPromises
    );

    let pnls: BigNumber[] = await Promise.all(pnlsPromises);

    let liquidationPrices: BigNumber[] = await Promise.all(
      liquidationPricesPromises
    );

    scalpPositions = scalpPositions.map((position, index) => ({
      ...position,
      id: scalpPositionsIndexes[index],
      pnl: pnls[index]!.sub(position.premium).sub(position.fees),
      liquidationPrice: liquidationPrices[index]!,
    }));

    set((prevState) => ({
      ...prevState,
      optionScalpUserData: {
        ...prevState.optionScalpUserData,
        scalpPositions: scalpPositions,
      },
    }));
  },
  updateOptionScalp: async () => {
    const {
      getOptionScalpContract,
      getQuoteLpContract,
      getBaseLpContract,
      selectedPoolName,
    } = get();

    const optionScalpContract = getOptionScalpContract();
    const quoteLpContract = getQuoteLpContract();
    const baseLpContract = getBaseLpContract();

    const [
      minimumMargin,
      feeOpenPosition,
      minimumAbsoluteLiquidationThreshold,
      maxSize,
      maxOpenInterest,
      longOpenInterest,
      shortOpenInterest,
      markPrice,
      totalQuoteDeposits,
      totalBaseDeposits,
      totalQuoteAvailable,
      totalBaseAvailable,
      quoteSupply,
      baseSupply,
    ] = await Promise.all([
      optionScalpContract!['minimumMargin'](),
      optionScalpContract!['feeOpenPosition'](),
      optionScalpContract!['minimumAbsoluteLiquidationThreshold'](),
      optionScalpContract!['maxSize'](),
      optionScalpContract!['maxOpenInterest'](),
      optionScalpContract!['openInterest'](false),
      optionScalpContract!['openInterest'](true),
      optionScalpContract!['getMarkPrice'](),
      quoteLpContract!['totalAssets'](),
      baseLpContract!['totalAssets'](),
      quoteLpContract!['totalAvailableAssets'](),
      baseLpContract!['totalAvailableAssets'](),
      quoteLpContract!['totalSupply'](),
      baseLpContract!['totalSupply'](),
    ]);

    const quoteDecimals: BigNumber =
      selectedPoolName === 'ETH' ? BigNumber.from('6') : BigNumber.from('18');
    const baseDecimals: BigNumber =
      selectedPoolName === 'ETH' ? BigNumber.from('18') : BigNumber.from('8');

    const quoteLpValue: BigNumber = quoteSupply.gt(0)
      ? BigNumber.from((10 ** quoteDecimals.toNumber()).toString())
          .mul(totalQuoteDeposits)
          .div(quoteSupply)
      : BigNumber.from('0');

    const baseLpValue: BigNumber = baseSupply.gt(0)
      ? BigNumber.from((10 ** baseDecimals.toNumber()).toString())
          .mul(totalBaseDeposits)
          .div(baseSupply)
      : BigNumber.from('0');

    set((prevState) => ({
      ...prevState,
      optionScalpData: {
        optionScalpContract: optionScalpContract,
        quoteLpContract: quoteLpContract,
        baseLpContract: baseLpContract,
        minimumMargin: minimumMargin,
        feeOpenPosition: feeOpenPosition,
        minimumAbsoluteLiquidationThreshold:
          minimumAbsoluteLiquidationThreshold,
        maxSize: maxSize,
        maxOpenInterest: maxOpenInterest,
        longOpenInterest: longOpenInterest,
        shortOpenInterest: shortOpenInterest,
        markPrice: markPrice,
        totalQuoteDeposits: totalQuoteDeposits,
        totalBaseDeposits: totalBaseDeposits,
        totalQuoteAvailable: totalQuoteAvailable,
        totalBaseAvailable: totalBaseAvailable,
        quoteLpValue: quoteLpValue,
        baseLpValue: baseLpValue,
        quoteDecimals: quoteDecimals,
        baseDecimals: baseDecimals,
        quoteSymbol: selectedPoolName === 'ETH' ? 'USDC' : 'WETH',
        baseSymbol: selectedPoolName === 'ETH' ? 'WETH' : 'WBTC',
        inverted: selectedPoolName === 'BTC',
      },
    }));
  },
});
