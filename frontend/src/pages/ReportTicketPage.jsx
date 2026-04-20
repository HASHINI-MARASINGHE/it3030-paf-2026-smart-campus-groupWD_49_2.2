import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createTicket } from "../api/ticketApi";
import { getAllFacilities } from "../api/facilityApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/common/Toast";

const CATEGORIES = [
  { value: "ELECTRICAL", label: "⚡ Electrical" },
  { value: "PLUMBING", label: "🚿 Plumbing" },
  { value: "HVAC", label: "❄️ HVAC / Air Conditioning" },
  { value: "EQUIPMENT", label: "🔧 Equipment" },
  { value: "CLEANLINESS", label: "🧹 Cleanliness" },
  { value: "SECURITY", label: "🔒 Security" },
  { value: "OTHER", label: "📋 Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const emptyForm = {
  facilityId: "",
  reporterName: "",
  reporterEmail: "",
  title: "",
  description: "",
  category: "",
  priority: "",
};

function ReportTicketPage() {
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  useEffect(() => {
    getAllFacilities()
      .then((res) => setFacilities(res.data))
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.facilityId) errs.facilityId = "Please select a facility.";
    if (!formData.reporterName.trim()) errs.reporterName = "Name is required.";
    if (!formData.reporterEmail.trim()) errs.reporterEmail = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterEmail))
      errs.reporterEmail = "Invalid email format.";
    if (!formData.title.trim()) errs.title = "Title is required.";
    if (!formData.description.trim()) errs.description = "Description is required.";
    if (!formData.category) errs.category = "Please select a category.";
    if (!formData.priority) errs.priority = "Please select a priority.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        facilityId: Number(formData.facilityId),
      };
      const res = await createTicket(payload);
      setSubmittedTicket(res.data);
      setFormData(emptyForm);
      setErrors({});
      setToast({ type: "success", message: "Ticket submitted successfully!" });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.messages ||
        "Failed to submit ticket. Please try again.";
      setToast({ type: "error", message: typeof msg === "object" ? JSON.stringify(msg) : msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f5f6f8" }}>
      <Navbar />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Report a Maintenance Issue</h1>
        <p style={styles.heroSub}>
          Spotted a problem on campus? Submit a ticket and our team will get on it.
        </p>
      </div>

      <div style={styles.container}>
        {submittedTicket && (
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <h3 style={styles.successTitle}>Ticket Submitted!</h3>
            <p style={styles.successText}>
              Your ticket <strong>#{submittedTicket.id}</strong> — "{submittedTicket.title}" has been received.
            </p>
            <p style={styles.successText}>
              You can track it using your email on the{" "}
              <Link to="/my-tickets" style={styles.link}>My Tickets</Link> page.
            </p>
            <button style={styles.newTicketBtn} onClick={() => setSubmittedTicket(null)}>
              Submit Another Ticket
            </button>
          </div>
        )}

        {!submittedTicket && (
          <form style={styles.card} onSubmit={handleSubmit}>
            <h2 style={styles.formTitle}>Issue Details</h2>
            <p style={styles.formSubText}>Fill in the form below with as much detail as possible.</p>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Facility *</label>
                <select
                  name="facilityId"
                  value={formData.facilityId}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.facilityId ? styles.inputError : {}) }}
                >
                  <option value="">Select a facility</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.location}
                    </option>
                  ))}
                </select>
                {errors.facilityId && <span style={styles.error}>{errors.facilityId}</span>}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Your Name *</label>
                <input
                  type="text"
                  name="reporterName"
                  placeholder="Full name"
                  value={formData.reporterName}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.reporterName ? styles.inputError : {}) }}
                />
                {errors.reporterName && <span style={styles.error}>{errors.reporterName}</span>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Your Email *</label>
                <input
                  type="email"
                  name="reporterEmail"
                  placeholder="university@sliit.lk"
                  value={formData.reporterEmail}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.reporterEmail ? styles.inputError : {}) }}
                />
                {errors.reporterEmail && <span style={styles.error}>{errors.reporterEmail}</span>}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Issue Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Brief summary of the issue"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
                />
                {errors.title && <span style={styles.error}>{errors.title}</span>}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.category ? styles.inputError : {}) }}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.category && <span style={styles.error}>{errors.category}</span>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Priority *</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.priority ? styles.inputError : {}) }}
                >
                  <option value="">Select priority</option>
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                {errors.priority && <span style={styles.error}>{errors.priority}</span>}
              </div>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe the issue in detail — location, what you observed, when it started..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  style={{ ...styles.input, ...(errors.description ? styles.inputError : {}), resize: "vertical" }}
                />
                {errors.description && <span style={styles.error}>{errors.description}</span>}
              </div>
            </div>

            <div style={styles.formFooter}>
              <Link to="/my-tickets" style={styles.link}>Track my tickets</Link>
              <button type="submit" style={styles.submitBtn} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        )}

        <div style={styles.infoBox}>
          <h4 style={styles.infoTitle}>How it works</h4>
          <ol style={styles.infoList}>
            <li>Submit your issue with as much detail as possible.</li>
            <li>Our maintenance team reviews and assigns the ticket.</li>
            <li>You'll get updates — track using your email on My Tickets.</li>
            <li>Once resolved, the ticket is closed with a resolution note.</li>
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #1f2f6b, #37424a)",
    color: "#fff",
    padding: "60px 40px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  heroSub: {
    fontSize: "16px",
    color: "#d1d5db",
  },
  container: {
    maxWidth: "860px",
    margin: "40px auto",
    padding: "0 20px",
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "32px 36px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
    borderLeft: "5px solid #1f2f6b",
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2f6b",
    marginBottom: "6px",
  },
  formSubText: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "4px",
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: "200px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  error: {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "4px",
  },
  formFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
    flexWrap: "wrap",
    gap: "12px",
  },
  link: {
    color: "#1f2f6b",
    fontWeight: "600",
    textDecoration: "underline",
    fontSize: "14px",
  },
  submitBtn: {
    padding: "12px 32px",
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "44px 40px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
    marginBottom: "24px",
    borderLeft: "5px solid #16a34a",
  },
  successIcon: {
    fontSize: "52px",
    marginBottom: "16px",
  },
  successTitle: {
    fontSize: "22px",
    color: "#16a34a",
    marginBottom: "12px",
    fontWeight: "700",
  },
  successText: {
    fontSize: "15px",
    color: "#374151",
    marginBottom: "8px",
    lineHeight: "1.6",
  },
  newTicketBtn: {
    marginTop: "22px",
    padding: "12px 28px",
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderLeft: "5px solid #f4b400",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  infoTitle: {
    color: "#1f2f6b",
    marginBottom: "10px",
    fontSize: "15px",
    fontWeight: "700",
  },
  infoList: {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "1.9",
    paddingLeft: "18px",
  },
};

export default ReportTicketPage;
