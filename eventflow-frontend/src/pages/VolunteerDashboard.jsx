import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AIFloatingButton from "./AIFloatingButton";


export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [volunteer, setVolunteer] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [manualForm, setManualForm] = useState({ name: "", email: "" });
  const [manualErrors, setManualErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [stream, setStream] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle"); // idle | scanning | success | error
  const lastScannedRef = useRef(null);
  const volunteerRef = useRef(null);

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAttendance = async (eventName) => {
    try {
      const res = await fetch(`https://eventflowa7.onrender.com/api/volunteer/attendance/${encodeURIComponent(eventName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (_err) {
      setAttendance([]);
    }
  };

  const markAttendance = async (name, email) => {
    try {
      const currentVolunteer = volunteerRef.current;
      const res = await fetch("https://eventflowa7.onrender.com/api/volunteer/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attendeeName: name, attendeeEmail: email, eventName: currentVolunteer?.assignedEvent }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("⚠️ " + data.message); return false; }
      showToast("✅ Attendance marked for " + name);
      if (currentVolunteer?.assignedEvent) fetchAttendance(currentVolunteer.assignedEvent);
      return true;
    } catch (_err) {
      showToast("Something went wrong");
      return false;
    }
  };

  const fetchVolunteerData = async () => {
    try {
      const res = await fetch("https://eventflowa7.onrender.com/api/volunteer/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { navigate("/login"); return; }
      setVolunteer(data);
      volunteerRef.current = data;
    } catch (_err) {
      navigate("/login");
    }
  };

  useEffect(() => { fetchVolunteerData(); }, []);
  useEffect(() => { if (volunteer?.assignedEvent) fetchAttendance(volunteer.assignedEvent); }, [volunteer]);

  // ── Real jsQR scan loop ──────────────────────────────
  const scanLoop = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== 4) {
      animFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const jsQR = (await import("jsqr")).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data !== lastScannedRef.current) {
        lastScannedRef.current = code.data;
        setScanResult(code.data);
        setScanStatus("success");
        try {
          const parsed = JSON.parse(code.data);
          await markAttendance(parsed.name || "Unknown", parsed.email || "unknown@email.com");
        } catch (_e) {
          showToast("❌ Invalid QR code format");
          setScanStatus("error");
        }
        // Reset after 3s for next attendee
        setTimeout(() => {
          lastScannedRef.current = null;
          setScanResult(null);
          setScanStatus("scanning");
        }, 3000);
      }
    } catch (_e) { /* skip frame */ }

    animFrameRef.current = requestAnimationFrame(scanLoop);
  }, []);

  const startScanner = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(mediaStream);
      setScanning(true);
      setScanStatus("scanning");
      setActiveTab("scanner");
      lastScannedRef.current = null;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            animFrameRef.current = requestAnimationFrame(scanLoop);
          };
        }
      }, 100);
    } catch (_err) {
      showToast("Camera access denied. Please allow camera permission.");
    }
  };

  const stopScanner = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setStream(null);
    setScanning(false);
    setScanResult(null);
    setScanStatus("idle");
    lastScannedRef.current = null;
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!manualForm.name.trim()) errs.name = "Name is required";
    if (!manualForm.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(manualForm.email)) errs.email = "Enter a valid email";
    if (Object.keys(errs).length > 0) { setManualErrors(errs); return; }
    const success = await markAttendance(manualForm.name, manualForm.email);
    if (success) setManualForm({ name: "", email: "" });
    setManualErrors({});
  };

  if (!volunteer) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f5f3ff", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: "#888" }}>Loading...</p>
      </div>
    );
  }

  if (!volunteer.approved) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f5f3ff", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", boxShadow: "0 4px 20px rgba(109,40,217,0.1)", border: "1px solid #ede9fe" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#1a1a2e", marginBottom: "12px" }}>Pending Approval</h2>
          <p style={{ fontSize: "14px", color: "#888", lineHeight: "1.7", marginBottom: "24px" }}>
            Your volunteer account is awaiting admin approval. You will be assigned to an event once approved.
          </p>
          <button onClick={() => navigate("/login")} style={st.logoutBtn}>Back to Login</button>
        </div>
      </div>
    );
  }

  const scanBorderColor = scanStatus === "success" ? "#10b981" : scanStatus === "error" ? "#f87171" : "#a78bfa";

  return (
    <div style={st.page}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={st.sidebar}>
        <div style={st.logo}>event<span style={st.logoAccent}>flow</span></div>
        <div style={st.sidebarSection}>VOLUNTEER</div>
        {[
          { key: "overview", label: "Overview" },
          { key: "scanner", label: "QR Scanner" },
          { key: "manual", label: "Manual Entry" },
          { key: "attendance", label: "Attendance" },
        ].map(item => (
          <div key={item.key}
            onClick={() => { if (item.key !== "scanner") stopScanner(); setActiveTab(item.key); }}
            style={{ ...st.navItem, ...(activeTab === item.key ? st.navActive : {}) }}>
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div style={st.logoutBtn} onClick={() => { stopScanner(); navigate("/login"); }}>Logout</div>
        </div>
      </div>

      <div style={st.main}>

        {activeTab === "overview" && (
          <>
            <div style={st.topBar}>
              <div>
                <h1 style={st.pageTitle}>Volunteer Dashboard</h1>
                <p style={st.pageSubtitle}>Welcome back, {volunteer.fullName}</p>
              </div>
              <div style={st.avatar}>{volunteer.fullName?.charAt(0).toUpperCase()}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div style={st.infoCard}><div style={st.infoLabel}>Assigned Event</div><div style={st.infoValue}>{volunteer.assignedEvent || "Not assigned yet"}</div></div>
              <div style={st.infoCard}><div style={st.infoLabel}>Attendance Marked</div><div style={st.infoValue}>{attendance.length}</div></div>
              <div style={st.infoCard}><div style={st.infoLabel}>Your College</div><div style={st.infoValue}>{volunteer.college}</div></div>
              <div style={st.infoCard}><div style={st.infoLabel}>Status</div><div style={{ ...st.infoValue, color: "#10b981" }}>Active</div></div>
            </div>
            <div style={st.card}>
              <h2 style={st.cardTitle}>Quick Actions</h2>
              <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
                <button style={st.actionCard} onClick={startScanner}>
                  <div style={st.actionIcon}>⬛</div>
                  <div style={st.actionLabel}>Scan QR Code</div>
                  <div style={st.actionDesc}>Use camera to scan attendee QR</div>
                </button>
                <button style={st.actionCard} onClick={() => setActiveTab("manual")}>
                  <div style={st.actionIcon}>✏️</div>
                  <div style={st.actionLabel}>Manual Entry</div>
                  <div style={st.actionDesc}>Enter attendee details manually</div>
                </button>
                <button style={st.actionCard} onClick={() => setActiveTab("attendance")}>
                  <div style={st.actionIcon}>📋</div>
                  <div style={st.actionLabel}>View Attendance</div>
                  <div style={st.actionDesc}>See all marked attendees</div>
                </button>
              </div>
            </div>
            {attendance.length > 0 && (
              <div style={st.card}>
                <div style={st.cardHeader}>
                  <h2 style={st.cardTitle}>Recent Attendance</h2>
                  <span style={st.viewAll} onClick={() => setActiveTab("attendance")}>View all</span>
                </div>
                <table style={st.table}>
                  <thead><tr>{["Name", "Email", "Time"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {attendance.slice(0, 5).map((a, i) => (
                      <tr key={i} style={st.tr}>
                        <td style={st.td}><div style={st.nameText}>{a.attendeeName}</div></td>
                        <td style={st.td}>{a.attendeeEmail}</td>
                        <td style={st.td}>{new Date(a.markedAt).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "scanner" && (
          <>
            <div style={st.topBar}>
              <div>
                <h1 style={st.pageTitle}>QR Scanner</h1>
                <p style={st.pageSubtitle}>Scan attendee QR codes to mark attendance</p>
              </div>
              <div style={st.avatar}>{volunteer.fullName?.charAt(0).toUpperCase()}</div>
            </div>
            <div style={{ maxWidth: "520px" }}>
              <div style={st.card}>
                <h2 style={st.cardTitle}>Event: {volunteer.assignedEvent}</h2>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
                  Point the camera at the attendee's QR code — attendance marks automatically.
                </p>
                <div style={st.scannerBox}>
                  {scanning ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted style={st.video} />
                      <div style={st.scanOverlay}>
                        <div style={{ ...st.scanFrame, borderColor: scanBorderColor, transition: "border-color 0.3s" }}>
                          {scanStatus === "success" && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: "36px" }}>✅</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ position: "absolute", bottom: "12px", left: 0, right: 0, textAlign: "center" }}>
                        <span style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "12px", padding: "4px 14px", borderRadius: "999px" }}>
                          {scanStatus === "success" ? "✅ Scanned!" : scanStatus === "error" ? "❌ Invalid QR" : "🔍 Looking for QR code..."}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={st.scanPlaceholder}>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>⬛</div>
                      <p style={{ color: "#aaa", fontSize: "14px" }}>Camera not active</p>
                    </div>
                  )}
                </div>

                {scanResult && (
                  <div style={{
                    ...st.scanResult,
                    backgroundColor: scanStatus === "success" ? "#f0fdf4" : "#fef2f2",
                    borderColor: scanStatus === "success" ? "#10b981" : "#f87171",
                    color: scanStatus === "success" ? "#065f46" : "#991b1b",
                  }}>
                    {(() => {
                      try {
                        const p = JSON.parse(scanResult);
                        return `${scanStatus === "success" ? "✅" : "❌"} ${p.name} (${p.email})`;
                      } catch (_e) { return scanResult; }
                    })()}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  {!scanning
                    ? <button style={st.primaryBtn} onClick={startScanner}>Start Camera</button>
                    : <button style={st.secondaryBtn} onClick={stopScanner}>Stop Camera</button>
                  }
                </div>
                <p style={{ fontSize: "12px", color: "#bbb", marginTop: "12px" }}>
                  Make sure the attendee's QR is well-lit and centred within the frame.
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === "manual" && (
          <>
            <div style={st.topBar}>
              <div>
                <h1 style={st.pageTitle}>Manual Entry</h1>
                <p style={st.pageSubtitle}>Enter attendee details to mark attendance</p>
              </div>
              <div style={st.avatar}>{volunteer.fullName?.charAt(0).toUpperCase()}</div>
            </div>
            <div style={{ maxWidth: "480px" }}>
              <div style={st.card}>
                <h2 style={{ ...st.cardTitle, marginBottom: "6px" }}>Mark Attendance</h2>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>Event: <strong>{volunteer.assignedEvent}</strong></p>
                <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    <label style={st.formLabel}>Attendee Full Name</label>
                    <input placeholder="Enter full name" value={manualForm.name}
                      onChange={e => { setManualForm({ ...manualForm, name: e.target.value }); setManualErrors({ ...manualErrors, name: "" }); }}
                      style={{ ...st.formInput, ...(manualErrors.name ? { borderColor: "#f87171" } : {}) }} />
                    {manualErrors.name && <span style={st.formError}>{manualErrors.name}</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    <label style={st.formLabel}>Attendee Email</label>
                    <input placeholder="Enter email address" value={manualForm.email}
                      onChange={e => { setManualForm({ ...manualForm, email: e.target.value }); setManualErrors({ ...manualErrors, email: "" }); }}
                      style={{ ...st.formInput, ...(manualErrors.email ? { borderColor: "#f87171" } : {}) }} />
                    {manualErrors.email && <span style={st.formError}>{manualErrors.email}</span>}
                  </div>
                  <button type="submit" style={st.primaryBtn}>Mark Attendance</button>
                </form>
              </div>
            </div>
          </>
        )}

        {activeTab === "attendance" && (
          <>
            <div style={st.topBar}>
              <div>
                <h1 style={st.pageTitle}>Attendance List</h1>
                <p style={st.pageSubtitle}>{volunteer.assignedEvent} — {attendance.length} marked</p>
              </div>
              <div style={st.avatar}>{volunteer.fullName?.charAt(0).toUpperCase()}</div>
            </div>
            <div style={st.card}>
              {attendance.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", color: "#bbb" }}>
                  <p style={{ fontSize: "15px" }}>No attendance marked yet</p>
                  <p style={{ fontSize: "13px", marginTop: "8px" }}>Use QR scanner or manual entry to mark attendees</p>
                </div>
              ) : (
                <table style={st.table}>
                  <thead><tr>{["#", "Name", "Email", "Marked By", "Time"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {attendance.map((a, i) => (
                      <tr key={i} style={st.tr}>
                        <td style={st.td}>{i + 1}</td>
                        <td style={st.td}><div style={st.nameText}>{a.attendeeName}</div></td>
                        <td style={st.td}>{a.attendeeEmail}</td>
                        <td style={st.td}>{a.markedBy}</td>
                        <td style={st.td}>{new Date(a.markedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      </div>

      {toast && <div style={st.toast}>{toast}</div>}

      <AIFloatingButton />
    </div>
  );
}

const st = {
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
  avatar: { width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" },
  card: { backgroundColor: "#fff", borderRadius: "18px", padding: "28px", marginBottom: "28px", boxShadow: "0 4px 20px rgba(109,40,217,0.07)", border: "1px solid #ede9fe" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  cardTitle: { fontSize: "18px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 16px", letterSpacing: "-0.5px" },
  viewAll: { fontSize: "13px", color: "#7c3aed", fontWeight: "600", cursor: "pointer" },
  infoCard: { backgroundColor: "#fff", borderRadius: "18px", padding: "24px", boxShadow: "0 4px 20px rgba(109,40,217,0.07)", border: "1px solid #ede9fe" },
  infoLabel: { fontSize: "12px", color: "#aaa", fontWeight: "600", marginBottom: "8px", letterSpacing: "0.5px" },
  infoValue: { fontSize: "20px", fontWeight: "800", color: "#1a1a2e" },
  actionCard: { flex: 1, border: "1.5px solid #ede9fe", borderRadius: "14px", padding: "20px 16px", backgroundColor: "#faf8ff", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
  actionIcon: { fontSize: "24px", marginBottom: "10px" },
  actionLabel: { fontSize: "14px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px" },
  actionDesc: { fontSize: "12px", color: "#999" },
  scannerBox: { width: "100%", height: "300px", borderRadius: "16px", overflow: "hidden", backgroundColor: "#1a1a2e", position: "relative", marginBottom: "8px" },
  video: { width: "100%", height: "100%", objectFit: "cover" },
  scanOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  scanFrame: { width: "180px", height: "180px", border: "3px solid #a78bfa", borderRadius: "16px", position: "relative" },
  scanPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#fff" },
  scanResult: { border: "1px solid #ddd6fe", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", fontWeight: "600", marginTop: "8px", wordBreak: "break-all" },
  primaryBtn: { flex: 1, padding: "12px 20px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  secondaryBtn: { flex: 1, padding: "12px 20px", backgroundColor: "#fff", color: "#7c3aed", border: "1.5px solid #7c3aed", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" },
  formLabel: { fontSize: "12px", fontWeight: "600", color: "#555" },
  formInput: { border: "1.5px solid #ede9fe", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", color: "#333", backgroundColor: "#faf8ff", outline: "none", fontFamily: "inherit", width: "100%" },
  formError: { fontSize: "11px", color: "#f87171" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: "11px", fontWeight: "700", color: "#aaa", letterSpacing: "0.5px", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #f0f0f0" },
  tr: { borderBottom: "1px solid #f9f9f9" },
  td: { padding: "14px", fontSize: "13px", color: "#444", verticalAlign: "middle" },
  nameText: { fontWeight: "700", color: "#1a1a2e", fontSize: "14px" },
  toast: { position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#1a1a2e", color: "#fff", padding: "14px 28px", borderRadius: "999px", fontSize: "14px", fontWeight: "600", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", zIndex: 999, whiteSpace: "nowrap" },
};
