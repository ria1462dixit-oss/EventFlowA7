import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "../styles.css";
import AIFloatingButton from "./AIFloatingButton";

const allEvents = [
  { id: 1, title: "Campus Dance Festival", date: "Nov 15", category: "Cultural", venue: "Open Air Stage", desc: "An electrifying evening of dance performances from all departments." },
  { id: 2, title: "AI & Future Tech Talk", date: "Nov 18", category: "Academics", venue: "Seminar Hall B", desc: "Industry leaders discuss the future of artificial intelligence on campus." },
  { id: 3, title: "Inter-College Football", date: "Nov 20", category: "Sports", venue: "Sports Ground", desc: "Annual inter-college football championship. Come support your team!" },
  { id: 4, title: "Cultural Night 2026", date: "Nov 22", category: "Cultural", venue: "Main Stage", desc: "A celebration of art, music, and culture from across the campus." },
  { id: 5, title: "Hackathon 24hrs", date: "Nov 25", category: "Academics", venue: "CS Lab Block", desc: "Build something amazing in 24 hours. Open to all branches." },
  { id: 6, title: "Basketball Finals", date: "Nov 28", category: "Sports", venue: "Indoor Court", desc: "The final showdown of the semester basketball league." },
];

const categories = ["All", "Academics", "Sports", "Cultural"];

const categoryColors = {
  Cultural: "linear-gradient(135deg, #fce7f3, #e9d5ff)",
  Academics: "linear-gradient(135deg, #dbeafe, #e0f2fe)",
  Sports: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
};

