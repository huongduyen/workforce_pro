export function Illustration() {
  return (
    <div className="illustration-container">
      <div className="background-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
      </div>

      <div className="illustration-content">
        <h2 className="illustration-title">Workforce Pro</h2>
        <p className="illustration-subtitle">
          Streamline your workforce management with our comprehensive platform
        </p>

        <ul className="feature-list">
          <li className="feature-item">Employee Management</li>
          <li className="feature-item">Time & Attendance Tracking</li>
          <li className="feature-item">Leave Management</li>
          <li className="feature-item">Performance Analytics</li>
          <li className="feature-item">Real-time Reporting</li>
        </ul>

        <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
          Join thousands of companies that trust Workforce Pro for their HR
          needs
        </p>
      </div>
    </div>
  );
}
