import pytest
import asyncio
from unittest.mock import patch, MagicMock
from packages.backend.src.insider_engine import analyze_bundle
from packages.backend.src.models import BundleAnalysisResult

# Mock data
MOCK_HOLDERS = [
    {"address": "addr_1"},
    {"address": "addr_2"},
    {"address": "addr_3"},
    {"address": "addr_4"},
]

@pytest.mark.asyncio
async def test_insider_engine_master_logic():
    # Mock fetch_bundle to bypass cache
    with patch("packages.backend.src.insider_engine.fetch_bundle", return_value=None):
        # Mock _bf_get to simulate 1 master funding 4 holders
        async def mock_bf_get(client, path, params=None):
            if "/assets/" in path and "/addresses" in path:
                return MOCK_HOLDERS
            if "/transactions" in path:
                return [{"tx_hash": "tx_gen"}]
            if "/utxos" in path:
                # All funded by master_addr
                return {"inputs": [{"address": "master_addr"}]}
            return None

        with patch("packages.backend.src.insider_engine._bf_get", side_effect=mock_bf_get):
            # Ensure BLOCKFROST_PROJECT_ID is set
            with patch("packages.backend.src.insider_engine.BLOCKFROST_PROJECT_ID", "fake_key"):
                 # Patch upsert_bundle to avoid DB writes
                with patch("packages.backend.src.insider_engine.upsert_bundle"):
                    result = await analyze_bundle("policy_xyz")

                    # Assertions
                    # 4 holders + 1 master = 5 nodes
                    assert len(result.nodes) >= 5 
                    
                    # Find master
                    master = next((n for n in result.nodes if n.id == "master_addr"), None)
                    assert master is not None
                    assert master.group == "master"
                    assert master.color == "#ff0055"
                    
                    # Find victim
                    victim = next((n for n in result.nodes if n.id == "addr_1"), None)
                    assert victim is not None
                    assert victim.group == "victim"
                    
                    # Risk score should be > 0
                    # 1 master * 20 = 20
                    assert result.risk_score == 20

@pytest.mark.asyncio
async def test_insider_engine_graceful_fail():
    with patch("packages.backend.src.insider_engine.fetch_bundle", return_value=None):
        with patch("packages.backend.src.insider_engine._bf_get", return_value=None):
             with patch("packages.backend.src.insider_engine.BLOCKFROST_PROJECT_ID", "fake_key"):
                 result = await analyze_bundle("policy_fail")
                 assert result.risk_score == 0
                 assert len(result.nodes) == 0
