const express = require('express');
const router = express.Router();

// Health check endpoint - always available, minimal dependencies
router.get('/__health', (req, res) => {
    res.json({
        status: 'ok',
        pid: process.pid,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        ts: Date.now()
    });
});

console.log('[HEALTH] Health endpoint registered');

module.exports = router;
