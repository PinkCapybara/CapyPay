import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import type {
  OnRampTransaction,
  OffRampTransaction,
  P2PTransfer,
  TxnStatus
} from '../types/transactions';

const domain = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Base atoms
export const onRampTransactionsAtom = atom<OnRampTransaction[]>([]);
export const offRampTransactionsAtom = atom<OffRampTransaction[] >([]);
export const p2pTransfersAtom = atom<P2PTransfer[]>([]);

// Filter atoms
export const pendingOnRampAtom = atom((get) => 
  get(onRampTransactionsAtom)?.filter(t => t.status === "Processing") || []
);

export const successfulOffRampAtom = atom((get) => 
  get(offRampTransactionsAtom)?.filter(t => t.status === "Success") || []
);

// Async fetch actions
export const fetchOnRampTransactionsAtom = atom(
  null,
  async (get, set) => {
    try {
      const res = await fetch(domain + `/api/onRampTxns`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      set(onRampTransactionsAtom, data.transactions);
    } catch (error) {
      console.error("Failed to fetch onramp transactions:", error);
      set(onRampTransactionsAtom, []);
    }
  }
);

export const fetchOffRampTransactionsAtom = atom(
  null,
  async (get, set) => {
    try {
      const res = await fetch(domain + `/api/offRampTxns`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      set(offRampTransactionsAtom, data.transactions);
    } catch (error) {
      console.error("Failed to fetch offramp transactions:", error);
      set(offRampTransactionsAtom, []);
    }
  }
);

export const fetchP2PTransfersAtom = atom(
  null,
  async (get, set) => {
    try {
      const res = await fetch(domain + `/api/p2pTxns`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      set(p2pTransfersAtom, data.transactions);
    } catch (error) {
      console.error("Failed to fetch P2P transfers:", error);
      set(p2pTransfersAtom, []);
    }
  }
);


export const addP2PTransferAtom = atom(
  null,
  (get, set, transfer: P2PTransfer) => {
    const current = get(p2pTransfersAtom);
    set(p2pTransfersAtom, [transfer, ...current]);
  }
);

export const addOnRampTransactionAtom = atom(
  null,
  (get, set, transaction: OnRampTransaction) => {
    const current = get(onRampTransactionsAtom);
    set(onRampTransactionsAtom, [transaction, ...current]);
  }
);

export const addOffRampTransactionAtom = atom(
  null,
  (get, set, transaction: OffRampTransaction) => {
    const current = get(offRampTransactionsAtom);
    set(offRampTransactionsAtom, [transaction, ...current]);
  }
);