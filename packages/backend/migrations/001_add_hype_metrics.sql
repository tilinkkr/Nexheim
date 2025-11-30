-- Add hype_metrics table
CREATE TABLE IF NOT EXISTS hype_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  policyId TEXT NOT NULL,
  tokenName TEXT,
  hypeScore INTEGER NOT NULL,
  socialMentions INTEGER DEFAULT 0,
  searchTrends INTEGER DEFAULT 0,
  communityActivity INTEGER DEFAULT 0,
  priceChange REAL,
  volume24h INTEGER DEFAULT 0,
  currentPrice REAL,
  ratio REAL,
  status TEXT,
  risk TEXT,
  message TEXT,
  explanation TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  FOREIGN KEY (policyId) REFERENCES tokens(policyId)
);

CREATE INDEX IF NOT EXISTS idx_hype_policyId ON hype_metrics(policyId);
CREATE INDEX IF NOT EXISTS idx_hype_timestamp ON hype_metrics(timestamp);
