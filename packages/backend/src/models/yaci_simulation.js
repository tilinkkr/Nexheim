// Simulation of Yaci Store data

function getAssetDetails(assetId) {
    // Simulate a delay
    return {
        asset_name: "SimulatedAsset_" + assetId.slice(0, 5),
        fingerprint: "asset1" + Math.random().toString(36).slice(2, 15),
        policy_id: "policy" + Math.random().toString(36).slice(2, 15),
        quantity: "1000000",
        initial_mint_tx_hash: "tx" + Math.random().toString(36).slice(2, 20),
        on_chain_metadata: {
            name: "Simulated Token " + assetId,
            image: "ipfs://QmSimulatedImageHash",
            description: "This is a simulated token from Yaci Store."
        }
    };
}

function getAssetTxs(assetId) {
    // Return a few mock transactions
    return [
        {
            tx_hash: "tx" + Math.random().toString(36).slice(2, 20),
            block_height: 123456,
            block_time: new Date().toISOString(),
            tx_index: 0,
            amount: "1000"
        },
        {
            tx_hash: "tx" + Math.random().toString(36).slice(2, 20),
            block_height: 123457,
            block_time: new Date(Date.now() - 100000).toISOString(),
            tx_index: 1,
            amount: "500"
        }
    ];
}

module.exports = {
    getAssetDetails,
    getAssetTxs
};
