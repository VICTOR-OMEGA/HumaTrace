HumaTrace Backend

HumaTrace is a healthcare backend system designed to manage patient records, appointments, diagnoses, treatments, and more, using a PostgreSQL database and Flask RESTful API. It offers a modular architecture with blueprints handling various healthcare-related data entities, enabling scalable and maintainable development.

This backend provides endpoints for CRUD operations on core healthcare data such as patients, appointments, diagnoses, medications, and tests. It is built to support a React (or any JS framework) frontend that interacts via REST API calls.

FEATURES
RESTful API with Flask and SQLAlchemy

Modular route blueprints for patient, appointment, diagnosis, medication, and more

PostgreSQL database with schema organized under humatrace schema

UUID primary keys for patient and other records

Full CRUD support for patient data and other entities

CORS enabled for frontend-backend communication across different origins

Database connection pooling and transaction handling via SQLAlchemy

Basic input validation and error handling

Prerequisites
Python 3.9 or higher

PostgreSQL 15 (or compatible version)

Node.js and npm (for frontend, optional)

Setup and Installation
1. Clone the repository
git clone <your-repo-url>
cd humatrace-backend
2. Create and activate Python virtual environment
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
3. Install Python dependencies
pip install -r requirements.txt
4. Configure PostgreSQL database
Create database and user (adjust names/passwords as needed):
CREATE DATABASE humatrace_db;
CREATE USER humatrace_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE humatrace_db TO humatrace_user;
Make sure the humatrace schema and all tables exist.

Ensure patients table and other tables match expected schema.

5. Set up environment variables (optional)
If you want, configure DB connection via environment variables (update app.py accordingly).

6. Run the Flask backend
flask run
or
python app.py

By default, the server runs on http://localhost:5000.

API Endpoints
Base URL: http://localhost:5000

Blueprint	URL Prefix	Common Endpoints	Description
patient_bp	/patient	GET /, POST /	Manage patient records
appointment_bp	/appointment	GET /, POST /	Manage appointments
diagnosis_bp	/diagnosis	GET /, POST /	Manage diagnoses
medication_bp	/medication	GET /, POST /	Manage medication info
.....

Usage Example
Create a new patient
POST to /patient/ with JSON body:
{
  "first_name": "Jane",
  "last_name": "Doe",
  "gender": "Female",
  "phone": "555-1234",
  "date_of_birth": "1990-05-15"
}
Expected response:
{
  "message": "Patient created",
  "id": "generated-uuid"
}

Debugging & Common Issues
New patient not showing in database?

Verify Flask server logs for errors during POST

Confirm date_of_birth format is YYYY-MM-DD

Check database connection URI in app.py

Confirm the POST request URL and payload are correct

Enable CORS if frontend runs on different origin

CORS errors on frontend?

Add flask-cors and initialize it in app.py

Database connection errors?

Verify PostgreSQL service is running

Check user credentials and permissions

Confirm network/firewall settings

Project Structure
/humatrace-backend
├── app.py                # Main Flask app initialization
├── extensions.py         # Database and extensions initialization (SQLAlchemy)
├── routes/               # Folder containing route blueprints for entities
│   ├── patient.py
│   ├── appointment.py
│   ├── diagnosis.py
│   └── ... 
├── requirements.txt      # Python dependencies
└── README.md             # This file

Dependencies
Flask

Flask-SQLAlchemy

Flask-CORS

psycopg2-binary

SQLAlchemy

Future Improvements
Add authentication and authorization

Input validation with Marshmallow or Pydantic

Pagination and filtering for large datasets

Automated tests for routes

Dockerize backend and database for easier deployment

OpenAPI documentation
