from fastapi import APIRouter
from pydantic import BaseModel
from api.src.chains import get_tdd_chain
from typing import List, Dict

router = APIRouter()


class TDDGenerationPayload(BaseModel):
    initialFormValues: Dict
    questions: List[Dict]
    answers: List[str]
    finalClarification: str


@router.post("/generate_tdd")
async def generate_tdd(payload: TDDGenerationPayload):
    print("Received payload for TDD generation")

    # Format the questions and answers for the prompt
    qa_pairs = [
        f"Q: {q['question']}\nA: {a}"
        for q, a in zip(payload.questions, payload.answers)
    ]
    questions_and_answers = "\n".join(qa_pairs)

    tdd_chain = get_tdd_chain()

    result = await tdd_chain.ainvoke(
        {
            "user_idea": payload.initialFormValues.get("idea", ""),
            "platform": payload.initialFormValues.get("platform", ""),
            "questions_and_answers": questions_and_answers,
            "final_clarification": payload.finalClarification,
        }
    )

    print("TDD Generated successfully.")

    return {"status": "success", "tdd": result.tdd}