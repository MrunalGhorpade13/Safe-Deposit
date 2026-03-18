"use client";

import { useWallet } from "@/context/WalletContext";
import { ShieldCheck, Wallet, LogOut } from "lucide-react";

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
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "";

    return (
        <nav className="glass-navbar sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <ShieldCheck className="h-8 w-8" style={{ color: '#6366f1' }} />
                            <div className="absolute inset-0 blur-md opacity-50" style={{ background: '#6366f1', borderRadius: '50%' }} />
                        </div>
                        <div>
                            <span className="text-xl font-bold gradient-text">SafeDeposit</span>
                            <span className="hidden sm:block text-xs" style={{ color: '#475569', lineHeight: 1, marginTop: '-2px' }}>Smart Lease Escrow</span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {isConnected && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                <span className="pulse-dot" />
                                <span className="text-xs font-mono" style={{ color: '#34d399' }}>{displayAddress}</span>
                            </div>
                        )}
                        <button
                            id="wallet-btn"
                            onClick={handleWalletAction}
                            className={isConnected ? "btn-secondary" : "btn-primary"}
                        >
                            {isConnected
                                ? (<><LogOut className="h-4 w-4 mr-1.5" /><span className="hidden sm:inline">Disconnect</span><span className="sm:hidden">{displayAddress}</span></>)
                                : (<><Wallet className="h-4 w-4 mr-1.5" />Connect Wallet</>)
                            }
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
