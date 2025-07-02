import pandas as pd
from typing import List
from fastapi import UploadFile, HTTPException

REQUIRED_COLUMNS = ["name", "age", "email"]

def validate_csv(file: UploadFile) -> List[dict]:
    try:
        df = pd.read_csv(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file.")

    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")

    if df.isnull().any().any():
        raise HTTPException(status_code=400, detail="CSV contains missing values.")

    # Type checking
    if not pd.api.types.is_integer_dtype(df["age"]):
        raise HTTPException(status_code=400, detail="Column 'age' must be integer.")

    return df.to_dict(orient="records")
