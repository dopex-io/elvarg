import { Address, Hex } from 'viem';

import { create } from 'zustand';

export type BasicStrikeInfo = {
  strike: number;
  tickLower: number;
  tickUpper: number;
};

export type DepositTransaction = {
  strike: number;
  tokenAddress: Address;
  tokenSymbol: string;
  amount: bigint;
  tokenDecimals: number;
  tickLower: number;
  tickUpper: number;
};

// export type DepositTransaction = {
//   strike: number;
//   tokenAddress: Address;
//   positionManager: Address;
//   tokenSymbol: string;
//   amount: bigint;
//   tokenDecimals: number;
//   txData: Hex;
//   tickLower: number;
//   tickUpper: number;
//   depositAmount: bigint;
// };

export type PurchaseTransaction = {
  tickLower: number;
  tickUpper: number;
  strike: number;
  amount: number;
  tokenAddress: Address;
  premium: bigint;
  tokenSymbol: string;
  tokenDecimals: number;
  collateralRequired: bigint;
  error: boolean;
};

type ClammTransactionsStore = {
  deposits: Map<string, DepositTransaction>;
  setDeposit: (key: string, tx: DepositTransaction) => void;
  unsetDeposit: (key: string) => void;
  purchases: Map<string, PurchaseTransaction>;
  setPurchase: (key: string, tx: PurchaseTransaction) => void;
  unsetPurchase: (key: string) => void;
  resetPurchases: () => void;
  resetDeposits: () => void;
};
const useClammTransactionsStore = create<ClammTransactionsStore>(
  (set, get) => ({
    deposits: new Map(),
    purchases: new Map(),
    resetPurchases() {
      set((prev) => ({
        ...prev,
        purchases: new Map(),
      }));
    },
    resetDeposits() {
      set((prev) => ({
        ...prev,
        deposits: new Map(),
      }));
    },
    setPurchase(key, tx) {
      const { purchases } = get();
      purchases.set(key, tx);
      set((prev) => ({
        ...prev,
        purchases: new Map(purchases),
      }));
    },
    setDeposit(key, tx) {
      const { deposits } = get();
      deposits.set(key, tx);
      set((prev) => ({
        ...prev,
        deposits: new Map(deposits),
      }));
    },
    unsetDeposit(key) {
      const { deposits } = get();
      deposits.delete(key);
      set((prev) => ({
        ...prev,
        deposits: new Map(deposits),
      }));
    },
    unsetPurchase(key) {
      const { purchases } = get();
      purchases.delete(key);
      set((prev) => ({
        ...prev,
        purchases: new Map(purchases),
      }));
    },
  }),
);

export default useClammTransactionsStore;
