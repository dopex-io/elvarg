import { SsovMarket } from 'types/ssov';

export const MARKETS: { [key: string]: SsovMarket } = {
  ETH: {
    vaults: [
      {
        symbol: 'ETH-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'ETH',
        collateralTokenAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
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
        collateralTokenAddress: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
        address: '0x10FD85ec522C245a63239b9FC64434F58520bd1f',
      },
      {
        symbol: 'DPX-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'DPX',
        collateralTokenAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
        address: '0xf71b2B6fE3c1d94863e751d6B455f750E714163C',
      },
      {
        symbol: 'DPX-MONTHLY-CALLS-SSOV-V3-3',
        isPut: false,
        duration: 'MONTHLY',
        underlyingSymbol: 'DPX',
        collateralTokenAddress: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
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
        collateralTokenAddress: '0x32Eb7902D4134bf98A28b963D26de779AF92A212',
        address: '0xCdaACF37726Bf1017821b5169e22EB34734B28A8',
      },
      {
        symbol: 'rDPX-WEEKLY-PUTS-SSOV-V3-3',
        isPut: true,
        duration: 'WEEKLY',
        underlyingSymbol: 'rDPX',
        collateralTokenAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
        address: '0xb4ec6B4eC9e42A42B0b8cdD3D6df8867546Cf11d',
      },
      {
        symbol: 'rDPX-WEEKLY-CALLS-SSOV-V3',
        isPut: false,
        duration: 'MONTHLY',
        underlyingSymbol: 'rDPX',
        collateralTokenAddress: '0x32Eb7902D4134bf98A28b963D26de779AF92A212',
        address: '0xd74c61ca8917Be73377D74A007E6f002c25Efb4e',
      },
    ],
    default: {
      isPut: false,
      duration: 'WEEKLY',
    },
  },
};

export const FALLBACK_SLUG = '/straddles/ETH';

export const MARKETS_MENU = Object.keys(MARKETS).map((key) => ({
  textContent: key,
  isDisabled: false,
}));
