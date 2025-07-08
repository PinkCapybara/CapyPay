"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textInput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTranfer";
import { ToastContainer, toast } from 'react-toastify';
import { optimisticBalanceUpdateAtom, fetchBalanceAtom } from "@repo/store/balance";
import { addP2PTransferAtom, fetchP2PTransfersAtom } from "@repo/store/transactions";
import 'react-toastify/dist/ReactToastify.css';
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";

export function SendCard() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [searchMethod, setSearchMethod] = useState<"number" | "email">("number");
    const [isLoading, setIsLoading] = useState(false);
    const updateBalance = useSetAtom(optimisticBalanceUpdateAtom);
    const addP2PTransfer = useSetAtom(addP2PTransferAtom);
    const fetchBalance = useSetAtom(fetchBalanceAtom);
    const fetchP2PTransfers = useSetAtom(fetchP2PTransfersAtom);
    const { data }: any = useSession();
    const userId = data?.user?.id;  

    const handleTransfer = async () => {
        if (!recipient.trim()) {
            toast.error("Please enter recipient information");
            return;
        }

        if (!amount || !/^\d+(\.\d{1,2})?$/.test(amount)) {
            toast.error("Please enter a valid amount (up to 2 decimal places)");
            return;
        }

        const amountValue = Math.round(Number(amount) * 100);
        if (isNaN(amountValue) || amountValue <= 0) {
            toast.error("Amount must be greater than zero");
            return;
        }

        setIsLoading(true);
        
        try {
            addP2PTransfer({
                id: Date.now(),
                time: new Date(),
                amount: amountValue,
                status: "Processing",
                fromUser: { id: userId, name: "...", email: "" },
                toUser: { id: "", name: "...", email: ""}
            });

            updateBalance((current) => ({
                amount: current.amount - amountValue,
                locked: current.locked,
            }));

            const result = await p2pTransfer(recipient, amountValue , searchMethod);

            if (result?.message) {
                toast.success(result.message);

                setRecipient("");
                setAmount("");
            } else {
                toast.error("Transfer completed but no confirmation received");
            }
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred");
            console.log("Transfer Error:", error);
        } finally {
            await fetchBalance();
            await fetchP2PTransfers();
            setIsLoading(false);
        }
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} />      
                <Card title="Send Money">
                    <div className="w-full pt-2 space-y-4">
                        <div className="flex space-x-4">
                            <button
                                className={`px-4 py-2 rounded-lg ${
                                    searchMethod === "number" 
                                        ? "bg-[#6a51a6] text-white" 
                                        : "bg-gray-200"
                                }`}
                                onClick={() => setSearchMethod("number")}
                            >
                                By Number
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg ${
                                    searchMethod === "email" 
                                        ? "bg-[#6a51a6] text-white" 
                                        : "bg-gray-200"
                                }`}
                                onClick={() => setSearchMethod("email")}
                            >
                                By Email
                            </button>
                        </div>

                        <TextInput
                            placeholder={searchMethod === "number" 
                                ? "Phone number" 
                                : "Email address"}
                            label={searchMethod === "number" 
                                ? "Recipient's Phone" 
                                : "Recipient's Email"}
                            value={recipient}
                            onChange={setRecipient}
                        />
                        
                        <TextInput
                            placeholder="Amount"
                            label="Amount (₹)"
                            value={amount}
                            onChange={(value) => {
                               
                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                    setAmount(value);
                                }
                            }}
                        />

                        <div className="pt-4 flex justify-center">
                            <Button 
                                onClick={handleTransfer}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Send Money"}
                            </Button>
                        </div>
                    </div>
                </Card>        
        </div>
    )
}