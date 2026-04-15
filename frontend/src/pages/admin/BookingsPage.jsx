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

  const filteredBookings = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return bookings;
    }

    return bookings.filter((booking) => {
      const facilityName = String(booking.facility?.name || "").toLowerCase();
      const location = String(booking.facility?.location || "").toLowerCase();
      const type = String(booking.facility?.type || "").toLowerCase();
      const userName = String(booking.userName || "").toLowerCase();
      const userEmail = String(booking.userEmail || "").toLowerCase();
      const purpose = String(booking.purpose || "").toLowerCase();
      const status = String(booking.status || "").toLowerCase();

      return (
        facilityName.includes(keyword) ||
        location.includes(keyword) ||
        type.includes(keyword) ||
        userName.includes(keyword) ||
        userEmail.includes(keyword) ||
        purpose.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }, [bookings, searchText]);

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
      cancelled: bookings.filter(
        (b) => String(b.status).toUpperCase() === "CANCELLED"
      ).length,
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
      return { backgroundColor: "#e5e7eb", color: "#374151" };
    }

    return { backgroundColor: "#fef3c7", color: "#92400e" };
  };

  return (
    <div>
      <Toast message={message} type={messageType} onClose={clearMessage} />

      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Booking Management</h2>
          <p style={styles.subText}>
            Review pending booking requests, filter records, and manage approved
            bookings.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Bookings</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #f59e0b" }}>
          <div style={styles.statNumber}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #16a34a" }}>
          <div style={styles.statNumber}>{stats.approved}</div>
          <div style={styles.statLabel}>Approved</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #dc2626" }}>
          <div style={styles.statNumber}>{stats.rejected}</div>
          <div style={styles.statLabel}>Rejected</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "5px solid #64748b" }}>
          <div style={styles.statNumber}>{stats.cancelled}</div>
          <div style={styles.statLabel}>Cancelled</div>
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
        <div style={styles.loaderWrapper}>
          <p style={styles.loadingText}>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📅</div>
          <h3 style={styles.emptyTitle}>No bookings found</h3>
          <p style={styles.emptyText}>
            Try adjusting the filters to see more results.
          </p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.cardTitle}>
                  {booking.facility?.name || "Facility"}
                </h3>
                <span
                  style={{
                    ...styles.badge,
                    ...getStatusStyle(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </div>

              <div style={styles.infoRow}>
                <strong>Requester:</strong> {booking.userName}
              </div>
              <div style={styles.infoRow}>
                <strong>Email:</strong> {booking.userEmail}
              </div>
              <div style={styles.infoRow}>
                <strong>Location:</strong>{" "}
                {booking.facility?.location || "N/A"}
              </div>
              <div style={styles.infoRow}>
                <strong>Date:</strong> {booking.bookingDate}
              </div>
              <div style={styles.infoRow}>
                <strong>Time:</strong> {booking.startTime} - {booking.endTime}
              </div>
              <div style={styles.infoRow}>
                <strong>Expected Attendees:</strong>{" "}
                {booking.expectedAttendees}
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
                <strong>Type:</strong> {detailsBooking.facility?.type || "N/A"}
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
    flex: 1,
    minWidth: "240px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  input: {
    minWidth: "180px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "190px",
    outline: "none",
    backgroundColor: "#fff",
  },
  resetButton: {
    backgroundColor: "#37424a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
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
    borderLeft: "5px solid #f4b400",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  cardTitle: {
    color: "#1f2f6b",
    fontSize: "24px",
    margin: 0,
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  infoRow: {
    marginBottom: "10px",
    color: "#333",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  reasonBox: {
    marginTop: "10px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#334155",
    lineHeight: "1.6",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },
  viewButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  approveButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#475569",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
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
    maxWidth: "480px",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  detailsModalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "720px",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    color: "#1f2f6b",
    marginBottom: "12px",
  },
  modalText: {
    color: "#444",
    marginBottom: "18px",
    lineHeight: "1.6",
  },
  label: {
    display: "block",
    color: "#37424a",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
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
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalApproveButton: {
    backgroundColor: "#16a34a",
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
  },
  detailsPurposeBox: {
    marginTop: "18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  detailsReasonBox: {
    marginTop: "14px",
    backgroundColor: "#fff7ed",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  detailsParagraph: {
    marginTop: "8px",
    color: "#334155",
    lineHeight: "1.7",
  },
};

export default BookingsPage;