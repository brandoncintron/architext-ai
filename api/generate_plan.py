from fastapi import APIRouter
from pydantic import BaseModel
from api.src.chains import get_router_chain
from typing import List, Dict

router = APIRouter()

class IdeaPayload(BaseModel):
    idea: str
    platform: str


@router.post("/generate-plan")
async def generate_plan(payload: IdeaPayload):
    print(f"Received Idea: {payload.idea}")

    router_chain = get_router_chain()

    # Invoke the chain with the user's idea.
    result = await router_chain.ainvoke({"user_idea": payload.idea})

    print("\nAI-generated questions:")
    for question in result.questions:
        print(f"- {question.question}")

    return {"status": "success", "questions": [q.dict() for q in result.questions]}