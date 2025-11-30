const NodeCache = require('node-cache');

// Cache for storing trade history (in-memory)
const tradeCache = new NodeCache({ stdTTL: 3600 }); // 1 hour history

class TradeSimulator {
    async executeTrade(token, amount, type = 'buy') {
        // Simulate network delay (1-3 seconds)
        const delay = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Generate mock transaction hash
        const txHash = this.generateTxHash();

        // Mock success/failure (95% success rate)
        const success = Math.random() > 0.05;

        if (!success) {
            throw new Error('Slippage tolerance exceeded');
        }

        const tradeRecord = {
            txHash,
            token: token.symbol || 'UNKNOWN',
            amount,
            type,
            price: (Math.random() * 10).toFixed(6),
            timestamp: Date.now(),
            status: 'confirmed',
            explorerUrl: `https://preprod.cardanoscan.io/transaction/${txHash}`
        };

        // Store in cache
        const history = tradeCache.get('trades') || [];
        history.push(tradeRecord);
        tradeCache.set('trades', history);

        return {
            success: true,
            ...tradeRecord
        };
    }

    generateTxHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    getTradeHistory() {
        return tradeCache.get('trades') || [];
    }
}

module.exports = new TradeSimulator();
