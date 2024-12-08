import uvicorn
from fastapi import FastAPI
from routers import router as whisper_router

app = FastAPI()
app.include_router(whisper_router)

uvicorn.run(app, host="localhost", port=8081)
