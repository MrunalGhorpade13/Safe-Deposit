import {
    rpc,
    xdr,
    Address,
    scValToNative,
    Contract,
    TransactionBuilder,
    BASE_FEE,
    Account,
} from "@stellar/stellar-sdk";
import { CONTRACT_ID, NETWORK_PASSPHRASE, RPC_URL } from "./constants";

export const server = new rpc.Server(RPC_URL, { allowHttp: false });
export const contract = new Contract(CONTRACT_ID);

// Contract State Types based on Rust enum
export enum ContractState {
    Locked = 0,
    PendingApproval = 1,
    Released = 2,
}

export interface ContractDetails {
    tenant: string;
    landlord: string;
    depositAmount: number;
    deductionAmount: number;
    state: ContractState;
}

/**
 * Fetches the current contract state from the Stellar testnet
 * using the get_details view function.
 */
export async function fetchContractData(callerAddress: string): Promise<ContractDetails | null> {
    try {
        // Load the caller's account for building the simulation transaction
        const account = await server.getAccount(callerAddress);
        const tx = new TransactionBuilder(new Account(account.accountId(), account.sequenceNumber()), {
            fee: BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                contract.call("get_state")
            )
            .setTimeout(30)
            .build();

        const stateResult = await server.simulateTransaction(tx);
        if (!rpc.Api.isSimulationSuccess(stateResult)) return null;

        const stateVal = stateResult.result?.retval;
        if (!stateVal) return null;

        // Now fetch full details
        const detailsTx = new TransactionBuilder(new Account(account.accountId(), String(BigInt(account.sequenceNumber()) + BigInt(1))), {
            fee: BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                contract.call("get_details")
            )
            .setTimeout(30)
            .build();

        const detailsResult = await server.simulateTransaction(detailsTx);
        if (!rpc.Api.isSimulationSuccess(detailsResult)) return null;

        const details = scValToNative(detailsResult.result?.retval ?? xdr.ScVal.scvVoid());
        if (!details || !Array.isArray(details)) return null;

        const [tenant, landlord, deposit, deduction, state] = details;
        return {
            tenant: tenant ? tenant.toString() : "",
            landlord: landlord ? landlord.toString() : "",
            depositAmount: Number(deposit ?? 0) / 10_000_000, // Convert from stroops
            deductionAmount: Number(deduction ?? 0) / 10_000_000,
            state: Number(state ?? 2) as ContractState,
        };
    } catch (err: unknown) {
        // Contract not found or state not initialized (no deposit yet)
        const error = err as { message?: string };
        if (error?.message?.includes("doesn't exist") || error?.message?.includes("not found")) {
            return null; // New lease state
        }
        console.error("fetchContractData error:", err);
        return null;
    }
}

/**
 * Builds, signs, and submits a contract transaction via Freighter wallet.
 */
export async function invokeContractFunction(
    callerAddress: string,
    method: string,
    args: xdr.ScVal[]
): Promise<string> {
    const account = await server.getAccount(callerAddress);

    const tx = new TransactionBuilder(new Account(account.accountId(), account.sequenceNumber()), {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(contract.call(method, ...args))
        .setTimeout(30)
        .build();

    // Simulate to get footprint and resource estimate
    const simResult = await server.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(simResult)) {
        const errResult = simResult as rpc.Api.SimulateTransactionErrorResponse;
        throw new Error(`Simulation failed: ${errResult.error}`);
    }

    // Assemble the transaction with the simulation data (sets soroban data footprint)
    const preparedTx = rpc.assembleTransaction(tx, simResult).build();

    // Sign via Freighter (dynamically imported to avoid SSR crash)
    const { signTransaction } = await import("@stellar/freighter-api");
    const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Submit the signed transaction
    const submitResult = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE)
    );

    if (submitResult.status === "ERROR") {
        throw new Error(`Submission failed: ${submitResult.errorResult}`);
    }

    // Poll for confirmation
    let getResult = await server.getTransaction(submitResult.hash);
    let retries = 0;
    while (getResult.status === "NOT_FOUND" && retries < 20) {
        await new Promise((r) => setTimeout(r, 1000));
        getResult = await server.getTransaction(submitResult.hash);
        retries++;
    }

    if (getResult.status === "FAILED") {
        throw new Error("Transaction was rejected by the Stellar network.");
    }

    return submitResult.hash;
}

/** Build an Address ScVal */
export function addressVal(address: string): xdr.ScVal {
    return new Address(address).toScVal();
}

/** Build an i128 ScVal (XLM uses 7 decimal places in stroops factor) */
export function xlmToStroops(xlm: number): bigint {
    return BigInt(Math.round(xlm * 10_000_000));
}
