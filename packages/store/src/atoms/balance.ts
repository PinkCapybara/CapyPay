import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

export const balanceAtom = atom<{ amount: number; locked: number }>({amount: 0, locked: 0});

const domain = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const fetchBalanceAtom = atom(
  null,
  async (get, set, apiPath: string = '/api/balance') => {
    try {
      const response = await fetch(domain + apiPath);
      const { balance } = await response.json();

      set(balanceAtom, {
        amount: Number(balance.amount), 
        locked: Number(balance.locked),
      });
      return balance;
    } catch (error) {
      set(balanceAtom, { amount: 0, locked: 0 });
      throw error;
    }
  }
);

// Optimistic update atom
export const optimisticBalanceUpdateAtom = atom(
  null, 
  (get, set, updateFn: (current: { amount: number; locked: number }) => { amount: number; locked: number }) => {
    const current = get(balanceAtom);
    const updated = updateFn(current);
    set(balanceAtom, updated);
  }
);