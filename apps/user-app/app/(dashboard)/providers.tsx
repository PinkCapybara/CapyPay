"use client";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { balanceAtom } from "@repo/store/balance";
import type {
  OnRampTransaction as OnRampTxnType,
  OffRampTransaction as OffRampTxnType,
  P2PTransfer as P2PTransferType,
} from "@repo/store/types";

import {
  onRampTransactionsAtom,
  offRampTransactionsAtom,
  p2pTransfersAtom,
} from "@repo/store/transactions";

interface JotaiProviderProps {
  initialBalance: { amount: number; locked: number };
  onRampTxns?: OnRampTxnType[];
  offRampTxns?: OffRampTxnType[];
  p2pTransfers?: P2PTransferType[];
  children: React.ReactNode;
}

export function JotaiProvider({
  initialBalance,
  onRampTxns,
  offRampTxns,
  p2pTransfers,
  children,
}: JotaiProviderProps) {
  return (
    <Provider>
      <Hydrate
        balance={initialBalance}
        onRampTxns={onRampTxns}
        offRampTxns={offRampTxns}
        p2pTransfers={p2pTransfers}
      />
      {children}
    </Provider>
  );
}

function Hydrate({
  balance,
  onRampTxns,
  offRampTxns,
  p2pTransfers,
}: {
  balance: { amount: number; locked: number };
  onRampTxns?: OnRampTxnType[];
  offRampTxns?: OffRampTxnType[];
  p2pTransfers?: P2PTransferType[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tuples: [any, any][] = [[balanceAtom, balance]];

  if (onRampTxns) tuples.push([onRampTransactionsAtom, onRampTxns]);
  if (offRampTxns) tuples.push([offRampTransactionsAtom, offRampTxns]);
  if (p2pTransfers) tuples.push([p2pTransfersAtom, p2pTransfers]);

  useHydrateAtoms(tuples);

  return null;
}
