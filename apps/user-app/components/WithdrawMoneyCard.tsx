"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { TextInput } from "@repo/ui/textInput";
import { createOfframpTransaction } from "../app/lib/actions/createOfframpTransaction";
import { addOffRampTransactionAtom } from "@repo/store/transactions";
import { optimisticBalanceUpdateAtom } from "@repo/store/balance";
import { useSetAtom } from "jotai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const WithdrawMoney = () => {
  const [vpa, setVpa] = useState("");
  const [amount, setAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const addOffRampTxn = useSetAtom(addOffRampTransactionAtom);
  const updateBalance = useSetAtom(optimisticBalanceUpdateAtom);

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleVpaChange = (value: string) => {
    setVpa(value);
  };

  const handleWithdraw = async () => {
    if (!amount || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      toast.error("Please enter a valid amount (up to 2 decimal places)");
      return;
    }

    const amountValue = Math.round(Number(amount) * 100);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    // Validate VPA
    if (!vpa || !/^[\w.-]+@[\w.-]+$/.test(vpa)) {
      toast.error("Please enter a valid VPA address (format: name@provider)");
      return;
    }

    setIsLoading(true);

    try {
      const txn = await createOfframpTransaction(amountValue, vpa);

      addOffRampTxn({
        ...txn,
        time: txn.startTime,
      });

      updateBalance((current) => ({
        amount: current.amount - amountValue,
        locked: current.locked + amountValue,
      }));

      toast.success("Withdrawal successful! Funds will be transferred shortly");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <Card title="Withdraw Money">
        <div className="w-full">
          <TextInput
            label={"Amount (₹)"}
            value={amount}
            placeholder={"amount"}
            onChange={handleAmountChange}
          />
          <TextInput
            label={"VPA Address"}
            value={vpa}
            placeholder={"yourname@upi"}
            onChange={handleVpaChange}
            // className="mt-4"
          />
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleWithdraw}
              disabled={isLoading || !amount || !vpa}
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
