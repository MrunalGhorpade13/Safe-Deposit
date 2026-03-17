import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/lib/stellar";
import { CONTRACT_ID } from "@/lib/constants";

export function useContractEvents(address: string | null) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!address) return;

        let isPolling = true;
        let lastLedger = 0;

        const pollEvents = async () => {
            while (isPolling) {
                try {
                    // We only check for new events if we know what ledger to start from.
                    // For a robust implementation we might track the last seen cursor
                    // or query from recent history. Here we poll getEvents.
                    // and use 'startLedger' or 'cursor' but not both.
                    const requestConfig: any = {
                        filters: [
                            {
                                type: "contract",
                                contractIds: [CONTRACT_ID],
                                topics: [["*"]],
                            },
                        ],
                        limit: 10,
                    };
                    
                    if (lastLedger > 0) {
                        requestConfig.startLedger = lastLedger;
                    }

                    const eventsResponse = await server.getEvents(requestConfig);

                    // The generic response type might lack 'records' property typing depending on the SDK version,
                    // so we safely typecast the response.
                    const response = eventsResponse as any;

                    if (response.records && response.records.length > 0) {
                        const newEvents = response.records.filter((record: any) => {
                            // Check if the event topics match our known events
                            const topicStr = record.topic.map((t: any) => t.toString()).join(",");
                            return (
                                topicStr.includes("DepositLocked") ||
                                topicStr.includes("DeductionProposed") ||
                                topicStr.includes("DepositReleased")
                            );
                        });

                        if (newEvents.length > 0) {
                            // Invalidate react-query cache to refetch the contract state and trigger re-render
                            queryClient.invalidateQueries({ queryKey: ["contractData", address] });
                            
                            // Update last seen ledger to avoid duplicate processing
                            lastLedger = parseInt(newEvents[newEvents.length - 1].ledger, 10) + 1;
                        } else if (response.records.length > 0) {
                            lastLedger = parseInt(response.records[response.records.length - 1].ledger, 10) + 1;
                        }
                    }
                } catch (error) {
                    // Silently fail polling to prevent console spam on network blips
                }

                // Wait 5 seconds before polling again
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        };

        // Start polling. On mainnet/testnet, native websocket support if available is preferred.
        // But getEvents polling is standard across RPCs.
        pollEvents();

        // Cleanup function
        return () => {
            isPolling = false;
        };
    }, [address, queryClient]);
}
