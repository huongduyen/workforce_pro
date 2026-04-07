export function EmployeePage({ onLogout }: { onLogout: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f8fafc",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem 2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#333", margin: 0 }}>Employee Dashboard</h1>
        <button
          onClick={onLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Logout
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#333", marginTop: 0 }}>Welcome!</h2>
          <p style={{ color: "#666" }}>
            You have successfully logged in to the Employee Portal.
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#333", marginTop: 0 }}>Quick Actions</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <button
              style={{
                background: "#667eea",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              View Profile
            </button>
            <button
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Check Attendance
            </button>
            <button
              style={{
                background: "#f59e0b",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Request Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
