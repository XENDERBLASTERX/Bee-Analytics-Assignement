Data Upload and Query API A backend system to upload CSV data, validate and store it in a database, query the data, log all API activity, and protect sensitive endpoints with authentication.

Features Upload CSV File: Accept and validate CSV uploads.

Data Validation: Checks for missing values and correct types.

Database Storage: Stores records in SQLite.

REST API: Endpoints to query stored data.

Logging: Logs all API activity to a file.

Authentication: Basic username/password protection for sensitive endpoints.

Interactive Documentation: Swagger UI at /docs.

Setup Instructions

Clone the Repository bash git clone cd data-upload-api
Create and Activate a Virtual Environment Windows:
bash python -m venv venv source venv/Scripts/activate Linux/Mac:

bash python3 -m venv venv source venv/bin/activate 3. Install Dependencies bash pip install -r requirements.txt 4. Start the FastAPI Server bash uvicorn app.main:app --reload The API will be available at: http://127.0.0.1:8000

API docs (Swagger UI): http://127.0.0.1:8000/docs

API Endpoints Method Endpoint Description Auth Required POST /upload-csv Upload a CSV file Yes GET /data Get all records No GET /data/{id} Get a single record by ID No Note:

/upload-csv is protected with HTTP Basic Auth (admin/secret by default).

Authentication Username: admin

Password: secret

Change these in app/main.py for production use.

Sample CSV text name,age,email Alice,30,alice@example.com Bob,25,bob@example.com Logging All API calls are logged in logs/api.log.

Testing To run the included test script (make sure the server is running):

bash python tests/test_api.py Screenshots (Add screenshots of /docs and sample API requests here if submitting to an instructor or as a portfolio piece.)

Additional Features Swagger/OpenAPI: Interactive docs at /docs.

Basic Authentication: For sensitive endpoints.

Notes
