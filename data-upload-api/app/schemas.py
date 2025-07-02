from pydantic import BaseModel, EmailStr, Field

class DataRecordBase(BaseModel):
    name: str = Field(..., example="Alice", description="Full name")
    age: int = Field(..., example=30, description="Age in years")
    email: EmailStr = Field(..., example="alice@example.com", description="Email address")

class DataRecordCreate(DataRecordBase):
    pass

class DataRecord(DataRecordBase):
    id: int

    class Config:
        from_attributes = True  # For Pydantic v2+
