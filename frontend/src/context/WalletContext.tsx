"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
    isAllowed,
    setAllowed,
    getAddress,
    getNetworkDetails,
} from "@stellar/freighter-api";

interface WalletContextType {
    address: string | null;
    network: string | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [network, setNetwork] = useState<string | null>(null);

    const checkConnection = async () => {
        try {
            const allowed = await isAllowed();
            if (allowed) {
                const addressInfo = await getAddress();
                if (addressInfo.address) {
                    setAddress(addressInfo.address);
                    const networkDetails = await getNetworkDetails();
                    setNetwork(networkDetails.network);
                }
            }
        } catch (error) {
            console.error("Error checking connection:", error);
        }
    };

    useEffect(() => {
        checkConnection();
    }, []);

    const connect = async () => {
        try {
            await setAllowed();
            await checkConnection();
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const disconnect = () => {
        setAddress(null);
        setNetwork(null);
    };

    return (
        <WalletContext.Provider
            value={{
                address,
                network,
                isConnected: !!address,
                connect,
                disconnect,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
