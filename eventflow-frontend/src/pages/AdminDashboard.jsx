import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const mockEvents = [
  { id: 1, title: "Global Tech Summit 2024", category: "Technology", venue: "Main Auditorium", date: "2024-10-15", status: "published", capacity: 500, registered: 420 },
  { id: 2, title: "University Art Expo", category: "Arts", venue: "Gallery Hall", date: "2024-11-02", status: "published", capacity: 200, registered: 85 },
  { id: 3, title: "Startup Pitch Night", category: "Business", venue: "Innovation Lab", date: "2024-09-28", status: "live", capacity: 150, registered: 145 },
  { id: 4, title: "Campus Dance Festival", category: "Cultural", venue: "Open Air Stage", date: "2024-11-15", status: "published", capacity: 300, registered: 210 },
  { id: 5, title: "Hackathon 24hrs", category: "Technology", venue: "CS Lab Block", date: "2024-12-01", status: "draft", capacity: 100, registered: 0 },
];

const statusColors = { published: "#10b981", live: "#7c3aed", draft: "#f59e0b" };
const catColors = { Technology: "#dbeafe", Arts: "#fce7f3", Business: "#dcfce7", Cultural: "#f3e8ff", Sports: "#fef9c3" };
const pieColors = ["#7c3aed", "#a78bfa", "#ec4899", "#f59e0b", "#10b981"];

function CreateEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: "", category: "", description: "", venue: "", date: "", time: "", capacity: "", deadline: "", qrEnabled: false });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.category) e.category = "Required";
    if (!form.venue.trim()) e.venue = "Required";
    if (!form.date) e.date = "Required";
    if (!form.capacity) e.capacity = "Required";
    return e;
  };

  const handleSubmit = (type) => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(type);
    setTimeout(() => { onSuccess(form, type); onClose(); }, 2000);
  };

  return (
    <div style={m.overlay}>
      <div style={m.blobPink} />
      <div style={m.blobBlue} />
      <div style={m.blobYellow} />
      <div style={m.card}>
        <button style={m.closeBtn} onClick={onClose}>x</button>
        {submitted ? (
          <div style={m.successBox}>
            <h2 style={m.successTitle}>{submitted === "publish" ? "Event Published!" : "Saved as Draft!"}</h2>
            <p style={m.successMsg}>{submitted === "publish" ? "Your event is now live and visible to attendees." : "Saved. You can publish it later."}</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>Closing automatically...</p>
          </div>
        ) : (
          <>
            <h2 style={m.modalTitle}>Create New Event</h2>
            <p style={m.modalSubtitle}>Fill in the details below</p>
            <div style={m.divider} />
            <div style={m.sectionLabel}>EVENT DETAILS</div>
            <div style={m.row}>
              <div style={m.fieldGroup}>
                <label style={m.label}>Event Title</label>
                <input name="title" placeholder="e.g. Tech Summit 2026" value={form.title} onChange={handleChange} style={{ ...m.input, ...(errors.title ? m.inputErr : {}) }} />
                {errors.title && <span style={m.error}>{errors.title}</span>}
              </div>
              <div style={m.fieldGroup}>
                <label style={m.label}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={{ ...m.input, ...(errors.category ? m.inputErr : {}) }}>
                  <option value="">Select category</option>
                  {["Technology", "Arts", "Business", "Cultural", "Sports", "Academics"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span style={m.error}>{errors.category}</span>}
              </div>
            </div>
            <div style={m.fieldGroup}>
              <label style={m.label}>Description</label>
              <textarea name="description" placeholder="Describe your event..." value={form.description} onChange={handleChange} rows={3} style={{ ...m.input, resize: "none" }} />
            </div>
            <div style={m.row}>
              <div style={m.fieldGroup}>
                <label style={m.label}>Venue</label>
                <input name="venue" placeholder="e.g. Main Auditorium" value={form.venue} onChange={handleChange} style={{ ...m.input, ...(errors.venue ? m.inputErr : {}) }} />
                {errors.venue && <span style={m.error}>{errors.venue}</span>}
              </div>
              <div style={m.fieldGroup}>
                <label style={m.label}>Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} style={{ ...m.input, ...(errors.date ? m.inputErr : {}) }} />
                {errors.date && <span style={m.error}>{errors.date}</span>}
              </div>
              <div style={m.fieldGroup}>
                <label style={m.label}>Time</label>
                <input name="time" type="time" value={form.time} onChange={handleChange} style={m.input} />
              </div>
            </div>
            <div style={m.sectionLabel}>REGISTRATION DETAILS</div>
            <div style={m.row}>
              <div style={m.fieldGroup}>
                <label style={m.label}>Capacity</label>
                <input name="capacity" type="number" placeholder="e.g. 200" value={form.capacity} onChange={handleChange} style={{ ...m.input, ...(errors.capacity ? m.inputErr : {}) }} />
                {errors.capacity && <span style={m.error}>{errors.capacity}</span>}
              </div>
              <div style={m.fieldGroup}>
                <label style={m.label}>Registration Deadline</label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange} style={m.input} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <label style={m.label}>QR Code Registration</label>
              <div onClick={() => setForm({ ...form, qrEnabled: !form.qrEnabled })}
                style={{ width: "44px", height: "24px", borderRadius: "999px", cursor: "pointer", backgroundColor: form.qrEnabled ? "#a78bfa" : "rgba(255,255,255,0.2)", position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: "3px", left: form.qrEnabled ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{form.qrEnabled ? "Enabled" : "Disabled"}</span>
            </div>
            <div style={m.btnRow}>
              <button style={m.draftBtn} onClick={() => handleSubmit("draft")}>Save as Draft</button>
              <button style={m.publishBtn} onClick={() => handleSubmit("publish")}>Publish Event</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EventsTable({ events, onDelete }) {
  return (
    <table style={s.table}>
      <thead>
        <tr>{["Event Name", "Category", "Date", "Venue", "Status", "Capacity", "Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr key={event.id} style={s.tr}>
            <td style={s.td}><div style={s.eventName}>{event.title}</div></td>
            <td style={s.td}><span style={{ ...s.catBadge, backgroundColor: catColors[event.category] || "#f3e8ff" }}>{event.category}</span></td>
            <td style={s.td}>{event.date}</td>
            <td style={s.td}>{event.venue}</td>
            <td style={s.td}><span style={{ ...s.statusBadge, backgroundColor: statusColors[event.status] + "22", color: statusColors[event.status] }}>{event.status}</span></td>
            <td style={s.td}>
              <div style={s.capWrap}>
                <div style={s.capBar}><div style={{ ...s.capFill, width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }} /></div>
                <span style={s.capText}>{event.registered}/{event.capacity}</span>
              </div>
            </td>
            <td style={s.td}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={s.actionBtn}>Edit</button>
                <button style={{ ...s.actionBtn, color: "#ef4444", borderColor: "#fecaca" }} onClick={() => onDelete && onDelete(event.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VolunteersTab({ events, showToast }) {
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/volunteer/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVolunteers(Array.isArray(data) ? data : []);
    } catch (_err) {
      showToast("Could not load volunteers");
    }
  };

  const handleApprove = async (volunteerId, volunteerName) => {
    const eventName = assignments[volunteerId];
    if (!eventName) { showToast("Please select an event first"); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/volunteer/approve/${volunteerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assignedEvent: eventName }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message); return; }
      showToast(`${volunteerName} approved and assigned!`);
      fetchVolunteers();
    } catch (_err) {
      showToast("Something went wrong");
    }
  };

  const pending = volunteers.filter(v => !v.approved);
  const approved = volunteers.filter(v => v.approved);

  return (
    <>
      <div style={s.statsRow}>
        {[
          { label: "Total Volunteers", value: volunteers.length },
          { label: "Approved", value: approved.length },
          { label: "Pending Approval", value: pending.length },
          { label: "Events Covered", value: new Set(approved.map(v => v.assignedEvent)).size },
        ].map((stat, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statValue}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Pending Approval</h2>
            <span style={{ ...s.badge, backgroundColor: "#fef3c7", color: "#d97706" }}>{pending.length} pending</span>
          </div>
          <table style={s.table}>
            <thead>
              <tr>{["Name", "Email", "College", "Assign Event", "Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {pending.map(v => (
                <tr key={v._id} style={s.tr}>
                  <td style={s.td}><div style={s.eventName}>{v.fullName}</div></td>
                  <td style={s.td}>{v.email}</td>
                  <td style={s.td}>{v.college}</td>
                  <td style={s.td}>
                    <select value={assignments[v._id] || ""} onChange={e => setAssignments({ ...assignments, [v._id]: e.target.value })} style={s.searchInput}>
                      <option value="">Select event</option>
                      {events.filter(e => e.status !== "draft").map(e => (
                        <option key={e.id} value={e.title}>{e.title}</option>
                      ))}
                    </select>
                  </td>
                  <td style={s.td}>
                    <button style={{ ...s.actionBtn, backgroundColor: "#7c3aed", color: "#fff", borderColor: "#7c3aed" }} onClick={() => handleApprove(v._id, v.fullName)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.cardTitle}>Approved Volunteers</h2>
          <span style={s.badge}>{approved.length} active</span>
        </div>
        {approved.length === 0 ? (
          <p style={{ textAlign: "center", color: "#bbb", padding: "30px" }}>No approved volunteers yet</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>{["Name", "Email", "College", "Assigned Event", "Status"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {approved.map(v => (
                <tr key={v._id} style={s.tr}>
                  <td style={s.td}><div style={s.eventName}>{v.fullName}</div></td>
                  <td style={s.td}>{v.email}</td>
                  <td style={s.td}>{v.college}</td>
                  <td style={s.td}>{v.assignedEvent}</td>
                  <td style={s.td}><span style={{ ...s.statusBadge, backgroundColor: "#10b98122", color: "#10b981" }}>active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState(mockEvents);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [adminForm, setAdminForm] = useState({ fullName: "", email: "", password: "", college: "" });
  const [adminMsg, setAdminMsg] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [volRes, attRes] = await Promise.all([
        fetch("http://localhost:5000/api/volunteer/pending", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/volunteer/attendance/all", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const volunteers = await volRes.json();
      const attendance = attRes.ok ? await attRes.json() : [];
      const eventMap = {};
      (Array.isArray(attendance) ? attendance : []).forEach(a => {
        eventMap[a.eventName] = (eventMap[a.eventName] || 0) + 1;
      });
      const dateMap = {};
      (Array.isArray(attendance) ? attendance : []).forEach(a => {
        const d = new Date(a.markedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        dateMap[d] = (dateMap[d] || 0) + 1;
      });
      const collegeMap = {};
      (Array.isArray(volunteers) ? volunteers : []).forEach(v => {
        collegeMap[v.college] = (collegeMap[v.college] || 0) + 1;
      });
      setAnalyticsData({
        totalAttendance: Array.isArray(attendance) ? attendance.length : 0,
        totalVolunteers: Array.isArray(volunteers) ? volunteers.length : 0,
        eventAttendance: Object.entries(eventMap).map(([name, value]) => ({ name: name?.split(" ").slice(0, 2).join(" ") || "Event", value })),
        trendData: Object.entries(dateMap).slice(-7).map(([date, count]) => ({ date, count })),
        collegeData: Object.entries(collegeMap).map(([name, value]) => ({ name, value })),
      });
    } catch (_err) { setAnalyticsData(null); }
    setAnalyticsLoading(false);
  };

  useEffect(() => { if (activeTab === "analytics") fetchAnalytics(); }, [activeTab]);

  const totalReg = events.reduce((a, e) => a + e.registered, 0);
  const chartData = events.map(e => ({ name: e.title.split(" ").slice(0, 2).join(" "), registrations: e.registered }));
  const pieData = Object.entries(
    events.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.registered; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const filteredEvents = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || e.status === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleEventCreate = (form, type) => {
    const newEvent = {
      id: events.length + 1,
      title: form.title, category: form.category, venue: form.venue, date: form.date,
      status: type === "publish" ? "published" : "draft",
      capacity: parseInt(form.capacity), registered: 0,
    };
    setEvents(prev => [newEvent, ...prev]);
    showToast(`"${form.title}" ${type === "publish" ? "published" : "saved as draft"}!`);
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast("Event deleted.");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/setup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...adminForm, setupKey: "admin_master_key" }),
      });
      const data = await res.json();
      setAdminMsg({ type: res.ok ? "success" : "error", text: data.message });
      if (res.ok) setAdminForm({ fullName: "", email: "", password: "", college: "" });
    } catch (_err) {
      setAdminMsg({ type: "error", text: "Something went wrong. Please try again." });
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "events", label: "All Events" },
    { key: "volunteers", label: "Volunteers" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={s.logo}>event<span style={s.logoAccent}>flow</span></div>
        <div style={s.sidebarSection}>OVERVIEW</div>
        {navItems.map(item => (
          <div key={item.key} onClick={() => setActiveTab(item.key)}
            style={{ ...s.navItem, ...(activeTab === item.key ? s.navActive : {}) }}>
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div onClick={() => setActiveTab("addadmin")} style={{ ...s.navItem, ...(activeTab === "addadmin" ? s.navActive : {}) }}>
            Add Admin
          </div>
          <div style={s.logoutBtn} onClick={() => navigate("/login")}>Logout</div>
        </div>
      </div>

      <div style={s.main}>

        {activeTab === "dashboard" && (
          <>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Admin Dashboard</h1>
                <p style={s.pageSubtitle}>Welcome back, here's what's happening today</p>
              </div>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <button style={s.createBtn} onClick={() => setShowModal(true)}>+ Create Event</button>
                <div style={s.avatar}>AD</div>
              </div>
            </div>

            <div style={s.statsRow}>
              {[
                { label: "Active Events", value: events.filter(e => e.status !== "draft").length },
                { label: "Total Registrations", value: totalReg.toLocaleString() },
                { label: "Active Volunteers", value: 4 },
                { label: "Avg. Event Rating", value: "4.8/5" },
              ].map((stat, i) => (
                <div key={i} style={s.statCard}>
                  <div style={s.statValue}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "28px" }}>
              <div style={s.card}>
                <h2 style={s.cardTitle}>Registrations by Event</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="registrations" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#7c3aed" : "#a78bfa"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={s.card}>
                <h2 style={s.cardTitle}>By Category</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}>
                      {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>Recent Events</h2>
                <span style={s.viewAll} onClick={() => setActiveTab("events")}>View all</span>
              </div>
              <EventsTable events={events.slice(0, 4)} onDelete={handleDelete} />
            </div>
          </>
        )}

        {activeTab === "events" && (
          <>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>All Events</h1>
                <p style={s.pageSubtitle}>Manage and track all your campus events</p>
              </div>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <button style={s.createBtn} onClick={() => setShowModal(true)}>+ Create Event</button>
                <div style={s.avatar}>AD</div>
              </div>
            </div>
            <div style={s.card}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="Search events or venue..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                <div style={{ display: "flex", gap: "8px" }}>
                  {["All", "Published", "Live", "Draft"].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ ...s.filterBtn, ...(filterStatus === f ? s.filterBtnActive : {}) }}>{f}</button>
                  ))}
                </div>
              </div>
              <EventsTable events={filteredEvents} onDelete={handleDelete} />
              {filteredEvents.length === 0 && <p style={{ textAlign: "center", color: "#bbb", padding: "30px" }}>No events found</p>}
            </div>
          </>
        )}

        {activeTab === "volunteers" && (
          <>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Volunteers</h1>
                <p style={s.pageSubtitle}>Approve and assign volunteers to events</p>
              </div>
              <div style={s.avatar}>AD</div>
            </div>
            <VolunteersTab events={events} showToast={showToast} />
          </>
        )}

        {activeTab === "analytics" && (
          <>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Analytics</h1>
                <p style={s.pageSubtitle}>Real-time data from your events and volunteers</p>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button onClick={fetchAnalytics} style={{ padding: "10px 20px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  ↻ Refresh
                </button>
                <div style={s.avatar}>AD</div>
              </div>
            </div>

            {analyticsLoading ? (
              <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
                <p style={{ fontSize: "16px" }}>Loading analytics...</p>
              </div>
            ) : analyticsData ? (
              <>
                <div style={s.statsRow}>
                  {[
                    { label: "Total Events", value: events.length },
                    { label: "Total Attendance Marked", value: analyticsData.totalAttendance },
                    { label: "Total Volunteers", value: analyticsData.totalVolunteers },
                    { label: "Events with Attendance", value: analyticsData.eventAttendance.length },
                  ].map((stat, i) => (
                    <div key={i} style={s.statCard}>
                      <div style={s.statValue}>{stat.value}</div>
                      <div style={s.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "28px" }}>
                  <div style={s.card}>
                    <h2 style={s.cardTitle}>Attendance per Event</h2>
                    {analyticsData.eventAttendance.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={analyticsData.eventAttendance} barSize={40}>
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                          <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {analyticsData.eventAttendance.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <p style={{ color: "#bbb", textAlign: "center", padding: "40px 0" }}>No attendance data yet</p>}
                  </div>

                  <div style={s.card}>
                    <h2 style={s.cardTitle}>Volunteers by College</h2>
                    {analyticsData.collegeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={analyticsData.collegeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={35}>
                            {analyticsData.collegeData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : <p style={{ color: "#bbb", textAlign: "center", padding: "40px 0" }}>No volunteer data yet</p>}
                  </div>
                </div>

                <div style={s.card}>
                  <h2 style={s.cardTitle}>Attendance Trend (Last 7 Days)</h2>
                  {analyticsData.trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analyticsData.trendData} barSize={32}>
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                        <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                        <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p style={{ color: "#bbb", textAlign: "center", padding: "40px 0" }}>No trend data yet</p>}
                </div>

                <div style={s.card}>
                  <h2 style={s.cardTitle}>Event Performance</h2>
                  <table style={s.table}>
                    <thead>
                      <tr>{["Event", "Registrations", "Capacity", "Fill Rate", "Status"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {events.map(e => (
                        <tr key={e.id} style={s.tr}>
                          <td style={s.td}><div style={s.eventName}>{e.title}</div></td>
                          <td style={s.td}>{e.registered}</td>
                          <td style={s.td}>{e.capacity}</td>
                          <td style={s.td}>
                            <div style={s.capWrap}>
                              <div style={s.capBar}><div style={{ ...s.capFill, width: `${Math.min((e.registered / e.capacity) * 100, 100)}%` }} /></div>
                              <span style={s.capText}>{Math.round((e.registered / e.capacity) * 100)}%</span>
                            </div>
                          </td>
                          <td style={s.td}><span style={{ ...s.statusBadge, backgroundColor: statusColors[e.status] + "22", color: statusColors[e.status] }}>{e.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>📊</p>
                <p style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>No analytics data yet</p>
                <p style={{ fontSize: "13px", marginTop: "8px" }}>Mark some attendance via the volunteer dashboard first</p>
                <button onClick={fetchAnalytics} style={{ marginTop: "20px", padding: "10px 24px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Try Again</button>
              </div>
            )}
          </>
        )}

        {activeTab === "addadmin" && (
          <>
            <div style={s.topBar}>
              <div>
                <h1 style={s.pageTitle}>Add Admin</h1>
                <p style={s.pageSubtitle}>Create a new admin account for EventFlow</p>
              </div>
              <div style={s.avatar}>AD</div>
            </div>
            <div style={{ maxWidth: "520px" }}>
              <div style={s.card}>
                <h2 style={{ ...s.cardTitle, marginBottom: "20px" }}>New Admin Details</h2>
                <form onSubmit={handleAddAdmin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { name: "fullName", label: "Full Name", placeholder: "Admin full name", type: "text" },
                    { name: "email", label: "Email Address", placeholder: "admin@eventflow.com", type: "email" },
                    { name: "password", label: "Password", placeholder: "Min. 6 characters", type: "password" },
                    { name: "college", label: "College / Institution", placeholder: "e.g. EventFlow HQ", type: "text" },
                  ].map(field => (
                    <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>{field.label}</label>
                      <input
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={adminForm[field.name]}
                        onChange={e => setAdminForm({ ...adminForm, [e.target.name]: e.target.value })}
                        style={s.formInput}
                      />
                    </div>
                  ))}
                  {adminMsg && (
                    <p style={{ fontSize: "13px", color: adminMsg.type === "success" ? "#10b981" : "#ef4444", textAlign: "center" }}>
                      {adminMsg.text}
                    </p>
                  )}
                  <button type="submit" style={s.createBtn}>Create Admin Account</button>
                </form>
              </div>
            </div>
          </>
        )}

      </div>

      {showModal && <CreateEventModal onClose={() => setShowModal(false)} onSuccess={handleEventCreate} />}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Floating AI Bot Button */}
      <a
        href="https://ai-chatbot-eventsystem.zapier.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: "32px", right: "32px",
          width: "56px", height: "56px", borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(124,58,237,0.45)",
          zIndex: 999, textDecoration: "none", fontSize: "24px",
          transition: "transform 0.2s",
        }}
        title="Chat with AI Assistant"
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        🤖
      </a>
    </div>
  );
}

const m = {
  overlay: { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflow: "hidden", background: "linear-gradient(135deg, rgba(236,72,153,0.88) 0%, rgba(124,58,237,0.88) 35%, rgba(59,130,246,0.88) 65%, rgba(234,179,8,0.75) 100%)", backdropFilter: "blur(6px)" },
  blobPink: { position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)", pointerEvents: "none" },
  blobBlue: { position: "absolute", bottom: "-80px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.45) 0%, transparent 70%)", pointerEvents: "none" },
  blobYellow: { position: "absolute", bottom: "50px", left: "100px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.3) 0%, transparent 70%)", pointerEvents: "none" },
  card: { position: "relative", backgroundColor: "rgba(15,10,40,0.75)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "28px", padding: "40px 36px", width: "100%", maxWidth: "680px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", zIndex: 1, margin: "20px", maxHeight: "90vh", overflowY: "auto" },
  closeBtn: { position: "absolute", top: "18px", right: "18px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "13px", fontWeight: "700" },
  modalTitle: { fontSize: "24px", fontWeight: "900", color: "#fff", margin: "0 0 6px", letterSpacing: "-0.5px" },
  modalSubtitle: { fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" },
  divider: { borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: "20px" },
  sectionLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "1px", color: "#c4b5fd", marginBottom: "14px", marginTop: "4px" },
  row: { display: "flex", gap: "14px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px", flex: 1, marginBottom: "14px" },
  label: { fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.75)" },
  input: { border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", color: "#fff", backgroundColor: "rgba(255,255,255,0.08)", outline: "none", fontFamily: "inherit", width: "100%" },
  inputErr: { borderColor: "#f87171" },
  error: { fontSize: "11px", color: "#fca5a5" },
  btnRow: { display: "flex", gap: "12px" },
  draftBtn: { flex: 1, padding: "13px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "12px", color: "#fff", backgroundColor: "rgba(255,255,255,0.08)", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  publishBtn: { flex: 1, padding: "13px", background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" },
  successBox: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px", padding: "30px 0" },
  successTitle: { fontSize: "28px", fontWeight: "900", color: "#fff", margin: 0 },
  successMsg: { fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", margin: 0 },
};

const s = {
  page: { display: "flex", minHeight: "100vh", backgroundColor: "#f5f3ff", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  sidebar: { width: "200px", backgroundColor: "#fff", borderRight: "1px solid #ede9fe", display: "flex", flexDirection: "column", padding: "28px 20px", flexShrink: 0, boxShadow: "2px 0 12px rgba(109,40,217,0.06)" },
  logo: { fontSize: "20px", fontWeight: "800", color: "#1a1a2e", letterSpacing: "-0.5px", marginBottom: "36px" },
  logoAccent: { color: "#7c3aed" },
  sidebarSection: { fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", color: "#bbb", marginBottom: "10px" },
  navItem: { padding: "10px 14px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer", color: "#555", marginBottom: "4px" },
  navActive: { backgroundColor: "#f3e8ff", color: "#7c3aed", fontWeight: "700" },
  logoutBtn: { padding: "10px 14px", borderRadius: "10px", color: "#ef4444", fontWeight: "600", fontSize: "14px", cursor: "pointer" },
  main: { flex: 1, padding: "36px 40px", overflowY: "auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  pageTitle: { fontSize: "30px", fontWeight: "900", color: "#1a1a2e", letterSpacing: "-1px", margin: 0 },
  pageSubtitle: { fontSize: "14px", color: "#888", marginTop: "4px" },
  createBtn: { backgroundColor: "#1a1a2e", color: "#fff", border: "none", padding: "12px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  avatar: { width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" },
  statCard: { backgroundColor: "#fff", borderRadius: "18px", padding: "24px 22px", boxShadow: "0 4px 20px rgba(109,40,217,0.07)", border: "1px solid #ede9fe" },
  statValue: { fontSize: "32px", fontWeight: "900", color: "#1a1a2e", letterSpacing: "-1px", marginBottom: "6px" },
  statLabel: { fontSize: "13px", color: "#888", fontWeight: "500" },
  card: { backgroundColor: "#fff", borderRadius: "18px", padding: "28px", marginBottom: "28px", boxShadow: "0 4px 20px rgba(109,40,217,0.07)", border: "1px solid #ede9fe" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#1a1a2e", margin: 0, letterSpacing: "-0.5px" },
  viewAll: { fontSize: "13px", color: "#7c3aed", fontWeight: "600", cursor: "pointer" },
  badge: { backgroundColor: "#f3e8ff", color: "#7c3aed", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", fontWeight: "700", color: "#aaa", letterSpacing: "0.5px", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #f0f0f0" },
  tr: { borderBottom: "1px solid #f9f9f9" },
  td: { padding: "14px", fontSize: "13px", color: "#444", verticalAlign: "middle" },
  eventName: { fontWeight: "700", color: "#1a1a2e", fontSize: "14px" },
  catBadge: { padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", color: "#555" },
  statusBadge: { padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700" },
  capWrap: { display: "flex", alignItems: "center", gap: "10px" },
  capBar: { width: "80px", height: "6px", backgroundColor: "#ede9fe", borderRadius: "999px", overflow: "hidden" },
  capFill: { height: "100%", backgroundColor: "#7c3aed", borderRadius: "999px" },
  capText: { fontSize: "12px", color: "#888", fontWeight: "600" },
  actionBtn: { padding: "5px 12px", borderRadius: "6px", border: "1.5px solid #ddd", backgroundColor: "#fff", fontSize: "12px", fontWeight: "600", color: "#555", cursor: "pointer", fontFamily: "inherit" },
  searchInput: { padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #ede9fe", fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#333", backgroundColor: "#faf8ff", width: "280px" },
  filterBtn: { padding: "7px 14px", borderRadius: "999px", border: "1.5px solid #ddd6fe", backgroundColor: "#fff", color: "#888", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
  filterBtnActive: { backgroundColor: "#7c3aed", borderColor: "#7c3aed", color: "#fff" },
  formInput: { border: "1.5px solid #ede9fe", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", color: "#333", backgroundColor: "#faf8ff", outline: "none", fontFamily: "inherit", width: "100%" },
  toast: { position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#1a1a2e", color: "#fff", padding: "14px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", zIndex: 999, whiteSpace: "nowrap" },
};
