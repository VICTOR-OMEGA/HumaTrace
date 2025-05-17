# backend/routes/patient.py

from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

patient_bp = Blueprint('patient_bp', __name__)

@patient_bp.route('/', methods=['GET'])
def get_patients():
    result = db.session.execute(text("SELECT * FROM humatrace.patients"))
    patients = [dict(row) for row in result]
    return jsonify(patients)

@patient_bp.route('/<string:id>', methods=['GET'])
def get_patient(id):
    result = db.session.execute(
        text("SELECT * FROM humatrace.patients WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if result is None:
        return jsonify({"error": "Patient not found"}), 404
    return jsonify(dict(result))

@patient_bp.route('/', methods=['POST'])
def create_patient():
    data = request.json
    new_id = str(uuid.uuid4())
    sql = text("""
        INSERT INTO humatrace.patients (id, first_name, last_name, gender, phone, date_of_birth)
        VALUES (:id, :first_name, :last_name, :gender, :phone, :date_of_birth)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'first_name': data.get('first_name'),
        'last_name': data.get('last_name'),
        'gender': data.get('gender'),
        'phone': data.get('phone'),
        'date_of_birth': data.get('date_of_birth')
    })
    db.session.commit()
    return jsonify({"message": "Patient created", "id": new_id}), 201

@patient_bp.route('/<string:id>', methods=['PUT'])
def update_patient(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.patients WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Patient not found"}), 404

    sql = text("""
        UPDATE humatrace.patients SET
            first_name = :first_name,
            last_name = :last_name,
            gender = :gender,
            phone = :phone,
            date_of_birth = :date_of_birth
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'first_name': data.get('first_name'),
        'last_name': data.get('last_name'),
        'gender': data.get('gender'),
        'phone': data.get('phone'),
        'date_of_birth': data.get('date_of_birth')
    })
    db.session.commit()
    return jsonify({"message": "Patient updated"})

@patient_bp.route('/<string:id>', methods=['DELETE'])
def delete_patient(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.patients WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Patient not found"}), 404
    db.session.execute(
        text("DELETE FROM humatrace.patients WHERE id = :id"),
        {'id': id}
    )
    db.session.commit()
    return jsonify({"message": "Patient deleted"})
