from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Allow the frontend (running on a different port/origin) to call this API.
# Restrict allow_origins to your actual frontend URL before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("askmynotes_classifier.pkl")


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "AskMyNotes Classifier API Running"}


@app.post("/ask")
def ask(data: QuestionRequest):
    prediction = model.predict([data.question])[0]

    return {
        "question": data.question,
        "answer": prediction,
    }
