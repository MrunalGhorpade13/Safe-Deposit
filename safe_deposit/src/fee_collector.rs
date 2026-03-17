#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct FeeCollectorContract;

#[contractimpl]
impl FeeCollectorContract {
    /// Collects a flat fee.
    pub fn collect_fee(env: Env, token: Address, from: Address, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Fee amount must be positive");
        }

        // The logic for actual token transfer would go here
        // e.g., token::Client::new(&env, &token).transfer(&from, &treasury, &amount);
    }
}
