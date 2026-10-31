import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

if __package__:
    from backend.data_input.process_payslip import PayslipProcessor
    from backend.db.db_connection import SupabaseConnection
    from backend.user.user_functions import router as user_router
else:
    from data_input.process_payslip import PayslipProcessor
    from db.db_connection import SupabaseConnection
    from user.user_functions import router as user_router

load_dotenv(Path(__file__).resolve().parent / ".env")
app = FastAPI()

db_conn = SupabaseConnection(
    os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY")
)
app.state.db_conn = db_conn
app.include_router(user_router)
payslip_processor = PayslipProcessor()

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,"
    "http://localhost:4173,http://127.0.0.1:4173",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip() for origin in frontend_origins.split(",") if origin.strip()
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    # response = supabase.table('todos').select("*").execute()
    # todos = response.data
    return "Hello World"


# Payslip Upload
@app.post("/payslip/upload")
def upload_file(file: UploadFile = File(...)):
    # Process payslip
    return payslip_processor.read(file.file)
