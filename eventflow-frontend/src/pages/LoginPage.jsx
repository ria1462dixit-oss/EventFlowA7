import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-login.png";
import "../styles.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("ATTENDEE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://eventflowa7.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: role.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

if (data.user.role === "attendee") navigate("/dashboard");
else if (data.user.role === "volunteer") navigate("/volunteer-dashboard");
else if (data.user.role === "admin") navigate("/admin-dashboard");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">

      <div className="bg-gradient" />

      <div className="left-panel">
        <div className="panel-logo">
          event<span className="logo-accent">flow</span>
        </div>

        <div className="center-content">
          <img src={heroImage} alt="EventFlow" className="hero-img" />
          <div className="hero-text">
            <h2>
              Manage Events<br />
              <span className="hero-accent">Effortlessly.</span>
            </h2>
            <p>QR-powered attendance, real-time analytics, and seamless campus event management.</p>
          </div>
        </div>

        <div style={{ height: "40px" }} />
      </div>

      <div className="right-panel">
        <div className="glass-card">

          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Sign in to your EventFlow account</p>

          <form onSubmit={handleLogin} className="form">

            <div className="field-group">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                placeholder="campus-id@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Access Role</label>
              <div className="role-row">
                {["ATTENDEE", "VOLUNTEER", "ADMIN"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`role-btn ${role === r ? "active" : ""}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <span className="forgot-link">Forgot password?</span>

            {error && (
              <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center" }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-btn">Login</button>

            <p className="signup-text">
              Don't have an account?{" "}
              <span className="signup-link" onClick={() => navigate("/signup")}>
                Sign up
              </span>
            </p>

          </form>
        </div>
      </div>

    </div>
  );
}
