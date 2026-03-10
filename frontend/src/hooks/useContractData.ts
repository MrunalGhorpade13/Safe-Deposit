"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchContractData, ContractDetails } from "@/lib/stellar";

export function useContractData(address: string | null) {
    return useQuery<ContractDetails | null>({
        queryKey: ["contractData", address],
        queryFn: async () => {
            if (!address) return null;
            return await fetchContractData(address);
        },
        enabled: !!address,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        refetchOnWindowFocus: false, // Prevent redundant network calls
    });
}
