from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

deployments = []


@app.route("/")
def home():
    return jsonify({
        "message": "Deployment Insights Flask API is running!"
    })


@app.route("/api/deployments", methods=["GET"])
def get_deployments():
    return jsonify(deployments)


@app.route("/api/stats", methods=["GET"])
def get_stats():
    total = len(deployments)

    successful = sum(
        1 for deployment in deployments
        if deployment["status"] == "Success"
    )

    failed = sum(
        1 for deployment in deployments
        if deployment["status"] == "Failed"
    )

    projects = set(
        deployment["project"]
        for deployment in deployments
    )

    success_rate = round((successful / total) * 100) if total else 0

    return jsonify({
        "totalProjects": len(projects),
        "totalDeployments": total,
        "successfulDeployments": successful,
        "failedDeployments": failed,
        "successRate": f"{success_rate}%"
    })


@app.route("/api/deployments", methods=["POST"])
def add_deployment():
    data = request.get_json()

    if not data or not data.get("project") or not data.get("status"):
        return jsonify({
            "message": "Project and status are required"
        }), 400

    deployment = {
        "id": len(deployments) + 1,
        "project": data["project"],
        "version": data.get("version", "unknown"),
        "environment": data.get("environment", "Development"),
        "status": data["status"],
        "duration": data.get("duration", "unknown"),
        "deployedBy": data.get("deployedBy", "unknown"),
        "commit": data.get("commit", "unknown"),
        "branch": data.get("branch", "main"),
        "timestamp": datetime.utcnow().isoformat()
    }

    deployments.append(deployment)

    print("New deployment received:", deployment)

    return jsonify({
        "message": "Deployment recorded successfully",
        "deployment": deployment
    }), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)