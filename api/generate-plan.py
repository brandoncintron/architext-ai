from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from api.src.chains import get_router_chain
from typing import List, Dict

app = FastAPI()

origins = [
    "http://localhost:3000",
]

if os.environ.get("VERCEL_URL"):
    origins.append(f"https://{os.environ.get('VERCEL_URL')}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaPayload(BaseModel):
    idea: str
    platform: str

@app.post("/api/generate-plan")
async def generate_plan(payload: IdeaPayload):
    print(f"Received Idea: {payload.idea}")
    
    router_chain = get_router_chain()
    
    # Invoke the chain with the user's idea.
    result = await router_chain.ainvoke({"user_idea": payload.idea})
    
    print("\nAI-generated questions:")
    for question in result.questions:
        print(f"- {question.question}")

    return {
        "status": "success", 
        "questions": [q.dict() for q in result.questions]
    }