from fastapi import APIRouter
from pydantic import BaseModel
from api.src.chains import get_tdd_chain
from typing import List, Dict, Union, Optional

router = APIRouter()


class TDDGenerationPayload(BaseModel):
    initialFormValues: Dict
    questions: List[Dict]
    answers: List[Optional[Union[str, List[str]]]]
    finalClarification: str
    model: str


@router.post("/generate_tdd")
async def generate_tdd(payload: TDDGenerationPayload):
    print("Received payload for TDD generation")
    print(f"Generating TDD with: {payload.model}")

    # Format the questions and answers for the prompt
    qa_pairs = []
    for q, a in zip(payload.questions, payload.answers):
        answer_str = ""
        if isinstance(a, list):
            answer_str = ", ".join(a)
        elif a:
            answer_str = a

        if answer_str:
            qa_pairs.append(f"Q: {q['question']}\nA: {answer_str}")

    questions_and_answers = "\n".join(qa_pairs)
    print(questions_and_answers)

    tdd_chain = get_tdd_chain(model_name=payload.model)

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