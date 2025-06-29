from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from api.src.chains import get_router_chain, get_tdd_chain
from typing import List, Dict

app = FastAPI()


origins = [
    "http://localhost:3000",
]

if os.environ.get("VERCEL_URL"):
    origins.append(f"https://{os.environ.get('VERCEL_URL')}")

app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

@app.get("/")
def hello_world():
    return {"message": "Hello Worldpythontest"}

@app.get("/api/pythontest")
def hello_world():
    return {"message": "Hello World123test"}