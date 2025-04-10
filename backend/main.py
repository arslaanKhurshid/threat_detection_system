from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS configuration to allow Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "*"],  # Allow local dev and Docker
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
threats = []
rules = []
alerts = []

# Pydantic models
class Threat(BaseModel):
    id: str
    timestamp: str
    ip: str
    event: str

class Rule(BaseModel):
    id: str
    condition: str

class Alert(BaseModel):
    id: str
    threat_id: str
    rule_id: str
    message: str

# Endpoints
@app.get("/threats", response_model=List[Threat])
async def get_threats():
    return threats

@app.post("/threats")
async def add_threat(threat: Threat, request: Request):
    print(f"Received threat: {await request.json()}")  # Debug log
    threats.append(threat)
    check_rules(threat)
    return threat

@app.get("/rules", response_model=List[Rule])
async def get_rules():
    return rules

@app.post("/rules")
async def add_rule(rule: Rule, request: Request):
    print(f"Received rule: {await request.json()}")  # Debug log
    rules.append(rule)
    return rule

@app.get("/alerts", response_model=List[Alert])
async def get_alerts():
    return alerts

# Rule checking logic
def check_rules(threat: Threat):
    for rule in rules:
        if "starts with" in rule.condition:
            prefix = rule.condition.split("starts with")[1].strip()
            if threat.ip.startswith(prefix):
                alerts.append(Alert(
                    id=f"alert-{len(alerts) + 1}",
                    threat_id=threat.id,
                    rule_id=rule.id,
                    message=f"Threat {threat.id} matches rule {rule.id}"
                ))
        elif "contains" in rule.condition:
            keyword = rule.condition.split("contains")[1].strip()
            if keyword in threat.event:
                alerts.append(Alert(
                    id=f"alert-{len(alerts) + 1}",
                    threat_id=threat.id,
                    rule_id=rule.id,
                    message=f"Threat {threat.id} matches rule {rule.id}"
                ))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)