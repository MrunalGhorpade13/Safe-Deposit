"use client";

import { WalletProvider } from "@/context/WalletContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <WalletProvider>
                {children}
                <ToastContainer position="bottom-right" theme="colored" />
            </WalletProvider>
        </QueryClientProvider>
    );
}
