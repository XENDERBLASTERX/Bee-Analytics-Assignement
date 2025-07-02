from fastapi import FastAPI, UploadFile, File, Depends, Request, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import secrets
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, utils, logger

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Data Upload and Query API",
    description="Upload CSV data, query records, and manage your data securely.",
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBasic()
USERNAME = "admin"
PASSWORD = "secret"

def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, USERNAME)
    correct_password = secrets.compare_digest(credentials.password, PASSWORD)
    if not (correct_username and correct_password):
        raise JSONResponse(
            status_code=401,
            content={"detail": "Incorrect username or password"},
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    logger.log_api_call(request, response.status_code)
    return response

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/upload-csv", status_code=201)
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    username: str = Depends(authenticate)
):
    records = utils.validate_csv(file)
    created = []
    for record in records:
        data = schemas.DataRecordCreate(**record)
        db_record = crud.create_data_record(db, data)
        created.append(db_record)
    return {"inserted": len(created)}

@app.get("/data", response_model=list[schemas.DataRecord])
def get_data(
    name: Optional[str] = None,
    age: Optional[int] = None,
    email: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.get_data_records(db, name=name, age=age, email=email, skip=skip, limit=limit)

@app.get("/data/{record_id}", response_model=schemas.DataRecord)
def get_data_by_id(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_data_record(db, record_id)
    if not record:
        return JSONResponse(status_code=404, content={"detail": "Record not found"})
    return record

@app.delete("/data/{record_id}", status_code=204)
def delete_data_record(
    record_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(authenticate)
):
    success = crud.delete_data_record(db, record_id)
    if not success:
        return JSONResponse(status_code=404, content={"detail": "Record not found"})
    return

@app.get("/columns")
def get_columns():
    return ["id", "name", "age", "email"]
