from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

birth_record_bp = Blueprint('birth_record_bp', __name__)

@birth_record_bp.route('/', methods=['GET'])
def get_birth_records():
    sql = text("SELECT * FROM humatrace.birth_records")
    result = db.session.execute(sql)
    birth_records = [dict(row) for row in result]
    return jsonify(birth_records)

@birth_record_bp.route('/<string:id>', methods=['GET'])
def get_birth_record(id):
    sql = text("SELECT * FROM humatrace.birth_records WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if not result:
        return jsonify({"error": "Birth record not found"}), 404
    return jsonify(dict(result))

@birth_record_bp.route('/', methods=['POST'])
def create_birth_record():
    data = request.json
    new_id = str(uuid.uuid4())
    sql = text("""
        INSERT INTO humatrace.birth_records (id, patient_id, date_of_birth, place_of_birth, delivery_method, birth_weight)
        VALUES (:id, :patient_id, :date_of_birth, :place_of_birth, :delivery_method, :birth_weight)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'patient_id': data.get('patient_id'),
        'date_of_birth': data.get('date_of_birth'),
        'place_of_birth': data.get('place_of_birth'),
        'delivery_method': data.get('delivery_method'),
        'birth_weight': data.get('birth_weight')
    })
    db.session.commit()
    return jsonify({"message": "Birth record created", "id": new_id}), 201

@birth_record_bp.route('/<string:id>', methods=['PUT'])
def update_birth_record(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.birth_records WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Birth record not found"}), 404

    sql = text("""
        UPDATE humatrace.birth_records SET
        patient_id = :patient_id,
        date_of_birth = :date_of_birth,
        place_of_birth = :place_of_birth,
        delivery_method = :delivery_method,
        birth_weight = :birth_weight
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'patient_id': data.get('patient_id'),
        'date_of_birth': data.get('date_of_birth'),
        'place_of_birth': data.get('place_of_birth'),
        'delivery_method': data.get('delivery_method'),
        'birth_weight': data.get('birth_weight')
    })
    db.session.commit()
    return jsonify({"message": "Birth record updated"})

@birth_record_bp.route('/<string:id>', methods=['DELETE'])
def delete_birth_record(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.birth_records WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Birth record not found"}), 404

    db.session.execute(text("DELETE FROM humatrace.birth_records WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Birth record deleted"})
