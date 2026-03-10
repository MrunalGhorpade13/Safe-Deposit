#![cfg(test)]

use super::*;
use soroban_sdk::{Env, testutils::Address as _};

#[test]
fn test_lock_deposit() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    client.lock_deposit(&tenant, &landlord, &1000);
    
    let state = client.get_state();
    assert_eq!(state, State::Locked);
    
    let details = client.get_details();
    assert_eq!(details.0, tenant);
    assert_eq!(details.1, landlord);
    assert_eq!(details.2, 1000);
    assert_eq!(details.3, 0); // No deduction proposed yet
}

#[test]
fn test_propose_deduction() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(SafeDepositContract, ());
    let client = SafeDepositContractClient::new(&env, &contract_id);
    
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    client.lock_deposit(&tenant, &landlord, &1000);
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
    
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    client.lock_deposit(&tenant, &landlord, &1000);
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
    
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    
    client.lock_deposit(&tenant, &landlord, &1000);
    // Should panic because 1500 > 1000
    client.propose_deduction(&landlord, &1500);
}
