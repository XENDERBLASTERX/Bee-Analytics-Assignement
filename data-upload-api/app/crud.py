from typing import Optional
from sqlalchemy.orm import Session
from . import models, schemas

def create_data_record(db: Session, record: schemas.DataRecordCreate):
    db_record = models.DataRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_data_records(
    db: Session,
    name: Optional[str] = None,
    age: Optional[int] = None,
    email: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(models.DataRecord)
    if name:
        query = query.filter(models.DataRecord.name == name)
    if age:
        query = query.filter(models.DataRecord.age == age)
    if email:
        query = query.filter(models.DataRecord.email == email)
    return query.offset(skip).limit(limit).all()

def get_data_record(db: Session, record_id: int):
    return db.query(models.DataRecord).filter(models.DataRecord.id == record_id).first()

def delete_data_record(db: Session, record_id: int):
    record = db.query(models.DataRecord).filter(models.DataRecord.id == record_id).first()
    if not record:
        return False
    db.delete(record)
    db.commit()
    return True
