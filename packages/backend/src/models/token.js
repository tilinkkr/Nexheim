const tokens = [];

function addToken({ name, symbol }) {
  const tokenId = 'tok_' + Math.random().toString(36).slice(2, 12);
  // Simple demo trust_score:
  const trust_score = Math.floor(Math.random() * 100);
  const token = { tokenId, name, symbol, trust_score, flags: [], created_at: new Date().toISOString() };
  tokens.push(token);
  return token;
}

function getToken(tokenId) {
  return tokens.find(t => t.tokenId === tokenId);
}

function getAllTokens() {
  return tokens;
}

module.exports = {
  addToken,
  getToken,
  getAllTokens,
};
