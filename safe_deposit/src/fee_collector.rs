use soroban_sdk::{contract, contractimpl, token, Address, Env};

#[contract]
pub struct FeeCollectorContract;

#[contractimpl]
impl FeeCollectorContract {
    /// Collects a flat fee from the account and sends it to a treasury address.
    pub fn collect_fee(env: Env, token: Address, from: Address, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Fee amount must be positive");
        }

        // For this demo, we'll transfer the fee to the contract's own address (acting as treasury)
        let token_client = token::Client::new(&env, &token);
        let treasury = env.current_contract_address();
        token_client.transfer(&from, &treasury, &amount);
    }
}
