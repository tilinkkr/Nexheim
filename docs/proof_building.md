# On-Chain Proof Logging

NexGuard allows analysts and the AI agent to publish a verifiable proof of their risk analysis to the Cardano blockchain.

## Overview

1.  **Analysis**: The Masumi Agent analyzes the token.
2.  **Hashing**: A canonical hash of the analysis results is computed.
3.  **Datum Construction**: An AIKEN-compatible datum is built containing the hash and metadata.
4.  **Transaction**: A transaction is built to send this datum to the NexGuard script address.
5.  **Signing & Submission**: The transaction is signed (by wallet or demo key) and submitted.

## API Endpoints

### 1. Build Proof
`POST /api/v1/proof/build`

Builds the analysis datum and an unsigned transaction (CBOR).

**Input:**
```json
{
  "policyId": "e68f1...",
  "analysisHash": "a1b2...",
  "rugProbability": 45,
  "trustScore": 55,
  "timestamp": 1732752000
}
```

**Output:**
```json
{
  "ok": true,
  "unsigned_cbor": "84a3...",
  "analysisDatum": { ... }
}
```

### 2. Get Demo Signed TX (Hackathon Only)
`GET /api/v1/proof/demo-signed/:policyId`

Returns a pre-signed transaction for demo purposes.

### 3. Submit Transaction
`POST /api/v1/tx/submit`

Submits a signed transaction hex to Blockfrost.

## Signing with Lucid (Browser)

If you want to sign the unsigned CBOR in the browser using a connected wallet (Nami, Eternl, etc.), you can use the following snippet:

```javascript
import { Lucid, Blockfrost } from "lucid-cardano";

async function signUnsignedTx(unsignedCborHex, walletApi) {
  const lucid = await Lucid.new(
    new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "YOUR_BLOCKFROST_KEY"),
    "Preprod"
  );
  
  lucid.selectWallet(walletApi);
  
  const tx = lucid.fromTx(unsignedCborHex);
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  
  return txHash;
}
```

## Demo Flow

1.  Click **Analyze** on a token.
2.  Click **Publish Proof**.
3.  Click **Use Demo Signed TX**.
4.  View the transaction on Cardano Preprod Explorer.