function RegisterModal({ event, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", department: "", degree: "", semester: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.department.trim()) e.department = "Department is required";
    if (!form.degree.trim()) e.degree = "Degree is required";
    if (!form.semester) e.semester = "Semester is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const regData = {
      name: form.name,
      email: `${form.name.toLowerCase().replace(" ", ".")}@eventflow.com`,
      event: event.title,
      ticketId: `EF-${event.id}-${Date.now()}`,
    };
    setRegistrationData(regData);
    setSubmitted(true);
    setTimeout(() => { onSuccess(event.id, regData); onClose(); }, 4000);
  };

  return (
    <div className="modal-overlay">
      <div className="blob-pink" />
      <div className="blob-blue" />
      <div className="blob-yellow" />
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}>x</button>
        {submitted && registrationData ? (
          <div className="success-box">
            <h2 className="success-title">You're In!</h2>
            <p className="success-msg">
              Registered for <strong style={{ color: "#fff" }}>{event.title}</strong>
            </p>
            <div className="qr-box">
              <QRCodeSVG
                value={JSON.stringify({
                  ticketId: registrationData.ticketId,
                  name: registrationData.name,
                  email: registrationData.email,
                  event: registrationData.event,
                })}
                size={150}
                bgColor="transparent"
                fgColor="#ffffff"
                level="H"
              />
            </div>
            <p className="qr-hint">Show this QR to the volunteer at the event entrance</p>
            <p className="success-closing">Closing automatically...</p>
          </div>
        ) : (
          <>
            <span className="modal-event-tag">{event.category}</span>
            <h2 className="modal-title">{event.title}</h2>
            <p className="modal-subtitle">{event.venue} &nbsp;·&nbsp; {event.date}</p>
            <div className="modal-divider" />
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} className={`field-input ${errors.name ? "error" : ""}`} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="modal-row">
                <div className="field-group">
                  <label className="field-label">Department</label>
                  <input name="department" placeholder="e.g. Computer Science" value={form.department} onChange={handleChange} className={`field-input ${errors.department ? "error" : ""}`} />
                  {errors.department && <span className="field-error">{errors.department}</span>}
                </div>
                <div className="field-group">
                  <label className="field-label">Degree</label>
                  <input name="degree" placeholder="e.g. B.Tech, BCA" value={form.degree} onChange={handleChange} className={`field-input ${errors.degree ? "error" : ""}`} />
                  {errors.degree && <span className="field-error">{errors.degree}</span>}
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Semester</label>
                <select name="semester" value={form.semester} onChange={handleChange} className={`field-input ${errors.semester ? "error" : ""}`}>
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                {errors.semester && <span className="field-error">{errors.semester}</span>}
              </div>
              <button type="submit" className="modal-submit-btn">Confirm Registration</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function TicketQRModal({ ticket, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="blob-pink" />
      <div className="blob-blue" />
      <div className="blob-yellow" />
      <div className="modal-card" style={{ maxWidth: "380px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>x</button>
        <span className="modal-event-tag">{ticket.category}</span>
        <h2 className="modal-title">{ticket.title}</h2>
        <p className="modal-subtitle">{ticket.venue} &nbsp;·&nbsp; {ticket.date}</p>
        <div className="modal-divider" />
        <div className="qr-box" style={{ marginBottom: "16px" }}>
          <QRCodeSVG
            value={JSON.stringify({
              ticketId: ticket.ticketId || `EF-${ticket.id}`,
              name: ticket.attendeeName || "Attendee",
              email: ticket.attendeeEmail || "attendee@eventflow.com",
              event: ticket.title,
            })}
            size={180}
            bgColor="transparent"
            fgColor="#ffffff"
            level="H"
          />
        </div>
        <p className="qr-hint" style={{ marginBottom: "12px" }}>
          Show this QR code to the volunteer at the event entrance
        </p>
        <div className="ticket-id-box">
          <span className="ticket-id-label">TICKET ID</span>
          <span className="ticket-id-value">{ticket.ticketId || `EF-${ticket.id}`}</span>
        </div>
      </div>
    </div>
  );
}

export default function AttendeeDashboard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [registeredEvents, setRegisteredEvents] = useState([1]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [myTickets, setMyTickets] = useState([
    {
      id: 1,
      title: "Tech Symposium 2024",
      date: "Feb 28, 2026",
      venue: "Main Auditorium",
      status: "CONFIRMED",
      category: "Academics",
      ticketId: "EF-1-legacy",
      attendeeName: "Attendee",
      attendeeEmail: "attendee@eventflow.com",
    },
  ]);

  const filtered = activeCategory === "All" ? allEvents : allEvents.filter(e => e.category === activeCategory);

  const handleSuccess = (eventId, regData) => {
    const event = allEvents.find(e => e.id === eventId);
    setRegisteredEvents(prev => [...prev, eventId]);
    setMyTickets(prev => [...prev, {
      id: event.id,
      title: event.title,
      date: event.date,
      venue: event.venue,
      status: "CONFIRMED",
      category: event.category,
      ticketId: regData.ticketId,
      attendeeName: regData.name,
      attendeeEmail: regData.email,
    }]);
    setToast(`Registered for ${event.title}`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="page">
      <div className="sidebar">
        <div className="sidebar-logo">event<span>flow</span></div>
        <div className="sidebar-section">OVERVIEW</div>
        <div className="nav-item">Dashboard</div>
        <div className="sidebar-bottom">
          <div className="logout-btn" onClick={() => navigate("/login")}>Logout</div>
        </div>
      </div>

      <div className="main">
        <div className="top-bar">
          <div>
            <h1 className="page-title">Attendee Dashboard</h1>
            <p className="page-subtitle">Welcome back, here's what's happening today</p>
          </div>
          <div className="avatar">RD</div>
        </div>

        <section className="section">
          <h2 className="section-title">My Tickets</h2>
          <div className="tickets-row">
            {myTickets.map(ticket => (
              <div key={ticket.id} className="ticket-card" style={{ cursor: "pointer" }} onClick={() => setSelectedTicket(ticket)}>
                <div className="ticket-header">
                  <span className="confirmed-badge">{ticket.status}</span>
                  <span className="ticket-category">{ticket.category}</span>
                </div>
                <h3 className="ticket-title">{ticket.title}</h3>
                <div className="ticket-meta">
                  <div className="meta-item">
                    <span className="meta-label">Date</span>
                    <span className="meta-value">{ticket.date}</span>
                  </div>
                  <div className="meta-divider" />
                  <div className="meta-item">
                    <span className="meta-label">Venue</span>
                    <span className="meta-value">{ticket.venue}</span>
                  </div>
                </div>
                <div className="ticket-divider" />
                <div className="ticket-qr-row">
                  <QRCodeSVG
                    value={JSON.stringify({ ticketId: ticket.ticketId, event: ticket.title })}
                    size={52}
                    bgColor="transparent"
                    fgColor="#7c3aed"
                    level="H"
                  />
                  <p className="ticket-qr-text">Tap to view full QR</p>
                </div>
              </div>
            ))}
            <div className="empty-ticket">
              <p>Register for an event to get your ticket</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="explore-header">
            <h2 className="section-title">Explore Events</h2>
            <div className="filter-row">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`filter-btn ${activeCategory === cat ? "active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="events-grid">
            {filtered.map(event => {
              const isRegistered = registeredEvents.includes(event.id);
              return (
                <div key={event.id} className="event-card">
                  <div className="event-img-box" style={{ background: categoryColors[event.category] }}>
                    <span className="date-badge">{event.date}</span>
                  </div>
                  <div className="event-body">
                    <span className="event-category">{event.category}</span>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-desc">{event.desc}</p>
                    <div className="event-venue">{event.venue}</div>
                    <button
                      className={`register-btn ${isRegistered ? "registered" : ""}`}
                      onClick={() => !isRegistered && setSelectedEvent(event)}
                      disabled={isRegistered}
                    >
                      {isRegistered ? "Registered ✓" : "Register Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {selectedEvent && (
        <RegisterModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onSuccess={handleSuccess} />
      )}

      {selectedTicket && (
        <TicketQRModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}

      {toast && <div className="toast">{toast}</div>}

      <AIFloatingButton />
    </div>
  );
}
