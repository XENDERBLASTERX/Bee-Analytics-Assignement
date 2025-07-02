from fastapi import FastAPI, UploadFile, File, Depends, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, utils, logger

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Data Upload and Query API")

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
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    records = utils.validate_csv(file)
    created = []
    for record in records:
        data = schemas.DataRecordCreate(**record)
        db_record = crud.create_data_record(db, data)
        created.append(db_record)
    return {"inserted": len(created)}

@app.get("/data", response_model=list[schemas.DataRecord])
def get_data(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_data_records(db, skip=skip, limit=limit)

@app.get("/data/{record_id}", response_model=schemas.DataRecord)
def get_data_by_id(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_data_record(db, record_id)
    if not record:
        return JSONResponse(status_code=404, content={"detail": "Record not found"})
    return record
