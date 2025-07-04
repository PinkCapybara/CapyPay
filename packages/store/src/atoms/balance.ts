import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

export const balanceAtom = atom<{ amount: number; locked: number } | null>(null);

export const fetchBalanceAtom = atom(
  null,
  async (get, set, apiPath: string = '/api/balance') => {
    try {
      const response = await fetch(apiPath);
      const { balance } = await response.json();
      set(balanceAtom, {
        amount: balance.amount,
        locked: balance.locked,
      });
      return balance;
    } catch (error) {
      set(balanceAtom, null);
      throw error;
    }
  }
);

// Derived state for UI consumption
export const loadableBalanceAtom = loadable(
  atom(async (get) => {
    const balance = get(balanceAtom);
    if (balance === null) {
      return get(fetchBalanceAtom);
    }
    return balance;
  })
);

// Optimistic update atom
export const updateBalanceAtom = atom(
  null,
  (get, set, updateFn: (current: { amount: number; locked: number } | null) => { amount: number; locked: number } | null) => {
    const current = get(balanceAtom);
    if (current !== null) {
      set(balanceAtom, updateFn(current));
    }
  }
);