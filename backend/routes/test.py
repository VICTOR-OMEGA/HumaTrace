from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid

test_bp = Blueprint('test_bp', __name__)

@test_bp.route('/', methods=['GET'])
def get_tests():
    sql = text("SELECT * FROM humatrace.tests")
    result = db.session.execute(sql)
    tests = [dict(row) for row in result]
    return jsonify(tests)

@test_bp.route('/<string:id>', methods=['GET'])
def get_test(id):
    sql = text("SELECT * FROM humatrace.tests WHERE id = :id")
    result = db.session.execute(sql, {'id': id}).fetchone()
    if result is None:
        return jsonify({"error": "Test not found"}), 404
    return jsonify(dict(result))

@test_bp.route('/', methods=['POST'])
def create_test():
    data = request.json
    new_id = str(uuid.uuid4())
    name = data.get('name')
    test_type = data.get('type')
    description = data.get('description')

    sql = text("""
        INSERT INTO humatrace.tests (id, name, type, description)
        VALUES (:id, :name, :type, :description)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'name': name,
        'type': test_type,
        'description': description
    })
    db.session.commit()
    return jsonify({"message": "Test created", "id": new_id}), 201

@test_bp.route('/<string:id>', methods=['PUT'])
def update_test(id):
    data = request.json
    exists = db.session.execute(text("SELECT 1 FROM humatrace.tests WHERE id = :id"), {'id': id}).fetchone()
    if not exists:
        return jsonify({"error": "Test not found"}), 404

    sql = text("""
        UPDATE humatrace.tests SET
        name = :name,
        type = :type,
        description = :description
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'name': data.get('name'),
        'type': data.get('type'),
        'description': data.get('description')
    })
    db.session.commit()
    return jsonify({"message": "Test updated"})

@test_bp.route('/<string:id>', methods=['DELETE'])
def delete_test(id):
    exists = db.session.execute(text("SELECT 1 FROM humatrace.tests WHERE id = :id"), {'id': id}).fetchone()
    if not exists:
        return jsonify({"error": "Test not found"}), 404
    db.session.execute(text("DELETE FROM humatrace.tests WHERE id = :id"), {'id': id})
    db.session.commit()
    return jsonify({"message": "Test deleted"})
