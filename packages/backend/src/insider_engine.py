import os
import asyncio
import time
import httpx
import networkx as nx
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

# Import models and db helpers
# Assuming running from root, so imports should work if sys.path is correct
from packages.backend.src.models import BundleAnalysisResult, GraphNode, GraphLink
from packages.backend.src.bundle_db_sqlite import fetch_bundle, upsert_bundle

BLOCKFROST_PROJECT_ID = os.getenv("BLOCKFROST_PROJECT_ID")
BLOCKFROST_BASE = os.getenv("BLOCKFROST_BASE", "https://cardano-preview.blockfrost.io/api/v0")

async def _bf_get(client: httpx.AsyncClient, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
    """
    Helper to fetch from Blockfrost with retries and exponential backoff.
    Returns None if all attempts fail.
    """
    if not BLOCKFROST_PROJECT_ID:
        return None

    url = f"{BLOCKFROST_BASE}{path}"
    headers = {"project_id": BLOCKFROST_PROJECT_ID}
    
    retries = 3
    backoff = 0.5

    for attempt in range(retries):
        try:
            resp = await client.get(url, headers=headers, params=params)
            resp.raise_for_status()
            return resp.json()
        except (httpx.RequestError, httpx.HTTPStatusError) as e:
            # print(f"Attempt {attempt+1} failed for {url}: {e}")
            if attempt == retries - 1:
                return None
            await asyncio.sleep(backoff)
            backoff *= 2.0
    return None

async def analyze_bundle(policy_id: str) -> BundleAnalysisResult:
    """
    Analyzes a token bundle to identify insider trading clusters.
    Uses SQLite cache if available and fresh (< 24h).
    """
    # 1. Check Cache
    cached_data = fetch_bundle(policy_id)
    if cached_data:
        # Check timestamp
        try:
            ts_str = cached_data.get("timestamp")
            if ts_str:
                cached_ts = datetime.fromisoformat(ts_str)
                if datetime.utcnow() - cached_ts < timedelta(hours=24):
                    # Cache hit and fresh
                    # Reconstruct object from dict
                    return BundleAnalysisResult(**cached_data)
        except Exception:
            pass # Ignore cache errors, proceed to fetch

    # 2. Initialize Result (Default Empty)
    result = BundleAnalysisResult(
        policy_id=policy_id,
        nodes=[],
        links=[],
        risk_score=0,
        timestamp=datetime.utcnow()
    )

    if not BLOCKFROST_PROJECT_ID:
        # Graceful exit if no key
        return result

    async with httpx.AsyncClient(timeout=10.0) as client:
        # 3. Fetch Top Holders
        # /assets/{policy_id}/addresses?count=20&order=desc
        holders_data = await _bf_get(client, f"/assets/{policy_id}/addresses", params={"count": 20, "order": "desc"})
        
        if not holders_data:
            return result

        G = nx.DiGraph()
        
        # Process holders concurrently? Or sequential for simplicity/rate-limits?
        # Sequential is safer for rate limits unless we have a paid plan.
        # Let's do sequential for safety as per requirements implication.
        
        for holder in holders_data:
            address = holder.get("address")
            if not address:
                continue
                
            # Add holder node
            G.add_node(address, type="holder")

            # 4. Find Funder
            # /addresses/{addr}/transactions?order=asc&count=1 (First tx ever)
            txs = await _bf_get(client, f"/addresses/{address}/transactions", params={"order": "asc", "count": 1})
            
            if txs and len(txs) > 0:
                first_tx_hash = txs[0].get("tx_hash")
                if first_tx_hash:
                    # Get UTXOs to find input address
                    # /txs/{tx_hash}/utxos
                    utxos = await _bf_get(client, f"/txs/{first_tx_hash}/utxos")
                    if utxos and "inputs" in utxos and len(utxos["inputs"]) > 0:
                        funder_address = utxos["inputs"][0].get("address")
                        if funder_address:
                            # Add edge Funder -> Holder
                            G.add_edge(funder_address, address)

        # 5. Analyze Graph
        nodes_list = []
        links_list = []
        masters_count = 0

        # Calculate degrees
        out_degrees = dict(G.out_degree())
        
        for node in G.nodes():
            # Determine group and color
            # If out_degree > 3: group "master", color #ff0055
            # Else group "victim", color #00ff88
            
            # Note: A node might be both a funder and a holder. 
            # Logic implies if it funded > 3 others, it's a master.
            
            degree = out_degrees.get(node, 0)
            if degree > 3:
                group = "master"
                color = "#ff0055"
                masters_count += 1
            else:
                group = "victim"
                color = "#00ff88"
            
            nodes_list.append(GraphNode(id=node, group=group, color=color))

        for source, target in G.edges():
            links_list.append(GraphLink(source=source, target=target))

        # 6. Calculate Risk Score
        # risk_score: min(100, masters_count * 20)
        risk_score = min(100, masters_count * 20)

        # Update Result
        result.nodes = nodes_list
        result.links = links_list
        result.risk_score = risk_score
        result.timestamp = datetime.utcnow()

        # 7. Persist
        upsert_bundle(result)

    return result
