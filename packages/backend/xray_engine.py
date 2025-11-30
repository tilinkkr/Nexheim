import os
import datetime
from blockfrost import BlockFrostApi, ApiError
from dotenv import load_dotenv

load_dotenv()
API = BlockFrostApi(project_id=os.getenv('BLOCKFROST_PROJECT_ID'))

def scan_policy(policy_id):
    """
    Analyzes a Cardano Policy ID to see if it is:
    1. A Native Script (Timelock) - Transparent, Readable JSON.
    2. A Plutus Script - Opaque, Compiled Code (High Risk without Audit).
    3. A Simple Key - (Old school, usually safe but centralized).
    """
    try:
        # 1. Ask Blockfrost about the script
        try:
            script = API.script(script_hash=policy_id)
        except ApiError:
            # If Blockfrost returns 404 for /scripts/, it is often a simple native key policy
            return {
                "status": "success",
                "type": "Simple Native Asset",
                "risk_score": 10,
                "risk_label": "LOW",
                "description": "This is a standard Native Asset locked by a private key.",
                "details": {"type": "sig"}
            }

        # 2. Check Script Type
        if script.type == 'timelock':
            # It's a Native Script (we can see the logic!)
            logic = API.script_json(script_hash=policy_id)
            
            # Basic Heuristic Check
            risk = "LOW"
            score = 10
            
            # If it has "before" (Time lock), it might be locked liquidity
            # If it has "all" (Multisig), it's safer
            return {
                "status": "success",
                "type": "Native Timelock Script",
                "risk_score": score,
                "risk_label": risk,
                "description": "Transparent rules defined on-chain.",
                "details": logic # Send this raw JSON to Masumi
            }
            
        elif 'plutus' in script.type:
             return {
                "status": "success",
                "type": "Plutus Smart Contract",
                "risk_score": 80,
                "risk_label": "HIGH (Requires Audit)",
                "description": "Complex Smart Contract. Code is compiled and opaque.",
                "details": "Binary Data (CBOR)" 
            }
            
        else:
             return {
                "status": "success",
                "type": "Unknown Script",
                "risk_score": 50,
                "risk_label": "MEDIUM",
                "details": script.to_dict()
            }

    except Exception as e:
        return {"status": "error", "message": str(e)}
