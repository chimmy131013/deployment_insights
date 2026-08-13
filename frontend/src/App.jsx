import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalDeployments: 0,
    successfulDeployments: 0,
    failedDeployments: 0,
    successRate: "0%",
  });

  const [deployments, setDeployments] = useState([]);

  // Automatically use the current host
  // Local:    http://localhost:5000
  // AWS EC2:  http://YOUR_EC2_IP:5000
  const API_URL = `http://${window.location.hostname}:5000`;

  const fetchData = () => {
    // Fetch deployment statistics
    fetch(`${API_URL}/api/stats`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        return response.json();
      })
      .then((data) => setStats(data))
      .catch((error) => console.error("Stats error:", error));

    // Fetch deployment history
    fetch(`${API_URL}/api/deployments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch deployments");
        }
        return response.json();
      })
      .then((data) => setDeployments(data))
      .catch((error) => console.error("Deployments error:", error));
  };

  useEffect(() => {
    fetchData();

    // Refresh dashboard every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="header">
        <div>
          <h1>Deployment Insights</h1>
          <p>Centralized DevOps Deployment Analytics</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <p>Total Projects</p>
            <h2>{stats.totalProjects}</h2>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🚀</span>
            <p>Total Deployments</p>
            <h2>{stats.totalDeployments}</h2>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <p>Successful</p>
            <h2>{stats.successfulDeployments}</h2>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✕</span>
            <p>Failed</p>
            <h2>{stats.failedDeployments}</h2>
          </div>

        </section>

        {/* Deployment Overview */}
        <section className="overview-card">

          <div className="section-title">
            <h2>Deployment Overview</h2>
            <p>Real-time deployment performance</p>
          </div>

          <div className="overview-content">

            <div className="big-number">
              <span>{stats.successRate}</span>
              <small>Overall Success Rate</small>
            </div>

            <div className="progress-section">

              <div className="progress-label">
                <span>Deployment Success</span>
                <strong>{stats.successRate}</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: stats.successRate,
                  }}
                ></div>
              </div>

            </div>

          </div>

        </section>

        {/* Recent Deployments */}
        <section className="deployments-card">

          <div className="section-title">
            <h2>Recent Deployments</h2>
            <p>Deployment activity from connected projects</p>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Project</th>
                  <th>Version</th>
                  <th>Environment</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Branch</th>
                  <th>Deployed By</th>
                </tr>
              </thead>

              <tbody>

                {deployments.length === 0 ? (

                  <tr>
                    <td colSpan="7" className="empty">
                      No deployments recorded yet
                    </td>
                  </tr>

                ) : (

                  deployments.map((deployment) => (

                    <tr key={deployment.id}>

                      <td>
                        <strong>{deployment.project}</strong>
                      </td>

                      <td>{deployment.version}</td>

                      <td>{deployment.environment}</td>

                      <td>
                        <span
                          className={
                            deployment.status === "Success"
                              ? "badge success"
                              : "badge failed"
                          }
                        >
                          {deployment.status}
                        </span>
                      </td>

                      <td>{deployment.duration}</td>

                      <td>{deployment.branch}</td>

                      <td>{deployment.deployedBy}</td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      <footer>
        Deployment Insights • Centralized DevOps Analytics Platform
      </footer>

    </div>
  );
}

export default App;