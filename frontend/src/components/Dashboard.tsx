"use client";

import { useWallet } from "@/context/WalletContext";
import { useContractData } from "@/hooks/useContractData";
import { ContractState } from "@/lib/stellar";
import { useLockDeposit, useProposeDeduction, useApproveRelease } from "@/hooks/useContractMutations";
import { useContractEvents } from "@/hooks/useContractEvents";
import { useState } from "react";
import {
    ShieldCheck, Coins, Scissors, ArrowRightLeft,
    Home, User, AlertCircle, CheckCircle2, Clock3
} from "lucide-react";

export function Dashboard() {
    const { address, isConnected } = useWallet();
    const { data: contractInfo, isLoading: dataLoading, error } = useContractData(address);
    useContractEvents(address);

    const { mutate: lockDeposit, isPending: isLocking } = useLockDeposit();
    const { mutate: proposeDeduction, isPending: isProposing } = useProposeDeduction();
    const { mutate: approveRelease, isPending: isApproving } = useApproveRelease();

    const [depositForm, setDepositForm] = useState({ landlord: "", amount: "" });
    const [deductionAmount, setDeductionAmount] = useState("");

    // ── Not Connected ──
    if (!isConnected) {
        return (
            <div className="glass-card p-10 text-center glow-indigo" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <ShieldCheck className="h-16 w-16" style={{ color: '#6366f1' }} />
                        <div style={{ position:'absolute', inset:0, background:'#6366f1', borderRadius:'50%', filter:'blur(20px)', opacity:0.3 }} />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-3" style={{ color: '#f1f5f9' }}>
                    Welcome to <span className="gradient-text">SafeDeposit</span>
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                    A decentralized smart lease escrow on the Stellar network. Lock, manage, and release rental deposits with complete transparency and zero intermediaries.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: <ShieldCheck className="h-5 w-5" />, label: "Trustless" },
                        { icon: <Coins className="h-5 w-5" />, label: "Instant" },
                        { icon: <ArrowRightLeft className="h-5 w-5" />, label: "Transparent" },
                    ].map(({ icon, label }) => (
                        <div key={label} className="glass-card p-3 flex flex-col items-center gap-1.5" style={{ borderRadius: '12px' }}>
                            <span style={{ color: '#6366f1' }}>{icon}</span>
                            <span className="text-xs font-semibold" style={{ color: '#94a3b8' }}>{label}</span>
                        </div>
                    ))}
                </div>
                <p className="text-sm font-medium" style={{ color: '#6366f1' }}>
                    ↑ Connect your Freighter wallet above to get started
                </p>
            </div>
        );
    }

    // ── Loading ──
    if (dataLoading) {
        return (
            <div className="glass-card p-12 text-center flex flex-col items-center gap-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="spinner" style={{ width: '36px', height: '36px', borderTopColor: '#6366f1', borderColor: 'rgba(99,102,241,0.2)' }} />
                <p style={{ color: '#94a3b8' }}>Loading escrow data from Stellar...</p>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="glass-card p-8 text-center" style={{ maxWidth: '500px', margin: '0 auto', borderColor: 'rgba(239,68,68,0.3)' }}>
                <AlertCircle className="h-10 w-10 mx-auto mb-3" style={{ color: '#f87171' }} />
                <p style={{ color: '#f87171' }}>Could not load contract data. Please try again later.</p>
            </div>
        );
    }

    const isTenant = contractInfo?.tenant === address || !contractInfo;
    const isLandlord = contractInfo?.landlord === address;

    const stateConfig = {
        [ContractState.Locked]: { label: "Locked", badge: "badge-locked", icon: <ShieldCheck className="h-3.5 w-3.5 mr-1" /> },
        [ContractState.PendingApproval]: { label: "Pending Approval", badge: "badge-pending", icon: <Clock3 className="h-3.5 w-3.5 mr-1" /> },
        [ContractState.Released]: { label: "Released", badge: "badge-released", icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> },
    };

    const currentState = contractInfo ? stateConfig[contractInfo.state] : null;

    const handleLockDeposit = () => {
        if (!address || !depositForm.landlord || !depositForm.amount) return;
        lockDeposit({ tenant: address, landlord: depositForm.landlord, amount: parseFloat(depositForm.amount) });
    };

    const handleProposeDeduction = () => {
        if (!contractInfo?.tenant || !deductionAmount) return;
        proposeDeduction({ tenant: contractInfo.tenant, amount: parseFloat(deductionAmount) });
    };

    const handleApprove = () => {
        if (!address) return;
        approveRelease({ tenant: address });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Deposit Amount */}
                <div className="glass-card p-5 glow-indigo">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Total Deposit</p>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.15)' }}>
                            <Coins className="h-4 w-4" style={{ color: '#818cf8' }} />
                        </div>
                    </div>
                    <p className="stat-value gradient-text">{contractInfo?.depositAmount ?? 0}</p>
                    <p className="text-sm mt-1" style={{ color: '#475569' }}>XLM</p>
                </div>

                {/* Deduction */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Proposed Deduction</p>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)' }}>
                            <Scissors className="h-4 w-4" style={{ color: '#fbbf24' }} />
                        </div>
                    </div>
                    <p className="stat-value" style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {contractInfo?.deductionAmount ?? 0}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#475569' }}>XLM</p>
                </div>

                {/* Status */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Contract Status</p>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.15)' }}>
                            <ArrowRightLeft className="h-4 w-4" style={{ color: '#34d399' }} />
                        </div>
                    </div>
                    <div className="mt-2">
                        {currentState ? (
                            <span className={currentState.badge} style={{ display: 'inline-flex', alignItems: 'center' }}>
                                {currentState.icon}{currentState.label}
                            </span>
                        ) : (
                            <span className="badge-none">No Deposit</span>
                        )}
                    </div>
                    <p className="text-sm mt-2" style={{ color: '#475569' }}>On Stellar Testnet</p>
                </div>
            </div>

            {/* ── Action Panels ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tenant Panel */}
                {(!contractInfo || isTenant) && (
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="role-dot-tenant" />
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" style={{ color: '#34d399' }} />
                                <h3 className="font-semibold" style={{ color: '#f1f5f9' }}>Tenant Actions</h3>
                            </div>
                        </div>
                        <div className="divider" />

                        {!contractInfo || contractInfo.state === ContractState.Released ? (
                            <div className="space-y-4">
                                <p className="text-sm" style={{ color: '#94a3b8' }}>
                                    Lock a security deposit to start a new lease agreement.
                                </p>
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Landlord Stellar Address
                                    </label>
                                    <input
                                        id="landlord-address-input"
                                        type="text"
                                        value={depositForm.landlord}
                                        onChange={(e) => setDepositForm({ ...depositForm, landlord: e.target.value })}
                                        className="input-premium"
                                        placeholder="G..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Deposit Amount (XLM)
                                    </label>
                                    <input
                                        id="deposit-amount-input"
                                        type="number"
                                        value={depositForm.amount}
                                        onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                                        className="input-premium"
                                        placeholder="e.g. 500"
                                    />
                                </div>
                                <button
                                    id="lock-deposit-btn"
                                    onClick={handleLockDeposit}
                                    disabled={isLocking || !depositForm.landlord || !depositForm.amount}
                                    className="btn-emerald w-full"
                                >
                                    {isLocking ? <><div className="spinner mr-2" /> Locking...</> : "🔒 Lock Deposit"}
                                </button>
                            </div>
                        ) : contractInfo.state === ContractState.PendingApproval ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                    <p className="text-sm font-semibold mb-1" style={{ color: '#fbbf24' }}>
                                        Deduction Proposed
                                    </p>
                                    <p className="text-sm" style={{ color: '#94a3b8' }}>
                                        Landlord proposed a deduction of <strong style={{ color: '#f1f5f9' }}>{contractInfo.deductionAmount} XLM</strong>.<br />
                                        You will receive <strong style={{ color: '#34d399' }}>{contractInfo.depositAmount - contractInfo.deductionAmount} XLM</strong> back.
                                    </p>
                                </div>
                                <button
                                    id="approve-release-btn"
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className="btn-emerald w-full"
                                >
                                    {isApproving ? <><div className="spinner mr-2" /> Approving...</> : "✅ Approve & Release"}
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <p className="text-sm" style={{ color: '#475569' }}>Deposit is locked. Waiting for landlord to propose deductions.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Landlord Panel */}
                {isLandlord && (
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="role-dot-landlord" />
                            <div className="flex items-center gap-2">
                                <Home className="h-4 w-4" style={{ color: '#818cf8' }} />
                                <h3 className="font-semibold" style={{ color: '#f1f5f9' }}>Landlord Actions</h3>
                            </div>
                        </div>
                        <div className="divider" />

                        {contractInfo?.state === ContractState.Locked ? (
                            <div className="space-y-4">
                                <p className="text-sm" style={{ color: '#94a3b8' }}>
                                    Lease ended? Propose a deduction amount for damages.
                                </p>
                                <div>
                                    <label className="block text-xs font-semibold mb-2" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Deduction Amount (XLM)
                                    </label>
                                    <input
                                        id="deduction-amount-input"
                                        type="number"
                                        value={deductionAmount}
                                        onChange={(e) => setDeductionAmount(e.target.value)}
                                        className="input-premium"
                                        placeholder="e.g. 50"
                                    />
                                </div>
                                <button
                                    id="propose-deduction-btn"
                                    onClick={handleProposeDeduction}
                                    disabled={isProposing || !deductionAmount}
                                    className="btn-primary w-full"
                                >
                                    {isProposing ? <><div className="spinner mr-2" /> Proposing...</> : "📋 Propose Deduction"}
                                </button>
                            </div>
                        ) : contractInfo?.state === ContractState.PendingApproval ? (
                            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                                <Clock3 className="h-8 w-8 mx-auto mb-2" style={{ color: '#818cf8' }} />
                                <p className="text-sm font-semibold" style={{ color: '#818cf8' }}>Waiting for Tenant</p>
                                <p className="text-xs mt-1" style={{ color: '#475569' }}>The tenant needs to review and approve your deduction.</p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <p className="text-sm" style={{ color: '#475569' }}>No active deposit to manage.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Placeholder if only tenant and no deposit yet */}
                {!isLandlord && contractInfo && contractInfo.state !== ContractState.Released && (
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                        <Home className="h-10 w-10 mb-3" style={{ color: '#475569' }} />
                        <p className="text-sm font-semibold mb-1" style={{ color: '#94a3b8' }}>Landlord Panel</p>
                        <p className="text-xs" style={{ color: '#475569' }}>Visible only to the designated landlord for this deposit.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
