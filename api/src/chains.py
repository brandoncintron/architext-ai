"""
@file This file defines the LangChain chains for the application.
"""
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser
from api.src.models import QuestionRouter
from api.src.prompts import RouterPrompt
import os

# Initialize Gemini
# The API key is loaded from the .env file in api/index.py
# and passed directly to the constructor.
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=os.environ.get("GOOGLE_API_KEY")
)

def get_router_chain():
    """
    Builds and returns the LangChain Expression Language (LCEL) chain 
    for the question router.
    """
    # Instruct the model to use the Pydantic schema for its output.
    # This is a powerful feature of newer Gemini models.
    structured_llm = llm.with_structured_output(QuestionRouter)

    # The final chain that pipes the prompt to the structured LLM.
    router_chain = RouterPrompt | structured_llm
    
    return router_chain
