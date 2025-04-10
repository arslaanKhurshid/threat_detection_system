from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

# In-memory storage
logs = []
rules = []

# Pydantic models
class Log(BaseModel):
    timestamp: str
    ip: str
    event_type: str

class Rule(BaseModel):
    id: int
    condition: str  # e.g., "ip == '192.168.1.1'"

# Mock logs endpoint
@app.post("/logs")
async def add_log(log: Log):
    logs.append(log.dict())
    return {"message": "Log added"}

# Rules endpoint
@app.post("/rules")
async def add_rule(rule: Rule):
    rules.append(rule.dict())
    return {"message": "Rule added"}

# Threat detection endpoint
@app.get("/detect")
async def detect_threats():
    threats = []
    for log in logs:
        for rule in rules:
            if eval_rule(log, rule["condition"]):  # Simplified evaluation
                threats.append({"log": log, "rule": rule})
    return {"threats": threats}

# Groq API integration
@app.post("/suggest-rule")
async def suggest_rule(log: Log):
    response = requests.post(
        "https://api.groq.com/v1/endpoint",  # Replace with actual Groq endpoint
        headers={"Authorization": f"Bearer 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"},
        json={"prompt": f"Suggest a detection rule for log: {log.dict()}"}
    )
    return response.json()

def eval_rule(log, condition):
    # Simplified rule evaluation (e.g., "ip == '192.168.1.1'")
    return eval(condition.replace("ip", f"'{log['ip']}'"))