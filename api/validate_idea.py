from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.src.chains import get_validator_chain

router = APIRouter()

class IdeaPayload(BaseModel):
    idea: str
    platform: str

@router.post("/validate_idea")
async def validate_idea(payload: IdeaPayload):
    print(f"Received Idea for validation: {payload.idea}")
    print(f"Received Platform for validation: {payload.platform}")

    validator_chain = get_validator_chain()
    validation_result = await validator_chain.ainvoke({"user_idea": payload.idea, "platform": payload.platform})

    if not validation_result.is_project_idea:
        print(f"Validation failed: {validation_result.reason}")
        raise HTTPException(status_code=400, detail=validation_result.reason)
    
    print("Validation successful.")
    return {"status": "success", "message": "Idea is valid."} 