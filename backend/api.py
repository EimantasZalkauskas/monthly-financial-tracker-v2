import os

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.data_input.process_payslip import PayslipProcessor
from backend.db.db_connection import SupabaseConnection

load_dotenv()
app = FastAPI()

db_conn = SupabaseConnection(
    os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY")
)
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
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    # response = supabase.table('todos').select("*").execute()
    # todos = response.data
    return "Hello World"


# Payslip Upload
@app.post("/payslip/upload")
def upload_file(file: UploadFile):
    # Process payslip
    return payslip_processor.read(file)
