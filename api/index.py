from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.generate_questions import router as questions_router
from api.generate_tdd import router as tdd_router
from api.validate_idea import router as validation_router

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions_router, prefix="/api")
app.include_router(tdd_router, prefix="/api")
app.include_router(validation_router, prefix="/api")

@app.get("/api")
async def health():
    return {"status": "ok"}