import { useEffect, useState } from "react";
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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("APPROVED");
  const [reviewReason, setReviewReason] = useState("");

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
      setFacilities(response.data);
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
      setBookings(response.data);
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
        `Booking ${reviewStatus === "APPROVED" ? "approved" : "rejected"} successfully.`,
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

        <div style={styles.headerStats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{bookings.length}</div>
            <div style={styles.statLabel}>Visible Bookings</div>
          </div>
        </div>
      </div>

      <div style={styles.filterBar}>
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
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📅</div>
          <h3 style={styles.emptyTitle}>No bookings found</h3>
          <p style={styles.emptyText}>
            Try adjusting the filters to see more results.
          </p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {bookings.map((booking) => (
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
                <strong>Type:</strong> {booking.facility?.type || "N/A"}
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
              <div style={styles.infoRow}>
                <strong>Purpose:</strong> {booking.purpose}
              </div>

              {booking.adminReason && (
                <div style={styles.reasonBox}>
                  <strong>Admin Note:</strong> {booking.adminReason}
                </div>
              )}

              <div style={styles.actionRow}>
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
                    Cancel Booking
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
  headerStats: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "18px 22px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #f4b400",
    minWidth: "180px",
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "50px 20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  spinner: {
    width: "42px",
    height: "42px",
    border: "5px solid #e5e7eb",
    borderTop: "5px solid #1f2f6b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "14px",
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
    transition: "all 0.2s ease",
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
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "480px",
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
};

export default BookingsPage;