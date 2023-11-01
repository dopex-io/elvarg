import { Address, Hex } from 'viem';

import { create } from 'zustand';

type DepositTransaction = {
  tokenAddress: Address;
  positionManager: Address;
  tokenSymbol: string;
  amount: bigint;
  txData: Hex;
};

type PurchaseTransaction = {
  tokenAddress: Address;
  optionsPool: Address;
  premium: bigint;
  tokenSymbol: string;
  txData: Hex;
};

type ClammTransactionsStore = {
  deposits: Map<number, DepositTransaction>;
  setDeposit: (key: number, tx: DepositTransaction) => void;
  unsetDeposit: (key: number) => void;
  purchases: Map<number, PurchaseTransaction>;
  setPurchase: (key: number, tx: PurchaseTransaction) => void;
  unsetPurchase: (key: number) => void;
};
const useClammTransactionsStore = create<ClammTransactionsStore>(
  (set, get) => ({
    deposits: new Map(),
    purchases: new Map(),
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
