from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from xray_engine import scan_policy
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

app = FastAPI()

class PolicyAnalysisRequest(BaseModel):
    policy_data: dict

@app.get("/")
def read_root():
    return {"status": "online", "service": "NexGuard Scanner Core"}

@app.get("/xray/{policy_id}")
def xray_scan(policy_id: str):
    return scan_policy(policy_id)

@app.post("/analyze_policy")
async def analyze_policy(request: PolicyAnalysisRequest):
    try:
        prompt = f"""SYSTEM PROMPT: "You are Masumi, a Senior Smart Contract Auditor for the NexGuard platform.

Task: I will provide you with a JSON object representing a Cardano Minting Policy (Script). Your job is to translate this technical data into a warning for a non-technical investor.

Rules:

Identify the Type: If you see "type": "sig", explain that 'Only the wallet with this signature can mint.'

Check Timelocks: If you see "type": "before", "slot": <number>, convert the slot number to a readable Date. Explain that 'Minting authority expires on this date (Locked).'

Warn about Plutus: If the input says 'Plutus Smart Contract' and provides no JSON details, warn the user: 'This code is compiled and opaque. Without a verified audit link, assume the developer retains full control.'

Tone: Professional, protective, and concise.

Input Data: {request.policy_data}"""

        response = model.generate_content(prompt)
        return {"explanation": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

