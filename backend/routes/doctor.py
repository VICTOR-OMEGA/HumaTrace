from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/', methods=['GET'])
def get_doctors():
    sql = text("SELECT * FROM humatrace.doctors")
    result = db.session.execute(sql)
    doctors = [dict(row) for row in result]
    return jsonify(doctors)

@doctor_bp.route('/<string:id>', methods=['GET'])
def get_doctor(id):
    sql = text("SELECT * FROM humatrace.doctors WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if not result:
        return jsonify({"error": "Doctor not found"}), 404
    return jsonify(dict(result))

@doctor_bp.route('/', methods=['POST'])
def create_doctor():
    data = request.json
    new_id = str(uuid.uuid4())
    sql = text("""
        INSERT INTO humatrace.doctors (id, first_name, last_name, specialty, phone, email)
        VALUES (:id, :first_name, :last_name, :specialty, :phone, :email)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'first_name': data.get('first_name'),
        'last_name': data.get('last_name'),
        'specialty': data.get('specialty'),
        'phone': data.get('phone'),
        'email': data.get('email')
    })
    db.session.commit()
    return jsonify({"message": "Doctor created", "id": new_id}), 201

@doctor_bp.route('/<string:id>', methods=['PUT'])
def update_doctor(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.doctors WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Doctor not found"}), 404

    sql = text("""
        UPDATE humatrace.doctors SET
        first_name = :first_name,
        last_name = :last_name,
        specialty = :specialty,
        phone = :phone,
        email = :email
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'first_name': data.get('first_name'),
        'last_name': data.get('last_name'),
        'specialty': data.get('specialty'),
        'phone': data.get('phone'),
        'email': data.get('email')
    })
    db.session.commit()
    return jsonify({"message": "Doctor updated"})

@doctor_bp.route('/<string:id>', methods=['DELETE'])
def delete_doctor(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.doctors WHERE id = :id"), {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Doctor not found"}), 404

    db.session.execute(text("DELETE FROM humatrace.doctors WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Doctor deleted"})
