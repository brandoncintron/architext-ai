from fastapi import APIRouter
from pydantic import BaseModel
from api.src.chains import get_router_chain
from typing import List, Dict
from fastapi import HTTPException

router = APIRouter()

class IdeaPayload(BaseModel):
    idea: str
    platform: str
    model: str


@router.post("/generate_plan")
async def generate_plan(payload: IdeaPayload):
    print(f"Received Idea: {payload.idea}")
    print(f"Received Platform: {payload.platform}")
    print(f"Received Model: {payload.model}")

    router_chain = get_router_chain(model_name=payload.model)

    result = await router_chain.ainvoke(
        {"user_idea": payload.idea, "platform": payload.platform}
    )

    print("\nAI-generated Q&A session:")
    for question in result.questions:
        print(f"- {question.question}:")
        for option in question.options:
            print(f"  - {option}")


    return {"status": "success", "questions": [q.dict() for q in result.questions]}