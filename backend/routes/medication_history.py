# backend/routes/medication_history.py

from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

medication_history_bp = Blueprint('medication_history_bp', __name__)

@medication_history_bp.route('/', methods=['GET'])
def get_medication_histories():
    result = db.session.execute(text("SELECT * FROM humatrace.medication_history"))
    histories = [dict(row) for row in result]
    return jsonify(histories)

@medication_history_bp.route('/<string:id>', methods=['GET'])
def get_medication_history(id):
    result = db.session.execute(
        text("SELECT * FROM humatrace.medication_history WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not result:
        return jsonify({"error": "Medication history not found"}), 404
    return jsonify(dict(result))

@medication_history_bp.route('/', methods=['POST'])
def create_medication_history():
    data = request.json
    new_id = str(uuid.uuid4())

    sql = text("""
        INSERT INTO humatrace.medication_history
        (id, patient_id, medication_id, dosage, start_date, end_date, notes)
        VALUES (:id, :patient_id, :medication_id, :dosage, :start_date, :end_date, :notes)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': data.get('patient_id'),
        'medication_id': data.get('medication_id'),
        'dosage': data.get('dosage'),
        'start_date': data.get('start_date'),
        'end_date': data.get('end_date'),
        'notes': data.get('notes')
    })
    db.session.commit()
    return jsonify({"message": "Medication history created", "id": new_id}), 201

@medication_history_bp.route('/<string:id>', methods=['PUT'])
def update_medication_history(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.medication_history WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Medication history not found"}), 404

    sql = text("""
        UPDATE humatrace.medication_history SET
            patient_id = :patient_id,
            medication_id = :medication_id,
            dosage = :dosage,
            start_date = :start_date,
            end_date = :end_date,
            notes = :notes
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'medication_id': data.get('medication_id'),
        'dosage': data.get('dosage'),
        'start_date': data.get('start_date'),
        'end_date': data.get('end_date'),
        'notes': data.get('notes')
    })
    db.session.commit()
    return jsonify({"message": "Medication history updated"})

@medication_history_bp.route('/<string:id>', methods=['DELETE'])
def delete_medication_history(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.medication_history WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Medication history not found"}), 404
    db.session.execute(
        text("DELETE FROM humatrace.medication_history WHERE id = :id"),
        {'id': id}
    )
    db.session.commit()
    return jsonify({"message": "Medication history deleted"})
