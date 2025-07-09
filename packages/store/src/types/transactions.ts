export type TxnStatus = "Success" | "Failure" | "Processing";
export type AuthType = "Credentials" | "Google" | "Github";

export interface OnRampTransaction {
  id: number;
  status: TxnStatus;
  token: string;
  provider: string;
  amount: number;
  time: Date;
}

export interface OffRampTransaction {
  id: number;
  status: TxnStatus;
  token: string;
  vpa: string;
  amount: number;
  time: Date;
}

export interface P2PTransfer {
  id: number;
  status: TxnStatus;
  amount: number;
  time: Date;
  fromUser: { id: string; name: string | null; email: string | null };
  toUser: { id: string; name: string | null; email: string | null };
}

export interface Balance {
  amount: number;
  locked: number;
}
