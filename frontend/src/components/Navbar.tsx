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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        <span className="ml-2 text-xl font-bold text-slate-900">
                            SafeDeposit
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleWalletAction}
                            className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isConnected
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
