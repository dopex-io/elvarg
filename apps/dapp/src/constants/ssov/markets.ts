import { SsovMarket } from 'types/ssov';

export const MARKETS: { [key: string]: SsovMarket } = {
  ARB: {
    vaults: [
      {
        symbol: 'ARB-MONTHLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'MONTHLY',
        underlyingSymbol: 'ARB',
        address: '0xDF3d96299275E2Fb40124b8Ad9d270acFDcc6148',
      },
    ],
    default: {
      isPut: false,
      duration: 'MONTHLY',
    },
  },
  STETH: {
    vaults: [
      {
        symbol: 'stETH-MONTHLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'MONTHLY',
        underlyingSymbol: 'stETH',
        address: '0x475a5a712b741b9ab992e6af0b9e5adee3d1851b',
      },
      {
        symbol: 'stETH-WEEKLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'WEEKLY',
        underlyingSymbol: 'stETH',
        address: '0xFca61E79F38a7a82c62f469f55A9df54CB8dF678',
      },
    ],
    default: {
      isPut: false,
      duration: 'MONTHLY',
    },
  },
  ETH: {
    vaults: [
      {
        symbol: 'ETH-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'ETH',
        address: '0x32449DF9c617C59f576dfC461D03f261F617aD5a',
      },
    ],
    default: {
      isPut: true,
      duration: 'WEEKLY',
    },
  },
  DPX: {
    vaults: [
      {
        symbol: 'DPX-WEEKLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'WEEKLY',
        underlyingSymbol: 'DPX',
        address: '0x10FD85ec522C245a63239b9FC64434F58520bd1f',
      },
      {
        symbol: 'DPX-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'DPX',
        address: '0xf71b2B6fE3c1d94863e751d6B455f750E714163C',
      },
      {
        symbol: 'DPX-MONTHLY-CALLS-SSOV-V3-3',
        isPut: false,
        duration: 'MONTHLY',
        underlyingSymbol: 'DPX',
        address: '0x05E7ACeD3b7727f9129E6d302B488cd8a1e0C817',
      },
    ],
    default: {
      isPut: false,
      duration: 'WEEKLY',
    },
  },
  RDPX: {
    vaults: [
      {
        symbol: 'rDPX-WEEKLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'WEEKLY',
        underlyingSymbol: 'rDPX',
        address: '0xCdaACF37726Bf1017821b5169e22EB34734B28A8',
      },
      {
        symbol: 'rDPX-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'rDPX',
        address: '0xb4ec6B4eC9e42A42B0b8cdD3D6df8867546Cf11d',
      },
      {
        symbol: 'rDPX-WEEKLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'MONTHLY',
        underlyingSymbol: 'rDPX',
        address: '0xd74c61ca8917Be73377D74A007E6f002c25Efb4e',
      },
    ],
    default: {
      isPut: false,
      duration: 'WEEKLY',
    },
  },
  BTC: {
    vaults: [
      {
        symbol: 'BTC-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'WBTC',
        address: '0xa7507c48d78345475b85bc27B9CE9B84b354CaF7',
      },
    ],
    default: {
      isPut: true,
      duration: 'WEEKLY',
    },
  },
  GMX: {
    vaults: [
      {
        symbol: 'GMX-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'GMX',
        address: '0xf071F0c56543A2671a2Dfc5FF51d5d858Be91514',
      },
    ],
    default: {
      isPut: true,
      duration: 'WEEKLY',
    },
  },
  CRV: {
    vaults: [
      {
        symbol: 'CRV-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'CRV',
        address: '0x7C5aC7E4E352B733CF65721d9Fe28A17Da890159',
      },
    ],
    default: {
      isPut: true,
      duration: 'WEEKLY',
    },
  },
  CVX: {
    vaults: [
      {
        symbol: 'CVX-WEEKLY-PUTS-SSOV-V3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'CVX',
        address: '0x3e138322b86897eDf4Ffc6060Edc0C1220b4F8B0',
      },
    ],
    default: {
      isPut: true,
      duration: 'WEEKLY',
    },
  },
};

export const MARKETS_MENU = Object.keys(MARKETS).map((key) => ({
  textContent: key,
  isDisabled: false,
}));
