# backend/routes/medication.py

from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

medication_bp = Blueprint('medication_bp', __name__)

@medication_bp.route('/', methods=['GET'])
def get_medications():
    result = db.session.execute(text("SELECT * FROM humatrace.medications"))
    medications = [dict(row) for row in result]
    return jsonify(medications)

@medication_bp.route('/<string:id>', methods=['GET'])
def get_medication(id):
    result = db.session.execute(
        text("SELECT * FROM humatrace.medications WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not result:
        return jsonify({"error": "Medication not found"}), 404
    return jsonify(dict(result))

@medication_bp.route('/', methods=['POST'])
def create_medication():
    data = request.json
    new_id = str(uuid.uuid4())

    sql = text("""
        INSERT INTO humatrace.medications (id, name, type, description, side_effects)
        VALUES (:id, :name, :type, :description, :side_effects)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'name': data.get('name'),
        'type': data.get('type'),
        'description': data.get('description'),
        'side_effects': data.get('side_effects')
    })
    db.session.commit()
    return jsonify({"message": "Medication created", "id": new_id}), 201

@medication_bp.route('/<string:id>', methods=['PUT'])
def update_medication(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.medications WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Medication not found"}), 404

    sql = text("""
        UPDATE humatrace.medications SET
            name = :name,
            type = :type,
            description = :description,
            side_effects = :side_effects
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'name': data.get('name'),
        'type': data.get('type'),
        'description': data.get('description'),
        'side_effects': data.get('side_effects')
    })
    db.session.commit()
    return jsonify({"message": "Medication updated"})

@medication_bp.route('/<string:id>', methods=['DELETE'])
def delete_medication(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.medications WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Medication not found"}), 404
    db.session.execute(
        text("DELETE FROM humatrace.medications WHERE id = :id"),
        {'id': id}
    )
    db.session.commit()
    return jsonify({"message": "Medication deleted"})
