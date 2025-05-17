from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

test_result_bp = Blueprint('test_result_bp', __name__)

@test_result_bp.route('/', methods=['GET'])
def get_test_results():
    sql = text("SELECT * FROM humatrace.test_results")
    result = db.session.execute(sql)
    test_results = [dict(row) for row in result]
    return jsonify(test_results)

@test_result_bp.route('/<string:id>', methods=['GET'])
def get_test_result(id):
    sql = text("SELECT * FROM humatrace.test_results WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if result is None:
        return jsonify({"error": "Test result not found"}), 404
    return jsonify(dict(result))

@test_result_bp.route('/', methods=['POST'])
def create_test_result():
    data = request.json
    new_id = str(uuid.uuid4())
    test_id = data.get('test_id')
    patient_id = data.get('patient_id')
    result = data.get('result')
    taken_at = data.get('taken_at')  # ISO timestamp expected

    sql = text("""
        INSERT INTO humatrace.test_results (id, test_id, patient_id, result, taken_at)
        VALUES (:id, :test_id, :patient_id, :result, :taken_at)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'test_id': test_id,
        'patient_id': patient_id,
        'result': result,
        'taken_at': taken_at
    })
    db.session.commit()
    return jsonify({"message": "Test result created", "id": new_id}), 201

@test_result_bp.route('/<string:id>', methods=['PUT'])
def update_test_result(id):
    data = request.json
    exists = db.session.execute(text("SELECT 1 FROM humatrace.test_results WHERE id = :id"), {'id': id}).fetchone()
    if not exists:
        return jsonify({"error": "Test result not found"}), 404

    sql = text("""
        UPDATE humatrace.test_results SET
        test_id = :test_id,
        patient_id = :patient_id,
        result = :result,
        taken_at = :taken_at
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'test_id': data.get('test_id'),
        'patient_id': data.get('patient_id'),
        'result': data.get('result'),
        'taken_at': data.get('taken_at')
    })
    db.session.commit()
    return jsonify({"message": "Test result updated"})

@test_result_bp.route('/<string:id>', methods=['DELETE'])
def delete_test_result(id):
    exists = db.session.execute(text("SELECT 1 FROM humatrace.test_results WHERE id = :id"), {'id': id}).fetchone()
    if not exists:
        return jsonify({"error": "Test result not found"}), 404
    db.session.execute(text("DELETE FROM humatrace.test_results WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Test result deleted"})
