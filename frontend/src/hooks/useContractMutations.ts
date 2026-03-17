"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { nativeToScVal } from "@stellar/stellar-sdk";
import { invokeContractFunction, addressVal, xlmToStroops } from "@/lib/stellar";
import { useWallet } from "@/context/WalletContext";
import { TOKEN_ID, FEE_COLLECTOR_ID } from "@/lib/constants";

export function useLockDeposit() {
    const { address } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tenant, landlord, amount }: { tenant: string, landlord: string, amount: number }) => {
            if (!address) throw new Error("Wallet not connected");
            toast.info("Please sign the transaction in Freighter...", { autoClose: 3000 });

            const args = [
                addressVal(tenant),
                addressVal(landlord),
                nativeToScVal(xlmToStroops(amount), { type: "i128" }),
                addressVal(TOKEN_ID),
                addressVal(FEE_COLLECTOR_ID)
            ];

            const txHash = await invokeContractFunction(address, "lock_deposit", args);
            return { tenant, landlord, amount, txHash };
        },
        onSuccess: (variables, { tenant }) => {
            toast.success("Deposit locked successfully!");
            queryClient.invalidateQueries({ queryKey: ["contractData", tenant] });
        },
        onError: (error: Error) => {
            toast.error(`Transaction failed: ${error.message}`);
        }
    });
}

export function useProposeDeduction() {
    const { address } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ amount }: { tenant: string, amount: number }) => {
            if (!address) throw new Error("Wallet not connected");
            toast.info("Please sign the transaction in Freighter...", { autoClose: 3000 });

            const args = [
                addressVal(address),
                nativeToScVal(xlmToStroops(amount), { type: "i128" })
            ];

            const txHash = await invokeContractFunction(address, "propose_deduction", args);
            return { amount, txHash };
        },
        onSuccess: (variables, { tenant }) => {
            toast.success("Deduction proposed successfully!");
            queryClient.invalidateQueries({ queryKey: ["contractData", tenant] });
        },
        onError: (error: Error) => {
            toast.error(`Transaction failed: ${error.message}`);
        }
    });
}

export function useApproveRelease() {
    const { address } = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tenant }: { tenant: string }) => {
            if (!address) throw new Error("Wallet not connected");
            toast.info("Please sign the transaction in Freighter...", { autoClose: 3000 });

            const args = [
                addressVal(tenant)
            ];

            const txHash = await invokeContractFunction(address, "approve_and_release", args);
            return { txHash };
        },
        onSuccess: (_, { tenant }) => {
            toast.success("Funds released successfully!");
            queryClient.invalidateQueries({ queryKey: ["contractData", tenant] });
        },
        onError: (error: Error) => {
            toast.error(`Transaction failed: ${error.message}`);
        }
    });
}
