import { Address, Hex } from 'viem';

import { create } from 'zustand';

export type DepositTransaction = {
  strike: number;
  tokenAddress: Address;
  positionManager: Address;
  tokenSymbol: string;
  amount: bigint;
  tokenDecimals: number;
  txData: Hex;
};

export type PurchaseTransaction = {
  strike: number;
  amount: number;
  tokenAddress: Address;
  optionsPool: Address;
  premium: bigint;
  tokenSymbol: string;
  tokenDecimals: number;
  txData: Hex;
  error: boolean;
};

type ClammTransactionsStore = {
  deposits: Map<number, DepositTransaction>;
  setDeposit: (key: number, tx: DepositTransaction) => void;
  unsetDeposit: (key: number) => void;
  purchases: Map<number, PurchaseTransaction>;
  setPurchase: (key: number, tx: PurchaseTransaction) => void;
  unsetPurchase: (key: number) => void;
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
