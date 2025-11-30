import asyncio
import sys
import os

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mpm_agent import analyze_mpm_for_token

async def main():
    context = {
        "policy_id": "test_policy",
        "symbol": "TEST",
        "recent_mentions": [
            {"platform": "x", "count": 50, "window_min": 5},
            {"platform": "telegram", "count": 30, "window_min": 5},
        ]
    }
    print("Running analysis...")
    try:
        result = await analyze_mpm_for_token(context)
        print("Result:", result)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
