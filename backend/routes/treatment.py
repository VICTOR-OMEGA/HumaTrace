from flask import Blueprint, request, jsonify, current_app
from extensions import db
from sqlalchemy import text
import uuid

treatment_bp = Blueprint('treatment_bp', __name__)

@treatment_bp.route('/', methods=['GET'])
def get_treatments():
    sql = text("SELECT * FROM humatrace.treatments")
    result = db.session.execute(sql)
    treatments = [dict(row) for row in result]
    return jsonify(treatments)

@treatment_bp.route('/<string:id>', methods=['GET'])
def get_treatment(id):
    sql = text("SELECT * FROM humatrace.treatments WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if not result:
        return jsonify({"error": "Treatment not found"}), 404
    return jsonify(dict(result))

@treatment_bp.route('/', methods=['POST'])
def create_treatment():
    data = request.json
    new_id = str(uuid.uuid4())
    sql = text("""
        INSERT INTO humatrace.treatments (id, patient_id, diagnosis_id, treatment_plan, started_at, ended_at)
        VALUES (:id, :patient_id, :diagnosis_id, :treatment_plan, :started_at, :ended_at)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': data.get('patient_id'),
        'diagnosis_id': data.get('diagnosis_id'),
        'treatment_plan': data.get('treatment_plan'),
        'started_at': data.get('started_at'),
        'ended_at': data.get('ended_at')  # nullable
    })
    db.session.commit()
    return jsonify({"message": "Treatment created", "id": new_id}), 201

@treatment_bp.route('/<string:id>', methods=['PUT'])
def update_treatment(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.treatments WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Treatment not found"}), 404

    sql = text("""
        UPDATE humatrace.treatments SET
        patient_id = :patient_id,
        diagnosis_id = :diagnosis_id,
        treatment_plan = :treatment_plan,
        started_at = :started_at,
        ended_at = :ended_at
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'diagnosis_id': data.get('diagnosis_id'),
        'treatment_plan': data.get('treatment_plan'),
        'started_at': data.get('started_at'),
        'ended_at': data.get('ended_at')
    })
    db.session.commit()
    return jsonify({"message": "Treatment updated"})

@treatment_bp.route('/<string:id>', methods=['DELETE'])
def delete_treatment(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.treatments WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Treatment not found"}), 404

    db.session.execute(text("DELETE FROM humatrace.treatments WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Treatment deleted"})
