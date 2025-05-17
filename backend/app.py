from flask import Flask
from extensions import db
from flask_cors import CORS

# Import all blueprints
from routes.appointment import appointment_bp
from routes.birth_record import birth_record_bp
from routes.diagnosis import diagnosis_bp
from routes.doctor import doctor_bp
from routes.issue import issue_bp
from routes.medication import medication_bp
from routes.medication_history import medication_history_bp
from routes.patient import patient_bp
from routes.patient_vitals import patient_vitals_bp
from routes.session import session_bp
from routes.test import test_bp
from routes.test_result import test_result_bp
from routes.treatment import treatment_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Configure database URI (PostgreSQL)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://humatrace_user:password123@localhost:5432/humatrace_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy with app
    db.init_app(app)

    # Register blueprints with URL prefixes
    app.register_blueprint(appointment_bp, url_prefix='/appointment')
    app.register_blueprint(birth_record_bp, url_prefix='/birth_record')
    app.register_blueprint(diagnosis_bp, url_prefix='/diagnosis')
    app.register_blueprint(doctor_bp, url_prefix='/doctor')
    app.register_blueprint(issue_bp, url_prefix='/issue')
    app.register_blueprint(medication_bp, url_prefix='/medication')
    app.register_blueprint(medication_history_bp, url_prefix='/medication_history')
    app.register_blueprint(patient_bp, url_prefix='/patient')
    app.register_blueprint(patient_vitals_bp, url_prefix='/patient_vitals')
    app.register_blueprint(session_bp, url_prefix='/session')
    app.register_blueprint(test_bp, url_prefix='/test')
    app.register_blueprint(test_result_bp, url_prefix='/test_result')
    app.register_blueprint(treatment_bp, url_prefix='/treatment')

    @app.route('/')
    def home():
        return 'Welcome to HumaTrace Backend!'
    
    def test_db():
    	try:
        	# Simple query to check DB connection
        	result = db.session.execute('SELECT 1').fetchone()
        	if result:
            		return 'Database connection successful!'
        	else:
            		return 'Database connection failed.'
    	except Exception as e:
        	return f'Error: {str(e)}'
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
