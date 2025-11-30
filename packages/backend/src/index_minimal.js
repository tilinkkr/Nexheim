// src/index_minimal.js
Error.stackTraceLimit = 50;
console.log('[MIN] Starting minimal server', new Date().toISOString());
process.on('uncaughtException', e => console.error('[MIN] uncaughtException', e && e.stack ? e.stack : e));
process.on('unhandledRejection', e => console.error('[MIN] unhandledRejection', e && e.stack ? e.stack : e));

const express = require('express');
const app = express();

app.get('/__health', (req, res) => res.json({ status: 'minimal-ok', pid: process.pid }));
app.get('/api/tokens/:policyId/hype-ratio', (req, res) => {
    console.log('[MIN] Hype ratio endpoint HIT for', req.params.policyId);
    res.json({
        policyId: req.params.policyId,
        tokenName: req.query.name || 'TestToken',
        hypeScore: 65,
        priceChange: '12.34',
        ratio: '5.27',
        status: 'balanced',
        message: '⚖️ Hype matches price action - MINIMAL SERVER'
    });
});

const port = 5001;
app.listen(port, () => console.log(`[MIN] listening on http://localhost:${port}`));
