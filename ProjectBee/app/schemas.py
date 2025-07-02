from pydantic import BaseModel, EmailStr

class DataRecordBase(BaseModel):
    name: str
    age: int
    email: EmailStr

class DataRecordCreate(DataRecordBase):
    pass

class DataRecord(DataRecordBase):
    id: int

    class Config:
        from_attributes = True 
