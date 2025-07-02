from sqlalchemy.orm import Session
from . import models, schemas

def create_data_record(db: Session, record: schemas.DataRecordCreate):
    db_record = models.DataRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_data_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DataRecord).offset(skip).limit(limit).all()

def get_data_record(db: Session, record_id: int):
    return db.query(models.DataRecord).filter(models.DataRecord.id == record_id).first()
