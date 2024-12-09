import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.routers import router as auth_router
from src.admin.routers import router as admin_router
from src.user.routers import router as user_router
app = FastAPI()
origins = [
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(user_router)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
