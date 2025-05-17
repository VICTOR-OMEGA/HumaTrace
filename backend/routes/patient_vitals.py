# backend/routes/patient_vitals.py

from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

patient_vitals_bp = Blueprint('patient_vitals_bp', __name__)

@patient_vitals_bp.route('/', methods=['GET'])
def get_patient_vitals():
    result = db.session.execute(text("SELECT * FROM humatrace.patient_vitals"))
    vitals = [dict(row) for row in result]
    return jsonify(vitals)

@patient_vitals_bp.route('/<string:id>', methods=['GET'])
def get_patient_vital(id):
    result = db.session.execute(
        text("SELECT * FROM humatrace.patient_vitals WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not result:
        return jsonify({"error": "Patient vitals not found"}), 404
    return jsonify(dict(result))

@patient_vitals_bp.route('/', methods=['POST'])
def create_patient_vital():
    data = request.json
    new_id = str(uuid.uuid4())

    sql = text("""
        INSERT INTO humatrace.patient_vitals
        (id, patient_id, height_cm, weight_kg, blood_pressure, temperature_celsius, recorded_at)
        VALUES (:id, :patient_id, :height_cm, :weight_kg, :blood_pressure, :temperature_celsius, :recorded_at)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': data.get('patient_id'),
        'height_cm': data.get('height_cm'),
        'weight_kg': data.get('weight_kg'),
        'blood_pressure': data.get('blood_pressure'),
        'temperature_celsius': data.get('temperature_celsius'),
        'recorded_at': data.get('recorded_at')
    })
    db.session.commit()
    return jsonify({"message": "Patient vitals created", "id": new_id}), 201

@patient_vitals_bp.route('/<string:id>', methods=['PUT'])
def update_patient_vital(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.patient_vitals WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Patient vitals not found"}), 404

    sql = text("""
        UPDATE humatrace.patient_vitals SET
            patient_id = :patient_id,
            height_cm = :height_cm,
            weight_kg = :weight_kg,
            blood_pressure = :blood_pressure,
            temperature_celsius = :temperature_celsius,
            recorded_at = :recorded_at
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'height_cm': data.get('height_cm'),
        'weight_kg': data.get('weight_kg'),
        'blood_pressure': data.get('blood_pressure'),
        'temperature_celsius': data.get('temperature_celsius'),
        'recorded_at': data.get('recorded_at')
    })
    db.session.commit()
    return jsonify({"message": "Patient vitals updated"})

@patient_vitals_bp.route('/<string:id>', methods=['DELETE'])
def delete_patient_vital(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.patient_vitals WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Patient vitals not found"}), 404
    db.session.execute(
        text("DELETE FROM humatrace.patient_vitals WHERE id = :id"),
        {'id': id}
    )
    db.session.commit()
    return jsonify({"message": "Patient vitals deleted"})
