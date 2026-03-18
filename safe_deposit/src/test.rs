#![cfg(test)]

use super::*;
use soroban_sdk::{Env, testutils::Address as _};

#[test]
fn test_get_details_uninitialized() {
    let env = Env::default();
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let details = client.get_details();
    assert_eq!(details.0, None); // Tenant should be None
    assert_eq!(details.1, None); // Landlord should be None
    assert_eq!(details.2, 0);    // Deposit should be 0
    assert_eq!(details.4, State::Released); // Default state
}

#[test]
fn test_lock_deposit() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let fee_collector_id = env.register(fee_collector::FeeCollectorContract, ());
    
    let admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    token_admin_client.mint(&tenant, &100_000_000);
    
    client.lock_deposit(&tenant, &landlord, &1000, &token_id, &fee_collector_id);
    
    let state = client.get_state();
    assert_eq!(state, State::Locked);
    
    let details = client.get_details();
    assert_eq!(details.0, Some(tenant));
    assert_eq!(details.1, Some(landlord));
    assert_eq!(details.2, 1000);
    assert_eq!(details.3, 0); // No deduction proposed yet
}

#[test]
fn test_propose_deduction() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let fee_collector_id = env.register(fee_collector::FeeCollectorContract, ());
    let admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    token_admin_client.mint(&tenant, &100_000_000);
    
    client.lock_deposit(&tenant, &landlord, &1000, &token_id, &fee_collector_id);
    client.propose_deduction(&landlord, &200);
    
    let state = client.get_state();
    assert_eq!(state, State::PendingApproval);
    
    let details = client.get_details();
    assert_eq!(details.3, 200); // Deduction is now 200
}

#[test]
fn test_approve_and_release() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let fee_collector_id = env.register(fee_collector::FeeCollectorContract, ());
    let admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    token_admin_client.mint(&tenant, &100_000_000); // Enough for fee and deposit
    
    client.lock_deposit(&tenant, &landlord, &1000, &token_id, &fee_collector_id);
    client.propose_deduction(&landlord, &200);
    client.approve_and_release(&tenant);
    
    let state = client.get_state();
    assert_eq!(state, State::Released);
}

#[test]
#[should_panic(expected = "Invalid deduction amount")]
fn test_invalid_deduction_amount() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let fee_collector_id = env.register(fee_collector::FeeCollectorContract, ());
    let admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(admin);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_id);

    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    token_admin_client.mint(&tenant, &100_000_000);
    
    client.lock_deposit(&tenant, &landlord, &1000, &token_id, &fee_collector_id);
    // Should panic because 1500 > 1000
    client.propose_deduction(&landlord, &1500);
}
