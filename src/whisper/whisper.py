import uvicorn
from fastapi import FastAPI
from src.whisper.routers import router as whisper_router

app = FastAPI()
app.include_router(whisper_router)

# uvicorn.run(app, host="localhost", port=8082)
#uvicorn whisper:app --reload --port=8081 --host=localhost