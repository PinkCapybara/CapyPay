"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textInput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";
import { addOnRampTransactionAtom } from "@repo/store/transactions";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SUPPORTED_BANKS = [{
    id: 1,
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    id: 2,
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const { data }: any = useSession();
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [amount, setAmount] = useState("0");
    const [isLoading, setIsLoading] = useState(false);
    const addOnRampTxn = useSetAtom(addOnRampTransactionAtom);

    const handleAmountChange = (value: string) => {
        // Only allow numbers with up to 2 decimal places
        if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
            setAmount(value);
        }
    };

    const handleAddMoney = async () => {
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
        const tempId = Date.now();

        // Optimistically add the transaction
        if (data?.user?.id) {
            addOnRampTxn({
                id: tempId,
                status: "Processing",
                token: `temp_${tempId}`,
                provider,
                amount:amountValue,
                time: new Date()
            });
        }

        try {
            await createOnRampTransaction(provider, amountValue);
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
            window.open(redirectUrl || "", "_blank");
        }
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} />
            <Card title="Add Money">
                <div className="w-full">
                    <TextInput 
                        label={"Amount (₹)"} 
                        value={amount} 
                        placeholder={"amount"} 
                        onChange={handleAmountChange}
                    />
                    <div className="py-4 text-left">
                        Bank
                    </div>
                    <Select 
                        onSelect={(value) => {
                            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
                        }} 
                        options={SUPPORTED_BANKS.map(x => ({
                            id: x.id,
                            key: x.name,
                            value: x.name
                        }))} 
                    />
                    <div className="flex justify-center pt-4">
                        <Button 
                            onClick={handleAddMoney}
                            disabled={isLoading || !amount || !/^\d+(\.\d{1,2})?$/.test(amount)}
                        >
                            {isLoading ? "Processing..." : "Add Money"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};