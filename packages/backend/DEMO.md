# NexGuard Demo Guide

## Quick Start

This guide provides step-by-step instructions for demonstrating the NexGuard DApp features, including the Hype-to-Price Ratio and Rug Probability Meter.

## Prerequisites

- Node.js installed
- Backend dependencies installed (`npm install` in `packages/backend`)
- Frontend dependencies installed (`npm install` in `packages/frontend`)
- `.env` file configured with API keys (if using real APIs)

## Demo Modes

### Option 1: Minimal Server (Hype Ratio Only)
Use this for quick demos of the Hype-to-Price Ratio feature without full backend complexity.

### Option 2: Full Backend (All Features)
Use this for complete demo including Rug Probability Meter, blockchain integration, and all features.

---

## Starting the Backend

### Minimal Server Mode

**Purpose:** Demonstrates Hype-to-Price Ratio endpoint only

```powershell
cd packages/backend
node src/index_minimal.js
```

**Expected Output:**
```
[MIN] Starting minimal server 2025-11-29T10:00:00.000Z
[MIN] listening on http://localhost:5001
```

**Verify:**
```powershell
curl http://localhost:5001/__health
curl "http://localhost:5001/api/tokens/test123/hype-ratio?name=TestToken"
```

### Full Backend Mode

**Purpose:** All features including Rug Probability Meter

```powershell
cd packages/backend
node src/index.js
```

**Expected Output:**
```
[BOOT] Starting server.js 2025-11-29T10:00:00.000Z
[BOOT] index.js md5: [checksum]
[HEALTH] Health endpoint registered
[BOOT] Mounted healthAndSafety
[BOOT] Mounted /api hypeRoutes
[BOOT] Mounted riskRoutes at /api
info: Backend listening at http://localhost:5001
Connected to the SQLite database.
```

**Verify:**
```powershell
# Health check
curl http://localhost:5001/__health

# Hype ratio
curl "http://localhost:5001/api/tokens/test123/hype-ratio?name=TestToken"

# Rug probability
curl "http://localhost:5001/api/memecoins/test123/rug-probability"
```

---

## Starting the Frontend

```powershell
cd packages/frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Access:** Open browser to `http://localhost:5173`

---

## Verification Commands

### 1. Health Check
```powershell
curl http://localhost:5001/__health
```

**Expected Response:**
```json
{
  "status": "ok",
  "pid": 12345,
  "uptime": 42.5,
  "timestamp": "2025-11-29T10:00:00.000Z"
}
```

### 2. Hype-to-Price Ratio
```powershell
curl "http://localhost:5001/api/tokens/test123/hype-ratio?name=MoonCoin"
```

**Expected Response:**
```json
{
  "policyId": "test123",
  "tokenName": "MoonCoin",
  "hypeScore": 67,
  "priceChange": "15.23",
  "ratio": "4.40",
  "status": "cautious",
  "message": "⚠️ Moderate hype detected"
}
```

### 3. Rug Probability Meter
```powershell
curl "http://localhost:5001/api/memecoins/test123/rug-probability"
```

**Expected Response:**
```json
{
  "policyId": "test123",
  "probability": 0.45,
  "score": 45,
  "status": "medium",
  "factors": [
    "Moderate concentration: Top holder owns >30%",
    "Liquidity locked - safer"
  ],
  "metrics": {
    "ownerConcentration": "36.49%",
    "liquidityLocked": true
  }
}
```

### 4. Pretty Print with PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/memecoins/test123/rug-probability" | ConvertTo-Json -Depth 5
```

---

## Frontend Demo Flow

1. **Open Browser:** `http://localhost:5173`

2. **View Token Explorer:**
   - See list of meme coins
   - Each shows trust score and basic info

3. **Click on a Token:**
   - Opens TokenDetail page
   - Scroll to "Coin Analysis Area"

4. **View Hype Ratio Card:**
   - Shows hype score vs price change
   - Color-coded status (balanced/overhyped/undervalued)
   - Breakdown of social metrics

5. **View Rug Meter:**
   - Shows rug probability score (0-100)
   - Color-coded risk level (green/yellow/red)
   - 4-box metrics grid
   - Risk factors list

---

## Troubleshooting

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5001`

**Solution:**
```powershell
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use the demo script
.\run_demo.ps1
```

### Backend Not Responding

**Check if server is running:**
```powershell
curl http://localhost:5001/__health
```

**Check server logs for errors:**
- Look for `[BOOT]` messages
- Check for `[FATAL]` errors
- Verify all routes mounted successfully

### Frontend Can't Connect to Backend

**Check CORS settings:**
- Backend should allow `http://localhost:5173`
- Check `cors()` middleware in `index.js`

**Check API URL:**
- Frontend uses `VITE_API_URL` or defaults to `http://localhost:5001`
- Verify in browser Network tab

### 404 Not Found

**Verify route is mounted:**
```powershell
# Check server startup logs for:
[BOOT] Mounted riskRoutes at /api
[BOOT] Mounted /api hypeRoutes
```

**Check endpoint path:**
- Hype ratio: `/api/tokens/:policyId/hype-ratio`
- Rug probability: `/api/memecoins/:policyId/rug-probability`

---

## Recovery Instructions

### Revert to Previous State

**If you need to undo changes:**

```powershell
# Revert specific file
git checkout -- packages/backend/src/index.js

# Revert all backend changes
git checkout -- packages/backend/

# Revert all frontend changes
git checkout -- packages/frontend/

# Revert entire repository
git checkout -- .
```

### Remove Rug Meter Feature

**Backend:**
```powershell
# Remove files
Remove-Item packages/backend/src/services/rugMeter.js
Remove-Item packages/backend/src/routes/riskRoutes.js

# Edit index.js - remove risk routes mounting (lines 59-66)
```

**Frontend:**
```powershell
# Remove files
Remove-Item packages/frontend/src/types/risk.types.ts
Remove-Item packages/frontend/src/hooks/useRugProbability.ts
Remove-Item packages/frontend/src/components/risk/RugMeter.tsx

# Edit TokenDetail.tsx - remove RugMeter import and component
```

### Temporary Disable

**Comment out in `packages/backend/src/index.js`:**
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

**Comment out in `packages/frontend/src/TokenDetail.tsx`:**
```tsx
{/* <RugMeter policyId={token.policyId} /> */}
```

---

## Demo Script

For automated demo setup, use the PowerShell script:

```powershell
cd packages/backend
.\run_demo.ps1
```

Follow the prompts to select minimal or full mode.

---

## Tips for Judges/Demo

1. **Start with Health Check** - Shows server is running
2. **Show Hype Ratio** - Demonstrates social sentiment analysis
3. **Show Rug Meter** - Demonstrates risk analysis
4. **Open Frontend** - Visual demonstration of UI
5. **Click Through Token** - Show full user flow
6. **Highlight Features:**
   - Real-time analysis
   - Color-coded risk levels
   - Comprehensive metrics
   - Caching for performance
   - Defensive error handling

---

## Additional Resources

- Backend README: `packages/backend/README-rug.md`
- Frontend README: `packages/frontend/README-rug.md`
- E2E Verification: See artifacts directory
