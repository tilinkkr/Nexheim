# Rug Probability Meter - Backend

## Overview

The Rug Probability Meter analyzes on-chain metrics and social signals to compute a rug pull probability score (0-100) for meme coins.

## Files Added

### Services
- `src/services/rugMeter.js` - Core service with scoring logic, caching, and timeout protection

### Routes
- `src/routes/riskRoutes.js` - API endpoints for rug probability analysis

### Integration
- `src/index.js` - Mounted risk routes at `/api`

## API Contract

### GET `/api/memecoins/:policyId/rug-probability`

**Query Parameters:**
- `force=true` (optional) - Bypass cache and fetch fresh data

**Response (200 OK):**
```json
{
  "policyId": "test123",
  "probability": 0.65,
  "score": 65,
  "status": "medium",
  "factors": [
    "Moderate concentration: Top holder owns >30%",
    "Liquidity locked - safer",
    "High recent minting activity"
  ],
  "explanation": "Rug probability: MEDIUM (65/100). 3 risk factors analyzed.",
  "metrics": {
    "ownerConcentration": "42.18%",
    "liquidityLocked": true,
    "recentActivity": {
      "mints": 823,
      "largeTransfers": 18
    },
    "auditFlags": 2
  },
  "social": {
    "mentionVolume": 5234,
    "spikeScore": "0.58"
  },
  "timestamp": 1764410656203,
  "cached": false
}
```

**Status Levels:**
- `low` (0-29): Low risk
- `medium` (30-69): Medium risk
- `high` (70-100): High risk
- `unknown`: Data unavailable (fallback)

## How to Run

### Start Backend
```bash
cd packages/backend
node src/index.js
```

Server will start on `http://localhost:5001`

### Test Endpoint
```bash
# Basic request
curl http://localhost:5001/api/memecoins/test123/rug-probability

# Force refresh (bypass cache)
curl "http://localhost:5001/api/memecoins/test123/rug-probability?force=true"

# Pretty print with jq
curl -s http://localhost:5001/api/memecoins/test123/rug-probability | jq .
```

### Run Tests
```bash
cd packages/backend
npm test -- tests/rugMeter.test.js
```

## Features

- **Caching**: 10-minute TTL using NodeCache
- **Timeout Protection**: 7-second default timeout with fallback
- **Mock Data**: Generates realistic on-chain and social metrics
- **Defensive Error Handling**: Never throws, returns fallback on error
- **Console Logging**: `[RUG-METER]` prefix for debugging

## How to Revert

### Option 1: Git Revert (Recommended)
```bash
# Revert the commit that added rug meter
git log --oneline --grep="rug" -i
git revert <commit-hash>
```

### Option 2: Manual Removal
```bash
# Remove files
rm src/services/rugMeter.js
rm src/routes/riskRoutes.js

# Edit src/index.js - remove these lines:
# - Lines mounting riskRoutes (search for "Mount risk routes")

# Restart server
node src/index.js
```

### Option 3: Comment Out Routes
In `src/index.js`, comment out the risk routes mounting:
```javascript
// Mount risk routes
// try {
//     const riskRoutes = require('./routes/riskRoutes');
//     app.use('/api', riskRoutes);
//     console.log('[BOOT] Mounted riskRoutes at /api');
// } catch (err) {
//     console.error('[BOOT] Failed to mount riskRoutes:', err && err.stack ? err.stack : err);
// }
```

## Troubleshooting

**404 Not Found:**
- Check server logs for `[BOOT] Mounted riskRoutes at /api`
- Verify backend is running on port 5001
- Check for old node processes: `netstat -ano | findstr :5001`

**Timeout Errors:**
- Default timeout is 7 seconds
- Increase in `rugMeter.js`: `const timeout = options.timeout || 10000;`

**Cache Issues:**
- Use `?force=true` to bypass cache
- Cache TTL is 600 seconds (10 minutes)
