import { useState, useEffect, useCallback } from "react";
import { getAllTickets, getTicketStats, updateTicket, deleteTicket } from "../../api/ticketApi";
import { getAllFacilities } from "../../api/facilityApi";
import Toast from "../../components/common/Toast";

const CATEGORY_ICONS = {
  ELECTRICAL: "⚡",
  PLUMBING: "🚿",
  HVAC: "❄️",
  EQUIPMENT: "🔧",
  CLEANLINESS: "🧹",
  SECURITY: "🔒",
  OTHER: "📋",
};

const PRIORITY_COLORS = {
  LOW: { bg: "#dcfce7", color: "#166534" },
  MEDIUM: { bg: "#fef3c7", color: "#92400e" },
  HIGH: { bg: "#ffedd5", color: "#9a3412" },
  CRITICAL: { bg: "#fee2e2", color: "#991b1b" },
};

const STATUS_COLORS = {
  OPEN: { bg: "#dbeafe", color: "#1e40af" },
  IN_PROGRESS: { bg: "#fef9c3", color: "#854d0e" },
  RESOLVED: { bg: "#dcfce7", color: "#166534" },
  CLOSED: { bg: "#e5e7eb", color: "#374151" },
};

const STATUS_FLOW = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFacility, setFilterFacility] = useState("");

  const [updateModal, setUpdateModal] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: "", assignedTo: "", resolutionNote: "" });
  const [updating, setUpdating] = useState(false);

  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [detailModal, setDetailModal] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;
      if (filterCategory) filters.category = filterCategory;
      if (filterFacility) filters.facilityId = filterFacility;

      const [ticketsRes, statsRes, facilitiesRes] = await Promise.all([
        getAllTickets(filters),
        getTicketStats(),
        getAllFacilities(),
      ]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
      setFacilities(facilitiesRes.data);
    } catch {
      setToast({ type: "error", message: "Failed to load tickets." });
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, filterCategory, filterFacility]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.reporterName?.toLowerCase().includes(q) ||
      t.reporterEmail?.toLowerCase().includes(q) ||
      t.facility?.name?.toLowerCase().includes(q) ||
      String(t.id).includes(q);
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchPriority = !filterPriority || t.priority === filterPriority;
    const matchCategory = !filterCategory || t.category === filterCategory;
    const matchFacility = !filterFacility || String(t.facility?.id) === filterFacility;
    return matchSearch && matchStatus && matchPriority && matchCategory && matchFacility;
  });

  const openUpdateModal = (ticket) => {
    setUpdateForm({
      status: ticket.status,
      assignedTo: ticket.assignedTo || "",
      resolutionNote: ticket.resolutionNote || "",
    });
    setUpdateModal(ticket);
  };

  const handleUpdate = async () => {
    if (!updateForm.status) return;
    const needsNote = updateForm.status === "RESOLVED" || updateForm.status === "CLOSED";
    if (needsNote && !updateForm.resolutionNote.trim()) {
      setToast({ type: "error", message: "Resolution note is required when resolving or closing." });
      return;
    }
    setUpdating(true);
    try {
      await updateTicket(updateModal.id, updateForm);
      setToast({ type: "success", message: "Ticket updated successfully!" });
      setUpdateModal(null);
      loadData();
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to update ticket." });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTicket(deleteModal.id);
      setToast({ type: "success", message: "Ticket deleted." });
      setDeleteModal(null);
      loadData();
    } catch {
      setToast({ type: "error", message: "Failed to delete ticket." });
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterPriority("");
    setFilterCategory("");
    setFilterFacility("");
  };

  const daysSince = (dateStr) => {
    const created = new Date(dateStr);
    const now = new Date();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div style={styles.loaderWrapper}>
        <p style={styles.loadingText}>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Ticket Management</h2>
          <p style={styles.subText}>
            Review, update, and manage all maintenance and incident tickets submitted on campus.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Tickets</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #f59e0b" }}>
          <div style={styles.statNumber}>{stats.open}</div>
          <div style={styles.statLabel}>Open</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #3b82f6" }}>
          <div style={styles.statNumber}>{stats.inProgress}</div>
          <div style={styles.statLabel}>In Progress</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #16a34a" }}>
          <div style={styles.statNumber}>{stats.resolved}</div>
          <div style={styles.statLabel}>Resolved</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #64748b" }}>
          <div style={styles.statNumber}>{stats.closed}</div>
          <div style={styles.statLabel}>Closed</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search by title, reporter, facility, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_FLOW.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <select style={styles.select} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select style={styles.select} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {Object.keys(CATEGORY_ICONS).map((c) => (
            <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
          ))}
        </select>
        <select style={styles.select} value={filterFacility} onChange={(e) => setFilterFacility(e.target.value)}>
          <option value="">All Facilities</option>
          {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <button type="button" onClick={handleResetFilters} style={styles.resetButton}>
          Reset
        </button>
      </div>

      <p style={styles.resultsInfo}>Showing {filtered.length} of {tickets.length} tickets</p>

      {filtered.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>🎫</div>
          <h3 style={styles.emptyTitle}>No tickets found</h3>
          <p style={styles.emptyText}>Try adjusting the filters to see more results.</p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {filtered.map((ticket) => {
            const priorityStyle = PRIORITY_COLORS[ticket.priority] || {};
            const statusStyle = STATUS_COLORS[ticket.status] || {};
            const isCritical = ticket.priority === "CRITICAL";
            const isOpen = ticket.status === "OPEN" || ticket.status === "IN_PROGRESS";
            const borderColor =
              ticket.priority === "CRITICAL" ? "#dc2626" :
              ticket.priority === "HIGH" ? "#f97316" :
              ticket.priority === "MEDIUM" ? "#f59e0b" : "#16a34a";

            return (
              <div key={ticket.id} style={{ ...styles.card, borderLeft: `5px solid ${borderColor}` }}>
                <div style={styles.cardTop}>
                  <div style={styles.cardTitleRow}>
                    <span style={styles.categoryIcon}>{CATEGORY_ICONS[ticket.category] || "📋"}</span>
                    <div>
                      <h3 style={styles.cardTitle}>{ticket.title}</h3>
                      <p style={styles.cardMeta}>#{ticket.id} · {ticket.facility?.name} — {ticket.facility?.location}</p>
                    </div>
                  </div>
                  <div style={styles.badgeGroup}>
                    <span style={{ ...styles.badge, backgroundColor: priorityStyle.bg, color: priorityStyle.color }}>
                      {isCritical ? "🔴 " : ""}{ticket.priority}
                    </span>
                    <span style={{ ...styles.badge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <p style={styles.cardDesc}>
                  {ticket.description.slice(0, 110)}{ticket.description.length > 110 ? "..." : ""}
                </p>

                <div style={styles.infoRow}>
                  <span><strong>Reporter:</strong> {ticket.reporterName}</span>
                  <span><strong>Email:</strong> {ticket.reporterEmail}</span>
                </div>

                {ticket.assignedTo && (
                  <div style={styles.assignedBadge}>
                    Assigned to: {ticket.assignedTo}
                  </div>
                )}

                {isOpen && (
                  <div style={styles.ageBadge}>
                    Open for {daysSince(ticket.createdAt)} day{daysSince(ticket.createdAt) !== 1 ? "s" : ""}
                  </div>
                )}

                {/* Status progress */}
                <div style={styles.progressBar}>
                  {STATUS_FLOW.map((s, i) => {
                    const currentIdx = STATUS_FLOW.indexOf(ticket.status);
                    const isActive = i <= currentIdx;
                    return (
                      <div key={s} style={styles.progressStep}>
                        <div style={{ ...styles.progressDot, backgroundColor: isActive ? "#1f2f6b" : "#d1d5db" }} />
                        <div style={{ ...styles.progressLabel, color: isActive ? "#1f2f6b" : "#9ca3af" }}>
                          {s.replace("_", " ")}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.actionRow}>
                  <button type="button" style={styles.viewButton} onClick={() => setDetailModal(ticket)}>
                    View Details
                  </button>
                  <button type="button" style={styles.updateButton} onClick={() => openUpdateModal(ticket)}>
                    Update
                  </button>
                  <button type="button" style={styles.deleteButton} onClick={() => setDeleteModal(ticket)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Update Modal */}
      {updateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Update Ticket #{updateModal.id}</h3>
            <p style={styles.modalText}>{updateModal.title}</p>

            <label style={styles.label}>Status *</label>
            <select
              style={styles.input}
              value={updateForm.status}
              onChange={(e) => setUpdateForm((p) => ({ ...p, status: e.target.value }))}
            >
              {STATUS_FLOW.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>

            <label style={styles.label}>Assigned To</label>
            <input
              style={styles.input}
              placeholder="Staff member name"
              value={updateForm.assignedTo}
              onChange={(e) => setUpdateForm((p) => ({ ...p, assignedTo: e.target.value }))}
            />

            <label style={styles.label}>
              Resolution Note {(updateForm.status === "RESOLVED" || updateForm.status === "CLOSED") ? "*" : ""}
            </label>
            <textarea
              style={{ ...styles.textarea }}
              placeholder="Describe what was done to resolve the issue..."
              rows={4}
              value={updateForm.resolutionNote}
              onChange={(e) => setUpdateForm((p) => ({ ...p, resolutionNote: e.target.value }))}
            />

            <div style={styles.modalActions}>
              <button style={styles.modalCancelButton} onClick={() => setUpdateModal(null)} disabled={updating}>
                Cancel
              </button>
              <button style={styles.modalApproveButton} onClick={handleUpdate} disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalBox, maxWidth: "460px" }}>
            <h3 style={{ ...styles.modalTitle, color: "#991b1b" }}>Delete Ticket</h3>
            <p style={styles.modalText}>
              Are you sure you want to permanently delete ticket <strong>#{deleteModal.id}</strong>?
              <br /><em>"{deleteModal.title}"</em>
            </p>
            <div style={styles.modalActions}>
              <button style={styles.modalCancelButton} onClick={() => setDeleteModal(null)} disabled={deleting}>
                Cancel
              </button>
              <button style={styles.modalRejectButton} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.detailsModalBox }}>
            <h3 style={styles.modalTitle}>Ticket #{detailModal.id} Details</h3>

            <div style={styles.detailsGrid}>
              {[
                ["Facility", `${detailModal.facility?.name} — ${detailModal.facility?.location}`],
                ["Reporter", `${detailModal.reporterName} (${detailModal.reporterEmail})`],
                ["Category", `${CATEGORY_ICONS[detailModal.category]} ${detailModal.category}`],
                ["Priority", detailModal.priority],
                ["Status", detailModal.status.replace("_", " ")],
                ["Assigned To", detailModal.assignedTo || "—"],
                ["Submitted", new Date(detailModal.createdAt).toLocaleString()],
                ["Last Updated", new Date(detailModal.updatedAt).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} style={styles.detailItem}>
                  <strong>{label}:</strong> {value}
                </div>
              ))}
            </div>

            <div style={styles.detailsPurposeBox}>
              <strong>Title:</strong>
              <p style={styles.detailsParagraph}>{detailModal.title}</p>
            </div>

            <div style={styles.detailsPurposeBox}>
              <strong>Description:</strong>
              <p style={styles.detailsParagraph}>{detailModal.description}</p>
            </div>

            {detailModal.resolutionNote && (
              <div style={styles.detailsReasonBox}>
                <strong>Resolution Note:</strong>
                <p style={styles.detailsParagraph}>{detailModal.resolutionNote}</p>
              </div>
            )}

            <div style={styles.modalActions}>
              <button style={styles.modalCancelButton} onClick={() => setDetailModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "20px",
    flexWrap: "wrap",
  },
  heading: {
    color: "#1f2f6b",
    marginBottom: "6px",
  },
  subText: {
    color: "#555",
    lineHeight: "1.6",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "18px 22px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #1f2f6b",
  },
  statNumber: {
    fontSize: "30px",
    color: "#1f2f6b",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  statLabel: {
    color: "#555",
    fontWeight: "600",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  searchInput: {
    flex: 2,
    minWidth: "240px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },
  select: {
    flex: 1,
    minWidth: "160px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#fff",
    fontSize: "14px",
  },
  resetButton: {
    backgroundColor: "#37424a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  resultsInfo: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "50px 20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  loadingText: {
    color: "#37424a",
    fontWeight: "bold",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  emptyTitle: {
    color: "#1f2f6b",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#555",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    flexWrap: "wrap",
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flex: 1,
  },
  categoryIcon: {
    fontSize: "26px",
    lineHeight: "1.3",
  },
  cardTitle: {
    color: "#1f2f6b",
    fontSize: "16px",
    margin: 0,
    fontWeight: "600",
  },
  cardMeta: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  badgeGroup: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    margin: 0,
  },
  infoRow: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    color: "#333",
    flexWrap: "wrap",
    lineHeight: "1.6",
  },
  assignedBadge: {
    fontSize: "13px",
    color: "#1f2f6b",
    backgroundColor: "#eff6ff",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "600",
  },
  ageBadge: {
    fontSize: "13px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: "6px 12px",
    borderRadius: "8px",
  },
  progressBar: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  progressStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginBottom: "4px",
  },
  progressLabel: {
    fontSize: "9px",
    fontWeight: "600",
    textAlign: "center",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "4px",
    flexWrap: "wrap",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "500px",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  detailsModalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "720px",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: {
    color: "#1f2f6b",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "700",
  },
  modalText: {
    color: "#444",
    marginBottom: "18px",
    lineHeight: "1.6",
    fontSize: "14px",
  },
  label: {
    display: "block",
    color: "#37424a",
    fontWeight: "bold",
    marginBottom: "6px",
    marginTop: "14px",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  modalCancelButton: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalApproveButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalRejectButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "12px",
  },
  detailItem: {
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#334155",
    lineHeight: "1.6",
    fontSize: "14px",
  },
  detailsPurposeBox: {
    marginTop: "18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    padding: "14px 16px",
    fontSize: "14px",
    color: "#334155",
  },
  detailsReasonBox: {
    marginTop: "14px",
    backgroundColor: "#f0fdf4",
    borderRadius: "10px",
    padding: "14px 16px",
    fontSize: "14px",
    color: "#334155",
  },
  detailsParagraph: {
    marginTop: "8px",
    color: "#334155",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },
};

export default TicketsPage;
