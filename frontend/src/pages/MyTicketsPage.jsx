import { useState } from "react";
import { Link } from "react-router-dom";
import { getMyTickets } from "../api/ticketApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORY_ICONS = {
  ELECTRICAL: "⚡",
  PLUMBING: "🚿",
  HVAC: "❄️",
  EQUIPMENT: "🔧",
  CLEANLINESS: "🧹",
  SECURITY: "🔒",
  OTHER: "📋",
};

const getStatusStyle = (status) => {
  switch (status) {
    case "OPEN": return { backgroundColor: "#dbeafe", color: "#1e40af" };
    case "IN_PROGRESS": return { backgroundColor: "#fef9c3", color: "#854d0e" };
    case "RESOLVED": return { backgroundColor: "#dcfce7", color: "#166534" };
    case "CLOSED": return { backgroundColor: "#e5e7eb", color: "#374151" };
    default: return { backgroundColor: "#f3f4f6", color: "#374151" };
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "CRITICAL": return { backgroundColor: "#fee2e2", color: "#991b1b" };
    case "HIGH": return { backgroundColor: "#ffedd5", color: "#9a3412" };
    case "MEDIUM": return { backgroundColor: "#fef3c7", color: "#92400e" };
    case "LOW": return { backgroundColor: "#dcfce7", color: "#166534" };
    default: return { backgroundColor: "#f3f4f6", color: "#374151" };
  }
};

const getPriorityBorderColor = (priority) => {
  switch (priority) {
    case "CRITICAL": return "#dc2626";
    case "HIGH": return "#f97316";
    case "MEDIUM": return "#f59e0b";
    default: return "#16a34a";
  }
};

function daysSince(dateStr) {
  const created = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

function MyTicketsPage() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyTickets(email.trim());
      setTickets(res.data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f5f6f8" }}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>My Tickets</h1>
        <p style={styles.heroSub}>Track the status of your submitted maintenance requests.</p>
      </div>

      <div style={styles.container}>
        {/* Search Card */}
        <form style={styles.searchCard} onSubmit={handleSearch}>
          <h3 style={styles.cardHeading}>Find Your Tickets</h3>
          <p style={styles.cardSubText}>Enter the email address you used when submitting the ticket.</p>
          <div style={styles.searchRow}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.searchBtn} disabled={loading}>
              {loading ? "Searching..." : "Find Tickets"}
            </button>
          </div>
        </form>

        {error && <div style={styles.errorBox}>{error}</div>}

        {searched && tickets.length === 0 && !error && (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No tickets found</h3>
            <p style={styles.emptyText}>No tickets found for <strong>{email}</strong>.</p>
            <Link to="/report-ticket" style={styles.reportLink}>Report an Issue</Link>
          </div>
        )}

        {tickets.length > 0 && (
          <div>
            <div style={styles.resultsHeader}>
              <p style={styles.resultsCount}>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found</p>
              <Link to="/report-ticket" style={styles.reportLink}>+ Report New Issue</Link>
            </div>

            {tickets.map((ticket) => {
              const statusStyle = getStatusStyle(ticket.status);
              const priorityStyle = getPriorityStyle(ticket.priority);
              const borderColor = getPriorityBorderColor(ticket.priority);
              const isExpanded = expandedId === ticket.id;
              const isOpen = ticket.status === "OPEN" || ticket.status === "IN_PROGRESS";
              const days = daysSince(ticket.createdAt);

              return (
                <div key={ticket.id} style={{ ...styles.ticketCard, borderLeft: `5px solid ${borderColor}` }}>
                  <div style={styles.ticketHeader} onClick={() => toggleExpand(ticket.id)}>
                    <div style={styles.ticketLeft}>
                      <span style={styles.categoryIcon}>{CATEGORY_ICONS[ticket.category] || "📋"}</span>
                      <div>
                        <div style={styles.ticketTitle}>#{ticket.id} — {ticket.title}</div>
                        <div style={styles.ticketMeta}>
                          {ticket.facility?.name} · {ticket.facility?.location}
                        </div>
                      </div>
                    </div>

                    <div style={styles.ticketRight}>
                      <span style={{ ...styles.badge, ...priorityStyle }}>
                        {ticket.priority === "CRITICAL" ? "🔴 " : ""}{ticket.priority}
                      </span>
                      <span style={{ ...styles.badge, ...statusStyle }}>
                        {ticket.status.replace("_", " ")}
                      </span>
                      {isOpen && (
                        <span style={styles.ageBadge}>
                          {days} day{days !== 1 ? "s" : ""} open
                        </span>
                      )}
                      <span style={styles.expandArrow}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.ticketBody}>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Category:</span>
                        <span>{CATEGORY_ICONS[ticket.category]} {ticket.category}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Description:</span>
                        <span style={{ whiteSpace: "pre-wrap" }}>{ticket.description}</span>
                      </div>
                      {ticket.assignedTo && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Assigned To:</span>
                          <span>{ticket.assignedTo}</span>
                        </div>
                      )}
                      {ticket.resolutionNote && (
                        <div style={{ ...styles.detailRow, backgroundColor: "#f0fdf4", borderRadius: "8px", padding: "12px" }}>
                          <span style={styles.detailLabel}>Resolution:</span>
                          <span>{ticket.resolutionNote}</span>
                        </div>
                      )}
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Submitted:</span>
                        <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Last Updated:</span>
                        <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
  searchCard: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "28px 32px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  cardHeading: {
    color: "#1f2f6b",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  cardSubText: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  searchRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "220px",
    padding: "12px 14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  searchBtn: {
    padding: "12px 28px",
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "50px 30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  emptyTitle: {
    color: "#1f2f6b",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#555",
    marginBottom: "16px",
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "10px",
  },
  resultsCount: {
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px",
    margin: 0,
  },
  reportLink: {
    color: "#1f2f6b",
    fontWeight: "600",
    textDecoration: "underline",
    fontSize: "14px",
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
    marginBottom: "14px",
    overflow: "hidden",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 22px",
    cursor: "pointer",
    flexWrap: "wrap",
    gap: "12px",
  },
  ticketLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: 1,
  },
  categoryIcon: {
    fontSize: "26px",
  },
  ticketTitle: {
    fontWeight: "600",
    color: "#1f2f6b",
    fontSize: "15px",
  },
  ticketMeta: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "3px",
  },
  ticketRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  ageBadge: {
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    fontWeight: "600",
  },
  expandArrow: {
    color: "#9ca3af",
    fontSize: "13px",
    fontWeight: "bold",
  },
  ticketBody: {
    borderTop: "1px solid #f3f4f6",
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#fafafa",
  },
  detailRow: {
    display: "flex",
    gap: "12px",
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.6",
  },
  detailLabel: {
    fontWeight: "600",
    minWidth: "110px",
    color: "#6b7280",
  },
};

export default MyTicketsPage;
