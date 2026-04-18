import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFacilities } from "../../api/facilityApi";
import { getTicketStats } from "../../api/ticketApi";
import { getAllBookings } from "../../api/bookingApi";

function AdminDashboard() {
  const [facilityStats, setFacilityStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    active: 0,
    outOfService: 0,
  });
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [facilitiesRes, ticketStatsRes, bookingsRes] = await Promise.all([
          getAllFacilities(),
          getTicketStats(),
          getAllBookings(),
        ]);

        const facilities = facilitiesRes.data;
        setFacilityStats({
          total: facilities.length,
          available: facilities.filter((f) => f.available).length,
          unavailable: facilities.filter((f) => !f.available).length,
          active: facilities.filter((f) => f.status === "ACTIVE").length,
          outOfService: facilities.filter((f) => f.status === "OUT_OF_SERVICE").length,
        });

        setTicketStats(ticketStatsRes.data);

        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        const toUpper = (s) => String(s || "").toUpperCase();
        setBookingStats({
          total: bookings.length,
          pending: bookings.filter((b) => toUpper(b.status) === "PENDING").length,
          approved: bookings.filter((b) => toUpper(b.status) === "APPROVED").length,
          rejected: bookings.filter((b) => toUpper(b.status) === "REJECTED").length,
          cancelled: bookings.filter((b) => toUpper(b.status) === "CANCELLED").length,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const urgentTickets = ticketStats.open + ticketStats.inProgress;
  const pendingBookings = bookingStats.pending;

  return (
    <div>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Admin Dashboard</h2>
          <p style={styles.subText}>
            Overview of campus facilities, bookings, and maintenance tickets.
          </p>
        </div>
        <div style={styles.headerBadges}>
          {urgentTickets > 0 && (
            <Link to="/admin/tickets" style={styles.alertBadge}>
              {urgentTickets} Active Ticket{urgentTickets !== 1 ? "s" : ""}
            </Link>
          )}
          {pendingBookings > 0 && (
            <Link to="/admin/bookings" style={styles.warningBadge}>
              {pendingBookings} Pending Booking{pendingBookings !== 1 ? "s" : ""}
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div style={styles.loaderWrapper}>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Facilities Section */}
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleRow}>
              <span style={styles.sectionIcon}>🏛️</span>
              <div>
                <h3 style={styles.sectionTitle}>Facilities</h3>
                <p style={styles.sectionSub}>Campus facility availability and status</p>
              </div>
            </div>
            <Link to="/admin/facilities" style={styles.sectionLink}>View All →</Link>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{facilityStats.total}</div>
              <div style={styles.statLabel}>Total Facilities</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #16a34a" }}>
              <div style={{ ...styles.statNumber, color: "#16a34a" }}>{facilityStats.available}</div>
              <div style={styles.statLabel}>Available</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #dc2626" }}>
              <div style={{ ...styles.statNumber, color: "#dc2626" }}>{facilityStats.unavailable}</div>
              <div style={styles.statLabel}>Unavailable</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #3b82f6" }}>
              <div style={{ ...styles.statNumber, color: "#3b82f6" }}>{facilityStats.active}</div>
              <div style={styles.statLabel}>Active</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #64748b" }}>
              <div style={{ ...styles.statNumber, color: "#64748b" }}>{facilityStats.outOfService}</div>
              <div style={styles.statLabel}>Out of Service</div>
            </div>
          </div>

          {/* Bookings Section */}
          <div style={{ ...styles.sectionHeader, marginTop: "36px" }}>
            <div style={styles.sectionTitleRow}>
              <span style={styles.sectionIcon}>📅</span>
              <div>
                <h3 style={styles.sectionTitle}>Bookings</h3>
                <p style={styles.sectionSub}>Facility booking requests and approvals</p>
              </div>
            </div>
            <Link to="/admin/bookings" style={styles.sectionLink}>View All →</Link>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{bookingStats.total}</div>
              <div style={styles.statLabel}>Total Bookings</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #f59e0b" }}>
              <div style={{ ...styles.statNumber, color: "#92400e" }}>{bookingStats.pending}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #16a34a" }}>
              <div style={{ ...styles.statNumber, color: "#16a34a" }}>{bookingStats.approved}</div>
              <div style={styles.statLabel}>Approved</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #dc2626" }}>
              <div style={{ ...styles.statNumber, color: "#dc2626" }}>{bookingStats.rejected}</div>
              <div style={styles.statLabel}>Rejected</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #64748b" }}>
              <div style={{ ...styles.statNumber, color: "#64748b" }}>{bookingStats.cancelled}</div>
              <div style={styles.statLabel}>Cancelled</div>
            </div>
          </div>

          {/* Tickets Section */}
          <div style={{ ...styles.sectionHeader, marginTop: "36px" }}>
            <div style={styles.sectionTitleRow}>
              <span style={styles.sectionIcon}>🎫</span>
              <div>
                <h3 style={styles.sectionTitle}>Maintenance Tickets</h3>
                <p style={styles.sectionSub}>Campus incident and maintenance requests</p>
              </div>
            </div>
            <Link to="/admin/tickets" style={styles.sectionLink}>View All →</Link>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{ticketStats.total}</div>
              <div style={styles.statLabel}>Total Tickets</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #f59e0b" }}>
              <div style={{ ...styles.statNumber, color: "#92400e" }}>{ticketStats.open}</div>
              <div style={styles.statLabel}>Open</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #3b82f6" }}>
              <div style={{ ...styles.statNumber, color: "#1e40af" }}>{ticketStats.inProgress}</div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #16a34a" }}>
              <div style={{ ...styles.statNumber, color: "#16a34a" }}>{ticketStats.resolved}</div>
              <div style={styles.statLabel}>Resolved</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: "5px solid #64748b" }}>
              <div style={{ ...styles.statNumber, color: "#64748b" }}>{ticketStats.closed}</div>
              <div style={styles.statLabel}>Closed</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ ...styles.sectionHeader, marginTop: "36px" }}>
            <div style={styles.sectionTitleRow}>
              <span style={styles.sectionIcon}>⚡</span>
              <div>
                <h3 style={styles.sectionTitle}>Quick Actions</h3>
                <p style={styles.sectionSub}>Jump to common tasks</p>
              </div>
            </div>
          </div>

          <div style={styles.actionsGrid}>
            <Link to="/admin/facilities" style={styles.actionCard}>
              <div style={styles.actionIcon}>🏛️</div>
              <div style={styles.actionLabel}>Manage Facilities</div>
              <div style={styles.actionSub}>View and edit campus facilities</div>
            </Link>
            <Link to="/admin/facilities/add" style={{ ...styles.actionCard, borderLeft: "5px solid #f4b400" }}>
              <div style={styles.actionIcon}>➕</div>
              <div style={styles.actionLabel}>Add Facility</div>
              <div style={styles.actionSub}>Register a new campus facility</div>
            </Link>
            <Link to="/admin/bookings" style={{ ...styles.actionCard, borderLeft: "5px solid #16a34a" }}>
              <div style={styles.actionIcon}>📅</div>
              <div style={styles.actionLabel}>Review Bookings</div>
              <div style={styles.actionSub}>Approve or reject booking requests</div>
            </Link>
            <Link to="/admin/tickets" style={{ ...styles.actionCard, borderLeft: "5px solid #dc2626" }}>
              <div style={styles.actionIcon}>🎫</div>
              <div style={styles.actionLabel}>Manage Tickets</div>
              <div style={styles.actionSub}>Update and resolve maintenance tickets</div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    gap: "16px",
    flexWrap: "wrap",
  },
  heading: {
    color: "#1f2f6b",
    marginBottom: "6px",
    fontSize: "24px",
    fontWeight: "700",
  },
  subText: {
    color: "#555",
    lineHeight: "1.6",
    fontSize: "14px",
  },
  headerBadges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  alertBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "8px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
    textDecoration: "none",
    border: "1px solid #fca5a5",
  },
  warningBadge: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "8px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
    textDecoration: "none",
    border: "1px solid #fcd34d",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "60px 20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  loadingText: {
    color: "#37424a",
    fontWeight: "bold",
    fontSize: "15px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "10px",
  },
  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sectionIcon: {
    fontSize: "24px",
  },
  sectionTitle: {
    color: "#1f2f6b",
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
  },
  sectionSub: {
    color: "#6b7280",
    fontSize: "13px",
    margin: "2px 0 0 0",
  },
  sectionLink: {
    color: "#1f2f6b",
    fontWeight: "600",
    fontSize: "13px",
    textDecoration: "none",
    padding: "6px 14px",
    backgroundColor: "#eff6ff",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px 22px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #1f2f6b",
  },
  statNumber: {
    fontSize: "32px",
    color: "#1f2f6b",
    fontWeight: "bold",
    marginBottom: "6px",
    lineHeight: "1",
  },
  statLabel: {
    color: "#555",
    fontWeight: "600",
    fontSize: "13px",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "22px 24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #1f2f6b",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    transition: "box-shadow 0.2s",
  },
  actionIcon: {
    fontSize: "28px",
    marginBottom: "4px",
  },
  actionLabel: {
    color: "#1f2f6b",
    fontWeight: "700",
    fontSize: "15px",
  },
  actionSub: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.5",
  },
};

export default AdminDashboard;
