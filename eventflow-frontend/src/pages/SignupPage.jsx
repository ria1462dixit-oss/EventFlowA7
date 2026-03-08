import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ATTENDEE",
    college: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.college.trim()) newErrors.college = "College name is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("https://eventflowa7.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role.toLowerCase(),
          college: form.college,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);

    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-bg" />
      <div className="blob-top" />
      <div className="blob-bottom" />

      <div className="signup-logo-wrap">
        event<span className="logo-accent">flow</span>
      </div>

      <div className="card-wrap">
        <div className="signup-glass-card">

          {success ? (
            <div className="success-box">
              <h2 className="success-title">You're In!</h2>
              <p className="success-msg">
                Account created successfully. Redirecting to login...
              </p>
              <button className="login-now-btn" onClick={() => navigate("/login")}>
                Go to Login Now
              </button>
            </div>

          ) : (
            <>
              <h2 className="signup-form-title">Create Account</h2>
              <p className="signup-form-subtitle">Join EventFlow — it's free for campus communities</p>

              <form onSubmit={handleSubmit} className="form">

                <div className="form-row">
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="signup-label">Full Name</label>
                    <input
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`signup-input ${errors.fullName ? "error" : ""}`}
                    />
                    {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="signup-label">College / University</label>
                    <input
                      name="college"
                      type="text"
                      placeholder="MIT, IIT, etc."
                      value={form.college}
                      onChange={handleChange}
                      className={`signup-input ${errors.college ? "error" : ""}`}
                    />
                    {errors.college && <span className="field-error">{errors.college}</span>}
                  </div>
                </div>

                <div className="field-group">
                  <label className="signup-label">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="campus-id@university.edu"
                    value={form.email}
                    onChange={handleChange}
                    className={`signup-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-row">
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="signup-label">Password</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      className={`signup-input ${errors.password ? "error" : ""}`}
                    />
                    {errors.password && <span className="field-error">{errors.password}</span>}
                  </div>
                  <div className="field-group" style={{ flex: 1 }}>
                    <label className="signup-label">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`signup-input ${errors.confirmPassword ? "error" : ""}`}
                    />
                    {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="field-group">
                  <label className="signup-label">I am joining as</label>
                  <div className="signup-role-row">
                    {["ATTENDEE", "VOLUNTEER"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm({ ...form, role: r })}
                        className={`signup-role-btn ${form.role === r ? "active" : ""}`}
                      >
                        {r === "ATTENDEE" ? "Attendee" : "Volunteer"}
                      </button>
                    ))}
                  </div>
                </div>

                {errors.general && (
                  <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center" }}>
                    {errors.general}
                  </p>
                )}

                <button type="submit" className="submit-btn">
                  Create My Account
                </button>

                <p className="login-text">
                  Already have an account?{" "}
                  <span className="login-link" onClick={() => navigate("/login")}>
                    Sign in
                  </span>
                </p>

              </form>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
