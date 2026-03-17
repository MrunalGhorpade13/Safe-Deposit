"use client";

import { useWallet } from "@/context/WalletContext";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
    const { address, isConnected, connect, disconnect } = useWallet();

    const handleWalletAction = () => {
        if (isConnected) {
            disconnect();
        } else {
            connect();
        }
    };

    const displayAddress = address
        ? `${address.slice(0, 5)}...${address.slice(-4)}`
        : "";

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center shrink-0">
                        <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold text-slate-900 truncate">
                            SafeDeposit
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleWalletAction}
                            className={`inline-flex items-center px-3 sm:px-4 py-2 border rounded-md shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isConnected
                                    ? "border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500"
                                    : "border-transparent text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500"
                                }`}
                        >
                            {isConnected ? displayAddress : "Connect Wallet"}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
