# backend/routes/diagnosis.py

from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid
from datetime import datetime

diagnosis_bp = Blueprint('diagnosis_bp', __name__)

@diagnosis_bp.route('/', methods=['GET'])
def get_diagnoses():
    result = db.session.execute(text("SELECT * FROM humatrace.diagnoses"))
    diagnoses = [dict(row) for row in result]
    return jsonify(diagnoses)

@diagnosis_bp.route('/<string:id>', methods=['GET'])
def get_diagnosis(id):
    result = db.session.execute(
        text("SELECT * FROM humatrace.diagnoses WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not result:
        return jsonify({"error": "Diagnosis not found"}), 404
    return jsonify(dict(result))

@diagnosis_bp.route('/', methods=['POST'])
def create_diagnosis():
    data = request.json
    new_id = str(uuid.uuid4())
    diagnosed_at = datetime.utcnow()

    sql = text("""
        INSERT INTO humatrace.diagnoses (id, patient_id, issue_id, description, diagnosed_at)
        VALUES (:id, :patient_id, :issue_id, :description, :diagnosed_at)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': data.get('patient_id'),
        'issue_id': data.get('issue_id'),
        'description': data.get('description'),
        'diagnosed_at': diagnosed_at
    })
    db.session.commit()
    return jsonify({"message": "Diagnosis created", "id": new_id}), 201

@diagnosis_bp.route('/<string:id>', methods=['PUT'])
def update_diagnosis(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.diagnoses WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Diagnosis not found"}), 404

    sql = text("""
        UPDATE humatrace.diagnoses SET
            patient_id = :patient_id,
            issue_id = :issue_id,
            description = :description,
            diagnosed_at = :diagnosed_at
        WHERE id = :id
    """)
    diagnosed_at = data.get('diagnosed_at', datetime.utcnow())
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'issue_id': data.get('issue_id'),
        'description': data.get('description'),
        'diagnosed_at': diagnosed_at
    })
    db.session.commit()
    return jsonify({"message": "Diagnosis updated"})

@diagnosis_bp.route('/<string:id>', methods=['DELETE'])
def delete_diagnosis(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.diagnoses WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Diagnosis not found"}), 404
    db.session.execute(
        text("DELETE FROM humatrace.diagnoses WHERE id = :id"),
        {'id': id}
    )
    db.session.commit()
    return jsonify({"message": "Diagnosis deleted"})
