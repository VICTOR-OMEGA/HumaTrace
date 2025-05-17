from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

appointment_bp = Blueprint('appointment_bp', __name__)

@appointment_bp.route('/', methods=['GET'])
def get_appointments():
    sql = text("SELECT * FROM humatrace.appointments")
    result = db.session.execute(sql)
    appointments = [dict(row) for row in result]
    return jsonify(appointments)

@appointment_bp.route('/<string:id>', methods=['GET'])
def get_appointment(id):
    sql = text("SELECT * FROM humatrace.appointments WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if not result:
        return jsonify({"error": "Appointment not found"}), 404
    return jsonify(dict(result))

@appointment_bp.route('/', methods=['POST'])
def create_appointment():
    data = request.json
    new_id = str(uuid.uuid4())
    sql = text("""
        INSERT INTO humatrace.appointments (id, patient_id, doctor_id, scheduled_at, status)
        VALUES (:id, :patient_id, :doctor_id, :scheduled_at, :status)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': data.get('patient_id'),
        'doctor_id': data.get('doctor_id'),
        'scheduled_at': data.get('scheduled_at'),
        'status': data.get('status')  # Expected values: Scheduled, Completed, Cancelled
    })
    db.session.commit()
    return jsonify({"message": "Appointment created", "id": new_id}), 201

@appointment_bp.route('/<string:id>', methods=['PUT'])
def update_appointment(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.appointments WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Appointment not found"}), 404

    sql = text("""
        UPDATE humatrace.appointments SET
        patient_id = :patient_id,
        doctor_id = :doctor_id,
        scheduled_at = :scheduled_at,
        status = :status
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'doctor_id': data.get('doctor_id'),
        'scheduled_at': data.get('scheduled_at'),
        'status': data.get('status')
    })
    db.session.commit()
    return jsonify({"message": "Appointment updated"})

@appointment_bp.route('/<string:id>', methods=['DELETE'])
def delete_appointment(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.appointments WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Appointment not found"}), 404

    db.session.execute(text("DELETE FROM humatrace.appointments WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Appointment deleted"})
