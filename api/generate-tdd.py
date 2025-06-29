from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from api.src.chains import get_tdd_chain
from typing import List, Dict

app = FastAPI()

origins = [
    "http://localhost:3000",
]

# Add Vercel deployment URL in production
if os.environ.get("VERCEL_URL"):
    origins.append(f"https://{os.environ.get('VERCEL_URL')}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TDDGenerationPayload(BaseModel):
    initialFormValues: Dict
    questions: List[Dict]
    answers: List[str]
    finalClarification: str


@app.post("/api/generate-tdd")
async def generate_tdd(payload: TDDGenerationPayload):
    print("Received payload for TDD generation")
    
    # Format the questions and answers for the prompt
    qa_pairs = [
        f"Q: {q['question']}\nA: {a}" 
        for q, a in zip(payload.questions, payload.answers)
    ]
    questions_and_answers = "\n".join(qa_pairs)
    
    tdd_chain = get_tdd_chain()
    
    result = await tdd_chain.ainvoke({
        "user_idea": payload.initialFormValues.get("idea", ""),
        "platform": payload.initialFormValues.get("platform", ""),
        "questions_and_answers": questions_and_answers,
        "final_clarification": payload.finalClarification
    })
    
    print("TDD Generated successfully.")
    
    return {
        "status": "success",
        "tdd": result.tdd
    }