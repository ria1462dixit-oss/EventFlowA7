import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";


const features = [
  { bg: "#eef0ff", title: "Live Monitoring", desc: "Track attendance in real-time. See who's in and who's yet to arrive with dynamic live dashboards." },
  { bg: "#f3eeff", title: "Volunteer Force", desc: "Assign roles, tasks, and scanner permissions to volunteers instantly via a simple interface." },
  { bg: "#fffbeb", title: "Rich Analytics", desc: "Gather post-event feedback and detailed participation analytics to measure event success." },
  { bg: "#ecfdf5", title: "QR Attendance", desc: "Instant check-in via unique QR codes. Real-time attendance tracking at your fingertips." },
  { bg: "#fff1f2", title: "Smart Ticketing", desc: "Create, distribute, and validate event tickets seamlessly with built-in validation system." },
  { bg: "#eff6ff", title: "Admin Control", desc: "Full-featured admin panel with role-based access and complete event oversight capabilities." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-page">

      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <span className="logo">event<span className="logo-accent">flow</span></span>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#" className="nav-link">Events</a>
          <a href="#" className="nav-link">About</a>
          <button className="nav-cta" onClick={() => navigate("/login")}>Get Started</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="badge">
            <span className="badge-dot"></span>
            NEW: DIGITAL ATTENDANCE V2.0
          </div>
          <h1 className="hero-title">
            Events That<br />Move
            <span className="hero-title-accent">The Campus.</span>
          </h1>
          <p className="hero-desc">
            Experience the next generation of college event management.
            Track, organize, and engage digitally with EventFlow's seamless QR-powered ecosystem.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Get Started Now
            </button>
            <button className="btn-secondary">View Showcase</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="image-card-wrap">
            <div className="image-card">
              <img src="/assets/hero-campus.jpg" alt="Campus event" />
            </div>
            <div className="verified-badge">
              <div className="verified-icon">V</div>
              <div>
                <div className="verified-title">Verified</div>
                <div className="verified-sub">1,240+ Attendees Checked-in Successfully today.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-inner">
          <h2 className="section-title">Powerful Features for Every Stakeholder</h2>
          <p className="section-sub">The ultimate toolkit to run flawless events from start to finish.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-box" style={{ backgroundColor: f.bg }}></div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        2026 <span>EventFlow</span>. Built for campus communities.
      </footer>

    </div>
  );
}
