"""
@file This file defines the LangChain chains for the application.
"""
from langchain_google_genai import ChatGoogleGenerativeAI

from api.src.models import QuestionRouter, TDD, ProjectIdeaValidator
from api.src.prompts import RouterPrompt, TDDGeneratorPrompt, ValidatorPrompt
import os

# Initialize Gemini
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    max_tokens=10000,
    google_api_key=os.environ.get("GOOGLE_API_KEY")
)

def get_validator_chain():
    """
    Builds and returns the LangChain Expression Language (LCEL) chain
    for the input validator.
    """
    structured_llm = llm.with_structured_output(ProjectIdeaValidator)

    # The final chain that pipes the prompt to the structured LLM.
    validator_chain = ValidatorPrompt | structured_llm

    return validator_chain

def get_router_chain():
    """
    Builds and returns the LangChain Expression Language (LCEL) chain 
    for the question router.
    """
    structured_llm = llm.with_structured_output(QuestionRouter)

    # The final chain that pipes the prompt to the structured LLM.
    router_chain = RouterPrompt | structured_llm
    
    return router_chain

def get_tdd_chain():
    """
    Builds and returns the LangChain Expression Language (LCEL) chain 
    for the TDD generator.
    """
    structured_llm = llm.with_structured_output(TDD)

    tdd_chain = TDDGeneratorPrompt | structured_llm
    
    return tdd_chain
