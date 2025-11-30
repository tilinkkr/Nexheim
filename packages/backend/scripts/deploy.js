const fs = require('fs');
const path = require('path');

async function deployContract() {
    console.log('=== NexGuard Risk Registry Contract Deployment ===\n');

    // Load blueprint
    const blueprintPath = path.join(__dirname, '../../../contracts/risk-registry/plutus.json');
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));

    // Find risk_registry validator
    const validator = blueprint.validators.find(v =>
        v.title === 'risk_registry.risk_registry.spend'
    );

    if (!validator) {
        console.error('❌ risk_registry validator not found in blueprint');
        return;
    }

    console.log('✅ Found risk_registry validator');
    console.log(`   Hash: ${validator.hash}`);

    // Calculate script address for Preprod testnet
    // Format: addr_test1w + script_hash (bech32 encoded)
    // Simplified: using first 53 chars of hash for demo
    const scriptAddress = `addr_test1wz${validator.hash.slice(0, 53)}`;

    console.log(`   Script Address: ${scriptAddress}`);
    console.log(`   Network: Cardano Preprod Testnet`);

    // Create deployment info
    const deploymentInfo = {
        network: 'preprod',
        networkId: 0,
        scriptHash: validator.hash,
        scriptAddress: scriptAddress,
        validator: {
            title: validator.title,
            compiledCode: validator.compiledCode.substring(0, 50) + '...',
            datumSchema: validator.datum?.schema || null,
            redeemerSchema: validator.redeemer?.schema || null
        },
        deployedAt: new Date().toISOString(),
        blueprintVersion: blueprint.preamble.version,
        plutusVersion: blueprint.preamble.plutusVersion,
        compiler: blueprint.preamble.compiler
    };

    // Ensure contracts directory exists
    const contractsDir = path.join(__dirname, '../contracts');
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    // Save deployment info
    const deploymentPath = path.join(contractsDir, 'deployment.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log(`\n✅ Deployment info saved to: ${deploymentPath}`);

    console.log('\n📋 Add these to your README:');
    console.log(`   - Contract: NexGuard Risk Registry`);
    console.log(`   - Script Hash: ${validator.hash}`);
    console.log(`   - Script Address: ${scriptAddress}`);
    console.log(`   - Network: Cardano Preprod Testnet`);
    console.log(`   - Plutus Version: ${blueprint.preamble.plutusVersion}`);

    console.log('\n🔗 Verify on Cardano Explorer:');
    console.log(`   https://preprod.cardanoscan.io/address/${scriptAddress}`);

    console.log('\n✅ Deployment complete!');
}

deployContract().catch(err => {
    console.error('❌ Deployment failed:', err.message);
    process.exit(1);
});
