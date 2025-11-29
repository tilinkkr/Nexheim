import sqlite3
import os
import json
from datetime import datetime
from packages.backend.src.models import BundleAnalysisResult

BUNDLE_DB_PATH = os.getenv("BUNDLE_DB_PATH", "./nexguard_bundles.db")
BUNDLE_TABLE = os.getenv("BUNDLE_TABLE", "bundles")

def get_connection():
    conn = sqlite3.connect(BUNDLE_DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def _init_db():
    conn = get_connection()
    try:
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS {BUNDLE_TABLE} (
                policy_id TEXT PRIMARY KEY,
                payload   TEXT NOT NULL,
                timestamp TEXT NOT NULL
            );
        """)
        conn.execute(f"""
            CREATE INDEX IF NOT EXISTS idx_{BUNDLE_TABLE}_timestamp ON {BUNDLE_TABLE}(timestamp);
        """)
        conn.commit()
    finally:
        conn.close()

# Ensure table + indexes on module import
_init_db()

def fetch_bundle(policy_id: str) -> dict | None:
    conn = get_connection()
    try:
        cursor = conn.execute(f"SELECT payload FROM {BUNDLE_TABLE} WHERE policy_id = ?", (policy_id,))
        row = cursor.fetchone()
        if row:
            return json.loads(row["payload"])
        return None
    finally:
        conn.close()

def upsert_bundle(result: BundleAnalysisResult) -> None:
    conn = get_connection()
    try:
        payload = result.json()
        timestamp = result.timestamp.isoformat()
        conn.execute(f"""
            INSERT OR REPLACE INTO {BUNDLE_TABLE} (policy_id, payload, timestamp)
            VALUES (?, ?, ?)
        """, (result.policy_id, payload, timestamp))
        conn.commit()
    finally:
        conn.close()
