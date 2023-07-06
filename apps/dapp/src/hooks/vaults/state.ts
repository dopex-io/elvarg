import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// All currently active SSOVs
export const SSOV_VAULTS: { [key: string]: string } = {
  'ETH-WEEKLY-PUTS-SSOV-V3-3': '0x32449DF9c617C59f576dfC461D03f261F617aD5a',
  'stETH-MONTHLY-CALLS-SSOV-V3': '0x475a5a712b741b9ab992e6af0b9e5adee3d1851b',
  'stETH-WEEKLY-CALLS-SSOV-V3': '0xFca61E79F38a7a82c62f469f55A9df54CB8dF678',
  'DPX-WEEKLY-CALLS-SSOV-V3': '0x10FD85ec522C245a63239b9FC64434F58520bd1f',
  'DPX-WEEKLY-PUTS-SSOV-V3-3': '0xf71b2B6fE3c1d94863e751d6B455f750E714163C',
  'DPX-MONTHLY-CALLS-SSOV-V3-3': '0x05E7ACeD3b7727f9129E6d302B488cd8a1e0C817',
  'rDPX-WEEKLY-CALLS-SSOV-V3': '0xCdaACF37726Bf1017821b5169e22EB34734B28A8',
  'rDPX-MONTHLY-CALLS-SSOV-V3': '0xd74c61ca8917Be73377D74A007E6f002c25Efb4e',
  'rDPX-WEEKLY-PUTS-SSOV-V3-3': '0xb4ec6B4eC9e42A42B0b8cdD3D6df8867546Cf11d',
  'gOHM-WEEKLY-CALLS-SSOV-V3': '0x546cd36F761f1D984eEE1Dbe67cC4F86E75cAF0C',
  'gOHM-WEEKLY-PUTS-SSOV-V3-3': '0x4269AF9076586230bF5fa3655144a5fe9CB877Fd',
  'BTC-WEEKLY-PUTS-SSOV-V3-3': '0xa7507c48d78345475b85bc27B9CE9B84b354CaF7',
  'GMX-WEEKLY-PUTS-SSOV-V3-3': '0xf071F0c56543A2671a2Dfc5FF51d5d858Be91514',
  'CRV-WEEKLY-PUTS-SSOV-V3-3': '0x7C5aC7E4E352B733CF65721d9Fe28A17Da890159',
  'ARB-MONTHLY-CALLS-SSOV-V3': '0xDF3d96299275E2Fb40124b8Ad9d270acFDcc6148',
  'CVX-WEEKLY-PUTS-SSOV-V3': '0x3e138322b86897eDf4Ffc6060Edc0C1220b4F8B0',
};

export const durations = ['WEEKLY', 'MONTHLY'] as const;
export type DurationType = (typeof durations)[number];
export const sides = ['CALL', 'PUT'] as const;
export type Side = (typeof sides)[number];

export interface Vault {
  address: string;
  base: string;
  isPut: boolean;
  durationType: DurationType;
  currentEpoch: number;
  abi?: Object;
  underlyingPrice: number;
}

interface Props {
  vault: Vault;
  update: (vault: Vault) => void;
  updateBase: (base: string) => void;
  activeStrikeIndex: number;
  setActiveStrikeIndex: (index: number) => void;
}

const useVaultState = create<Props>()(
  persist(
    devtools((set) => ({
      vault: {
        address: 'UNKNOWN',
        isPut: false,
        base: 'UNKNOWN',
        durationType: 'WEEKLY',
        currentEpoch: 0,
        underlyingPrice: 0,
      },
      updateUnderlyingPrice: (underlyingPrice: number) =>
        set((prevState) => ({ ...prevState, underlyingPrice })),
      update: (vault: Vault) => set((prevState) => ({ ...prevState, vault })),
      updateBase: (base: string) =>
        set((prevState) => ({ ...prevState, base })),
      activeStrikeIndex: 0,
      setActiveStrikeIndex: (index: number) =>
        set((prevState) => ({ ...prevState, activeStrikeIndex: index })),
    })),
    {
      name: 'dopex-vaults/cache',
    }
  )
);

export default useVaultState;
