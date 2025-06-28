from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

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
    # Placeholder for LangChain logic
    print(f"Received idea: {payload.idea}")
    print(f"Received platform: {payload.platform}")
    
    # Here is where we will:
    # 1. Initialize the ChatGoogleGenerativeAI model.
    # 2. Define an output parser (e.g., PydanticOutputParser).
    # 3. Create a PromptTemplate.
    # 4. Build and invoke the LangChain chain.
    # 5. Return the structured output.

    return {"status": "success", "plan": "This is a placeholder plan."}