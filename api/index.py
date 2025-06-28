from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from api.src.chains import get_router_chain

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

class IdeaPayload(BaseModel):
    idea: str
    platform: str

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.post("/api/generate-plan")
async def generate_plan(payload: IdeaPayload):
    print(f"Received Idea: {payload.idea}")
    
    router_chain = get_router_chain()
    
    # Invoke the chain with the user's idea.
    # The result will be a Pydantic QuestionRouter object.
    result = await router_chain.ainvoke({"user_idea": payload.idea})
    
    print("\nAI-generated questions:")
    for question in result.questions:
        print(f"- {question.question}")

    # For now, return a placeholder.
    # In the next step, this will return the first question to the frontend.
    return {
        "status": "success", 
        "questions": [q.dict() for q in result.questions]
    }