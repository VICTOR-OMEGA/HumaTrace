from flask import Blueprint, request, jsonify, current_app
from extensions import db
from sqlalchemy import text
import uuid

session_bp = Blueprint('session_bp', __name__)

@session_bp.route('/', methods=['GET'])
def get_sessions():
    sql = text("SELECT * FROM humatrace.sessions")
    result = db.session.execute(sql)
    sessions = [dict(row) for row in result]
    return jsonify(sessions)

@session_bp.route('/<string:id>', methods=['GET'])
def get_session(id):
    sql = text("SELECT * FROM humatrace.sessions WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if result is None:
        return jsonify({"error": "Session not found"}), 404
    return jsonify(dict(result))

@session_bp.route('/', methods=['POST'])
def create_session():
    data = request.json
    new_id = str(uuid.uuid4())
    patient_id = data.get('patient_id')
    doctor_id = data.get('doctor_id')
    started_at = data.get('started_at')
    ended_at = data.get('ended_at')
    notes = data.get('notes')

    sql = text("""
        INSERT INTO humatrace.sessions (id, patient_id, doctor_id, started_at, ended_at, notes)
        VALUES (:id, :patient_id, :doctor_id, :started_at, :ended_at, :notes)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': patient_id,
        'doctor_id': doctor_id,
        'started_at': started_at,
        'ended_at': ended_at,
        'notes': notes
    })
    db.session.commit()
    return jsonify({"message": "Session created", "id": new_id}), 201

@session_bp.route('/<string:id>', methods=['PUT'])
def update_session(id):
    data = request.json
    exists = db.session.execute(text("SELECT 1 FROM humatrace.sessions WHERE id = :id"), {'id': id}).fetchone()
    if not exists:
        return jsonify({"error": "Session not found"}), 404

    sql = text("""
        UPDATE humatrace.sessions SET
        patient_id = :patient_id,
        doctor_id = :doctor_id,
        started_at = :started_at,
        ended_at = :ended_at,
        notes = :notes
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'doctor_id': data.get('doctor_id'),
        'started_at': data.get('started_at'),
        'ended_at': data.get('ended_at'),
        'notes': data.get('notes')
    })
    db.session.commit()
    return jsonify({"message": "Session updated"})

@session_bp.route('/<string:id>', methods=['DELETE'])
def delete_session(id):
    exists = db.session.execute(text("SELECT 1 FROM humatrace.sessions WHERE id = :id"), {'id': id}).fetchone()
    if not exists:
        return jsonify({"error": "Session not found"}), 404
    db.session.execute(text("DELETE FROM humatrace.sessions WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Session deleted"})
