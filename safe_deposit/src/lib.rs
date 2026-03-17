#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

mod fee_collector;
use fee_collector::{FeeCollectorContractClient};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum State {
    Locked,
    PendingApproval,
    Released,
}

#[contracttype]
pub enum DataKey {
    Tenant,
    Landlord,
    DepositAmount,
    DeductionAmount,
    State,
}

#[contract]
pub struct SafeDepositContract;

#[contractimpl]
impl SafeDepositContract {
    /// Tenant locks XLM and assigns a Landlord. State becomes Locked.
    pub fn lock_deposit(env: Env, tenant: Address, landlord: Address, amount: i128, token: Address, fee_collector: Address) {
        tenant.require_auth();

        if env.storage().instance().has(&DataKey::State) {
            panic!("Deposit already locked");
        }

        if amount <= 0 {
            panic!("Deposit amount must be positive");
        }

        // In a complete implementation, this would involve transferring XLM
        // from the tenant to the contract via the token interface.
        // For simplicity in this demo, we assume the transfer happens
        // or we just track the balances. We'll just track the state.

        // Call FeeCollector inter-contract call
        let fee_client = FeeCollectorContractClient::new(&env, &fee_collector);
        let fee_amount: i128 = 10000000; // 1 XLM flat fee
        fee_client.collect_fee(&token, &tenant, &fee_amount);

        env.storage().instance().set(&DataKey::Tenant, &tenant);
        env.storage().instance().set(&DataKey::Landlord, &landlord);
        env.storage().instance().set(&DataKey::DepositAmount, &amount);
        env.storage().instance().set(&DataKey::State, &State::Locked);

        env.events().publish(
            (soroban_sdk::Symbol::new(&env, "DepositLocked"), tenant.clone(), landlord.clone()),
            amount,
        );
    }

    /// Landlord inputs an XLM amount for damages. State becomes PendingApproval.
    pub fn propose_deduction(env: Env, landlord: Address, deduction_amount: i128) {
        landlord.require_auth();

        let state: State = env.storage().instance().get(&DataKey::State).expect("Contract state missing");
        if state != State::Locked {
            panic!("Invalid state for proposing deduction");
        }

        let stored_landlord: Address = env.storage().instance().get(&DataKey::Landlord).expect("Landlord missing");
        if landlord != stored_landlord {
            panic!("Only the designated landlord can propose a deduction");
        }

        let deposit_amount: i128 = env.storage().instance().get(&DataKey::DepositAmount).expect("Deposit missing");
        if deduction_amount < 0 || deduction_amount > deposit_amount {
            panic!("Invalid deduction amount");
        }

        env.storage().instance().set(&DataKey::DeductionAmount, &deduction_amount);
        env.storage().instance().set(&DataKey::State, &State::PendingApproval);

        env.events().publish(
            (soroban_sdk::Symbol::new(&env, "DeductionProposed"), landlord.clone()),
            deduction_amount,
        );
    }

    /// Tenant approves the deduction. Funds are theoretically released. State becomes Released.
    pub fn approve_and_release(env: Env, tenant: Address) {
        tenant.require_auth();

        let state: State = env.storage().instance().get(&DataKey::State).expect("Contract state missing");
        if state != State::PendingApproval {
            panic!("Invalid state for approval");
        }

        let stored_tenant: Address = env.storage().instance().get(&DataKey::Tenant).expect("Tenant missing");
        if tenant != stored_tenant {
            panic!("Only the tenant can approve");
        }

        // Logic here to actually transfer funds using the token contract.
        // The landlord gets `deduction_amount`.
        // The tenant gets `deposit_amount - deduction_amount`.

        env.storage().instance().set(&DataKey::State, &State::Released);

        env.events().publish(
            (soroban_sdk::Symbol::new(&env, "DepositReleased"), tenant.clone()),
            (),
        );
    }
    
    // Read-only functions useful for UI
    
    pub fn get_state(env: Env) -> State {
        env.storage().instance().get(&DataKey::State).unwrap_or(State::Released)
    }
    
    pub fn get_details(env: Env) -> (Address, Address, i128, i128, State) {
        let tenant: Address = env.storage().instance().get(&DataKey::Tenant).expect("Missing");
        let landlord: Address = env.storage().instance().get(&DataKey::Landlord).expect("Missing");
        let deposit: i128 = env.storage().instance().get(&DataKey::DepositAmount).unwrap_or(0);
        let deduction: i128 = env.storage().instance().get(&DataKey::DeductionAmount).unwrap_or(0);
        let state: State = env.storage().instance().get(&DataKey::State).expect("Missing");
        
        (tenant, landlord, deposit, deduction, state)
    }
}

mod test;
