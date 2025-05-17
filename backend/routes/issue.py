# backend/routes/issue.py

from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
import uuid
from datetime import datetime

issue_bp = Blueprint('issue_bp', __name__)

@issue_bp.route('/', methods=['GET'])
def get_issues():
    result = db.session.execute(text("SELECT * FROM humatrace.issues"))
    issues = [dict(row) for row in result]
    return jsonify(issues)

@issue_bp.route('/<string:id>', methods=['GET'])
def get_issue(id):
    result = db.session.execute(
        text("SELECT * FROM humatrace.issues WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not result:
        return jsonify({"error": "Issue not found"}), 404
    return jsonify(dict(result))

@issue_bp.route('/', methods=['POST'])
def create_issue():
    data = request.json
    new_id = str(uuid.uuid4())
    severity = data.get('severity', 'Low')  # default to Low if missing
    created_at = datetime.utcnow()
    sql = text("""
        INSERT INTO humatrace.issues (id, name, severity, created_at)
        VALUES (:id, :name, :severity, :created_at)
    """)
    db.session.execute(sql, {
        'id': new_id,
        'name': data.get('name'),
        'severity': severity,
        'created_at': created_at
    })
    db.session.commit()
    return jsonify({"message": "Issue created", "id": new_id}), 201

@issue_bp.route('/<string:id>', methods=['PUT'])
def update_issue(id):
    data = request.json
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.issues WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Issue not found"}), 404

    sql = text("""
        UPDATE humatrace.issues SET
            name = :name,
            severity = :severity
        WHERE id = :id
    """)
    db.session.execute(sql, {
        'id': id,
        'name': data.get('name'),
        'severity': data.get('severity')
    })
    db.session.commit()
    return jsonify({"message": "Issue updated"})

@issue_bp.route('/<string:id>', methods=['DELETE'])
def delete_issue(id):
    exists = db.session.execute(
        text("SELECT 1 FROM humatrace.issues WHERE id = :id"),
        {'id': id}
    ).fetchone()
    if not exists:
        return jsonify({"error": "Issue not found"}), 404
    db.session.execute(
        text("DELETE FROM humatrace.issues WHERE id = :id"),
        {'id': id}
    )
    db.session.commit()
    return jsonify({"message": "Issue deleted"})
