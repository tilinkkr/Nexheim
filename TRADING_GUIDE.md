# 🎯 Trading Guide - NexGuard DApp

## Overview

The NexGuard trading feature allows users to execute trades even for high-risk tokens, with full transparency about the risks involved.

## How to Trade

### Step 1: View Token Details
1. Navigate to the token explorer
2. Click on any token to view its detail page
3. Review the risk analysis:
   - **Hype-to-Price Ratio** - Social sentiment vs price action
   - **Rug Probability Meter** - On-chain risk assessment
   - **Trust Score** - Overall safety rating

### Step 2: Click "Trade Anyway"
The prominent gradient button is located in the actions section:
- **Blue to Purple gradient** for visual appeal
- **Always visible** regardless of risk level
- **Clear call-to-action** text

### Step 3: Review Risk Warning
The trade modal displays:
- Current trust score
- Rug probability assessment
- Liquidity status
- Clear warning message

### Step 4: Enter Trade Amount
- Input amount in ADA
- View your current balance
- Click "Max" for maximum amount

### Step 5: Confirm Trade
- Click "Confirm Trade Anyway"
- Transaction executes on Cardano blockchain
- Receive transaction hash and explorer link

## Trade Modal Features

### Risk Warnings
- **High Risk (Score < 50)**: Red warning banner
- **Medium Risk (Score 50-70)**: Yellow caution banner
- **Low Risk (Score > 70)**: Green informational banner

### Transaction States
1. **Input** - Enter trade amount
2. **Loading** - Transaction processing with spinner
3. **Success** - Green checkmark with transaction hash
4. **Error** - Red error message with details

### Safety Features
- Wallet connection required
- Risk disclosure before trade
- Transaction confirmation
- Explorer link for verification

## Button Design

The "Trade Anyway" button features:
- **Gradient**: Blue (#3B82F6) to Purple (#9333EA)
- **Hover Effect**: Lighter gradient on hover
- **Shadow**: Blue glow for depth
- **Size**: Full-width, prominent placement
- **Text**: Bold, clear call-to-action

## User Flow

```
Token Detail Page
    ↓
View Risk Analysis
    ↓
Click "Trade Anyway"
    ↓
Trade Modal Opens
    ↓
Review Risk Warning
    ↓
Enter Amount
    ↓
Confirm Trade
    ↓
Transaction Executes
    ↓
Success Screen with TX Hash
```

## Why "Trade Anyway"?

The button is intentionally named "Trade Anyway" to:
1. **Acknowledge Risk** - Users know they're proceeding despite warnings
2. **Informed Decision** - Clear that they've seen the risk analysis
3. **User Empowerment** - Allows trading even for high-risk tokens
4. **Transparency** - No hidden risks or surprises

## Best Practices

### For Safe Trading
1. ✅ Review all risk metrics before trading
2. ✅ Check liquidity lock status
3. ✅ Verify owner concentration
4. ✅ Read risk factors carefully
5. ✅ Start with small amounts
6. ✅ Verify transaction on explorer

### Red Flags to Watch
- 🚨 Trust score below 30
- 🚨 Liquidity unlocked
- 🚨 High owner concentration (>50%)
- 🚨 Multiple audit flags
- 🚨 Unusual social media spike

## Technical Implementation

### Frontend Components
- `TradeModal.tsx` - Main trading interface
- `useTrade.ts` - Trade execution hook
- Button in `TokenDetail.tsx` - Entry point

### Backend Integration
- Simulated blockchain transactions
- Transaction hash generation
- Explorer URL construction

### Wallet Integration
- Mesh SDK for Cardano
- Wallet connection required
- Balance checking
- Transaction signing

## Customization

To modify the button appearance, edit `TokenDetail.tsx`:

```tsx
<button
    className="bg-gradient-to-r from-blue-600 to-purple-600 
               hover:from-blue-700 hover:to-purple-700 
               text-white font-bold py-3 px-6 rounded-xl 
               transition-all shadow-lg shadow-blue-500/20"
    onClick={() => setShowTradeModal(true)}
>
    Trade Anyway
</button>
```

## Accessibility

- Keyboard navigation supported
- Screen reader friendly
- High contrast for visibility
- Clear focus states
- Disabled state when wallet not connected

## Security Considerations

1. **Wallet Connection** - Required before trading
2. **Risk Disclosure** - Mandatory warning display
3. **Amount Validation** - Checks against balance
4. **Transaction Verification** - Explorer link provided
5. **Error Handling** - Clear error messages

## Future Enhancements

- [ ] Real Cardano blockchain integration
- [ ] Slippage tolerance settings
- [ ] Gas fee estimation
- [ ] Trade history tracking
- [ ] Limit orders
- [ ] Stop-loss functionality

## Support

If you encounter issues:
1. Check wallet connection
2. Verify sufficient ADA balance
3. Review browser console for errors
4. Check network connectivity
5. Try refreshing the page

## Conclusion

The "Trade Anyway" feature empowers users to make informed trading decisions while maintaining full transparency about risks. The prominent button design ensures users can easily access trading functionality while being fully aware of potential dangers.

**Remember:** Always trade responsibly and never invest more than you can afford to lose!
