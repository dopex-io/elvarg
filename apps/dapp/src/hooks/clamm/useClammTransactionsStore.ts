import { Address, Hex } from 'viem';

import { create } from 'zustand';

type ApprovalRequired = {
  address: Address;
  amount: bigint;
};

type DepositTransaction = {
  amount: bigint;
  symbol: string;
  txData: Hex;
};

type PurchaseTransaction = {
  amountOfOptions: string;
  premium: bigint;
  symbol: bigint;
  txData: bigint;
};

type ClammTransactionsStore = {
  approvals: Map<number, ApprovalRequired>;
  setApproval: (key: number, approvalRequired: ApprovalRequired) => void;
  unsetApproval: (key: number) => void;
  deposits: Map<number, DepositTransaction>;
  setDeposit: (key: number, tx: DepositTransaction) => void;
  unsetDeposit: (key: number) => void;
  purchases: Map<number, PurchaseTransaction>;
  setPurchase: (key: number, tx: PurchaseTransaction) => void;
  unsetPurchase: (key: number) => void;
};
const useClammTransactionsStore = create<ClammTransactionsStore>(
  (set, get) => ({
    approvals: new Map(),
    deposits: new Map(),
    purchases: new Map(),
    setPurchase(key, tx) {
      const { purchases } = get();
      purchases.set(key, tx);
      set((prev) => ({
        ...prev,
        purchases,
      }));
    },
    setDeposit(key, tx) {
      const { deposits } = get();
      deposits.set(key, tx);
      set((prev) => ({
        ...prev,
        deposits,
      }));
    },
    unsetDeposit(key) {
      const { deposits } = get();
      deposits.delete(key);
      set((prev) => ({
        ...prev,
        deposits,
      }));
    },
    unsetPurchase(key) {
      const { purchases } = get();
      purchases.delete(key);
      set((prev) => ({
        ...prev,
        purchases,
      }));
    },
    unsetApproval(key) {
      const { approvals } = get();
      approvals.delete(key);
      set((prev) => ({
        ...prev,
        approvals,
      }));
    },
    setApproval: (key: number, approvalRequired: ApprovalRequired) => {
      const { approvals } = get();
      approvals.set(key, {
        address: approvalRequired.address,
        amount: approvalRequired.amount,
      });
      set((prev) => ({
        ...prev,
        approvals: approvals,
      }));
    },
  }),
);

export default useClammTransactionsStore;
