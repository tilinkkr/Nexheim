# NexGuard Backend

## Quick Start

```bash
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

Server runs on `http://localhost:5001`

## Environment Variables

```env
BLOCKFROST_API_KEY=preprodXXXXXXXX  # Required for real token data
GEMINI_API_KEY=your-gemini-key       # Optional (for Passport/Chat)
RISK_AGENT_URL=http://localhost:8000 # Masumi Agent
YACI_STORE_URL=http://localhost:8080/api/v1
```

## API Endpoints

### Health & Status
- **GET** `/api/health` - System health check with Blockfrost status

### Tokens
- **GET** `/api/coins` - List all tokens (redirects to /api/explorer)
- **GET** `/api/explorer` - List all tokens (real + simulated)
- **GET** `/api/memecoins` - List meme factory tokens
- **GET** `/api/tokens/real/:assetId` - Get real token from Blockfrost
- **GET** `/api/tokens/latest` - Get latest real assets from Cardano
- **POST** `/api/simulate/mint` - Mint simulated token

### Risk Analysis
- **POST** `/risk/:policyId/ask-masumi` - AI risk analysis via Masumi Agent
- **POST** `/risk/:policyId/publish` - Prepare on-chain publish transaction
- **GET** `/risk/:policyId/onchain` - Check on-chain status

### Community
- **POST** `/whistle` - Submit ZK whistleblower report (anonymous)
- **POST** `/api/report` - Submit standard report
- **POST** `/api/vote` - Vote on token (agree/disagree)
- **POST** `/api/trade` - Simulate token trade

### Audits
- **GET** `/api/audits` - Get audit logs (optional ?tokenId filter)

### Contract
- **GET** `/api/contract` - Get deployed Aiken contract info
- **GET** `/api/contract/info` - Same as above

### Meme Factory
- **POST** `/api/memecoins/generate` - Generate single meme coin
- **POST** `/api/memecoins/batch` - Generate batch of coins
- **POST** `/api/memecoins/factory/start` - Start auto-generation
- **POST** `/api/memecoins/factory/stop` - Stop auto-generation

## Contract Deployment

Generate deployment info for Aiken smart contract:

```bash
node scripts/deploy.js
```

This creates `src/contracts/deployment.json` with:
- Script hash
- Script address (Preprod testnet)
- Network info
- Deployment timestamp

## Features

### 🔗 Real Cardano Integration
- Fetches real tokens from Cardano Preprod via Blockfrost
- Calculates trust scores from on-chain data
- Caches results for 5 minutes

### 🎲 Meme Coin Factory
- Auto-generates realistic meme coins every 30 seconds
- 4 risk profiles: safe (30%), medium (30%), risky (25%), scam (15%)
- Realistic metrics: liquidity, holders, whale percentage

### 🕵️ ZK Whistleblower
- Anonymous reporting with simulated ZK proofs
- Midnight-style commitment/nullifier scheme
- Groth16-simulated proof generation

### 🤖 AI Risk Analysis
- Integrates with Masumi Agent (OpenAI-powered)
- Analyzes token risk based on multiple factors
- Returns trust score adjustments and explanations

## Database

SQLite database (`audit.db`) stores:
- Tokens
- Audit logs
- Reports
- Votes
- Identities

Auto-initialized on server start.

## Mock Mode

Graceful fallback to mock data if API keys are missing:
- Gemini API (Passport/Chat)
- Blockfrost API (Real tokens)
- Yaci Store

## Testing

```bash
# Health check
curl http://localhost:5001/api/health

# Contract info
curl http://localhost:5001/api/contract

# Latest real tokens (requires BLOCKFROST_API_KEY)
curl http://localhost:5001/api/tokens/latest

# ZK Whistleblower
curl -X POST http://localhost:5001/whistle \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"tok_123","reportText":"Suspicious activity detected"}'
```

## Architecture

```
Express Server (Port 5001)
├── Services
│   ├── blockfrostService.js - Cardano blockchain data
│   ├── masumi.js - AI risk analysis
│   ├── yaci.js - Yaci Store integration
│   └── db.js - SQLite operations
├── Models
│   └── yaci_simulation.js - Mock blockchain data
├── Routes
│   ├── Tokens & Explorer
│   ├── Risk Analysis
│   ├── Community (reports, votes)
│   └── Meme Factory
└── Middleware
    ├── CORS
    ├── JSON parsing
    └── Request logging
```

## License

Apache-2.0
