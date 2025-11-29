# Rug Probability Meter - Frontend

## Overview

React component that displays rug pull probability analysis for meme coins with real-time data from the backend API.

## Files Added

### Types
- `src/types/risk.types.ts` - TypeScript interfaces for rug probability data

### Hooks
- `src/hooks/useRugProbability.ts` - React hook for fetching rug probability data

### Components
- `src/components/risk/RugMeter.tsx` - UI component with score display and metrics

### Integration
- `src/TokenDetail.tsx` - Added `<RugMeter />` component (line 145)

## Component Features

### Display Elements
- **Score**: Large number display (0-100)
- **Status**: Color-coded risk level with emoji
  - 🟢 GREEN: Low risk (0-29)
  - 🟡 YELLOW: Medium risk (30-69)
  - 🔴 RED: High risk (70-100)
- **Metrics Grid** (2x2):
  - Owner Concentration %
  - Liquidity Status (locked/unlocked)
  - Recent Mints count
  - Social Spike score
- **Risk Factors**: Bullet list of detected issues
- **Timestamp**: Last updated time with cache indicator

### States
- **Loading**: Animated skeleton with pulse effect
- **Error**: Red error message
- **Success**: Full data display with animations

## How to Run

### Start Frontend
```bash
cd packages/frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

### View Component
1. Open `http://localhost:5173`
2. Click on any token from the explorer
3. Scroll to "Coin Analysis Area"
4. See RugMeter next to HypeRatioCard

### Environment Configuration
Set API URL in `.env`:
```
VITE_API_URL=http://localhost:5001
```

Default: `http://localhost:5001` if not set

## Usage Example

```tsx
import { RugMeter } from './components/risk/RugMeter';

function TokenDetail({ token }) {
  return (
    <div>
      <RugMeter policyId={token.policyId} />
    </div>
  );
}
```

## API Integration

The component fetches from:
```
GET http://localhost:5001/api/memecoins/:policyId/rug-probability
```

See `packages/backend/README-rug.md` for API contract details.

## Styling

Uses Tailwind CSS with:
- Gradient backgrounds based on risk level
- Framer Motion animations
- Responsive grid layout (1 column mobile, 2 columns desktop)
- Dark mode compatible

## How to Revert

### Option 1: Git Revert (Recommended)
```bash
# Revert the commit that added rug meter frontend
git log --oneline --grep="rug" -i
git revert <commit-hash>
```

### Option 2: Manual Removal
```bash
# Remove files
rm src/types/risk.types.ts
rm src/hooks/useRugProbability.ts
rm src/components/risk/RugMeter.tsx

# Edit src/TokenDetail.tsx:
# - Remove import: import { RugMeter } from './components/features/risk/RugMeter';
# - Remove component: <RugMeter policyId={token.policyId} /> (line 145)

# Restart dev server
npm run dev
```

### Option 3: Comment Out Component
In `src/TokenDetail.tsx`, comment out the RugMeter:
```tsx
<div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <HypeRatioCard policyId={token.policyId} tokenName={token.name} />
    {/* <RugMeter policyId={token.policyId} /> */}
</div>
```

## Troubleshooting

**Component Not Rendering:**
- Check browser console for errors
- Verify `token.policyId` exists
- Check Network tab for API call

**API Call Fails:**
- Verify backend is running on port 5001
- Check CORS settings
- Verify `VITE_API_URL` environment variable

**Styling Issues:**
- Ensure Tailwind CSS is configured
- Check for conflicting CSS classes
- Verify Framer Motion is installed

## Browser Console Output

When component mounts:
```
RugMeter mounted test123
GET http://localhost:5001/api/memecoins/test123/rug-probability [200 OK]
```
