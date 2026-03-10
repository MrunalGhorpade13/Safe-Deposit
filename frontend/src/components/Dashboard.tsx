"use client";

import { useWallet } from "@/context/WalletContext";
import { useContractData } from "@/hooks/useContractData";
import { ContractState } from "@/lib/stellar";
import { useLockDeposit, useProposeDeduction, useApproveRelease } from "@/hooks/useContractMutations";
import { useState } from "react";

export function Dashboard() {
    const { address, isConnected } = useWallet();
    const { data: contractInfo, isLoading: dataLoading, error } = useContractData(address);

    // Mutations for contract interaction
    const { mutate: lockDeposit, isPending: isLocking } = useLockDeposit();
    const { mutate: proposeDeduction, isPending: isProposing } = useProposeDeduction();
    const { mutate: approveRelease, isPending: isApproving } = useApproveRelease();

    // Local form state
    const [depositForm, setDepositForm] = useState({ landlord: "", amount: "" });
    const [deductionAmount, setDeductionAmount] = useState("");

    if (!isConnected) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome to SafeDeposit</h2>
                <p className="text-slate-500">
                    A decentralized smart lease escrow. Connect your wallet to manage your deposits securely on the Stellar network.
                </p>
            </div>
        );
    }

    if (dataLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-slate-500">Loading escrow data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 rounded-lg shadow-sm border border-rose-200 p-8 text-center">
                <p className="text-rose-600">Error loading contract data. Please try again later.</p>
            </div>
        );
    }

    // Role detection
    const isTenant = contractInfo?.tenant === address || !contractInfo; // Empty assumes tenant wants to create
    const isLandlord = contractInfo?.landlord === address;

    const stateLabels = {
        [ContractState.Locked]: "Locked",
        [ContractState.PendingApproval]: "Pending Approval",
        [ContractState.Released]: "Released",
    };

    const currentStateLabel = contractInfo
        ? stateLabels[contractInfo.state]
        : "No Deposit Locked";

    // Handlers
    const handleLockDeposit = () => {
        if (!address || !depositForm.landlord || !depositForm.amount) return;
        lockDeposit({
            tenant: address,
            landlord: depositForm.landlord,
            amount: parseFloat(depositForm.amount)
        });
    };

    const handleProposeDeduction = () => {
        if (!contractInfo?.tenant || !deductionAmount) return;
        proposeDeduction({
            tenant: contractInfo.tenant,
            amount: parseFloat(deductionAmount)
        });
    };

    const handleApprove = () => {
        if (!address) return;
        approveRelease({ tenant: address });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Escrow Dashboard</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${contractInfo?.state === ContractState.Locked ? 'bg-amber-100 text-amber-800' :
                    contractInfo?.state === ContractState.PendingApproval ? 'bg-blue-100 text-blue-800' :
                        contractInfo?.state === ContractState.Released ? 'bg-emerald-100 text-emerald-800' :
                            'bg-slate-200 text-slate-600'
                    }`}>
                    Status: {currentStateLabel}
                </span>
            </div>

            <div className="p-6">
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded border border-slate-100">
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Deposit</p>
                        <p className="text-2xl font-bold text-slate-900">{contractInfo?.depositAmount || 0} XLM</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded border border-slate-100">
                        <p className="text-sm font-medium text-slate-500 mb-1">Proposed Deduction</p>
                        <p className="text-2xl font-bold text-slate-900">{contractInfo?.deductionAmount || 0} XLM</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Tenant View */}
                    {(!contractInfo || isTenant) && (
                        <div className={`border rounded p-6 ${isTenant ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`}>
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                Tenant Actions
                            </h3>

                            {!contractInfo || contractInfo.state === ContractState.Released ? (
                                <div className="space-y-4 max-w-md">
                                    <p className="text-sm text-slate-600">Start a new lease by locking a security deposit.</p>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Landlord Address</label>
                                        <input
                                            type="text"
                                            value={depositForm.landlord}
                                            onChange={(e) => setDepositForm({ ...depositForm, landlord: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="G..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Deposit Amount (XLM)</label>
                                        <input
                                            type="number"
                                            value={depositForm.amount}
                                            onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="100"
                                        />
                                    </div>
                                    <button
                                        onClick={handleLockDeposit}
                                        disabled={isLocking || !depositForm.landlord || !depositForm.amount}
                                        className="w-full flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isLocking && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                                        {isLocking ? "Locking..." : "Lock New Deposit"}
                                    </button>
                                </div>
                            ) : contractInfo.state === ContractState.PendingApproval ? (
                                <div>
                                    <p className="text-sm text-slate-600 mb-4 flex flex-col gap-1">
                                        <span className="font-medium text-slate-900">Landlord proposed a deduction of {contractInfo.deductionAmount} XLM.</span>
                                        <span>Review and approve to release funds. ({contractInfo.depositAmount - contractInfo.deductionAmount} XLM will be returned to you).</span>
                                    </p>
                                    <button
                                        onClick={handleApprove}
                                        disabled={isApproving}
                                        className="flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isApproving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                                        {isApproving ? "Approving..." : "Approve & Release"}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Waiting for landlord to propose deductions or lease to end.</p>
                            )}
                        </div>
                    )}

                    {/* Landlord View */}
                    {isLandlord && (
                        <div className="border border-slate-200 rounded p-6 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-slate-800 mr-2"></span>
                                Landlord Actions
                            </h3>

                            {contractInfo?.state === ContractState.Locked ? (
                                <div className="space-y-4 max-w-md">
                                    <p className="text-sm text-slate-600 mb-2">Lease ended? Propose a deduction for any damages.</p>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Deduction Amount (XLM)</label>
                                        <input
                                            type="number"
                                            value={deductionAmount}
                                            onChange={(e) => setDeductionAmount(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <button
                                        onClick={handleProposeDeduction}
                                        disabled={isProposing || !deductionAmount}
                                        className="w-full flex justify-center items-center bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isProposing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                                        {isProposing ? "Proposing..." : "Propose Deduction"}
                                    </button>
                                </div>
                            ) : contractInfo?.state === ContractState.PendingApproval ? (
                                <p className="text-sm text-slate-500 italic">Waiting for tenant to approve the deduction.</p>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No active deposit to manage.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
