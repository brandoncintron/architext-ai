from fastapi import APIRouter
from pydantic import BaseModel
from api.src.chains import get_router_chain, get_validator_chain
from typing import List, Dict
from fastapi import HTTPException

router = APIRouter()

class IdeaPayload(BaseModel):
    idea: str
    platform: str


@router.post("/generate_plan")
async def generate_plan(payload: IdeaPayload):
    print(f"Received Idea: {payload.idea}")
    print(f"Received Platform: {payload.platform}")

    # Step 1: Validate the user's input
    validator_chain = get_validator_chain()
    validation_result = await validator_chain.ainvoke({"user_idea": payload.idea, "platform": payload.platform})

    if not validation_result.is_project_idea:
        print(f"Validation failed: {validation_result.reason}")
        raise HTTPException(status_code=400, detail=validation_result.reason)
    
    print("Validation successful, proceeding to generate questions.")

    # Step 2: Generate the questions
    router_chain = get_router_chain()

    # Invoke the chain with the user's idea.
    result = await router_chain.ainvoke(
        {"user_idea": payload.idea, "platform": payload.platform}
    )

    print("\nAI-generated questions:")
    for question in result.questions:
        print(f"- {question.question}")

    return {"status": "success", "questions": [q.dict() for q in result.questions]}