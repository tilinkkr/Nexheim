use aiken/crypto.{Blake2b_224, Hash}
use cardano/transaction.{OutputReference, Transaction}
use aiken/collection/list

pub type PolicyId = ByteArray

pub type RiskDatum {
  policy_id: PolicyId,
  risk_score: Int,
  flags: List<ByteArray>,
}

pub type RiskRedeemer {
  UpdateScore { new_score: Int }
  FlagScam
}

validator risk_registry {
  spend(datum: Option<RiskDatum>, redeemer: RiskRedeemer, _oref: OutputReference, transaction: Transaction) {
    // In a real implementation, we would check:
    // 1. The transaction is signed by the authorized governance wallet
    // 2. The output datum is updated correctly based on the redeemer
    
    // For this hackathon demo, we'll implement a simplified check:
    // The transaction must be signed by *someone* (simulating auth)
    
    let Transaction { extra_signatories, .. } = transaction

    when redeemer is {
      UpdateScore { new_score } -> {
        // Ensure the new score is within valid range (0-100)
        (new_score >= 0 && new_score <= 100) &&
        // Ensure there is at least one signer (mock auth)
        !list.is_empty(extra_signatories)
      }
      FlagScam -> {
        // Flagging as scam is a critical action, requires signature
        !list.is_empty(extra_signatories)
      }
    }
  }
}
