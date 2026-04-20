import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/common/Toast";
import { getAllFacilities } from "../../api/facilityApi";
import {
  getAllBookings,
  reviewBooking,
  cancelBooking,
} from "../../api/bookingApi";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [repeatFilter, setRepeatFilter] = useState("ALL");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("APPROVED");
  const [reviewReason, setReviewReason] = useState("");

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("success");
  };

  const loadFacilities = async () => {
    try {
      const response = await getAllFacilities();
      setFacilities(response.data || []);
    } catch (error) {
      console.error("Error loading facilities:", error);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);

      const params = {};

      if (statusFilter.trim()) {
        params.status = statusFilter;
      }

      if (facilityFilter) {
        params.facilityId = facilityFilter;
      }

      if (dateFilter) {
        params.bookingDate = dateFilter;
      }

      const response = await getAllBookings(params);
      const data = Array.isArray(response.data) ? response.data : [];

      const sorted = [...data].sort((a, b) => {
        const statusOrder = {
          PENDING: 1,
          APPROVED: 2,
          REJECTED: 3,
          CANCELLED: 4,
        };

        const statusA = statusOrder[String(a.status || "").toUpperCase()] || 99;
        const statusB = statusOrder[String(b.status || "").toUpperCase()] || 99;

        if (statusA !== statusB) {
          return statusA - statusB;
        }

        return (b.id || 0) - (a.id || 0);
      });

      setBookings(sorted);
    } catch (error) {
      console.error("Error loading bookings:", error);
      showMessage("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [statusFilter, facilityFilter, dateFilter]);

  const isRepeatBooking = (booking) => {
    return (
      String(booking?.recurrenceType || "NONE").toUpperCase() !== "NONE" &&
      Number(booking?.totalOccurrences || 1) > 1
    );
  };

  const getRepeatText = (booking) => {
    const type = String(booking?.recurrenceType || "NONE").toUpperCase();

    if (type === "NONE" || Number(booking?.totalOccurrences || 1) <= 1) {
      return "Single booking";
    }

    return `${type === "WEEKLY" ? "Weekly repeat" : "Monthly repeat"} • Booking ${
      booking.occurrenceNumber || 1
    } of ${booking.totalOccurrences || 1}`;
  };

  const filteredBookings = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const facilityName = String(booking.facility?.name || "").toLowerCase();
      const location = String(booking.facility?.location || "").toLowerCase();
      const type = String(booking.facility?.type || "").toLowerCase();
      const userName = String(booking.userName || "").toLowerCase();
      const userEmail = String(booking.userEmail || "").toLowerCase();
      const purpose = String(booking.purpose || "").toLowerCase();
      const status = String(booking.status || "").toLowerCase();

      const matchesSearch =
        !keyword ||
        facilityName.includes(keyword) ||
        location.includes(keyword) ||
        type.includes(keyword) ||
        userName.includes(keyword) ||
        userEmail.includes(keyword) ||
        purpose.includes(keyword) ||
        status.includes(keyword);

      const isRepeat = isRepeatBooking(booking);

      const matchesRepeat =
        repeatFilter === "ALL" ||
        (repeatFilter === "REPEAT" && isRepeat) ||
        (repeatFilter === "SINGLE" && !isRepeat);

      return matchesSearch && matchesRepeat;
    });
  }, [bookings, searchText, repeatFilter]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(
        (b) => String(b.status).toUpperCase() === "PENDING"
      ).length,
      approved: bookings.filter(
        (b) => String(b.status).toUpperCase() === "APPROVED"
      ).length,
      rejected: bookings.filter(
        (b) => String(b.status).toUpperCase() === "REJECTED"
      ).length,
      repeat: bookings.filter((b) => isRepeatBooking(b)).length,
    };
  }, [bookings]);

  const openReviewModal = (booking, status) => {
    setSelectedBooking(booking);
    setReviewStatus(status);
    setReviewReason("");
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedBooking(null);
    setReviewStatus("APPROVED");
    setReviewReason("");
    setReviewModalOpen(false);
  };

  const openDetailsModal = (booking) => {
    setDetailsBooking(booking);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsBooking(null);
    setDetailsModalOpen(false);
  };

  const handleReviewSubmit = async () => {
    if (!selectedBooking) return;

    if (reviewStatus === "REJECTED" && !reviewReason.trim()) {
      showMessage("Please enter a reason for rejection.", "error");
      return;
    }

    try {
      await reviewBooking(selectedBooking.id, {
        status: reviewStatus,
        reason: reviewReason.trim(),
      });

      showMessage(
        `Booking ${
          reviewStatus === "APPROVED" ? "approved" : "rejected"
        } successfully.`,
        "success"
      );

      closeReviewModal();
      await loadBookings();
    } catch (error) {
      console.error("Error reviewing booking:", error);
      const backendMessage =
        error?.response?.data?.message || "Failed to review booking.";
      showMessage(backendMessage, "error");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this approved booking?"
    );

    if (!confirmed) return;

    try {
      await cancelBooking(bookingId);
      showMessage("Booking cancelled successfully.", "success");
      await loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const backendMessage =
        error?.response?.data?.message || "Failed to cancel booking.";
      showMessage(backendMessage, "error");
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setFacilityFilter("");
    setDateFilter("");
    setSearchText("");
    setRepeatFilter("ALL");
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "APPROVED") {
      return { backgroundColor: "#dcfce7", color: "#166534" };
    }

    if (value === "REJECTED") {
      return { backgroundColor: "#fee2e2", color: "#991b1b" };
    }

    if (value === "CANCELLED") {
      return { backgroundColor: "#e2e8f0", color: "#334155" };
    }

    return { backgroundColor: "#fef3c7", color: "#92400e" };
  };

  return (
    <div>
      <Toast message={message} type={messageType} onClose={clearMessage} />

      <div style={styles.headerCard}>
        <div style={styles.headerTag}>Smart Campus Operations Hub</div>
        <h2 style={styles.heading}>Admin Booking Management</h2>
        <p style={styles.subText}>
          Review requests, manage repeat bookings, and control the full booking
          process.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Bookings</span>
          <span style={styles.statNumber}>{stats.total}</span>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #f4b400" }}>
          <span style={styles.statLabel}>Pending</span>
          <span style={styles.statNumber}>{stats.pending}</span>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #16a34a" }}>
          <span style={styles.statLabel}>Approved</span>
          <span style={styles.statNumber}>{stats.approved}</span>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #dc2626" }}>
          <span style={styles.statLabel}>Rejected</span>
          <span style={styles.statNumber}>{stats.rejected}</span>
        </div>
        <div style={{ ...styles.statCard, borderTop: "4px solid #1e3a8a" }}>
          <span style={styles.statLabel}>Repeat Bookings</span>
          <span style={styles.statNumber}>{stats.repeat}</span>
        </div>
      </div>

      <div style={styles.filterBar}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.searchInput}
          placeholder="Search by facility, requester, email, purpose..."
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Facilities</option>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </select>

        <select
          value={repeatFilter}
          onChange={(e) => setRepeatFilter(e.target.value)}
          style={styles.select}
        >
          <option value="ALL">All Bookings</option>
          <option value="REPEAT">Repeat Bookings</option>
          <option value="SINGLE">Single Bookings</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={styles.input}
        />

        <button
          type="button"
          onClick={handleResetFilters}
          style={styles.resetButton}
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div style={styles.placeholderBox}>Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📅</div>
          <h3 style={styles.emptyTitle}>No bookings found</h3>
          <p style={styles.emptyText}>
            Try changing the filters to view more results.
          </p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.cardTitle}>
                    {booking.facility?.name || "Facility"}
                  </h3>
                  <p style={styles.cardSubTitle}>
                    {booking.facility?.location || "N/A"}
                  </p>
                </div>

                <span
                  style={{
                    ...styles.badge,
                    ...getStatusStyle(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </div>

              <div
                style={
                  isRepeatBooking(booking)
                    ? styles.repeatTag
                    : styles.singleTag
                }
              >
                {getRepeatText(booking)}
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Requester</span>
                  <strong>{booking.userName}</strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Email</span>
                  <strong>{booking.userEmail}</strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Date</span>
                  <strong>{booking.bookingDate}</strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Time</span>
                  <strong>
                    {booking.startTime} - {booking.endTime}
                  </strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Type</span>
                  <strong>{booking.facility?.type || "N/A"}</strong>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoLabel}>Attendees</span>
                  <strong>{booking.expectedAttendees}</strong>
                </div>
              </div>

              <div style={styles.purposeBox}>
                <span style={styles.infoLabel}>Purpose</span>
                <p style={styles.purposeText}>{booking.purpose}</p>
              </div>

              {booking.adminReason && (
                <div style={styles.reasonBox}>
                  <strong>Admin Note:</strong> {booking.adminReason}
                </div>
              )}

              <div style={styles.actionRow}>
                <button
                  type="button"
                  onClick={() => openDetailsModal(booking)}
                  style={styles.viewButton}
                >
                  View Details
                </button>

                {String(booking.status).toUpperCase() === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={() => openReviewModal(booking, "APPROVED")}
                      style={styles.approveButton}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => openReviewModal(booking, "REJECTED")}
                      style={styles.rejectButton}
                    >
                      Reject
                    </button>
                  </>
                )}

                {String(booking.status).toUpperCase() === "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(booking.id)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewModalOpen && selectedBooking && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>
              {reviewStatus === "APPROVED" ? "Approve Booking" : "Reject Booking"}
            </h3>

            <p style={styles.modalText}>
              You are about to{" "}
              {reviewStatus === "APPROVED" ? "approve" : "reject"} the booking
              request for <strong>{selectedBooking.facility?.name}</strong>.
            </p>

            <div
              style={
                isRepeatBooking(selectedBooking)
                  ? styles.repeatModalTag
                  : styles.singleModalTag
              }
            >
              {getRepeatText(selectedBooking)}
            </div>

            <label style={styles.label}>Reason / Note</label>
            <textarea
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              rows="4"
              style={styles.textarea}
              placeholder={
                reviewStatus === "REJECTED"
                  ? "Enter rejection reason"
                  : "Optional approval note"
              }
            />

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={closeReviewModal}
                style={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                style={
                  reviewStatus === "APPROVED"
                    ? styles.modalApproveButton
                    : styles.modalRejectButton
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {detailsModalOpen && detailsBooking && (
        <div style={styles.modalOverlay}>
          <div style={styles.detailsModalBox}>
            <h3 style={styles.modalTitle}>Booking Details</h3>

            <div
              style={
                isRepeatBooking(detailsBooking)
                  ? styles.repeatModalTag
                  : styles.singleModalTag
              }
            >
              {getRepeatText(detailsBooking)}
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <strong>Booking ID:</strong> {detailsBooking.id}
              </div>
              <div style={styles.detailItem}>
                <strong>Status:</strong> {detailsBooking.status}
              </div>
              <div style={styles.detailItem}>
                <strong>Requester:</strong> {detailsBooking.userName}
              </div>
              <div style={styles.detailItem}>
                <strong>Email:</strong> {detailsBooking.userEmail}
              </div>
              <div style={styles.detailItem}>
                <strong>Facility:</strong>{" "}
                {detailsBooking.facility?.name || "N/A"}
              </div>
              <div style={styles.detailItem}>
                <strong>Location:</strong>{" "}
                {detailsBooking.facility?.location || "N/A"}
              </div>
              <div style={styles.detailItem}>
                <strong>Type:</strong>{" "}
                {detailsBooking.facility?.type || "N/A"}
              </div>
              <div style={styles.detailItem}>
                <strong>Capacity:</strong>{" "}
                {detailsBooking.facility?.capacity || "N/A"}
              </div>
              <div style={styles.detailItem}>
                <strong>Date:</strong> {detailsBooking.bookingDate}
              </div>
              <div style={styles.detailItem}>
                <strong>Time:</strong> {detailsBooking.startTime} -{" "}
                {detailsBooking.endTime}
              </div>
              <div style={styles.detailItem}>
                <strong>Expected Attendees:</strong>{" "}
                {detailsBooking.expectedAttendees}
              </div>
            </div>

            <div style={styles.detailsPurposeBox}>
              <strong>Purpose:</strong>
              <p style={styles.detailsParagraph}>{detailsBooking.purpose}</p>
            </div>

            {detailsBooking.adminReason && (
              <div style={styles.detailsReasonBox}>
                <strong>Admin Note:</strong>
                <p style={styles.detailsParagraph}>{detailsBooking.adminReason}</p>
              </div>
            )}

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={closeDetailsModal}
                style={styles.modalCancelButton}
              >
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
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "24px 26px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
    marginBottom: "24px",
  },
  headerTag: {
    display: "inline-block",
    backgroundColor: "#f8fafc",
    color: "#1e3a8a",
    border: "1px solid #dbeafe",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  heading: {
    color: "#1e293b",
    marginBottom: "8px",
  },
  subText: {
    color: "#64748b",
    lineHeight: "1.7",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: "18px 20px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    borderTop: "4px solid #64748b",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statLabel: {
    color: "#64748b",
    fontWeight: "700",
    fontSize: "13px",
  },
  statNumber: {
    color: "#1e3a8a",
    fontWeight: "800",
    fontSize: "28px",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },
  searchInput: {
    flex: 1,
    minWidth: "240px",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  input: {
    minWidth: "180px",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  select: {
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    minWidth: "190px",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  resetButton: {
    backgroundColor: "#334155",
    color: "#fff",
    border: "none",
    padding: "13px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
  },
  placeholderBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "48px 20px",
    borderRadius: "18px",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "18px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  emptyTitle: {
    color: "#1e293b",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#64748b",
    margin: 0,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "18px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  cardTitle: {
    color: "#1e293b",
    fontSize: "22px",
    margin: 0,
  },
  cardSubTitle: {
    color: "#64748b",
    margin: "5px 0 0",
    fontSize: "14px",
  },
  badge: {
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  repeatTag: {
    display: "inline-block",
    marginBottom: "14px",
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  singleTag: {
    display: "inline-block",
    marginBottom: "14px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "14px",
  },
  infoCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  purposeBox: {
    backgroundColor: "#fffdf5",
    border: "1px solid #fef3c7",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "14px",
  },
  purposeText: {
    margin: "8px 0 0",
    color: "#475569",
    lineHeight: "1.7",
  },
  reasonBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "13px 14px",
    color: "#334155",
    lineHeight: "1.7",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  viewButton: {
    backgroundColor: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "11px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  approveButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "11px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  rejectButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "11px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#334155",
    color: "#fff",
    border: "none",
    padding: "11px 15px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
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
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },
  detailsModalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "760px",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },
  modalTitle: {
    color: "#1e293b",
    marginBottom: "12px",
  },
  modalText: {
    color: "#475569",
    marginBottom: "16px",
    lineHeight: "1.7",
  },
  repeatModalTag: {
    display: "inline-block",
    marginBottom: "16px",
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  singleModalTag: {
    display: "inline-block",
    marginBottom: "16px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  label: {
    display: "block",
    color: "#334155",
    fontWeight: "700",
    marginBottom: "8px",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
    marginBottom: "18px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px",
  },
  modalCancelButton: {
    backgroundColor: "#e2e8f0",
    color: "#111827",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  modalApproveButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  modalRejectButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "10px",
  },
  detailItem: {
    backgroundColor: "#f8fafc",
    borderRadius: "14px",
    padding: "12px 14px",
    color: "#334155",
    lineHeight: "1.6",
    border: "1px solid #e2e8f0",
  },
  detailsPurposeBox: {
    marginTop: "18px",
    backgroundColor: "#fffdf5",
    borderRadius: "14px",
    padding: "14px 16px",
    border: "1px solid #fef3c7",
  },
  detailsReasonBox: {
    marginTop: "14px",
    backgroundColor: "#f8fafc",
    borderRadius: "14px",
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
  },
  detailsParagraph: {
    marginTop: "8px",
    color: "#475569",
    lineHeight: "1.7",
  },
};

export default BookingsPage;