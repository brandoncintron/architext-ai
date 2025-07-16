"""
@file This file defines the LangChain chains for the application.
"""
from langchain_google_genai import ChatGoogleGenerativeAI

from api.src.models import QuestionRouter, TDD, ProjectIdeaValidator
from api.src.prompts import RouterPrompt, TDDGeneratorPrompt, ValidatorPrompt
import os

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=os.environ.get("GOOGLE_API_KEY")
)

def get_validator_chain():
    structured_llm = llm.with_structured_output(ProjectIdeaValidator)

    validator_chain = ValidatorPrompt | structured_llm

    return validator_chain

def get_router_chain():
    structured_llm = llm.with_structured_output(QuestionRouter)

    router_chain = RouterPrompt | structured_llm
    
    return router_chain

def get_tdd_chain():
    structured_llm = llm.with_structured_output(TDD)

    tdd_chain = TDDGeneratorPrompt | structured_llm
    
    return tdd_chain
