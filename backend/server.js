const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let deployments = [];

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Deployment Insights API is running!"
    });
});

// Get all deployments
app.get("/api/deployments", (req, res) => {
    res.json(deployments);
});

// Get deployment statistics
app.get("/api/stats", (req, res) => {

    const total = deployments.length;

    const successful = deployments.filter(
        deployment => deployment.status === "Success"
    ).length;

    const failed = deployments.filter(
        deployment => deployment.status === "Failed"
    ).length;

    const successRate =
        total === 0
            ? 0
            : Math.round((successful / total) * 100);

    const projects = [
        ...new Set(deployments.map(deployment => deployment.project))
    ];

    res.json({
        totalProjects: projects.length,
        totalDeployments: total,
        successfulDeployments: successful,
        failedDeployments: failed,
        successRate: `${successRate}%`
    });
});

// Receive deployment information from external projects
app.post("/api/deployments", (req, res) => {

    const {
        project,
        version,
        environment,
        status,
        duration,
        deployedBy,
        commit,
        branch
    } = req.body;

    if (!project || !status) {
        return res.status(400).json({
            message: "Project and status are required"
        });
    }

    const deployment = {
        id: deployments.length + 1,
        project,
        version: version || "unknown",
        environment: environment || "Development",
        status,
        duration: duration || "unknown",
        deployedBy: deployedBy || "unknown",
        commit: commit || "unknown",
        branch: branch || "main",
        timestamp: new Date().toISOString()
    };

    deployments.push(deployment);

    console.log("New deployment received:");
    console.log(deployment);

    res.status(201).json({
        message: "Deployment recorded successfully",
        deployment
    });
});

app.listen(PORT, () => {
    console.log(
        `Deployment Insights API running on http://localhost:${PORT}`
    );
});